import EraAIChat from "./components/EraAIChat";
import "./App.css";

export default function App() {
  return (
    <div className="min-h-screen w-full bg-white dark:bg-[#0f0f0f] transition-colors duration-300">
      {/* Center Chat on Large Screens */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
        <EraAIChat />
      </div>
    </div>
  );
}
