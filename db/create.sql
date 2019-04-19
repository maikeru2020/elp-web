CREATE TABLE schools (
    id SERIAL PRIMARY KEY,
    school_name VARCHAR(255),
    school_number VARCHAR(255)
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    username VARCHAR(255),
    password_hash VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(255),
    account_type VARCHAR(255),
    school_id INT REFERENCES schools
);

CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255),
    last_name VARCHAR(255)
);

CREATE TABLE terms (
    id SERIAL PRIMARY KEY,
    academic_year VARCHAR(255),
    term_number VARCHAR(255)
);

CREATE TABLE subjects (
    id SERIAL PRIMARY KEY,
    subject_name VARCHAR(255)
);

CREATE TABLE classrooms (
    id SERIAL PRIMARY KEY,
    classroom_name VARCHAR(255),
    term_id INT REFERENCES terms,
    subject_id INT REFERENCES subjects,
    teacher_id INT REFERENCES users
);

CREATE TABLE students_classrooms (
    student_id INT REFERENCES students,
    classroom_id INT REFERENCES classrooms
);

CREATE TABLE teachers_classrooms (
    teacher_id INT REFERENCES users,
    classroom_id INT REFERENCES classrooms 
);

CREATE TABLE lesson_plans (
    id SERIAL PRIMARY KEY,
    week INT,
    due_date DATE,
    week_ending DATE,
    reference VARCHAR(255),
    day_duration TEXT,
    topic VARCHAR(255),
    objectives TEXT,
    activities TEXT,
    materials VARCHAR(255),
    core_points TEXT,
    evaluation TEXT,
    is_approved BOOLEAN,
    
    subject_id INT REFERENCES subjects,
    school_id INT REFERENCES schools,
    classroom_id INT REFERENCES classrooms
);

CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    comment TEXT,
    lesson_plan_id INT REFERENCES lesson_plans,
    is_read BOOLEAN
);

CREATE TABLE submissions (
    id SERIAL PRIMARY KEY,
    submission_date DATE,
    lesson_plan_id INT REFERENCES lesson_plans
);