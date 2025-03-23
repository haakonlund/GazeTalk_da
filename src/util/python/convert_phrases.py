def process_phrases(file_path):
    """
    Reads each line from the file, appends a period and a space,
    wraps the result in double quotes, and prints it followed by a comma.
    """
    with open(file_path, 'r') as file:
        lines = file.readlines()

    for line in lines:
        line = line.strip()
        if line:
            output_line = f"\"{line}. \","
            print(output_line)

def print_key_value(file_path):
    """
    Reads each line from the file and for each non-empty line,
    creates a key (the line with a period and space appended, wrapped in quotes)
    and a value (the number of characters in the original line, ignoring spaces).
    Then prints the key and value in a key-value pair format.
    """
    with open(file_path, 'r') as file:
        lines = file.readlines()
    
    for line in lines:
        original_line = line.strip()
        if original_line:
            # Create the key: append period and space, and wrap in quotes.
            key = f"\"{original_line}. \""
            # Compute value: count non-space characters.
            value = len(original_line.replace(" ", ""))
            print(f"{key}: {value},")

if __name__ == '__main__':
    process_phrases("phrases.txt")

    print_key_value("phrases.txt")
