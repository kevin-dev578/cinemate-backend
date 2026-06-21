import { Router } from "express";
import {
    handleSignUp,
    validateSignUpForm,
    validateLoginForm,
    handleAuthentication,
    handleValidationErrors,
    getCurrentUser
} from "./src/controllers/form.js";

const router = Router();

router.post("/login", validateLoginForm, handleValidationErrors, handleAuthentication);
router.post("/register", validateSignUpForm, handleValidationErrors, handleSignUp);
router.get("/me", getCurrentUser);

export { router as default };