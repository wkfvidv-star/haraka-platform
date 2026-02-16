export interface BodyAnalysisMetrics {
    postureScore: {
        value: number; // Percentage
        status: 'Good' | 'Average' | 'Needs Improvement';
        spineAlignment: string; // e.g., "Normal", "Slight Curvature"
        shoulderTilt: string; // e.g., "Level", "Right Low"
        pelvicTilt: string;
        headPosition: string; // "Neutral", "Forward"
    };
    balance: {
        leftSide: number; // %
        rightSide: number; // %
        distributionStatus: string; // "Balanced" or "Right Heavy"
        limbSymmetry: number; // %
    };
    centerOfGravity: {
        x: number;
        y: number;
        offset: string; // "2cm Right"
    };
    jointAngles: {
        knees: { left: number, right: number }; // degrees
        hips: { left: number, right: number };
        shoulders: { left: number, right: number };
        elbows: { left: number, right: number };
    };
    asymmetryIndex: number; // Single score, lower is better
}

export interface AISessionSummary {
    sessionId: string;
    date: string;
    strengths: string[];
    weaknesses: string[];
    recommendations: string[]; // List of exercise IDs or Titles
}

// Mock Data Storage for "Student Profile Integration"
let storedSummaries: AISessionSummary[] = [];

export const MotionAnalysisService = {
    // Simulate analyzing a video submission
    analyzeSession: async (videoFile?: File): Promise<{ metrics: BodyAnalysisMetrics, summary: AISessionSummary }> => {
        // Mock delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Mock Metrics
        const metrics: BodyAnalysisMetrics = {
            postureScore: {
                value: 78,
                status: 'Average',
                spineAlignment: 'Slight Curvature',
                shoulderTilt: 'Right Low',
                pelvicTilt: 'Neutral',
                headPosition: 'Forward Bias'
            },
            balance: {
                leftSide: 45,
                rightSide: 55,
                distributionStatus: 'Right Heavy',
                limbSymmetry: 88
            },
            centerOfGravity: {
                x: 0.52,
                y: 0.48,
                offset: '2cm Right'
            },
            jointAngles: {
                knees: { left: 15, right: 12 },
                hips: { left: 5, right: 8 },
                shoulders: { left: 10, right: 15 },
                elbows: { left: 170, right: 165 }
            },
            asymmetryIndex: 12 // scale 0-100
        };

        // Mock AI Logic for Summary
        const summary: AISessionSummary = {
            sessionId: Date.now().toString(),
            date: new Date().toISOString(),
            strengths: [
                'ثبات الركبة ممتاز (Knee Stability)',
                'مدى حركي جيد في الأكتاف (Shoulder ROM)'
            ],
            weaknesses: [
                'ميلان في الكتف الأيمن (Right Shoulder Tilt)',
                'توزيع الوزن يميل للجهة اليمنى (Weight Shift Right)'
            ],
            recommendations: [
                'تمرين تصحيح الأكتاف (Shoulder Leveling)',
                'تدريب التوازن على قدم واحدة (Single Leg Balance)'
            ]
        };

        // Persist to "Profile"
        storedSummaries.unshift(summary);

        return { metrics, summary };
    },

    getLatestanalysis: async (): Promise<AISessionSummary | null> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return storedSummaries[0] || null;
    }
};
