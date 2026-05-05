# ⚡ EnergyAI: Intelligent Energy Assistant

A full-stack, AI-driven energy management assistant built with **React**, **FastAPI**, and **LangChain**. This application uses a multi-agentic approach to help users calculate electricity bills, estimate appliance consumption, and get personalized energy-saving tips.

![Project Status](https://img.shields.io/badge/Status-Active-success)
![LLM](https://img.shields.io/badge/LLM-LLaMA--3.3--70B-blue)
![Framework](https://img.shields.io/badge/Framework-FastAPI-green)
![Frontend](https://img.shields.io/badge/Frontend-React%20+%20Tailwind-blueviolet)

## ✨ Key Features
- **Smart AI Chat**: Real-time interaction using LLaMA 3.3 (via Groq) to answer energy-related queries.
- **Agentic Logic**: A LangChain-powered agent that autonomously calls custom tools for precise mathematical calculations.
- **Bill Estimator**: Accurate, slab-based electricity bill calculation logic.
- **Premium UI**: Modern dark-themed dashboard with Glassmorphism and smooth Framer Motion animations.
- **Execution Tracking**: Visual indicators showing when GenAI is used versus Agentic tool calling.

## 🚀 Tech Stack
- **Frontend**: React 18, Vite, Tailwind CSS v4, Framer Motion, Lucide Icons.
- **Backend**: FastAPI, Python 3.10+.
- **AI Core**: LangChain, Groq API (LLaMA 3.3 70B Versatile).

## 🛠️ Setup Instructions

### Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Create a `.env` file from the template:
   ```bash
   cp .env.template .env
   ```
3. Add your `GROQ_API_KEY` to the `.env` file.
4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
5. Run the server:
   ```bash
   python main.py
   ```

### Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## 🧠 How it Works
The assistant uses a **ReAct (Reason + Act)** pattern. When a user asks a question, the LLM first reasons about the intent. If a calculation is required, it calls a specialized Python tool (e.g., `EnergyCalculator`) to perform the math and then incorporates the result back into the conversation.

---
Built with ❤️ for a Greener Future.
