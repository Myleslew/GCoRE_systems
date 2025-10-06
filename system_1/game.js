// Wait for the page to load
window.addEventListener('load', () => {
    const config = {
        type: Phaser.AUTO,
        parent: 'game-container',
        width: 800,
        height: 600,
        backgroundColor: '#1a1a1a',
        dom: {
            createContainer: true
        },
        scene: [
            window.StartScene,
            window.ProfileScene,
            window.ReviewScene,
            window.EvaluationScene
        ]
    };

    const game = new Phaser.Game(config);

    // Global scene transition handler
    game.scene.scenes.forEach(scene => {
        scene.events.on('start', () => {
            // Clean up all DOM elements when transitioning to a new scene
            const elements = document.querySelectorAll('.profile-form-container, .dashboard-container, .code-list-container, .code-view-container, .evaluation-container, #back-button-container, #submit-button-container, .start-container, .evaluation-flex-container');
            elements.forEach(element => {
                if (element && element.parentNode) {
                    element.parentNode.removeChild(element);
                }
            });
        });
    });
});

// Game state variables
let currentPrompt = '';
let responses = [];
let score = 0;

// Game functionality
function getNewPrompt() {
    const prompts = [
        'What is your favorite programming language and why?',
        'Describe a challenging bug you encountered and how you fixed it',
        'What inspired you to start coding?'
    ];
    currentPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    return currentPrompt;
}

function submitResponse() {
    const response = document.querySelector('input').value;
    responses.push({
        prompt: currentPrompt,
        response: response,
        ratings: []
    });
    
    // Clear input and show new prompt
    document.querySelector('input').value = '';
    getNewPrompt();
}

function rateResponse(responseId, rating) {
    responses[responseId].ratings.push(rating);
    // Calculate average rating
    const avgRating = responses[responseId].ratings.reduce((a, b) => a + b) / responses[responseId].ratings.length;
    
    // Update score based on ratings received
    if (avgRating >= 4) {
        score += 10;
    }
}

// Add new scenes
const submissionScene = {
    key: 'submissionScene',
    create: function() {
        // This is just a placeholder as we're using the SubmissionScene class instead
        this.scene.start('submissionScene');
    },
    update: update
};

// Update config to use the new scenes
config.scene = [
    StartScene,
    SubmissionScene,
    {
        key: 'submissionScene',
        ...submissionScene
    },
    ReviewScene,
    EvaluationScene
];