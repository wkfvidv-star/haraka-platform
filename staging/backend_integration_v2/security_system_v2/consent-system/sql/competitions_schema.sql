-- Competitions and Challenge Entries Schema
-- This schema manages competitions, participant entries, and leaderboards
-- with proper privacy protection for participant data

-- Competitions table
CREATE TABLE IF NOT EXISTS competitions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL CHECK (type IN ('individual', 'team')),
    sport VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('upcoming', 'active', 'completed', 'cancelled')) DEFAULT 'upcoming',
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    max_participants INTEGER DEFAULT 1000,
    current_participants INTEGER DEFAULT 0,
    prizes JSONB,
    rules TEXT,
    created_by VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT valid_dates CHECK (end_date > start_date),
    CONSTRAINT valid_participants CHECK (current_participants <= max_participants),
    
    -- Indexes
    INDEX idx_competitions_status (status),
    INDEX idx_competitions_sport (sport),
    INDEX idx_competitions_dates (start_date, end_date),
    INDEX idx_competitions_created_by (created_by)
);

-- Challenge entries table (links competitions to video sessions)
CREATE TABLE IF NOT EXISTS challenge_entries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    competition_id UUID NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,
    participant_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    session_id UUID NOT NULL REFERENCES video_sessions(id) ON DELETE CASCADE,
    
    -- Competition-specific data (no PII)
    participant_display_name VARCHAR(255), -- Anonymized display name
    school_id UUID REFERENCES schools(id),
    region_id UUID REFERENCES regions(id),
    
    -- Performance data
    score DECIMAL(5,2) NOT NULL,
    rank INTEGER,
    performance_metrics JSONB, -- Additional metrics from the session
    
    -- Submission details
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(50) NOT NULL CHECK (status IN ('pending', 'approved', 'disqualified', 'withdrawn')) DEFAULT 'pending',
    reviewed_by VARCHAR(255),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    review_notes TEXT,
    
    -- Constraints
    CONSTRAINT unique_participant_competition UNIQUE (competition_id, participant_id),
    CONSTRAINT valid_score CHECK (score >= 0 AND score <= 100),
    CONSTRAINT valid_rank CHECK (rank > 0),
    
    -- Indexes
    INDEX idx_challenge_entries_competition (competition_id),
    INDEX idx_challenge_entries_participant (participant_id),
    INDEX idx_challenge_entries_session (session_id),
    INDEX idx_challenge_entries_score (competition_id, score DESC),
    INDEX idx_challenge_entries_rank (competition_id, rank ASC),
    INDEX idx_challenge_entries_status (status),
    INDEX idx_challenge_entries_school (school_id),
    INDEX idx_challenge_entries_region (region_id)
);

-- Leaderboards view (anonymized for public display)
CREATE OR REPLACE VIEW competition_leaderboards AS
SELECT 
    ce.competition_id,
    c.title as competition_title,
    c.sport,
    c.type as competition_type,
    c.status as competition_status,
    
    -- Anonymized participant data
    ce.id as entry_id,
    COALESCE(ce.participant_display_name, CONCAT('مشارك رقم ', LPAD(ce.rank::text, 3, '0'))) as participant_name,
    s.school_name,
    r.region_name,
    
    -- Performance data
    ce.score,
    ce.rank,
    ce.submitted_at,
    ce.status as entry_status,
    
    -- Session reference (no personal data)
    ce.session_id,
    
    -- Aggregated metrics
    ce.performance_metrics
    
FROM challenge_entries ce
JOIN competitions c ON ce.competition_id = c.id
LEFT JOIN schools s ON ce.school_id = s.id
LEFT JOIN regions r ON ce.region_id = r.id

WHERE ce.status = 'approved'
  AND c.status IN ('active', 'completed')

ORDER BY ce.competition_id, ce.rank ASC;

-- Competition statistics view (aggregated data only)
CREATE OR REPLACE VIEW competition_stats AS
SELECT 
    c.id as competition_id,
    c.title,
    c.sport,
    c.type,
    c.status,
    c.start_date,
    c.end_date,
    c.max_participants,
    
    -- Participation statistics
    COUNT(DISTINCT ce.participant_id) as total_participants,
    COUNT(DISTINCT CASE WHEN ce.status = 'approved' THEN ce.participant_id END) as approved_participants,
    COUNT(DISTINCT ce.school_id) as participating_schools,
    COUNT(DISTINCT ce.region_id) as participating_regions,
    
    -- Performance statistics
    ROUND(AVG(ce.score), 2) as average_score,
    MAX(ce.score) as highest_score,
    MIN(ce.score) as lowest_score,
    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY ce.score) as median_score,
    
    -- Temporal statistics
    MIN(ce.submitted_at) as first_submission,
    MAX(ce.submitted_at) as last_submission,
    
    -- Update timestamp
    NOW() as stats_generated_at

FROM competitions c
LEFT JOIN challenge_entries ce ON c.id = ce.competition_id

GROUP BY c.id, c.title, c.sport, c.type, c.status, c.start_date, c.end_date, c.max_participants

ORDER BY c.created_at DESC;

-- Row Level Security for competitions
ALTER TABLE competitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_entries ENABLE ROW LEVEL SECURITY;

-- Policy: Competition organizers can manage their competitions
CREATE POLICY competition_organizer_access ON competitions
    FOR ALL TO competition_organizers
    USING (created_by = current_user_id());

-- Policy: Public can view active and completed competitions
CREATE POLICY public_competition_view ON competitions
    FOR SELECT TO public
    USING (status IN ('active', 'completed'));

-- Policy: Participants can view their own entries
CREATE POLICY participant_own_entries ON challenge_entries
    FOR SELECT TO students
    USING (participant_id = current_user_id());

-- Policy: Competition organizers can manage entries for their competitions
CREATE POLICY organizer_manage_entries ON challenge_entries
    FOR ALL TO competition_organizers
    USING (
        competition_id IN (
            SELECT id FROM competitions WHERE created_by = current_user_id()
        )
    );

-- Policy: Public can view approved entries (anonymized)
CREATE POLICY public_approved_entries ON challenge_entries
    FOR SELECT TO public
    USING (status = 'approved');

-- Function to update competition participant count
CREATE OR REPLACE FUNCTION update_competition_participants()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE competitions 
        SET current_participants = (
            SELECT COUNT(DISTINCT participant_id) 
            FROM challenge_entries 
            WHERE competition_id = NEW.competition_id 
              AND status IN ('pending', 'approved')
        )
        WHERE id = NEW.competition_id;
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        UPDATE competitions 
        SET current_participants = (
            SELECT COUNT(DISTINCT participant_id) 
            FROM challenge_entries 
            WHERE competition_id = NEW.competition_id 
              AND status IN ('pending', 'approved')
        )
        WHERE id = NEW.competition_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE competitions 
        SET current_participants = (
            SELECT COUNT(DISTINCT participant_id) 
            FROM challenge_entries 
            WHERE competition_id = OLD.competition_id 
              AND status IN ('pending', 'approved')
        )
        WHERE id = OLD.competition_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update participant counts
CREATE TRIGGER trigger_update_competition_participants
    AFTER INSERT OR UPDATE OR DELETE ON challenge_entries
    FOR EACH ROW
    EXECUTE FUNCTION update_competition_participants();

-- Function to automatically assign ranks based on scores
CREATE OR REPLACE FUNCTION update_competition_ranks(comp_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE challenge_entries 
    SET rank = ranked.new_rank
    FROM (
        SELECT 
            id,
            ROW_NUMBER() OVER (ORDER BY score DESC, submitted_at ASC) as new_rank
        FROM challenge_entries 
        WHERE competition_id = comp_id 
          AND status = 'approved'
    ) ranked
    WHERE challenge_entries.id = ranked.id
      AND challenge_entries.competition_id = comp_id;
END;
$$ LANGUAGE plpgsql;

-- Function to anonymize participant names for public display
CREATE OR REPLACE FUNCTION anonymize_participant_name(entry_id UUID)
RETURNS VARCHAR(255) AS $$
DECLARE
    entry_rank INTEGER;
    school_name VARCHAR(255);
    result VARCHAR(255);
BEGIN
    SELECT rank, s.school_name 
    INTO entry_rank, school_name
    FROM challenge_entries ce
    LEFT JOIN schools s ON ce.school_id = s.id
    WHERE ce.id = entry_id;
    
    IF entry_rank IS NOT NULL THEN
        result := CONCAT('مشارك رقم ', LPAD(entry_rank::text, 3, '0'));
        IF school_name IS NOT NULL THEN
            result := CONCAT(result, ' - ', school_name);
        END IF;
        RETURN result;
    ELSE
        RETURN 'مشارك مجهول';
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Sample data for testing
INSERT INTO competitions (
    title, description, type, sport, status, start_date, end_date, 
    max_participants, rules, created_by
) VALUES 
(
    'بطولة كرة القدم المدرسية', 
    'بطولة كرة القدم السنوية للمدارس الثانوية في منطقة الرياض',
    'team', 
    'كرة القدم', 
    'active',
    '2025-01-01 00:00:00+00',
    '2025-01-31 23:59:59+00',
    200,
    'قوانين الفيفا المعتمدة مع تعديلات للفئات العمرية',
    'ministry_sports_dept'
),
(
    'مسابقة الجري السريع',
    'سباق 100 متر للطلاب والطالبات في جميع المراحل التعليمية', 
    'individual',
    'ألعاب القوى',
    'upcoming',
    '2025-02-01 00:00:00+00',
    '2025-02-15 23:59:59+00',
    500,
    'قوانين الاتحاد الدولي لألعاب القوى',
    'athletics_federation'
);

-- Indexes for performance optimization
CREATE INDEX IF NOT EXISTS idx_challenge_entries_competition_score 
    ON challenge_entries (competition_id, score DESC) 
    WHERE status = 'approved';

CREATE INDEX IF NOT EXISTS idx_challenge_entries_leaderboard 
    ON challenge_entries (competition_id, rank ASC) 
    WHERE status = 'approved' AND rank IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_competitions_active 
    ON competitions (status, start_date, end_date) 
    WHERE status IN ('active', 'upcoming');