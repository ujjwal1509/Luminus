import { useEffect, useRef } from 'react';

export default function Hero() {
    const sectionRef = useRef(null);

    // Hero is always visible on load — trigger reveals immediately
    useEffect(() => {
        const t = setTimeout(() => {
            sectionRef.current?.querySelectorAll('.reveal').forEach((el) => {
                el.classList.add('visible');
            });
        }, 150);
        return () => clearTimeout(t);
    }, []);

    return (
        <section className="hero" id="home" ref={sectionRef}>



            {/*
        Spacer creates vertical room for the particle logo.
        Canvas is fixed at z-index 2; this content is z-index 5.
        The logo particles appear to "live" in this space.
      */}
            <div className="hero-spacer" aria-hidden="true" />
            <div style={{ height: 'clamp(160px, 24vw, 280px)' }} aria-hidden="true" />

            {/* Subtitle */}


            {/* Date pill */}
            <div className="hero-date reveal reveal-delay-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                    strokeLinejoin="round" aria-hidden="true">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                April 8th-9th, 2026
            </div>

            {/* CTA */}
            <a
                href="#about"
                className="glass-btn reveal reveal-delay-3"
                onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
                }}
            >
                Explore &nbsp;→
            </a>

            {/* Scroll nudge */}
            <div className="hero-scroll-indicator" aria-hidden="true">
                <span>Scroll</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                </svg>
            </div>

        </section>
    );
}