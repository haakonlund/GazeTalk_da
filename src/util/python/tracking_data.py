import json
import math
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.patches import Circle

def calculate_accuracy_precision(data, stimulus_locations):
    """
    Calculate accuracy and precision for eye tracking data.
    
    Args:
        data (dict): Eye tracking data with tracking_points
        stimulus_locations (dict): Dictionary mapping stimulus names to [x, y] coordinates
                                  (e.g., {"Center.avi": [960.0, 540.0]})
    
    Returns:
        dict: Dictionary containing accuracy and precision metrics
    """
    # Extract tracking points and screen dimensions
    tracking_points = data['tracking_points']
    screen_width = data['screen_width']
    screen_height = data['screen_height']
    
    # Initialize results dictionary
    results = {
        'participant_name': data.get('participant_name', 'Unknown'),
        'stimuli': {},
        'average': {
            'euclid_dist': 0.0,
            'duration': 0.0,
            'precision_sd_x': 0.0,
            'precision_sd_y': 0.0,
            'precision_rms_x': 0.0,
            'precision_rms_y': 0.0
        },
        'valid_stimuli_count': 0,
        'total_stimuli_count': len(stimulus_locations)
    }
    
    # Group tracking points by fixation index
    fixation_groups = {}
    if 'fixation_index' in tracking_points and len(tracking_points['fixation_index']) > 0:
        for i, fx_index in enumerate(tracking_points['fixation_index']):
            if fx_index not in fixation_groups:
                fixation_groups[fx_index] = {
                    'x': [],
                    'y': [],
                    'timestamp': [],
                    'is_shrinking': [],
                    'stimulus': None
                }
            
            fixation_groups[fx_index]['x'].append(tracking_points['x'][i])
            fixation_groups[fx_index]['y'].append(tracking_points['y'][i])
            
            if 'timestamp' in tracking_points:
                fixation_groups[fx_index]['timestamp'].append(tracking_points['timestamp'][i])
            
            if 'is_shrinking' in tracking_points:
                fixation_groups[fx_index]['is_shrinking'].append(tracking_points['is_shrinking'][i])
    
    # If no fixation indices, try to segment the data based on timestamps
    # This is a simplified approach; in practice, you might need a more sophisticated fixation detection algorithm
    if not fixation_groups and 'timestamp' in tracking_points:
        # Create artificial fixation groups based on time gaps
        timestamps = tracking_points['timestamp']
        current_group = 0
        fixation_groups[current_group] = {
            'x': [tracking_points['x'][0]],
            'y': [tracking_points['y'][0]],
            'timestamp': [timestamps[0]],
            'is_shrinking': [tracking_points.get('is_shrinking', [0])[0]],
            'stimulus': None
        }
        
        for i in range(1, len(timestamps)):
            # If time gap is too large, start a new fixation group
            if timestamps[i] - timestamps[i-1] > 100:  # 100ms threshold
                current_group += 1
                fixation_groups[current_group] = {
                    'x': [],
                    'y': [],
                    'timestamp': [],
                    'is_shrinking': [],
                    'stimulus': None
                }
            
            fixation_groups[current_group]['x'].append(tracking_points['x'][i])
            fixation_groups[current_group]['y'].append(tracking_points['y'][i])
            fixation_groups[current_group]['timestamp'].append(timestamps[i])
            
            if 'is_shrinking' in tracking_points:
                fixation_groups[current_group]['is_shrinking'].append(tracking_points['is_shrinking'][i])
    
    # Match fixation groups to stimuli based on proximity
    for group_id, group in fixation_groups.items():
        avg_x = np.mean(group['x'])
        avg_y = np.mean(group['y'])
        
        # Find closest stimulus
        min_dist = float('inf')
        closest_stim = None
        
        for stim_name, stim_loc in stimulus_locations.items():
            dist = math.sqrt((avg_x - stim_loc[0])**2 + (avg_y - stim_loc[1])**2)
            if dist < min_dist:
                min_dist = dist
                closest_stim = stim_name
        
        group['stimulus'] = closest_stim
    
    # Find the longest fixation for each stimulus
    longest_fixations = {}
    for stim_name in stimulus_locations.keys():
        longest_fixations[stim_name] = {'duration': -1, 'group_id': None}
    
    for group_id, group in fixation_groups.items():
        stim = group['stimulus']
        if stim is None:
            continue
            
        # Calculate duration
        if 'timestamp' in group and len(group['timestamp']) > 1:
            duration = max(group['timestamp']) - min(group['timestamp'])
        else:
            duration = 0
            
        if duration > longest_fixations[stim]['duration']:
            longest_fixations[stim]['duration'] = duration
            longest_fixations[stim]['group_id'] = group_id
    
    # Calculate metrics for each stimulus's longest fixation
    euclid_dist_values = []
    sd_x_values = []
    sd_y_values = []
    rms_x_values = []
    rms_y_values = []
    duration_values = []
    
    for stim_name, stim_loc in stimulus_locations.items():
        if longest_fixations[stim_name]['group_id'] is None:
            results['stimuli'][stim_name] = {
                'euclid_dist': 'N/A',
                'coordinates': ['N/A', 'N/A'],
                'duration': 'N/A',
                'precision_sd': ['N/A', 'N/A'],
                'precision_rms': ['N/A', 'N/A']
            }
            continue
            
        group_id = longest_fixations[stim_name]['group_id']
        group = fixation_groups[group_id]
        
        # Calculate euclidean distance
        avg_x = np.mean(group['x'])
        avg_y = np.mean(group['y'])
        euclid_dist = math.sqrt((avg_x - stim_loc[0])**2 + (avg_y - stim_loc[1])**2)
        
        # Calculate standard deviation (precision)
        sd_x = np.std(group['x'])
        sd_y = np.std(group['y'])
        
        # Calculate RMS (precision)
        points = list(zip(group['x'], group['y']))
        rms_x, rms_y = find_rms(points)
        
        # Calculate duration
        if 'timestamp' in group and len(group['timestamp']) > 1:
            duration = max(group['timestamp']) - min(group['timestamp'])
        else:
            duration = 0
        
        # Store results
        results['stimuli'][stim_name] = {
            'euclid_dist': round(euclid_dist, 2),
            'coordinates': [round(avg_x, 2), round(avg_y, 2)],
            'duration': round(duration, 2),
            'precision_sd': [round(sd_x, 2), round(sd_y, 2)],
            'precision_rms': [round(rms_x, 2), round(rms_y, 2)]
        }
        
        # Add to average calculation
        euclid_dist_values.append(euclid_dist)
        sd_x_values.append(sd_x)
        sd_y_values.append(sd_y)
        rms_x_values.append(rms_x)
        rms_y_values.append(rms_y)
        duration_values.append(duration)
        results['valid_stimuli_count'] += 1
    
    # Calculate averages
    if results['valid_stimuli_count'] > 0:
        results['average']['euclid_dist'] = round(np.mean(euclid_dist_values), 2)
        results['average']['duration'] = round(np.mean(duration_values), 2)
        results['average']['precision_sd_x'] = round(np.mean(sd_x_values), 2)
        results['average']['precision_sd_y'] = round(np.mean(sd_y_values), 2)
        results['average']['precision_rms_x'] = round(np.mean(rms_x_values), 2)
        results['average']['precision_rms_y'] = round(np.mean(rms_y_values), 2)
    
    # Calculate overall accuracy and precision
    # Accuracy is the average Euclidean distance (lower is better)
    results['accuracy'] = round(100 - min(100, results['average']['euclid_dist']), 2) if results['valid_stimuli_count'] > 0 else 0
    
    # Precision is the inverse of the average standard deviation (lower SD is better precision)
    avg_sd = (results['average']['precision_sd_x'] + results['average']['precision_sd_y']) / 2 if results['valid_stimuli_count'] > 0 else float('inf')
    results['precision'] = round(100 - min(100, avg_sd), 2) if results['valid_stimuli_count'] > 0 else 0
    
    return results

def find_rms(points):
    """
    Calculate Root Mean Square (RMS) for a set of points.
    This is how the original script calculated RMS.
    
    Args:
        points (list): List of (x, y) coordinates
    
    Returns:
        tuple: (RMS_X, RMS_Y)
    """
    sx = 0.0
    sy = 0.0
    
    for index in range(len(points) - 1):
        sx = sx + (points[index][0] - points[index+1][0])**2
        sy = sy + (points[index][1] - points[index+1][1])**2
    
    sx = math.sqrt(sx / len(points)) if len(points) > 0 else 0
    sy = math.sqrt(sy / len(points)) if len(points) > 0 else 0
    
    return (sx, sy)

def visualize_accuracy_precision(data, stimulus_locations, results):
    """
    Visualize eye tracking data with accuracy and precision information.
    
    Args:
        data (dict): Eye tracking data
        stimulus_locations (dict): Dictionary mapping stimulus names to [x, y] coordinates
        results (dict): Results from calculate_accuracy_precision
    """
    tracking_points = data['tracking_points']
    screen_width = data['screen_width']
    screen_height = data['screen_height']
    
    # Create plot
    fig, ax = plt.subplots(figsize=(10, 8))
    
    # Plot tracking points
    ax.scatter(tracking_points['x'], tracking_points['y'], c='blue', alpha=0.3, s=10, label='Gaze points')
    
    # Plot stimulus locations
    for stim_name, stim_loc in stimulus_locations.items():
        ax.plot(stim_loc[0], stim_loc[1], 'ro', markersize=10, label=f'Stimulus: {stim_name}' if stim_name == list(stimulus_locations.keys())[0] else "")
        ax.text(stim_loc[0], stim_loc[1]-25, stim_name, ha='center')
    
    # Plot fixation centers
    for stim_name, stim_info in results['stimuli'].items():
        if stim_info['coordinates'][0] != 'N/A':
            x, y = stim_info['coordinates']
            ax.plot(x, y, 'go', markersize=8, label=f'Fixation center' if stim_name == list(results['stimuli'].keys())[0] else "")
            
            # Draw circle representing precision (standard deviation)
            if stim_info['precision_sd'][0] != 'N/A':
                sd_x, sd_y = stim_info['precision_sd']
                radius = (sd_x + sd_y) / 2
                circle = Circle((x, y), radius, fill=False, edgecolor='green', linestyle='--', alpha=0.7)
                ax.add_patch(circle)
    
    # Set axis limits
    ax.set_xlim(0, screen_width)
    ax.set_ylim(screen_height, 0)  # Invert y-axis to match screen coordinates
    
    # Add labels and title
    ax.set_xlabel('X Position (pixels)')
    ax.set_ylabel('Y Position (pixels)')
    ax.set_title(f'Eye Tracking Analysis - Accuracy: {results["accuracy"]}%, Precision: {results["precision"]}%')
    
    # Add legend
    ax.legend()
    
    # Add text with summary statistics
    summary_text = (
        f"Accuracy: {results['accuracy']}%\n"
        f"Precision: {results['precision']}%\n"
        f"Valid stimuli: {results['valid_stimuli_count']}/{results['total_stimuli_count']}"
    )
    plt.figtext(0.02, 0.02, summary_text, fontsize=10, ha='left')
    
    plt.tight_layout()
    plt.show()

def analyze_eye_tracking(json_file=None, data=None):
    """
    Analyze eye tracking data and calculate accuracy and precision.
    
    Args:
        json_file (str, optional): Path to JSON file containing eye tracking data
        data (dict, optional): Dictionary containing eye tracking data
        
    Returns:
        dict: Dictionary containing accuracy and precision metrics
    """
    if json_file:
        with open(json_file, 'r') as f:
            data = json.load(f)
    
    # Define stimulus locations (from original script)
    stimulus_locations = {
        "TopLeft.avi": [480.0, 270.0],
        "TopRight.avi": [1440.0, 270.0],
        "Center.avi": [960.0, 540.0],
        "BottomLeft.avi": [480.0, 810.0],
        "BottomRight.avi": [1440.0, 810.0]
    }
    
    # Calculate accuracy and precision
    results = calculate_accuracy_precision(data, stimulus_locations)
    
    # Update data with calculated accuracy and precision
    data['accuracy'] = results['accuracy']
    data['precision'] = results['precision']
    
    # Visualize results
    visualize_accuracy_precision(data, stimulus_locations, results)
    
    return results

# Example usage
if __name__ == "__main__":
    # Sample data
    # data = {
    #     "start_of_test": 1647869323000,
    #     "end_of_test": 1647869423000,
    #     "tracking_points": {
    #         "x": [450, 470, 490, 485, 475, 930, 950, 970, 980, 960, 1410, 1430, 1450, 1440, 1420, 450, 470, 490, 460, 480, 1410, 1430, 1450, 1440, 1420],
    #         "y": [260, 270, 280, 275, 265, 520, 540, 560, 550, 530, 260, 270, 280, 275, 265, 790, 810, 830, 820, 800, 790, 810, 830, 820, 800],
    #         "is_shrinking": [0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0],
    #         "fixation_x": [475, 960, 1430, 470, 1430],
    #         "fixation_y": [270, 540, 270, 810, 810],
    #         "timestamp": [1647869323000, 1647869333000, 1647869343000, 1647869353000, 1647869363000, 
    #                       1647869373000, 1647869383000, 1647869393000, 1647869403000, 1647869413000,
    #                       1647869323000, 1647869333000, 1647869343000, 1647869353000, 1647869363000,
    #                       1647869373000, 1647869383000, 1647869393000, 1647869403000, 1647869413000,
    #                       1647869323000, 1647869333000, 1647869343000, 1647869353000, 1647869363000],
    #         "fixation_index": [1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5]
    #     },
    #     "screen_width": 1920,
    #     "screen_height": 1080,
    #     "points": [],
    #     "accuracy": 0,
    #     "precision": 0
    # }
    path = "src/util/python/trackingData_18_03.json"
    data = {}
    with open(path, 'r') as f:
        data = json.load(f)
    # Analyze eye tracking data
    results = analyze_eye_tracking(data=data)
    print(f"Accuracy: {results['accuracy']}%")
    print(f"Precision: {results['precision']}%")