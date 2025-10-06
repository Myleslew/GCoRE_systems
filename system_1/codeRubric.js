window.CodeRubric = {
    categories: [
        {
            name: "Code Quality",
            criteria: [
                {
                    name: "Code Style & Readability",
                    description: "Code follows Python conventions and is easy to read",
                    points: 5,
                    checkpoints: [
                        "Proper indentation and spacing",
                        "Clear variable/function names",
                        "Consistent formatting",
                        "Follows PEP 8 guidelines"
                    ]
                },
                {
                    name: "Documentation",
                    description: "Code is well documented with comments and docstrings",
                    points: 5,
                    checkpoints: [
                        "Clear docstrings for functions/classes",
                        "Helpful inline comments",
                        "Explains complex logic",
                        "Documents parameters and returns"
                    ]
                },
                {
                    name: "Error Handling",
                    description: "Code handles errors and edge cases appropriately",
                    points: 5,
                    checkpoints: [
                        "Uses try/except blocks where needed",
                        "Validates input data",
                        "Handles edge cases",
                        "Provides meaningful error messages"
                    ]
                },
                {
                    name: "Code Efficiency",
                    description: "Code is efficient and well-organized",
                    points: 5,
                    checkpoints: [
                        "No unnecessary operations",
                        "Appropriate data structures",
                        "Efficient algorithm choice",
                        "No redundant code"
                    ]
                },
                {
                    name: "Functionality",
                    description: "Code works as intended and solves the problem",
                    points: 5,
                    checkpoints: [
                        "Meets requirements",
                        "Produces correct output",
                        "Functions as expected",
                        "Complete solution"
                    ]
                }
            ]
        }
    ],
    
    // Helper function to calculate total possible points
    getTotalPoints: function() {
        return this.categories[0].criteria.reduce((total, criterion) => {
            return total + criterion.points;
        }, 0);
    },
    
    // Helper function to get formatted category names
    getCategoryNames: function() {
        return this.categories.map(category => category.name);
    }
}; 