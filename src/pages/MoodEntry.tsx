// src/pages/MoodEntry.tsx
import { useState } from "react"
import { toast } from "react-hot-toast"
import { motion } from "framer-motion"
import { useUser } from "../context/UserContext"
import Footer from "../components/Footer"

const moods = [
  { emoji: "😊", label: "happy" },
  { emoji: "😢", label: "sad" },
  { emoji: "😠", label: "angry" },
  { emoji: "😍", label: "loved" },
  { emoji: "😴", label: "tired" },
  { emoji: "😬", label: "anxious" },
  { emoji: "🤩", label: "excited" },
]

export default function MoodEntry() {
  const { name } = useUser()
  const [selectedMood, setSelectedMood] = useState("")
  const [note, setNote] = useState("")
  const [song, setSong] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!selectedMood) return toast.error("Please select a mood.")

    setLoading(true)
    try {
      const res = await fetch("http://localhost:4000/mood", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emotion: selectedMood,
          note,
          song,
          date,
          author: name,
        }),
      })

      if (!res.ok) throw new Error("Failed to save mood")

      toast.success("Mood logged!")
      setSelectedMood("")
      setNote("")
      setSong("")
      setDate(new Date().toISOString().split("T")[0])
    } catch (err) {
      console.error(err)
      toast.error("Error saving mood")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-100 to-amber-100 font-outfit px-4 pt-4 pb-10 flex flex-col items-center justify-center text-gray-800">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-semibold mb-6 text-center"
      >
        How are you feeling today?
      </motion.h1>

      <div className="flex flex-wrap justify-center gap-3 mb-6">
        {moods.map((m) => (
          <motion.button
            whileTap={{ scale: 1.1 }}
            key={m.label}
            onClick={() => setSelectedMood(m.label)}
            className={`text-3xl p-3 rounded-full border-2 transition-all ${
              selectedMood === m.label
                ? "bg-pink-100 border-pink-400"
                : "border-gray-300 hover:bg-gray-100"
            }`}
          >
            {m.emoji}
          </motion.button>
        ))}
      </div>

      <div className="w-full max-w-md space-y-4">
        {/* Note */}
        <div className="relative">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="peer w-full p-4 pt-6 border rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-300 bg-white resize-none"
            rows={3}
            placeholder=" "
          />
          <label className="absolute left-4 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-gray-500">
            Note (optional)
          </label>
        </div>

        {/* Song */}
        <div className="relative">
          <input
            type="text"
            value={song}
            onChange={(e) => setSong(e.target.value)}
            className="peer w-full p-4 pt-6 border rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-300 bg-white"
            placeholder=" "
          />
          <label className="absolute left-4 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-gray-500">
            Song you're vibing to (optional)
          </label>
        </div>

        {/* Date */}
        <div className="relative">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="peer w-full p-4 pt-6 border rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-300 bg-white"
          />
          <label className="absolute left-4 top-2 text-gray-500 text-sm peer-focus:text-sm peer-focus:text-gray-500">
            Date
          </label>
        </div>

        {/* Submit */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-pink-500 hover:bg-pink-600 text-white font-medium py-3 rounded-xl shadow disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Saving..." : "Save Mood"}
        </motion.button>
      </div>
      <Footer />
    </main>
  )
}
