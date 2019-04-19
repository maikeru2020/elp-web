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

app.get('/getPlan', function(req, res) {
    var week = req.query.week;
    var classroomId = req.session.classroomId;
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

app.get('/getPlanById', function(req, res) {
    var planId = req.query.planId;
    var values = [planId];
    var sql = 'SELECT * FROM lesson_plans WHERE id=$1';
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
    var isApproved = false;
    var schoolId = 1  // req.session.schoolId;
    var unread = false;

    var values = [classroomId, subjectId, week, dueDate, weekEnding, reference, dayDuration, topic, objectives, activities, materials, corePoints, evaluation, unread, isApproved, schoolId];
    var sql = 'INSERT INTO lesson_plans (classroom_id, subject_id, week, due_date, week_ending, reference, day_duration, topic, objectives, activities, materials, core_points, evaluation, is_approved, unread, school_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)'
    pool.query(sql, values, function(err) {
        if (err) {
            console.log(err);
        } else {
            res.send({success: true});
        }
    });
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
                        var user = result.rows[0];
                        req.session.schoolId = user.school_id;
                        req.session.accountType = user.account_type;
                        req.session.userId = user.id;

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
    var schoolId = 1;
    //var schoolId = Number(req.session.schoolId);

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

app.post('/updatePlan', function(req, res) {
    var planId = req.body.planId;
    var weekEnding = req.body.weekEnding;
    var reference = req.body.reference;
    var dayDuration = req.body.dayDuration;
    var topic = req.body.topic;
    var objectives = req.body.objectives;
    var activities = req.body.activities;
    var materials = req.body.materials;
    var corePoints = req.body.corePoints;
    var evaluation = req.body.evaluation;

    var values = [weekEnding, reference, dayDuration, topic, objectives, activities, materials, corePoints, evaluation, planId];
    var sql = 'UPDATE lesson_plans SET week_ending=$1, reference=$2, day_duration=$3, topic=$4, objectives=$5, activities=$6, materials=$7, core_points=$8, evaluation=$9, is_approved=false, unread=true WHERE id=$10';
    pool.query(sql, values, function(err) {
        if (err) {
            console.log(err);
        } else {
            res.send({success: true});
        }
    });
});

app.get('/getClassroom', function(req, res) {
    var classroomId = req.query.classroomId;
    req.session.classroomId = classroomId;
    var values = [classroomId];
    var sql = 'SELECT * FROM classrooms WHERE id=$1';
    pool.query(sql, values, function(err, result) {
        if (err) {
            console.log(err);
        } else {
            res.send({classroom: result.rows[0]});
        }
    });
});

app.post('/approvePlan', function(req, res) {
    var planId = req.body.planId;
    var values = [planId];
    var sql = 'UPDATE lesson_plans SET is_approved=true, unread=false WHERE id=$1';
    pool.query(sql, values, function(err) {
        if (err) {
            console.log(err);
        } else {
            res.send({success: true});
        }
    });
});

app.post('/insertComment', function(req, res) {
    var planId = req.body.planId;
    var comment = req.body.comment;
    var values = [planId, comment];
    var sql = 'INSERT INTO comments (lesson_plan_id, comment) VALUES ($1, $2)';
    pool.query(sql, values, function(err) {
        if (err) {
            console.log(err);
        } else {
            var values2 = [planId];
            var sql2 = 'UPDATE lesson_plans SET unread=false WHERE id=$1';
            pool.query(sql2, values2, function(err) {
                if (err) {
                    console.log(err);
                } else {
                    res.send({success: true});
                }
            });
        }
    });
});

app.get('/getComments', function(req, res) {
    var week = req.query.week;
    var classroomId = req.session.classroomId;
    var values = [week, classroomId];
    var sql = 'SELECT c.comment FROM comments c JOIN lesson_plans lp ON lp.id=c.lesson_plan_id WHERE lp.week=$1 AND lp.classroom_id=$2';
    pool.query(sql, values, function(err, result) {
        if (err) {
            console.log(err);
        } else {
            res.send(result.rows);
        }
    });
});

app.get('/login', function(req, res) {
    res.render('login');
});

app.get('/teacher', function(req, res) {
    // if (req.session.accountType == 'teacher') {
        var userId = 1 // req.session.userId;
        values = [userId];
        sql = 'SELECT * FROM classrooms WHERE teacher_id=$1';
        pool.query(sql, values, function(err, result) {
            if (err) {
                console.log(err);
            } else {
                var classrooms = result.rows;
                if (!req.session.classroomId && classrooms.length > 0) {
                    req.session.classroomId = classrooms[0].id;
                }
                res.render('teacher', {classrooms: classrooms});
            }
        });

    // } else {
    //     res.redirect('login');
    // }

});

app.get('/parent', function(req, res) {
    res.render('parent');
    // if (req.session.accountType == 'parent') {
        res.render('parent');
    // } else {
    //     res.redirect('login');
    // }
});

app.get('/admin', function(req, res) {
    // if (req.session.accountType == 'admin') {
        res.render('admin');
    // } else {
    //     res.redirect('login');
    // }
});

app.get('/headmaster', function(req, res) {
    // if (req.session.accountType == 'headmaster') {
        var schoolId = 1 // req.session.schoolId;
        var values = [schoolId];
        var sql = 'SELECT lp.id, lp.week, s.subject_name FROM lesson_plans lp JOIN subjects s ON s.id=lp.subject_id WHERE school_id=$1 AND unread=true';
        pool.query(sql, values, function(err, result) {
            if (err) {
                console.log(err);
            } else {
                res.render('headmaster', {lessonPlans: result.rows});
            }
        });
    // } else {
    //     res.redirect('login');
    // }
});

app.listen(port, (req, res) => { console.log('Server on port ' + port); });