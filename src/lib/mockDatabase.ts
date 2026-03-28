// src/lib/mockDatabase.ts
/**
 * Haraka Local IndexedDB Database (Mock Backend)
 * 
 * This file uses IndexedDB to store potentially large files (like Video Blobs from student submissions)
 * that cannot safely fit inside localStorage's 5MB quota. It allows seamless persistence between 
 * the Student Dashboard and the Teacher Dashboard.
 */

const DB_NAME = 'HarakaPlatformDB';
const DB_VERSION = 1;
const STORE_NAME = 'video_submissions';

export interface VideoSubmissionRecord {
    id: string;
    studentName: string;
    exerciseName: string;
    exerciseType?: 'motor' | 'cognitive' | 'rehab' | 'psychological';
    assignedRole?: 'coach' | 'teacher' | 'specialist';
    date: string;
    videoBlob: Blob | null; // Null if it's just a mock entry without a file
    videoUrl?: string; // transient url during runtime, not stored permanently if blob exists
    status: 'pending' | 'evaluated' | 'redo';
    score?: number;
    coachNotes?: string;
    technicalTips?: string[];
    coachName?: string;
    note?: string; // Student notes
    demoVideoUrl?: string; // Teacher supplied tutorial URL 
    demoVideoBlob?: Blob | null; // Teacher uploaded custom tutorial Blob
    demoImages?: string[]; // Slideshow images if no video is provided
    exerciseInstructions?: string[]; // Teacher supplied steps
}

export class MockDatabase {
    private db: IDBDatabase | null = null;
    private initPromise: Promise<void>;

    constructor() {
        this.initPromise = this.initDB();
    }

    private initDB(): Promise<void> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onerror = (event) => {
                console.error("IndexedDB Error:", request.error);
                reject(request.error);
            };

            request.onsuccess = (event) => {
                this.db = request.result;
                resolve();
            };

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME, { keyPath: 'id' });
                }
            };
        });
    }

    async saveSubmission(submission: VideoSubmissionRecord): Promise<void> {
        await this.initPromise;
        if (!this.db) throw new Error("Database not initialized");

        // Smart Routing Logic
        let role: 'coach' | 'teacher' | 'specialist' = 'coach';
        if (submission.exerciseType === 'cognitive' || submission.exerciseType === 'psychological') role = 'teacher';
        if (submission.exerciseType === 'rehab') role = 'specialist';

        const recordToSave: VideoSubmissionRecord = { 
            assignedRole: role,
            ...submission 
        };
        delete recordToSave.videoUrl;

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.put(recordToSave);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    async getSubmissions(): Promise<VideoSubmissionRecord[]> {
        await this.initPromise;
        if (!this.db) throw new Error("Database not initialized");

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([STORE_NAME], 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.getAll();

            request.onsuccess = () => {
                const records = request.result as VideoSubmissionRecord[];
                // Generate transient URLs for blobs
                records.forEach(r => {
                    if (r.videoBlob) {
                        r.videoUrl = URL.createObjectURL(r.videoBlob);
                    }
                    if (r.demoVideoBlob) {
                        r.demoVideoUrl = URL.createObjectURL(r.demoVideoBlob);
                    }
                });
                resolve(records.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
            };
            request.onerror = () => reject(request.error);
        });
    }

    async updateSubmissionEvaluation(id: string, score: number, notes: string, tips: string[]): Promise<void> {
        await this.initPromise;
        if (!this.db) throw new Error("Database not initialized");

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.get(id);

            request.onsuccess = () => {
                const record = request.result as VideoSubmissionRecord;
                if (!record) {
                    reject(new Error("Record not found"));
                    return;
                }

                record.status = score >= 50 ? 'evaluated' : 'redo';
                record.score = score;
                record.coachNotes = notes;
                record.technicalTips = tips;
                record.coachName = 'الكابتن أحمد'; // default mock coach

                const updateRequest = store.put(record);
                updateRequest.onsuccess = () => resolve();
                updateRequest.onerror = () => reject(updateRequest.error);
            };

            request.onerror = () => reject(request.error);
        });
    }

    // Initialize with some dummy data if empty
    async seedIfEmpty(): Promise<void> {
        try {
            const existing = await this.getSubmissions();
            if (existing.length === 0) {
                const seedData: VideoSubmissionRecord[] = [
                    {
                        id: `sub-${Date.now()-100000}`,
                        studentName: 'الطالب الحالي',
                        exerciseName: 'تمرين التوازن أحادي الساق',
                        exerciseType: 'motor',
                        assignedRole: 'coach',
                        date: new Date(Date.now() - 3600000 * 2).toISOString(),
                        videoBlob: null,
                        status: 'pending'
                    },
                     {
                        id: `sub-${Date.now()-200000}`,
                        studentName: 'الطالب الحالي',
                        exerciseName: 'القفز الجانبي (Agility)',
                        exerciseType: 'motor',
                        assignedRole: 'coach',
                        date: new Date(Date.now() - 86400000).toISOString(),
                        videoBlob: null,
                        status: 'evaluated',
                        score: 92,
                        coachName: 'الكابتن أحمد',
                        coachNotes: 'أداء ممتاز جداً! سرعة رد فعلك تحسنت بشكل ملحوظ مقارنة بالأسبوع الماضي. استمر على هذا المستوى.',
                        technicalTips: ['حافظ على استقامة ظهرك أثناء الهبوط', 'تنفس بانتظام مع كل قفزة']
                    },
                    {
                        id: `sub-${Date.now()-50000}`,
                        studentName: 'الطالب الحالي',
                        exerciseName: 'لعبة التركيز والتوافق الذهني (Cognitive)',
                        exerciseType: 'cognitive',
                        assignedRole: 'teacher',
                        date: new Date(Date.now() - 3600000 * 5).toISOString(),
                        videoBlob: null,
                        status: 'pending'
                    }
                ];

                for (const item of seedData) {
                    await this.saveSubmission(item);
                }
            }
        } catch (e) {
            console.error("Failed to seed database", e);
        }
    }
}

export const db = new MockDatabase();
// Seed immediately
db.seedIfEmpty();
