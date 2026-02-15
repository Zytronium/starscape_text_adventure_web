'use client';

import { useEffect, useRef, useState } from 'react';

export default function StarscapeLanding() {
  const canvasRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  const [version, setVersion] = useState('Loading...');
  const [userOS, setUserOS] = useState('unknown');

  // Fetch version code
  useEffect(() => {
    fetch('https://cdn.zytronium.dev/starscape_text_adventure/version_code')
      .then(res => res.json())
      .then(data => {
        const appVersion = data.app;
        let displayVersion;

        // Transform version: 0.1.x.y.z -> Alpha 1.x.y.z, 0.2.x.y.z -> Beta 1.x.y.z
        if (appVersion.startsWith('0.1.')) {
          // Alpha version: 0.1.x.y.z -> Alpha 1.x.y.z
          displayVersion = 'Alpha 1.' + appVersion.substring(4);
        } else if (appVersion.startsWith('0.2.')) {
          // Beta version: 0.2.x.y.z -> Beta 1.x.y.z
          displayVersion = 'Beta 1.' + appVersion.substring(4);
        } else {
          // Release or invalid version: display as-is
          displayVersion = appVersion;
        }

        setVersion(displayVersion);
      })
      .catch(err => {
        console.error('Failed to fetch version:', err);
        setVersion('Unknown');
      });
  }, []);

  // Detect user OS
  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.indexOf('win') !== -1) {
      setUserOS('windows');
    } else if (userAgent.indexOf('linux') !== -1) {
      setUserOS('linux');
    } else if (userAgent.indexOf('mac') !== -1) {
      setUserOS('macos');
    } else {
      setUserOS('other');
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create stars
    const stars = Array.from({ length: 200 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.5,
      velocity: Math.random() * 0.3 + 0.1,
      opacity: Math.random() * 0.5 + 0.3
    }));

    // Shooting stars
    const shootingStars = [];

    const createShootingStar = () => {
      if (Math.random() < 0.02) {
        shootingStars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height * 0.5,
          length: Math.random() * 80 + 40,
          velocity: Math.random() * 4 + 3,
          angle: Math.PI / 4
        });
      }
    };

    // Animation loop
    const animate = () => {
      ctx.fillStyle = 'rgba(5, 5, 15, 1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw stars
      stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fill();

        // Twinkle effect
        star.opacity += (Math.random() - 0.5) * 0.05;
        star.opacity = Math.max(0.2, Math.min(0.8, star.opacity));

        // Move stars slowly
        star.y += star.velocity;
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }
      });

      // Draw shooting stars
      createShootingStar();
      shootingStars.forEach((star, index) => {
        const gradient = ctx.createLinearGradient(
          star.x,
          star.y,
          star.x - Math.cos(star.angle) * star.length,
          star.y - Math.sin(star.angle) * star.length
        );
        gradient.addColorStop(0, 'rgba(139, 92, 246, 0.8)');
        gradient.addColorStop(0.5, 'rgba(6, 182, 212, 0.4)');
        gradient.addColorStop(1, 'rgba(6, 182, 212, 0)');

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(star.x, star.y);
        ctx.lineTo(
          star.x - Math.cos(star.angle) * star.length,
          star.y - Math.sin(star.angle) * star.length
        );
        ctx.stroke();

        star.x += Math.cos(star.angle) * star.velocity;
        star.y += Math.sin(star.angle) * star.velocity;

        if (star.x > canvas.width || star.y > canvas.height) {
          shootingStars.splice(index, 1);
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const getPrimaryDownloadButton = () => {
    switch (userOS) {
      case 'windows':
        return (
          <a href="https://cdn.zytronium.dev/starscape_text_adventure/download/windows/starscape_text_adventure.exe" download>
            <button className="group relative px-12 py-6 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg font-bold text-lg tracking-wide overflow-hidden transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-[0_0_40px_rgba(251,191,36,0.6)] active:scale-95">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative flex items-center gap-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                DOWNLOAD FOR WINDOWS
              </span>
            </button>
          </a>
        );
      case 'linux':
        return (
          <a href="https://cdn.zytronium.dev/starscape_text_adventure/download/linux/starscape_text_adventure" download>
            <button className="group relative px-12 py-6 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg font-bold text-lg tracking-wide overflow-hidden transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-[0_0_40px_rgba(251,191,36,0.6)] active:scale-95">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative flex items-center gap-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                DOWNLOAD FOR LINUX
              </span>
            </button>
          </a>
        );
      default:
        return (
          <a href="https://github.com/Zytronium/starscape_text_adventure/archive/refs/heads/master.zip" download>
            <button className="group relative px-12 py-6 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg font-bold text-lg tracking-wide overflow-hidden transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-[0_0_40px_rgba(251,191,36,0.6)] active:scale-95">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative flex items-center gap-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                DOWNLOAD SOURCE CODE
              </span>
            </button>
          </a>
        );
    }
  };

  const getSecondaryDownloads = () => {
    const downloads = [];

    if (userOS !== 'windows') {
      downloads.push(
        <a key="windows" href="https://cdn.zytronium.dev/starscape_text_adventure/download/windows/starscape_text_adventure.exe" download>
          <button className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/20 hover:border-yellow-500/50 cursor-pointer rounded-lg text-sm transition-all duration-300 hover:shadow-[0_0_20px_rgba(251,191,36,0.3)]">
            Windows
          </button>
        </a>
      );
    }

    if (userOS !== 'linux') {
      downloads.push(
        <a key="linux" href="https://cdn.zytronium.dev/starscape_text_adventure/download/linux/starscape_text_adventure" download>
          <button className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/20 hover:border-yellow-500/50 cursor-pointer rounded-lg text-sm transition-all duration-300 hover:shadow-[0_0_20px_rgba(251,191,36,0.3)]">
            Linux
          </button>
        </a>
      );
    }

    if (userOS !== 'macos' && userOS !== 'other') {
      downloads.push(
        <a key="source" href="https://github.com/Zytronium/starscape_text_adventure/archive/refs/heads/master.zip" download>
          <button className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/20 hover:border-yellow-500/50 cursor-pointer rounded-lg text-sm transition-all duration-300 hover:shadow-[0_0_20px_rgba(251,191,36,0.3)]">
            Source Code
          </button>
        </a>
      );
    }

    return downloads;
  };

  return (
    <div className="relative min-h-screen bg-[#05050f] text-white overflow-hidden">
      {/* Animated star background */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full"
        style={{ zIndex: 0 }}
      />

      {/* Gradient overlays */}
      <div className="fixed inset-0 bg-gradient-to-b from-orange-900/10 via-transparent to-yellow-900/10 pointer-events-none" style={{ zIndex: 1 }} />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="container mx-auto px-6 py-8">
          <nav className="flex justify-between items-center">
            <div className={`transition-all duration-1000 ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
              <img
                src="/stratos.png"
                alt="Stratos"
                className="max-h-8 md:h-10 w-auto md:hidden drop-shadow-[0_0_20px_rgba(251,191,36,0.6)] hover:drop-shadow-[0_0_30px_rgba(251,191,36,0.8)] transition-all duration-300"
              />
              <img
                src="/logo.png"
                alt="Starscape"
                className="max-h-6 md:h-8 w-auto hidden md:block drop-shadow-[0_0_20px_rgba(251,191,36,0.6)] hover:drop-shadow-[0_0_30px_rgba(251,191,36,0.8)] transition-all duration-300"
              />
            </div>
            <div className={`flex gap-8 transition-all duration-1000 delay-200 ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
              <a href="#features" className="hover:text-yellow-400 transition-colors duration-300">Features</a>
              <a href="#about" className="hover:text-yellow-400 transition-colors duration-300">About</a>
              <a href="#download" className="hover:text-yellow-400 transition-colors duration-300">Download</a>
            </div>
          </nav>
        </header>

        {/* Hero Section */}
        <main className="container mx-auto px-6 py-20">
          <div className="max-w-5xl mx-auto text-center space-y-12">
            {/* Title */}
            <div className={`space-y-6 transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="flex justify-center">
                <img
                  src="/logo.png"
                  alt="Starscape Logo"
                  className="h-32 md:h-48 w-auto drop-shadow-[0_0_40px_rgba(251,191,36,0.6)] hover:drop-shadow-[0_0_60px_rgba(251,191,36,0.8)] transition-all duration-500"
                />
              </div>
              <h1 className="text-4xl md:text-5xl font-light tracking-widest text-gray-300">
                TEXT ADVENTURE
              </h1>

              <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed font-light">
                Embark on an epic adventure through the stars. Fight hostile drones
                and pirates, mine asteroids for resources, and explore deep space.
                Make this truly a Starscape!
              </p>
            </div>

            {/* Download Button */}
            <div id="download" className={`transition-all duration-1000 delay-500 ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
              {getPrimaryDownloadButton()}
              <p className="mt-4 text-sm text-gray-500">Version {version}</p>

              {/* Secondary download options */}
              {getSecondaryDownloads().length > 0 && (
                <div className="mt-6 space-y-3">
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Other Platforms</p>
                  <div className="flex gap-4 justify-center flex-wrap">
                    {getSecondaryDownloads()}
                  </div>
                </div>
              )}

              {/* MacOS/Source Code instructions */}
              {(userOS === 'macos' || userOS === 'other') && (
                <div className="mt-8 p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl max-w-2xl mx-auto text-left">
                  <h4 className="text-yellow-400 font-bold mb-3">Build Instructions</h4>
                  <ol className="space-y-2 text-sm text-gray-400">
                    <li>1. Download and extract the source code</li>
                    <li>2. Install Python (3.7 or higher)</li>
                    <li>3. Install PyInstaller: <code className="bg-black/50 px-2 py-1 rounded text-yellow-300">pip install pyinstaller</code></li>
                    <li>4. Run: <code className="bg-black/50 px-2 py-1 rounded text-yellow-300">pyinstaller installation.spec</code></li>
                    <li>5. Find the executable in the <code className="bg-black/50 px-2 py-1 rounded text-yellow-300">dist</code> folder</li>
                  </ol>
                </div>
              )}
            </div>

            {/* Features Grid */}
            <div id="features" className={`grid md:grid-cols-3 gap-8 pt-20 transition-all duration-1000 delay-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="group p-8 rounded-xl bg-gradient-to-b from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 hover:border-yellow-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(251,191,36,0.2)]">
                <h3 className="text-xl font-bold mb-3 text-yellow-400">Infinite Exploration</h3>
                <p className="text-gray-400 leading-relaxed">
                  With over 4,500 unique star systems, it would take weeks to explore it all! Some systems deep in wild space may even contain hidden secrets.
                </p>
              </div>

              <div className="group p-8 rounded-xl bg-gradient-to-b from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 hover:border-orange-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(251,146,60,0.2)]">
                <h3 className="text-xl font-bold mb-3 text-orange-400">Accurate Mechanics</h3>
                <p className="text-gray-400 leading-relaxed">
                  Most game mechanics are based on the original Starscape on Roblox, modified for a text adventure game. Players familiar with Starscape should feel at home.
                </p>
              </div>

              <div className="group p-8 rounded-xl bg-gradient-to-b from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 hover:border-red-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                <h3 className="text-xl font-bold mb-3 text-red-400">Immersive Gameplay</h3>
                <p className="text-gray-400 leading-relaxed">
                  The game includes immersive animations and ascii art displays make you feel immersed in the game like the real thing.
                </p>
              </div>
            </div>

            {/* Screenshots/Terminal Preview */}
            <div id="about" className={`pt-20 transition-all duration-1000 delay-900 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="relative max-w-4xl mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 blur-3xl" />
                <div className="relative bg-black/60 backdrop-blur-xl rounded-2xl border border-white/10 p-8 shadow-2xl">
                  <div className="flex gap-2 mb-6">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <div className="font-mono text-sm md:text-base space-y-3 text-left">
                    <p className="text-yellow-400">$ ./starscape_text_adventure</p>
                    <p className="text-gray-400">Initializing neural interface...</p>
                    <p className="text-gray-400">Loading galaxy data...</p>
                    <p className="text-gray-400">Fetching user save files...</p>
                    <p className="text-gray-400">Starting Starscape simulation...</p>
                    <div> </div>
                    <p className="text-green-400">✓ System ready</p>
                    <p className="text-white mt-4">
                      Welcome to Starscape, the gratest space adventure you can dream of!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="container mx-auto px-6 py-12 mt-32 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-gray-500 text-sm">
            <p>© 2026 Zytronium. All rights reserved.</p>
            <div className="flex gap-8">
              <a href="https://github.com/Zytronium/starscape_text_adventure" className="hover:text-yellow-400 transition-colors">GitHub</a>
              <a href="https://discord.gg/nMXxW5xVM4" className="hover:text-yellow-400 transition-colors">Discord</a>
              <a href="https://stt.gg/2BWGQPa9" className="hover:text-yellow-400 transition-colors">Stoat</a>
            </div>
          </div>
        </footer>
      </div>

      <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&display=swap');

          body {
              font-family: 'Share Tech Mono', monospace;
          }

          h1, h2, h3, button {
              font-family: 'Orbitron', sans-serif;
          }

          * {
              scroll-behavior: smooth;
          }
      `}</style>
    </div>
  );
}
