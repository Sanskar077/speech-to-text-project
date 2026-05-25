import { useState, useRef } from "react";
import "./App.css";

const MicIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z"/>
    <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
    <line x1="12" y1="19" x2="12" y2="22"/>
    <line x1="8" y1="22" x2="16" y2="22"/>
  </svg>
);

const UploadIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 16 12 12 8 16"/>
    <line x1="12" y1="12" x2="12" y2="21"/>
    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
  </svg>
);

const StopIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <rect x="3" y="3" width="18" height="18" rx="2"/>
  </svg>
);

const WaveformIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="2" y1="16" x2="2" y2="16"/>
    <line x1="6" y1="10" x2="6" y2="22"/>
    <line x1="10" y1="6" x2="10" y2="26"/>
    <line x1="14" y1="12" x2="14" y2="20"/>
    <line x1="18" y1="4" x2="18" y2="28"/>
    <line x1="22" y1="8" x2="22" y2="24"/>
    <line x1="26" y1="12" x2="26" y2="20"/>
    <line x1="30" y1="16" x2="30" y2="16"/>
  </svg>
);

const CopyIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
  </svg>
);

function App() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioURL, setAudioURL] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [transcription, setTranscription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const fileInputRef = useRef(null);
  const timerRef = useRef(null);

  const startRecording = async () => {
    try {
      setError("");
      setAudioBlob(null);
      setAudioURL(null);
      setSelectedFile(null);
      setTranscription("");
      setRecordingTime(0);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        setAudioURL(URL.createObjectURL(blob));
        stream.getTracks().forEach((t) => t.stop());
        clearInterval(timerRef.current);
      };

      mediaRecorder.start();
      setIsRecording(true);

      timerRef.current = setInterval(() => {
        setRecordingTime((t) => t + 1);
      }, 1000);
    } catch (err) {
      setError("Microphone access denied. Please allow microphone permissions.");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const allowed = ["audio/mp3", "audio/mpeg", "audio/wav", "audio/webm", "audio/ogg", "audio/flac", "audio/m4a", "audio/mp4"];
    if (!allowed.includes(file.type) && !file.name.match(/\.(mp3|wav|webm|ogg|flac|m4a)$/i)) {
      setError("Invalid file type. Please upload an audio file (MP3, WAV, WEBM, OGG, FLAC, M4A).");
      return;
    }
    setSelectedFile(file);
    setAudioBlob(null);
    setAudioURL(null);
    setTranscription("");
    setError("");
  };

  const handleTranscribe = async () => {
    const source = audioBlob || selectedFile;
    if (!source) {
      setError("Please record audio or upload a file first.");
      return;
    }

    setLoading(true);
    setError("");
    setTranscription("");

    try {
      const formData = new FormData();
      formData.append("audio", source, selectedFile?.name || "recording.webm");

      const res = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Transcription failed");

      setTranscription(data.text || "No speech detected.");
    } catch (err) {
      setError(err.message || "Something went wrong. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(transcription);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const hasSource = audioBlob || selectedFile;

  return (
    <div className="app-shell">
      {/* Header */}
      <header className="app-header">
        <div className="logo-mark">
          <WaveformIcon />
        </div>
        <div>
          <h1 className="app-title">VoiceScript</h1>
          <p className="app-subtitle">Speech to Text Transcription</p>
        </div>
      </header>

      <main className="app-main">
        {/* Record Section */}
        <section className="card">
          <h2 className="card-title">
            <span className="card-num">01</span> Record Audio
          </h2>
          <p className="card-desc">Use your microphone to record audio for transcription.</p>

          <div className="record-area">
            {isRecording && (
              <div className="recording-indicator">
                <span className="pulse-dot" />
                <span className="recording-time">{formatTime(recordingTime)}</span>
                <span className="recording-label">Recording…</span>
              </div>
            )}

            <button
              className={`record-btn ${isRecording ? "record-btn--stop" : "record-btn--start"}`}
              onClick={isRecording ? stopRecording : startRecording}
            >
              {isRecording ? <StopIcon /> : <MicIcon />}
              {isRecording ? "Stop Recording" : "Start Recording"}
            </button>
          </div>

          {audioURL && (
            <div className="audio-preview">
              <p className="preview-label">Preview your recording</p>
              <audio controls src={audioURL} className="audio-player" />
            </div>
          )}
        </section>

        {/* Divider */}
        <div className="divider">
          <span>or</span>
        </div>

        {/* Upload Section */}
        <section className="card">
          <h2 className="card-title">
            <span className="card-num">02</span> Upload Audio File
          </h2>
          <p className="card-desc">Supports MP3, WAV, WEBM, OGG, FLAC, M4A formats.</p>

          <div
            className={`upload-zone ${selectedFile ? "upload-zone--active" : ""}`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const file = e.dataTransfer.files[0];
              if (file) handleFileChange({ target: { files: [file] } });
            }}
          >
            <UploadIcon />
            {selectedFile ? (
              <div className="file-info">
                <span className="file-name">{selectedFile.name}</span>
                <span className="file-size">{(selectedFile.size / 1024).toFixed(1)} KB</span>
              </div>
            ) : (
              <div className="upload-hint">
                <span className="upload-main">Click to upload or drag & drop</span>
                <span className="upload-sub">Audio files only</span>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            onChange={handleFileChange}
            className="hidden-input"
          />
        </section>

        {/* Error */}
        {error && (
          <div className="error-banner">
            <span>⚠</span> {error}
          </div>
        )}

        {/* Transcribe Button */}
        <button
          className={`transcribe-btn ${!hasSource || loading ? "transcribe-btn--disabled" : ""}`}
          onClick={handleTranscribe}
          disabled={!hasSource || loading}
        >
          {loading ? (
            <>
              <span className="spinner" />
              Transcribing…
            </>
          ) : (
            <>
              <WaveformIcon />
              Transcribe Audio
            </>
          )}
        </button>

        {/* Transcription Output */}
        {transcription && (
          <section className="card result-card">
            <div className="result-header">
              <h2 className="card-title" style={{ margin: 0 }}>
                <span className="card-num">03</span> Transcription Result
              </h2>
              <button className="copy-btn" onClick={handleCopy}>
                <CopyIcon />
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <div className="result-text">{transcription}</div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
