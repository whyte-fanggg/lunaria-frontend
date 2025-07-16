// src/components/Header.tsx
import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { useUser } from "../context/UserContext"
import { motion } from "framer-motion"
import logo from "../assets/logo.png"

export default function Header() {
  const [showInfo, setShowInfo] = useState(false)
  const { name, setName } = useUser()
  const navigate = useNavigate()

  const handleLogout = () => {
    setName("") // clear user
    localStorage.removeItem("lunaria_name")
    navigate("/")
  }

  return (
    <header className="w-full bg-white/70 backdrop-blur-md px-6 py-2 shadow-sm flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Link to="/">
          <img src={logo} alt="Lunaria Logo" className="h-10" />
        </Link>
      </div>

      <button
        onClick={() => setShowInfo(true)}
        className="text-xs px-3 py-1 rounded-full bg-pink-100 text-pink-800 hover:bg-pink-200 transition-all border border-pink-300 shadow-sm"
      >
        What is Lunaria?
      </button>

      <nav className="space-x-4 flex items-center">
        <Link
          to="/mood"
          className="text-sm px-4 py-2 rounded-full bg-pink-200 text-pink-900 font-medium hover:bg-pink-300 transition-all"
        >
          Add Mood
        </Link>
        <Link
          to="/home"
          className="text-sm px-4 py-2 rounded-full bg-indigo-200 text-indigo-900 font-medium hover:bg-indigo-300 transition-all"
        >
          Mood Timeline
        </Link>
        {name && (
          <button
            onClick={handleLogout}
            className="text-sm px-4 py-2 rounded-full bg-red-100 text-red-700 font-medium hover:bg-red-200 transition-all"
          >
            Log out
          </button>
        )}
      </nav>
      {showInfo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setShowInfo(false)}
        >
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 30, opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl border border-gray-200 text-gray-700"
          >
            <h2 className="text-lg font-semibold text-pink-700 mb-6">
              🌸 Welcome to Lunaria
            </h2>
            <p className="text-sm leading-relaxed">
              Lunaria is your soft emotional space — a pastel-themed mood and
              music journal to capture how you feel every day.
            </p>
            <button
              onClick={() => setShowInfo(false)}
              className="mt-4 px-4 py-1 text-sm rounded-full bg-pink-100 text-pink-800 hover:bg-pink-200 transition-all border border-pink-300"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </header>
  )
}
