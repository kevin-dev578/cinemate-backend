import db from '../models/db.js';

const signUpForm = async (username, email, password) => {
    const query = `INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING user_id`;
    const result = await db.query(query, [username, email, password]);
    return result.rows[0];
};


export { signUpForm };