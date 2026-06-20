import { Router } from "express";
import { handleSignUp, validateSignUpForm, validateLoginForm, handleAuthentication } from "./src/controllers/form.js";

const router = Router();
router.post("/login", validateLoginForm, handleAuthentication);
router.post("/register", validateSignUpForm, handleSignUp);


export {router as default};