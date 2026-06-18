import {signUpForm, signInForm} from '../models/form.js';


const signUp = async (req, res) => {
    const { username, email, password_hash } = req.body;
    try{
        const user = await signUpForm(username, email, password_hash);
        res.status(201).json(user);

        res.redirect('/login');
    } catch (error) {
        res.status(500).json({ error: 'Failed to sign up' });
        res.redirect('/signup');
    }
}

const signIn = async (req, res) => {
    const { email, password_hash } = req.body;
    try {
        const user = await signInForm(email, password_hash);
        if (user) {
            req.session.user = user;
            res.status(200).json(user);
            res.redirect('/dashboard');
        }
        else {
            res.status(401).json({ error: 'Invalid email or password' });
            res.redirect('/login');
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to sign in' });
        res.redirect('/login');
    }
}

export { signUp, signIn };