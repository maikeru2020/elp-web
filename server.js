const express = require('express');
const app = express();

const port = process.env.PORT || 8000;

app.get('/', function(req, res) {
    res.send('<h1>Hello World</h1>');
});

app.listen(port, (req, res) => { console.log('Server on port ' + port); });