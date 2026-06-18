import {signUpForm, signInForm} from '../models/form.js';


const signUp = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    try{
        const user = await signUpForm(username, email, password);
        return res.status(201).json({
            message: 'User registered successfully',
            user
        });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to sign up' });
    }
}

const signIn = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const user = await signInForm(email, password);
        if (user) {
            req.session.user = user;
            return res.status(200).json({
                message: 'Login successful',
                user
            });
        }
        else {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Failed to sign in' });
    }
}

export { signUp, signIn };