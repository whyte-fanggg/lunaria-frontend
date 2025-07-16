import { useNavigate } from "react-router-dom"
import { useUser } from "../context/UserContext"
import { useState } from "react"
import Footer from "../components/Footer"

export default function Auth() {
  const { setName } = useUser()
  const [input, setInput] = useState("")
  const navigate = useNavigate()

  const handleSubmit = () => {
    if (!input.trim()) return
    setName(input.trim())
    navigate("/mood")
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 font-outfit">
        Welcome to Lunaria 🌸
      </h1>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter your first name"
        className="px-4 py-3 rounded-xl border w-full max-w-sm text-center text-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
      />
      <button
        onClick={handleSubmit}
        className="mt-4 bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-xl text-sm"
      >
        Continue
      </button>
      <Footer />
    </div>
  )
}
