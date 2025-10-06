window.LeaderboardData = {
    users: [
        {
            username: "CodeMaster",
            points: 750,
            badges: 5,
            totalReviews: 5,
            averageAccuracy: 95
        },
        {
            username: "ReviewPro",
            points: 650,
            badges: 4,
            totalReviews: 5,
            averageAccuracy: 90
        },
        {
            username: "DebugNinja",
            points: 550,
            badges: 3,
            totalReviews: 4,
            averageAccuracy: 85
        },
        {
            username: "CodeWizard",
            points: 450,
            badges: 3,
            totalReviews: 3,
            averageAccuracy: 80
        },
        {
            username: "ReviewRookie",
            points: 350,
            badges: 2,
            totalReviews: 2,
            averageAccuracy: 75
        }
    ],

    // Helper method to get sorted leaderboard
    getLeaderboard: function() {
        // Combine real user with sample users
        const allUsers = [...this.users];
        
        // Add current user if logged in
        const currentUser = window.ProfileManager.currentProfile;
        if (currentUser) {
            const userPoints = window.GamificationManager.getPoints();
            const userBadges = window.GamificationManager.getUserBadges(currentUser.username)
                .map(badge => badge.id);
            
            allUsers.push({
                username: currentUser.username,
                points: userPoints,
                badges: userBadges,
                isCurrentUser: true
            });
        }

        // Sort by points (highest first)
        return allUsers.sort((a, b) => b.points - a.points)
            .map((user, index) => ({
                ...user,
                rank: index + 1
            }));
    },

    // Helper method to get badge details
    getBadgeDetails: function(badgeId) {
        return window.BadgeSystem.methods.getBadgeById(badgeId);
    },

    // Helper method to get user rank
    getUserRank(username) {
        if (!window.GamificationManager?.userPoints) {
            console.warn('GamificationManager not initialized, returning -1');
            return -1;
        }

        const allUsers = Array.from(window.GamificationManager.userPoints.entries());
        const sortedUsers = allUsers.sort((a, b) => b[1] - a[1]);
        const userIndex = sortedUsers.findIndex(([user]) => user === username);
        return userIndex === -1 ? -1 : userIndex + 1;
    },

    // Get top N users
    getTopUsers(n = 10) {
        const leaderboard = this.getLeaderboard();
        return leaderboard.slice(0, n);
    },

    // Add method to get mock data when no real data exists
    getMockLeaderboard() {
        return [
            { username: "CodeMaster", points: 500, evaluations: 10 },
            { username: "BugHunter", points: 450, evaluations: 8 },
            { username: "DevNinja", points: 400, evaluations: 7 },
            { username: "AlgorithmPro", points: 350, evaluations: 6 },
            { username: "DebugQueen", points: 300, evaluations: 5 }
        ];
    }
}; 