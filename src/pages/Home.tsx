import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
} from "firebase/firestore"
import { db } from "../firebase"
import { useUser } from "../context/UserContext"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"

type MoodLog = {
  _id: string
  emotion:
    | "happy"
    | "sad"
    | "angry"
    | "calm"
    | "loved"
    | "tired"
    | "anxious"
    | "excited"
    | "confused"
    | "grateful"
    | "motivated"
  note: string
  song?: string
  author: string
  date?: Timestamp
  createdAt: Timestamp
}

const moodColors: Record<string, string> = {
  happy: "bg-yellow-200 text-yellow-900",
  sad: "bg-blue-200 text-blue-900",
  angry: "bg-red-200 text-red-900",
  calm: "bg-green-200 text-green-900",
  loved: "bg-pink-200 text-pink-900",
  tired: "bg-purple-200 text-purple-900",
  anxious: "bg-violet-200 text-violet-900",
  excited: "bg-orange-200 text-orange-900",
  confused: "bg-gray-200 text-gray-900",
  grateful: "bg-rose-200 text-rose-900",
  motivated: "bg-lime-200 text-lime-900",
}

const moodHexColors: Record<string, string> = {
  happy: "#facc15",
  sad: "#60a5fa",
  angry: "#f87171",
  calm: "#34d399",
  loved: "#f472b6",
  tired: "#a78bfa",
  anxious: "#c084fc",
  excited: "#fb923c",
  confused: "#94a3b8",
  grateful: "#f9a8d4",
  motivated: "#bef264",
}

export default function Home() {
  const { name } = useUser()
  const [logs, setLogs] = useState<MoodLog[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState("all")
  const [onlyMine, setOnlyMine] = useState(false)
  const [search, setSearch] = useState("")

  useEffect(() => {
    const q = query(collection(db, "mood_logs"), orderBy("createdAt", "desc"))

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map((doc) => {
        const data = doc.data()
        return {
          _id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate?.() ?? new Date(),
        }
      }) as MoodLog[]

      setLogs(docs)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const filteredLogs = logs.filter((log) => {
    const matchesMood = activeFilter === "all" || log.emotion === activeFilter
    const matchesUser = !onlyMine || log.author === name
    const matchesSearch =
      !search || log.note?.toLowerCase().includes(search.toLowerCase())
    return matchesMood && matchesUser && matchesSearch
  })

  const moodCounts = filteredLogs.reduce<Record<string, number>>((acc, log) => {
    acc[log.emotion] = (acc[log.emotion] || 0) + 1
    return acc
  }, {})

  const moodChartData = Object.entries(moodCounts).map(([mood, count]) => ({
    name: mood,
    value: count,
  }))

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-100 to-amber-100 px-4 pt-4 font-outfit text-gray-800">
      <h1 className="text-3xl font-semibold mb-6 text-center">Mood Timeline</h1>

      {/* Mood Filter */}
      <div className="flex flex-wrap gap-2 justify-center mb-4">
        {["all", ...Object.keys(moodColors)].map((mood) => (
          <button
            key={mood}
            onClick={() => setActiveFilter(mood)}
            className={`px-3 py-1 rounded-full border text-sm transition-all ${
              activeFilter === mood
                ? "bg-pink-200 border-pink-400 text-pink-800"
                : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
            }`}
          >
            {mood}
          </button>
        ))}
      </div>

      {/* Show Only Mine Toggle */}
      <div className="flex justify-center mb-4">
        <button
          onClick={() => setOnlyMine(!onlyMine)}
          className={`text-sm px-4 py-2 rounded-full border transition-all ${
            onlyMine
              ? "bg-rose-200 border-rose-300 text-rose-900"
              : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
          }`}
        >
          {onlyMine ? "Showing my moods only" : "Show only my moods"}
        </button>
      </div>

      {/* Search Input */}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search notes..."
          className="w-full max-w-xs px-4 py-2 text-sm rounded-full bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-300"
        />
      </div>

      {/* Mood Pie Chart */}
      {moodChartData.length > 0 && (
        <div className="w-full max-w-sm mx-auto mb-6">
          <h2 className="text-center text-sm font-medium text-gray-600 mb-2">
            Mood Frequency
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={moodChartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={65}
                innerRadius={30}
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} (${Math.round((percent || 0) * 100)}%)`
                }
              >
                {moodChartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={moodHexColors[entry.name.toLowerCase()] || "#ddd"}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Mood Cards */}
      {loading ? (
        <p className="text-center text-gray-500">Loading moods...</p>
      ) : filteredLogs.length === 0 ? (
        <p className="text-center text-gray-400">No moods found 🌸</p>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredLogs.map((log) => (
            <motion.div
              key={log._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="rounded-2xl shadow-md p-4 bg-white/80 backdrop-blur-lg border border-white/60 flex flex-col"
            >
              {/* Top: Mood + Date */}
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    moodColors[log.emotion.toLowerCase()] ||
                    "bg-gray-200 text-gray-700"
                  }`}
                >
                  {log.emotion}
                </span>
                <span className="text-xs text-gray-500">
                  {log.date &&
                    log.date.toDate().toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                </span>
              </div>

              {/* Song */}
              {log.song && (
                <p className="text-sm text-pink-600 mb-1">
                  🎵 <span className="font-medium">{log.song}</span>
                </p>
              )}

              {/* Note + Author */}
              {log.note && (
                <div className="flex justify-between items-end gap-4">
                  <p className="text-sm text-gray-800">{log.note}</p>
                  {log.author && (
                    <p className="text-xs text-gray-400 italic whitespace-nowrap">
                      Logged by {log.author}
                    </p>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </main>
  )
}
