import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, animate, useMotionValue } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import EventCard from '../components/EventCard';
import Navbar from '../components/Navbar';
import { DOMAINS, EVENTS } from '../data/mockData';

// ── Responsive helpers ────────────────────────────────────────────────────────
const BP_MOBILE = 768;
const BP_TABLET = 1024;

function getLayout(width) {
    if (width < BP_MOBILE) return 'mobile';
    if (width < BP_TABLET) return 'tablet';
    return 'desktop';
}

const CARD_SIZES = {
    mobile:  { w: 240, h: 360 },
    tablet:  { w: 280, h: 420 },
    desktop: { w: 320, h: 480 },
};

const ELLIPSE = {
    mobile:  { rx: 160, ry: 24 },
    tablet:  { rx: 280, ry: 40 },
    desktop: { rx: 500, ry: 70 },
};

// ── CarouselCard ──────────────────────────────────────────────────────────────
function CarouselCard({ angleMv, layout, isActive, isAdjacent, onHover, children }) {
    const { rx, ry } = ELLIPSE[layout];
    const { w, h }   = CARD_SIZES[layout];

    const xMv       = useMotionValue(0);
    const yMv       = useMotionValue(0);
    const scaleMv   = useMotionValue(1);
    const opacityMv = useMotionValue(1);
    const blurMv    = useMotionValue(0);

    useEffect(() => {
        const sync = (angle) => {
            const sinA = Math.sin(angle);
            const cosA = Math.cos(angle);
            xMv.set(sinA * rx);
            yMv.set(-cosA * ry + ry);
            const depth = (cosA + 1) / 2;
            scaleMv.set(0.5 + 0.5 * depth);
            opacityMv.set(depth > 0.85 ? 1 : depth * 0.25);
            blurMv.set(depth > 0.85 ? 0 : (1 - depth) * 12);
        };
        sync(angleMv.get());
        const unsub = angleMv.on('change', sync);
        return unsub;
    }, [angleMv, rx, ry, xMv, yMv, scaleMv, opacityMv, blurMv]);

    return (
        <motion.div
            style={{
                position: 'absolute',
                width: w, height: h,
                x: xMv, y: yMv,
                scale: scaleMv, opacity: opacityMv,
                filter: blurMv ? `blur(${blurMv}px)` : undefined,
                translateX: '-50%', translateY: '-50%',
                zIndex: isActive ? 50 : isAdjacent ? 20 : 5,
                pointerEvents: isActive || isAdjacent ? 'auto' : 'none',
                cursor: isAdjacent ? 'pointer' : 'default',
            }}
            onMouseEnter={onHover}
        >
            {children}
        </motion.div>
    );
}

// ── DomainPage ────────────────────────────────────────────────────────────────
export default function DomainPage() {
    const { slug }     = useParams();
    const navigate     = useNavigate();
    const domain       = DOMAINS.find(d => d.slug === slug);
    const domainEvents = EVENTS.filter(e => e.domainSlug === slug);
    const total        = domainEvents.length;

    const [activeIdx, setActiveIdx] = useState(0);
    const [layout, setLayout]       = useState(() => getLayout(window.innerWidth));

    const activeIdxRef = useRef(0);
    const isAnimating  = useRef(false);
    const hoverFired   = useRef(false);
    const dragStartX   = useRef(0);
    const isDragging   = useRef(false);

    // Stable motion values — initialised once, never recreated
    const anglesRef = useRef(
        domainEvents.map((_, i) => useMotionValue((i / (total || 1)) * Math.PI * 2))
    );

    useEffect(() => {
        const onResize = () => setLayout(getLayout(window.innerWidth));
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    const rotateTo = useCallback((targetIdx) => {
        if (!total || isAnimating.current) return;
        isAnimating.current = true;
        let steps = targetIdx - activeIdxRef.current;
        if (steps >  total / 2) steps -= total;
        if (steps < -total / 2) steps += total;
        activeIdxRef.current = targetIdx;
        setActiveIdx(targetIdx);
        const deltaAngle = -(steps / total) * Math.PI * 2;
        anglesRef.current.forEach((mv) => {
            animate(mv, mv.get() + deltaAngle, {
                type: 'spring', stiffness: 160, damping: 26, mass: 1.1,
            });
        });
        setTimeout(() => { isAnimating.current = false; }, 750);
    }, [total]);

    const goNext = useCallback(() => rotateTo((activeIdxRef.current + 1) % total), [rotateTo, total]);
    const goPrev = useCallback(() => rotateTo((activeIdxRef.current - 1 + total) % total), [rotateTo, total]);

    useEffect(() => {
        const onKey = (e) => {
            if (e.key === 'ArrowRight') goNext();
            if (e.key === 'ArrowLeft')  goPrev();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [goNext, goPrev]);

    const onPointerDown = (e) => {
        isDragging.current = false;
        dragStartX.current = e.clientX;
        e.currentTarget.setPointerCapture(e.pointerId);
    };
    const onPointerMove = (e) => {
        if (Math.abs(e.clientX - dragStartX.current) > 10) isDragging.current = true;
    };
    const onPointerUp = (e) => {
        const delta = e.clientX - dragStartX.current;
        isDragging.current = false;
        if (Math.abs(delta) > 50) delta < 0 ? goNext() : goPrev();
    };

    const goBackToEvents = () => {
        navigate('/');
        setTimeout(() => {
            document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const isMobile = layout === 'mobile';
    const isTablet = layout === 'tablet';

    // ── Not found ─────────────────────────────────────────────────────────────
    if (!domain) {
        return (
            <div style={{
                background: '#04030A', minHeight: '100vh',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                color: 'white', textAlign: 'center', padding: '24px 16px',
            }}>
                <h1 style={{
                    fontFamily: 'Syne, sans-serif',
                    fontSize: 'clamp(28px, 6vw, 40px)',
                    marginBottom: 16,
                }}>
                    DOMAIN NOT FOUND
                </h1>
                <p style={{ color: '#9ca3af', marginBottom: 32 }}>
                    The domain you requested doesn't exist.
                </p>
                <button
                    onClick={goBackToEvents}
                    style={{
                        color: '#a78bfa', fontWeight: 700,
                        background: 'none', border: 'none',
                        cursor: 'pointer', fontSize: 16,
                    }}
                >
                    ← Return to Events
                </button>
            </div>
        );
    }

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <div style={{ background: '#04030A', minHeight: '100vh', color: 'white' }}>
            <Navbar activeSection="" />

            <div style={{
                display: 'flex',
                minHeight: 'calc(100vh - 80px)',
                marginTop: 80,
                overflow: 'hidden',
                position: 'relative',
                flexDirection: isMobile ? 'column' : 'row',
            }}>
                {/* Background glow */}
                <div style={{
                    position: 'absolute', inset: 0, pointerEvents: 'none',
                    background: 'radial-gradient(ellipse at center, rgba(76,29,149,0.12), transparent 70%)',
                }} />

                {/* ── Sidebar — tablet + desktop ── */}
                {!isMobile && (
                    <div style={{
                        width: isTablet ? '28%' : '25%',
                        flexShrink: 0,
                        borderRight: '1px solid rgba(255,255,255,0.05)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        zIndex: 10,
                        background: 'rgba(10,11,16,0.4)',
                        backdropFilter: 'blur(24px)',
                        padding: isTablet ? '20px 12px' : '20px 16px',
                    }}>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.8 }}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: isTablet ? 20 : 32,
                                width: '100%',
                            }}
                        >
                            {/* Icon bubble */}
                            <div style={{ position: 'relative' }}>
                                <div style={{
                                    position: 'absolute', inset: 0,
                                    background: 'rgba(168,85,247,0.15)',
                                    filter: 'blur(40px)', borderRadius: '50%',
                                }} />
                                <div style={{
                                    width: isTablet ? 88 : 128,
                                    height: isTablet ? 88 : 128,
                                    borderRadius: isTablet ? 28 : 40,
                                    background: 'linear-gradient(135deg, rgba(168,85,247,0.1), rgba(6,182,212,0.1))',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: isTablet ? 38 : 56,
                                    position: 'relative', zIndex: 1,
                                }}>
                                    {domain.icon}
                                </div>
                            </div>

                            {/* Domain name */}
                            <div style={{ textAlign: 'center' }}>
                                <h2 style={{
                                    fontFamily: 'Syne, sans-serif',
                                    fontSize: isTablet ? 15 : 22,
                                    fontWeight: 700,
                                    letterSpacing: isTablet ? '0.2em' : '0.3em',
                                    color: 'white',
                                    textTransform: 'uppercase',
                                    wordBreak: 'break-word',
                                    lineHeight: 1.3,
                                }}>
                                    {domain.name}
                                </h2>
                                <div style={{
                                    height: 2, width: 48,
                                    background: 'linear-gradient(to right, #7B5EFF, #00E5FF)',
                                    margin: '12px auto 0', borderRadius: 2,
                                }} />
                            </div>

                            {/* Back button */}
                            <button
                                onClick={goBackToEvents}
                                style={{
                                    background: 'none',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: 8,
                                    color: 'rgba(255,255,255,0.5)',
                                    padding: isTablet ? '6px 12px' : '8px 20px',
                                    cursor: 'pointer',
                                    fontSize: 10,
                                    letterSpacing: '0.15em',
                                    textTransform: 'uppercase',
                                    transition: 'all 0.2s',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                ← All Domains
                            </button>
                        </motion.div>

                        {/* Dot indicators */}
                        <div style={{
                            position: 'absolute', bottom: 32,
                            display: 'flex', gap: 8,
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            padding: '0 12px',
                            maxWidth: '100%',
                        }}>
                            {domainEvents.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => rotateTo(idx)}
                                    style={{
                                        height: 4, borderRadius: 2, border: 'none',
                                        cursor: 'pointer', transition: 'all 0.3s',
                                        width: idx === activeIdx ? 36 : 10,
                                        background: idx === activeIdx ? '#00E5FF' : 'rgba(255,255,255,0.1)',
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* ── Carousel stage ── */}
                <main
                    style={{
                        flex: 1,
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        userSelect: 'none',
                        touchAction: 'none',
                        minHeight: isMobile ? 'calc(100vh - 80px)' : undefined,
                    }}
                    onPointerDown={onPointerDown}
                    onPointerMove={onPointerMove}
                    onPointerUp={onPointerUp}
                    onPointerCancel={onPointerUp}
                >
                    {/* Mobile top bar */}
                    {isMobile && (
                        <div style={{
                            position: 'absolute', top: 0, left: 0, right: 0,
                            display: 'flex', flexDirection: 'column',
                            alignItems: 'center', paddingTop: 16,
                            zIndex: 30, pointerEvents: 'none',
                        }}>
                            <span style={{ fontSize: 26 }}>{domain.icon}</span>
                            <h2 style={{
                                fontFamily: 'Syne, sans-serif',
                                fontSize: 12, fontWeight: 700,
                                letterSpacing: '0.25em', color: 'white',
                                textTransform: 'uppercase', marginTop: 4,
                            }}>
                                {domain.name}
                            </h2>
                            <div style={{
                                display: 'flex', gap: 6, marginTop: 10,
                                pointerEvents: 'auto',
                                flexWrap: 'wrap',
                                justifyContent: 'center',
                                padding: '0 40px',
                            }}>
                                {domainEvents.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => rotateTo(idx)}
                                        style={{
                                            height: 5, borderRadius: 3, border: 'none',
                                            cursor: 'pointer', transition: 'all 0.3s',
                                            width: idx === activeIdx ? 24 : 8,
                                            background: idx === activeIdx ? '#00E5FF' : 'rgba(255,255,255,0.2)',
                                        }}
                                    />
                                ))}
                            </div>
                            <button
                                onClick={goBackToEvents}
                                style={{
                                    marginTop: 6, background: 'none', border: 'none',
                                    color: 'rgba(255,255,255,0.4)', fontSize: 9,
                                    letterSpacing: '0.15em', textTransform: 'uppercase',
                                    cursor: 'pointer', pointerEvents: 'auto',
                                }}
                            >
                                ← All Domains
                            </button>
                        </div>
                    )}

                    {/* Cards */}
                    {domainEvents.length > 0 && (
                        <div style={{ position: 'relative', width: 1, height: 1 }}>
                            {domainEvents.map((event, idx) => {
                                const dist = Math.min(
                                    Math.abs(idx - activeIdx),
                                    total - Math.abs(idx - activeIdx)
                                );
                                const isActive   = idx === activeIdx;
                                const isAdjacent = dist === 1;
                                return (
                                    <CarouselCard
                                        key={event.id}
                                        angleMv={anglesRef.current[idx]}
                                        layout={layout}
                                        isActive={isActive}
                                        isAdjacent={isAdjacent}
                                        onHover={() => {
                                            if (isMobile || hoverFired.current || isAnimating.current || isActive) return;
                                            hoverFired.current = true;
                                            rotateTo(idx);
                                            setTimeout(() => { hoverFired.current = false; }, 800);
                                        }}
                                    >
                                        <EventCard event={event} isActive={isActive} />
                                    </CarouselCard>
                                );
                            })}
                        </div>
                    )}

                    {/* Nav arrows */}
                    <button
                        onClick={goPrev}
                        aria-label="Previous event"
                        style={{
                            position: 'absolute', left: isMobile ? 6 : 24,
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '50%',
                            width: isMobile ? 34 : 44, height: isMobile ? 34 : 44,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', color: 'white', zIndex: 40,
                            flexShrink: 0,
                        }}
                    >
                        <ChevronLeft size={isMobile ? 15 : 20} />
                    </button>
                    <button
                        onClick={goNext}
                        aria-label="Next event"
                        style={{
                            position: 'absolute', right: isMobile ? 6 : 24,
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '50%',
                            width: isMobile ? 34 : 44, height: isMobile ? 34 : 44,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', color: 'white', zIndex: 40,
                            flexShrink: 0,
                        }}
                    >
                        <ChevronRight size={isMobile ? 15 : 20} />
                    </button>

                    {/* Hint */}
                    <div style={{
                        position: 'absolute', bottom: isMobile ? 10 : 20,
                        left: 0, right: 0,
                        display: 'flex', justifyContent: 'center',
                        alignItems: 'center', gap: 12,
                        color: 'rgba(255,255,255,0.1)',
                        fontSize: 8, letterSpacing: '0.4em',
                        textTransform: 'uppercase',
                        pointerEvents: 'none', zIndex: 30,
                    }}>
                        <motion.span animate={{ x: [-3, 3, -3] }} transition={{ repeat: Infinity, duration: 2 }}>
                            <ChevronLeft size={10} />
                        </motion.span>
                        {isMobile ? 'SWIPE OR TAP ARROWS' : 'SWIPE · ARROWS · HOVER'}
                        <motion.span animate={{ x: [3, -3, 3] }} transition={{ repeat: Infinity, duration: 2 }}>
                            <ChevronRight size={10} />
                        </motion.span>
                    </div>
                </main>
            </div>
        </div>
    );
}
