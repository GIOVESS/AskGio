import os
import time
from dotenv import load_dotenv
import google.generativeai as genai
from flask import Flask, request, jsonify

# Load environment variables
load_dotenv()

# Configuration
MODEL_NAME = "models/gemini-1.5-flash-latest"
DEFAULT_TEMPERATURE = 0.7

app = Flask(__name__)

class ChatAssistant:
    def __init__(self):
        """Initialize the AI client with configuration"""
        genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
        self.model = genai.GenerativeModel(MODEL_NAME)
        self.generation_config = {
            "temperature": DEFAULT_TEMPERATURE
        }
    
    @staticmethod
    def sanitize_response(response_text: str) -> str:
        """Sanitize AI response to remove unwanted formatting and trim whitespace"""
        return response_text.replace("**", "").strip()
    
    def generate_response(self, user_input: str) -> dict:
        """
        Generate AI response with performance metrics
        Returns dict with keys: response, error
        """
        result = {
            "response": None,
            "error": None
        }
        
        try:
            if not user_input.strip():
                raise ValueError("Empty input provided")
            
            response = self.model.generate_content(
                user_input,
                generation_config=self.generation_config
            )
            
            result["response"] = self.sanitize_response(response.text)
        except Exception as e:
            result["error"] = str(e)
        
        return result

# Initialize the assistant
assistant = ChatAssistant()

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        if not data or 'message' not in data:
            return jsonify({"error": "No message provided"}), 400
        
        response_data = assistant.generate_response(data['message'])
        
        if response_data["error"]:
            return jsonify({"error": response_data["error"]}), 500
        
        return jsonify({"response": response_data["response"]})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/')
def home():
    return "AskGio API is running!"

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    app.run(host='0.0.0.0', port=port)