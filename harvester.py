import os
import requests
import sqlite3
import time
import logging
from dotenv import load_dotenv

# Configure logging - outputs to both file and console
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('harvester.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

load_dotenv()
API_KEY = os.getenv("RIOT_API_KEY")
headers = {"X-Riot-Token": API_KEY}

# ==========================================
# ⚙️ HARVESTER SETTINGS 
# ==========================================
PLATFORM = "euw1"     
REGION = "europe"     

QUEUE = "RANKED_SOLO_5x5"
TIER = "PLATINUM"
DIVISION = "I"

PLAYERS_TO_SCAN = 1000       
MATCHES_PER_PLAYER = 10   

# ==========================================
# 1. Database Setup
# ==========================================
conn = sqlite3.connect('dataset.db')
cursor = conn.cursor()
cursor.execute('''
    CREATE TABLE IF NOT EXISTS matches (
        match_id TEXT PRIMARY KEY,
        blue_team TEXT,
        red_team TEXT,
        winner TEXT
    )
''')
conn.commit()

def safe_request(url):
    """A helper function to safely ask Riot for data and pause."""
    response = requests.get(url, headers=headers)
    time.sleep(1.2)
    if response.status_code == 200:
        return response.json()
    else:
        logger.warning(f"API Error {response.status_code}: {response.text}")
        return None

# ==========================================
# 2. The API Hopscotch
# ==========================================
logger.info(f"Searching for {TIER} {DIVISION} players in {PLATFORM}...")
rank_url = f"https://{PLATFORM}.api.riotgames.com/lol/league/v4/entries/{QUEUE}/{TIER}/{DIVISION}?page=7"
players = safe_request(rank_url)

total_matches = 0
match_counter = 0
saved_count = 0
skipped_count = 0

if players:
    target_players = players[:PLAYERS_TO_SCAN]
    logger.info(f"Found players! Targeting {len(target_players)} of them.")

    total_matches = len(target_players) * MATCHES_PER_PLAYER

    for player_idx, player in enumerate(target_players, 1):
        puuid = player.get('puuid')
        summoner_id = player.get('summonerId')

        if puuid:
            logger.info(f"[{player_idx}/{len(target_players)}] Processing Player PUUID: {puuid[:8]}...")
        elif summoner_id:
            logger.info(f"[{player_idx}/{len(target_players)}] Processing Player ID: {summoner_id[:8]}...")
            summoner_url = f"https://{PLATFORM}.api.riotgames.com/lol/summoner/v4/summoners/{summoner_id}"
            summoner_data = safe_request(summoner_url)
            if not summoner_data:
                continue
            puuid = summoner_data.get('puuid')
        else:
            logger.warning(f"Unrecognized player format: {player}")
            continue

        if not puuid:
            continue

        match_url = f"https://{REGION}.api.riotgames.com/lol/match/v5/matches/by-puuid/{puuid}/ids?queue=420&start=0&count={MATCHES_PER_PLAYER}"
        match_ids = safe_request(match_url)

        if not match_ids:
            continue

        for match_id in match_ids:
            match_counter += 1
            progress = (match_counter / total_matches) * 100 if total_matches > 0 else 0
            logger.info(f"[{match_counter}/{total_matches}] ({progress:.1f}%) Downloading Match: {match_id}...")

            cursor.execute("SELECT match_id FROM matches WHERE match_id = ?", (match_id,))
            if cursor.fetchone():
                logger.info("      (Already in database. Skipping!)")
                skipped_count += 1
                continue

            detail_url = f"https://{REGION}.api.riotgames.com/lol/match/v5/matches/{match_id}"
            match_data = safe_request(detail_url)

            if match_data and 'info' in match_data:
                try:
                    if match_data['info'].get('gameDuration', 0) < 180:
                        logger.info("      Skipping: Game was a remake (Under 3 mins)")
                        skipped_count += 1
                        continue

                    if (len(match_data['info'].get('teams', [])) != 2):
                        logger.info("      Skipping: Match data is missing teams")
                        skipped_count += 1
                        continue

                    blue_team_champs = []
                    red_team_champs = []

                    for participant in match_data['info']['participants']:
                        role = participant.get('teamPosition', 'UNKNOWN')
                        champ_name = f"{participant['championName']}_{role}"

                        if participant['teamId'] == 100:
                            blue_team_champs.append(champ_name)
                        else:
                            red_team_champs.append(champ_name)

                    blue_side_won = match_data['info']['teams'][0]['win']
                    winning_team = "Blue" if blue_side_won else "Red"

                    blue_team_str = ",".join(blue_team_champs)
                    red_team_str = ",".join(red_team_champs)

                    cursor.execute('''
                        INSERT OR IGNORE INTO matches (match_id, blue_team, red_team, winner)
                        VALUES (?, ?, ?, ?)
                    ''', (match_id, blue_team_str, red_team_str, winning_team))

                    logger.info(f"      Saved! {winning_team} won.")
                    saved_count += 1
                    conn.commit()

                except (IndexError, KeyError) as e:
                    logger.warning(f"      Corrupt match data on {match_id}. Skipping! Error: {e}")
                    skipped_count += 1
                    continue

conn.close()
logger.info(f"\nHarvest Complete! Saved: {saved_count}, Skipped: {skipped_count}")
logger.info("Your AI's dataset is growing.")