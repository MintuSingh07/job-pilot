import os
import configparser

def get_api_key(key_name):
    # Try to read from pyvenv.cfg where the user added it
    config_path = os.path.join(os.path.dirname(__file__), "venv/pyvenv.cfg")
    if os.path.exists(config_path):
        config = configparser.ConfigParser()
        with open(config_path, 'r') as f:
            # Add a dummy section since pyvenv.cfg doesn't have one
            config_string = '[DEFAULT]\n' + f.read()
        config.read_string(config_string)
        key = config.get('DEFAULT', key_name, fallback=None)
        if key:
            return key.strip('"').strip("'")
    
    return os.getenv(f"{key_name.upper()}_API_KEY")

GEMINI_API_KEY = get_api_key('gemini')
OPENROUTER_API_KEY = get_api_key('openrouter')
