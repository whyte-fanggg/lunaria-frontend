// src/pages/MoodEntry.tsx
import { collection, addDoc, Timestamp } from "firebase/firestore"
import { db } from "../firebase"
import { useState } from "react"
import { toast } from "react-hot-toast"
import { motion } from "framer-motion"
import { useUser } from "../context/UserContext"
import Footer from "../components/Footer"

const moods = [
  { emoji: "😊", label: "happy" },
  { emoji: "😢", label: "sad" },
  { emoji: "😠", label: "angry" },
  { emoji: "😌", label: "calm" },
  { emoji: "😍", label: "loved" },
  { emoji: "😴", label: "tired" },
  { emoji: "😬", label: "anxious" },
  { emoji: "🤩", label: "excited" },
  { emoji: "🤔", label: "confused" },
  { emoji: "🙏", label: "grateful" },
  { emoji: "💪", label: "motivated" },
]

export default function MoodEntry() {
  const { name } = useUser()
  const [selectedMood, setSelectedMood] = useState("")
  const [note, setNote] = useState("")
  const [song, setSong] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!selectedMood || !note.trim()) {
      toast.error("Please select a mood and enter a note.")
      return
    }

    setLoading(true)

    try {
      await addDoc(collection(db, "mood_logs"), {
        emotion: selectedMood,
        note,
        song,
        date: new Date(date),
        author: name,
        createdAt: Timestamp.now(),
      })

      toast.success("Mood logged!")
      setSelectedMood("")
      setNote("")
      setSong("")
      setDate(new Date().toISOString().split("T")[0])
    } catch (err) {
      console.error(err)
      toast.error("Failed to log mood.")
    } finally {
      setLoading(false)
    }
  }

  const [hoveredMood, setHoveredMood] = useState<string | null>(null)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })

  function handleMouseMove(e: React.MouseEvent, label: string) {
    setHoveredMood(label)
    setTooltipPos({ x: e.clientX, y: e.clientY })
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
            key={m.label}
            whileTap={{ scale: 1.1 }}
            onClick={() => setSelectedMood(m.label)}
            onMouseMove={(e) => handleMouseMove(e, m.label)}
            onMouseLeave={() => setHoveredMood(null)}
            className={`text-3xl p-3 rounded-full border-2 transition-all duration-300 ${
              selectedMood === m.label
                ? "bg-pink-100 border-pink-400"
                : "border-gray-300 hover:bg-gray-100"
            }`}
          >
            {m.emoji}
          </motion.button>
        ))}
      </div>

      {hoveredMood && (
        <motion.div
          className="fixed px-3 py-1 text-xs rounded-xl shadow-lg bg-white text-gray-800 border border-gray-300 pointer-events-none z-50"
          style={{
            top: tooltipPos.y + 15,
            left: tooltipPos.x + 15,
          }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.15 }}
        >
          {hoveredMood.charAt(0).toUpperCase() + hoveredMood.slice(1)}
        </motion.div>
      )}

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
