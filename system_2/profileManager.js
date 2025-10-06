window.ProfileManager = {
    currentProfile: null,
    maxScore: 750,  // Maximum possible score (50 base + 100 accuracy) * 5 code samples

    createProfile(username) {
        const profile = {
            username: username,
            createdAt: new Date().toISOString(),
            evaluations: [],
            lastActive: new Date().toISOString(),
            points: 0  // Add points to profile
        };

        // Save to localStorage
        localStorage.setItem('userProfile', JSON.stringify(profile));
        this.currentProfile = profile;
        return profile;
    },

    // Add method to update points
    updatePoints(amount) {
        if (!this.currentProfile) return false;
        
        // Convert amount to number if it's a string
        amount = parseInt(amount);
        if (isNaN(amount)) return false;

        // Add points to profile
        this.currentProfile.points = (this.currentProfile.points || 0) + amount;
        console.log('Updated profile points:', this.currentProfile.points);
        
        // Update points display
        const pointsDisplay = document.querySelector('.total-points-display');
        if (pointsDisplay) {
            const pointsText = pointsDisplay.querySelector('div');
            if (pointsText) {
                pointsText.textContent = `Points: ${this.currentProfile.points}/${this.maxScore}`;
                
                // Update progress bar if it exists
                const progressBar = pointsDisplay.querySelector('.progress-bar');
                if (progressBar) {
                    const progressPercentage = (this.currentProfile.points / this.maxScore) * 100;
                    progressBar.style.width = `${progressPercentage}%`;
                    
                    // Update color based on percentage
                    if (progressPercentage < 50) {
                        progressBar.style.backgroundColor = '#ff4444';  // Red
                    } else if (progressPercentage < 80) {
                        progressBar.style.backgroundColor = '#ffbb33';  // Yellow
                    } else {
                        progressBar.style.backgroundColor = '#4CAF50';  // Green
                    }
                }
            }
        }
        
        // Save updated profile
        localStorage.setItem('userProfile', JSON.stringify(this.currentProfile));
        return true;
    },

    updatePointsDisplay() {
        // Remove any existing points display
        const existingDisplay = document.querySelector('.total-points-display');
        if (existingDisplay) {
            existingDisplay.remove();
        }

        // Create new points display container
        const pointsDisplay = document.createElement('div');
        pointsDisplay.className = 'total-points-display';

        // Add points text
        const pointsText = document.createElement('div');
        pointsText.textContent = `Points: ${this.currentProfile.points}/${this.maxScore}`;
        pointsDisplay.appendChild(pointsText);

        // Add progress bar container
        const progressContainer = document.createElement('div');
        progressContainer.className = 'progress-container';

        // Add progress bar
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        const progressPercentage = (this.currentProfile.points / this.maxScore) * 100;
        
        // Set color based on percentage
        if (progressPercentage < 50) {
            progressBar.style.backgroundColor = '#ff4444';  // Red
        } else if (progressPercentage < 80) {
            progressBar.style.backgroundColor = '#ffbb33';  // Yellow
        } else {
            progressBar.style.backgroundColor = '#4CAF50';  // Green
        }
        
        progressBar.style.width = `${progressPercentage}%`;

        // Assemble the display
        progressContainer.appendChild(progressBar);
        pointsDisplay.appendChild(progressContainer);
        document.body.appendChild(pointsDisplay);
    },

    // Add method to get current points
    getPoints() {
        return this.currentProfile ? this.currentProfile.points : 0;
    },

    loadProfile() {
        const savedProfile = localStorage.getItem('userProfile');
        if (savedProfile) {
            this.currentProfile = JSON.parse(savedProfile);
            // Ensure points exist in loaded profile
            if (typeof this.currentProfile.points === 'undefined') {
                this.currentProfile.points = 0;
                localStorage.setItem('userProfile', JSON.stringify(this.currentProfile));
            }
            // Update points display when profile is loaded
            this.updatePointsDisplay();
            return this.currentProfile;
        }
        return null;
    },

    saveEvaluation(codeId, scores, feedback, totalScore, codePrompt) {
        if (!this.currentProfile) return false;

        const evaluation = {
            codeId: codeId,
            date: new Date().toISOString(),
            scores: scores,
            feedback: feedback,
            totalScore: totalScore,
            codePrompt: codePrompt
        };

        // Calculate points for this review
        const basePoints = 50;  // Base points for completing a review
        
        // Calculate accuracy points
        const example = window.CodeExamples.samples.find(ex => ex.id === codeId);
        if (!example || !example.teacherGrade) {
            console.error('Missing example or teacher grade:', {
                example,
                teacherGrade: example?.teacherGrade
            });
            return false;
        }

        const studentGrades = {};
        scores.forEach(score => {
            const criterionName = score.criterionName;
            studentGrades[criterionName] = parseInt(score.score);
            console.log(`Adding score for criterion: ${criterionName} = ${score.score}`);
        });

        // Log both sets of grades for comparison
        console.log('Teacher grades:', example.teacherGrade);
        console.log('Student grades:', studentGrades);

        const accuracyScore = this.calculateReviewPoints(codeId, studentGrades);
        
        // Add both base points and accuracy score
        const totalPointsForReview = basePoints + accuracyScore;
        
        console.log('Points breakdown:', {
            basePoints,
            accuracyScore,
            totalPointsForReview
        });

        // Create review data for badge checking
        const reviewData = {
            feedback: feedback.join(' '), // Combine all feedback into one string
            accuracy: accuracyScore,
            totalScore: totalScore
        };

        // Update user's total points and check for badges
        window.GamificationManager.addPoints(totalPointsForReview);
        window.GamificationManager.checkForBadges(reviewData);
        
        this.currentProfile.evaluations.push(evaluation);
        this.currentProfile.lastActive = new Date().toISOString();
        
        // Save updated profile
        localStorage.setItem('userProfile', JSON.stringify(this.currentProfile));
        return true;
    },

    getEvaluations() {
        return this.currentProfile ? this.currentProfile.evaluations : [];
    },

    isLoggedIn() {
        return this.currentProfile !== null;
    },

    logout() {
        if (this.currentProfile) {
            // Create a comprehensive data object
            const userData = {
                username: this.currentProfile.username,
                createdAt: this.currentProfile.createdAt,
                lastActive: new Date().toISOString(),
                points: this.currentProfile.points,
                evaluations: this.currentProfile.evaluations,
                badges: Array.from(window.GamificationManager.userBadges.get(this.currentProfile.username) || new Set()),
                totalReviews: this.currentProfile.evaluations.length,
                averageScore: this.calculateAverageScore(),
                accuracyHistory: this.calculateAccuracyHistory()
            };

            // Convert to JSON string
            const jsonData = JSON.stringify(userData, null, 2);

            // Create a blob and download link
            const blob = new Blob([jsonData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${this.currentProfile.username}_data_${new Date().toISOString().split('T')[0]}.json`;
            
            // Trigger download
            document.body.appendChild(a);
            a.click();
            
            // Cleanup
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            // Reset points in GamificationManager
            window.GamificationManager.userPoints.set(this.currentProfile.username, 0);
            window.GamificationManager.saveUserData();
        }

        this.currentProfile = null;
        localStorage.removeItem('userProfile');
    },

    calculateAverageScore() {
        if (!this.currentProfile || !this.currentProfile.evaluations.length) return 0;
        
        const totalScore = this.currentProfile.evaluations.reduce((sum, eval) => {
            return sum + (eval.totalScore || 0);
        }, 0);
        
        return totalScore / this.currentProfile.evaluations.length;
    },

    calculateAccuracyHistory() {
        if (!this.currentProfile || !this.currentProfile.evaluations.length) return [];
        
        return this.currentProfile.evaluations.map(eval => {
            const example = window.CodeExamples.samples.find(ex => ex.id === eval.codeId);
            if (!example || !example.teacherGrade) return null;

            const studentGrades = {};
            eval.scores.forEach(score => {
                studentGrades[score.criterionName] = parseInt(score.score);
            });

            const avgDifference = this.calculateDistance(example.teacherGrade, studentGrades);
            const accuracy = Math.round(((4 - avgDifference) / 4) * 100);

            return {
                date: eval.date,
                codeId: eval.codeId,
                accuracy: accuracy,
                totalScore: eval.totalScore
            };
        }).filter(item => item !== null);
    },

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
            totalDiff += diff;
            totalCriteria++;
        }

        // Return average difference (0 to 4 scale)
        return totalCriteria > 0 ? totalDiff / totalCriteria : 4;
    },

    getWorstPossibleScores(instructorScores) {
        return Object.keys(instructorScores).reduce((worst, criterion) => {
            // For each criterion, pick the score that would be furthest from instructor's score
            const instructorScore = instructorScores[criterion];
            // If instructor gave high score (4-5), worst is 1
            // If instructor gave low score (1-2), worst is 5
            // If instructor gave middle score (3), worst could be either 1 or 5
            worst[criterion] = instructorScore >= 3 ? 1 : 5;
            return worst;
        }, {});
    },

    calculateReviewPoints(codeId, studentGrades) {
        const example = window.CodeExamples.samples.find(ex => ex.id === codeId);
        if (!example || !example.teacherGrade) {
            console.error('Missing example or teacher grade:', {
                example,
                teacherGrade: example?.teacherGrade
            });
            return 0;
        }

        // Debug logging
        console.log('Teacher grades:', example.teacherGrade);
        console.log('Student grades:', studentGrades);

        // Calculate average difference between student and teacher grades (0 to 4 scale)
        const avgDifference = this.calculateDistance(example.teacherGrade, studentGrades);
        
        // Convert difference to accuracy score (0 to 100 scale)
        // 0 difference = 100 points
        // 4 difference = 0 points
        const accuracyScore = Math.round(((4 - avgDifference) / 4) * 100);
        
        // Debug logging
        console.log('Score calculation:', {
            avgDifference,
            accuracyScore
        });
        
        return accuracyScore;
    }
}; 