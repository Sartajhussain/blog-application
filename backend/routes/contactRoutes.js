import express from "express";
import { createContact } from "../controllers/contactController.js";

const router = express.Router();

// ✅ correct
router.post("/", createContact);

export default router;