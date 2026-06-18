import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import router from './routes.js';
import { testConnection } from './src/models/db.js';
import session from 'express-session';
import dotenv from 'dotenv';
dotenv.config();



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SESSION_SECRET = process.env.SESSION_SECRET;
if (!SESSION_SECRET) {
    throw new Error('SESSION_SECRET is missing. Set it in your local .env file or in your Render environment variables.');
}
const app = express();
const PORT = process.env.PORT || 3000;

app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 } // Session expires after 1 hour of inactivity
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

app.use(router);

app.listen(PORT, async () => {

    try {
        await testConnection();
        console.log(`Server is running on port ${PORT}`);
    }
    catch (error) {
        console.error('Server is running on port ' + PORT + ', but the database check failed:', error.message);
    }
});