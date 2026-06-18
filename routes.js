import express from 'express';
import { signUp, signIn } from './src/controllers/form.js';


const router = express.Router();

router.get("/", signUp);
router.get("/login", signIn);


export default router;
