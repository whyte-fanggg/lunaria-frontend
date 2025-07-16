import mongoose from "mongoose"

const moodSchema = new mongoose.Schema({
  emotion: { type: String, required: true },
  note: { type: String },
  song: { type: String },
  author: { type: String },
  date: { type: Date, default: Date.now },
})

export default mongoose.model("Mood", moodSchema, "mood_logs")
