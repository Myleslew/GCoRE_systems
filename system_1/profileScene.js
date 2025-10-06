window.ProfileScene = class ProfileScene extends Phaser.Scene {
    constructor() {
        super({ key: 'profileScene' });
    }

    create() {
        this.children.removeAll();

        // Check if user is already logged in
        if (window.ProfileManager.loadProfile()) {
            this.showDashboard();
        } else {
            this.showLoginForm();
        }
    }

    showLoginForm() {
        const formContainer = document.createElement('div');
        formContainer.className = 'profile-form-container';
        formContainer.style = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 400px;
            padding: 30px;
            background-color: #2a2a2a;
            border-radius: 8px;
            color: white;
        `;

        const title = document.createElement('h2');
        title.textContent = 'Create Your Profile';
        title.style = `
            text-align: center;
            margin-bottom: 30px;
            color: #4CAF50;
        `;

        const form = document.createElement('form');
        form.style = `
            display: flex;
            flex-direction: column;
            gap: 20px;
        `;

        // Username input
        const usernameInput = document.createElement('input');
        usernameInput.type = 'text';
        usernameInput.placeholder = 'Username';
        usernameInput.required = true;
        usernameInput.style = `
            padding: 10px;
            border: none;
            border-radius: 4px;
            background-color: #333;
            color: white;
            font-size: 16px;
        `;

        // Submit button
        const submitButton = document.createElement('button');
        submitButton.textContent = 'Create Profile';
        submitButton.type = 'submit';
        submitButton.style = `
            padding: 12px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            margin-top: 10px;
        `;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const profile = window.ProfileManager.createProfile(
                usernameInput.value
            );
            formContainer.remove();
            this.showDashboard();
        });

        form.appendChild(usernameInput);
        form.appendChild(submitButton);
        formContainer.appendChild(title);
        formContainer.appendChild(form);
        document.body.appendChild(formContainer);
    }

    showDashboard() {
        const profile = window.ProfileManager.currentProfile;
        
        const dashboardContainer = document.createElement('div');
        dashboardContainer.className = 'dashboard-container';
        dashboardContainer.style = `
            position: absolute;
            top: 80px;
            left: 50%;
            transform: translateX(-50%);
            width: 800px;
            padding: 20px;
            background-color: #2a2a2a;
            border-radius: 8px;
            color: white;
            margin-bottom: 40px;
        `;

        // Profile header with three buttons
        const header = document.createElement('div');
        header.style = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 1px solid #444;
        `;

        const welcomeText = document.createElement('h2');
        welcomeText.textContent = `Welcome, ${profile.username}!`;
        welcomeText.style = 'color: #4CAF50; margin: 0;';

        // Button container for better organization
        const buttonContainer = document.createElement('div');
        buttonContainer.style = `
            display: flex;
            gap: 15px;
            align-items: center;
        `;

        // View Rubric button
        const rubricButton = document.createElement('button');
        rubricButton.textContent = 'View Rubric';
        rubricButton.style = `
            padding: 12px 24px;
            background-color: #2196F3;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            transition: background-color 0.3s ease;
        `;
        rubricButton.addEventListener('mouseover', () => {
            rubricButton.style.backgroundColor = '#1976D2';
        });
        rubricButton.addEventListener('mouseout', () => {
            rubricButton.style.backgroundColor = '#2196F3';
        });
        rubricButton.addEventListener('click', () => {
            this.showRubricInfo();
        });

        // Start Review button
        const startButton = document.createElement('button');
        startButton.textContent = 'Start Review';
        startButton.style = `
            padding: 12px 24px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            transition: background-color 0.3s ease;
        `;
        startButton.addEventListener('mouseover', () => {
            startButton.style.backgroundColor = '#45a049';
        });
        startButton.addEventListener('mouseout', () => {
            startButton.style.backgroundColor = '#4CAF50';
        });
        startButton.addEventListener('click', () => {
            dashboardContainer.remove();
            this.scene.start('startScene');
        });

        // Sign Out button
        const signOutButton = document.createElement('button');
        signOutButton.textContent = 'Sign Out';
        signOutButton.style = `
            padding: 12px 24px;
            background-color: #f44336;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            transition: background-color 0.3s ease;
        `;
        signOutButton.addEventListener('mouseover', () => {
            signOutButton.style.backgroundColor = '#d32f2f';
        });
        signOutButton.addEventListener('mouseout', () => {
            signOutButton.style.backgroundColor = '#f44336';
        });
        signOutButton.addEventListener('click', () => {
            if (confirm('Are you sure you want to sign out?')) {
                window.ProfileManager.logout();
                dashboardContainer.remove();
                this.showLoginForm();
            }
        });

        // Add buttons to container
        buttonContainer.appendChild(rubricButton);
        buttonContainer.appendChild(startButton);
        buttonContainer.appendChild(signOutButton);

        // Add elements to header
        header.appendChild(welcomeText);
        header.appendChild(buttonContainer);
        dashboardContainer.appendChild(header);

        // Recent evaluations
        const evaluations = window.ProfileManager.getEvaluations();
        if (evaluations.length > 0) {
            const recentTitle = document.createElement('h3');
            recentTitle.textContent = 'Your Reviews';
            recentTitle.style = 'margin-bottom: 20px; color: #4CAF50;';
            dashboardContainer.appendChild(recentTitle);

            const evaluationsList = document.createElement('div');
            evaluationsList.style = 'display: flex; flex-direction: column; gap: 15px;';

            evaluations.reverse().forEach(evaluation => {
                const evalItem = document.createElement('div');
                evalItem.style = `
                    padding: 20px;
                    background-color: #333;
                    border-radius: 4px;
                `;

                const dateStr = new Date(evaluation.date).toLocaleDateString();
                
                // Create header with three sections: date, prompt, and score
                const header = document.createElement('div');
                header.style = `
                    margin-bottom: 15px;
                    padding-bottom: 10px;
                    border-bottom: 1px solid #444;
                `;

                // Date section
                const dateDiv = document.createElement('div');
                dateDiv.textContent = `Review Date: ${dateStr}`;
                dateDiv.style = 'color: #4CAF50; font-weight: bold; margin-bottom: 10px;';
                header.appendChild(dateDiv);

                // Code prompt section
                const promptDiv = document.createElement('div');
                promptDiv.style = `
                    color: #fff;
                    margin-bottom: 10px;
                    padding: 10px;
                    background-color: #2a2a2a;
                    border-radius: 4px;
                    font-size: 0.95em;
                `;
                promptDiv.innerHTML = `<strong>Code Sample:</strong> ${evaluation.codePrompt || 'Sample Code Review'}`;
                header.appendChild(promptDiv);

                // Score section
                const scoreDiv = document.createElement('div');
                scoreDiv.textContent = `Total Score: ${evaluation.totalScore}/25`;
                scoreDiv.style = 'color: #fff; font-weight: bold;';
                header.appendChild(scoreDiv);

                evalItem.appendChild(header);

                // Add detailed scores and feedback
                const detailsContainer = document.createElement('div');
                detailsContainer.style = 'margin-top: 10px;';

                evaluation.scores.forEach(score => {
                    const scoreItem = document.createElement('div');
                    scoreItem.style = 'margin-bottom: 15px;';
                    
                    const criterionName = document.createElement('div');
                    criterionName.textContent = score.criterionName;
                    criterionName.style = 'color: #2196F3; margin-bottom: 5px;';
                    
                    const scoreValue = document.createElement('div');
                    scoreValue.textContent = `Score: ${score.score}/5`;
                    scoreValue.style = 'color: #aaa; margin-bottom: 5px;';

                    scoreItem.appendChild(criterionName);
                    scoreItem.appendChild(scoreValue);

                    if (score.feedback) {
                        const feedbackText = document.createElement('div');
                        feedbackText.textContent = `Feedback: ${score.feedback}`;
                        feedbackText.style = 'color: #ddd; font-style: italic;';
                        scoreItem.appendChild(feedbackText);
                    }

                    detailsContainer.appendChild(scoreItem);
                });

                evalItem.appendChild(detailsContainer);
                evaluationsList.appendChild(evalItem);
            });

            dashboardContainer.appendChild(evaluationsList);
        } else {
            const noReviews = document.createElement('div');
            noReviews.textContent = 'No reviews submitted yet. Start reviewing code!';
            noReviews.style = 'text-align: center; color: #aaa; margin-top: 20px;';
            dashboardContainer.appendChild(noReviews);
        }

        document.body.appendChild(dashboardContainer);
    }

    showRubricInfo() {
        const rubricContainer = document.createElement('div');
        rubricContainer.className = 'rubric-container';
        rubricContainer.style = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 80%;
            max-width: 800px;
            max-height: 80vh;
            padding: 30px;
            background-color: #2a2a2a;
            border-radius: 8px;
            color: white;
            overflow-y: auto;
            z-index: 1000;
        `;

        const title = document.createElement('h2');
        title.textContent = 'Code Review Rubric';
        title.style = `
            text-align: center;
            margin-bottom: 30px;
            color: #4CAF50;
        `;

        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.style = `
            position: absolute;
            top: 20px;
            right: 20px;
            padding: 8px 16px;
            background-color: #f44336;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        `;
        closeButton.addEventListener('click', () => {
            rubricContainer.remove();
        });

        const content = document.createElement('div');
        content.style = 'margin-top: 20px;';

        // Add rubric categories and criteria
        window.CodeRubric.categories.forEach(category => {
            const categoryDiv = document.createElement('div');
            categoryDiv.style = 'margin-bottom: 30px;';

            const categoryTitle = document.createElement('h3');
            categoryTitle.textContent = category.name;
            categoryTitle.style = 'color: #2196F3; margin-bottom: 15px;';
            categoryDiv.appendChild(categoryTitle);

            category.criteria.forEach(criterion => {
                const criterionDiv = document.createElement('div');
                criterionDiv.style = `
                    margin-bottom: 20px;
                    padding: 15px;
                    background-color: #333;
                    border-radius: 4px;
                `;

                const criterionName = document.createElement('h4');
                criterionName.textContent = criterion.name;
                criterionName.style = 'color: #4CAF50; margin-bottom: 10px;';
                criterionDiv.appendChild(criterionName);

                const criterionDesc = document.createElement('p');
                criterionDesc.textContent = criterion.description;
                criterionDesc.style = 'color: #ddd; margin-bottom: 10px;';
                criterionDiv.appendChild(criterionDesc);

                const scoreInfo = document.createElement('div');
                scoreInfo.textContent = `Score Range: 0-5 points`;
                scoreInfo.style = 'color: #aaa; font-style: italic;';
                criterionDiv.appendChild(scoreInfo);

                categoryDiv.appendChild(criterionDiv);
            });

            content.appendChild(categoryDiv);
        });

        rubricContainer.appendChild(title);
        rubricContainer.appendChild(closeButton);
        rubricContainer.appendChild(content);
        document.body.appendChild(rubricContainer);
    }

    shutdown() {
        const elements = document.querySelectorAll('.profile-form-container, .dashboard-container');
        elements.forEach(element => {
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
        });
    }
}; 