import { useState } from "react";
import axios from "axios";
import { FiSend } from "react-icons/fi";
import { BsFillMicFill } from "react-icons/bs";

const FloatingVoiceBot = ({ doctorId, appointmentId }) => {
  const [open, setOpen] = useState(false);
  const [symptomText, setSymptomText] = useState("");
  const [messages, setMessages] = useState([]);
  const [listening, setListening] = useState(false);
  const [loading, setLoading] = useState(false);

  // Toggle chat interface
  const toggleOpen = () => setOpen(!open);

  // Voice input
  const handleStartVoice = () => {
    // Check for browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US"; // English US
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setSymptomText(text);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setListening(false);
      if (event.error === "not-allowed") {
        alert("Microphone access denied. Please allow microphone access and try again.");
      } else {
        alert(`Speech recognition error: ${event.error}`);
      }
    };

    recognition.onend = () => {
      setListening(false);
    };

    try {
      recognition.start();
    } catch (error) {
      console.error("Failed to start speech recognition:", error);
      alert("Failed to start voice recognition. Please check microphone permissions.");
    }
  };

  // Send / analyze
  const handleSend = async () => {
    if (!symptomText.trim()) return;

    setMessages([...messages, { sender: "user", text: symptomText }]);
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:4000/api/voice", {
        doctorId,
        appointmentId,
        symptomText,
      });

      const diagnosis = res.data.diagnosis || "No diagnosis returned";
      setMessages((prev) => [...prev, { sender: "bot", text: diagnosis }]);
    } catch (err) {
      console.error("Analyze Error:", err.response?.data || err.message);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Error analyzing symptom." },
      ]);
    }

    setSymptomText("");
    setLoading(false);
  };

  return (
    <div>
      {/* Floating Button */}
      <button
        onClick={toggleOpen}
        className="fixed bottom-5 right-5 bg-blue-500 text-white p-4 rounded-full border-white shadow-lg z-50 hover:bg-blue-600 transition-all"
      >
        {open ? "×" : "Chat"}
      </button>

      {/* Chat Interface */}
      {open && (
        <div className="fixed bottom-20 right-5 w-80 max-h-[500px] flex flex-col border border-white rounded shadow-lg bg-white z-50">
          <div className="bg-blue-500 text-white p-2 font-semibold rounded-t">
            AI Symptom Bot
          </div>

          <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-2">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-2 rounded ${
                  msg.sender === "user"
                    ? "bg-blue-100 self-end"
                    : "bg-gray-200 self-start"
                }`}
              >
                {msg.text}
              </div>
            ))}
            {loading && (
              <div className="text-gray-500 text-sm">Analyzing...</div>
            )}
          </div>

          {/* Input Area */}
          <div className="flex gap-2 p-2 border-t">
            <button
              onClick={handleStartVoice}
              className={`p-2 rounded ${listening ? 'bg-red-500 animate-pulse' : 'bg-blue-500'} text-white`}
              disabled={listening}
            >
              <BsFillMicFill />
            </button>
            <input
              type="text"
              value={symptomText}
              onChange={(e) => setSymptomText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type your symptom..."
              className="flex-1 border rounded px-2 py-1 border-white"
            />
            <button
              onClick={handleSend}
              className="bg-green-500 text-white p-2 rounded"
            >
              <FiSend />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FloatingVoiceBot;
