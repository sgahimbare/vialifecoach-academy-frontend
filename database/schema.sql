-- Vialifecoach GF Application Portal Database Schema
-- Based on the full-stack architecture provided

-- Users table
CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Common applications table (for GF Application Portal)
CREATE TABLE common_applications(
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    data JSONB NOT NULL DEFAULT '{}',
    completed BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Programs table
CREATE TABLE programs(
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT DEFAULT 'program',
    status TEXT DEFAULT 'active',
    deadline DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Applications table (submitted applications)
CREATE TABLE applications(
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    program_id INTEGER REFERENCES programs(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'Submitted',
    submitted_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data JSONB DEFAULT '{}'
);

-- Supporting documents table
CREATE TABLE supporting_documents(
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    application_id INTEGER REFERENCES applications(id) ON DELETE CASCADE,
    document_type TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER,
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Recommendations table
CREATE TABLE recommendations(
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    application_id INTEGER REFERENCES applications(id) ON DELETE CASCADE,
    recommender_name TEXT NOT NULL,
    recommender_email TEXT NOT NULL,
    recommender_title TEXT,
    recommender_institution TEXT,
    relationship TEXT,
    status TEXT DEFAULT 'pending',
    submitted_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Application reviews table (for admin use)
CREATE TABLE application_reviews(
    id SERIAL PRIMARY KEY,
    application_id INTEGER REFERENCES applications(id) ON DELETE CASCADE,
    reviewer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    review_score INTEGER CHECK (review_score >= 1 AND review_score <= 5),
    review_comments TEXT,
    review_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Email notifications table
CREATE TABLE email_notifications(
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    application_id INTEGER REFERENCES applications(id) ON DELETE CASCADE,
    notification_type TEXT NOT NULL,
    subject TEXT NOT NULL,
    content TEXT NOT NULL,
    sent BOOLEAN DEFAULT false,
    sent_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default programs
INSERT INTO programs(title, description, type, status) VALUES
('Women Refugee Rise Program', 'A comprehensive empowerment program helping refugee women build mental resilience, entrepreneurial skills, and remote career opportunities.', 'scholarship', 'active'),
('Digital Skills Training', 'Learn digital tools including productivity software, communication platforms, and online work skills for modern employment.', 'training', 'active'),
('Business Mentorship Program', 'Receive guidance from experienced entrepreneurs who will help you develop your business idea and strategy.', 'volunteer', 'active'),
('GVB Healing Program', 'Technology-based healing and empowerment program for survivors of gender-based violence.', 'program', 'active'),
('Inner Leadership Program', 'Leadership development and personal growth program focused on building inner strength and resilience.', 'program', 'active');

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_common_applications_user_id ON common_applications(user_id);
CREATE INDEX idx_applications_user_id ON applications(user_id);
CREATE INDEX idx_applications_program_id ON applications(program_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_supporting_documents_user_id ON supporting_documents(user_id);
CREATE INDEX idx_supporting_documents_application_id ON supporting_documents(application_id);
CREATE INDEX idx_recommendations_user_id ON recommendations(user_id);
CREATE INDEX idx_recommendations_application_id ON recommendations(application_id);
CREATE INDEX idx_application_reviews_application_id ON application_reviews(application_id);
CREATE INDEX idx_email_notifications_user_id ON email_notifications(user_id);

-- Create trigger to update updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_common_applications_updated_at BEFORE UPDATE ON common_applications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_programs_updated_at BEFORE UPDATE ON programs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

