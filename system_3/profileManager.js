window.ProfileManager = {
    currentProfile: null,

    createProfile(username) {
        const profile = {
            username,
            character: null,
            createdAt: new Date().toISOString(),
            evaluations: [],
            lastActive: new Date().toISOString()
        };
        this.currentProfile = profile;
        this.saveProfile(profile);
        return profile;
    },

    loadProfile() {
        const savedProfile = localStorage.getItem('userProfile');
        if (savedProfile) {
            this.currentProfile = JSON.parse(savedProfile);
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
            // Get existing profile history
            let profileHistory = JSON.parse(localStorage.getItem('profileHistory') || '[]');
            
            // Add current profile to history with logout timestamp
            const profileToSave = {
                ...this.currentProfile,
                logoutTime: new Date().toISOString()
            };
            
            // Check if this username already exists in history
            const existingIndex = profileHistory.findIndex(p => p.username === this.currentProfile.username);
            if (existingIndex !== -1) {
                // Update existing profile
                profileHistory[existingIndex] = profileToSave;
            } else {
                // Add new profile to history
                profileHistory.push(profileToSave);
            }
            
            // Save updated history
            localStorage.setItem('profileHistory', JSON.stringify(profileHistory));
            
            // Clear current profile
            this.currentProfile = null;
            localStorage.removeItem('userProfile');
        }
    },

    saveProfile(profile) {
        localStorage.setItem('userProfile', JSON.stringify(profile));
    },

    // New method to get profile history
    getProfileHistory() {
        return JSON.parse(localStorage.getItem('profileHistory') || '[]');
    },

    // New method to get specific profile history by username
    getProfileHistoryByUsername(username) {
        const history = this.getProfileHistory();
        return history.filter(profile => profile.username === username);
    }
}; 