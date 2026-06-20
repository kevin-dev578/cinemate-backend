import { signUpForm, authenticateLogin } from "../models/form.js";
import flash from 'connect-flash';
import { body } from "express-validator";
import session from "express-session";


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

const handleSignUp = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const newUser = await signUpForm(username, email, password);
        req.flash('success', "CineMate account has been created successfully.");
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
        req.flash("error", "Error creating your CineMate account. Please try again");
        res.status(400).json({ success: false, message: "Signup failed" });

    }
};

const handleAuthentication = async (req, res) => {
    try{

        const {email, password} = req.body;
        const userLogin = await authenticateLogin(email, password);

        if (!userLogin) {
            req.flash("error", "Invalid email or password.");
            return res.status(401).json({ success: false, message: "Login failed" });
          }

        req.session.user = {id: userLogin.user_id, email: userLogin.email};
        req.flash("success", "Login successful.");
        res.status(200).json({ success: true, message: "Login successful", user: userLogin });
    } catch(error){
        if (process.env.NODE_ENV == 'development') {
            console.error("Error signing up user:", error);
        }
        req.flash("error", "Error logging in your account, please try again.");
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

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


export { handleSignUp, validateSignUpForm, validateLoginForm, handleAuthentication };