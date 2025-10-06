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
            // Check login status first
            if (!window.ProfileManager.isLoggedIn()) {
                alert('Please log in to submit reviews');
                this.scene.start('profileScene');
                return;
            }
            
            this.cleanup();
            this.showEvaluationScreen();
        }

        cleanup() {
            // Remove all possible DOM elements INCLUDING points display
            const elements = document.querySelectorAll(
                '.evaluation-flex-container, .evaluation-container, .code-list-container, ' +
                '.code-view-container, .profile-form-container, .dashboard-container, ' +
                '.start-container, #back-button-container, #submit-button-container, ' +
                '.points-display'  // Add points-display to cleanup
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
            window.CodeRubric.categories.forEach((category, index) => {
                const categoryContainer = document.createElement('div');
                categoryContainer.style = `
                    margin-bottom: 30px;
                    padding: 20px;
                    background-color: #333;
                    border-radius: 8px;
                `;

                // Category header
                const categoryHeader = document.createElement('h3');
                categoryHeader.textContent = `${category.name} (1.0-5.0)`;
                categoryHeader.style = `
                    color: #e67e22;
                    margin-bottom: 10px;
                    font-size: 20px;
                `;
                categoryContainer.appendChild(categoryHeader);

                // Category description
                const description = document.createElement('p');
                description.textContent = category.description;
                description.style = `
                    color: #bbb;
                    margin-bottom: 15px;
                    font-size: 16px;
                `;
                categoryContainer.appendChild(description);

                // Single score input
                const scoreInput = document.createElement('input');
                scoreInput.type = 'number';
                scoreInput.min = '1';
                scoreInput.max = '5';
                scoreInput.step = '0.1';  // Allow decimal steps of 0.1
                scoreInput.placeholder = 'Score (1.0-5.0)';
                scoreInput.style = `
                    width: 100px;
                    padding: 8px;
                    font-size: 16px;
                    margin-bottom: 10px;
                    border: 2px solid #444;
                    border-radius: 4px;
                    background-color: #2a2a2a;
                    color: white;
                `;
                
                // Add event listener to store score
                scoreInput.addEventListener('change', (e) => {
                    const score = parseFloat(e.target.value);
                    if (score >= 1.0 && score <= 5.0) {
                        this.scores.set(index, score);
                    } else {
                        alert('Please enter a score between 1.0 and 5.0');
                        e.target.value = '';
                    }
                });

                categoryContainer.appendChild(scoreInput);

                // Optional feedback textarea
                const feedbackInput = document.createElement('textarea');
                feedbackInput.placeholder = 'Optional feedback...';
                feedbackInput.style = `
                    width: 100%;
                    height: 80px;
                    padding: 8px;
                    margin-top: 10px;
                    font-size: 14px;
                    border: 2px solid #444;
                    border-radius: 4px;
                    background-color: #2a2a2a;
                    color: white;
                    resize: vertical;
                `;
                
                feedbackInput.addEventListener('change', (e) => {
                    this.feedback.set(index, e.target.value);
                });

                categoryContainer.appendChild(feedbackInput);
                rubricContainer.appendChild(categoryContainer);
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
                
                const scores = Array.from(this.scores.entries()).map(([criterionIndex, score]) => {
                    // Get the actual criterion name from the rubric
                    const criterion = window.CodeRubric.categories[criterionIndex];
                    return {
                        criterionName: criterion.name, // This ensures we use the exact name from the rubric
                        score: score,
                        feedback: this.feedback.get(criterionIndex) || ''
                    };
                });

                console.log('Submitting scores:', scores); // Debug log

                if (window.ProfileManager.saveEvaluation(
                    this.currentCodeId,
                    scores,
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