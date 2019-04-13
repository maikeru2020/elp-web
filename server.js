const express = require('express');
const app = express();
const port = process.env.PORT || 8000;

// connect to postgres database
const {Pool} = require('pg');
const dbUrl = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/elp_db';
const pool = new Pool({connectionString: dbUrl});

app.use(express.static('public'));
app.use(express.urlencoded());
app.use(express.json());

app.get('/', function(req, res) {
    res.send('<h1>Hello World</h1>');
});

app.get('/getLessonPlan', function(req, res) {
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

app.post('/insertPlan', function(req, res) {
    var classroomId = 1;
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

    var sql = 'INSERT INTO lesson_plans (classroom_id, week, due_date, week_ending, reference, day_duration, topic, objectives, activities, materials, core_points, evaluation) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)'
    pool.query(sql)
});

app.listen(port, (req, res) => { console.log('Server on port ' + port); });