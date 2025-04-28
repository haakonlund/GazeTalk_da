from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
from datetime import datetime
import uuid

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configuration
STORAGE_DIR = "json_data"
if not os.path.exists(STORAGE_DIR):
    os.makedirs(STORAGE_DIR)

@app.route('/save-json', methods=['POST'])
def save_json():
    try:
        # Get JSON data from request
        data = request.json
        
        # Validate the data
        if not data:
            return jsonify({"message": "No data provided"}), 400
        
        # Generate a unique filename
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        unique_id = str(uuid.uuid4())[:8]
        filename = f"{timestamp}_{unique_id}.json"
        filepath = os.path.join(STORAGE_DIR, filename)
        
        # Save the JSON data to a file
        with open(filepath, 'w') as file:
            json.dump(data, file, indent=2)
        
        # Return success response
        return jsonify({
            "message": "JSON data saved successfully",
            "filename": filename,
            "filepath": filepath
        }), 200
    
    except Exception as e:
        # Return error response
        return jsonify({
            "message": f"Error saving JSON data: {str(e)}"
        }), 500
@app.route('/save-test-data', methods=['POST']) 
def complete_test():
    pass
    try:
        # Get JSON data from request
        data = request.json
        
        # Validate the data
        if not data:
            return jsonify({"message": "No data provided"}), 400
        
        # get name inside the json data
        name = data["form_data"]["name"]
        
        # Generate a unique filename
        timestamp = datetime.now().strftime("%d%m%Y_%H%M%S")
        filename = f"{name}_{timestamp}.json"
        filepath = os.path.join(STORAGE_DIR, filename)
        
        # Save the JSON data to a file
        with open(filepath, 'w') as file:
            json.dump(data, file, indent=2)
        
        # Return success response
        return jsonify({
            "message": "JSON data saved successfully",
            "filename": filename,
            "filepath": filepath
        }), 200
    except Exception as e:
        return jsonify({
            "message": f"Error saving test data: {str(e)}"
        }), 500
@app.route('/list-json', methods=['GET'])
def list_json():
    try:
        files = os.listdir(STORAGE_DIR)
        json_files = [f for f in files if f.endswith('.json')]
        
        return jsonify({
            "files": json_files,
            "count": len(json_files)
        }), 200
    
    except Exception as e:
        return jsonify({
            "message": f"Error listing JSON files: {str(e)}"
        }), 500

@app.route('/get-json/<filename>', methods=['GET'])
def get_json(filename):
    try:
        filepath = os.path.join(STORAGE_DIR, filename)
        
        if not os.path.exists(filepath):
            return jsonify({
                "message": f"File not found: {filename}"
            }), 404
        
        with open(filepath, 'r') as file:
            data = json.load(file)
        
        return jsonify(data), 200
    
    except Exception as e:
        return jsonify({
            "message": f"Error retrieving JSON data: {str(e)}"
        }), 500

@app.route('/log', methods=['POST'])
def log():
    try:
        # Get the log data from the request body
        log_data = request.json
        if not log_data:
            return jsonify({"message": "No log data provided"}), 400

        # Print the log data to the server's console
        print("Received log:", log_data)

        # Optionally, you can do more here, such as saving the logs to a file
        
        return jsonify({"message": "Log received"}), 200

    except Exception as e:
        return jsonify({"message": f"Error logging data: {str(e)}"}), 500


if __name__ == '__main__':
    print(f"Server started. JSON files will be saved to {os.path.abspath(STORAGE_DIR)}")
    app.run(debug=True, port=5000, host="0.0.0.0") # change the ip to the same as the wifi network interface if there is problems