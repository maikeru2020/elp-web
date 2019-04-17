const express = require('express');
const bcrypt = require('bcrypt');
const session = require('express-session');
const app = express();
const port = process.env.PORT || 8000;

// connect to postgres database
const {Pool} = require('pg');
const dbUrl = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/elp_db';
const pool = new Pool({connectionString: dbUrl});

app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(session({
    secret: 'freddy is awesome',
    resave: false,
    saveUninitialized: true
}));

app.set('view engine', 'ejs');

app.get('/', function(req, res) {
    res.redirect('login');
});

app.get('/getLessonPlan', function(req, res) {
    var week = req.query.week;
    var classroomId = 1 // req.session.classroomId;
    var values = [classroomId, week];
    var sql = 'SELECT * FROM lesson_plans WHERE classroom_id=$1 AND week=$2';
    pool.query(sql, values, function(err, result) {
        if (err) {
            console.log(err);
        } else {
            res.send(result.rows[0]);
        }
    });
});

app.post('/insertPlan', function(req, res) {
    var classroomId = 1;
    var subjectId = Number(req.body.subjectId);
    var week = Number(req.body.week);
    var dueDate = req.body.dueDate;
    var weekEnding = req.body.weekEnding;
    var reference = req.body.reference;
    var dayDuration = req.body.dayDuration;
    var topic = req.body.topic;
    var objectives = req.body.objectives;
    var activities = req.body.activities;
    var materials = req.body.materials;
    var corePoints = req.body.corePoints;
    var evaluation = req.body.evaluation;

    var values = [classroomId, subjectId, week, dueDate, weekEnding, reference, dayDuration, topic, objectives, activities, materials, corePoints, evaluation];
    var sql = 'INSERT INTO lesson_plans (classroom_id, subject_id, week, due_date, week_ending, reference, day_duration, topic, objectives, activities, materials, core_points, evaluation) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)'
    pool.query(sql, values, function(err) {
        if (err) {
            console.log(err);
        } else {
            res.send({success: true});
        }
    });
});

app.get('/parents', function(req, res) {

});

app.post('/signIn', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;

    var values = [username];
    var sql = 'SELECT * FROM users WHERE username=$1';
    pool.query(sql, values, function(err, result) {
        if (err) {
            console.log(err);
        } else {
            if (result.rows.length > 0) {
                var passwordHash = result.rows[0].password_hash;
                bcrypt.compare(password, passwordHash, function(err, match) {
                    if (err) {
                        console.log(err);
                    } else if (match) {
                        var accountType = result.rows[0].account_type;
                        var schoolId = result.rows[0].school_id;
                        req.session.schoolId = schoolId;
                        req.session.accountType = accountType;

                        // redirect to route based on account type
                        res.send({redirect: accountType});
                    } else {
                        res.send({message: "Invalid Password"});
                    }
                });
            } else {
                res.send({message: "Invalid Username"});
            }
        }
    });
    
});

app.get('/getStudent', function(req, res) {
    var testMarks = {classTest1: 29, groupExercise: 10, classTest2: 30, projectHomework: 19, exam: 95}
    res.render('students', testMarks);
});

app.post('/createAccount', function(req, res) {
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var username = req.body.username;
    var phone = req.body.phone;
    var password = req.body.password;
    var email = req.body.email;
    var accountType = req.body.accountType;

    // school based on admin session school ID
    var schoolId = Number(req.session.schoolId);

    bcrypt.hash(password, 10, function(err, passwordHash) {
        if (err) {
            console.log(err);
        } else {
            var values = [firstName, lastName, username, phone, passwordHash, email, accountType, schoolId];
            var sql = 'INSERT INTO users (first_name, last_name, username, phone, password_hash, email, account_type, school_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)';
            pool.query(sql, values, function(err) {
                if (err) {
                    console.log(err);
                } else {
                    res.send({success: true});
                }
            });
        }
    });
    
});

app.get('/login', function(req, res) {
    res.render('login');
});

app.get('/teacher', function(req, res) {
    if (req.session.accountType == 'teacher') {
        res.render('teacher');
    } else {
        res.redirect('login');
    }

});

app.get('/parent', function(req, res) {
    if (req.session.accountType == 'parent') {
        res.render('parent');
    } else {
        res.redirect('login');
    }
});

app.get('/admin', function(req, res) {
    if (req.session.accountType == 'admin') {
        res.render('admin');
    } else {
        res.redirect('login');
    }
});

app.listen(port, (req, res) => { console.log('Server on port ' + port); });