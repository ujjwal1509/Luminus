import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import ParticleCanvas from './components/ParticleCanvas';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Domains from './components/Domains';
import Register from './components/Register';
import DomainPage from './pages/DomainPage';
import EventPage from './pages/EventPage';
import luminusLogo from './assets/luminus_logo.png';

// ── Home layout ───────────────────────────────────────────────────────────────
function HomePage() {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const revealObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.reveal').forEach((el) => {
              el.classList.add('visible');
            });
          }
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll('section:not(#home)').forEach((s) => revealObs.observe(s));
    return () => revealObs.disconnect();
  }, []);

  useEffect(() => {
    const ids = ['home', 'about', 'events', 'register'];
    const activeObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActiveSection(e.target.id); });
      },
      { threshold: 0.45 }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) activeObs.observe(el);
    });
    return () => activeObs.disconnect();
  }, []);

  useEffect(() => {
    const glow = document.querySelector('.cursor-glow');
    if (!glow) return;
    let raf, tx = window.innerWidth / 2, ty = window.innerHeight / 2;
    let cx = tx, cy = ty;
    const onMove = (e) => { tx = e.clientX; ty = e.clientY; };
    const tick = () => {
      cx += (tx - cx) * 0.09;
      cy += (ty - cy) * 0.09;
      glow.style.left = cx + 'px';
      glow.style.top = cy + 'px';
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    tick();
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf); };
  }, []);

  return (
    <>
      <div className="grain-overlay" aria-hidden="true" />
      <div className="cursor-glow" aria-hidden="true" />
      <ParticleCanvas logoSrc={luminusLogo} />
      <Navbar activeSection={activeSection} />
      <main>
        <Hero />
        <About />
        <Domains />
        <Register />
      </main>
    </>
  );
}

// ── App — routes ──────────────────────────────────────────────────────────────
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/domain/:slug" element={<DomainPage />} />
      <Route path="/event/:slug" element={<EventPage />} />
    </Routes>
  );
}