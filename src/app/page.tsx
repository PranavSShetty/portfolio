"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import Lenis from "lenis";
import { Canvas } from "@react-three/fiber";
import Experience from "@/components/Experience";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Mail, FileText, ShieldAlert, Cpu, Network, Activity, Send, Terminal, ShieldCheck, ChevronDown } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const SECTIONS = [
  { name: "CORE", id: "hero" },
  { name: "TRANSFORMER", id: "transformer" },
  { name: "ADVERSARIAL", id: "adversarial" },
  { name: "MOLECULAR", id: "molecular" },
  { name: "MEDICAL", id: "medical" },
  { name: "COMMAND", id: "command" },
  { name: "FORENSICS", id: "forensics" },
  { name: "TECH STACK", id: "techstack" },
  { name: "CONTACT", id: "contact" }
];

const HACKER_LOGS = [
  "SYSTEM STATUS: INITIALIZING SECURE OVERRIDE...",
  "DECRYPTING CORE VOID COMPASS SPLINES...",
  "PORT SCANNING VOID SOCKET 3000... [ACTIVE]",
  "ESTABLISHING HIGH-PERFORMANCE CUDA CHANNELS...",
  "BYPASSING SECURITY PROTOCOL: SAHYADRI_AUTH...",
  "INJECTING CGAN FEATURE-WISE ADVERSARIAL LAYERS...",
  "CALCULATING PHARMACOLOGICAL MOLECULAR GRAPHS...",
  "LUB-DUB CARDIOTOXIC AGENTS INITIALIZED...",
  "ATTEMPTING ROBOTIC SECURITY GATE BREACH...",
  "GATE SECURITY CODE DECRYPTED: 0x7FFA45E1"
];

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const [activeSection, setActiveSection] = useState(0);

  // Breach loader state
  const [loading, setLoading] = useState(true);
  const [breachProgress, setBreachProgress] = useState(0);
  const [activeLogs, setActiveLogs] = useState<string[]>([]);
  const [terminalPhase, setTerminalPhase] = useState<"hacking" | "success">("hacking");
  const [projectsDropdownOpen, setProjectsDropdownOpen] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Click/touch outside handler to close dropdown seamlessly on mobile and desktop
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProjectsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    lenis.on("scroll", (e) => {
      ScrollTrigger.update();
      // Calculate active section index based on scroll position
      const scrollY = window.scrollY;
      const height = window.innerHeight;
      const index = Math.min(
        SECTIONS.length - 1,
        Math.max(0, Math.round(scrollY / height))
      );
      setActiveSection(index);
    });

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // Initial scroll lock during hacking
    if (loading) {
      lenis.stop();
    } else {
      lenis.start();
    }

    return () => {
      gsap.ticker.remove((time) => {
        lenis.raf(time * 1000);
      });
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [loading]);

  // Handle Hacking Simulator Loading Sequence
  useEffect(() => {
    if (!loading) return;

    let logIndex = 0;
    const progressInterval = setInterval(() => {
      setBreachProgress((prev) => {
        const next = prev + Math.floor(Math.random() * 4) + 2;
        if (next >= 100) {
          clearInterval(progressInterval);
          setTerminalPhase("success");
          setTimeout(() => {
            if (loaderRef.current) {
              gsap.to(loaderRef.current, {
                opacity: 0,
                duration: 0.8,
                ease: "power2.out",
                onComplete: () => {
                  setLoading(false);
                }
              });
            } else {
              setLoading(false);
            }
          }, 1200); // Wait in successful state for extra epic visual impact
          return 100;
        }

        // Add matching logs as progress counts up
        const logThreshold = Math.floor((HACKER_LOGS.length - 1) * (next / 100));
        if (logThreshold >= logIndex) {
          setActiveLogs((prevLogs) => [...prevLogs, HACKER_LOGS[logIndex]]);
          logIndex++;
        }

        return next;
      });
    }, 150);

    return () => clearInterval(progressInterval);
  }, []);

  const handleNavClick = (index: number) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(index * window.innerHeight, {
        duration: 1.5,
      });
    } else {
      window.scrollTo({
        top: index * window.innerHeight,
        behavior: "smooth"
      });
    }
  };

  return (
    <main ref={containerRef} className="relative w-full h-[900vh] bg-[#050505] text-white overflow-x-hidden">
      {/* 3D Canvas - Fixed Background */}
      <div className="fixed top-0 left-0 w-full h-screen z-0">
        <Canvas 
          camera={{ position: [0, 0, 5], fov: 75 }}
          dpr={[1, 1.5]}
          gl={{ 
            antialias: false, 
            powerPreference: "high-performance",
            alpha: false,
            stencil: false,
            depth: true
          }}
        >
          <Suspense fallback={null}>
            <Experience gateOpen={!loading} />
          </Suspense>
        </Canvas>
      </div>

      {/* Futuristic Hacker Terminal Loader Overlay */}
      {loading && (
        <div 
          ref={loaderRef}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/55 backdrop-blur-md select-none pointer-events-auto font-mono"
        >
          {/* Neon Grid Backing & Scanline effect */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,3px_100%] pointer-events-none animate-pulse" />
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/80 to-black pointer-events-none" />

          {/* Centered Hacking Interface */}
          <div className="w-full max-w-xl mx-4 bg-black/80 border border-cyan-500/30 rounded-lg p-6 relative overflow-hidden shadow-[0_0_50px_rgba(0,255,255,0.15)] transition-all">
            {/* Header Terminal bar */}
            <div className="flex justify-between items-center border-b border-cyan-500/20 pb-3 mb-4 text-xs tracking-wider">
              <div className="flex items-center gap-2">
                <Terminal size={14} className="text-cyan-400 animate-pulse" />
                <span className="text-cyan-400 font-bold">VOID_TERMINAL://BREACH_UTILITY.sh</span>
              </div>
              <span className="text-gray-500 animate-ping">● LIVE_PENTEST</span>
            </div>

            {/* Simulated Live Console Logs */}
            <div className="h-44 overflow-y-auto mb-6 text-[10px] sm:text-xs leading-relaxed space-y-1.5 scrollbar-none text-green-400/90 pr-2">
              <div>$ pranav_s_shetty --infiltrate --target=latent_void</div>
              <div>[OK] LINK SECURED TO NVIDIA RTX 3050 CUDA CORES</div>
              {activeLogs.map((log, index) => (
                <div key={index} className="flex gap-2">
                  <span className="text-cyan-500 font-bold">&gt;</span>
                  <span>{log}</span>
                </div>
              ))}
              {terminalPhase === "hacking" && (
                <div className="flex items-center gap-1">
                  <span className="text-cyan-500 font-bold">&gt;</span>
                  <span className="bg-green-400 w-1.5 h-3.5 inline-block animate-blink"></span>
                </div>
              )}
            </div>

            {/* High-tech custom breach progress bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold font-mono">
                <span className={terminalPhase === "success" ? "text-green-400" : "text-cyan-400"}>
                  {terminalPhase === "success" ? "SECURITY BYPASSED - GATE OPEN" : "INJECTING EXPLOIT..."}
                </span>
                <span className={terminalPhase === "success" ? "text-green-400" : "text-cyan-400"}>
                  {breachProgress}%
                </span>
              </div>
              <div className="w-full bg-cyan-950/40 h-2.5 rounded overflow-hidden border border-cyan-500/20 relative">
                <div 
                  className={`h-full transition-all duration-150 ${
                    terminalPhase === "success" ? "bg-green-400" : "bg-gradient-to-r from-cyan-500 to-cyan-300"
                  }`} 
                  style={{ width: `${breachProgress}%` }}
                />
              </div>
            </div>

            {/* Flash success banner */}
            {terminalPhase === "success" && (
              <div className="absolute inset-0 bg-green-500/10 border-2 border-green-400/60 rounded-lg flex flex-col items-center justify-center gap-3 backdrop-blur-sm animate-scale-up">
                <ShieldCheck size={48} className="text-green-400 animate-bounce" />
                <h3 className="text-xl sm:text-2xl font-bold tracking-widest text-green-400 animate-pulse text-center">
                  BREACH SUCCESSFUL
                </h3>
                <p className="text-xs text-white opacity-80 uppercase tracking-widest">DISMANTLING SECURITY CORE...</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* High-Tech Glassmorphic Navigation Bar */}
      <nav className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto flex items-center gap-2 md:gap-4 px-4 py-2.5 rounded-full border border-white/10 bg-black/45 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.5)] max-w-[95%] overflow-visible transition-all duration-700 ${
        loading ? "opacity-0 -translate-y-12" : "opacity-100 translate-y-0"
      }`}>
        {/* CORE BUTTON */}
        <button
          onClick={() => handleNavClick(0)}
          className={`px-3 py-1 text-[9px] md:text-xs font-mono tracking-widest uppercase transition-all duration-300 rounded-full border ${
            activeSection === 0
              ? "bg-cyan-500/10 border-cyan-500/50 text-cyan-400 font-bold shadow-[0_0_10px_rgba(0,255,255,0.2)]"
              : "border-transparent text-gray-500 hover:text-white"
          }`}
        >
          CORE
        </button>

        {/* PROJECTS Trigger Wrapper with Glassmorphic Dropdown */}
        <div 
          ref={dropdownRef}
          className="relative"
          onMouseEnter={() => setProjectsDropdownOpen(true)}
          onMouseLeave={() => setProjectsDropdownOpen(false)}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setProjectsDropdownOpen(!projectsDropdownOpen);
            }}
            className={`px-3 py-1 text-[9px] md:text-xs font-mono tracking-widest uppercase transition-all duration-300 rounded-full border flex items-center gap-1 md:gap-1.5 ${
              activeSection >= 1 && activeSection <= 6
                ? "bg-cyan-500/10 border-cyan-500/50 text-cyan-400 font-bold shadow-[0_0_10px_rgba(0,255,255,0.2)]"
                : "border-transparent text-gray-500 hover:text-white"
            }`}
          >
            <span>PROJECTS</span>
            <ChevronDown 
              size={12} 
              className={`transition-transform duration-300 ${projectsDropdownOpen ? "rotate-180 text-cyan-400" : "text-gray-500"}`} 
            />
          </button>

          {/* Floating Glassmorphic Dropdown */}
          <div 
            className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 rounded-xl border border-white/10 bg-black/90 backdrop-blur-md shadow-[0_10px_30px_rgba(0,255,255,0.08)] p-1.5 flex flex-col gap-1 transition-all duration-300 origin-top pointer-events-auto ${
              projectsDropdownOpen 
                ? "opacity-100 scale-100 translate-y-0" 
                : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
            }`}
          >
            {SECTIONS.slice(1, 7).map((sec, subIdx) => {
              const idx = subIdx + 1; // actual index in main scroll
              const isActive = activeSection === idx;
              return (
                <button
                  key={sec.id}
                  onClick={() => {
                    handleNavClick(idx);
                    setProjectsDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg font-mono text-[9px] md:text-[10px] tracking-wider uppercase transition-all duration-200 border ${
                    isActive
                      ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400 font-bold"
                      : "border-transparent text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {sec.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* TECH STACK & CONTACT */}
        {SECTIONS.slice(7).map((sec, idx) => {
          const mainIdx = idx + 7;
          return (
            <button
              key={sec.id}
              onClick={() => handleNavClick(mainIdx)}
              className={`px-3 py-1 text-[9px] md:text-xs font-mono tracking-widest uppercase transition-all duration-300 rounded-full border ${
                activeSection === mainIdx
                  ? "bg-cyan-500/10 border-cyan-500/50 text-cyan-400 font-bold shadow-[0_0_10px_rgba(0,255,255,0.2)]"
                  : "border-transparent text-gray-500 hover:text-white"
              }`}
            >
              {sec.name}
            </button>
          );
        })}
      </nav>      {/* HTML Overlays over the scroll */}
      <div className="relative z-10 w-full h-full pointer-events-none">
        
        {/* HERO SECTION */}
        <section 
          id="hero" 
          className={`h-screen flex flex-col items-center justify-center pointer-events-auto px-4 md:px-6 relative transition-all duration-1000 ease-out transform ${
            activeSection === 0 ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-10 scale-95 pointer-events-none"
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />
          
          <div className="z-10 flex flex-col items-center text-center w-full max-w-4xl backdrop-blur-sm bg-black/25 p-8 md:p-12 rounded-3xl border border-white/5 shadow-2xl">
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-300 to-gray-600 mb-4 animate-fade-in" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
              PRANAV S. SHETTY
            </h1>
            
            <p className="text-sm sm:text-xl md:text-2xl font-light text-cyan-400 mb-6 tracking-wide uppercase flex flex-wrap justify-center gap-2">
              <span>Computer Science Engineer</span>
              <span className="text-gray-600 hidden sm:inline">|</span>
              <span>Deep Learning</span>
              <span className="text-gray-600 hidden sm:inline">|</span>
              <span>Cybersecurity</span>
            </p>
            
            <p className="text-gray-400 max-w-2xl text-sm md:text-lg mb-8 leading-relaxed">
              B.E. in Computer Science Engineering at Sahyadri College of Engineering & Management. 
              Specializing in the intersection of artificial intelligence and information security. 
              Architecting resilient neural models and defending next-generation web infrastructure.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              <a href="https://github.com/PranavSShetty" target="_blank" rel="noreferrer" className="p-3 bg-white/5 rounded-full hover:bg-cyan-500/20 hover:text-cyan-400 transition-all border border-white/10 hover:border-cyan-500/50 pointer-events-auto">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
              </a>
              <a href="https://linkedin.com/in/pranav-s-shetty-b69308260" target="_blank" rel="noreferrer" className="p-3 bg-white/5 rounded-full hover:bg-cyan-500/20 hover:text-cyan-400 transition-all border border-white/10 hover:border-cyan-500/50 pointer-events-auto">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
              <button 
                onClick={() => handleNavClick(8)} 
                className="p-3 bg-white/5 rounded-full hover:bg-cyan-500/20 hover:text-cyan-400 transition-all border border-white/10 hover:border-cyan-500/50 pointer-events-auto cursor-pointer"
              >
                <Mail size={24} />
              </button>
              <a href="/pranav_s_shetty_cv.pdf" target="_blank" className="flex items-center gap-2 px-6 py-3 bg-cyan-500/10 text-cyan-400 rounded-full font-medium hover:bg-cyan-500/20 transition-all border border-cyan-500/30 pointer-events-auto">
                <FileText size={20} />
                <span>View Resume</span>
              </a>
            </div>
          </div>
          
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
            <span className="text-xs uppercase tracking-widest block mb-2 text-center text-gray-400">Scroll to Explore</span>
            <div className="w-[1px] h-12 bg-gradient-to-b from-white/50 to-transparent mx-auto"></div>
          </div>
        </section>
        
        {/* SECTION A: Transformer Lab */}
        <section 
          id="transformer" 
          className={`h-screen flex items-center justify-start px-6 md:px-24 pointer-events-none transition-all duration-1000 ease-out transform ${
            activeSection === 1 ? "opacity-100 translate-x-0 scale-100" : "opacity-0 -translate-x-10 scale-95 pointer-events-none"
          }`}
        >
          <div className="max-w-xl backdrop-blur-md bg-black/45 p-8 md:p-10 rounded-2xl border border-cyan-500/20 shadow-[0_0_40px_rgba(0,255,255,0.05)] hover:shadow-[0_0_60px_rgba(0,255,255,0.1)] transition-all pointer-events-auto">
            <div className="flex items-center gap-3 mb-4 md:mb-6 text-cyan-400">
              <Cpu size={28} />
              <span className="font-mono tracking-wider opacity-80 uppercase text-xs md:text-sm">Research &bull; AIDE 2026</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
              Transformer Lab
            </h2>
            <h3 className="text-lg md:text-xl text-gray-300 mb-4 font-medium">Tulu-to-English Machine Translation</h3>
            <p className="text-gray-400 leading-relaxed mb-6 md:mb-8 text-sm md:text-base">
              Architected a custom NLP pipeline utilizing state-of-the-art Transformer self-attention mechanisms to translate the low-resource Tulu language. 
              Trained on a curated corpus of 9,464 sentence pairs with sinusoidal positional encoding, achieving a 10-fold reduction in training computational power compared to LSTM/GRU.
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="px-3 py-1 bg-cyan-900/30 text-cyan-300 text-xs font-mono rounded-md border border-cyan-500/20">PyTorch</span>
              <span className="px-3 py-1 bg-cyan-900/30 text-cyan-300 text-xs font-mono rounded-md border border-cyan-500/20">Transformers</span>
              <span className="px-3 py-1 bg-cyan-900/30 text-cyan-300 text-xs font-mono rounded-md border border-cyan-500/20">NLP</span>
            </div>
            <a href="https://github.com/PranavSShetty/TulutoEnglishCodepart" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 text-cyan-400 rounded-lg font-mono text-xs tracking-wider hover:bg-cyan-500/20 transition-all border border-cyan-500/20 hover:border-cyan-500/40 hover:shadow-[0_0_15px_rgba(0,255,255,0.15)]">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
              View on GitHub
            </a>
          </div>
        </section>
 
        {/* SECTION B: Adversarial Vault */}
        <section 
          id="adversarial" 
          className={`h-screen flex items-center justify-end px-6 md:px-24 pointer-events-none transition-all duration-1000 ease-out transform ${
            activeSection === 2 ? "opacity-100 translate-x-0 scale-100" : "opacity-0 translate-x-10 scale-95 pointer-events-none"
          }`}
        >
          <div className="max-w-xl backdrop-blur-md bg-black/45 p-8 md:p-10 rounded-2xl border border-red-500/20 shadow-[0_0_40px_rgba(255,0,0,0.05)] hover:shadow-[0_0_60px_rgba(255,0,0,0.1)] transition-all text-left md:text-right pointer-events-auto w-full md:w-auto">
            <div className="flex items-center md:justify-end gap-3 mb-4 md:mb-6 text-red-500">
              <span className="font-mono tracking-wider opacity-80 uppercase text-xs md:text-sm">IEEE ICAIC 2026</span>
              <ShieldAlert size={28} className="hidden md:block" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 text-white" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
              Adversarial Vault
            </h2>
            <h3 className="text-lg md:text-xl text-gray-300 mb-4 font-medium">FiLM-Enhanced WGAN Password Gen</h3>
            <p className="text-gray-400 leading-relaxed mb-6 md:mb-8 text-sm md:text-base">
              Developed a cutting-edge Conditional Wasserstein GAN augmented with Feature-wise Linear Modulation (FiLM) for synthetic password generation. 
              Achieved superior length control and structural consistency compared to standard baselines like PassGAN.
            </p>
            <div className="flex flex-wrap gap-2 md:justify-end mb-6">
              <span className="px-3 py-1 bg-red-900/30 text-red-300 text-xs font-mono rounded-md border border-red-500/20">TensorFlow</span>
              <span className="px-3 py-1 bg-red-900/30 text-red-300 text-xs font-mono rounded-md border border-red-500/20">WGAN-GP</span>
              <span className="px-3 py-1 bg-red-900/30 text-red-300 text-xs font-mono rounded-md border border-red-500/20">Cryptography</span>
            </div>
            <div className="flex md:justify-end">
              <a href="https://github.com/PranavSShetty/film-wgan-password-generation" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 rounded-lg font-mono text-xs tracking-wider hover:bg-red-500/20 transition-all border border-red-500/20 hover:border-red-500/40 hover:shadow-[0_0_15px_rgba(255,0,0,0.15)]">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
                View on GitHub
              </a>
            </div>
          </div>
        </section>
 
        {/* SECTION C: Molecular Cluster */}
        <section 
          id="molecular" 
          className={`h-screen flex items-center justify-start px-6 md:px-24 pointer-events-none transition-all duration-1000 ease-out transform ${
            activeSection === 3 ? "opacity-100 translate-x-0 scale-100" : "opacity-0 -translate-x-10 scale-95 pointer-events-none"
          }`}
        >
          <div className="max-w-xl backdrop-blur-md bg-black/45 p-8 md:p-10 rounded-2xl border border-green-500/20 shadow-[0_0_40px_rgba(0,255,100,0.05)] hover:shadow-[0_0_60px_rgba(0,255,100,0.1)] transition-all pointer-events-auto">
            <div className="flex items-center gap-3 mb-4 md:mb-6 text-green-400">
              <Network size={28} />
              <span className="font-mono tracking-wider opacity-80 uppercase text-xs md:text-sm">Research &bull; AICCoNS 2026</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
              Molecular Cluster
            </h2>
            <h3 className="text-lg md:text-xl text-gray-300 mb-4 font-medium">LogP Drug Lead Optimization</h3>
            <p className="text-gray-400 leading-relaxed mb-6 md:mb-8 text-sm md:text-base">
              Engineered predictive models integrating Graph Neural Networks (GNN) and Random Forests to optimize the lipophilicity (LogP) of pharmaceutical drug leads.
              Benchmarked on 1,177 compounds from PubChem, identifying that the Random Forest algorithm (R²=0.84) outperformed the GNN approach.
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="px-3 py-1 bg-green-900/30 text-green-300 text-xs font-mono rounded-md border border-green-500/20">GNN</span>
              <span className="px-3 py-1 bg-green-900/30 text-green-300 text-xs font-mono rounded-md border border-green-500/20">Scikit-Learn</span>
              <span className="px-3 py-1 bg-green-900/30 text-green-300 text-xs font-mono rounded-md border border-green-500/20">Bioinformatics</span>
            </div>
          </div>
        </section>
 
        {/* SECTION D: Medical Node */}
        <section 
          id="medical" 
          className={`h-screen flex items-center justify-end px-6 md:px-24 pointer-events-none transition-all duration-1000 ease-out transform ${
            activeSection === 4 ? "opacity-100 translate-x-0 scale-100" : "opacity-0 translate-x-10 scale-95 pointer-events-none"
          }`}
        >
          <div className="max-w-xl backdrop-blur-md bg-black/45 p-8 md:p-10 rounded-2xl border border-pink-500/20 shadow-[0_0_40px_rgba(255,0,150,0.05)] hover:shadow-[0_0_60px_rgba(255,0,150,0.1)] transition-all text-left md:text-right pointer-events-auto w-full md:w-auto">
            <div className="flex items-center md:justify-end gap-3 mb-4 md:mb-6 text-pink-400">
              <span className="font-mono tracking-wider opacity-80 uppercase text-xs md:text-sm">Active Project</span>
              <Activity size={28} className="hidden md:block" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 text-white" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
              The Medical Node
            </h2>
            <h3 className="text-lg md:text-xl text-gray-300 mb-4 font-medium">AI Agents for Cardiac Complications</h3>
            <p className="text-gray-400 leading-relaxed mb-6 md:mb-8 text-sm md:text-base">
              A theoretical framework utilizing Autonomous AI Agents based on the ReAct paradigm to enable early detection of beta-blocker-induced cardiotoxicity.
              The conceptual architecture employs LLMs with Chain-of-Thought reasoning to transition clinical monitoring from passive alarms to active decision support.
            </p>
            <div className="flex flex-wrap gap-2 md:justify-end mb-6">
              <span className="px-3 py-1 bg-pink-900/30 text-pink-300 text-xs font-mono rounded-md border border-pink-500/20">LLMs</span>
              <span className="px-3 py-1 bg-pink-900/30 text-pink-300 text-xs font-mono rounded-md border border-pink-500/20">AI Agents</span>
              <span className="px-3 py-1 bg-pink-900/30 text-pink-300 text-xs font-mono rounded-md border border-pink-500/20">Healthcare</span>
            </div>
          </div>
        </section>
 
        {/* SECTION E: Command Center */}
        <section 
          id="command" 
          className={`h-screen flex items-center justify-start px-6 md:px-24 pointer-events-none transition-all duration-1000 ease-out transform ${
            activeSection === 5 ? "opacity-100 translate-x-0 scale-100" : "opacity-0 -translate-x-10 scale-95 pointer-events-none"
          }`}
        >
          <div className="max-w-xl backdrop-blur-md bg-black/45 p-8 md:p-10 rounded-2xl border border-purple-500/20 shadow-[0_0_40px_rgba(150,0,255,0.05)] hover:shadow-[0_0_60px_rgba(150,0,255,0.1)] transition-all pointer-events-auto">
            <div className="flex items-center gap-3 mb-4 md:mb-6 text-purple-400">
              <Terminal size={28} />
              <span className="font-mono tracking-wider opacity-80 uppercase text-xs md:text-sm">Engineering &bull; Torsecure Cyber</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 text-white" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
              Command Center
            </h2>
            <h3 className="text-lg md:text-xl text-gray-300 mb-4 font-medium">Web & Cybersecurity Intern</h3>
            <p className="text-gray-400 leading-relaxed mb-6 md:mb-8 text-sm md:text-base">
              Conducted vulnerability assessments and security analysis for active infrastructure. 
              Also architected a Full-stack College Stationary Management System featuring secure RBAC, dynamic JSP content rendering, and real-time MySQL inventory tracking.
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="px-3 py-1 bg-purple-900/30 text-purple-300 text-xs font-mono rounded-md border border-purple-500/20">Java</span>
              <span className="px-3 py-1 bg-purple-900/30 text-purple-300 text-xs font-mono rounded-md border border-purple-500/20">MySQL</span>
              <span className="px-3 py-1 bg-purple-900/30 text-purple-300 text-xs font-mono rounded-md border border-purple-500/20">Security Analysis</span>
            </div>
            <a href="https://github.com/PranavSShetty/College-Stationary-Management" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 text-purple-400 rounded-lg font-mono text-xs tracking-wider hover:bg-purple-500/20 transition-all border border-purple-500/20 hover:border-purple-500/40 hover:shadow-[0_0_15px_rgba(150,0,255,0.15)]">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
              View on GitHub
            </a>
          </div>
        </section>
 
        {/* SECTION F: Forensics Lab (Onyx Forensics) */}
        <section 
          id="forensics" 
          className={`h-screen flex items-center justify-end px-6 md:px-24 pointer-events-none transition-all duration-1000 ease-out transform ${
            activeSection === 6 ? "opacity-100 translate-x-0 scale-100" : "opacity-0 translate-x-10 scale-95 pointer-events-none"
          }`}
        >
          <div className="max-w-xl backdrop-blur-md bg-black/45 p-8 md:p-10 rounded-2xl border border-orange-500/20 shadow-[0_0_40px_rgba(255,140,0,0.05)] hover:shadow-[0_0_60px_rgba(255,140,0,0.1)] transition-all text-left md:text-right pointer-events-auto w-full md:w-auto">
            <div className="flex items-center md:justify-end gap-3 mb-4 md:mb-6 text-orange-400">
              <span className="font-mono tracking-wider opacity-80 uppercase text-xs md:text-sm">Open Source &bull; Deployed</span>
              <ShieldAlert size={28} className="hidden md:block" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 text-white" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
              Forensics Lab
            </h2>
            <h3 className="text-lg md:text-xl text-gray-300 mb-4 font-medium">Onyx Forensics Platform</h3>
            <p className="text-gray-400 leading-relaxed mb-6 md:mb-8 text-sm md:text-base">
              A comprehensive digital forensics investigation platform built with TypeScript. 
              Features advanced evidence analysis tools, forensic workflow management, 
              real-time threat intelligence dashboards, and automated incident response pipelines.
            </p>
            <div className="flex flex-wrap gap-2 md:justify-end mb-6">
              <span className="px-3 py-1 bg-orange-900/30 text-orange-300 text-xs font-mono rounded-md border border-orange-500/20">TypeScript</span>
              <span className="px-3 py-1 bg-orange-900/30 text-orange-300 text-xs font-mono rounded-md border border-orange-500/20">Next.js</span>
              <span className="px-3 py-1 bg-orange-900/30 text-orange-300 text-xs font-mono rounded-md border border-orange-500/20">Digital Forensics</span>
            </div>
            <div className="flex flex-wrap gap-3 md:justify-end">
              <a href="https://github.com/PranavSShetty/onyxforensics" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 text-orange-400 rounded-lg font-mono text-xs tracking-wider hover:bg-orange-500/20 transition-all border border-orange-500/20 hover:border-orange-500/40 hover:shadow-[0_0_15px_rgba(255,140,0,0.15)]">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
                View on GitHub
              </a>
              <a href="https://onyxforensics.vercel.app" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 text-orange-400 rounded-lg font-mono text-xs tracking-wider hover:bg-orange-500/20 transition-all border border-orange-500/20 hover:border-orange-500/40 hover:shadow-[0_0_15px_rgba(255,140,0,0.15)]">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                Live Demo
              </a>
            </div>
          </div>
        </section>
 
        {/* SECTION G: Tech Stack (Interactive balls in background) */}
        <section 
          id="techstack" 
          className={`h-screen flex flex-col items-center justify-start pt-32 px-6 pointer-events-none transition-all duration-1000 ease-out transform ${
            activeSection === 7 ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-10 scale-95 pointer-events-none"
          }`}
        >
          <div className="text-center mb-10 z-10">
            <h2 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
              MY TECH STACK
            </h2>
            <p className="text-gray-400 max-w-md mx-auto">Interact with the physics cluster. Hover to scatter.</p>
          </div>
        </section>
 
        {/* SECTION H: Contact Page (Cinematic Cybernetic Dashboard & Terminal) */}
        <section 
          id="contact" 
          className={`h-[100vh] flex items-center justify-center px-4 md:px-6 pointer-events-none transition-all duration-1000 ease-out transform ${
            activeSection === 8 ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-10 scale-95 pointer-events-none"
          }`}
        >
          <div className="w-full max-w-5xl backdrop-blur-md bg-black/65 p-6 md:p-10 rounded-2xl border border-cyan-500/25 shadow-[0_0_50px_rgba(0,255,255,0.06)] hover:shadow-[0_0_80px_rgba(0,255,255,0.12)] transition-all duration-500 pointer-events-auto relative overflow-hidden">
            
            {/* Ambient Background Grid Line */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.15)_50%)] bg-[size:100%_4px] pointer-events-none opacity-40" />
            
            {/* Header Terminal bar */}
            <div className="flex justify-between items-center border-b border-cyan-500/20 pb-4 mb-6 md:mb-8 text-xs tracking-wider">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 bg-cyan-500 rounded-full animate-ping" />
                <span className="text-cyan-400 font-mono font-bold uppercase tracking-widest text-[10px] md:text-xs">SECURE_CHANNEL://PORT_2026.bin</span>
              </div>
              <div className="flex items-center gap-4 text-gray-500 font-mono text-[9px] md:text-xs hidden sm:flex">
                <span>STATUS: ACTIVE</span>
                <span>ENC: AES-256</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 md:gap-12 relative z-10">
              
              {/* Left Column: Handshake Details & Tech Diagnostics (2/5 cols) */}
              <div className="lg:col-span-2 flex flex-col justify-between space-y-6 md:space-y-8">
                <div>
                  <span className="text-[10px] font-mono bg-cyan-900/30 text-cyan-300 border border-cyan-500/20 px-2 py-0.5 rounded uppercase tracking-widest mb-3 inline-block">SECURE HANDSHAKE</span>
                  <h2 className="text-3xl md:text-5xl font-black mb-4 md:mb-6 text-white leading-tight uppercase tracking-tight" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
                    ESTABLISH<br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400 drop-shadow-[0_0_15px_rgba(0,255,255,0.15)]">CONNECTION</span>
                  </h2>
                  <p className="text-gray-400 leading-relaxed text-sm md:text-base">
                    Choose a secure transmission protocol below to initiate direct communication regarding artificial intelligence research, software engineering, or technical infrastructure.
                  </p>
                </div>
                
                {/* Diagnostic HUD Elements (Simulated live telemetry) */}
                <div className="bg-cyan-950/15 border border-cyan-500/10 rounded-xl p-4 space-y-3 font-mono text-[10px] text-cyan-300/80">
                  <div className="flex justify-between border-b border-cyan-500/10 pb-1.5 mb-1.5 text-cyan-400 font-bold tracking-wider">
                    <span>CONSOLE_DIAGNOSTICS</span>
                    <span className="animate-pulse">● LIVE_FEED</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GATEWAY:</span>
                    <span className="text-white">PRANAV_PORTFOLIO_NODE_01</span>
                  </div>
                  <div className="flex justify-between">
                    <span>SOCKET LATENCY:</span>
                    <span className="text-green-400">12ms [STABLE]</span>
                  </div>
                  <div className="flex justify-between">
                    <span>BANDWIDTH:</span>
                    <span className="text-white">641.8 Mb/s</span>
                  </div>
                  {/* Staggered loading graph */}
                  <div className="w-full bg-cyan-950/60 h-1.5 rounded overflow-hidden mt-2 relative border border-cyan-500/10">
                    <div className="bg-gradient-to-r from-cyan-500 to-teal-400 h-full animate-[shimmer_2.5s_infinite]" style={{ width: '78%' }}></div>
                  </div>
                </div>

                {/* Secure Links */}
                <div className="space-y-4">
                  <a 
                    href="mailto:studytimemail24@gmail.com" 
                    className="flex items-center gap-4 group p-3 rounded-xl bg-white/5 border border-white/5 hover:border-cyan-500/30 hover:bg-cyan-950/10 hover:shadow-[0_0_20px_rgba(0,255,255,0.05)] transition-all duration-300"
                  >
                    <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center border border-white/10 group-hover:border-cyan-500/30 group-hover:text-cyan-400 transition-all">
                      <Mail size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Email Protocol</p>
                      <p className="font-mono text-xs md:text-sm text-gray-300 group-hover:text-white transition-colors">studytimemail24@gmail.com</p>
                    </div>
                  </a>
                  
                  <a 
                    href="https://linkedin.com/in/pranav-s-shetty-b69308260" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="flex items-center gap-4 group p-3 rounded-xl bg-white/5 border border-white/5 hover:border-cyan-500/30 hover:bg-cyan-950/10 hover:shadow-[0_0_20px_rgba(0,255,255,0.05)] transition-all duration-300"
                  >
                    <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center border border-white/10 group-hover:border-cyan-500/30 group-hover:text-cyan-400 transition-all">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                    </div>
                    <div>
                      <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">LinkedIn Network</p>
                      <p className="font-mono text-xs md:text-sm text-gray-300 group-hover:text-white transition-colors">in/pranav-s-shetty</p>
                    </div>
                  </a>
                </div>
              </div>
              
              {/* Right Column: High-Tech Cyber Console Visual (3/5 cols) */}
              <div className="lg:col-span-3 bg-cyan-950/5 border border-cyan-500/15 p-6 md:p-8 rounded-2xl relative flex flex-col justify-between overflow-hidden group shadow-[inset_0_0_30px_rgba(0,255,255,0.02)]">
                
                {/* Visual Top Decorator */}
                <div className="absolute top-0 right-8 -translate-y-1/2 bg-cyan-950 border border-cyan-500/30 px-3 py-0.5 rounded font-mono text-[9px] text-cyan-400 font-bold uppercase tracking-wider">
                  ACTIVE_LINK_TUNNEL
                </div>

                {/* Simulated Decrypting Cyber Terminal Feed */}
                <div className="space-y-4 font-mono text-xs text-cyan-400/90 w-full">
                  <div className="border-b border-cyan-500/10 pb-3 flex justify-between items-center text-[10px] font-bold text-cyan-300">
                    <span>SECURITY CODES // LIVE STREAM</span>
                    <span className="animate-pulse text-green-400">SYNCED</span>
                  </div>

                  <div className="space-y-2 h-64 overflow-y-auto scrollbar-none pr-2 text-[11px] leading-relaxed">
                    <div className="text-gray-500">// INITIALIZING SECURE PACKET OVERRIDE...</div>
                    <div className="flex justify-between text-green-400">
                      <span>&gt; AES-256 SYMMETRIC HANDSHAKE</span>
                      <span>[SUCCESS]</span>
                    </div>
                    <div className="flex justify-between">
                      <span>&gt; DECRYPTING SHA-256 SESSION KEY...</span>
                      <span className="text-cyan-300">0x7FBC5E</span>
                    </div>
                    <div className="text-gray-500">// PARSING TRANSVERSE GEOMETRY COEFFICIENTS...</div>
                    <div className="flex justify-between text-purple-400">
                      <span>&gt; ESTABLISHING SHADER TRANSITION ROUTE</span>
                      <span>[READY]</span>
                    </div>
                    <div className="flex justify-between text-indigo-400">
                      <span>&gt; LERPIN SPLINE COORDINATES Z-150</span>
                      <span>[OK]</span>
                    </div>
                    <div className="text-gray-500">// SECURING CONTACT PROTOCOL SOCKET...</div>
                    <div className="flex justify-between text-cyan-300 animate-pulse">
                      <span>&gt; PORT: 8080 CONNECTED -- INBOX LISTENING</span>
                      <span>[LIVE]</span>
                    </div>
                  </div>
                </div>

                {/* Interactive Decryption Key Visual */}
                <div className="mt-6 border-t border-cyan-500/10 pt-4 flex flex-col gap-3 font-mono">
                  <div className="flex justify-between items-center text-[10px] text-gray-500 uppercase tracking-wider">
                    <span>System Session Signature</span>
                    <span className="text-cyan-400 font-bold">ACTIVE</span>
                  </div>
                  <div className="bg-black/55 border border-cyan-500/20 p-3 rounded-lg flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <Terminal size={14} className="text-cyan-400 animate-pulse" />
                      <span className="text-[10px] sm:text-xs text-gray-300 font-bold tracking-widest break-all">PRANAV_SECURE_AUTH_0x2A7E11D5B8</span>
                    </div>
                    <span className="hidden sm:block text-[8px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">SHA-256</span>
                  </div>
                </div>

              </div>
            </div>
            
            {/* Terminal Footer */}
            <div className="mt-8 md:mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
              <p className="text-gray-500 text-[10px] md:text-xs font-mono flex items-center gap-2">
                <ShieldCheck size={14} className="text-cyan-400 animate-pulse" /> 
                SECURE AES-256 DIGITAL HANDSHAKE ESTABLISHED
              </p>
              <p className="text-gray-600 text-[10px] font-mono">© 2026 PRANAV S SHETTY. ALL SYSTEM PROTOCOLS INTACT.</p>
            </div>
          </div>
        </section>
 
      </div>
    </main>
  );
}
