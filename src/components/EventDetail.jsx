import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, X, Shield } from 'lucide-react';

const useStarfield = (seed) =>
    useMemo(() => {
        const hash = (s, i) => {
            let h = i * 2654435761;
            for (let j = 0; j < s.length; j++) h = Math.imul(h ^ s.charCodeAt(j), 2654435761);
            return (h >>> 0) / 0xffffffff;
        };
        return Array.from({ length: 90 }, (_, i) => ({
            w: hash(seed, i * 4 + 0) * 2 + 0.5,
            top: hash(seed, i * 4 + 1) * 100,
            left: hash(seed, i * 4 + 2) * 100,
            opacity: hash(seed, i * 4 + 3) * 0.6 + 0.1,
            dur: hash(seed, i * 4 + 0) * 3 + 2,
            delay: hash(seed, i * 4 + 1) * 5,
        }));
    }, [seed]);

const asteroidConfigs = [
    { size: 7, top: '8%', left: '12%', duration: 18, delay: 0, orbitW: 55, orbitH: 28 },
    { size: 4, top: '18%', left: '78%', duration: 22, delay: -4, orbitW: 38, orbitH: 18 },
    { size: 9, top: '32%', left: '5%', duration: 26, delay: -9, orbitW: 60, orbitH: 30 },
    { size: 5, top: '42%', left: '88%', duration: 20, delay: -6, orbitW: 44, orbitH: 22 },
    { size: 3, top: '55%', left: '15%', duration: 15, delay: -3, orbitW: 30, orbitH: 15 },
    { size: 6, top: '65%', left: '82%', duration: 30, delay: -12, orbitW: 50, orbitH: 25 },
    { size: 4, top: '78%', left: '25%', duration: 19, delay: -7, orbitW: 35, orbitH: 17 },
    { size: 8, top: '85%', left: '70%', duration: 24, delay: -2, orbitW: 48, orbitH: 24 },
    { size: 3, top: '22%', left: '50%', duration: 17, delay: -10, orbitW: 28, orbitH: 14 },
    { size: 5, top: '70%', left: '48%', duration: 23, delay: -5, orbitW: 42, orbitH: 20 },
    { size: 6, top: '48%', left: '62%', duration: 28, delay: -15, orbitW: 52, orbitH: 26 },
    { size: 4, top: '90%', left: '10%', duration: 21, delay: -8, orbitW: 36, orbitH: 18 },
];

export default function EventDetail({ event }) {
    const navigate = useNavigate();
    const [rulesOpen, setRulesOpen] = useState(false);
    const stars = useStarfield(event.slug);

    const C1 = '#8b5cf6';
    const C2 = '#6d28d9';
    const BG = '#05070d';
    const TEXT_PRIMARY = '#e6f0ff';
    const TEXT_SECONDARY = '#b4c6ff';

    const infoItems = [
        { label: 'Timeline', value: event.timeline || 'TBA' },
        { label: 'Prize Pool', value: event.prizePool || 'Confidential' },
        { label: 'Team Size', value: event.teamSize || 'Solo / Team' },
        { label: 'Entry Fee', value: event.entryFee || 'Free' },
    ];

    // Navigate back to the specific domain page this event belongs to
    const handleBack = () => {
        if (event.domainSlug) {
            navigate(`/domain/${event.domainSlug}`);
        } else {
            navigate(-1);
        }
    };

    return (
        <>
            <style>{`
        @keyframes planetSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes planetRevolution {
          0%   { transform: rotate(0deg)   translateX(160px) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(160px) rotate(-360deg); }
        }
        @keyframes planetPulse {
          0%, 100% { box-shadow: 0 0 35px rgba(184,115,51,0.6), 0 0 70px rgba(140,80,20,0.3); }
          50%       { box-shadow: 0 0 65px rgba(210,140,60,0.95), 0 0 130px rgba(180,100,30,0.55); }
        }
        @keyframes ringRotate {
          from { transform: translateX(-50%) translateY(-50%) rotateX(75deg) rotateZ(0deg); }
          to   { transform: translateX(-50%) translateY(-50%) rotateX(75deg) rotateZ(360deg); }
        }
        @keyframes ringRotateRev {
          from { transform: translateX(-50%) translateY(-50%) rotateX(75deg) rotateZ(0deg); }
          to   { transform: translateX(-50%) translateY(-50%) rotateX(75deg) rotateZ(-360deg); }
        }
        @keyframes planetFloat {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-14px); }
        }
        @keyframes asteroidOrbit {
          0%   { transform: translate(0px, 0px) rotate(0deg); }
          25%  { transform: translate(var(--ow), calc(var(--oh) * 0.5)) rotate(90deg); }
          50%  { transform: translate(0px, var(--oh)) rotate(180deg); }
          75%  { transform: translate(calc(var(--ow) * -1), calc(var(--oh) * 0.5)) rotate(270deg); }
          100% { transform: translate(0px, 0px) rotate(360deg); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; }
          50%       { opacity: 0.9; }
        }
        @keyframes modalSlideUp {
          from { opacity: 0; transform: translateY(40px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes backdropFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>

            {/* Background */}
            <div style={{ position: 'fixed', inset: 0, background: BG, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}>
                {stars.map((s, i) => (
                    <div key={i} style={{
                        position: 'absolute',
                        width: s.w, height: s.w,
                        background: 'white', borderRadius: '50%',
                        top: `${s.top}%`, left: `${s.left}%`,
                        opacity: s.opacity,
                        animation: `twinkle ${s.dur}s ease-in-out infinite`,
                        animationDelay: `${s.delay}s`,
                    }} />
                ))}

                {/* Planet */}
                <div style={{ position: 'absolute', top: '52%', right: '18%', width: 0, height: 0, zIndex: 2 }}>
                    <div style={{ position: 'absolute', top: '50%', left: '50%', width: 0, height: 0, animation: 'planetRevolution 14s linear infinite', transformOrigin: '0 0', zIndex: 4 }}>
                        <div style={{
                            position: 'absolute', top: -60, left: -60, width: 120, height: 120, borderRadius: '50%',
                            background: 'radial-gradient(circle at 32% 28%, #f5cfa0 0%, #d4854a 25%, #b35a1f 50%, #7a3410 72%, #3d1505 100%)',
                            animation: 'planetSpin 9s linear infinite, planetPulse 4s ease-in-out infinite',
                            boxShadow: '0 0 35px rgba(184,115,51,0.6), 0 0 70px rgba(140,80,20,0.3)',
                        }}>
                            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'repeating-linear-gradient(160deg, transparent 0%, rgba(255,200,100,0.08) 8%, transparent 16%)' }} />
                            <div style={{ position: 'absolute', top: '50%', left: '50%', width: 192, height: 192, border: '2px solid rgba(255,255,255,0.75)', borderRadius: '50%', animation: 'ringRotate 6s linear infinite' }} />
                            <div style={{ position: 'absolute', top: '50%', left: '50%', width: 232, height: 232, border: '1px solid rgba(255,255,255,0.4)', borderRadius: '50%', animation: 'ringRotateRev 11s linear infinite' }} />
                        </div>
                    </div>
                </div>

                {/* Small blue planet */}
                <div style={{
                    position: 'absolute', top: '12%', left: '7%', width: 55, height: 55, borderRadius: '50%',
                    background: 'radial-gradient(circle at 38% 30%, #93c5fd, #4f46e5 45%, #1e1b6e 80%)',
                    animation: 'planetFloat 16s ease-in-out infinite', animationDelay: '-4s',
                    boxShadow: '0 0 22px rgba(79,70,229,0.55), 0 0 50px rgba(59,130,246,0.2)', zIndex: 1,
                }} />

                {asteroidConfigs.map((cfg, i) => (
                    <div key={i} style={{
                        position: 'absolute', top: cfg.top, left: cfg.left,
                        width: cfg.size, height: cfg.size,
                        background: 'rgba(255,255,255,0.75)',
                        borderRadius: i % 3 === 0 ? '40%' : i % 3 === 1 ? '20%' : '50%',
                        '--ow': `${cfg.orbitW}px`, '--oh': `${cfg.orbitH}px`,
                        animation: `asteroidOrbit ${cfg.duration}s linear infinite`,
                        animationDelay: `${cfg.delay}s`, zIndex: 1,
                        boxShadow: `0 0 ${cfg.size + 3}px rgba(255,255,255,0.7), 0 0 ${cfg.size * 2}px rgba(255,255,255,0.3)`,
                    }} />
                ))}
            </div>

            {/* Rules Modal */}
            {rulesOpen && (
                <div onClick={() => setRulesOpen(false)} style={{
                    position: 'fixed', inset: 0, zIndex: 100,
                    background: 'rgba(4,5,15,0.85)', backdropFilter: 'blur(8px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '20px', animation: 'backdropFadeIn 0.25s ease',
                }}>
                    <div onClick={e => e.stopPropagation()} style={{
                        background: 'linear-gradient(160deg, #0d0a1f 0%, #080613 100%)',
                        border: '1px solid rgba(139,92,246,0.4)', borderRadius: 18,
                        padding: '36px', maxWidth: 580, width: '100%',
                        maxHeight: '80vh', overflowY: 'auto',
                        boxShadow: '0 0 60px rgba(109,40,217,0.3), 0 0 120px rgba(109,40,217,0.1)',
                        animation: 'modalSlideUp 0.3s ease', position: 'relative',
                    }}>
                        <button onClick={() => setRulesOpen(false)} style={{
                            position: 'absolute', top: 16, right: 16,
                            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)',
                            borderRadius: '50%', width: 32, height: 32,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', color: TEXT_PRIMARY, transition: 'all 0.2s',
                        }}
                            onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; }}
                            onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                        >
                            <X size={14} />
                        </button>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                            <div style={{
                                width: 36, height: 36, borderRadius: 8,
                                background: 'linear-gradient(135deg, rgba(139,92,246,0.3), rgba(109,40,217,0.3))',
                                border: '1px solid rgba(139,92,246,0.5)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <Shield size={16} color={C1} />
                            </div>
                            <div>
                                <div style={{ fontSize: 9, letterSpacing: '0.35em', color: C1, fontWeight: 700, marginBottom: 2 }}>MISSION PROTOCOL</div>
                                <div style={{ fontSize: 18, fontWeight: 800, color: TEXT_PRIMARY, letterSpacing: '0.05em' }}>{event.title} — Rules</div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {(event.rules && event.rules.length > 0)
                                ? event.rules.map((rule, i) => (
                                    <div key={i} style={{
                                        display: 'flex', gap: 14, alignItems: 'flex-start',
                                        padding: '12px 16px',
                                        background: 'rgba(255,255,255,0.03)',
                                        border: '1px solid rgba(255,255,255,0.07)',
                                        borderRadius: 10,
                                    }}>
                                        <span style={{
                                            flexShrink: 0, width: 22, height: 22, borderRadius: 6,
                                            background: 'linear-gradient(135deg, rgba(139,92,246,0.25), rgba(109,40,217,0.25))',
                                            border: '1px solid rgba(139,92,246,0.4)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: 9, fontWeight: 900, color: C1, letterSpacing: '0.05em',
                                        }}>
                                            {String(i + 1).padStart(2, '0')}
                                        </span>
                                        <span style={{ color: TEXT_SECONDARY, fontSize: 13, lineHeight: 1.7 }}>{rule}</span>
                                    </div>
                                ))
                                : <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>Rules will be announced on-site.</div>
                            }
                        </div>

                        <button onClick={() => setRulesOpen(false)} style={{
                            marginTop: 24, width: '100%', padding: '13px',
                            background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.35)',
                            borderRadius: 10, color: C1, fontSize: 11, fontWeight: 800,
                            letterSpacing: '0.25em', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.2s',
                        }}
                            onMouseOver={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.22)'; }}
                            onMouseOut={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.12)'; }}
                        >
                            CLOSE PROTOCOL
                        </button>
                    </div>
                </div>
            )}

            {/* Page content */}
            <div style={{ position: 'relative', zIndex: 10, minHeight: '100vh', padding: '40px 20px', maxWidth: 800, margin: '0 auto', fontFamily: 'monospace' }}>

                {/* Back */}
                <div style={{ marginBottom: 32 }}>
                    <button onClick={handleBack} style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(255,255,255,0.3)',
                        padding: '10px 20px', borderRadius: 100,
                        color: TEXT_PRIMARY, fontSize: 11, fontWeight: 700,
                        letterSpacing: '0.2em', textTransform: 'uppercase',
                        cursor: 'pointer', transition: 'all 0.3s ease',
                    }}
                        onMouseOver={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.18)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.7)'; }}
                        onMouseOut={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; }}
                    >
                        <ChevronLeft size={14} /> BACK
                    </button>
                </div>

                {/* Main card */}
                <div style={{
                    background: 'rgba(13,8,30,0.12)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: 16, padding: '40px',
                    backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
                }}>
                    {/* Header */}
                    <div style={{ marginBottom: 24 }}>
                        {event.tier === 'flagship' && (
                            <div style={{
                                display: 'inline-flex', alignItems: 'center', gap: 7, marginBottom: 12,
                                padding: '5px 14px', borderRadius: 6,
                                background: 'linear-gradient(135deg, rgba(234,179,8,0.18), rgba(251,146,60,0.14))',
                                border: '1px solid rgba(234,179,8,0.55)',
                                boxShadow: '0 0 18px rgba(234,179,8,0.2)',
                            }}>
                                <span style={{ fontSize: 13 }}>⭐</span>
                                <span style={{
                                    fontSize: 10, fontWeight: 900, letterSpacing: '0.35em', textTransform: 'uppercase',
                                    background: 'linear-gradient(90deg, #fde68a, #fb923c)',
                                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                                }}>
                                    Flagship Event
                                </span>
                            </div>
                        )}
                        <h1 style={{
                            fontSize: 'clamp(40px, 7vw, 72px)', fontWeight: 900, color: '#ffffff',
                            margin: '8px 0 20px', lineHeight: 1.05, textAlign: 'center',
                            textTransform: 'uppercase', letterSpacing: '0.01em',
                            fontFamily: 'system-ui, -apple-system, sans-serif',
                        }}>
                            {event.title}
                        </h1>
                        <p style={{
                            color: 'rgba(180,198,255,0.75)', marginTop: 0, marginBottom: 8,
                            lineHeight: 1.7, fontSize: 16, fontStyle: 'italic', textAlign: 'center',
                            fontFamily: 'Georgia, serif',
                            borderLeft: '3px solid rgba(139,92,246,0.5)',
                            borderRight: '3px solid rgba(139,92,246,0.5)',
                            padding: '10px 24px',
                        }}>
                            "{event.description}"
                        </p>
                    </div>

                    {/* Info grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 32 }}>
                        {infoItems.map(({ label, value }) => (
                            <div key={label} style={{
                                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)',
                                borderRadius: 10, padding: '16px', transition: 'all 0.3s ease', cursor: 'default',
                            }}
                                onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; }}
                                onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; }}
                            >
                                <div style={{ fontSize: 9, letterSpacing: '0.2em', color: TEXT_SECONDARY, marginBottom: 6 }}>{label}</div>
                                <div style={{ fontSize: 14, fontWeight: 700, color: TEXT_PRIMARY }}>{value}</div>
                            </div>
                        ))}
                    </div>

                    {/* Mission Brief */}
                    <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '24px', marginBottom: 16 }}>
                        <div style={{ fontSize: 10, letterSpacing: '0.3em', color: C1, marginBottom: 12, fontWeight: 700 }}>MISSION BRIEF</div>
                        <p style={{ color: TEXT_SECONDARY, lineHeight: 1.8, fontSize: 14, margin: 0, whiteSpace: 'pre-line' }}>
                            {event.longDescription || event.description}
                        </p>
                    </div>

                    {/* Tracks */}
                    {event.tracks && event.tracks.length > 0 && (
                        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(139,92,246,0.25)', borderRadius: 12, padding: '24px', marginBottom: 16 }}>
                            <div style={{ fontSize: 10, letterSpacing: '0.3em', color: C1, marginBottom: 14, fontWeight: 700 }}>TRACKS</div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                {event.tracks.map((track, i) => (
                                    <div key={i} style={{
                                        padding: '6px 14px', borderRadius: 20,
                                        background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.35)',
                                        color: '#c4b5fd', fontSize: 12, fontWeight: 700, letterSpacing: '0.05em',
                                    }}>
                                        {track}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Action buttons */}
                    <div style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
                        <button onClick={() => setRulesOpen(true)} style={{
                            flex: 1, padding: '15px',
                            background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.45)',
                            borderRadius: 10, color: C1, fontSize: 12, fontWeight: 800,
                            letterSpacing: '0.2em', textTransform: 'uppercase',
                            cursor: 'pointer', transition: 'all 0.25s ease',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        }}
                            onMouseOver={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.18)'; e.currentTarget.style.boxShadow = '0 0 20px rgba(139,92,246,0.3)'; }}
                            onMouseOut={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.08)'; e.currentTarget.style.boxShadow = 'none'; }}
                        >
                            <Shield size={14} /> VIEW RULES
                        </button>
                        <button style={{
                            flex: 2, padding: '15px',
                            background: `linear-gradient(135deg, ${C1}, ${C2})`,
                            border: 'none', borderRadius: 10,
                            color: TEXT_PRIMARY, fontSize: 13, fontWeight: 800,
                            letterSpacing: '0.2em', textTransform: 'uppercase',
                            cursor: 'pointer', transition: 'all 0.3s ease',
                            boxShadow: '0 0 30px rgba(139,92,246,0.4)',
                        }}
                            onMouseOver={e => { e.currentTarget.style.boxShadow = '0 0 50px rgba(139,92,246,0.7)'; }}
                            onMouseOut={e => { e.currentTarget.style.boxShadow = '0 0 30px rgba(139,92,246,0.4)'; }}
                        >
                            INITIATE REGISTRATION
                        </button>
                    </div>

                    {/* Coordinators */}
                    {event.coordinators && event.coordinators.length > 0 && (
                        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 24 }}>
                            <div style={{ fontSize: 9, letterSpacing: '0.3em', color: 'rgba(255,255,255,0.25)', marginBottom: 14, fontWeight: 700, textTransform: 'uppercase' }}>
                                Student Coordinators
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                                {event.coordinators.map((c, i) => (
                                    <a key={i} href={`tel:${c.phone}`} style={{
                                        display: 'flex', alignItems: 'center', gap: 10,
                                        padding: '10px 16px',
                                        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.09)',
                                        borderRadius: 10, textDecoration: 'none',
                                        transition: 'all 0.2s ease', flex: '1 1 180px',
                                    }}
                                        onMouseOver={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.1)'; e.currentTarget.style.borderColor = 'rgba(139,92,246,0.35)'; }}
                                        onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)'; }}
                                    >
                                        <div style={{
                                            width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                                            background: 'linear-gradient(135deg, rgba(139,92,246,0.35), rgba(59,130,246,0.35))',
                                            border: '1px solid rgba(139,92,246,0.4)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: 12, fontWeight: 900, color: '#c4b5fd',
                                        }}>
                                            {c.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div style={{ fontSize: 12, fontWeight: 700, color: TEXT_PRIMARY, letterSpacing: '0.02em' }}>{c.name}</div>
                                            <div style={{ fontSize: 11, color: 'rgba(180,198,255,0.55)', marginTop: 1, letterSpacing: '0.03em' }}>{c.phone}</div>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
