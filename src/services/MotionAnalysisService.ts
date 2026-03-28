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

import api from './api';

export const MotionAnalysisService = {
    /**
     * Advanced Analysis using YOLOv8 & OpenCV via Backend Worker.
     */
    analyzeSession: async (videoFile?: File, duration: number = 60): Promise<{ metrics: BodyAnalysisMetrics, summary: AISessionSummary }> => {
        const formData = new FormData();
        if (videoFile) {
            formData.append('video', videoFile);
        } else {
            // For demo/testing where a file might not be captured by the UI yet
            // we send a dummy blob if necessary or handle it on backend
            const blob = new Blob(["dummy"], { type: 'video/mp4' });
            formData.append('video', blob, 'demo_session.mp4');
        }
        formData.append('duration', duration.toString());
        formData.append('exerciseId', 'SQUAT_001');

        const response = await api.post('/analysis/motion', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        if (!response.data.success) throw new Error(response.data.error);

        return {
            metrics: response.data.data.aiFeedback.metrics,
            summary: response.data.data.aiFeedback.summary
        };
    },

    getLatestanalysis: async (): Promise<AISessionSummary | null> => {
        const response = await api.get('/health/profile');
        const submissions = response.data.data.submissions || [];
        return submissions.length > 0 ? submissions[0].aiFeedback.summary : null;
    }
};
