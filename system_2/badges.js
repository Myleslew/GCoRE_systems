window.BadgeSystem = {
    // Badge categories and their requirements
    badges: {
        // Review Length Badges
        wordCount: [
            {
                id: 'verbose_reviewer_1',
                name: 'Detailed Reviewer',
                description: 'Write a review with at least 25 words',
                icon: '📝',
                requirement: 25
            },
            {
                id: 'verbose_reviewer_2',
                name: 'Thorough Reviewer',
                description: 'Write a review with at least 50 words',
                icon: '📚',
                requirement: 50
            },
            {
                id: 'verbose_reviewer_3',
                name: 'Comprehensive Reviewer',
                description: 'Write a review with at least 100 words',
                icon: '📖',
                requirement: 100
            }
        ],

        // Points Achievement Badges
        points: [
            {
                id: 'points_milestone_1',
                name: 'Rising Star',
                description: 'Earn 200 total points',
                icon: '⭐',
                requirement: 200
            },
            {
                id: 'points_milestone_2',
                name: 'Code Enthusiast',
                description: 'Earn 400 total points',
                icon: '🌟',
                requirement: 400
            },
            {
                id: 'points_milestone_3',
                name: 'Code Master',
                description: 'Earn 600 total points',
                icon: '🌠',
                requirement: 600
            },
            {
                id: 'points_milestone_4',
                name: 'Code Legend',
                description: 'Earn 1000 total points',
                icon: '👑',
                requirement: 1000
            }
        ],

        // Review Count Badges
        reviewCount: [
            {
                id: 'review_count_1',
                name: 'Code Reviewer',
                description: 'Complete 5 code reviews',
                icon: '🔍',
                requirement: 5
            },
            {
                id: 'review_count_2',
                name: 'Senior Reviewer',
                description: 'Complete 15 code reviews',
                icon: '🔎',
                requirement: 15
            },
            {
                id: 'review_count_3',
                name: 'Expert Reviewer',
                description: 'Complete 30 code reviews',
                icon: '🎯',
                requirement: 30
            }
        ],

        // Leaderboard Ranking Badges
        ranking: [
            {
                id: 'ranking_1',
                name: 'Top 10 Reviewer',
                description: 'Reach top 10 on the leaderboard',
                icon: '🏆',
                requirement: 10
            },
            {
                id: 'ranking_2',
                name: 'Top 5 Reviewer',
                description: 'Reach top 5 on the leaderboard',
                icon: '🏅',
                requirement: 5
            },
            {
                id: 'ranking_3',
                name: 'Top Reviewer',
                description: 'Reach #1 on the leaderboard',
                icon: '👑',
                requirement: 1
            }
        ],

        // Accuracy Badges
        accuracy: [
            {
                id: 'accuracy_1',
                name: 'Sharp Eye',
                description: 'Achieve 80% accuracy in a review',
                icon: '🎯',
                requirement: 80
            },
            {
                id: 'accuracy_2',
                name: 'Eagle Eye',
                description: 'Achieve 90% accuracy in a review',
                icon: '🦅',
                requirement: 90
            },
            {
                id: 'accuracy_3',
                name: 'Perfect Reviewer',
                description: 'Achieve 100% accuracy in a review',
                icon: '💯',
                requirement: 100
            }
        ]
    },

    // Helper methods for badge management
    methods: {
        checkWordCount: function(review) {
            const wordCount = review.split(/\s+/).length;
            return window.BadgeSystem.badges.wordCount.filter(badge => 
                wordCount >= badge.requirement);
        },

        checkPoints: function(totalPoints) {
            return window.BadgeSystem.badges.points.filter(badge => 
                totalPoints >= badge.requirement);
        },

        checkReviewCount: function(reviewCount) {
            return window.BadgeSystem.badges.reviewCount.filter(badge => 
                reviewCount >= badge.requirement);
        },

        checkRanking: function(rank) {
            return window.BadgeSystem.badges.ranking.filter(badge => 
                rank <= badge.requirement);
        },

        checkAccuracy: function(accuracy) {
            return window.BadgeSystem.badges.accuracy.filter(badge => 
                accuracy >= badge.requirement);
        },

        // Get all badges for a category
        getBadgesByCategory: function(category) {
            return window.BadgeSystem.badges[category] || [];
        },

        // Get badge by ID
        getBadgeById: function(badgeId) {
            for (const category in window.BadgeSystem.badges) {
                const badge = window.BadgeSystem.badges[category].find(b => b.id === badgeId);
                if (badge) return badge;
            }
            return null;
        }
    }
}; 