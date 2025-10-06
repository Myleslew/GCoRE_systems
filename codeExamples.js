window.CodeExamples = {
    samples: [
        {
            id: "sample1",
            prompt: "Review this factorial implementation for correctness, efficiency, and error handling",
            answer: `def calculate_factorial(n):
    result = 1
    while n > 1:
        result = result * n
        n = n - 1
    return result

# No input validation
# No negative number handling
# No type checking
print(calculate_factorial(5))
print(calculate_factorial(-3))
print(calculate_factorial(0))`,
            teacherGrade: {
                "Code Style & Readability": {
                    score: 4,
                    feedback: "Code is readable but lacks docstrings and proper spacing between sections. Variable names are clear."
                },
                "Documentation": {
                    score: 2,
                    feedback: "Missing docstrings, type hints, and parameter descriptions. Comments only point out missing features."
                },
                "Error Handling": {
                    score: 2,
                    feedback: "No input validation, no handling of negative numbers, and no type checking. Could raise unexpected errors."
                },
                "Code Efficiency": {
                    score: 4,
                    feedback: "Implementation is efficient with O(n) complexity. Uses while loop appropriately. Could use math.prod for Python 3.8+."
                },
                "Functionality": {
                    score: 3,
                    feedback: "Basic functionality works but fails for edge cases like negative numbers. No handling of large numbers or recursion depth."
                }
            }
        },
        {
            id: "sample2",
            prompt: "Review this binary search implementation for correctness and edge cases",
            answer: `def binary_search(arr, target):
    left = 0
    right = len(arr)
    
    while left < right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid
            
    return -1

# Test cases with potential issues
numbers = [1, 3, 5, 7, 9, 11, 13, 15]
print(binary_search(numbers, 7))
print(binary_search(numbers, 10))
print(binary_search([], 5))
print(binary_search([1], 1))`,
            teacherGrade: {
                "Code Style & Readability": {
                    score: 5,
                    feedback: "Clean implementation with good variable names and consistent formatting. Could benefit from type hints."
                },
                "Documentation": {
                    score: 3,
                    feedback: "Missing docstring explaining parameters, return value, and assumptions about input array. Test cases are helpful but could be more comprehensive."
                },
                "Error Handling": {
                    score: 3,
                    feedback: "Handles empty array and single-element cases, but no validation for sorted input or type checking."
                },
                "Code Efficiency": {
                    score: 5,
                    feedback: "Optimal O(log n) implementation. Good choice of right boundary and mid calculation to avoid integer overflow."
                },
                "Functionality": {
                    score: 5,
                    feedback: "Correctly implements binary search with proper handling of basic edge cases. Could add sorted array validation."
                }
            }
        },
        {
            id: "sample3",
            prompt: "Review this password validation function for security and completeness",
            answer: `def validate_password(password):
    if len(password) < 8:
        return False
        
    has_upper = False
    has_lower = False
    has_number = False
    
    for char in password:
        if char.isupper():
            has_upper = True
        if char.islower():
            has_lower = True
        if char.isdigit():
            has_number = True
    
    return has_upper and has_lower and has_number

# Missing special character check
# No maximum length check
# No common password check
print(validate_password("Password123"))
print(validate_password("weakpw"))
print(validate_password("NoNumbers"))`,
            teacherGrade: {
                "Code Style & Readability": {
                    score: 4,
                    feedback: "Clear, well-structured code with descriptive variable names. Boolean flags are appropriately used."
                },
                "Documentation": {
                    score: 3,
                    feedback: "Comments identify missing features, but lacks docstring explaining requirements and return value."
                },
                "Error Handling": {
                    score: 3,
                    feedback: "No type checking, no handling of None input, and no maximum length validation. Special characters not required."
                },
                "Code Efficiency": {
                    score: 4,
                    feedback: "Single pass through password is efficient. Could use regex for more concise implementation."
                },
                "Functionality": {
                    score: 3,
                    feedback: "Implements basic password rules but misses crucial security features like special chars and common password checks."
                }
            }
        },
        {
            id: "sample4",
            prompt: "Review this shopping cart implementation for proper OOP principles",
            answer: `class ShoppingCart:
    def __init__(self):
        self.items = {}
        
    def add_item(self, item, quantity):
        if item in self.items:
            self.items[item] += quantity
        else:
            self.items[item] = quantity
    
    def remove_item(self, item):
        if item in self.items:
            del self.items[item]
    
    def get_total(self):
        total = 0
        for item, quantity in self.items.items():
            total += item.price * quantity
        return total

# No error handling
# No quantity validation
# No price validation
# No item validation
cart = ShoppingCart()
cart.add_item("apple", 5)
cart.add_item("banana", -2)
print(cart.get_total())`,
            teacherGrade: {
                "Code Style & Readability": {
                    score: 4,
                    feedback: "Clean class implementation with clear method names. Good use of dictionary for storage."
                },
                "Documentation": {
                    score: 2,
                    feedback: "Missing class and method docstrings. Comments only list missing features without explaining current behavior."
                },
                "Error Handling": {
                    score: 2,
                    feedback: "No validation for negative quantities, missing items, or invalid price attributes. Could raise unexpected errors."
                },
                "Code Efficiency": {
                    score: 5,
                    feedback: "Efficient use of dictionary for O(1) lookups. Good handling of quantity updates."
                },
                "Functionality": {
                    score: 3,
                    feedback: "Basic cart operations work but lacks essential features like quantity updates, item removal validation, and price checks."
                }
            }
        },
        {
            id: "sample5",
            prompt: "Review this API response handler for error handling and edge cases",
            answer: `def handle_api_response(response):
    data = response.json()
    
    if data['status'] == 'success':
        return {
            'success': True,
            'data': data['results']
        }
    
    return {
        'success': False,
        'error': data['message']
    }

def process_user_data(response):
    result = handle_api_response(response)
    if result['success']:
        users = result['data']
        return [user['name'] for user in users]
    return []

# No try-catch for JSON parsing
# No None checks
# No type validation
# No status code checking
# Missing error details
response = get_api_data()  # Function not defined
users = process_user_data(response)
print(users)`,
            teacherGrade: {
                "Code Style & Readability": {
                    score: 4,
                    feedback: "Clear function structure and naming. Good separation of concerns between handlers."
                },
                "Documentation": {
                    score: 2,
                    feedback: "Missing function docstrings. Comments list issues but don't explain expected behavior or return formats."
                },
                "Error Handling": {
                    score: 2,
                    feedback: "Critical missing error handling: no try-catch for JSON parsing, no None checks, no HTTP status validation."
                },
                "Code Efficiency": {
                    score: 4,
                    feedback: "Efficient data processing with good use of list comprehension. Direct dictionary access for fields."
                },
                "Functionality": {
                    score: 3,
                    feedback: "Basic success path works but lacks robust error handling and proper API response validation."
                }
            }
        }
    ]
}; 