import { Mic, Stop } from "@mui/icons-material";
import { useState } from "react";

function Hardware() {
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState("");

  let recognition;

  const startRecording = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser.");
      return;
    }

    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let text = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        text += event.results[i][0].transcript;
      }
      setTranscript(text);
    };

    recognition.start();
    setRecording(true);
  };

  const stopRecording = () => {
    recognition?.stop();
    setRecording(false);
  };

  return (
    <div
      style={{
        padding: "1rem",
        fontFamily: "Arial",
        height: "100vh",
        width: "100vw",
      }}
    >
      <h2>Speech to Text</h2>
      <button
        onClick={recording ? stopRecording : startRecording}
        style={{
          border: "none",
          background: recording ? "red" : "#ddd",
          borderRadius: "50%",
          padding: "0.5rem",
          cursor: "pointer",
        }}
      >
        {recording ? <Stop /> : <Mic />}
      </button>

      <div
        style={{ marginTop: "1rem", padding: "1rem", border: "1px solid #ccc" }}
      >
        <strong>Transcript:</strong>
        <p>{transcript || "Speak something..."}</p>
      </div>
    </div>
  );
}

export default Hardware;
