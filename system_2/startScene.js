window.StartScene = class StartScene extends Phaser.Scene {
    constructor() {
        super({ key: 'startScene' });
    }

    create() {
        // Clear any existing elements
        this.children.removeAll();
        
        // Remove any existing DOM elements INCLUDING points display
        const oldElements = document.querySelectorAll('.start-container, .points-display');
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

        // Add leaderboard button
        const leaderboardButton = document.createElement('button');
        leaderboardButton.textContent = 'View Leaderboard';
        leaderboardButton.style = buttonStyle + 'background-color: #9b59b6;';
        leaderboardButton.addEventListener('mouseover', () => {
            leaderboardButton.style.backgroundColor = '#8e44ad';
        });
        leaderboardButton.addEventListener('mouseout', () => {
            leaderboardButton.style.backgroundColor = '#9b59b6';
        });
        leaderboardButton.addEventListener('click', () => {
            this.showLeaderboard();
        });

        // Add rubric button
        const rubricButton = document.createElement('button');
        rubricButton.textContent = 'View Rubric';
        rubricButton.style = buttonStyle + 'background-color: #e67e22;';  // Orange color
        rubricButton.addEventListener('mouseover', () => {
            rubricButton.style.backgroundColor = '#d35400';
        });
        rubricButton.addEventListener('mouseout', () => {
            rubricButton.style.backgroundColor = '#e67e22';
        });
        rubricButton.addEventListener('click', () => {
            this.showRubric();
        });

        // Append buttons to button container
        buttonContainer.appendChild(startButton);
        buttonContainer.appendChild(profileButton);
        buttonContainer.appendChild(leaderboardButton);
        buttonContainer.appendChild(rubricButton);

        // Append elements
        startContainer.appendChild(title);
        startContainer.appendChild(buttonContainer);
        document.body.appendChild(startContainer);
    }

    showLeaderboard() {
        // Clear existing elements
        const oldElements = document.querySelectorAll('.start-container, .leaderboard-container');
        oldElements.forEach(element => element.remove());

        // Create leaderboard container
        const leaderboardContainer = document.createElement('div');
        leaderboardContainer.className = 'leaderboard-container';
        leaderboardContainer.style = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 600px;
            padding: 30px;
            background-color: #2a2a2a;
            border-radius: 8px;
            color: white;
        `;

        // Add title
        const title = document.createElement('h2');
        title.textContent = 'Leaderboard';
        title.style = `
            color: #4CAF50;
            margin-bottom: 30px;
            font-size: 28px;
            text-align: center;
        `;

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

        // Create rank info div (but don't insert it yet)
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
        leaderboardContainer.appendChild(title);
        if (currentUser) {
            leaderboardContainer.appendChild(rankInfo);
        }
        leaderboardContainer.appendChild(table);

        // Add back button
        const backButton = document.createElement('button');
        backButton.textContent = 'Back to Menu';
        backButton.style = `
            padding: 12px 24px;
            font-size: 18px;
            color: white;
            background-color: #3498db;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            display: block;
            margin: 0 auto;
        `;
        backButton.addEventListener('mouseover', () => {
            backButton.style.backgroundColor = '#2980b9';
        });
        backButton.addEventListener('mouseout', () => {
            backButton.style.backgroundColor = '#3498db';
        });
        backButton.addEventListener('click', () => {
            leaderboardContainer.remove();
            this.scene.restart();
        });
        leaderboardContainer.appendChild(backButton);

        document.body.appendChild(leaderboardContainer);
    }

    showRubric() {
        // Clear existing elements
        const oldElements = document.querySelectorAll('.start-container, .rubric-container');
        oldElements.forEach(element => element.remove());

        // Create rubric container
        const rubricContainer = document.createElement('div');
        rubricContainer.className = 'rubric-container';
        rubricContainer.style = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 800px;
            padding: 30px;
            background-color: #2a2a2a;
            border-radius: 8px;
            color: white;
            max-height: 80vh;
            overflow-y: auto;
        `;

        // Add title
        const title = document.createElement('h2');
        title.textContent = 'Code Review Rubric';
        title.style = `
            color: #4CAF50;
            margin-bottom: 30px;
            font-size: 28px;
            text-align: center;
        `;
        rubricContainer.appendChild(title);

        // Add each rubric category
        window.CodeRubric.categories.forEach(category => {
            const categorySection = document.createElement('div');
            categorySection.style = `
                margin-bottom: 30px;
                padding: 20px;
                background-color: #333;
                border-radius: 8px;
            `;

            // Category header
            const categoryHeader = document.createElement('h3');
            categoryHeader.textContent = `${category.name} (${category.maxPoints} points)`;
            categoryHeader.style = `
                color: #e67e22;
                margin-bottom: 10px;
                font-size: 20px;
            `;
            categorySection.appendChild(categoryHeader);

            // Category description
            const description = document.createElement('p');
            description.textContent = category.description;
            description.style = `
                color: #bbb;
                margin-bottom: 15px;
                font-size: 16px;
            `;
            categorySection.appendChild(description);

            // Criteria table
            const table = document.createElement('table');
            table.style = `
                width: 100%;
                border-collapse: collapse;
                margin-top: 10px;
            `;

            // Add table header
            const thead = document.createElement('thead');
            thead.innerHTML = `
                <tr style="background-color: #444;">
                    <th style="padding: 10px; text-align: left;">Score</th>
                    <th style="padding: 10px; text-align: left;">Description</th>
                </tr>
            `;
            table.appendChild(thead);

            // Add criteria rows
            const tbody = document.createElement('tbody');
            category.criteria.forEach((criterion, index) => {
                const row = document.createElement('tr');
                row.style = `background-color: ${index % 2 === 0 ? '#2a2a2a' : '#333'}`;
                row.innerHTML = `
                    <td style="padding: 10px;">${criterion.score}</td>
                    <td style="padding: 10px;">${criterion.description}</td>
                `;
                tbody.appendChild(row);
            });
            table.appendChild(tbody);
            categorySection.appendChild(table);

            rubricContainer.appendChild(categorySection);
        });

        // Add back button
        const backButton = document.createElement('button');
        backButton.textContent = 'Back to Menu';
        backButton.style = `
            padding: 12px 24px;
            font-size: 18px;
            color: white;
            background-color: #3498db;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            display: block;
            margin: 20px auto 0;
        `;
        backButton.addEventListener('mouseover', () => {
            backButton.style.backgroundColor = '#2980b9';
        });
        backButton.addEventListener('mouseout', () => {
            backButton.style.backgroundColor = '#3498db';
        });
        backButton.addEventListener('click', () => {
            rubricContainer.remove();
            this.scene.restart();
        });
        rubricContainer.appendChild(backButton);

        document.body.appendChild(rubricContainer);
    }

    shutdown() {
        // Clean up when leaving the scene
        const elements = document.querySelectorAll('.start-container, .points-display, .leaderboard-container, .rubric-container');
        elements.forEach(element => {
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
        });
    }
}; 