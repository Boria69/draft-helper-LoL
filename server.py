from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pickle
import pandas as pd

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

print("1. Unfreezing the Lane-Aware AI Brain...")
with open("draft_model.pkl", "rb") as file:     
    model = pickle.load(file)

with open("model_columns.pkl", "rb") as file:
    model_columns = pickle.load(file)

print("✅ AI Brain successfully loaded into memory!")

class Draft(BaseModel):
    blue_team: list[str] = []
    red_team: list[str] = []
    needed_role: str = "ANY"  

@app.get("/")
def read_root():
    return {"message": "Hello! The League of Legends AI is awake and ready."}

@app.post("/predict")
def predict_draft(draft: Draft):
    match_data = {col: 0 for col in model_columns}
    
    for champ_with_role in draft.blue_team:
        if f"Blue_{champ_with_role}" in match_data: match_data[f"Blue_{champ_with_role}"] = 1
    for champ_with_role in draft.red_team:
        if f"Red_{champ_with_role}" in match_data: match_data[f"Red_{champ_with_role}"] = 1
            
    df_to_predict = pd.DataFrame([match_data])
    probabilities = model.predict_proba(df_to_predict)[0]
    
    return {
        "blue_win_probability": f"{round(probabilities[1] * 100, 2)}%",
        "red_win_probability": f"{round(probabilities[0] * 100, 2)}%"
    }

@app.post("/suggest")
def suggest_champion(draft: Draft):
    picked_base_names = set([champ.split('_')[0] for champ in draft.blue_team + draft.red_team])
    known_combos = set([col.replace("Blue_", "") for col in model_columns if col.startswith("Blue_")])
    
    target_role = draft.needed_role.upper()
    testable_champs = []
    
    for combo in known_combos:
        base_name = combo.split('_')[0]
        if base_name in picked_base_names:
            continue
        if target_role != "ANY" and not combo.endswith(f"_{target_role}"):
            continue
        testable_champs.append(combo)

    results = []
    for test_combo in testable_champs:
        match_data = {col: 0 for col in model_columns}
        for b_champ in draft.blue_team:
            if f"Blue_{b_champ}" in match_data: match_data[f"Blue_{b_champ}"] = 1
        for r_champ in draft.red_team:
            if f"Red_{r_champ}" in match_data: match_data[f"Red_{r_champ}"] = 1
            
        if f"Blue_{test_combo}" in match_data:
            match_data[f"Blue_{test_combo}"] = 1
            
        df_to_predict = pd.DataFrame([match_data])
        prob = model.predict_proba(df_to_predict)[0][1] 
        
        results.append({
            "champion": test_combo.split('_')[0],
            "win_probability": round(prob * 100, 2)
        })
        
    results.sort(key=lambda x: x["win_probability"], reverse=True)
    return {"status": "Success", "top_suggestions": results[:3]}