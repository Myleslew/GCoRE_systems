// Remove any existing EvaluationScene definition
if (typeof EvaluationScene === 'undefined') {
    window.EvaluationScene = class EvaluationScene extends Phaser.Scene {
        constructor() {
            super({ key: 'evaluationScene' });
            this.currentCategory = 0;
            this.scores = new Map(); // Store scores for validation
            this.feedback = new Map();
            this.currentCodeId = null;
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
        }

        init(data) {
            this.codeToEvaluate = data.answer;
            this.currentCodeId = data.codeId;
            this.codePrompt = data.prompt;
        }

        create() {
            this.cleanup();
            this.showEvaluationScreen();
        }

        cleanup() {
            // Remove all possible DOM elements
            const elements = document.querySelectorAll(
                '.evaluation-flex-container, .evaluation-container, .code-list-container, ' +
                '.code-view-container, .profile-form-container, .dashboard-container, ' +
                '.start-container, #back-button-container, #submit-button-container'
            );
            elements.forEach(element => {
                if (element && element.parentNode) {
                    element.parentNode.removeChild(element);
                }
            });

            // Reset the state
            this.scores = new Map();
            this.feedback = new Map();
        }

        showEvaluationScreen() {
            // Create back button
            const backButtonContainer = document.createElement('div');
            backButtonContainer.id = 'back-button-container';
            backButtonContainer.style = `
                position: absolute;
                top: 20px;
                left: 20px;
                z-index: 1000;
            `;

            const backButton = document.createElement('button');
            backButton.textContent = '← Back to Code List';
            backButton.style = `
                padding: 10px 20px;
                background-color: #444;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 16px;
            `;
            backButton.addEventListener('mouseover', () => {
                backButton.style.backgroundColor = '#555';
            });
            backButton.addEventListener('mouseout', () => {
                backButton.style.backgroundColor = '#444';
            });
            backButton.addEventListener('click', () => {
                if (confirm('Are you sure you want to go back? Any unsaved progress will be lost.')) {
                    this.cleanup();
                    this.scene.start('reviewScene');
                }
            });

            backButtonContainer.appendChild(backButton);
            document.body.appendChild(backButtonContainer);

            // Create a flex container to hold both code and rubric
            const flexContainer = document.createElement('div');
            flexContainer.className = 'evaluation-flex-container';
            flexContainer.style = `
                position: absolute;
                top: 80px;
                left: 50%;
                transform: translateX(-50%);
                width: 95%;
                display: flex;
                gap: 20px;
                margin-bottom: 100px;
            `;

            // Create code display container (left side)
            const codeContainer = document.createElement('div');
            codeContainer.style = `
                flex: 0 0 45%;
                background-color: #2a2a2a;
                border-radius: 8px;
                padding: 20px;
                position: sticky;
                top: 80px;
                max-height: calc(100vh - 120px);
                overflow-y: auto;
            `;

            // Add prompt
            const promptDiv = document.createElement('div');
            promptDiv.style = `
                margin-bottom: 15px;
                padding: 10px;
                background-color: #333;
                border-radius: 4px;
                font-size: 16px;
                color: #4CAF50;
            `;
            promptDiv.textContent = this.codePrompt;
            codeContainer.appendChild(promptDiv);

            // Add code display
            const codeDisplay = document.createElement('pre');
            codeDisplay.style = `
                background-color: #1a1a1a;
                padding: 15px;
                border-radius: 4px;
                overflow-x: auto;
                font-family: monospace;
                white-space: pre-wrap;
                font-size: 14px;
                color: #ddd;
                margin: 0;
            `;
            codeDisplay.textContent = this.codeToEvaluate;
            codeContainer.appendChild(codeDisplay);

            // Create rubric container (right side)
            const rubricContainer = document.createElement('div');
            rubricContainer.className = 'evaluation-container';
            rubricContainer.style = `
                flex: 0 0 45%;
                background-color: #2a2a2a;
                border-radius: 8px;
                padding: 20px;
                color: white;
            `;

            // Add rubric title
            const rubricTitle = document.createElement('h2');
            rubricTitle.textContent = 'Code Review Rubric';
            rubricTitle.style = `
                color: #4CAF50;
                margin-bottom: 20px;
                text-align: center;
            `;
            rubricContainer.appendChild(rubricTitle);

            // Add rubric criteria
            window.CodeRubric.categories.forEach(category => {
                category.criteria.forEach((criterion, index) => {
                    const criterionContainer = document.createElement('div');
                    criterionContainer.style = `
                        margin-bottom: 30px;
                        padding: 15px;
                        background-color: #333;
                        border-radius: 4px;
                    `;

                    const criterionTitle = document.createElement('h3');
                    criterionTitle.textContent = criterion.name;
                    criterionTitle.style = 'margin-bottom: 10px; color: #2196F3;';
                    criterionContainer.appendChild(criterionTitle);

                    const criterionDesc = document.createElement('p');
                    criterionDesc.textContent = criterion.description;
                    criterionDesc.style = 'margin-bottom: 15px; color: #ddd;';
                    criterionContainer.appendChild(criterionDesc);

                    // Score input with label
                    const scoreContainer = document.createElement('div');
                    scoreContainer.style = `
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        margin-bottom: 10px;
                    `;

                    const scoreInput = document.createElement('input');
                    scoreInput.type = 'number';
                    scoreInput.style = `
                        width: 60px;
                        padding: 5px;
                        font-size: 16px;
                        border-radius: 4px;
                        border: 1px solid #555;
                        background-color: #444;
                        color: white;
                        text-align: center;
                    `;
                    scoreInput.min = '0';
                    scoreInput.max = '5';
                    scoreInput.step = '0.1'; // Allow decimal increments to one decimal place
                    scoreInput.addEventListener('input', (e) => {
                        const value = parseFloat(e.target.value);
                        if (!isNaN(value) && value >= 0 && value <= 5) {
                            // Round to one decimal place
                            const roundedValue = Math.round(value * 10) / 10;
                            this.scores.set(index, roundedValue);
                        }
                    });

                    const scoreLabel = document.createElement('span');
                    scoreLabel.textContent = 'out of 5';
                    scoreLabel.style = `
                        color: #aaa;
                        font-size: 14px;
                    `;

                    scoreContainer.appendChild(scoreInput);
                    scoreContainer.appendChild(scoreLabel);
                    criterionContainer.appendChild(scoreContainer);

                    // Feedback textarea
                    const feedbackInput = document.createElement('textarea');
                    feedbackInput.placeholder = 'Enter feedback for this criterion...';
                    feedbackInput.style = `
                        width: 100%;
                        margin-top: 10px;
                        padding: 10px;
                        background-color: #444;
                        border: 1px solid #555;
                        color: white;
                        border-radius: 4px;
                        resize: vertical;
                        min-height: 80px;
                    `;
                    feedbackInput.addEventListener('input', (e) => {
                        this.feedback.set(index, e.target.value);
                    });
                    criterionContainer.appendChild(feedbackInput);

                    rubricContainer.appendChild(criterionContainer);
                });
            });

            // Add containers to flex container
            flexContainer.appendChild(codeContainer);
            flexContainer.appendChild(rubricContainer);
            document.body.appendChild(flexContainer);

            // Add submit button
            const submitButtonContainer = document.createElement('div');
            submitButtonContainer.id = 'submit-button-container';
            submitButtonContainer.style = `
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                width: 800px;
                text-align: center;
                z-index: 1000;
            `;

            const submitButton = document.createElement('button');
            submitButton.textContent = 'Submit Review';
            submitButton.style = `
                padding: 15px 30px;
                background-color: #4CAF50;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 18px;
                width: 200px;
            `;

            submitButton.addEventListener('click', () => {
                const totalCriteria = window.CodeRubric.categories[0].criteria.length;
                if (this.scores.size !== totalCriteria) {
                    alert('Please enter scores for all criteria before submitting.');
                    return;
                }

                const totalScore = Array.from(this.scores.values()).reduce((sum, score) => sum + score, 0);
                
                if (window.ProfileManager.saveEvaluation(
                    this.currentCodeId,
                    Array.from(this.scores.entries()).map(([criterionIndex, score]) => ({
                        criterionName: window.CodeRubric.categories[0].criteria[criterionIndex].name,
                        score: score,
                        feedback: this.feedback.get(criterionIndex) || ''
                    })),
                    Array.from(this.feedback.values()),
                    totalScore,
                    this.codePrompt
                )) {
                    alert('Review submitted successfully!');
                    this.cleanup();
                    this.scene.start('profileScene');
                } else {
                    alert('Error saving review. Please make sure you are logged in.');
                    this.scene.start('profileScene');
                }
            });

            submitButtonContainer.appendChild(submitButton);
            document.body.appendChild(submitButtonContainer);
        }

        shutdown() {
            this.cleanup();
        }
    };
}