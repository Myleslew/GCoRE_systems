// Make scene available globally
window.SubmissionScene = class SubmissionScene extends Phaser.Scene {
    constructor() {
        super({ key: 'submissionScene' });
        this.samplePrompts = [
            "Describe a time when you had to make a difficult decision. What was the situation, and how did you handle it?",
            "What role does technology play in modern education? Discuss the benefits and potential drawbacks.",
            "Explain the importance of environmental conservation. What steps can individuals take to protect the environment?",
            "How has social media influenced modern communication and relationships? Provide specific examples.",
            "Discuss the impact of artificial intelligence on the job market. What are the potential benefits and challenges?"
        ];
    }

    create() {
        // Clear any existing elements
        this.children.removeAll();
        
        // Remove any existing DOM elements
        const oldElements = document.querySelectorAll('.response-form-container');
        oldElements.forEach(element => {
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
        });

        // Add back button
        const backButton = this.add.text(50, 30, '← Back to Main Menu', {
            fontSize: '24px',
            fill: '#fff',
            backgroundColor: '#444',
            padding: { x: 10, y: 5 }
        })
        .setInteractive()
        .on('pointerover', () => backButton.setStyle({ backgroundColor: '#666' }))
        .on('pointerout', () => backButton.setStyle({ backgroundColor: '#444' }))
        .on('pointerdown', () => {
            this.scene.start('startScene');
        });

        // Add title
        this.add.text(400, 80, 'Submit Your Response', {
            fontSize: '32px',
            fill: '#fff'
        }).setOrigin(0.5);

        // Add sample prompts section
        this.add.text(400, 140, 'Sample Prompts:', {
            fontSize: '24px',
            fill: '#fff'
        }).setOrigin(0.5);

        // Display sample prompts
        let yPos = 190;
        this.samplePrompts.forEach((prompt, index) => {
            const promptButton = this.add.text(400, yPos, `Prompt ${index + 1}`, {
                fontSize: '20px',
                fill: '#fff',
                backgroundColor: '#444',
                padding: { x: 15, y: 8 }
            })
            .setOrigin(0.5)
            .setInteractive()
            .on('pointerover', () => {
                promptButton.setStyle({ backgroundColor: '#666' });
                this.showPromptPreview(prompt, yPos);
            })
            .on('pointerout', () => {
                promptButton.setStyle({ backgroundColor: '#444' });
                if (this.previewText) {
                    this.previewText.destroy();
                }
            })
            .on('pointerdown', () => {
                this.showResponseForm(prompt);
            });

            yPos += 50;
        });

        // Store the custom prompt text reference
        this.customPromptText = this.add.text(400, 190 + (this.samplePrompts.length * 50) + 30, 'Or submit your own prompt:', {
            fontSize: '20px',
            fill: '#fff'
        }).setOrigin(0.5);
    }

    showPromptPreview(prompt, yPos) {
        if (this.previewText) {
            this.previewText.destroy();
        }

        this.previewText = this.add.text(400, yPos + 40, prompt, {
            fontSize: '16px',
            fill: '#aaa',
            backgroundColor: '#2a2a2a',
            padding: { x: 10, y: 5 },
            wordWrap: { width: 600 },
            align: 'center'
        }).setOrigin(0.5);
    }

    showResponseForm(selectedPrompt) {
        // Clear ALL existing elements
        this.children.removeAll();
        
        // Remove any existing DOM elements
        const oldElements = document.querySelectorAll('.response-form-container');
        oldElements.forEach(element => {
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
        });

        // Add back button
        const backButton = this.add.text(50, 30, '← Back to Prompts', {
            fontSize: '24px',
            fill: '#fff',
            backgroundColor: '#444',
            padding: { x: 10, y: 5 }
        })
        .setInteractive()
        .on('pointerover', () => backButton.setStyle({ backgroundColor: '#666' }))
        .on('pointerout', () => backButton.setStyle({ backgroundColor: '#444' }))
        .on('pointerdown', () => {
            // Remove form elements before going back
            const formElements = document.querySelectorAll('.response-form-container');
            formElements.forEach(element => {
                if (element.parentNode) {
                    element.parentNode.removeChild(element);
                }
            });
            this.scene.restart();
        });

        // Add title
        this.add.text(400, 80, 'Submit Your Response', {
            fontSize: '32px',
            fill: '#fff'
        }).setOrigin(0.5);

        // Add form container
        const formContainer = document.createElement('div');
        formContainer.className = 'response-form-container';
        formContainer.style = `
            width: 600px;
            margin: 20px auto;
            text-align: center;
        `;

        // Display selected prompt
        const promptDisplay = document.createElement('div');
        promptDisplay.textContent = selectedPrompt;
        promptDisplay.style = `
            color: white;
            font-size: 18px;
            margin-bottom: 20px;
            padding: 15px;
            background-color: rgba(68, 68, 68, 0.3);
            border-radius: 4px;
            margin-top: 20px;
        `;

        const responseLabel = document.createElement('div');
        responseLabel.textContent = 'Your Response:';
        responseLabel.style = `
            color: white;
            font-size: 20px;
            margin-bottom: 10px;
        `;

        const responseInput = document.createElement('textarea');
        responseInput.style = `
            width: 100%;
            height: 200px;
            padding: 10px;
            margin-bottom: 20px;
            font-size: 16px;
            border-radius: 4px;
            border: 2px solid #444;
        `;

        const submitButton = document.createElement('button');
        submitButton.textContent = 'Submit Response';
        submitButton.style = `
            font-size: 20px;
            color: white;
            background-color: #2ecc71;
            border: none;
            padding: 15px 25px;
            cursor: pointer;
            border-radius: 4px;
        `;

        submitButton.addEventListener('mouseover', () => {
            submitButton.style.backgroundColor = '#27ae60';
        });

        submitButton.addEventListener('mouseout', () => {
            submitButton.style.backgroundColor = '#2ecc71';
        });

        submitButton.addEventListener('click', () => {
            if (responseInput.value.trim()) {
                // Clear ALL existing elements
                this.children.removeAll();
                
                // Remove all existing DOM elements
                const allElements = document.querySelectorAll('.response-form-container');
                allElements.forEach(element => {
                    if (element.parentNode) {
                        element.parentNode.removeChild(element);
                    }
                });

                // Add title
                this.add.text(400, 80, 'Response Submitted', {
                    fontSize: '32px',
                    fill: '#fff'
                }).setOrigin(0.5);

                // Create a new container for success message
                const successContainer = document.createElement('div');
                successContainer.className = 'response-form-container';
                successContainer.style = `
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                    text-align: center;
                    padding: 20px;
                    width: 100%;
                    max-width: 600px;
                    background-color: #1a1a1a;
                `;

                const successMessage = document.createElement('div');
                successMessage.textContent = 'Response submitted successfully!';
                successMessage.style = `
                    color: #2ecc71;
                    font-size: 24px;
                    margin-bottom: 30px;
                `;

                const buttonsContainer = document.createElement('div');
                buttonsContainer.style = `
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 20px;
                    margin: 0 auto;
                `;

                const submitAnotherButton = document.createElement('button');
                submitAnotherButton.textContent = 'Submit Another Response';
                submitAnotherButton.style = `
                    font-size: 20px;
                    color: white;
                    background-color: #2ecc71;
                    border: none;
                    padding: 15px 25px;
                    cursor: pointer;
                    border-radius: 4px;
                    white-space: nowrap;
                `;
                submitAnotherButton.addEventListener('mouseover', () => {
                    submitAnotherButton.style.backgroundColor = '#27ae60';
                });
                submitAnotherButton.addEventListener('mouseout', () => {
                    submitAnotherButton.style.backgroundColor = '#2ecc71';
                });
                submitAnotherButton.addEventListener('click', () => {
                    // Remove all DOM elements before restarting
                    const allFormElements = document.querySelectorAll('.response-form-container');
                    allFormElements.forEach(element => {
                        if (element.parentNode) {
                            element.parentNode.removeChild(element);
                        }
                    });
                    this.scene.restart();
                });

                const mainMenuButton = document.createElement('button');
                mainMenuButton.textContent = 'Return to Main Menu';
                mainMenuButton.style = `
                    font-size: 20px;
                    color: white;
                    background-color: #3498db;
                    border: none;
                    padding: 15px 25px;
                    cursor: pointer;
                    border-radius: 4px;
                    white-space: nowrap;
                `;
                mainMenuButton.addEventListener('mouseover', () => {
                    mainMenuButton.style.backgroundColor = '#2980b9';
                });
                mainMenuButton.addEventListener('mouseout', () => {
                    mainMenuButton.style.backgroundColor = '#3498db';
                });
                mainMenuButton.addEventListener('click', () => {
                    // Clean up before leaving
                    const allElements = document.querySelectorAll('.response-form-container');
                    allElements.forEach(element => {
                        if (element.parentNode) {
                            element.parentNode.removeChild(element);
                        }
                    });
                    this.scene.start('startScene');
                });

                buttonsContainer.appendChild(submitAnotherButton);
                buttonsContainer.appendChild(mainMenuButton);
                successContainer.appendChild(successMessage);
                successContainer.appendChild(buttonsContainer);
                document.body.appendChild(successContainer);
            }
        });

        formContainer.appendChild(promptDisplay);
        formContainer.appendChild(responseLabel);
        formContainer.appendChild(responseInput);
        formContainer.appendChild(submitButton);

        document.body.appendChild(formContainer);
        const domElement = this.add.dom(400, 300, formContainer);
    }

    shutdown() {
        // Clean up when leaving the scene
        const elements = document.querySelectorAll('.response-form-container');
        elements.forEach(element => {
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
        });
    }
};