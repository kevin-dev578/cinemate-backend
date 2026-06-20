import db from '../models/db.js';
import bcrypt from 'bcrypt';

const signUpForm = async (username, email, password) => {
    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const query = `INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING user_id`;
        const result = await db.query(query, [username, email, hashedPassword]);

        if (result.rows.length === 0){
            return null;
        }
        return result.rows[0];
    } catch (err) {
        if (process.env.NODE_ENV === 'development'){
            console.error("Error inserting user:", err.stack);
        }
        throw new Error("Could not create user");
    }
};

const authenticateLogin = async (email, password) => {

    try{
        const query = `SELECT user_id, username, email, password_hash FROM users
            Where email = $1`;

        const result = await db.query(query, [email]);
        if (result.rows.length === 0) {
            // No user found
            return null;
        }

        const user = result.rows[0];
        const match = await bcrypt.compare(password, user.password_hash);

        if (!match) {
            // Password does not match
            return null;
        }

        return {
            user_id: user.user_id,
            username: user.username,
            email: user.email
        };
    } catch (err) {
    console.error("Error authenticating user:", err.stack);
    throw new Error("Authentication failed");
    }       
}
 

export { signUpForm, authenticateLogin };