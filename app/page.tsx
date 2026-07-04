"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Mic, 
  Disc, 
  Layers, 
  Music, 
  Sparkles, 
  Play, 
  Pause, 
  Square, 
  Radio, 
  Volume2, 
  CheckCircle2, 
  RefreshCw, 
  Sliders, 
  Download,
  Flame,
  Zap,
  HelpCircle,
  Menu,
  X,
  User,
  LogOut,
  ChevronRight,
  TrendingUp,
  Headphones,
  SlidersHorizontal,
  FolderHeart
} from "lucide-react";

// --- Types ---
interface Service {
  id: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
}

interface Track {
  id: string;
  title: string;
  type: string;
  date: string;
  duration: string;
  status: "Ready" | "Processing" | "Failed";
}

export default function MezieApp() {
  // --- State Management ---
  const [selectedService, setSelectedService] = useState<string>("beat");
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingTime, setRecordingTime] = useState<number>(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [prompt, setPrompt] = useState<string>("");
  const [genre, setGenre] = useState<string>("Afrobeats");
  const [vibe, setVibe] = useState<string>("Energetic");
  const [lyrics, setLyrics] = useState<string>("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"create" | "library" | "explore">("create");

  // --- Mock Data ---
  const [myTracks, setMyTracks] = useState<Track[]>([
    { id: "1", title: "Summer Vibes Vocal Mix", type: "Full Production", date: "2 hours ago", duration: "2:45", status: "Ready" },
    { id: "2", title: "Late Night Late Text Beat", type: "Beat Only", date: "Yesterday", duration: "3:12", status: "Ready" },
    { id: "3", title: "Acoustic Polish Project", type: "Voice Polish", date: "3 days ago", duration: "1:58", status: "Processing" },
  ]);

  const services: Service[] = [
    { id: "beat", icon: <Music className="w-5 h-5" />, title: "Beat Only", desc: "Full AI-generated beat in your chosen genre" },
    { id: "voice", icon: <Mic className="w-5 h-5" />, title: "Voice Polish", desc: "Raw voice → studio-ready, perfectly tuned vocals" },
    { id: "mix", icon: <Sliders className="w-5 h-5" />, title: "Mix & Master", desc: "Balance, high-end EQ, loudness, and professional clarity" },
    { id: "full", icon: <Disc className="w-5 h-5" />, title: "Full Production", desc: "Everything – professional voice, beat mix, and master" },
  ];

  // --- Refs & Timers ---
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setRecordingTime(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  // --- Actions ---
  const handleRecordToggle = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setAudioUrl(null);
    } else {
      setAudioUrl("mock-audiourl-string");
    }
  };

  const handleGenerate = async () => {
    if (!prompt || !prompt.trim()) return;
    
    setIsProcessing(true);
    
    try {
      // 1. Ping your secure Next.js backend folder with the prompt details
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt,
          genre: selectedService ? services.find(s => s.id === selectedService)?.title : "Gospel Master",
        }),
      });

      const data = await response.json();

      if (data.success && data.audioUrl) {
        // 2. Build a real track structure linking directly to the Replicate cloud audio stream
        const newTrack = {
          id: String(myTracks.length + 1),
          title: prompt.length > 20 ? `${prompt.substring(0, 20)}... Studio` : `${prompt} Studio`,
          type: services.find(s => s.id === selectedService)?.title || "Full Mix",
          date: "Just now",
          duration: "0:15",
          status: "Ready" as const,
          audioUrl: data.audioUrl // Streams the real audio file through your UI players
        };

        // 3. Update the tracking library list array and clear out the box
        setMyTracks([newTrack, ...myTracks]);
        setPrompt("");
        setActiveTab("library"); // Flip over to the list tab so you can see your track card!
      } else {
        alert(`AI Audio Engine Note: ${data.error || "The processing pipeline returned an unexpected status."}`);
      }
    } catch (error) {
      console.error("Network communication failure connecting to local route:", error);
      alert("Could not communicate with your Next.js local backend route.");
    } finally {
      setIsProcessing(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div style={{ minHeight: "100vh", background: "#080808", color: "#fff", fontFamily: "'Segoe UI', sans-serif", position: "relative", overflow: "hidden" }}>
      <style>{`
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideDown { from{opacity:0;transform:translateY(-16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 3px } ::-webkit-scrollbar-thumb { background: #222; border-radius: 2px }
        input { background: #0d0d0d!important; color:#fff!important; border:1px solid #222!important; }
        input:focus { border-color: #FFB800!important; }
      `}</style>

      {/* Atmosphere blobs */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", top: "-15%", left: "-10%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,184,0,0.07) 0%, rgba(0,0,0,0) 70%)" }} />
        <div style={{ position: "absolute", bottom: "-10%", right: "-5%", width: 350, height: 350, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,50,120,0.04) 0%, rgba(0,0,0,0) 70%)" }} />
      </div>

      {/* HEADER */}
      <header style={{ position: "sticky", top: 0, background: "rgba(8,8,8,0.85)", backdropFilter: "blur(12px)", borderBottom: "1px solid #161616", zIndex: 50, padding: "0 1.5rem" }}>
        <div style={{ maxWidth: 1300, margin: "0 auto", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div style={{ background: "linear-gradient(135deg, #FFB800, #FF3378)", width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Radio className="w-5 h-5 text-black stroke-[2.5]" />
            </div>
            <span style={{ fontSize: "1.25rem", fontWeight: 800, letterSpacing: "-0.03em", background: "linear-gradient(to right, #fff, #aaa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              MEZIE
            </span>
            <span style={{ fontSize: "0.65rem", background: "#1a1a1a", color: "#FFB800", padding: "1px 5px", borderRadius: 4, fontWeight: 600, border: "1px solid rgba(255,184,0,0.2)" }}>PRO</span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex" style={{ alignItems: "center", gap: "0.25rem" }}>
            <button onClick={() => setActiveTab("create")} style={{ padding: "0.5rem 1rem", borderRadius: 6, fontSize: "0.9rem", fontWeight: 500, background: activeTab === "create" ? "#141414" : "transparent", color: activeTab === "create" ? "#FFB800" : "#888", border: 0, cursor: "pointer", transition: "0.2s" }}>Create</button>
            <button onClick={() => setActiveTab("library")} style={{ padding: "0.5rem 1rem", borderRadius: 6, fontSize: "0.9rem", fontWeight: 500, background: activeTab === "library" ? "#141414" : "transparent", color: activeTab === "library" ? "#FFB800" : "#888", border: 0, cursor: "pointer", transition: "0.2s" }}>Studio Library</button>
            <button onClick={() => setActiveTab("explore")} style={{ padding: "0.5rem 1rem", borderRadius: 6, fontSize: "0.9rem", fontWeight: 500, background: activeTab === "explore" ? "#141414" : "transparent", color: activeTab === "explore" ? "#FFB800" : "#888", border: 0, cursor: "pointer", transition: "0.2s" }}>Explore Beats</button>
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div className="hidden sm:flex" style={{ alignItems: "center", gap: "0.5rem", background: "#111", padding: "0.35rem 0.75rem", borderRadius: 20, border: "1px solid #1c1c1c" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80" }} />
              <span style={{ fontSize: "0.75rem", color: "#aaa", fontWeight: 500 }}>AI Engine Active</span>
            </div>
            <button style={{ background: "#fff", color: "#000", border: 0, padding: "0.5rem 1rem", borderRadius: 8, fontSize: "0.85rem", fontWeight: 600, cursor: "pointer" }}>Upgrade</button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden" style={{ background: "transparent", border: 0, color: "#fff", cursor: "pointer" }}>
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{ position: "fixed", top: 64, left: 0, right: 0, background: "#0c0c0c", borderBottom: "1px solid #1a1a1a", zIndex: 40, padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem", animation: "slideDown 0.25s ease-out" }}>
          <button onClick={() => { setActiveTab("create"); setMobileMenuOpen(false); }} style={{ textAlign: "left", padding: "0.5rem 0", background: "none", border: 0, color: activeTab === "create" ? "#FFB800" : "#fff", fontSize: "1.1rem", fontWeight: 500 }}>Create Studio</button>
          <button onClick={() => { setActiveTab("library"); setMobileMenuOpen(false); }} style={{ textAlign: "left", padding: "0.5rem 0", background: "none", border: 0, color: activeTab === "library" ? "#FFB800" : "#fff", fontSize: "1.1rem", fontWeight: 500 }}>My Studio Library</button>
          <button onClick={() => { setActiveTab("explore"); setMobileMenuOpen(false); }} style={{ textAlign: "left", padding: "0.5rem 0", background: "none", border: 0, color: activeTab === "explore" ? "#FFB800" : "#fff", fontSize: "1.1rem", fontWeight: 500 }}>Explore Instrumentals</button>
        </div>
      )}

      {/* MAIN CONTAINER */}
      <main style={{ maxWidth: 1300, margin: "0 auto", padding: "2rem 1.5rem", position: "relative", zIndex: 10 }}>
        
        {/* TAB 1: CREATE ENGINE */}
        {activeTab === "create" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Control Panel Block */}
            <div className="lg:col-span-2" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              
              {/* Top Banner */}
              <div style={{ background: "linear-gradient(135deg, #111 0%, #0a0a0a 100%)", border: "1px solid #1a1a1a", borderRadius: 16, padding: "1.5rem", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
                <div>
                  <h1 style={{ fontSize: "1.5rem", fontWeight: 700, margin: "0 0 0.25rem 0", letterSpacing: "-0.02em" }}>Instant AI Music Producer</h1>
                  <p style={{ margin: 0, color: "#777", fontSize: "0.85rem" }}>Record vocals, generate tracking stems, layout high-fidelity masters instantly.</p>
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <span style={{ background: "#1a0f00", border: "1px solid rgba(255,184,0,0.15)", color: "#FFB800", fontSize: "0.75rem", padding: "0.35rem 0.65rem", borderRadius: 6, fontWeight: 500 }}>NextJS 14 Engine</span>
                  <span style={{ background: "#001205", border: "1px solid rgba(74,222,128,0.15)", color: "#4ade80", fontSize: "0.75rem", padding: "0.35rem 0.65rem", borderRadius: 6, fontWeight: 500 }}>Ultra Low Latency</span>
                </div>
              </div>

              {/* Step 1: Services Cards */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "#666", textTransform: "uppercase", letterSpacing: "0.05em" }}>1. Choose Production Suite Mode</label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.75rem" }}>
                  {services.map((s) => {
                    const isSelected = selectedService === s.id;
                    return (
                      <div 
                        key={s.id}
                        onClick={() => setSelectedService(s.id)}
                        style={{
                          background: isSelected ? "linear-gradient(180deg, #161208 0%, #0f0c05 100%)" : "#0d0d0d",
                          border: isSelected ? "1px solid #FFB800" : "1px solid #161616",
                          padding: "1rem",
                          borderRadius: 12,
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          boxShadow: isSelected ? "0 4px 20px rgba(255,184,0,0.05)" : "none"
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                          <div style={{ color: isSelected ? "#FFB800" : "#888", background: isSelected ? "rgba(255,184,0,0.1)" : "#141414", padding: "0.4rem", borderRadius: 8 }}>
                            {s.icon}
                          </div>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-[#FFB800]" />}
                        </div>
                        <h3 style={{ margin: "0 0 0.25rem 0", fontSize: "0.95rem", fontWeight: 600, color: isSelected ? "#fff" : "#eee" }}>{s.title}</h3>
                        <p style={{ margin: 0, fontSize: "0.75rem", color: isSelected ? "#aaa" : "#555", lineHeight: 1.4 }}>{s.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Audio Capture / Prompt Area */}
              <div style={{ background: "#0d0d0d", border: "1px solid #161616", borderRadius: 16, padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                
                {/* Voice Input Section conditional */}
                {(selectedService === "voice" || selectedService === "mix" || selectedService === "full") && (
                  <div style={{ background: "#111", border: "1px solid #1c1c1c", borderRadius: 12, padding: "1rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                      <div>
                        <h4 style={{ margin: "0 0 0.15rem 0", fontSize: "0.9rem", fontWeight: 600 }}>Capture Studio Vocal Tracking</h4>
                        <p style={{ margin: 0, fontSize: "0.75rem", color: "#666" }}>Record straight from your device microphone or upload raw sample stems</p>
                      </div>
                      {isRecording && (
                        <div style={{ background: "rgba(239,68,68,0.1)", padding: "0.25rem 0.5rem", borderRadius: 6, display: "flex", alignItems: "center", gap: "0.35rem" }}>
                          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#ef4444", display: "inline-block" }} />
                          <span style={{ fontSize: "0.75rem", color: "#ef4444", fontWeight: 600 }}>{formatTime(recordingTime)}</span>
                        </div>
                      )}
                    </div>

                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", alignItems: "center" }}>
                      <button 
                        onClick={handleRecordToggle}
                        style={{
                          background: isRecording ? "#ef4444" : "rgba(255,255,255,0.04)",
                          color: "#fff",
                          border: isRecording ? "1px solid #ef4444" : "1px solid #222",
                          padding: "0.6rem 1.2rem",
                          borderRadius: 8,
                          fontSize: "0.85rem",
                          fontWeight: 500,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          transition: "0.2s"
                        }}
                      >
                        {isRecording ? <Square className="w-4 h-4 fill-white" /> : <Mic className="w-4 h-4 text-[#FFB800]" />}
                        {isRecording ? "Stop Tracking" : "Record Live Vocals"}
                      </button>

                      <input type="file" ref={fileInputRef} style={{ display: "none" }} accept="audio/*" />
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        style={{ background: "transparent", border: "1px solid #222", padding: "0.6rem 1.2rem", borderRadius: 8, fontSize: "0.85rem", color: "#aaa", cursor: "pointer" }}
                      >
                        Upload Audio File (.wav, .mp3)
                      </button>

                      {audioUrl && !isRecording && (
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginLeft: "auto", background: "#161616", padding: "0.4rem 0.75rem", borderRadius: 8, border: "1px solid #222" }}>
                          <span style={{ fontSize: "0.75rem", color: "#4ade80", fontWeight: 500 }}>Vocal File Loaded</span>
                          <button onClick={() => setAudioUrl(null)} style={{ background: "none", border: 0, color: "#ff4444", cursor: "pointer", fontSize: "0.75rem" }}>Clear</button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* AI Text Prompt Structure */}
                {(selectedService === "beat" || selectedService === "full") && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "#666" }}>PROMPT AI COMPOSER</label>
                    <input 
                      type="text"
                      placeholder="Describe the sound design (e.g., 'An upbeat modern Afrobeats track with heavy ambient synth lines and soft percussion brass')"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      style={{ width: "100%", padding: "0.85rem 1rem", borderRadius: 10, fontSize: "0.9rem", outline: "none" }}
                    />
                  </div>
                )}

                {/* Optional Lyrics Panel for Full Productions */}
                {selectedService === "full" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "#666" }}>VOCAL TEXT / LYRICS CONTENT (OPTIONAL)</label>
                      <span style={{ fontSize: "0.7rem", color: "#555" }}>AI will read/sing this context text</span>
                    </div>
                    <textarea 
                      placeholder="Paste your lyrics here or leave completely blank for automated artificial vocalization melodies..."
                      value={lyrics}
                      onChange={(e) => setLyrics(e.target.value)}
                      style={{ width: "100%", height: 80, background: "#0d0d0d", color: "#fff", border: "1px solid #222", padding: "0.75rem", borderRadius: 10, fontSize: "0.85rem", outline: "none", resize: "none" }}
                    />
                  </div>
                )}

                {/* Advanced Configuration Accordion Row */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", borderTop: "1px solid #161616", paddingTop: "1.25rem" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                    <label style={{ fontSize: "0.75rem", color: "#555", fontWeight: 600 }}>GENRE TARGET</label>
                    <select value={genre} onChange={(e) => setGenre(e.target.value)} style={{ background: "#0d0d0d", color: "#fff", border: "1px solid #222", padding: "0.5rem", borderRadius: 8, fontSize: "0.85rem", outline: "none" }}>
                      <option>Afrobeats</option>
                      <option>Amapiano</option>
                      <option>Hip Hop / Trap</option>
                      <option>R&B / Soul</option>
                      <option>Gospel / Worship</option>
                      <option>Reggae / Dancehall</option>
                    </select>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                    <label style={{ fontSize: "0.75rem", color: "#555", fontWeight: 600 }}>SOUND ATMOSPHERE VIBE</label>
                    <select value={vibe} onChange={(e) => setVibe(e.target.value)} style={{ background: "#0d0d0d", color: "#fff", border: "1px solid #222", padding: "0.5rem", borderRadius: 8, fontSize: "0.85rem", outline: "none" }}>
                      <option>Energetic / Club</option>
                      <option>Dark & Moody</option>
                      <option>Chill / Melodic</option>
                      <option>Bright / Uplifting</option>
                      <option>Cinematic / Deep</option>
                    </select>
                  </div>
                </div>

                {/* Primary Action Button */}
                <button 
                  onClick={handleGenerate}
                  disabled={isProcessing || (selectedService === "beat" && !prompt)}
                  style={{
                    background: "linear-gradient(90deg, #FFB800, #FF7A00)",
                    color: "#000",
                    border: 0,
                    padding: "0.9rem",
                    borderRadius: 10,
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    cursor: (isProcessing || (selectedService === "beat" && !prompt)) ? "not-allowed" : "pointer",
                    opacity: (isProcessing || (selectedService === "beat" && !prompt)) ? 0.5 : 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    boxShadow: "0 4px 25px rgba(255,184,0,0.15)",
                    transition: "0.2s",
                    marginTop: "0.5rem"
                  }}
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Rendering High Fidelity Masters... (Takes ~4s)
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 fill-black" />
                      Compile & Mix Master Audio Track
                    </>
                  )}
                </button>
              </div>

            </div>

            {/* Sidebar Metadata Dashboard Info */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              
              {/* Profile Card Summary */}
              <div style={{ background: "#0d0d0d", border: "1px solid #161616", borderRadius: 16, padding: "1.25rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                  <div style={{ background: "#1a1a1a", width: 44, height: 44, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #222" }}>
                    <User className="w-5 h-5 text-gray-400" />
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: "0.9rem", fontWeight: 600 }}>Mezie Studio Account</h4>
                    <p style={{ margin: 0, fontSize: "0.75rem", color: "#555" }}>Free Sandbox Tier Level</p>
                  </div>
                </div>
                <div style={{ background: "#141414", borderRadius: 10, padding: "0.75rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", textAlign: "center" }}>
                  <div>
                    <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#FFB800" }}>14</div>
                    <div style={{ fontSize: "0.65rem", color: "#666", textTransform: "uppercase" }}>Credits Remaining</div>
                  </div>
                  <div style={{ borderLeft: "1px solid #222" }}>
                    <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#fff" }}>{myTracks.length}</div>
                    <div style={{ fontSize: "0.65rem", color: "#666", textTransform: "uppercase" }}>Saved Tracks</div>
                  </div>
                </div>
              </div>

              {/* Hot Tips Panel */}
              <div style={{ background: "linear-gradient(180deg, #0d0d0d 0%, #060606 100%)", border: "1px solid #161616", borderRadius: 16, padding: "1.25rem" }}>
                <h4 style={{ margin: "0 0 0.75rem 0", fontSize: "0.85rem", fontWeight: 600, color: "#aaa", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                  <Zap className="w-4 h-4 text-[#FFB800]" />
                  Engine Mastering Shortcuts
                </h4>
                <ul style={{ margin: 0, paddingLeft: "1.1rem", fontSize: "0.8rem", color: "#666", display: "flex", flexDirection: "column", gap: "0.6rem", lineHeight: 1.4 }}>
                  <li>For standard beats, use <strong style={{ color: "#aaa" }}>Beat Only</strong> with sensory keywords like "smooth chill guitar strings".</li>
                  <li>When processing vocals, verify your hardware microphone gain structure is below <strong style={{ color: "#aaa" }}>-3dB</strong> to bypass ambient room clipping noise distortion layers.</li>
                  <li>Toggle between active project tracks instantly within your saved layout catalog drawer below.</li>
                </ul>
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: LIBRARY VIEW */}
        {activeTab === "library" && (
          <div style={{ background: "#0d0d0d", border: "1px solid #161616", borderRadius: 16, padding: "1.5rem", animation: "fadeIn 0.3s ease-in-out" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <div>
                <h2 style={{ fontSize: "1.25rem", fontWeight: 700, margin: "0 0 0.25rem 0" }}>Your Studio Library Catalog</h2>
                <p style={{ margin: 0, color: "#555", fontSize: "0.8rem" }}>Manage and download generated audio clips, individual vocal stem outputs, and full project tracks.</p>
              </div>
              <button onClick={() => setActiveTab("create")} style={{ background: "transparent", border: "1px solid #222", padding: "0.5rem 1rem", borderRadius: 8, fontSize: "0.8rem", color: "#fff", cursor: "pointer" }}>
                + Render New Track
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {myTracks.map((track) => (
                <div key={track.id} style={{ background: "#111", border: "1px solid #1a1a1a", padding: "1rem 1.25rem", borderRadius: 12, display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <div style={{ background: track.status === "Processing" ? "#1a1505" : "#161616", border: "1px solid #222", width: 40, height: 40, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {track.status === "Processing" ? (
                        <RefreshCw className="w-5 h-5 text-[#FFB800] animate-spin" />
                      ) : (
                        <Play 
  className="w-4 h-4 text-[#FFB800] fill-[#FFB800] cursor-pointer"
  onClick={() => {
    const audio = new Audio(track.audioUrl);
    audio.play();
  }}
/>
                      )}
                    </div>
                    <div>
                      <h4 style={{ margin: "0 0 0.2rem 0", fontSize: "0.95rem", fontWeight: 600 }}>{track.title}</h4>
                      <div style={{ display: "flex", gap: "0.75rem", fontSize: "0.75rem", color: "#555" }}>
                        <span style={{ color: "#888" }}>{track.type}</span>
                        <span>•</span>
                        <span>{track.date}</span>
                        <span>•</span>
                        <span>{track.duration}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <span style={{
                      fontSize: "0.7rem",
                      padding: "0.25rem 0.5rem",
                      borderRadius: 6,
                      fontWeight: 600,
                      background: track.status === "Ready" ? "rgba(74,222,128,0.08)" : "rgba(255,184,0,0.08)",
                      color: track.status === "Ready" ? "#4ade80" : "#FFB800",
                      border: track.status === "Ready" ? "1px solid rgba(74,222,128,0.15)" : "1px solid rgba(255,184,0,0.15)"
                    }}>
                      {track.status}
                    </span>
                    <button 
                      disabled={track.status !== "Ready"}
                      style={{
                        background: "none",
                        border: "1px solid #222",
                        padding: "0.45rem",
                        borderRadius: 8,
                        color: track.status === "Ready" ? "#aaa" : "#333",
                        cursor: track.status === "Ready" ? "pointer" : "not-allowed"
                      }}
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: EXPLORE BEATS */}
        {activeTab === "explore" && (
          <div style={{ background: "#0d0d0d", border: "1px solid #161616", borderRadius: 16, padding: "1.5rem", animation: "fadeIn 0.3s ease-in-out" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700, margin: "0 0 0.25rem 0" }}>Explore Royalty-Free Base Beats</h2>
            <p style={{ margin: "0 0 1.5rem 0", color: "#555", fontSize: "0.8rem" }}>Select pre-engineered baseline rhythm sequences to feed straight into your voice tracking matrix.</p>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
              {[
                { title: "Lagos Sunset Horizon", bpm: "102 BPM", genre: "Afrobeats", tags: ["Mellow", "Guitar"] },
                { title: "Maputo Bass Rhythm groove", bpm: "111 BPM", genre: "Amapiano", tags: ["Log Drum", "Club"] },
                { title: "Dark Synth Trap Sequence", bpm: "140 BPM", genre: "Hip Hop", tags: ["808", "Moody"] },
                { title: "Chillhop Bedroom Ambient", bpm: "85 BPM", genre: "Lo-Fi", tags: ["Smooth", "Rhodes"] },
              ].map((item, idx) => (
                <div key={idx} style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: 12, padding: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <h4 style={{ margin: "0 0 0.15rem 0", fontSize: "0.95rem", fontWeight: 600 }}>{item.title}</h4>
                      <span style={{ fontSize: "0.75rem", color: "#FFB800", fontWeight: 500 }}>{item.genre} • {item.bpm}</span>
                    </div>
                    <button style={{ background: "rgba(255,184,0,0.1)", border: 0, padding: "0.4rem", borderRadius: "50%", color: "#FFB800", cursor: "pointer" }}>
                      <Play className="w-3 h-3 fill-[#FFB800]" />
                    </button>
                  </div>
                  <div style={{ display: "flex", gap: "0.35rem" }}>
                    {item.tags.map((t, i) => (
                      <span key={i} style={{ background: "#181818", color: "#666", fontSize: "0.65rem", padding: "0.2rem 0.4rem", borderRadius: 4 }}>#{t}</span>
                    ))}
                  </div>
                  <button 
                    onClick={() => {
                      setSelectedService("full");
                      setPrompt(`Utilizing rhythm structures derived from ${item.title} baseline layout style`);
                      setActiveTab("create");
                    }}
                    style={{ background: "transparent", border: "1px solid #222", padding: "0.45rem", borderRadius: 8, fontSize: "0.75rem", color: "#aaa", fontWeight: 500, cursor: "pointer", transition: "0.2s", marginTop: "0.25rem", textAlign: "center" }}
                  >
                    Load into Creation Suite
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid #111", padding: "2rem 1.5rem", marginTop: "4rem", background: "#060606", position: "relative", zIndex: 10 }}>
        <div style={{ maxWidth: 1300, margin: "0 auto", display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "1.5rem", fontSize: "0.8rem", color: "#444" }}>
          <div>
            <span style={{ fontWeight: 700, color: "#666", letterSpacing: "0.02em" }}>MEZIE STUDIO CONTROL ENGINE</span>
            <p style={{ margin: "0.25rem 0 0 0" }}>© 2026 Mezie Audio Labs. Artificial Intelligence Mixing, Mastering, and Stem Synthesis Framework.</p>
          </div>
          <div style={{ display: "flex", gap: "1rem" }}>
            <span style={{ cursor: "pointer" }}>Documentation Manual</span>
            <span>•</span>
            <span style={{ cursor: "pointer" }}>Core API Gateway</span>
            <span>•</span>
            <span style={{ cursor: "pointer" }}>Support Engine Desk</span>
          </div>
        </div>
      </footer>
    </div>
  );
}