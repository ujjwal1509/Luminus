import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function EventCard({ event, isActive }) {
    const navigate = useNavigate();
    const cardRef = useRef(null);
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    const handleExplore = (e) => {
        e.preventDefault();
        e.stopPropagation();
        navigate(`/event/${event.slug}`);
    };

    const blockPropagation = (e) => e.stopPropagation();

    const handleMouseMove = (e) => {
        if (!isActive || !cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        setTilt({
            x: ((e.clientY - cy) / (rect.height / 2)) * 6,
            y: -((e.clientX - cx) / (rect.width / 2)) * 6,
        });
    };

    const handleMouseLeave = () => {
        setTilt({ x: 0, y: 0 });
        setIsHovered(false);
    };

    return (
        <div
            ref={cardRef}
            style={{ height: '100%', width: '100%', perspective: '1000px', transformStyle: 'preserve-3d' }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
        >
            <div
                style={{
                    position: 'relative',
                    borderRadius: 20,
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    background: '#0f1018',
                    border: isActive ? '2px solid rgba(168,85,247,0.7)' : '1px solid rgba(255,255,255,0.05)',
                    boxShadow: isActive ? '0 0 30px rgba(168,85,247,0.2), 0 0 60px rgba(168,85,247,0.08)' : 'none',
                    transform: isActive ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` : 'none',
                    transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.4s ease-out',
                    transformStyle: 'preserve-3d',
                }}
            >
                {/* Image */}
                <div style={{ position: 'relative', overflow: 'hidden', height: 200, flexShrink: 0 }}>
                    <img
                        src={event.image || 'https://picsum.photos/seed/placeholder/800/600'}
                        alt={event.title}
                        style={{
                            width: '100%', height: '100%', objectFit: 'cover',
                            transform: isActive && isHovered ? 'scale(1.08)' : 'scale(1)',
                            transition: 'transform 0.7s ease',
                        }}
                        referrerPolicy="no-referrer"
                        onError={(e) => { e.target.src = 'https://picsum.photos/seed/placeholder/800/600'; }}
                    />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #0f1018, transparent, transparent)', opacity: 0.6 }} />

                    {/* Badges */}
                    <div style={{ position: 'absolute', top: 12, left: 12 }}>
                        <span style={{ padding: '4px 10px', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', borderRadius: 6, fontSize: 9, fontWeight: 900, letterSpacing: '0.2em', color: '#c4b5fd', textTransform: 'uppercase', border: '1px solid rgba(168,85,247,0.3)' }}>
                            {event.department}
                        </span>
                    </div>
                    {event.duration && (
                        <div style={{ position: 'absolute', top: 12, right: 12 }}>
                            <span style={{ padding: '4px 10px', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', borderRadius: 6, fontSize: 9, fontWeight: 900, letterSpacing: '0.2em', color: '#67e8f9', textTransform: 'uppercase', border: '1px solid rgba(6,182,212,0.3)' }}>
                                {event.duration}
                            </span>
                        </div>
                    )}
                    {isActive && (
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(to right, transparent, rgba(196,181,253,0.8), transparent)' }} />
                    )}
                </div>

                {/* Content */}
                <div style={{ padding: 20, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                    <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: 18, fontWeight: 700, color: 'white', marginBottom: 6, lineHeight: 1.3 }}>
                        {event.title}
                    </h3>
                    <p style={{ color: '#6b7280', fontSize: 12, lineHeight: 1.6, marginBottom: 16, flexGrow: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {event.description}
                    </p>

                    {event.timeline && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
                            <svg style={{ width: 12, height: 12, color: 'rgba(167,139,250,0.6)', flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span style={{ fontSize: 10, color: '#4b5563', letterSpacing: '0.05em' }}>{event.timeline}</span>
                        </div>
                    )}

                    {isActive ? (
                        <button
                            onClick={handleExplore}
                            onPointerDown={blockPropagation}
                            onPointerUp={blockPropagation}
                            style={{
                                width: '100%', padding: '12px 20px', borderRadius: 12, border: 'none', cursor: 'pointer',
                                background: 'linear-gradient(135deg, rgba(139,92,246,0.9), rgba(59,130,246,0.9))',
                                color: 'white', fontWeight: 900, fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase',
                                boxShadow: isHovered ? '0 0 25px rgba(139,92,246,0.5)' : '0 0 10px rgba(139,92,246,0.2)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                transition: 'box-shadow 0.3s ease',
                            }}
                        >
                            Explore
                            <svg xmlns="http://www.w3.org/2000/svg" style={{ width: 14, height: 14 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </button>
                    ) : (
                        <div style={{ width: '100%', padding: '12px 20px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.15)', fontWeight: 900, fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', textAlign: 'center' }}>
                            Explore
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}