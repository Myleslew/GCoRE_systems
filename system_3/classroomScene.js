window.ClassroomScene = class ClassroomScene extends Phaser.Scene {
    constructor() {
        super({ key: 'classroomScene' });
        this.player = null;
        this.lastPromptTime = Date.now(); // Initialize to current time to delay first popup
        this.promptInterval = 7000; // Show prompt every 7 seconds
        this.movementSpeed = 160;
        this.selectedCharacter = null; // Store character selection
        this.cursors = null;  // Initialize in create()
        this.wasdKeys = null; // Initialize in create()
        this.isPromptVisible = false; // Add flag to track popup state
    }

    preload() {
        // Add load event listeners
        this.load.on('filecomplete', (key, type, data) => {
            console.log(`Successfully loaded: ${key}`);
        });

        this.load.on('loaderror', (file) => {
            console.error(`Error loading file: ${file.key} from ${file.url}`);
        });

        // Load all assets with correct LPC sprite dimensions (64x64 per frame)
        this.load.spritesheet('male-character', 'assets/male-character.png', { 
            frameWidth: 64,
            frameHeight: 64
        });
        this.load.spritesheet('female-character', 'assets/female-character.png', { 
            frameWidth: 64,
            frameHeight: 64
        });
        this.load.image('classroom', 'assets/classroom.png');
        this.load.image('desk', 'assets/desk.png');
        this.load.image('computer-desk', 'assets/computer-desk.png');

        // Load male walking animation frames
        for (let i = 1; i <= 15; i++) {
            this.load.image(`male-walk-${i}`, `assets/png/Walk (${i}).png`);
        }

        // Load female walking animation frames
        for (let i = 1; i <= 20; i++) {
            this.load.image(`female-walk-${i}`, `assets/png 2/Walk (${i}).png`);
        }
    }

    create() {
        // Check if user is logged in
        if (!window.ProfileManager.loadProfile()) {
            this.scene.start('profileScene');
            return;
        }

        // Check if character is selected
        if (!this.selectedCharacter) {
            this.showCharacterSelection();
            return;
        }

        // Reset the prompt timer when creating/returning to classroom scene
        this.lastPromptTime = Date.now();
        
        this.createGameScene();
    }

    showCharacterSelection() {
        // Save character selection to ProfileManager
        const saveCharacterSelection = (character) => {
            const profile = window.ProfileManager.currentProfile;
            profile.character = character;
            window.ProfileManager.saveProfile(profile);
            this.selectedCharacter = character;
            this.createGameScene();
        };

        const container = document.createElement('div');
        container.style = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: rgba(0, 0, 0, 0.9);
            padding: 30px;
            border-radius: 8px;
            text-align: center;
            color: white;
            z-index: 1000;
        `;

        const title = document.createElement('h2');
        title.textContent = 'Choose Your Character';
        title.style = 'color: #4CAF50; margin-bottom: 20px;';

        const buttonContainer = document.createElement('div');
        buttonContainer.style = 'display: flex; gap: 20px; justify-content: center;';

        const createButton = (text, character) => {
            const button = document.createElement('button');
            button.textContent = text;
            button.style = `
                padding: 10px 20px;
                background-color: #4CAF50;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 16px;
                width: 120px;
            `;
            button.addEventListener('mouseover', () => {
                button.style.backgroundColor = '#45a049';
            });
            button.addEventListener('mouseout', () => {
                button.style.backgroundColor = '#4CAF50';
            });
            button.addEventListener('click', () => {
                saveCharacterSelection(character);
                container.remove();
            });
            return button;
        };

        const maleButton = createButton('Male', 'male-character');
        const femaleButton = createButton('Female', 'female-character');

        buttonContainer.appendChild(maleButton);
        buttonContainer.appendChild(femaleButton);
        container.appendChild(title);
        container.appendChild(buttonContainer);
        document.body.appendChild(container);
    }

    createGameScene() {
        console.log('Creating game scene with character:', this.selectedCharacter);
        
        // Add classroom background
        this.add.image(400, 300, 'classroom');

        // Create desks group with physics
        this.desks = this.physics.add.staticGroup();

        // Define desk positions (5 rows x 6 columns)
        const deskPositions = [
            // Front row
            [200, 250], [300, 250], [400, 250], [500, 250], [600, 250],
            // Second row
            [200, 325], [300, 325], [400, 325], [500, 325], [600, 325],
            // Third row
            [200, 400], [300, 400], [400, 400], [500, 400], [600, 400],
            // Fourth row
            [200, 475], [300, 475], [400, 475], [500, 475], [600, 475],
            // Back row
            [200, 550], [300, 550], [400, 550], [500, 550], [600, 550]
        ];

        // Create desks at each position
        deskPositions.forEach(([x, y]) => {
            const desk = this.desks.create(x, y, 'desk');
            // Adjust desk hitbox for better collision
            desk.setSize(60, 40); // Make hitbox larger to match desk visual size
            desk.setOffset(2, 12); // Adjust offset to center the hitbox
        });

        // Add player sprite
        this.player = this.physics.add.sprite(400, 200, this.selectedCharacter);
        this.player.setCollideWorldBounds(true);
        
        // Scale the player sprite to be smaller
        this.player.setScale(0.2); // Make the sprite 20% of its original size
        
        // Adjust the physics body size and offset for the scaled sprite
        this.player.setSize(6, 6);  // Smaller collision box
        this.player.setOffset(3, 6); // Adjusted offset for the scaled sprite

        // Add collision between player and desks
        this.physics.add.collider(this.player, this.desks);

        // Add computer desk in top right corner
        this.computerDesk = this.physics.add.sprite(700, 200, 'computer-desk');
        this.computerDesk.setImmovable(true);
        this.computerDesk.setSize(60, 40); // Match the size of regular desks
        this.computerDesk.setOffset(2, 12); // Match the offset of regular desks

        // Add collision and overlap detection
        this.physics.add.collider(this.player, this.computerDesk);
        this.physics.add.overlap(
            this.player, 
            this.computerDesk, 
            this.handleComputerInteraction, 
            null, 
            this
        );

        // Add interaction key - only create it after character selection
        this.interactKey = this.input.keyboard.addKey('E');
        // Prevent the key from being captured by the browser
        this.input.keyboard.removeCapture('E');

        // Add interaction prompt text (hidden by default)
        this.interactPrompt = this.add.text(400, 100, 'Press E to use computer', {
            fontSize: '16px',
            fill: '#fff',
            backgroundColor: '#000',
            padding: { x: 5, y: 5 }
        });
        this.interactPrompt.setOrigin(0.5);
        this.interactPrompt.setDepth(2);
        this.interactPrompt.setVisible(false);

        // Create animations
        this.createAnimations();

        // Initialize keyboard controls
        this.cursors = this.input.keyboard.createCursorKeys();
        
        // Add WASD keys and remove their capture
        this.wasdKeys = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });
        
        // Remove capture for all movement and interaction keys
        this.input.keyboard.removeCapture([
            'W', 'S', 'A', 'D', 'E',
            'w', 's', 'a', 'd', 'e',
            'SPACE',
            'UP', 'DOWN', 'LEFT', 'RIGHT'
        ]);

        // Add debug text
        this.add.text(16, 16, `Character: ${this.selectedCharacter}`, {
            fontSize: '18px',
            fill: '#fff'
        });

        // Set initial player depth to ensure it renders above desks
        this.player.setDepth(1);
    }

    createAnimations() {
        try {
            // Create male walking animations
            const maleWalkFrames = [];
            for (let i = 1; i <= 15; i++) {
                maleWalkFrames.push({ key: `male-walk-${i}` });
            }

            // Create female walking animations
            const femaleWalkFrames = [];
            for (let i = 1; i <= 20; i++) {
                femaleWalkFrames.push({ key: `female-walk-${i}` });
            }

            // Get the appropriate frames based on character selection
            const walkFrames = this.selectedCharacter === 'male-character' ? maleWalkFrames : femaleWalkFrames;
            const frameCount = this.selectedCharacter === 'male-character' ? 15 : 20;

            // Walk down animation
            this.anims.create({
                key: 'walk-down',
                frames: walkFrames,
                frameRate: frameCount,
                repeat: -1
            });

            // Walk left animation
            this.anims.create({
                key: 'walk-left',
                frames: walkFrames,
                frameRate: frameCount,
                repeat: -1
            });

            // Walk right animation
            this.anims.create({
                key: 'walk-right',
                frames: walkFrames,
                frameRate: frameCount,
                repeat: -1
            });

            // Walk up animation
            this.anims.create({
                key: 'walk-up',
                frames: walkFrames,
                frameRate: frameCount,
                repeat: -1
            });

            // Idle animation - using first frame of walking animation
            this.anims.create({
                key: 'idle',
                frames: [{ key: this.selectedCharacter === 'male-character' ? 'male-walk-1' : 'female-walk-1' }],
                frameRate: 1
            });

            console.log('Animations created successfully');
        } catch (error) {
            console.error('Error creating animations:', error);
        }
    }

    update() {
        try {
            if (this.player && this.cursors && this.wasdKeys) {
                this.handleMovement();
                this.checkForPrompt();
            }

            // Check for computer interaction
            this.handleComputerInteraction();
        } catch (error) {
            console.error('Error in update:', error);
        }
    }

    handleMovement() {
        if (!this.cursors || !this.wasdKeys || !this.player || this.isPromptVisible) return; // Don't move if prompt is visible

        // Get input from both arrow keys and WASD
        const left = this.cursors.left.isDown || this.wasdKeys.left.isDown;
        const right = this.cursors.right.isDown || this.wasdKeys.right.isDown;
        const up = this.cursors.up.isDown || this.wasdKeys.up.isDown;
        const down = this.cursors.down.isDown || this.wasdKeys.down.isDown;

        // Reset velocity
        this.player.setVelocity(0);

        // Handle movement and animations
        if (left) {
            this.player.setVelocityX(-this.movementSpeed);
            this.player.anims.play('walk-left', true);
        } else if (right) {
            this.player.setVelocityX(this.movementSpeed);
            this.player.anims.play('walk-right', true);
        }

        if (up) {
            this.player.setVelocityY(-this.movementSpeed);
            if (!left && !right) this.player.anims.play('walk-up', true);
        } else if (down) {
            this.player.setVelocityY(this.movementSpeed);
            if (!left && !right) this.player.anims.play('walk-down', true);
        }

        // Play idle animation if not moving
        if (!left && !right && !up && !down) {
            this.player.anims.play('idle', true);
        }
    }

    checkForPrompt() {
        const currentTime = Date.now();
        if (currentTime - this.lastPromptTime >= this.promptInterval) {
            // 20% chance to show prompt when interval has passed
            if (Math.random() < 0.2) {
                this.showCodePrompt();
                this.lastPromptTime = currentTime;
            }
        }
    }

    showCodePrompt() {
        this.isPromptVisible = true;
        this.player.setVelocity(0);
        
        const promptContainer = document.createElement('div');
        promptContainer.style = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: rgba(0, 0, 0, 0.9);
            padding: 20px;
            border-radius: 8px;
            color: white;
            text-align: center;
            z-index: 1000;
        `;

        const title = document.createElement('h2');
        title.textContent = 'Time for a Code Review!';
        title.style = 'color: #4CAF50; margin-bottom: 20px;';

        const button = document.createElement('button');
        button.textContent = 'Start Review';
        button.style = `
            padding: 10px 20px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
        `;

        button.addEventListener('click', () => {
            this.isPromptVisible = false;
            promptContainer.remove();
            this.cleanup();
            this.scene.start('reviewScene');
        });

        const skipButton = document.createElement('button');
        skipButton.textContent = 'Skip';
        skipButton.style = `
            padding: 10px 20px;
            background-color: #666;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            margin-left: 10px;
        `;

        skipButton.addEventListener('click', () => {
            this.isPromptVisible = false;
            promptContainer.remove();
        });

        promptContainer.appendChild(title);
        promptContainer.appendChild(button);
        promptContainer.appendChild(skipButton);
        document.body.appendChild(promptContainer);
    }

    handleComputerInteraction() {
        // Only proceed if player and computer desk exist and no prompt is visible
        if (!this.player || !this.computerDesk || this.isPromptVisible) {
            return;
        }

        const distance = Phaser.Math.Distance.Between(
            this.player.x, 
            this.player.y, 
            this.computerDesk.x, 
            this.computerDesk.y
        );

        // Show prompt if player is close enough
        if (distance < 50) {
            this.interactPrompt.setVisible(true);
            this.interactPrompt.x = this.computerDesk.x;
            this.interactPrompt.y = this.computerDesk.y - 40;

            // Check if E key was just pressed
            if (Phaser.Input.Keyboard.JustDown(this.interactKey)) {
                // Navigate to profile scene
                this.scene.start('profileScene');
            }
        } else {
            this.interactPrompt.setVisible(false);
        }
    }

    cleanup() {
        // Remove all DOM elements
        const elements = document.querySelectorAll('div[style*="position: absolute"]');
        elements.forEach(element => {
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
        });
        
        // Remove all key bindings when leaving scene
        if (this.wasdKeys) {
            this.input.keyboard.removeKey('W');
            this.input.keyboard.removeKey('S');
            this.input.keyboard.removeKey('A');
            this.input.keyboard.removeKey('D');
        }
        if (this.cursors) {
            this.input.keyboard.removeKey('UP');
            this.input.keyboard.removeKey('DOWN');
            this.input.keyboard.removeKey('LEFT');
            this.input.keyboard.removeKey('RIGHT');
            this.input.keyboard.removeKey('SPACE');
        }
        if (this.interactKey) {
            this.input.keyboard.removeKey('E');
        }
        
        // Stop all game objects and animations
        this.scene.stop();
    }
}; 