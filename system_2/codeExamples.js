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
                "Code Style & Readability": 3.8,
                "Documentation": 2.5,
                "Error Handling": 3.7,
                "Code Efficiency": 3.2,
                "Functionality": 4.1
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
                "Code Style & Readability": 4.2,
                "Documentation": 3.5,
                "Error Handling": 4.7,
                "Code Efficiency": 3.3,
                "Functionality": 4.4
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
                "Code Style & Readability": 4,
                "Documentation": 3,
                "Error Handling": 4,
                "Code Efficiency": 3,
                "Functionality": 4
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
                "Code Style & Readability": 4,
                "Documentation": 3,
                "Error Handling": 4,
                "Code Efficiency": 3,
                "Functionality": 4
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
                "Code Style & Readability": 4,
                "Documentation": 3,
                "Error Handling": 4,
                "Code Efficiency": 3,
                "Functionality": 4
            }
        }
    ]
}; 