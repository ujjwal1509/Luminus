import { useRef, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

// ── Seeded hash ───────────────────────────────────────────────────────────────
const seededHash = (str, offset = 0) => {
    let h = offset * 2654435761;
    for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 2654435761);
    return (h >>> 0) / 0xffffffff;
};

// ── StarBanner ────────────────────────────────────────────────────────────────
function StarBanner({ title, isActive }) {
    const uid = 'sb' + Math.abs(
        title.split('').reduce((a, c) => Math.imul(a ^ c.charCodeAt(0), 2654435761), 0)
    ).toString(36);

    const stars = useMemo(() => Array.from({ length: 65 }, (_, i) => ({
        x: seededHash(title, i * 3 + 5) * 320,
        y: seededHash(title, i * 3 + 6) * 148,
        r: seededHash(title, i * 3 + 7) > 0.9 ? 1.8 : seededHash(title, i * 3 + 7) > 0.7 ? 0.9 : 0.45,
        o: 0.18 + seededHash(title, i * 3 + 8) * 0.72,
        hue: seededHash(title, i * 3 + 9),
    })), [title]);

    const words = title.split(' ');
    const lines = [];
    let current = '';
    for (const w of words) {
        if ((current + ' ' + w).trim().length > 13) {
            if (current) lines.push(current.trim());
            current = w;
        } else {
            current = (current + ' ' + w).trim();
        }
    }
    if (current) lines.push(current.trim());

    const totalH = 148;
    const lineH = 30;
    const startY = totalH / 2 - ((lines.length - 1) * lineH) / 2 + 8;
    const maxLen = Math.max(...lines.map(l => l.length));
    const baseFontSize = lines.length === 1 ? 28 : lines.length === 2 ? 24 : 20;
    const fontSizeByWidth = Math.floor(280 / (maxLen * 0.58));
    const fontSize = Math.min(baseFontSize, fontSizeByWidth);

    return (
        <svg width="100%" height="100%" viewBox="0 0 320 148" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
            <defs>
                <radialGradient id={`bg-${uid}`} cx="50%" cy="45%" r="75%">
                    <stop offset="0%" stopColor="#0d0f2a" />
                    <stop offset="55%" stopColor="#080a1c" />
                    <stop offset="100%" stopColor="#04050f" />
                </radialGradient>
                <radialGradient id={`nebula-${uid}`} cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#3b4bc8" stopOpacity="0.22" />
                    <stop offset="50%" stopColor="#6d28d9" stopOpacity="0.12" />
                    <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                </radialGradient>
                <radialGradient id={`nebula2-${uid}`} cx="70%" cy="30%" r="40%">
                    <stop offset="0%" stopColor="#1d4ed8" stopOpacity="0.14" />
                    <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                </radialGradient>
                <linearGradient id={`title-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#e0f2ff" />
                    <stop offset="35%" stopColor="#93c5fd" />
                    <stop offset="70%" stopColor="#818cf8" />
                    <stop offset="100%" stopColor="#a78bfa" />
                </linearGradient>
                <filter id={`tglow-${uid}`} x="-25%" y="-60%" width="150%" height="220%">
                    <feGaussianBlur stdDeviation="4" result="b" />
                    <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <filter id={`sglow-${uid}`}>
                    <feGaussianBlur stdDeviation="0.9" result="b" />
                    <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <linearGradient id={`shimmer-${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="transparent" />
                    <stop offset="50%" stopColor="#60a5fa" stopOpacity="0.95" />
                    <stop offset="100%" stopColor="transparent" />
                </linearGradient>
            </defs>

            <rect width="320" height="148" fill={`url(#bg-${uid})`} />
            <ellipse cx="155" cy="74" rx="140" ry="60" fill={`url(#nebula-${uid})`} />
            <ellipse cx="240" cy="45" rx="90" ry="40" fill={`url(#nebula2-${uid})`} />

            {stars.map((s, i) => {
                const color = s.hue > 0.85 ? '#93c5fd' : s.hue > 0.7 ? '#a5b4fc' : s.hue > 0.55 ? '#c4b5fd' : '#ffffff';
                return (
                    <circle key={i} cx={s.x} cy={s.y} r={s.r}
                        fill={color} opacity={s.o}
                        filter={s.r > 1.4 ? `url(#sglow-${uid})` : undefined}
                    />
                );
            })}

            <line x1="20" y1={startY - 22} x2="300" y2={startY - 22} stroke="#4f6ef7" strokeWidth="0.5" opacity="0.22" />
            <line x1="20" y1={startY + lines.length * lineH + 6} x2="300" y2={startY + lines.length * lineH + 6} stroke="#4f6ef7" strokeWidth="0.5" opacity="0.22" />
            <polygon points="14,74 19,68 24,74 19,80" fill="#60a5fa" opacity="0.4" />
            <polygon points="296,74 301,68 306,74 301,80" fill="#60a5fa" opacity="0.4" />

            {lines.map((line, i) => {
                const ls = line.length > 12 ? 0.5 : line.length > 9 ? 1 : 2;
                return (
                    <text key={i}
                        x="160" y={startY + i * lineH}
                        textAnchor="middle"
                        fontSize={fontSize}
                        fontFamily="'Orbitron', monospace"
                        fontWeight="900"
                        letterSpacing={ls}
                        fill={`url(#title-${uid})`}
                        filter={`url(#tglow-${uid})`}
                    >
                        {line.toUpperCase()}
                    </text>
                );
            })}

            {isActive && (
                <rect x="0" y="0" width="320" height="2.5" fill={`url(#shimmer-${uid})`} opacity="1" />
            )}
        </svg>
    );
}

// ── EventCard ─────────────────────────────────────────────────────────────────
export default function EventCard({ event, isActive, isDragging }) {
    const navigate = useNavigate();
    const cardRef = useRef(null);
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    const handleExplore = (e) => {
        e.preventDefault();
        e.stopPropagation();
        // Don't navigate if the user was swiping the carousel
        if (isDragging?.current) return;
        navigate(`/event/${event.slug}`);
    };

    const blockPropagation = (e) => e.stopPropagation();

    const handleMouseMove = (e) => {
        if (!isActive || !cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        setTilt({
            x: ((e.clientY - cy) / (rect.height / 2)) * 4,
            y: -((e.clientX - cx) / (rect.width / 2)) * 4,
        });
    };

    return (
        <div
            ref={cardRef}
            style={{ height: '100%', width: '100%', perspective: '1000px' }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => { setTilt({ x: 0, y: 0 }); setIsHovered(false); }}
        >
            <div style={{
                position: 'relative',
                borderRadius: 16,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                background: 'linear-gradient(170deg, #0d0f2a 0%, #080a1c 55%, #04050f 100%)',
                border: isActive ? '1px solid rgba(99,120,245,0.6)' : '1px solid rgba(99,120,245,0.12)',
                boxShadow: isActive
                    ? '0 0 30px rgba(79,110,247,0.28), 0 0 65px rgba(109,40,217,0.10), inset 0 1px 0 rgba(147,197,253,0.10)'
                    : '0 0 12px rgba(79,110,247,0.08), inset 0 1px 0 rgba(255,255,255,0.03)',
                transform: isActive ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` : 'none',
                transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out',
            }}>

                {/* Banner */}
                <div style={{ height: 148, position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
                    <StarBanner title={event.title} isActive={!!isActive} />
                </div>

                {/* Content */}
                <div style={{
                    padding: '10px 16px 14px',
                    display: 'flex', flexDirection: 'column', flexGrow: 1,
                    borderTop: '1px solid rgba(79,110,247,0.12)',
                    background: 'linear-gradient(180deg, #0d0f2a 0%, #080a1c 100%)',
                }}>

                    {/* Date badge */}
                    {event.timeline && (
                        <div style={{
                            alignSelf: 'flex-start', marginBottom: 12,
                            padding: '4px 13px', borderRadius: 6,
                            background: 'rgba(4,5,20,0.7)',
                            border: `1.5px solid ${event.day === 1 ? 'rgba(96,165,250,0.6)' : 'rgba(167,139,250,0.6)'}`,
                            color: event.day === 1 ? '#93c5fd' : '#c4b5fd',
                            fontSize: 10, fontWeight: 900, letterSpacing: '0.18em',
                            fontFamily: "'Orbitron', monospace",
                        }}>
                            {event.timeline}
                        </div>
                    )}

                    {/* Description */}
                    <p style={{
                        color: 'rgba(214,227,255,0.70)', fontSize: 12, lineHeight: 1.6,
                        marginBottom: 10, flexGrow: 1,
                        fontFamily: 'Georgia, serif',
                        display: '-webkit-box', WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical', overflow: 'hidden',
                    }}>
                        {event.description}
                    </p>

                    {/* Prize Pool + Entry Fee */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 10 }}>
                        {[
                            { label: 'Prize Pool', value: event.prizePool, icon: '🏆' },
                            { label: 'Entry Fee', value: event.entryFee, icon: '🎟️' },
                        ].map(({ label, value, icon }) => value ? (
                            <div key={label} style={{
                                padding: '8px 10px', borderRadius: 8,
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid rgba(99,120,245,0.16)',
                            }}>
                                <div style={{ fontSize: 9, letterSpacing: '0.18em', color: 'rgba(180,200,255,0.40)', fontFamily: "'Space Mono', monospace", marginBottom: 3 }}>
                                    {icon} {label}
                                </div>
                                <div style={{ fontSize: 12, fontWeight: 800, color: 'rgba(214,227,255,0.85)', fontFamily: "'Orbitron', monospace", letterSpacing: '0.05em' }}>
                                    {value}
                                </div>
                            </div>
                        ) : null)}
                    </div>

                    {/* Explore button */}
                    {isActive ? (
                        <button
                            onClick={handleExplore}
                            onPointerDown={blockPropagation}
                            onPointerUp={blockPropagation}
                            style={{
                                width: '100%', padding: '15px 0', borderRadius: 10,
                                background: 'linear-gradient(135deg, #1e1b4b 0%, #3730a3 35%, #4f46e5 65%, #6d28d9 100%)',
                                border: '1px solid rgba(147,197,253,0.30)',
                                color: '#e0f2ff', fontWeight: 900, fontSize: 13,
                                letterSpacing: '0.38em', textTransform: 'uppercase',
                                cursor: 'pointer', fontFamily: "'Orbitron', monospace",
                                boxShadow: isHovered ? '0 0 28px rgba(79,70,229,0.70), 0 0 60px rgba(109,40,217,0.28)' : '0 0 12px rgba(79,70,229,0.28)',
                                transition: 'box-shadow 0.25s, transform 0.15s',
                                transform: isHovered ? 'translateY(-1px)' : 'translateY(0)',
                            }}
                        >
                            EXPLORE →
                        </button>
                    ) : (
                        <div style={{
                            width: '100%', padding: '15px 0', textAlign: 'center',
                            borderRadius: 10, border: '1px solid rgba(255,255,255,0.05)',
                            color: 'rgba(255,255,255,0.08)', fontSize: 13, fontWeight: 700,
                            letterSpacing: '0.38em', textTransform: 'uppercase',
                            fontFamily: "'Orbitron', monospace",
                        }}>
                            EXPLORE →
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}