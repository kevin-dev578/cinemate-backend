import { Router } from "express";
import { handleSignUp } from "./src/controllers/form";

const router = Router();
router.post("/signup", handleSignUp);


export {router as default};