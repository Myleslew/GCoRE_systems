// Remove any existing ReviewScene definition
if (typeof ReviewScene === 'undefined') {
    window.ReviewScene = class ReviewScene extends Phaser.Scene {
        constructor() {
            super({ key: 'reviewScene' });
            this.currentReviewIndex = 0;
            this.preGeneratedAnswers = window.CodeExamples.samples;
            this.rubricCategories = [
                {
                    name: 'Relevance and Completeness',
                    maxPoints: 20,
                    description: 'How well does the response address all parts of the prompt?',
                    criteria: [
                        { range: '17-20', label: 'Exceptional', description: 'Directly addresses all parts of the prompt. Demonstrates clear understanding.' },
                        { range: '13-16', label: 'Proficient', description: 'Addresses most aspects of the prompt. Generally clear understanding.' },
                        { range: '9-12', label: 'Developing', description: 'Partially addresses the prompt; leaves out some important elements.' },
                        { range: '0-8', label: 'Needs Improvement', description: 'Fails to address key parts of the prompt.' }
                    ]
                },
                {
                    name: 'Organization and Clarity',
                    maxPoints: 20,
                    description: 'How well-organized and clear is the response?',
                    criteria: [
                        { range: '17-20', label: 'Exceptional', description: 'Ideas flow logically with clear transitions. Well-structured.' },
                        { range: '13-16', label: 'Proficient', description: 'Generally well-organized; minor issues with flow.' },
                        { range: '9-12', label: 'Developing', description: 'Some organizational issues make response less coherent.' },
                        { range: '0-8', label: 'Needs Improvement', description: 'Disorganized, difficult to follow.' }
                    ]
                },
                {
                    name: 'Depth of Analysis',
                    maxPoints: 30,
                    description: 'How thorough and insightful is the analysis?',
                    criteria: [
                        { range: '25-30', label: 'Exceptional', description: 'Strong critical thinking with detailed reasoning and evidence.' },
                        { range: '19-24', label: 'Proficient', description: 'Good depth of analysis with some strong points.' },
                        { range: '13-18', label: 'Developing', description: 'Attempts analysis but lacks detail or depth.' },
                        { range: '0-12', label: 'Needs Improvement', description: 'Superficial or minimal analysis.' }
                    ]
                },
                {
                    name: 'Creativity/Originality',
                    maxPoints: 15,
                    description: 'How original and creative is the response?',
                    criteria: [
                        { range: '13-15', label: 'Exceptional', description: 'Original, insightful, or highly creative approach.' },
                        { range: '10-12', label: 'Proficient', description: 'Some creativity or unique perspective.' },
                        { range: '6-9', label: 'Developing', description: 'Limited creativity; relies on standard statements.' },
                        { range: '0-5', label: 'Needs Improvement', description: 'No clear uniqueness or creative insight.' }
                    ]
                },
                {
                    name: 'Writing Quality',
                    maxPoints: 15,
                    description: 'How well-written is the response?',
                    criteria: [
                        { range: '13-15', label: 'Exceptional', description: 'Virtually error-free, excellent style and clarity.' },
                        { range: '10-12', label: 'Proficient', description: 'Few minor errors, generally appropriate style.' },
                        { range: '6-9', label: 'Developing', description: 'Noticeable errors sometimes hinder understanding.' },
                        { range: '0-5', label: 'Needs Improvement', description: 'Frequent errors that impede clarity.' }
                    ]
                }
            ];
            this.currentCategory = 0;
            this.scores = {};
            this.isViewingCode = false;
            this.selectedCode = null;
        }

        create() {
            this.children.removeAll();
            this.cleanup();
            this.showCodeList();
        }

        cleanup() {
            const elements = document.querySelectorAll('.code-view-container, .code-list-container, #back-button-container');
            elements.forEach(element => {
                if (element.parentNode) {
                    element.parentNode.removeChild(element);
                }
            });
        }

        getUnreviewedSamples() {
            const evaluations = window.ProfileManager.getEvaluations();
            const reviewedCodeIds = new Set(evaluations.map(review => review.codeId));
            return window.CodeExamples.samples.filter(sample => !reviewedCodeIds.has(sample.id));
        }

        showCodeList() {
            const container = document.createElement('div');
            container.className = 'code-list-container';
            container.style = `
                position: absolute;
                top: 80px;
                left: 50%;
                transform: translateX(-50%);
                width: 800px;
                padding: 20px;
                background-color: #2a2a2a;
                border-radius: 8px;
                color: white;
                max-height: 80vh;
                overflow-y: auto;
            `;

            const title = document.createElement('h2');
            title.textContent = 'Code Samples to Review';
            title.style = `
                text-align: center;
                margin-bottom: 30px;
                color: #4CAF50;
            `;
            container.appendChild(title);

            const menuButton = document.createElement('button');
            menuButton.textContent = '← Back to Menu';
            menuButton.style = `
                padding: 10px 20px;
                background-color: #444;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                margin-bottom: 20px;
                font-size: 16px;
            `;
            menuButton.addEventListener('click', () => {
                this.cleanup();
                this.scene.start('startScene');
            });
            container.appendChild(menuButton);

            const unreviewedSamples = this.getUnreviewedSamples();
            unreviewedSamples.forEach((sample, index) => {
                const sampleContainer = document.createElement('div');
                sampleContainer.style = `
                    background-color: #333;
                    border-radius: 8px;
                    padding: 20px;
                    margin-bottom: 20px;
                `;

                // Sample title and prompt
                const sampleTitle = document.createElement('h3');
                sampleTitle.textContent = `Code Sample ${index + 1}`;
                sampleTitle.style = `
                    color: #4CAF50;
                    margin-bottom: 15px;
                `;
                sampleContainer.appendChild(sampleTitle);

                const promptDiv = document.createElement('div');
                promptDiv.textContent = sample.prompt;
                promptDiv.style = `
                    margin-bottom: 15px;
                    color: #ddd;
                    font-size: 16px;
                `;
                sampleContainer.appendChild(promptDiv);

                // Code display
                const codeDisplay = document.createElement('pre');
                codeDisplay.style = `
                    background-color: #1a1a1a;
                    padding: 15px;
                    border-radius: 4px;
                    overflow-x: auto;
                    margin: 15px 0;
                    font-family: monospace;
                    white-space: pre-wrap;
                    font-size: 14px;
                    color: #ddd;
                `;
                codeDisplay.textContent = sample.answer;
                sampleContainer.appendChild(codeDisplay);

                // Review button
                const reviewButton = document.createElement('button');
                reviewButton.textContent = 'Review This Code';
                reviewButton.style = `
                    padding: 12px 24px;
                    background-color: #4CAF50;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 16px;
                    width: 100%;
                    margin-top: 15px;
                    transition: background-color 0.3s;
                `;
                reviewButton.addEventListener('mouseover', () => {
                    reviewButton.style.backgroundColor = '#45a049';
                });
                reviewButton.addEventListener('mouseout', () => {
                    reviewButton.style.backgroundColor = '#4CAF50';
                });
                reviewButton.addEventListener('click', () => {
                    this.scene.start('evaluationScene', {
                        answer: sample.answer,
                        prompt: sample.prompt,
                        codeId: sample.id
                    });
                });
                sampleContainer.appendChild(reviewButton);

                container.appendChild(sampleContainer);
            });

            if (unreviewedSamples.length === 0) {
                const noSamplesMessage = document.createElement('div');
                noSamplesMessage.style = `
                    text-align: center;
                    padding: 30px;
                    color: #aaa;
                    font-size: 18px;
                    background-color: #333;
                    border-radius: 4px;
                `;
                noSamplesMessage.innerHTML = `
                    <p>You have reviewed all available code samples!</p>
                    <p style="margin-top: 10px; font-size: 16px;">
                        Check your profile to see your previous reviews.
                    </p>
                `;
                container.appendChild(noSamplesMessage);
            }

            document.body.appendChild(container);
        }

        showFullCode(codeData) {
            // Verify this sample hasn't been reviewed yet
            const evaluations = window.ProfileManager.getEvaluations();
            if (evaluations.some(review => review.codeId === codeData.id)) {
                alert('You have already reviewed this code sample.');
                this.isViewingCode = false;
                this.showCodeList();
                return;
            }

            // Clear existing elements
            this.cleanup();

            // Create a container for the back button to ensure it's above everything
            const backButtonContainer = document.createElement('div');
            backButtonContainer.style = `
                position: fixed;
                top: 20px;
                left: 20px;
                z-index: 1000;
                cursor: pointer;
                padding: 10px 20px;
                background-color: #444;
                color: white;
                border-radius: 4px;
                font-size: 18px;
            `;
            backButtonContainer.innerHTML = '← Back to Code Selection';
            backButtonContainer.addEventListener('mouseover', () => {
                backButtonContainer.style.backgroundColor = '#666';
            });
            backButtonContainer.addEventListener('mouseout', () => {
                backButtonContainer.style.backgroundColor = '#444';
            });
            backButtonContainer.addEventListener('click', () => {
                this.isViewingCode = false;
                // Remove all containers before going back
                const containers = document.querySelectorAll('.code-view-container, #back-button-container');
                containers.forEach(container => container.remove());
                this.create();
            });
            backButtonContainer.id = 'back-button-container';
            document.body.appendChild(backButtonContainer);

            // Create a scrollable container for the full code view
            const codeContainer = document.createElement('div');
            codeContainer.className = 'code-view-container';
            codeContainer.style = `
                position: absolute;
                top: 80px;
                left: 50%;
                transform: translateX(-50%);
                width: 800px;
                height: 480px;
                overflow-y: auto;
                padding: 20px;
                background-color: #1a1a1a;
                z-index: 0;
            `;

            // Add prompt
            const promptElement = document.createElement('div');
            promptElement.style = `
                color: #fff;
                font-size: 20px;
                margin-bottom: 20px;
                padding: 10px;
                background-color: #2a2a2a;
                border-radius: 4px;
            `;
            promptElement.textContent = codeData.prompt;

            // Add code display
            const codeElement = document.createElement('pre');
            codeElement.style = `
                background-color: #2a2a2a;
                padding: 20px;
                border-radius: 4px;
                color: #fff;
                font-family: monospace;
                font-size: 16px;
                line-height: 1.5;
                overflow-x: auto;
                white-space: pre;
                margin: 20px 0;
            `;
            codeElement.textContent = codeData.code;

            // Add evaluate button at the bottom of the container
            const evaluateButton = document.createElement('button');
            evaluateButton.textContent = 'Begin Review';
            evaluateButton.style = `
                font-size: 20px;
                color: white;
                background-color: #2ecc71;
                border: none;
                padding: 15px 30px;
                cursor: pointer;
                border-radius: 4px;
                margin-top: 20px;
                width: 200px;
                display: block;
                margin: 20px auto;
            `;
            evaluateButton.addEventListener('mouseover', () => {
                evaluateButton.style.backgroundColor = '#27ae60';
            });
            evaluateButton.addEventListener('mouseout', () => {
                evaluateButton.style.backgroundColor = '#2ecc71';
            });
            evaluateButton.addEventListener('click', () => {
                this.scene.start('evaluationScene', {
                    answer: codeData.answer,
                    prompt: codeData.prompt,
                    codeId: codeData.id
                });
            });

            // Append elements to container
            codeContainer.appendChild(promptElement);
            codeContainer.appendChild(codeElement);
            codeContainer.appendChild(evaluateButton);

            // Add custom scrollbar styles
            const style = document.createElement('style');
            style.textContent = `
                .code-view-container::-webkit-scrollbar {
                    width: 10px;
                }
                .code-view-container::-webkit-scrollbar-track {
                    background: #1a1a1a;
                }
                .code-view-container::-webkit-scrollbar-thumb {
                    background: #888;
                    border-radius: 5px;
                }
                .code-view-container::-webkit-scrollbar-thumb:hover {
                    background: #555;
                }
            `;
            document.head.appendChild(style);

            // Add container to document
            document.body.appendChild(codeContainer);
        }

        showCodePreview(answer, yPos) {
            if (this.previewText) {
                this.previewText.destroy();
            }

            // Create preview container
            const previewContainer = this.add.container(400, yPos + 60);

            // Add prompt
            const promptText = this.add.text(0, 0, answer.prompt, {
                fontSize: '14px',
                fill: '#aaa',
                wordWrap: { width: 500 },
                align: 'center'
            }).setOrigin(0.5);

            // Add code preview (first 3-4 lines)
            const codeLines = answer.code.split('\n').slice(0, 4).join('\n');
            const codeText = this.add.text(0, 40, codeLines, {
                fontSize: '14px',
                fill: '#fff',
                backgroundColor: '#2a2a2a',
                padding: { x: 15, y: 10 },
                wordWrap: { width: 500 },
                align: 'left',
                fontFamily: 'monospace',
                lineSpacing: 5
            }).setOrigin(0.5);

            // Add "Click to review" text
            const clickText = this.add.text(0, 90, 'Click to review this code sample', {
                fontSize: '14px',
                fill: '#4CAF50',
                padding: { x: 10, y: 5 }
            }).setOrigin(0.5);

            previewContainer.add([promptText, codeText, clickText]);
            this.previewText = previewContainer;
        }

        showReviewScreen(promptAnswers) {
            // Clear all existing elements first
            this.children.removeAll();
            this.input.removeAllListeners();
            
            // Remove any existing DOM elements
            const oldElements = document.querySelectorAll('.scrollable-container, input, textarea');
            oldElements.forEach(element => {
                if (element.parentNode) {
                    element.parentNode.removeChild(element);
                }
            });

            // Add title
            this.add.text(400, 80, 'Review Responses', {
                fontSize: '32px',
                fill: '#fff'
            }).setOrigin(0.5);

            // Add back button to prompt selection
            const backButton = this.add.text(50, 30, '← Back to Prompts', {
                fontSize: '24px',
                fill: '#fff',
                backgroundColor: '#444',
                padding: { x: 10, y: 5 }
            })
            .setInteractive()
            .on('pointerdown', () => {
                this.currentReviewIndex = 0;
                this.showPromptSelection();
            });

            const currentAnswer = promptAnswers[this.currentReviewIndex];

            // Display prompt and response
            this.displayPromptAndResponse(currentAnswer);
            
            // Add "Begin Evaluation" button
            const evaluateButton = this.add.text(400, 450, 'Begin Evaluation', {
                fontSize: '24px',
                fill: '#fff',
                backgroundColor: '#444',
                padding: { x: 20, y: 10 }
            })
            .setOrigin(0.5)
            .setInteractive()
            .on('pointerdown', () => {
                this.scene.start('evaluationScene', { answer: currentAnswer });
            });
        }

        showEvaluationScreen(answer) {
            // Clear all existing elements
            this.children.removeAll();
            this.input.removeAllListeners();

            // Remove any existing DOM elements
            const oldElements = document.querySelectorAll('input, textarea');
            oldElements.forEach(element => {
                if (element.parentNode) {
                    element.parentNode.removeChild(element);
                }
            });

            // Add a semi-transparent background to prevent clicks on the game canvas
            const background = this.add.rectangle(0, 0, 
                this.cameras.main.width,
                this.cameras.main.height,
                0x000000, 0.1
            );
            background.setOrigin(0, 0);
            background.setInteractive({
                useHandCursor: false,
                preventDefault: true
            });
            // Consume the click event without any action
            background.on('pointerdown', () => {});

            // Add title
            this.add.text(400, 80, 'Evaluate Response', {
                fontSize: '32px',
                fill: '#fff'
            }).setOrigin(0.5);

            // Add button to review response again
            const reviewButton = this.add.text(50, 30, '← Review Response', {
                fontSize: '24px',
                fill: '#fff',
                backgroundColor: '#444',
                padding: { x: 10, y: 5 }
            })
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => {
                reviewButton.setStyle({ backgroundColor: '#666' });
            })
            .on('pointerout', () => {
                reviewButton.setStyle({ backgroundColor: '#444' });
            })
            .on('pointerdown', () => {
                // Remove DOM elements before switching screens
                const elements = document.querySelectorAll('input, textarea');
                elements.forEach(element => {
                    if (element.parentNode) {
                        element.parentNode.removeChild(element);
                    }
                });
                this.showReviewScreen([answer]);
            });

            const category = this.rubricCategories[this.currentCategory];
            
            // Display category name and description
            this.add.text(400, 130, category.name, {
                fontSize: '24px',
                fill: '#fff'
            }).setOrigin(0.5);

            this.add.text(400, 170, category.description, {
                fontSize: '18px',
                fill: '#aaa',
                align: 'center',
                wordWrap: { width: 600 }
            }).setOrigin(0.5);

            // Display criteria with reduced spacing
            category.criteria.forEach((criterion, index) => {
                const y = 220 + (index * 60);
                
                this.add.text(400, y, 
                    `${criterion.label} (${criterion.range} points)\n${criterion.description}`, {
                    fontSize: '16px',
                    fill: '#fff',
                    align: 'center',
                    wordWrap: { width: 500 }
                }).setOrigin(0.5);
            });

            // Create container div for input elements
            const container = document.createElement('div');
            container.style = `
                position: absolute;
                z-index: 1;
                display: flex;
                flex-direction: column;
                align-items: center;
                width: 500px;
            `;

            // Create score input container
            const scoreContainer = document.createElement('div');
            scoreContainer.style = `
                margin-bottom: 20px;
                text-align: center;
                width: 100%;
            `;

            // Create score input box
            const scoreInput = document.createElement('input');
            scoreInput.type = 'number';
            scoreInput.style = `
                width: 60px;
                padding: 8px;
                font-size: 16px;
                border-radius: 4px;
                border: 2px solid #444;
                background-color: #fff;
                text-align: center;
                margin-top: 10px;
            `;
            scoreInput.min = 0;
            scoreInput.max = category.maxPoints;
            
            scoreContainer.appendChild(scoreInput);
            container.appendChild(scoreContainer);

            // Create feedback textarea
            const feedbackArea = document.createElement('textarea');
            feedbackArea.style = `
                width: 500px;
                height: 80px;
                padding: 10px;
                font-size: 16px;
                border-radius: 4px;
                border: 2px solid #444;
                background-color: #fff;
                resize: none;
                font-family: Arial, sans-serif;
                margin-top: 10px;
            `;
            container.appendChild(feedbackArea);

            // Add labels and container to the scene
            this.add.text(400, 460, 'Enter score:', {
                fontSize: '20px',
                fill: '#fff'
            }).setOrigin(0.5);

            // Add point range reminder
            this.add.text(400, 490, `Score range: 0-${category.maxPoints} points`, {
                fontSize: '16px',
                fill: '#aaa'
            }).setOrigin(0.5);

            // Add feedback label - moved down
            this.add.text(400, 600, 'Provide feedback for your score:', {  // Moved from 530 to 600
                fontSize: '20px',
                fill: '#fff'
            }).setOrigin(0.5);

            // Adjusted position of the container
            const domElement = this.add.dom(400, 545, container);  // Moved from 580 to 545
            domElement.addListener('click');
            domElement.addListener('input');

            // Add submit button - moved down
            const submitButton = this.add.text(400, 750, 'Submit Score & Feedback', {  // Moved from 700 to 750
                fontSize: '24px',
                fill: '#fff',
                backgroundColor: '#2ecc71',
                padding: { x: 25, y: 15 }
            })
            .setOrigin(0.5)
            .setInteractive()
            .on('pointerover', () => {
                submitButton.setStyle({ backgroundColor: '#27ae60' });
            })
            .on('pointerout', () => {
                submitButton.setStyle({ backgroundColor: '#2ecc71' });
            })
            .on('pointerdown', () => {
                const score = parseInt(scoreInput.value);
                const feedback = feedbackArea.value.trim();
                
                // Validate score
                if (isNaN(score) || score < 0 || score > category.maxPoints) {
                    this.showError(`Please enter a valid score between 0 and ${category.maxPoints}`);
                    return;
                }
                
                // Validate feedback
                if (feedback.length < 10) {
                    this.showError('Please provide more detailed feedback (minimum 10 characters)');
                    return;
                }

                // Show success message before moving to next category
                const successText = this.add.text(400, 700, 'Score submitted successfully!', {
                    fontSize: '20px',
                    fill: '#2ecc71'
                }).setOrigin(0.5);

                // Wait a moment before moving to next category
                this.time.delayedCall(1000, () => {
                    this.submitCategoryScore(score, feedback);
                });
            });
        }

        showError(message) {
            // Remove existing error message if any
            const existingError = this.children.list.find(child => child.name === 'errorMessage');
            if (existingError) {
                existingError.destroy();
            }

            // Show new error message
            const errorText = this.add.text(400, 550, message, {
                fontSize: '16px',
                fill: '#ff0000',
                align: 'center'
            })
            .setOrigin(0.5);
            errorText.name = 'errorMessage';

            // Remove error message after 3 seconds
            this.time.delayedCall(3000, () => {
                errorText.destroy();
            });
        }

        displayPromptAndResponse(answer) {
            // Display prompt
            this.add.text(400, 120, 'Prompt:', {
                fontSize: '24px',
                fill: '#fff',
                align: 'center'
            }).setOrigin(0.5);

            this.add.text(400, 160, answer.prompt, {
                fontSize: '20px',
                fill: '#fff',
                align: 'center',
                wordWrap: { width: 700 }
            }).setOrigin(0.5);

            // Display response
            this.add.text(400, 220, 'Response from ' + answer.author + ':', {
                fontSize: '24px',
                fill: '#fff',
                align: 'center'
            }).setOrigin(0.5);

            this.add.text(400, 300, answer.response, {
                fontSize: '18px',
                fill: '#fff',
                align: 'center',
                wordWrap: { width: 600 }
            }).setOrigin(0.5);
        }

        submitCategoryScore(points, feedback) {
            this.scores[this.rubricCategories[this.currentCategory].name] = {
                points: points,
                feedback: feedback
            };
            
            if (this.currentCategory < this.rubricCategories.length - 1) {
                // Move to next category
                this.currentCategory++;
                this.showEvaluationScreen(this.preGeneratedAnswers[this.currentReviewIndex]);
            } else {
                // All categories scored, show final score
                this.showFinalScore();
            }
        }

        showFinalScore() {
            this.children.removeAll();
            
            const totalScore = Object.values(this.scores).reduce((a, b) => a + b.points, 0);
            const maxScore = this.rubricCategories.reduce((a, b) => a + b.maxPoints, 0);

            this.add.text(400, 150, `Final Score: ${totalScore}/${maxScore}`, {
                fontSize: '32px',
                fill: '#fff'
            }).setOrigin(0.5);

            // Display individual category scores and feedback
            let yPos = 220;
            Object.entries(this.scores).forEach(([category, data]) => {
                this.add.text(400, yPos, `${category}: ${data.points}`, {
                    fontSize: '20px',
                    fill: '#fff'
                }).setOrigin(0.5);
                
                this.add.text(400, yPos + 30, `Feedback: ${data.feedback}`, {
                    fontSize: '16px',
                    fill: '#aaa',
                    align: 'center',
                    wordWrap: { width: 600 }
                }).setOrigin(0.5);
                
                yPos += 80;
            });

            // Add button to continue
            this.add.text(400, yPos + 40, 'Continue to Next Response', {
                fontSize: '24px',
                fill: '#fff',
                backgroundColor: '#444',
                padding: { x: 20, y: 10 }
            })
            .setOrigin(0.5)
            .setInteractive()
            .on('pointerdown', () => {
                this.currentCategory = 0;
                this.scores = {};
                this.currentReviewIndex++;
                if (this.currentReviewIndex < this.preGeneratedAnswers.length) {
                    this.showReviewScreen(this.preGeneratedAnswers);
                } else {
                    this.showCompletionMessage();
                }
            });
        }

        showCompletionMessage() {
            this.children.removeAll();
            
            this.add.text(400, 250, 'You\'ve reviewed all responses for this prompt!', {
                fontSize: '32px',
                fill: '#fff',
                align: 'center',
                wordWrap: { width: 700 }
            }).setOrigin(0.5);

            // Button to review more prompts
            this.add.text(400, 350, 'Review Another Prompt', {
                fontSize: '24px',
                fill: '#fff',
                backgroundColor: '#444',
                padding: { x: 20, y: 10 }
            })
            .setOrigin(0.5)
            .setInteractive()
            .on('pointerdown', () => {
                this.currentReviewIndex = 0;
                this.showPromptSelection();
            });

            // Button to return to main menu
            this.add.text(400, 420, 'Return to Main Menu', {
                fontSize: '24px',
                fill: '#fff',
                backgroundColor: '#444',
                padding: { x: 20, y: 10 }
            })
            .setOrigin(0.5)
            .setInteractive()
            .on('pointerdown', () => {
                this.scene.start('startScene');
            });
        }

        shutdown() {
            this.cleanup();
        }

        submitReview() {
            console.log('Starting review submission');
            
            // Collect all scores and feedback
            const studentGrades = {};
            const feedback = [];
            
            // Get scores from each criterion
            console.log('Current scores:', this.scores);
            Object.keys(this.scores).forEach(criterionName => {
                const points = parseInt(this.scores[criterionName].points);
                studentGrades[criterionName] = points;
                feedback.push(this.scores[criterionName].feedback);
                console.log(`Adding score for criterion: ${criterionName} = ${points}`);
            });

            console.log('Collected student grades:', studentGrades);
            console.log('Current code ID:', this.currentCodeId);

            // Calculate and add points
            const points = window.GamificationManager.addReviewPoints(this.currentCodeId, studentGrades);
            console.log('Points awarded:', points);

            // Save the evaluation
            console.log('Saving evaluation with:', {
                codeId: this.currentCodeId,
                studentGrades,
                feedback,
                points,
                prompt: this.currentPrompt
            });
            
            window.ProfileManager.saveEvaluation(
                this.currentCodeId,
                studentGrades,
                feedback,
                points,
                this.currentPrompt
            );

            // Show confirmation
            const confirmation = document.createElement('div');
            confirmation.style = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background-color: #4CAF50;
                color: white;
                padding: 20px;
                border-radius: 4px;
                font-size: 18px;
                z-index: 10000;
                text-align: center;
            `;
            confirmation.textContent = `Review submitted successfully! You earned ${points} points.`;
            document.body.appendChild(confirmation);

            // Wait a moment before transitioning
            setTimeout(() => {
                confirmation.remove();
                this.cleanup();
                this.scene.start('classroomScene');
            }, 2000);
        }
    }
} 