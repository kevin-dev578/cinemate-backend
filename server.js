import express from 'express';
import session from "express-session";
import router from './routes';
import dotenv from 'dotenv';
import { testConnection } from './src/models/db';
dotenv.config();

const nodeEnv = process.env.NODE_ENV?.toLowerCase() || 'production';
const PORT = process.env.PORT || 3000;
const SESSION_SECRET = process.env.SESSION_SECRET;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Configure session middleware with a secret and options for resaving and initializing sessions
app.use(session({
    secret: SESSION_SECRET, // Use the SESSION_SECRET from environment variables for security
    resave: false, // what does this do? - Don't save session if unmodified
    saveUninitialized: true, // Save uninitialized sessions (new but not modified), this means that a session will be created for every user, even if they don't log in or interact with the site, which can lead to a large number of unused sessions in the store. Consider setting this to false if you want to only create sessions for users who log in or interact with the site.
    cookie: { maxAge: 60 * 60 * 1000 } // Session expires after 1 hour of inactivity
}));

app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies (for form submissions)
app.use(express.json()); // Middleware to parse JSON bodies (for API requests)

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));
console.log(`Serving static files from: ${path.join(__dirname, 'public')}`);

// Import and use routes
app.use(router);

// start the server with async/await and error handling incase of issues
app.listen(PORT, async () => {
    try {
        await testConnection();
        console.log(`Server is running at http://127.0.0.1:${PORT}`);
        console.log(`Environment: ${nodeEnv}`);
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
});

// Export app (ESM style)
export default app;