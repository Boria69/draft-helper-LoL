# 🏆 League of Legends AI Draft Predictor & Coach

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Python](https://img.shields.io/badge/Python-14354C?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![scikit-learn](https://img.shields.io/badge/scikit--learn-%23F7931E.svg?style=for-the-badge&logo=scikit-learn&logoColor=white)

Ever wondered if your solo queue draft is doomed from the start? I built an AI to answer exactly that. 

This is a full-stack machine learning app that acts as a real-time "AI Coach." It analyzes League of Legends team compositions and calculates your exact probability of winning before the game even starts.

## ✨ What it does

* **Data Harvesting:** An automated Python script that safely harvests thousands of high-ELO Ranked matches via the Riot Games API.
* **The AI Brain:** A Random Forest model trained to calculate the math behind winning and losing based purely on champion synergies and counters.
* **Live Draft Dashboard:** A sleek React UI that updates a "Tug-of-War" win-rate bar in milliseconds as you pick champions.
* **Smart Suggestions:** The AI actively scans missing roles and suggests the mathematically best champion to round out your team.

## 🏗️ How it's built

The pipeline runs in 5 simple steps:
1. **`harvester.py`:** Scrapes Riot's API for match data and saves it to a SQLite database.
2. **`translator.py`:** Cleans the raw data and performs One-Hot Encoding for the AI.
3. **`brain.py`:** Trains the `scikit-learn` ML model and exports it as a `.pkl` file.
4. **`server.py`:** A FastAPI backend that loads the AI and answers web requests instantly.
5. **`frontend/`:** The React.js dashboard that users actually interact with.

## 🚀 Run it yourself

Want to test the AI on your machine? You'll just need a personal Riot Games Developer API Key.

### 1. Backend Setup
Clone the repo and enter the folder:
```bash
git clone https://github.com/Boria69/draft-helper-LoL.git
cd draft-helper-LoL
```

Set up your Python environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file in the main folder and add your Riot API Key:
```env
RIOT_API_KEY=your_development_api_key_here
```

Boot up the backend server:
```bash
uvicorn server:app --reload
```

### 2. Frontend Setup
Open a second terminal, enter the frontend folder, and launch React:
```bash
cd frontend
npm install
npm run dev
```

## ⚖️ Legal Disclaimer

Draft Oracle AI isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Riot Games properties. Riot Games, and all associated properties are trademarks or registered trademarks of Riot Games, Inc.
