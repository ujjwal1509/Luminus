import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, animate, useMotionValue } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import EventCard from '../components/EventCard';
import Navbar from '../components/Navbar';
import { DOMAINS, EVENTS } from '../data/mockData';

// --- KEPT ORIGINAL ---
const CARD_W = 320;
const CARD_H = 400;
const CARD_W_MOBILE = 260;
const CARD_H_MOBILE = 400;
const RX = 300;
const RY = 70;
const RX_MOB = 200;
const RY_MOB = 30;
const GAP_SMALL = 0.55;

const getInitialAngle = (i, total) => {
    if (total <= 2) return i * GAP_SMALL;
    return (i / total) * Math.PI * 2;
};

const getRotationDelta = (steps, total) => {
    if (total <= 2) return -steps * GAP_SMALL;
    return -(steps / total) * Math.PI * 2;
};

function CarouselCard({ angleMv, isMobile, isActive, isAdjacent, onHover, children }) {
    const rx = isMobile ? RX_MOB : RX;
    const ry = isMobile ? RY_MOB : RY;
    const cardW = isMobile ? CARD_W_MOBILE : CARD_W;
    const cardH = isMobile ? CARD_H_MOBILE : CARD_H;

    const xMv = useMotionValue(0);
    const yMv = useMotionValue(0);
    const scaleMv = useMotionValue(1);
    const opacityMv = useMotionValue(1);
    const blurMv = useMotionValue(0);

    useEffect(() => {
        const sync = (angle) => {
            const sinA = Math.sin(angle);
            const cosA = Math.cos(angle);
            xMv.set(sinA * rx);
            yMv.set(-cosA * ry + ry);
            const depth = (cosA + 1) / 2;
            scaleMv.set(0.5 + 0.5 * depth);
            opacityMv.set(depth > 0.8 ? 1 : depth * 0.8);
            blurMv.set(depth > 0.8 ? 0 : (1 - depth) * 10);
        };
        sync(angleMv.get());
        return angleMv.on('change', sync);
    }, [angleMv, rx, ry, xMv, yMv, scaleMv, opacityMv, blurMv]);

    return (
        <motion.div
            style={{
                position: 'absolute',
                width: cardW, height: cardH,
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

export default function DomainPage() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const domain = DOMAINS.find(d => d.slug === slug);
    const domainEvents = EVENTS.filter(e => e.domainSlug === slug);
    const total = domainEvents.length;

    const [activeIdx, setActiveIdx] = useState(0);
    const [isMobile, setIsMobile] = useState(
        () => (typeof window !== 'undefined' ? window.innerWidth < 768 : false),
    );

    const activeIdxRef = useRef(0);
    const isAnimating = useRef(false);
    const hoverFired = useRef(false);
    const dragStartX = useRef(0);
    const isDragging = useRef(false);

    const anglesRef = useRef(
        domainEvents.map((_, i) => useMotionValue(getInitialAngle(i, total)))
    );

    useEffect(() => {
        window.scrollTo(0, 0);
        const onResize = () => {
            if (typeof window !== 'undefined') setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    const rotateTo = useCallback((targetIdx) => {
        if (!total || isAnimating.current) return;
        isAnimating.current = true;
        let steps = targetIdx - activeIdxRef.current;
        if (steps > total / 2) steps -= total;
        if (steps < -total / 2) steps += total;
        activeIdxRef.current = targetIdx;
        setActiveIdx(targetIdx);
        const delta = getRotationDelta(steps, total);
        anglesRef.current.forEach((mv) => {
            animate(mv, mv.get() + delta, {
                type: 'spring', stiffness: 120, damping: 20, mass: 1,
            });
        });
        setTimeout(() => { isAnimating.current = false; }, 700);
    }, [total]);

    const goNext = useCallback(() => rotateTo((activeIdxRef.current + 1) % total), [rotateTo, total]);
    const goPrev = useCallback(() => rotateTo((activeIdxRef.current - 1 + total) % total), [rotateTo, total]);

    useEffect(() => {
        const onKey = (e) => {
            if (e.key === 'ArrowRight') goNext();
            if (e.key === 'ArrowLeft') goPrev();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [goNext, goPrev]);

    const goBackToEvents = () => {
        sessionStorage.setItem('scrollTo', 'events');
        navigate('/');
    };

    const onPointerDown = (e) => {
        dragStartX.current = e.clientX;
        isDragging.current = false;
        try { e.currentTarget.setPointerCapture(e.pointerId); } catch (_) {}
    };
    const onPointerMove = (e) => {
        if (Math.abs(e.clientX - dragStartX.current) > 10) {
            isDragging.current = true;
        }
    };
    const onPointerUp = (e) => {
        if (!isDragging.current) return;
        isDragging.current = false;
        const delta = e.clientX - dragStartX.current;
        if (Math.abs(delta) > 50) delta < 0 ? goNext() : goPrev();
    };
    // Touch events for reliable mobile swipe
    const onTouchStart = (e) => {
        dragStartX.current = e.touches[0].clientX;
        isDragging.current = false;
    };
    const onTouchEnd = (e) => {
        const delta = e.changedTouches[0].clientX - dragStartX.current;
        if (Math.abs(delta) > 40) delta < 0 ? goNext() : goPrev();
    };

    if (!domain) {
        return (
            <div style={{ background: '#050508', minHeight: '100vh', color: 'white' }}>
                <Navbar activeSection="" />
                <main
                    className="section"
                    style={{
                        minHeight: 'calc(100vh - 80px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingTop: 96,
                    }}
                >
                    <div className="section-inner" style={{ textAlign: 'center' }}>
                        <p
                            style={{
                                fontFamily: 'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)',
                                fontSize: 11,
                                letterSpacing: '0.35em',
                                textTransform: 'uppercase',
                                color: 'rgba(156,163,175,0.9)',
                                marginBottom: 12,
                            }}
                        >
                            // Domain not found
                        </p>
                        <h1 className="text-h1" style={{ marginBottom: 16 }}>
                            Unknown sector.
                        </h1>
                        <p
                            style={{
                                maxWidth: 480,
                                margin: '0 auto 24px',
                                color: 'rgba(156,163,175,0.9)',
                                lineHeight: 1.7,
                            }}
                        >
                            This domain does not exist or has been retired. You can safely jump back to the
                            events grid.
                        </p>
                        <a
                            href="/"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '12px 24px',
                                borderRadius: 999,
                                border: '1px solid rgba(148,163,184,0.7)',
                                fontSize: 12,
                                letterSpacing: '0.2em',
                                textTransform: 'uppercase',
                                textDecoration: 'none',
                                color: 'white',
                            }}
                        >
                            Back to Home
                        </a>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div style={{
            background: '#050508',
            height: '100vh',
            color: 'white',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <Navbar activeSection="" />

            <div style={{
                display: 'flex',
                flex: 1,
                marginTop: 0,
                paddingTop: 80,
                overflow: 'hidden',
                position: 'relative',
                flexDirection: isMobile ? 'column' : 'row',
                boxSizing: 'border-box'
            }}>

                {/* --- Sidebar --- */}
                {!isMobile && (
                    <div style={{
                        width: '33%', flexShrink: 0,
                        borderRight: '1px solid rgba(255,255,255,0.05)',
                        display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center',
                        position: 'relative', zIndex: 10,
                        paddingLeft: 40,
                    }}>
                        <button
                            onClick={goBackToEvents}
                            style={{
                                position: 'absolute', top: 40, left: 40,
                                display: 'flex', alignItems: 'center', gap: 8,
                                color: 'white', border: '1px solid rgba(255,255,255,0.2)',
                                padding: '8px 16px', borderRadius: 100,
                                background: 'rgba(255,255,255,0.05)', cursor: 'pointer',
                                fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase',
                                fontWeight: 700,
                                transition: 'all 0.3s',
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                            }}
                        >
                            <ChevronLeft size={16} /> Back
                        </button>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40 }}
                        >
                            <div style={{
                                position: 'relative',
                                width: 300,
                                height: 300,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {/* Subtle Glow Background */}
                                <div style={{
                                    position: 'absolute', width: '130%', height: '130%',
                                    background: 'radial-gradient(circle, rgba(255,255,255,0.07) 0%, transparent 70%)',
                                    zIndex: -1
                                }} />

                                {typeof domain.icon === 'string' && (domain.icon.startsWith('/') || domain.icon.startsWith('http')) ? (
                                    <motion.img
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        src={domain.icon}
                                        alt={domain.name}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'contain',
                                            filter: 'drop-shadow(0 0 30px rgba(255,255,255,0.2))'
                                        }}
                                    />
                                ) : (
                                    <span style={{ fontSize: 180 }}>{domain.icon}</span>
                                )}
                            </div>

                            <div style={{ textAlign: 'center' }}>
                                <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 32, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase' }}>
                                    {domain.name}
                                </h2>
                                <p style={{ fontFamily: 'Space Mono, monospace', fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.4em', textTransform: 'uppercase', marginTop: 16 }}>
                                    {total} Data Points
                                </p>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* --- Main carousel --- */}
                <main
                    style={{
                        flex: 1,
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        userSelect: 'none',
                        touchAction: 'pan-y',
                    }}
                    onPointerDown={onPointerDown}
                    onPointerMove={onPointerMove}
                    onPointerUp={onPointerUp}
                    onTouchStart={onTouchStart}
                    onTouchEnd={onTouchEnd}
                >
                    {isMobile && (
                        <div style={{
                            position: 'absolute', top: 0, left: 0, right: 0, zIndex: 30,
                            display: 'flex', alignItems: 'center',
                            padding: '16px 20px',
                            gap: 16,
                        }}>
                            <button
                                onClick={goBackToEvents}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: 4,
                                    color: 'rgba(255,255,255,0.5)', background: 'none', border: 'none',
                                    fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase',
                                    cursor: 'pointer', flexShrink: 0, padding: 0,
                                }}
                            >
                                <ChevronLeft size={14} /> Back
                            </button>
                            <h1 style={{
                                fontFamily: 'Syne, sans-serif',
                                fontSize: 16,
                                fontWeight: 700,
                                letterSpacing: '0.25em',
                                textTransform: 'uppercase',
                                color: '#ffffff',
                                textShadow: '0 0 20px rgba(255,255,255,0.6)',
                                margin: 0,
                                flex: 1,
                                textAlign: 'center',
                                paddingRight: 48,
                            }}>
                                {domain.name}
                            </h1>
                        </div>
                    )}

                    {/* Spacer to push card below mobile header */}
                    {isMobile && <div style={{ height: 52, flexShrink: 0 }} />}

                    <div style={{ flex: 1, width: '100%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {total > 0 && !isMobile ? (
                            <div style={{ position: 'relative', width: 1, height: 1 }}>
                                {domainEvents.map((event, idx) => {
                                    const isActive = idx === activeIdx;
                                    const dist = Math.abs(Math.min(Math.abs(idx - activeIdx), total - Math.abs(idx - activeIdx)));
                                    return (
                                        <CarouselCard
                                            key={event.id}
                                            angleMv={anglesRef.current[idx]}
                                            isMobile={isMobile}
                                            isActive={isActive}
                                            isAdjacent={dist === 1}
                                            onHover={() => {
                                                if (isMobile || hoverFired.current || isAnimating.current || isActive || isDragging.current) return;
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
                        ) : total > 0 ? (
                            <div style={{ width: '100%', maxWidth: 420, padding: '0 20px' }}>
                                <EventCard event={domainEvents[activeIdx]} isActive />
                            </div>
                        ) : (
                            <div
                                style={{
                                    maxWidth: 420,
                                    width: '100%',
                                    padding: '24px 20px',
                                    borderRadius: 16,
                                    border: '1px solid rgba(255,255,255,0.12)',
                                    background: 'linear-gradient(160deg, rgba(15,23,42,0.9), rgba(15,23,42,0.98))',
                                    textAlign: 'center',
                                }}
                            >
                                <p
                                    style={{
                                        fontFamily: 'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)',
                                        fontSize: 11,
                                        letterSpacing: '0.3em',
                                        textTransform: 'uppercase',
                                        color: 'rgba(148,163,184,0.9)',
                                        marginBottom: 12,
                                    }}
                                >
                                    // No events published yet
                                </p>
                                <p style={{ fontSize: 14, lineHeight: 1.7, color: 'rgba(209,213,219,0.9)' }}>
                                    Events for this domain are still being configured. Check back
                                    soon, or explore another domain from the home page.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* --- Navigation Hub --- */}
                    {total > 0 && (
                        <div style={{
                            height: isMobile ? 64 : 112,
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            zIndex: 40,
                            paddingBottom: 16,
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 24, padding: '12px 24px' }}>
                                {domainEvents.map((_, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => rotateTo(idx)}
                                        style={{
                                            width: 24, height: 24, background: 'none', border: 'none',
                                            cursor: 'pointer', position: 'relative',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}
                                    >
                                        <div style={{
                                            borderRadius: '50%', transition: 'all 0.3s',
                                            width: idx === activeIdx ? 10 : 6,
                                            height: idx === activeIdx ? 10 : 6,
                                            background: idx === activeIdx ? 'white' : 'rgba(255,255,255,0.7)',
                                            boxShadow: idx === activeIdx ? '0 0 20px rgba(255,255,255,1)' : 'none'
                                        }} />
                                        {idx === activeIdx && (
                                            <motion.div
                                                layoutId="nav-glow"
                                                style={{
                                                    position: 'absolute',
                                                    inset: 0,
                                                    border: '1px solid rgba(255,255,255,0.3)',
                                                    borderRadius: '50%',
                                                }}
                                                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                            />
                                        )}
                                    </button>
                                ))}
                            </div>
                            <p style={{
                                marginTop: 8,
                                fontFamily: 'Space Mono, monospace',
                                fontSize: 8,
                                color: 'rgba(255,255,255,0.1)',
                                letterSpacing: '0.6em',
                                textTransform: 'uppercase',
                            }}>
                                Sector {activeIdx + 1} // {total}
                            </p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
