import mongoose from "mongoose";

const voiceRecordSchema = new mongoose.Schema({
  doctorId: { type: String, required: true },
  appointmentId: { type: String },
  symptomText: { type: String, required: true },
  diagnosis: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

export default mongoose.model("VoiceRecord", voiceRecordSchema);
