import os
import time
from dotenv import load_dotenv
from openai import OpenAI
import sys

# Load environment variables
load_dotenv()

# Configuration
MODEL_NAME = "meta-llama/Meta-Llama-3-70B-Instruct"
DEFAULT_TEMPERATURE = 0.7
TIMEOUT_SECONDS = 30

class ChatAssistant:
    def __init__(self):
        """Initialize the AI client with configuration"""
        self.client = OpenAI(
            base_url="https://api.deepinfra.com/v1/openai",
            api_key=os.getenv("DEEPINFRA_API_KEY"),
            timeout=TIMEOUT_SECONDS
        )
        self.model_name = MODEL_NAME
    
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
            
            completion = self.client.chat.completions.create(
                model=self.model_name,
                messages=[{"role": "user", "content": user_input}],
                temperature=DEFAULT_TEMPERATURE
            )
            
            result["response"] = self.sanitize_response(completion.choices[0].message.content)
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