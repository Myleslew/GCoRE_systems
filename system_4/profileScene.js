window.ProfileScene = class ProfileScene extends Phaser.Scene {
    constructor() {
        super({ key: 'profileScene' });
    }

    create() {
        this.children.removeAll();

        // Create a container for all profile elements
        const container = document.createElement('div');
        container.style = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            min-height: 100vh;
            padding: 20px;
            box-sizing: border-box;
        `;
        document.body.appendChild(container);

        // Check if user is already logged in
        if (window.ProfileManager.loadProfile()) {
            // If character is selected, show return button
            const profile = window.ProfileManager.currentProfile;
            if (profile.character) {
                const returnButton = this.createReturnButton();
                container.appendChild(returnButton);
            }
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
            // After creating profile, go to classroom for character selection
            this.scene.start('classroomScene');
        });

        form.appendChild(usernameInput);
        form.appendChild(submitButton);
        formContainer.appendChild(title);
        formContainer.appendChild(form);
        document.body.appendChild(formContainer);
    }

    showDashboard() {
        const profile = window.ProfileManager.currentProfile;
        
        // Ensure stats exist
        if (!profile.stats) {
            profile.stats = {
                totalReviews: 0,
                averageAccuracy: 0,
                bestAccuracy: 0
            };
            window.ProfileManager.saveProfile(profile);
        }

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
            gap: 10px;
            align-items: center;
        `;

        // Common button style
        const buttonStyle = `
            padding: 12px 24px;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            transition: background-color 0.3s ease;
            min-width: 120px;
            text-align: center;
        `;

        // Start Review button
        const startButton = document.createElement('button');
        startButton.textContent = 'Start Review';
        startButton.style = `
            ${buttonStyle}
            background-color: #4CAF50;
        `;

        // Rubric Guide button
        const rubricButton = document.createElement('button');
        rubricButton.textContent = 'View Rubric';
        rubricButton.style = `
            ${buttonStyle}
            background-color: #2196F3;
        `;

        // Leaderboard button
        const leaderboardButton = document.createElement('button');
        leaderboardButton.textContent = 'Leaderboard';
        leaderboardButton.style = `
            ${buttonStyle}
            background-color: #FF9800;
        `;

        // Sign Out button
        const signOutButton = document.createElement('button');
        signOutButton.textContent = 'Sign Out';
        signOutButton.style = `
            ${buttonStyle}
            background-color: #f44336;
        `;

        // Add hover effects for all buttons
        [startButton, rubricButton, leaderboardButton, signOutButton].forEach(button => {
            button.addEventListener('mouseover', () => {
                const currentColor = button.style.backgroundColor;
                button.style.backgroundColor = this.darkenColor(currentColor);
            });
            button.addEventListener('mouseout', () => {
                const originalColor = button === startButton ? '#4CAF50' :
                                    button === rubricButton ? '#2196F3' :
                                    button === leaderboardButton ? '#FF9800' :
                                    '#f44336';
                button.style.backgroundColor = originalColor;
            });
        });

        // Add click handlers
        startButton.addEventListener('click', () => {
            dashboardContainer.remove();
            this.scene.start('startScene');
        });

        rubricButton.addEventListener('click', () => {
            this.showRubricGuide();
        });

        leaderboardButton.addEventListener('click', () => {
            this.showLeaderboard();
        });

        signOutButton.addEventListener('click', () => {
            if (confirm('Are you sure you want to sign out?')) {
                window.ProfileManager.logout();
                dashboardContainer.remove();
                this.showLoginForm();
            }
        });

        // Add all buttons to container
        buttonContainer.appendChild(startButton);
        buttonContainer.appendChild(rubricButton);
        buttonContainer.appendChild(leaderboardButton);
        buttonContainer.appendChild(signOutButton);

        // Add elements to header
        header.appendChild(welcomeText);
        header.appendChild(buttonContainer);
        dashboardContainer.appendChild(header);

        // Add badges section
        const badgesContainer = document.createElement('div');
        badgesContainer.style = `
            margin-top: 20px;
            padding: 20px;
            background-color: #333;
            border-radius: 8px;
        `;

        const badgesTitle = document.createElement('h3');
        badgesTitle.textContent = 'Earned Badges';
        badgesTitle.style = `
            color: #4CAF50;
            margin-bottom: 15px;
        `;
        badgesContainer.appendChild(badgesTitle);

        // Get user's earned badges
        const earnedBadges = window.GamificationManager.getUserBadges(profile.username);

        if (earnedBadges.length > 0) {
            const badgeGrid = document.createElement('div');
            badgeGrid.style = `
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
                gap: 15px;
            `;

            earnedBadges.forEach(badge => {
                const badgeElement = document.createElement('div');
                badgeElement.style = `
                    background-color: #2a2a2a;
                    padding: 15px;
                    border-radius: 6px;
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 8px;
                    transition: transform 0.2s ease;
                    cursor: pointer;
                `;

                badgeElement.innerHTML = `
                    <span style="font-size: 32px;">${badge.icon}</span>
                    <div style="color: #fff; font-weight: bold;">${badge.name}</div>
                    <div style="color: #aaa; font-size: 12px;">${badge.description}</div>
                `;

                // Add hover effect
                badgeElement.addEventListener('mouseover', () => {
                    badgeElement.style.transform = 'scale(1.05)';
                    badgeElement.style.backgroundColor = '#333';
                });
                badgeElement.addEventListener('mouseout', () => {
                    badgeElement.style.transform = 'scale(1)';
                    badgeElement.style.backgroundColor = '#2a2a2a';
                });

                badgeGrid.appendChild(badgeElement);
            });

            badgesContainer.appendChild(badgeGrid);
        } else {
            const noBadgesMessage = document.createElement('div');
            noBadgesMessage.textContent = 'No badges earned yet. Complete reviews to earn badges!';
            noBadgesMessage.style = 'color: #aaa; text-align: center; padding: 20px;';
            badgesContainer.appendChild(noBadgesMessage);
        }

        // Add badges container before the evaluations section
        dashboardContainer.appendChild(badgesContainer);

        // Available Badges Section
        const availableBadgesContainer = document.createElement('div');
        availableBadgesContainer.style = `
            margin-top: 20px;
            padding: 20px;
            background-color: #333;
            border-radius: 8px;
        `;

        const availableBadgesTitle = document.createElement('h3');
        availableBadgesTitle.textContent = 'Available Badges';
        availableBadgesTitle.style = `
            color: #4CAF50;
            margin-bottom: 15px;
        `;

        // Define available badges and their requirements
        const availableBadges = [
            {
                name: 'Code Review Novice',
                icon: '👶',
                description: 'Complete your first code review',
                requirement: 'Submit 1 review',
                progress: profile.stats.totalReviews >= 1 ? '100%' : '0%'
            },
            {
                name: 'Code Review Master',
                icon: '🎓',
                description: 'Complete all 5 code reviews',
                requirement: 'Submit 5 reviews',
                progress: `${Math.min((profile.stats.totalReviews / 5) * 100, 100)}%`
            },
            {
                name: 'Accuracy Master',
                icon: '🎯',
                description: 'Achieve 90% accuracy in a review',
                requirement: 'Get 90% or higher accuracy',
                progress: profile.stats.bestAccuracy >= 90 ? '100%' : '0%'
            },
            {
                name: 'Consistent Reviewer',
                icon: '📈',
                description: 'Maintain 80% average accuracy',
                requirement: 'Keep 80% average accuracy',
                progress: `${Math.min((profile.stats.averageAccuracy / 80) * 100, 100)}%`
            },
            {
                name: 'Point Collector',
                icon: '⭐',
                description: 'Earn 500 points',
                requirement: 'Accumulate 500 points',
                progress: `${Math.min((profile.points / 500) * 100, 100)}%`
            }
        ];

        const badgeGrid = document.createElement('div');
        badgeGrid.style = `
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 15px;
        `;

        availableBadges.forEach(badge => {
            const badgeElement = document.createElement('div');
            badgeElement.style = `
                background-color: #2a2a2a;
                padding: 15px;
                border-radius: 6px;
                display: flex;
                flex-direction: column;
                gap: 8px;
            `;

            // Badge header with icon and name
            const badgeHeader = document.createElement('div');
            badgeHeader.style = `
                display: flex;
                align-items: center;
                gap: 10px;
                margin-bottom: 5px;
            `;
            badgeHeader.innerHTML = `
                <span style="font-size: 24px;">${badge.icon}</span>
                <div style="color: #fff; font-weight: bold;">${badge.name}</div>
            `;

            // Badge description
            const description = document.createElement('div');
            description.textContent = badge.description;
            description.style = 'color: #ddd; font-size: 14px;';

            // Requirement
            const requirement = document.createElement('div');
            requirement.textContent = `Requirement: ${badge.requirement}`;
            requirement.style = 'color: #aaa; font-size: 12px;';

            // Progress bar
            const progressContainer = document.createElement('div');
            progressContainer.style = `
                background-color: #444;
                height: 6px;
                border-radius: 3px;
                overflow: hidden;
                margin-top: 5px;
            `;

            const progressBar = document.createElement('div');
            progressBar.style = `
                height: 100%;
                background-color: #4CAF50;
                width: ${badge.progress};
                transition: width 0.3s ease;
            `;

            // Progress text
            const progressText = document.createElement('div');
            progressText.textContent = `Progress: ${badge.progress}`;
            progressText.style = 'color: #aaa; font-size: 12px; margin-top: 5px;';

            progressContainer.appendChild(progressBar);
            badgeElement.appendChild(badgeHeader);
            badgeElement.appendChild(description);
            badgeElement.appendChild(requirement);
            badgeElement.appendChild(progressContainer);
            badgeElement.appendChild(progressText);
            badgeGrid.appendChild(badgeElement);
        });

        availableBadgesContainer.appendChild(availableBadgesTitle);
        availableBadgesContainer.appendChild(badgeGrid);
        dashboardContainer.appendChild(availableBadgesContainer);

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
                const maxScore = evaluation.scores.length * 5; // Each criterion is out of 5
                scoreDiv.textContent = `Total Score: ${evaluation.totalScore}/${maxScore}`;
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

    shutdown() {
        // Clean up any DOM elements when leaving the scene
        const elements = document.querySelectorAll('.profile-form-container, .dashboard-container, div[style*="position: absolute"]');
        elements.forEach(element => {
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
        });
    }

    // Add a return button to the profile scene
    createReturnButton() {
        const returnButton = document.createElement('button');
        returnButton.textContent = 'Return to Classroom';
        returnButton.style = `
            padding: 10px 20px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            margin-top: 20px;
        `;
        
        returnButton.addEventListener('mouseover', () => {
            returnButton.style.backgroundColor = '#45a049';
        });
        
        returnButton.addEventListener('mouseout', () => {
            returnButton.style.backgroundColor = '#4CAF50';
        });
        
        returnButton.addEventListener('click', () => {
            // Clean up the profile scene
            this.shutdown();
            // Return to classroom scene
            this.scene.start('classroomScene');
        });

        return returnButton;
    }

    // Add new method to show rubric guide
    showRubricGuide() {
        const rubricContainer = document.createElement('div');
        rubricContainer.style = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 80%;
            max-width: 800px;
            max-height: 80vh;
            overflow-y: auto;
            background-color: #2a2a2a;
            padding: 30px;
            border-radius: 8px;
            color: white;
            z-index: 1001;
        `;

        const title = document.createElement('h2');
        title.textContent = 'Code Review Rubric Guide';
        title.style = 'color: #4CAF50; margin-bottom: 20px; text-align: center;';
        rubricContainer.appendChild(title);

        // Add close button
        const closeButton = document.createElement('button');
        closeButton.textContent = '×';
        closeButton.style = `
            position: absolute;
            top: 10px;
            right: 10px;
            background: none;
            border: none;
            color: #fff;
            font-size: 24px;
            cursor: pointer;
            padding: 5px 10px;
        `;
        closeButton.addEventListener('click', () => {
            rubricContainer.remove();
        });
        rubricContainer.appendChild(closeButton);

        // Add each criterion from the rubric
        window.CodeRubric.categories.forEach(category => {
            category.criteria.forEach(criterion => {
                const criterionDiv = document.createElement('div');
                criterionDiv.style = `
                    background-color: #333;
                    padding: 20px;
                    margin-bottom: 20px;
                    border-radius: 4px;
                `;

                const criterionName = document.createElement('h3');
                criterionName.textContent = criterion.name;
                criterionName.style = 'color: #2196F3; margin-bottom: 10px;';

                const criterionDesc = document.createElement('p');
                criterionDesc.textContent = criterion.description;
                criterionDesc.style = 'color: #ddd; margin-bottom: 15px;';

                const scoreGuide = document.createElement('div');
                scoreGuide.style = 'color: #aaa; font-size: 14px;';
                scoreGuide.innerHTML = `
                    <strong>Scoring Guide (1-5):</strong><br>
                    5: Exceptional - ${criterion.description}<br>
                    4: Proficient - Good implementation with minor issues<br>
                    3: Satisfactory - Meets basic requirements<br>
                    2: Developing - Needs significant improvement<br>
                    1: Needs Work - Major issues or incomplete
                `;

                criterionDiv.appendChild(criterionName);
                criterionDiv.appendChild(criterionDesc);
                criterionDiv.appendChild(scoreGuide);
                rubricContainer.appendChild(criterionDiv);
            });
        });

        document.body.appendChild(rubricContainer);
    }

    // Add this new method to the ProfileScene class
    showLeaderboard() {
        // Get leaderboard data including current user
        const leaderboardUsers = window.LeaderboardData.getLeaderboard();

        // Create leaderboard container
        const leaderboardContainer = document.createElement('div');
        leaderboardContainer.style = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: rgba(0, 0, 0, 0.95);
            padding: 30px;
            border-radius: 8px;
            color: white;
            z-index: 1000;
            min-width: 600px;
            max-width: 800px;
            max-height: 80vh;
            overflow-y: auto;
        `;

        // Create title
        const title = document.createElement('h2');
        title.textContent = 'Global Leaderboard';
        title.style = 'color: #4CAF50; margin-bottom: 20px; text-align: center;';
        leaderboardContainer.appendChild(title);

        // Create leaderboard table
        const table = document.createElement('table');
        table.style = `
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        `;

        // Add table header
        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr>
                <th style="padding: 10px; text-align: left; border-bottom: 2px solid #4CAF50;">Rank</th>
                <th style="padding: 10px; text-align: left; border-bottom: 2px solid #4CAF50;">Username</th>
                <th style="padding: 10px; text-align: right; border-bottom: 2px solid #4CAF50;">Points</th>
                <th style="padding: 10px; text-align: right; border-bottom: 2px solid #4CAF50;">Badges</th>
                <th style="padding: 10px; text-align: right; border-bottom: 2px solid #4CAF50;">Reviews</th>
                <th style="padding: 10px; text-align: right; border-bottom: 2px solid #4CAF50;">Accuracy</th>
            </tr>
        `;
        table.appendChild(thead);

        // Add table body
        const tbody = document.createElement('tbody');
        leaderboardUsers.forEach((user) => {
            const row = document.createElement('tr');
            row.style = 'border-bottom: 1px solid #333;';
            
            // Highlight current user's row
            if (user.isCurrentUser) {
                row.style.backgroundColor = 'rgba(76, 175, 80, 0.1)';
                row.style.fontWeight = 'bold';
            }

            // Get user's stats
            const stats = window.ProfileManager.currentProfile?.stats || {
                totalReviews: 0,
                averageAccuracy: 0
            };

            row.innerHTML = `
                <td style="padding: 10px;">${user.rank}</td>
                <td style="padding: 10px;">${user.username}${user.isCurrentUser ? ' (You)' : ''}</td>
                <td style="padding: 10px; text-align: right;">${user.points}</td>
                <td style="padding: 10px; text-align: right;">${Array.isArray(user.badges) ? user.badges.length : user.badges}</td>
                <td style="padding: 10px; text-align: right;">${user.totalReviews || stats.totalReviews}/5</td>
                <td style="padding: 10px; text-align: right;">${user.averageAccuracy || stats.averageAccuracy}%</td>
            `;
            tbody.appendChild(row);
        });
        table.appendChild(tbody);
        leaderboardContainer.appendChild(table);

        // Add close button
        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.style = `
            padding: 10px 20px;
            background-color: #666;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            margin-top: 20px;
            width: 100%;
        `;
        closeButton.addEventListener('click', () => {
            leaderboardContainer.remove();
        });
        leaderboardContainer.appendChild(closeButton);

        document.body.appendChild(leaderboardContainer);
    }

    // Add helper method for darkening colors
    darkenColor(color) {
        // Convert hex to RGB
        const hex = color.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        
        // Darken by 20%
        const darken = 0.2;
        const newR = Math.floor(r * (1 - darken));
        const newG = Math.floor(g * (1 - darken));
        const newB = Math.floor(b * (1 - darken));
        
        // Convert back to hex
        return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
    }
}; 