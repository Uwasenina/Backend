import { Router } from "express";
import { createContact } from "../controllers/contactControllers";

const router = Router();
router.post("/send-email", createContact);

export default router;
