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

        // View Available Badges button
        const badgesButton = document.createElement('button');
        badgesButton.textContent = 'View Available Badges';
        badgesButton.style = `
            padding: 12px 24px;
            background-color: #9C27B0;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            transition: background-color 0.3s ease;
        `;
        badgesButton.addEventListener('mouseover', () => {
            badgesButton.style.backgroundColor = '#7B1FA2';
        });
        badgesButton.addEventListener('mouseout', () => {
            badgesButton.style.backgroundColor = '#9C27B0';
        });
        badgesButton.addEventListener('click', () => {
            this.showAvailableBadges();
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
        buttonContainer.appendChild(badgesButton);
        buttonContainer.appendChild(startButton);
        buttonContainer.appendChild(signOutButton);

        // Add leaderboard button
        const leaderboardButton = document.createElement('button');
        leaderboardButton.textContent = 'Leaderboard';
        leaderboardButton.style = `
            padding: 12px 24px;
            background-color: #9b59b6;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            transition: background-color 0.3s ease;
        `;
        leaderboardButton.addEventListener('mouseover', () => {
            leaderboardButton.style.backgroundColor = '#8e44ad';
        });
        leaderboardButton.addEventListener('mouseout', () => {
            leaderboardButton.style.backgroundColor = '#9b59b6';
        });
        leaderboardButton.addEventListener('click', () => {
            this.showLeaderboard();
        });
        buttonContainer.appendChild(leaderboardButton);

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
                `;

                badgeElement.innerHTML = `
                    <span style="font-size: 32px;">${badge.icon}</span>
                    <div style="color: #fff; font-weight: bold;">${badge.name}</div>
                    <div style="color: #aaa; font-size: 12px;">${badge.description}</div>
                `;

                badgeGrid.appendChild(badgeElement);
            });

            badgesContainer.appendChild(badgeGrid);
        } else {
            const noBadgesMessage = document.createElement('div');
            noBadgesMessage.textContent = 'No badges earned yet. Complete reviews to earn badges!';
            noBadgesMessage.style = 'color: #aaa; text-align: center; padding: 20px;';
            badgesContainer.appendChild(noBadgesMessage);
        }

        dashboardContainer.appendChild(badgesContainer);

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
        // Create modal container
        const modalContainer = document.createElement('div');
        modalContainer.style = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        `;

        // Create content container
        const contentContainer = document.createElement('div');
        contentContainer.style = `
            background-color: #2a2a2a;
            padding: 30px;
            border-radius: 8px;
            width: 80%;
            max-width: 800px;
            max-height: 80vh;
            overflow-y: auto;
            color: white;
        `;

        // Add title
        const title = document.createElement('h2');
        title.textContent = 'Code Review Rubric';
        title.style = `
            color: #4CAF50;
            margin-bottom: 20px;
            text-align: center;
        `;
        contentContainer.appendChild(title);

        // Add rubric categories
        window.CodeRubric.categories.forEach(category => {
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

            // Add criteria
            category.criteria.forEach(criterion => {
                const criterionContainer = document.createElement('div');
                criterionContainer.style = `
                    margin: 10px 0;
                    padding: 10px;
                    background-color: #2a2a2a;
                    border-radius: 4px;
                `;

                const criterionLabel = document.createElement('div');
                criterionLabel.textContent = criterion.label;
                criterionLabel.style = `
                    color: #fff;
                    font-weight: bold;
                    margin-bottom: 5px;
                `;

                const criterionDescription = document.createElement('div');
                criterionDescription.textContent = criterion.description;
                criterionDescription.style = `
                    color: #aaa;
                    font-size: 14px;
                `;

                criterionContainer.appendChild(criterionLabel);
                criterionContainer.appendChild(criterionDescription);
                categoryContainer.appendChild(criterionContainer);
            });

            contentContainer.appendChild(categoryContainer);
        });

        // Add close button
        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.style = `
            display: block;
            margin: 20px auto 0;
            padding: 12px 24px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
        `;
        closeButton.addEventListener('click', () => {
            modalContainer.remove();
        });
        contentContainer.appendChild(closeButton);

        modalContainer.appendChild(contentContainer);
        document.body.appendChild(modalContainer);
    }

    showAvailableBadges() {
        // Create modal container
        const modalContainer = document.createElement('div');
        modalContainer.style = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        `;

        // Create content container
        const contentContainer = document.createElement('div');
        contentContainer.style = `
            background-color: #2a2a2a;
            padding: 30px;
            border-radius: 8px;
            width: 80%;
            max-width: 800px;
            max-height: 80vh;
            overflow-y: auto;
            color: white;
            position: relative;
        `;

        // Add close button at the top
        const closeButton = document.createElement('button');
        closeButton.textContent = '×';
        closeButton.style = `
            position: absolute;
            top: 10px;
            left: 10px;
            width: 30px;
            height: 30px;
            background-color: #f44336;
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            font-size: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background-color 0.3s ease;
        `;
        closeButton.addEventListener('mouseover', () => {
            closeButton.style.backgroundColor = '#d32f2f';
        });
        closeButton.addEventListener('mouseout', () => {
            closeButton.style.backgroundColor = '#f44336';
        });
        closeButton.addEventListener('click', () => {
            modalContainer.remove();
        });
        contentContainer.appendChild(closeButton);

        // Add title
        const title = document.createElement('h2');
        title.textContent = 'Available Badges';
        title.style = `
            color: #4CAF50;
            margin-bottom: 20px;
            text-align: center;
            padding-left: 30px;
        `;
        contentContainer.appendChild(title);

        // Get current user's earned badges
        const currentUser = window.ProfileManager.currentProfile?.username;
        const earnedBadges = window.GamificationManager.userBadges.get(currentUser) || new Set();

        // Create badge grid
        const badgeGrid = document.createElement('div');
        badgeGrid.style = `
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 20px;
            padding: 20px;
        `;

        // Add all possible badges from each category
        Object.entries(window.BadgeSystem.badges).forEach(([category, badges]) => {
            badges.forEach(badge => {
                const badgeElement = document.createElement('div');
                const isEarned = earnedBadges.has(badge.id);
                
                badgeElement.style = `
                    background-color: ${isEarned ? '#2a2a2a' : '#333'};
                    padding: 20px;
                    border-radius: 8px;
                    border: 2px solid ${isEarned ? '#4CAF50' : '#444'};
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 10px;
                    opacity: ${isEarned ? '1' : '0.8'};
                `;

                // Badge icon
                const icon = document.createElement('span');
                icon.textContent = badge.icon;
                icon.style = `
                    font-size: 48px;
                    color: ${isEarned ? '#4CAF50' : '#666'};
                `;

                // Badge name
                const name = document.createElement('div');
                name.textContent = badge.name;
                name.style = `
                    color: ${isEarned ? '#4CAF50' : '#fff'};
                    font-size: 20px;
                    font-weight: bold;
                    text-align: center;
                `;

                // Badge description
                const description = document.createElement('div');
                description.textContent = badge.description;
                description.style = `
                    color: #aaa;
                    font-size: 14px;
                    text-align: center;
                    margin-bottom: 10px;
                `;

                // Requirements
                const requirements = document.createElement('div');
                requirements.style = `
                    color: #888;
                    font-size: 13px;
                    text-align: center;
                    font-style: italic;
                `;

                // Format requirements based on badge category
                if (category === 'reviewCount') {
                    requirements.textContent = `Complete ${badge.requirement} code reviews`;
                } else if (category === 'accuracy') {
                    requirements.textContent = `Achieve ${badge.requirement}% accuracy in reviews`;
                } else if (category === 'wordCount') {
                    requirements.textContent = `Write ${badge.requirement} words in a review`;
                } else if (category === 'points') {
                    requirements.textContent = `Earn ${badge.requirement} total points`;
                } else if (category === 'ranking') {
                    requirements.textContent = `Reach rank ${badge.requirement} on the leaderboard`;
                }

                // Status indicator
                const status = document.createElement('div');
                status.textContent = isEarned ? '✓ Earned' : 'Not Earned';
                status.style = `
                    color: ${isEarned ? '#4CAF50' : '#666'};
                    font-size: 14px;
                    font-weight: bold;
                    margin-top: 5px;
                `;

                badgeElement.appendChild(icon);
                badgeElement.appendChild(name);
                badgeElement.appendChild(description);
                badgeElement.appendChild(requirements);
                badgeElement.appendChild(status);

                badgeGrid.appendChild(badgeElement);
            });
        });

        contentContainer.appendChild(badgeGrid);
        modalContainer.appendChild(contentContainer);
        document.body.appendChild(modalContainer);
    }

    showLeaderboard() {
        // Create modal container
        const modalContainer = document.createElement('div');
        modalContainer.style = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        `;

        // Create content container
        const contentContainer = document.createElement('div');
        contentContainer.style = `
            background-color: #2a2a2a;
            padding: 30px;
            border-radius: 8px;
            width: 80%;
            max-width: 800px;
            max-height: 80vh;
            overflow-y: auto;
            color: white;
            position: relative;
        `;

        // Add close button
        const closeButton = document.createElement('button');
        closeButton.textContent = '×';
        closeButton.style = `
            position: absolute;
            top: 10px;
            right: 10px;
            width: 30px;
            height: 30px;
            background-color: #f44336;
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            font-size: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background-color 0.3s ease;
        `;
        closeButton.addEventListener('mouseover', () => {
            closeButton.style.backgroundColor = '#d32f2f';
        });
        closeButton.addEventListener('mouseout', () => {
            closeButton.style.backgroundColor = '#f44336';
        });
        closeButton.addEventListener('click', () => {
            modalContainer.remove();
        });
        contentContainer.appendChild(closeButton);

        // Add title
        const title = document.createElement('h2');
        title.textContent = 'Leaderboard';
        title.style = `
            color: #4CAF50;
            margin-bottom: 30px;
            font-size: 28px;
            text-align: center;
        `;
        contentContainer.appendChild(title);

        // Get current user and create combined leaderboard data
        const currentUser = window.ProfileManager.currentProfile;
        let leaderboardData = [...window.LeaderboardData.users];
        
        // Add current user to leaderboard if logged in
        if (currentUser) {
            const userExists = leaderboardData.some(user => user.username === currentUser.username);
            if (!userExists) {
                leaderboardData.push({
                    username: currentUser.username,
                    points: currentUser.points,
                    evaluations: currentUser.evaluations ? currentUser.evaluations.length : 0,
                    joinedDate: currentUser.createdAt
                });
            }
        }

        // Sort leaderboard by points
        leaderboardData.sort((a, b) => b.points - a.points);

        // Create rank info div
        const rankInfo = document.createElement('div');
        rankInfo.style = `
            text-align: center;
            margin-bottom: 20px;
            color: #4CAF50;
            font-size: 18px;
        `;

        // Create and style table
        const table = document.createElement('table');
        table.style = `
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        `;

        // Add table header
        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr style="
                background-color: #444;
                font-weight: bold;
                text-align: left;
            ">
                <th style="padding: 12px;">Rank</th>
                <th style="padding: 12px;">Username</th>
                <th style="padding: 12px;">Points</th>
                <th style="padding: 12px;">Reviews</th>
            </tr>
        `;
        table.appendChild(thead);

        // Add table body
        const tbody = document.createElement('tbody');
        leaderboardData.forEach((user, index) => {
            const row = document.createElement('tr');
            const isCurrentUser = currentUser && user.username === currentUser.username;
            
            // Highlight current user's row and alternate row colors
            row.style = `
                background-color: ${isCurrentUser ? '#2c3e50' : (index % 2 === 0 ? 'transparent' : '#333')};
                ${isCurrentUser ? 'font-weight: bold;' : ''}
            `;
            
            row.innerHTML = `
                <td style="padding: 12px;">${index + 1}</td>
                <td style="padding: 12px;">${user.username}${isCurrentUser ? ' (You)' : ''}</td>
                <td style="padding: 12px;">${user.points}</td>
                <td style="padding: 12px;">${user.evaluations}</td>
            `;
            tbody.appendChild(row);

            // Update rank info text if this is current user
            if (isCurrentUser) {
                rankInfo.textContent = `Your Rank: ${index + 1} of ${leaderboardData.length}`;
            }
        });
        table.appendChild(tbody);

        // Add elements to container in correct order
        contentContainer.appendChild(title);
        if (currentUser) {
            contentContainer.appendChild(rankInfo);
        }
        contentContainer.appendChild(table);

        modalContainer.appendChild(contentContainer);
        document.body.appendChild(modalContainer);
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