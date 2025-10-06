window.StartScene = class StartScene extends Phaser.Scene {
    constructor() {
        super({ key: 'startScene' });
    }

    create() {
        // Clear any existing elements
        this.children.removeAll();
        
        // Remove any existing DOM elements
        const oldElements = document.querySelectorAll('.start-container');
        oldElements.forEach(element => {
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
        });

        // Create start menu container
        const startContainer = document.createElement('div');
        startContainer.className = 'start-container';
        startContainer.style = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 400px;
            padding: 30px;
            background-color: #2a2a2a;
            border-radius: 8px;
            text-align: center;
        `;

        // Add title
        const title = document.createElement('h2');
        title.textContent = 'Code Review System';
        title.style = `
            color: #4CAF50;
            margin-bottom: 30px;
            font-size: 28px;
        `;

        // Create button container for consistent spacing
        const buttonContainer = document.createElement('div');
        buttonContainer.style = `
            display: flex;
            flex-direction: column;
            gap: 15px;
            align-items: center;
        `;

        // Common button styles
        const buttonStyle = `
            padding: 15px 30px;
            font-size: 18px;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            width: 250px;
            transition: background-color 0.3s ease;
        `;

        // Add start review button
        const startButton = document.createElement('button');
        startButton.textContent = 'Start Code Review';
        startButton.style = buttonStyle + 'background-color: #4CAF50;';
        startButton.addEventListener('mouseover', () => {
            startButton.style.backgroundColor = '#45a049';
        });
        startButton.addEventListener('mouseout', () => {
            startButton.style.backgroundColor = '#4CAF50';
        });
        startButton.addEventListener('click', () => {
            startContainer.remove();
            this.scene.start('reviewScene');
        });

        // Add profile button
        const profileButton = document.createElement('button');
        profileButton.textContent = 'View Profile';
        profileButton.style = buttonStyle + 'background-color: #2196F3;';
        profileButton.addEventListener('mouseover', () => {
            profileButton.style.backgroundColor = '#1976D2';
        });
        profileButton.addEventListener('mouseout', () => {
            profileButton.style.backgroundColor = '#2196F3';
        });
        profileButton.addEventListener('click', () => {
            startContainer.remove();
            this.scene.start('profileScene');
        });

        // Append buttons to button container
        buttonContainer.appendChild(startButton);
        buttonContainer.appendChild(profileButton);

        // Append elements
        startContainer.appendChild(title);
        startContainer.appendChild(buttonContainer);
        document.body.appendChild(startContainer);
    }

    shutdown() {
        // Clean up when leaving the scene
        const elements = document.querySelectorAll('.start-container');
        elements.forEach(element => {
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
        });
    }
}; 