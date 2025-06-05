import os
import time
from dotenv import load_dotenv
import google.generativeai as genai
import sys

# Load environment variables
load_dotenv()

# Configuration
MODEL_NAME = "models/gemini-1.5-flash-latest"
DEFAULT_TEMPERATURE = 0.7

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

def main():
    try:
        assistant = ChatAssistant()
        
        if len(sys.argv) > 1:
            user_input = " ".join(sys.argv[1:])
            response_data = assistant.generate_response(user_input)
            
            if response_data["error"]:
                print(f"Error: {response_data['error']}")
            else:
                print(response_data["response"])
        else:
            print("Please provide input as command line arguments.")
            
    except Exception as e:
        print(f"Fatal error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()