class GamificationSystem {
    constructor() {
        this.userPoints = new Map(); // Store points per user
        this.userBadges = new Map(); // Store badges per user
        this.loadUserData();
    }

    loadUserData() {
        const savedData = localStorage.getItem('gamificationData');
        console.log('Loading saved data:', savedData);
        
        if (savedData) {
            try {
                const data = JSON.parse(savedData);
                console.log('Parsed data:', data);
                
                // Convert the points array back to a Map
                if (Array.isArray(data.points)) {
                    data.points.forEach(([username, points]) => {
                        this.userPoints.set(username, parseInt(points));
                    });
                }
                
                // Convert badge arrays to Sets when loading
                this.userBadges = new Map();
                Object.entries(data.badges || {}).forEach(([username, badges]) => {
                    this.userBadges.set(username, new Set(badges));
                });
                
                console.log('Loaded points map:', this.userPoints);
            } catch (e) {
                console.error('Error loading gamification data:', e);
                this.userPoints = new Map();
                this.userBadges = new Map();
            }
        }
    }

    addPoints(type, amount, instructorGrades, studentGrades) {
        const currentUser = window.ProfileManager.currentProfile?.username;
        if (!currentUser) {
            console.error('No current user found');
            return;
        }

        let pointsToAdd = 0;

        // If we have grades, calculate points using Euclidean distance
        if (instructorGrades && studentGrades) {
            pointsToAdd = this.calculateReviewPoints(instructorGrades, studentGrades);
        } else {
            // Fall back to direct point assignment for non-review points
            pointsToAdd = typeof amount === 'undefined' ? parseInt(type) : parseInt(amount);
        }

        const currentPoints = this.getPoints();
        const newPoints = currentPoints + pointsToAdd;
        
        console.log('Adding points:', {
            currentUser,
            currentPoints,
            pointsToAdd,
            newPoints,
            calculationMethod: instructorGrades ? 'euclidean' : 'direct'
        });

        this.userPoints.set(currentUser, newPoints);
        window.ProfileManager.updatePoints(pointsToAdd);
        
        // Ensure points display exists and update it
        this.ensurePointsDisplay();
        this.updatePointsDisplay(newPoints);
        
        this.checkBadges(currentUser);
        this.saveUserData();

        return pointsToAdd;
    }

    calculateReviewPoints(instructorGrades, studentGrades) {
        console.log('Starting calculateReviewPoints:', {
            instructorGrades,
            studentGrades
        });

        // Base points for completing a review
        const basePoints = 50;
        console.log('Base points:', basePoints);

        // Calculate average difference
        const avgDifference = this.calculateDistance(instructorGrades, studentGrades);
        console.log('Average difference:', avgDifference);
        
        // Calculate accuracy score
        const accuracyScore = Math.round(((4 - avgDifference) / 4) * 100);
        console.log('Accuracy score:', accuracyScore);
        
        // Calculate total points
        const totalPoints = basePoints + accuracyScore;
        console.log('Total points calculation:', {
            basePoints,
            accuracyScore,
            totalPoints
        });
        
        return totalPoints;
    }

    calculateDistance(instructorScores, studentScores) {
        console.log('Calculating distance between:', {
            instructorScores,
            studentScores
        });

        let totalDiff = 0;
        let totalCriteria = 0;

        for (const criterion in instructorScores) {
            if (studentScores[criterion] === undefined) {
                console.error(`Missing student score for criterion: ${criterion}`);
                continue;
            }
            const diff = Math.abs(instructorScores[criterion] - studentScores[criterion]);
            console.log(`Criterion ${criterion} difference:`, diff);
            totalDiff += diff;
            totalCriteria++;
        }

        const avgDifference = totalCriteria > 0 ? totalDiff / totalCriteria : 4;
        console.log('Final average difference:', avgDifference);
        return avgDifference;
    }

    // Update addReviewPoints to use the new addPoints method
    addReviewPoints(codeExampleId, studentGrades) {
        console.log('Starting addReviewPoints:', { codeExampleId, studentGrades });
        
        const example = window.CodeExamples.samples.find(ex => ex.id === codeExampleId);
        console.log('Found example:', example);
        
        if (!example || !example.teacherGrade) {
            console.error('Invalid code example or missing teacher grades:', {
                example,
                teacherGrade: example?.teacherGrade
            });
            return 0;
        }

        // Calculate points
        console.log('Calculating review points with:', {
            teacherGrade: example.teacherGrade,
            studentGrades
        });
        
        const points = this.calculateReviewPoints(example.teacherGrade, studentGrades);
        console.log('Calculated points:', points);
        
        // Add points and update display
        console.log('Before addPoints - current points:', this.getPoints());
        this.addPoints(null, points);
        console.log('After addPoints - new points:', this.getPoints());
        
        // Ensure points display is updated
        this.ensurePointsDisplay();
        this.updatePointsDisplay(this.getPoints());
        
        return points;
    }

    getPoints() {
        const currentUser = window.ProfileManager.currentProfile?.username;
        if (!currentUser) return 0;
        
        return this.userPoints.get(currentUser) || 0;
    }

    saveUserData() {
        // Convert Sets to arrays for JSON storage
        const badgeData = {};
        this.userBadges.forEach((badges, username) => {
            badgeData[username] = Array.from(badges);
        });

        const data = {
            points: Array.from(this.userPoints.entries()),
            badges: badgeData
        };
        
        console.log('Saving gamification data:', data);
        localStorage.setItem('gamificationData', JSON.stringify(data));
    }

    checkBadges(username) {
        if (!username) {
            console.warn('No username provided to checkBadges');
            return;
        }

        if (!this.userBadges.has(username)) {
            this.userBadges.set(username, new Set());
        }

        // Get current points and ensure it's a number
        const userPoints = Number(this.userPoints.get(username)) || 0;
        const userBadges = this.userBadges.get(username);
        
        console.log('Checking badges for:', {
            username,
            userPoints,
            currentBadges: Array.from(userBadges)
        });
        
        try {
            // Check points badges
            const pointBadges = window.BadgeSystem.methods.checkPoints(userPoints);
            console.log('Point badges earned:', pointBadges);
            
            // Check review count badges
            const reviewCount = Number(window.ProfileManager.getEvaluations().length) || 0;
            const reviewBadges = window.BadgeSystem.methods.checkReviewCount(reviewCount);
            console.log('Review badges earned:', reviewBadges);
            
            // Award new badges
            [...pointBadges, ...reviewBadges].forEach(badge => {
                if (badge && !userBadges.has(badge.id)) {
                    console.log('Awarding new badge:', badge);
                    userBadges.add(badge.id);
                    this.showBadgeNotification(badge);
                }
            });
            
            this.saveUserData();
        } catch (error) {
            console.error('Error checking badges:', error);
        }
    }

    showBadgeNotification(badge) {
        const notification = document.createElement('div');
        notification.className = 'badge-notification';
        notification.style = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: #4CAF50;
            color: white;
            padding: 15px 30px;
            border-radius: 4px;
            font-size: 18px;
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 10px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        `;
        
        notification.innerHTML = `
            <span style="font-size: 24px;">${badge.icon}</span>
            <div>
                <div style="font-weight: bold;">New Badge: ${badge.name}</div>
                <div style="font-size: 14px;">${badge.description}</div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.5s ease';
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }

    getUserBadges(username) {
        const userBadgeIds = this.userBadges.get(username) || new Set();
        return Array.from(userBadgeIds)
            .map(badgeId => window.BadgeSystem.methods.getBadgeById(badgeId))
            .filter(badge => badge !== null);
    }

    ensurePointsDisplay() {
        if (!document.querySelector('.points-display')) {
            const pointsContainer = document.createElement('div');
            pointsContainer.className = 'points-container';
            pointsContainer.style = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999;
                width: 180px;
                pointer-events: none;
            `;

            const pointsDisplay = document.createElement('div');
            pointsDisplay.className = 'points-display';
            pointsDisplay.style = `
                background-color: #4CAF50;
                color: white;
                padding: 8px 12px;
                border-radius: 4px;
                font-size: 13px;
                font-weight: bold;
                text-align: right;
                margin-bottom: 5px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                width: 180px;
                white-space: nowrap;
                overflow: visible;
                font-family: monospace;
                box-sizing: border-box;
                display: flex;
                justify-content: flex-end;
                align-items: center;
            `;

            const progressBar = document.createElement('div');
            progressBar.className = 'points-progress';
            progressBar.style = `
                width: 180px;
                height: 6px;
                background-color: #333333;
                border-radius: 3px;
                overflow: hidden;
            `;

            const progressFill = document.createElement('div');
            progressFill.className = 'points-progress-fill';
            progressFill.style = `
                height: 100%;
                background-color: #4CAF50;
                transition: width 0.3s ease, background-color 0.3s ease;
                width: 0%;
            `;

            progressBar.appendChild(progressFill);
            pointsContainer.appendChild(pointsDisplay);
            pointsContainer.appendChild(progressBar);
            document.body.appendChild(pointsContainer);

            // Update the display immediately
            this.updatePointsDisplay(this.getPoints());
        }
    }

    updatePointsDisplay(points) {
        const maxPoints = 750;
        const progress = Math.min(points / maxPoints, 1);
        
        const pointsDisplay = document.querySelector('.points-display');
        const progressFill = document.querySelector('.points-progress-fill');
        
        if (pointsDisplay) {
            pointsDisplay.style.width = '180px';
            pointsDisplay.style.fontSize = '13px';
            pointsDisplay.style.fontFamily = 'monospace';
            pointsDisplay.style.boxSizing = 'border-box';
            pointsDisplay.style.display = 'flex';
            pointsDisplay.style.justifyContent = 'flex-end';
            pointsDisplay.textContent = `Points: ${points}`;
        }
        
        if (progressFill) {
            progressFill.style.width = `${progress * 100}%`;
            
            // Update color based on progress
            if (progress < 0.5) {
                progressFill.style.backgroundColor = '#ff4444';
            } else if (progress < 0.8) {
                progressFill.style.backgroundColor = '#ffbb33';
            } else {
                progressFill.style.backgroundColor = '#4CAF50';
            }
        }
    }

    cleanup() {
        const pointsContainer = document.querySelector('.points-container');
        if (pointsContainer) {
            pointsContainer.remove();
        }
    }
}

// Create global instance
window.GamificationManager = new GamificationSystem(); 