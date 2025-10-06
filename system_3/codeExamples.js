window.CodeExamples = {
    samples: [
        {
            id: "sample1",
            prompt: "Review this string manipulation function for correctness and edge cases",
            answer: `def reverse_words(sentence):
    words = sentence.split()
    reversed_words = []
    
    for word in words:
        reversed_words.append(word[::-1])
    
    return ' '.join(reversed_words)

# Test cases
print(reverse_words("hello world"))  # "olleh dlrow"
print(reverse_words(""))  # ""
print(reverse_words("   "))  # ""
print(reverse_words("a"))  # "a"`,
            teacherGrade: {
                "Code Style & Readability": {
                    score: 5,
                    feedback: "Excellent code organization with clear variable names and consistent formatting. Good use of list comprehension and string methods."
                },
                "Documentation": {
                    score: 3,
                    feedback: "Missing docstring explaining function purpose and return value. Test cases are helpful but could use more edge cases."
                },
                "Error Handling": {
                    score: 4,
                    feedback: "Handles empty strings and single words well. Could add type checking and None input handling."
                },
                "Code Efficiency": {
                    score: 5,
                    feedback: "Efficient implementation using built-in string methods. O(n) time complexity where n is the length of the input string."
                },
                "Functionality": {
                    score: 4,
                    feedback: "Correctly implements word reversal with proper handling of spaces. Could handle punctuation and special characters better."
                }
            }
        },
        {
            id: "sample2",
            prompt: "Review this list filtering function for correctness and efficiency",
            answer: `def filter_even_numbers(numbers):
    result = []
    
    for num in numbers:
        if num % 2 == 0:
            result.append(num)
    
    return result

# Test cases
print(filter_even_numbers([1, 2, 3, 4, 5, 6]))  # [2, 4, 6]
print(filter_even_numbers([]))  # []
print(filter_even_numbers([1, 3, 5]))  # []
print(filter_even_numbers([2, 4, 6]))  # [2, 4, 6]`,
            teacherGrade: {
                "Code Style & Readability": {
                    score: 5,
                    feedback: "Clean, straightforward implementation with descriptive variable names. Good use of list methods."
                },
                "Documentation": {
                    score: 3,
                    feedback: "Missing docstring explaining function purpose and return value. Test cases cover basic scenarios well."
                },
                "Error Handling": {
                    score: 3,
                    feedback: "Handles empty lists but lacks type checking and validation for non-integer inputs."
                },
                "Code Efficiency": {
                    score: 4,
                    feedback: "O(n) time complexity with good use of list methods. Could use list comprehension for more concise code."
                },
                "Functionality": {
                    score: 5,
                    feedback: "Correctly filters even numbers with proper handling of edge cases. Test cases demonstrate good coverage."
                }
            }
        },
        {
            id: "sample3",
            prompt: "Review this dictionary merging function for correctness and edge cases",
            answer: `def merge_dictionaries(dict1, dict2):
    result = dict1.copy()
    
    for key, value in dict2.items():
        if key in result:
            result[key] = [result[key], value]
        else:
            result[key] = value
    
    return result

# Test cases
dict1 = {'a': 1, 'b': 2}
dict2 = {'b': 3, 'c': 4}
print(merge_dictionaries(dict1, dict2))  # {'a': 1, 'b': [2, 3], 'c': 4}
print(merge_dictionaries({}, {}))  # {}
print(merge_dictionaries({'a': 1}, {'a': 1}))  # {'a': [1, 1]}`,
            teacherGrade: {
                "Code Style & Readability": {
                    score: 4,
                    feedback: "Clear implementation with good variable names. Could use more descriptive names for the dictionaries."
                },
                "Documentation": {
                    score: 2,
                    feedback: "Missing docstring explaining merge behavior and return value. Test cases could be more comprehensive."
                },
                "Error Handling": {
                    score: 3,
                    feedback: "Handles empty dictionaries but lacks type checking and validation for non-dictionary inputs."
                },
                "Code Efficiency": {
                    score: 4,
                    feedback: "O(n) time complexity with good use of dictionary methods. Could use dict.update() for simpler implementation."
                },
                "Functionality": {
                    score: 4,
                    feedback: "Correctly merges dictionaries with proper handling of duplicate keys. Could handle nested dictionaries better."
                }
            }
        },
        {
            id: "sample4",
            prompt: "Review this file reading function for error handling and efficiency",
            answer: `def read_file_lines(filename):
    lines = []
    
    with open(filename, 'r') as file:
        for line in file:
            lines.append(line.strip())
    
    return lines

# Test cases
print(read_file_lines('test.txt'))  # ['line1', 'line2', 'line3']
print(read_file_lines('nonexistent.txt'))  # FileNotFoundError`,
            teacherGrade: {
                "Code Style & Readability": {
                    score: 4,
                    feedback: "Clean implementation with good use of context manager. Could use more descriptive variable names."
                },
                "Documentation": {
                    score: 2,
                    feedback: "Missing docstring explaining function purpose, parameters, and possible exceptions. Test cases lack error handling examples."
                },
                "Error Handling": {
                    score: 2,
                    feedback: "No try-catch blocks for file operations. Missing handling for file not found, permission errors, and encoding issues."
                },
                "Code Efficiency": {
                    score: 4,
                    feedback: "Efficient line-by-line reading with good use of context manager. Could use list comprehension for more concise code."
                },
                "Functionality": {
                    score: 3,
                    feedback: "Basic file reading works but lacks proper error handling and file validation. No encoding specification."
                }
            }
        },
        {
            id: "sample5",
            prompt: "Review this date validation function for correctness and edge cases",
            answer: `def is_valid_date(date_str):
    try:
        day, month, year = map(int, date_str.split('/'))
        
        if year < 1 or month < 1 or month > 12 or day < 1:
            return False
            
        days_in_month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
        
        if year % 4 == 0 and (year % 100 != 0 or year % 400 == 0):
            days_in_month[1] = 29
            
        return day <= days_in_month[month - 1]
        
    except:
        return False

# Test cases
print(is_valid_date('29/02/2020'))  # True
print(is_valid_date('29/02/2021'))  # False
print(is_valid_date('31/04/2021'))  # False
print(is_valid_date('invalid'))  # False`,
            teacherGrade: {
                "Code Style & Readability": {
                    score: 4,
                    feedback: "Well-structured code with clear variable names. Good use of list for days in month. Could use constants for magic numbers."
                },
                "Documentation": {
                    score: 3,
                    feedback: "Missing docstring explaining date format and validation rules. Test cases cover basic scenarios well."
                },
                "Error Handling": {
                    score: 4,
                    feedback: "Good use of try-except for input parsing. Could add more specific exception handling and input validation."
                },
                "Code Efficiency": {
                    score: 5,
                    feedback: "Efficient implementation with O(1) time complexity. Good use of list for days in month."
                },
                "Functionality": {
                    score: 4,
                    feedback: "Correctly validates dates including leap years. Could handle more date formats and add range validation for years."
                }
            }
        }
    ]
}; 