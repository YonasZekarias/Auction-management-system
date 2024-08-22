import express from 'express';
import dotenv from 'dotenv';
import pg from 'pg';
const { Pool } = pg;

dotenv.config();

const app = express();
app.use(express.json());

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
});

// Create a new user
app.post('/users', async (req, res) => {
    const {
        firstName,
        lastName,
        countryCode,
        phoneNumber,
        profileImgUrl,
        status,
        password,
        email,
        verified
    } = req.body;

    try {
        const newUser = await pool.query(
            `INSERT INTO "user" (first_name, last_name, country_code, phone_number, profile_img_url, status, password, email, verified, created_at, updated_at) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW()) RETURNING *`,
            [firstName, lastName, countryCode, phoneNumber, profileImgUrl, status, password, email, verified]
        );

        res.status(201).json(newUser.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Read all users
app.get('/users', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM "user"');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
