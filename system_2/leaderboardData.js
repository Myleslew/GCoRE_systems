window.LeaderboardData = {
    users: [
        {
            username: "CodeMaster42",
            points: 680,
            evaluations: 5,
            joinedDate: "2024-02-15"
        },
        {
            username: "BugHunter",
            points: 425,
            evaluations: 3,
            joinedDate: "2024-02-18"
        },
        {
            username: "SyntaxPro",
            points: 720,
            evaluations: 5,
            joinedDate: "2024-02-10"
        },
        {
            username: "AlgorithmAce",
            points: 530,
            evaluations: 4,
            joinedDate: "2024-02-16"
        },
        {
            username: "DebugDragon",
            points: 290,
            evaluations: 2,
            joinedDate: "2024-02-20"
        },
        {
            username: "ByteWizard",
            points: 645,
            evaluations: 5,
            joinedDate: "2024-02-12"
        },
        {
            username: "QueryNinja",
            points: 375,
            evaluations: 3,
            joinedDate: "2024-02-19"
        }
    ],

    // Helper method to get sorted leaderboard
    getLeaderboard() {
        return this.users.sort((a, b) => b.points - a.points);
    },

    // Helper method to get user rank
    getUserRank(username) {
        // Get all users and their points
        const allUsers = Array.from(window.GamificationManager.userPoints.entries());
        
        // Sort users by points in descending order
        const sortedUsers = allUsers.sort((a, b) => b[1] - a[1]);
        
        // Find the index (rank) of the given user
        const userIndex = sortedUsers.findIndex(([user]) => user === username);
        
        // Return rank (1-based index) or -1 if user not found
        return userIndex === -1 ? -1 : userIndex + 1;
    },

    // Get top N users
    getTopUsers(n = 10) {
        const allUsers = Array.from(window.GamificationManager.userPoints.entries());
        return allUsers
            .sort((a, b) => b[1] - a[1])
            .slice(0, n)
            .map(([username, points]) => ({
                username,
                points
            }));
    }
}; 