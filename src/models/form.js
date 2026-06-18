import db from './db.js';
import crypto from 'crypto';

const HASH_ALGORITHM = 'sha512';
const HASH_KEY_LENGTH = 64;
const HASH_ITERATIONS = 120000;

const hashPassword = (password, salt = crypto.randomBytes(16).toString('hex')) => {
    const derivedKey = crypto.pbkdf2Sync(password, salt, HASH_ITERATIONS, HASH_KEY_LENGTH, HASH_ALGORITHM).toString('hex');
    return `${salt}:${derivedKey}`;
};

const verifyPassword = (password, storedHash) => {
    const [salt, storedDerivedKey] = storedHash.split(':');

    if (!salt || !storedDerivedKey) {
        return false;
    }

    const derivedKey = crypto.pbkdf2Sync(password, salt, HASH_ITERATIONS, HASH_KEY_LENGTH, HASH_ALGORITHM).toString('hex');
    const storedBuffer = Buffer.from(storedDerivedKey, 'hex');
    const derivedBuffer = Buffer.from(derivedKey, 'hex');

    if (storedBuffer.length !== derivedBuffer.length) {
        return false;
    }

    return crypto.timingSafeEqual(storedBuffer, derivedBuffer);
};


// sign up form
const signUpForm = async (username, email, password) => {
    const password_hash = hashPassword(password);
    const query = `INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING user_id, username, email, created_at`;

    const result = await db.query(query, [username, email, password_hash]);

    return result.rows[0];
}


// sign in form
const signInForm = async (email, password) => {
    const query = `SELECT user_id, username, email, password_hash, created_at FROM users WHERE email = $1`;

    const result = await db.query(query, [email]);

    const user = result.rows[0];

    if (!user || !verifyPassword(password, user.password_hash)) {
        return null;
    }

    const { password_hash, ...safeUser } = user;

    return safeUser;
}

export { hashPassword, verifyPassword, signUpForm, signInForm };