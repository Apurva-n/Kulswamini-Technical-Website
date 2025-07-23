require('dotenv').config();

const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());


const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});


db.connect(err => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to MySQL');
});

app.post('/enroll', (req, res) => {
  const { fullname, dob, gender, email, phone, course } = req.body;

  console.log("Received data:", req.body);

  if (!fullname || !dob || !gender || !email || !phone || !course) {
    return res.status(400).send('Missing required fields');
  }

  const sql = `INSERT INTO Enroll (fullname, dob, gender, email, phone, course) VALUES (?, ?, ?, ?, ?, ?)`;
  db.query(sql, [fullname, dob, gender, email, phone, course], (err, result) => {
    if (err) {
      console.error("MySQL Error:", err);
      return res.status(500).send('Error inserting data');
    } else {
      res.send('Enrollment successful');
    }
  });
});

app.delete('/cancel-enrollment', async (req, res) => {
  try {
    const { email } = req.body;

    const [result] = await db.query("DELETE FROM Enroll WHERE email = ?", [email]);

    if (result.affectedRows === 0) {
      return res.status(404).send("Enrollment not found for this email.");
    }

    res.send("Enrollment canceled successfully.");
  } catch (err) {
    console.error("Error cancelling enrollment:", err);
    res.status(500).send("Server error");
  }
});


app.get('/fetch', (req, res) => {
  db.query('SELECT * FROM Enroll', (err, results) => {
    if (err) {
      res.status(500).send('Error fetching data');
    } else {
      res.json(results);
    }
  });
});


app.post('/signup', (req, res) => {
  const { fullname, email, password } = req.body;

  const sql = 'INSERT INTO Signup (fullname, email, password) VALUES (?, ?, ?)';
  db.query(sql, [fullname, email, password], (err, result) => {
    if (err) {
      console.error('Insert error:', err);
      return res.status(500).send('Database error');
    }
    res.status(200).send('User registered successfully');
  });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const sql = `SELECT * FROM Signup WHERE email = ? AND password = ?`;
  db.query(sql, [email, password], (err, results) => {
    if (err || results.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = results[0];
    
    // Check if enrolled
    const enrollCheckSql = `SELECT * FROM Enroll WHERE email = ?`;
    db.query(enrollCheckSql, [email], (err2, enrollResults) => {
      if (err2) return res.status(500).send('Database error');

      const isEnrolled = enrollResults.length > 0;
      res.status(200).json({
        message: 'Login successful',
        role: user.role,
        enrolled: isEnrolled,
        fullname: user.fullname,
        email: user.email
      });
    });
  });
});




app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
