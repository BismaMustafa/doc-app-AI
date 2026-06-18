import axios from "axios";
import VoiceRecord from "../models/voiceRecord.js";

export const analyzeVoiceSymptom = async (req, res) => {
  try {
    const { doctorId, appointmentId, symptomText } = req.body;

    if (!doctorId || !symptomText) {
      return res.status(400).json({ error: "doctorId and symptomText required" });
    }

    // Call Ollama
    let diagnosis;
    try {
      const ollamaRes = await axios.post("http://localhost:11434/api/generate", {
        model: "tinyllama",
        prompt: `You are a medical assistant. Respond ONLY in English. Patient says: "${symptomText}". Give short medical advice in English.`,
        stream: false
      });
      diagnosis = ollamaRes.data.response;
    } catch (ollamaError) {
      console.error("Ollama not available, using fallback:", ollamaError.message);
      // Fallback response when AI is not available
      diagnosis = `Based on the symptom "${symptomText}", please consult a healthcare professional for proper diagnosis. This is a temporary response while AI services are being configured.`;
    }

    const record = await VoiceRecord.create({
      doctorId,
      appointmentId,
      symptomText,
      diagnosis,
    });

    res.status(200).json(record);

  } catch (error) {
    console.error("OLLAMA ERROR:", error.message);
    res.status(500).json({ error: "AI analysis failed" });
  }
};