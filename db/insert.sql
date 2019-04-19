INSERT INTO subjects (subject_name)
VALUES ('Math'), ('Science'), ('English');

INSERT INTO terms (academic_year, term_number)
VALUES ('2019/2020', '1'), ('2019/2020', '2'), ('2019/2020', '3');

INSERT INTO schools (school_name, school_number)
VALUES ('Presby Academy', '12345');

INSERT INTO users (first_name, last_name, username, email, phone, account_type, school_id)
VALUES ('Michael', 'Schmidt', 'mschmidt', 'maikeru2020@gmail.com', '509-529-3238', 'admin', 1);

INSERT INTO classrooms (classroom_name, term_id, subject_id, teacher_id)
VALUES ('Math I', 1, 1, 1), ('Science', 1, 2, 1);
