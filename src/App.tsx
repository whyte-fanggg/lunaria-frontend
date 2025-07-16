import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import Header from "./components/Header";
import MoodEntry from "./pages/MoodEntry";
import Home from "./pages/Home";
import Auth from "./pages/Auth";

function App() {
  return (
    <Router>
      <UserProvider>
        <Header />
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/mood" element={<MoodEntry />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </UserProvider>
    </Router>
  );
}

export default App;
