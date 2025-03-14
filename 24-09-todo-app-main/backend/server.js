const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();



const app = express();


const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
})

app.use(cors());                
app.use(bodyParser.json());     

app.get('/liste_abrufen', async (req, res) => {
    const result = await pool.query('SELECT * FROM tasks')
    res.json(result.rows)
});

app.post('/add', async (req, res) => {
    console.log("POST kommt an");
    const result = await pool.query(
        'INSERT INTO tasks (title) VALUES ($1) RETURNING *',
        [req.body.title]
    );
    console.log(result.rows); 
    res.json(result.rows);  
});



app.listen(3050, "localhost", () => {
    console.log("bald wird es Mittagspause")
});