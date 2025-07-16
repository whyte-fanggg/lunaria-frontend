import express from "express"
import Mood from "../models/Mood"

const router = express.Router()

router.post("/mood", async (req, res) => {
  try {
    const { emotion, note, song, date, author } = req.body
    const savedMood = await Mood.create({ emotion, note, song, date, author })
    res.json(savedMood)
  } catch (err) {
    console.error(err) // logs error
    res.status(500).json({ error: "Failed to save mood" })
  }
})

router.get("/mood", async (_req, res) => {
  try {
    const moods = await Mood.find().sort({ date: -1 })
    res.json(moods)
  } catch (err) {
    console.error(err) // logs error
    res.status(500).json({ error: "Failed to fetch moods" })
  }
})

export default router
