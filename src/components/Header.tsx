// src/components/Header.tsx
import { Link, useNavigate } from "react-router-dom"
import { useUser } from "../context/UserContext"

export default function Header() {
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
        <img
          src="/src/assets/logo-transparent.png"
          alt="Lunaria Logo"
          className="h-12 w-40 object-contain"
        />
        
      </div>

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
    </header>
  )
}
