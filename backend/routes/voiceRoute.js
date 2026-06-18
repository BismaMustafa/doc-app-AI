import express from "express";
import { analyzeVoiceSymptom } from "../controllers/voiceController.js";

const router = express.Router();

// POST analyze symptom
router.post("/", analyzeVoiceSymptom);

// GET all records
// router.get("/", getAllVoiceRecords);

export default router;
