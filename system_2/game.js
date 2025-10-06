// Wait for the page to load
window.addEventListener('load', () => {
    // Remove any existing points displays
    const existingDisplays = document.querySelectorAll('.points-display');
    existingDisplays.forEach(display => display.remove());

    const config = {
        type: Phaser.AUTO,
        width: window.innerWidth,
        height: window.innerHeight,
        parent: 'game-container',
        backgroundColor: '#1a1a1a',
        dom: {
            createContainer: true
        },
        scene: [
            window.ProfileScene,
            window.StartScene,
            window.SubmissionScene,
            window.ReviewScene,
            window.EvaluationScene
        ]
    };

    const game = new Phaser.Game(config);

    // Force check login and redirect to profile scene if not logged in
    if (!window.ProfileManager.isLoggedIn()) {
        game.scene.start('profileScene');
    }

    // Add global scene change interceptor
    game.scene.scenes.forEach(scene => {
        const originalCreate = scene.create;
        scene.create = function(...args) {
            // Check login status before allowing any scene to load (except profileScene)
            if (scene.scene.key !== 'profileScene' && !window.ProfileManager.isLoggedIn()) {
                alert('Please log in to continue');
                scene.scene.start('profileScene');
                return;
            }

            originalCreate.apply(this, args);
        };
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