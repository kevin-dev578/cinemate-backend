import { signUpForm, authenticateLogin } from "../models/form.js";
import { body, validationResult } from "express-validator";

const validateSignUpForm = [
    body("username")
        .trim()
        .notEmpty()
        .withMessage("Please enter a username."),
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Please enter your email.")
        .isEmail()
        .withMessage("Please enter a valid email address.")
        .normalizeEmail(),
    body("password")
        .trim()
        .notEmpty()
        .withMessage("Please enter a password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long.")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)
        .withMessage("Password must include uppercase, lowercase, and a number.")
];

const validateLoginForm = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Please enter your email.")
        .isEmail()
        .withMessage("Please enter a valid email address.")
        .normalizeEmail(),
    body("password")
        .trim()
        .notEmpty()
        .withMessage("Please enter a password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long.")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)
        .withMessage("Password must include uppercase, lowercase, and a number.")
];

const getCurrentUser = (req, res) => {
    if (req.session.user) {
        res.status(200).json({ loggedIn: true, user: req.session.user });
    } else {
        res.status(200).json({ loggedIn: false });
    }
};

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
};

const handleSignUp = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const newUser = await signUpForm(username, email, password);
        req.session.user = {
            id: newUser.user_id,
            username: newUser.username,
            email: newUser.email
        };
        res.status(201).json({ success: true, message: "Account created", userId: newUser.user_id });

    } catch (error) {
        if (process.env.NODE_ENV == 'development') {
            console.error("Error signing up user:", error);
        }

        if (error.message === "DUPLICATE_USER") {
            return res.status(409).json({ success: false, message: "That username or email is already taken." });
        }

        res.status(400).json({ success: false, message: "Signup failed" });
    }
};

const handleAuthentication = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userLogin = await authenticateLogin(email, password);

        if (!userLogin) {
            return res.status(401).json({ success: false, message: "Login failed" });
        }

        req.session.user = { id: userLogin.user_id, email: userLogin.email };
        res.status(200).json({ success: true, message: "Login successful", user: userLogin });
    } catch (error) {
        if (process.env.NODE_ENV == 'development') {
            console.error("Error signing up user:", error);
        }
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export {
    handleSignUp,
    validateSignUpForm,
    validateLoginForm,
    handleAuthentication,
    handleValidationErrors,
    getCurrentUser
};