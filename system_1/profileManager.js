window.ProfileManager = {
    currentProfile: null,

    createProfile(username) {
        const profile = {
            username: username,
            createdAt: new Date().toISOString(),
            evaluations: [],
            lastActive: new Date().toISOString()
        };

        // Save to localStorage
        localStorage.setItem('userProfile', JSON.stringify(profile));
        this.currentProfile = profile;
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

    exportUserData() {
        if (!this.currentProfile) return null;

        const exportData = {
            ...this.currentProfile,
            exportDate: new Date().toISOString(),
            exportVersion: '1.0'
        };

        // Create a blob with the JSON data
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        
        // Create a download link
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `user_data_${this.currentProfile.username}_${new Date().toISOString().split('T')[0]}.json`;
        
        // Trigger the download
        document.body.appendChild(link);
        link.click();
        
        // Clean up
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        return exportData;
    },

    logout() {
        if (this.currentProfile) {
            // Export user data before logging out
            this.exportUserData();
        }
        this.currentProfile = null;
        localStorage.removeItem('userProfile');
    }
}; 