window.ProfileManager = {
    currentProfile: null,

    createProfile(username) {
        const profile = {
            username,
            createdAt: new Date().toISOString(),
            evaluations: [],
            lastActive: new Date().toISOString(),
            points: 0,
            badges: [],
            stats: {
                totalReviews: 0,
                averageAccuracy: 0,
                bestAccuracy: 0
            }
        };
        this.currentProfile = profile;
        this.saveProfile(profile);
        return profile;
    },

    loadProfile() {
        const savedProfile = localStorage.getItem('userProfile');
        if (savedProfile) {
            this.currentProfile = JSON.parse(savedProfile);
            // Ensure stats object exists
            if (!this.currentProfile.stats) {
                this.currentProfile.stats = {
                    totalReviews: 0,
                    averageAccuracy: 0,
                    bestAccuracy: 0
                };
                this.saveProfile(this.currentProfile);
            }
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
            // Create a backup of the profile data
            const backupData = {
                username: this.currentProfile.username,
                createdAt: this.currentProfile.createdAt,
                lastActive: new Date().toISOString(),
                evaluations: this.currentProfile.evaluations,
                points: this.currentProfile.points,
                badges: this.currentProfile.badges,
                stats: this.currentProfile.stats
            };

            // Convert to JSON string
            const jsonData = JSON.stringify(backupData, null, 2);

            // Create a blob and download link
            const blob = new Blob([jsonData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${this.currentProfile.username}_profile_backup.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }

        // Clear the current profile
        this.currentProfile = null;
        localStorage.removeItem('userProfile');
    },

    saveProfile(profile) {
        localStorage.setItem('userProfile', JSON.stringify(profile));
    },

    updatePoints(pointsToAdd) {
        if (this.currentProfile) {
            this.currentProfile.points += pointsToAdd;
            this.saveProfile(this.currentProfile);
        }
    },

    // Add a method to load a backup profile
    loadBackupProfile(jsonData) {
        try {
            const profileData = JSON.parse(jsonData);
            this.currentProfile = profileData;
            this.saveProfile(profileData);
            return true;
        } catch (error) {
            console.error('Error loading backup profile:', error);
            return false;
        }
    }
}; 