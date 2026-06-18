import db from './db.js';


// sign up form
const signUpForm = async (username, email, password_hash) => {
    const query = `INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING *`;

    const result = await db.query(query, [username, email, password_hash]);

    return result.rows[0];
}


// sign in form
const signInForm = async (email) => {
    const query = `SELECT * FROM users WHERE email = $1`;

    const result = await db.query(query, [email]);

    return result.rows[0];
}

export { signUpForm, signInForm };