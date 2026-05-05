import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from agent import get_agent_executor
from langchain_core.messages import HumanMessage, AIMessage
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="AI Energy Assistant API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory chat history (for demo purposes)
# In a real app, use a database or session-based storage
chat_histories = {}

class ChatRequest(BaseModel):
    message: str
    session_id: str = "default"

class ChatResponse(BaseModel):
    response: str
    history: List[dict]
    steps: List[str] = []

@app.get("/")
def read_root():
    return {"message": "AI Energy Assistant API is running"}

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    try:
        session_id = request.session_id
        if session_id not in chat_histories:
            chat_histories[session_id] = []
            
        executor = get_agent_executor()
        
        # Prepare history for LangChain
        langchain_history = []
        for msg in chat_histories[session_id]:
            if msg["role"] == "user":
                langchain_history.append(HumanMessage(content=msg["content"]))
            else:
                langchain_history.append(AIMessage(content=msg["content"]))
        
        # Run agent
        result = executor.invoke({
            "input": request.message,
            "chat_history": langchain_history
        })
        
        response_text = result["output"]
        
        # Extract steps (tool calls)
        steps = []
        if "intermediate_steps" in result:
            for action, observation in result["intermediate_steps"]:
                steps.append(f"Agent called tool: {action.tool}")
        
        if not steps:
            steps.append("GenAI processed request directly")
        
        # Update history
        chat_histories[session_id].append({"role": "user", "content": request.message})
        chat_histories[session_id].append({"role": "assistant", "content": response_text})
        
        return ChatResponse(
            response=response_text,
            history=chat_histories[session_id],
            steps=steps
        )
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/calculate")
def calculate_bill(units: float):
    # Direct access to logic for the calculator panel
    from tools import energy_calculator
    return {"result": energy_calculator.invoke({"units": units})}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
