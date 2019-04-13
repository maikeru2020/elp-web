const express = require('express');
const app = express();
const port = process.env.PORT || 8000;

// connect to postgres database
const {Pool} = require('pg');
const dbUrl = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/elp_db';
const pool = new Pool({connectionString: dbUrl});

app.get('/', function(req, res) {
    res.send('<h1>Hello World</h1>');
});

app.get('/getLessonPlan', function(req, res) {
    var week = req.query.week;
    var classroomId = req.session.classroomId;
    var values = [week, classroomId];
    var sql = 'SELECT * FROM lesson_plans WHERE classroom_id=$1 AND week=$2';
    pool.query(sql, values, function(err, result) {
        
    });
});

app.listen(port, (req, res) => { console.log('Server on port ' + port); });