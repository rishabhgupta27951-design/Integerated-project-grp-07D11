import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain.agents import AgentExecutor, create_tool_calling_agent
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from tools import energy_calculator, appliance_usage_estimator

print(f"DEBUG: Current CWD: {os.getcwd()}")
print(f"DEBUG: .env exists: {os.path.exists('.env')}")
load_dotenv()
print(f"DEBUG: GROQ_API_KEY present: {bool(os.getenv('GROQ_API_KEY'))}")

def get_agent_executor():
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key or api_key == "your_groq_api_key_here":
        print("CRITICAL: GROQ_API_KEY not found or using placeholder in .env")
        
    # Initialize the LLM (LLaMA 3.1 via Groq)
    llm = ChatGroq(
        temperature=0,
        model_name="llama-3.3-70b-versatile",
        groq_api_key=api_key
    )

    # Define tools
    tools = [energy_calculator, appliance_usage_estimator]

    # Define the prompt
    prompt = ChatPromptTemplate.from_messages([
        ("system", """You are a helpful and professional Energy Assistant. 
        Your goal is to help users understand their energy consumption, calculate bills, and provide energy-saving tips.
        
        Rules:
        1. If the user asks for a bill calculation, use the 'energy_calculator' tool.
        2. If the user asks about appliance consumption, use the 'appliance_usage_estimator' tool.
        3. For conceptual questions about energy or saving tips, answer directly using your knowledge.
        4. Be concise and use bullet points for suggestions.
        5. Always provide friendly and practical advice."""),
        MessagesPlaceholder(variable_name="chat_history"),
        ("human", "{input}"),
        MessagesPlaceholder(variable_name="agent_scratchpad"),
    ])

    # Create the agent
    agent = create_tool_calling_agent(llm, tools, prompt)

    # Create the executor
    agent_executor = AgentExecutor(
        agent=agent,
        tools=tools,
        verbose=True,
        handle_parsing_errors=True,
        return_intermediate_steps=True
    )
    
    return agent_executor
