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

    addPoints(type, amount) {
        const currentUser = window.ProfileManager.currentProfile?.username;
        if (!currentUser) {
            console.error('No current user found');
            return;
        }

        if (typeof amount === 'undefined') {
            amount = parseInt(type);
        } else {
            amount = parseInt(amount);
        }

        const currentPoints = this.getPoints();
        const newPoints = currentPoints + amount;
        
        console.log('Adding points:', {
            currentUser,
            currentPoints,
            amountToAdd: amount,
            newPoints
        });

        this.userPoints.set(currentUser, newPoints);
        
        // Update ProfileManager points as well
        window.ProfileManager.updatePoints(amount);
        
        // Update display immediately and ensure it exists
        this.ensurePointsDisplay();
        this.updatePointsDisplay(newPoints);
        
        this.checkBadges(currentUser);
        this.saveUserData();
    }

    // New method to ensure points display exists
    ensurePointsDisplay() {
        if (!document.querySelector('.points-display')) {
            const pointsDisplay = document.createElement('div');
            pointsDisplay.className = 'points-display';
            pointsDisplay.style = `
                position: fixed;
                top: 20px;
                right: 20px;
                background-color: #4CAF50;
                color: white;
                padding: 10px 20px;
                border-radius: 4px;
                font-size: 18px;
                font-weight: bold;
                z-index: 9999;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            `;
            document.body.appendChild(pointsDisplay);
        }
    }

    updatePointsDisplay(points) {
        this.ensurePointsDisplay();
        const pointsDisplay = document.querySelector('.points-display');
        if (pointsDisplay) {
            pointsDisplay.textContent = `Points: ${points}`;
            console.log('Updated points display to:', points);
        } else {
            console.error('Points display element not found');
        }
    }

    getPoints() {
        const currentUser = window.ProfileManager.currentProfile?.username;
        if (!currentUser) return 0;
        
        const points = parseInt(this.userPoints.get(currentUser)) || 0;
        console.log('Getting points for', currentUser, ':', points);
        return points;
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
        
        // Verify the save
        const savedData = localStorage.getItem('gamificationData');
        console.log('Verified saved data:', savedData);
    }

    // Calculate Euclidean distance between two score vectors
    calculateDistance(instructorScores, studentScores) {
        return Math.sqrt(
            Object.keys(instructorScores).reduce((sum, criterion) => {
                const diff = instructorScores[criterion] - studentScores[criterion];
                return sum + diff * diff;
            }, 0)
        );
    }

    // Calculate worst possible scores given instructor scores
    getWorstPossibleScores(instructorScores) {
        return Object.keys(instructorScores).reduce((worst, criterion) => {
            // If instructor gave high score (>3), worst is 1
            // If instructor gave low score (<3), worst is 5
            worst[criterion] = instructorScores[criterion] > 3 ? 1 : 5;
            return worst;
        }, {});
    }

    // Calculate points for a review based on how close it is to instructor's grades
    calculateReviewPoints(instructorGrades, studentGrades) {
        // Calculate actual distance between instructor and student scores
        const actualDistance = this.calculateDistance(instructorGrades, studentGrades);

        // Calculate maximum possible distance using worst possible scores
        const worstScores = this.getWorstPossibleScores(instructorGrades);
        const maxDistance = this.calculateDistance(instructorGrades, worstScores);

        // Normalize the score (0-100)
        const normalizedScore = Math.round(((maxDistance - actualDistance) / maxDistance) * 100);
        
        return normalizedScore;
    }

    // Add points based on review accuracy
    addReviewPoints(codeExampleId, studentGrades) {
        // Get instructor grades from code examples
        const example = window.CodeExamples.samples.find(ex => ex.id === codeExampleId);
        if (!example || !example.teacherGrade) {
            console.error('Invalid code example or missing teacher grades');
            return;
        }

        const points = this.calculateReviewPoints(example.teacherGrade, studentGrades);
        this.addPoints(points);
    }

    // Check if user qualifies for new badges
    checkBadges(username) {
        const userPoints = this.userPoints.get(username) || 0;
        const userCurrentBadges = this.userBadges.get(username) || new Set();
        
        const badgeRules = {
            'Beginner Reviewer': 100,
            'Intermediate Reviewer': 500,
            'Expert Reviewer': 1000,
            'Master Reviewer': 5000
        };

        for (const [badge, pointsRequired] of Object.entries(badgeRules)) {
            if (userPoints >= pointsRequired && !userCurrentBadges.has(badge)) {
                userCurrentBadges.add(badge);
                this.userBadges.set(username, userCurrentBadges);
                this.showBadgeNotification(badge);
            }
        }
    }

    // Show notification when user earns a new badge
    showBadgeNotification(badge) {
        // Only show notification if badge is valid
        if (!badge || !badge.name || !badge.description) {
            return;
        }

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
            <span style="font-size: 24px;">${badge.icon || '🏆'}</span>
            <div>
                <div style="font-weight: bold;">${badge.name}</div>
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

    // Update the UI with current points and badges
    updateUI() {
        const currentUser = window.ProfileManager.currentProfile?.username;
        if (!currentUser) return;

        const pointsElement = document.querySelector('.points-display');
        const badgesElement = document.getElementById('badges-display');
        
        if (pointsElement) {
            pointsElement.textContent = `Points: ${this.getPoints()}`;
        }
        
        if (badgesElement) {
            const userBadges = this.userBadges.get(currentUser) || new Set();
            badgesElement.innerHTML = Array.from(userBadges)
                .map(badge => `<span class="badge">${badge}</span>`)
                .join('');
        }
    }

    checkForBadges(reviewData) {
        const earnedBadges = [];
        const currentUser = window.ProfileManager.currentProfile?.username;
        if (!currentUser) return;

        // Initialize user's badges if not exists
        if (!this.userBadges.has(currentUser)) {
            this.userBadges.set(currentUser, new Set());
        }
        
        // Check word count badges
        const wordCountBadges = window.BadgeSystem.methods.checkWordCount(reviewData.feedback);
        earnedBadges.push(...wordCountBadges);
        
        // Check points badges
        const pointsBadges = window.BadgeSystem.methods.checkPoints(this.getPoints());
        earnedBadges.push(...pointsBadges);
        
        // Check review count badges
        const reviewCount = window.ProfileManager.getEvaluations().length;
        const reviewCountBadges = window.BadgeSystem.methods.checkReviewCount(reviewCount);
        earnedBadges.push(...reviewCountBadges);
        
        // Check ranking badges - only if there are at least 10 users
        const allUsers = Array.from(this.userPoints.keys());
        if (allUsers.length >= 10) {  // Only award ranking badges if there's enough competition
            const userRank = window.LeaderboardData.getUserRank(currentUser);
            if (userRank > 0) {  // Make sure we found the user
                const rankingBadges = window.BadgeSystem.methods.checkRanking(userRank);
                earnedBadges.push(...rankingBadges);
            }
        }
        
        // Check accuracy badges
        if (reviewData.accuracy) {
            const accuracyBadges = window.BadgeSystem.methods.checkAccuracy(reviewData.accuracy);
            earnedBadges.push(...accuracyBadges);
        }
        
        // Award new badges
        const userBadges = this.userBadges.get(currentUser);
        earnedBadges.forEach(badge => {
            if (badge && !userBadges.has(badge.id)) {
                userBadges.add(badge.id);
                this.showBadgeNotification(badge);
            }
        });
        
        // Save updated badges
        this.saveUserData();
    }

    // Add method to get user's badges
    getUserBadges(username) {
        const userBadgeIds = this.userBadges.get(username) || new Set();
        const badges = [];
        
        // Convert badge IDs to full badge objects
        userBadgeIds.forEach(badgeId => {
            const badge = window.BadgeSystem.methods.getBadgeById(badgeId);
            if (badge) {
                badges.push(badge);
            }
        });
        
        return badges;
    }
}

// Create global instance
window.GamificationManager = new GamificationSystem(); 
