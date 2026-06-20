import { signUpForm } from "../models/form";
import flash from 'connect-flash';
import { body } from "express-validator";


const validateSignUpForm = [
    body("username")
        .trim()
        .isEmpty()
        .withMessage("Please enter a username."),
    body("email")
        .trim()
        .isEmpty()
        .withMessage("Please enter your email.")
        .normalizeEmail()
        .withMessage("Email should contain @ after characters."),
    body("password")
        .trim()
        .isEmpty()
        .withMessage("Please enter a password")
        .isLength({min: 6})
        .withMessage("Please enter a password with a minimum of 6 characters.")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/) 
];

const handleSignUp = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const newUser = await signUpForm(username, email, password);
        req.flash('success', "CineMate account has been created successfully.");
    } catch (error) {
        if (process.env.NODE_ENV == 'development') {
            console.error("Error signing up user:", error);
        }
        req.flash("error", "Error creating your CineMate account. Please try again");
    }
};





export { handleSignUp, validateSignUpForm };