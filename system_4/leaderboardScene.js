window.LeaderboardScene = class LeaderboardScene extends Phaser.Scene {
    constructor() {
        super({ key: 'leaderboardScene' });
    }

    create() {
        const leaderboard = window.LeaderboardData.getLeaderboard();
        
        const container = document.createElement('div');
        container.style = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 800px;
            background-color: #2a2a2a;
            border-radius: 8px;
            padding: 20px;
            color: white;
        `;

        const title = document.createElement('h2');
        title.textContent = 'Leaderboard';
        title.style = `
            text-align: center;
            color: #4CAF50;
            margin-bottom: 20px;
        `;
        container.appendChild(title);

        const leaderboardList = document.createElement('div');
        leaderboardList.style = `
            display: flex;
            flex-direction: column;
            gap: 10px;
        `;

        leaderboard.forEach(user => {
            const userRow = document.createElement('div');
            userRow.style = `
                display: grid;
                grid-template-columns: 50px 1fr 200px auto;
                align-items: center;
                padding: 15px;
                background-color: ${user.isCurrentUser ? '#1a472a' : '#333'};
                border-radius: 6px;
                gap: 20px;
            `;

            // Rank
            const rank = document.createElement('div');
            rank.textContent = `#${user.rank}`;
            rank.style = `
                font-size: 20px;
                font-weight: bold;
                color: ${user.rank <= 3 ? '#FFD700' : '#aaa'};
                text-align: center;
            `;

            // Username
            const username = document.createElement('div');
            username.textContent = user.username;
            username.style = `
                font-weight: ${user.isCurrentUser ? 'bold' : 'normal'};
                color: ${user.isCurrentUser ? '#4CAF50' : 'white'};
            `;

            // Points
            const points = document.createElement('div');
            points.textContent = `${user.points} pts`;
            points.style = `
                text-align: right;
                min-width: 150px;
                white-space: nowrap;
                overflow: visible;
                padding-right: 10px;
                font-family: monospace;
            `;

            // Badges
            const badges = document.createElement('div');
            badges.style = `
                display: flex;
                gap: 8px;
                justify-content: flex-end;
            `;

            user.badges.forEach(badgeId => {
                const badge = window.LeaderboardData.getBadgeDetails(badgeId);
                if (badge) {
                    const badgeIcon = document.createElement('span');
                    badgeIcon.textContent = badge.icon;
                    badgeIcon.title = `${badge.name}: ${badge.description}`;
                    badgeIcon.style = `
                        font-size: 20px;
                        cursor: help;
                    `;
                    badges.appendChild(badgeIcon);
                }
            });

            userRow.appendChild(rank);
            userRow.appendChild(username);
            userRow.appendChild(points);
            userRow.appendChild(badges);
            leaderboardList.appendChild(userRow);
        });

        container.appendChild(leaderboardList);

        // Back button
        const backButton = document.createElement('button');
        backButton.textContent = 'Back to Profile';
        backButton.style = `
            margin-top: 20px;
            padding: 10px 20px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            display: block;
            margin-left: auto;
            margin-right: auto;
        `;
        backButton.onclick = () => {
            container.remove();
            this.scene.start('profileScene');
        };
        container.appendChild(backButton);

        document.body.appendChild(container);
    }

    shutdown() {
        const container = document.querySelector('.leaderboard-container');
        if (container) container.remove();
    }
}; 