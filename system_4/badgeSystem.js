window.BadgeSystem = (function() {
    let initialized = false;
    
    const system = {
        badges: {
            reviewer: [
                {
                    id: 'beginner_reviewer',
                    name: 'Beginner Reviewer',
                    description: 'Complete your first code review',
                    icon: '🔍',
                    requirement: 1
                },
                {
                    id: 'intermediate_reviewer',
                    name: 'Intermediate Reviewer',
                    description: 'Complete 5 code reviews',
                    icon: '🎯',
                    requirement: 5
                },
                {
                    id: 'expert_reviewer',
                    name: 'Expert Reviewer',
                    description: 'Complete 10 code reviews',
                    icon: '⭐',
                    requirement: 10
                }
            ],
            points: [
                {
                    id: 'point_collector_1',
                    name: 'Point Collector I',
                    description: 'Earn 100 points',
                    icon: '🥉',
                    requirement: 100
                },
                {
                    id: 'point_collector_2',
                    name: 'Point Collector II',
                    description: 'Earn 300 points',
                    icon: '🥈',
                    requirement: 300
                },
                {
                    id: 'point_collector_3',
                    name: 'Point Collector III',
                    description: 'Earn 500 points',
                    icon: '🥇',
                    requirement: 500
                }
            ],
            accuracy: [
                {
                    id: 'sharp_eye',
                    name: 'Sharp Eye',
                    description: 'Achieve 80% accuracy in a review',
                    icon: '👁️',
                    requirement: 80
                },
                {
                    id: 'eagle_eye',
                    name: 'Eagle Eye',
                    description: 'Achieve 90% accuracy in a review',
                    icon: '🦅',
                    requirement: 90
                },
                {
                    id: 'perfect_review',
                    name: 'Perfect Review',
                    description: 'Achieve 100% accuracy in a review',
                    icon: '💯',
                    requirement: 100
                }
            ]
        },

        initialize: function() {
            if (initialized) return;
            
            // Verify all badge data is properly loaded
            if (this.badges && this.badges.reviewer && this.badges.points && this.badges.accuracy) {
                initialized = true;
                console.log('Badge system initialized successfully');
            } else {
                console.error('Failed to initialize badge system - missing badge data');
            }
        },

        methods: {
            checkReviewCount: function(count) {
                if (!initialized) {
                    system.initialize();
                }
                if (!initialized) {
                    console.error('Badge system not initialized');
                    return [];
                }

                if (typeof count !== 'number') {
                    console.warn('Invalid review count:', count);
                    return [];
                }

                return system.badges.reviewer.filter(badge => count >= badge.requirement);
            },

            checkPoints: function(userPoints) {
                if (!initialized) {
                    system.initialize();
                }
                if (!initialized) {
                    console.error('Badge system not initialized');
                    return [];
                }

                console.log('Checking points badges for:', userPoints);
                
                const points = Number(userPoints);
                if (isNaN(points)) {
                    console.warn('Invalid points value:', userPoints);
                    return [];
                }

                try {
                    const earnedBadges = system.badges.points.filter(badge => 
                        badge && 
                        typeof badge.requirement === 'number' && 
                        points >= badge.requirement
                    );
                    console.log('Earned point badges:', earnedBadges);
                    return earnedBadges;
                } catch (error) {
                    console.error('Error checking points badges:', error);
                    return [];
                }
            },

            checkAccuracy: function(accuracy) {
                if (!initialized) {
                    system.initialize();
                }
                if (!initialized) {
                    console.error('Badge system not initialized');
                    return [];
                }

                if (typeof accuracy !== 'number') {
                    console.warn('Invalid accuracy value:', accuracy);
                    return [];
                }
                return system.badges.accuracy.filter(badge => accuracy >= badge.requirement);
            },

            getBadgeById: function(badgeId) {
                if (!initialized) {
                    system.initialize();
                }
                if (!initialized) {
                    console.error('Badge system not initialized');
                    return null;
                }

                if (!badgeId) {
                    console.warn('Invalid badge ID');
                    return null;
                }
                
                for (const category in system.badges) {
                    if (system.badges[category]) {
                        const badge = system.badges[category].find(b => b && b.id === badgeId);
                        if (badge) return badge;
                    }
                }
                return null;
            }
        }
    };

    // Initialize immediately when loaded
    system.initialize();
    
    return system;
})(); 