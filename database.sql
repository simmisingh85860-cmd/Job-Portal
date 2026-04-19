-- ─── JobPortal Database Schema ───────────────────────────────────────────────
CREATE DATABASE IF NOT EXISTS jobportal;
USE jobportal;

-- Users table (job seekers & employers)
CREATE TABLE IF NOT EXISTS users (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    fullname   VARCHAR(100) NOT NULL,
    email      VARCHAR(150) NOT NULL UNIQUE,
    phone      VARCHAR(20),
    role       ENUM('jobseeker', 'employer') DEFAULT 'jobseeker',
    password   VARCHAR(64)  NOT NULL,   -- SHA-256 hex (use BCrypt in production)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Jobs table
CREATE TABLE IF NOT EXISTS jobs (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    title           VARCHAR(150) NOT NULL,
    company         VARCHAR(100) NOT NULL,
    location        VARCHAR(100),
    category        VARCHAR(50),
    type            ENUM('Full-time','Part-time','Remote','Internship') DEFAULT 'Full-time',
    salary          VARCHAR(80),
    description     TEXT,
    requirements    TEXT,
    contact_email   VARCHAR(150),
    posted_by       INT,
    posted_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (posted_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Applications table
CREATE TABLE IF NOT EXISTS applications (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    job_id       INT NOT NULL,
    user_id      INT NOT NULL,
    cover_letter TEXT,
    applied_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status       ENUM('pending','reviewed','accepted','rejected') DEFAULT 'pending',
    FOREIGN KEY (job_id)  REFERENCES jobs(id)  ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ─── Sample Data ──────────────────────────────────────────────────────────────
INSERT INTO jobs (title, company, location, category, type, salary, description, contact_email) VALUES
('Senior Java Developer',   'TechCorp',     'New York, NY',   'IT',        'Full-time',  '$90k–$120k', '5+ years Java, Spring Boot, REST APIs.',  'hr@techcorp.com'),
('Frontend Developer',      'WebWorks',     'Remote',          'IT',        'Remote',     '$70k–$95k',  'React, CSS, JavaScript expert needed.',    'jobs@webworks.io'),
('Financial Analyst',       'FinGroup',     'Chicago, IL',     'Finance',   'Full-time',  '$65k–$85k',  'Excel, SQL, financial modelling skills.',  'careers@fingroup.com'),
('UX/UI Designer',          'PixelStudio',  'Austin, TX',      'Design',    'Full-time',  '$60k–$80k',  'Figma, Adobe XD, user research.',          'design@pixelstudio.com'),
('Java Servlet Developer',  'EnterpriseApp','Remote',          'IT',        'Remote',     '$80k–$110k', 'Java EE, Servlets, JSP, Tomcat.',          'dev@enterpriseapp.com');
