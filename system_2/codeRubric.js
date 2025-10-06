window.CodeRubric = {
    categories: [
        {
            name: 'Code Style & Readability',
            maxPoints: 5,
            description: 'How well-written and easy to understand is the code?',
            criteria: [
                { score: 5, description: 'Excellent formatting, clear names, perfectly readable' },
                { score: 4, description: 'Good formatting and naming, easy to follow' },
                { score: 3, description: 'Acceptable formatting but some unclear parts' },
                { score: 2, description: 'Poor formatting or confusing names' },
                { score: 1, description: 'Very difficult to read or understand' }
            ]
        },
        {
            name: 'Documentation',
            maxPoints: 5,
            description: 'How well is the code documented with comments and explanations?',
            criteria: [
                { score: 5, description: 'Comprehensive, clear documentation throughout' },
                { score: 4, description: 'Good documentation of main features' },
                { score: 3, description: 'Basic documentation present' },
                { score: 2, description: 'Minimal or unclear documentation' },
                { score: 1, description: 'Little to no documentation' }
            ]
        },
        {
            name: 'Error Handling',
            maxPoints: 5,
            description: 'How well does the code handle potential errors?',
            criteria: [
                { score: 5, description: 'Handles all possible errors and edge cases' },
                { score: 4, description: 'Handles most common errors well' },
                { score: 3, description: 'Basic error handling present' },
                { score: 2, description: 'Missing important error handling' },
                { score: 1, description: 'No meaningful error handling' }
            ]
        },
        {
            name: 'Code Efficiency',
            maxPoints: 5,
            description: 'How efficient and optimized is the code?',
            criteria: [
                { score: 5, description: 'Highly optimized and efficient' },
                { score: 4, description: 'Good performance with minor improvements possible' },
                { score: 3, description: 'Works but could be more efficient' },
                { score: 2, description: 'Noticeable performance issues' },
                { score: 1, description: 'Very inefficient implementation' }
            ]
        },
        {
            name: 'Functionality',
            maxPoints: 5,
            description: 'Does the code work as intended and meet requirements?',
            criteria: [
                { score: 5, description: 'Works perfectly, meets all requirements' },
                { score: 4, description: 'Works well with minor issues' },
                { score: 3, description: 'Works but has some problems' },
                { score: 2, description: 'Major functionality issues' },
                { score: 1, description: 'Does not work as intended' }
            ]
        }
    ],
    
    // Helper function to get total possible points
    getTotalPoints: function() {
        return this.categories.length * 5;  // 5 categories × 5 points each = 25 max points
    }
}; 