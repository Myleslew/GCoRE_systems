window.CodeExamples = {
    samples: [
        {
            id: "sample1",
            prompt: "Review this simple function that calculates the average of numbers",
            answer: `function calculateAverage(numbers) {
    let sum = 0;
    for (let i = 0; i < numbers.length; i++) {
        sum += numbers[i];
    }
    return sum / numbers.length;
}

// No empty array check
// No non-number check
// No decimal precision handling`,
            teacherGrade: {
                "Code Style & Readability": 4,
                "Documentation": 2,
                "Error Handling": 1,
                "Code Efficiency": 3,
                "Functionality": 3
            }
        },
        {
            id: "sample2",
            prompt: "Review this simple student grade calculator",
            answer: `class Student {
    constructor(name) {
        this.name = name;
        this.grades = [];
    }

    addGrade(grade) {
        this.grades.push(grade);
    }

    getAverage() {
        let sum = 0;
        for (let grade of this.grades) {
            sum += grade;
        }
        return sum / this.grades.length;
    }
}

// No grade validation
// No empty grades check
// No letter grade conversion`,
            teacherGrade: {
                "Code Style & Readability": 4,
                "Documentation": 2,
                "Error Handling": 1,
                "Code Efficiency": 3,
                "Functionality": 3
            }
        },
        {
            id: "sample3",
            prompt: "Review this simple word counter implementation",
            answer: `function countWords(text) {
    let words = text.split(' ');
    let count = 0;
    
    for (let word of words) {
        if (word.length > 0) {
            count++;
        }
    }
    return count;
}

// No punctuation handling
// No multiple spaces handling
// No empty string check`,
            teacherGrade: {
                "Code Style & Readability": 4,
                "Documentation": 2,
                "Error Handling": 1,
                "Code Efficiency": 3,
                "Functionality": 3
            }
        },
        {
            id: "sample4",
            prompt: "Review this simple temperature converter",
            answer: `function celsiusToFahrenheit(celsius) {
    return (celsius * 9/5) + 32;
}

function fahrenheitToCelsius(fahrenheit) {
    return (fahrenheit - 32) * 5/9;
}

// No input validation
// No decimal rounding
// No temperature range check`,
            teacherGrade: {
                "Code Style & Readability": 5,
                "Documentation": 2,
                "Error Handling": 1,
                "Code Efficiency": 4,
                "Functionality": 3
            }
        },
        {
            id: "sample5",
            prompt: "Review this simple password checker",
            answer: `function checkPassword(password) {
    if (password.length < 8) {
        return "Password is too short";
    }
    
    if (!password.includes('!')) {
        return "Password needs a special character";
    }
    
    return "Password is valid";
}

// No number check
// No uppercase check
// No lowercase check`,
            teacherGrade: {
                "Code Style & Readability": 4,
                "Documentation": 2,
                "Error Handling": 2,
                "Code Efficiency": 4,
                "Functionality": 2
            }
        }
    ]
}; 