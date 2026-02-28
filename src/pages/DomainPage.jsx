import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, animate, useMotionValue } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import EventCard from '../components/EventCard';
import Navbar from '../components/Navbar';
import { DOMAINS, EVENTS } from '../data/mockData';

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
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    const activeIdxRef = useRef(0);
    const isAnimating = useRef(false);
    const hoverFired = useRef(false);
    const dragStartX = useRef(0);

    const anglesRef = useRef(
        domainEvents.map((_, i) => useMotionValue(getInitialAngle(i, total)))
    );

    useEffect(() => {
        const onResize = () => setIsMobile(window.innerWidth < 768);
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
        navigate('/');
        setTimeout(() => {
            document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const onPointerDown = (e) => {
        dragStartX.current = e.clientX;
        e.currentTarget.setPointerCapture(e.pointerId);
    };
    const onPointerUp = (e) => {
        const delta = e.clientX - dragStartX.current;
        if (Math.abs(delta) > 50) delta < 0 ? goNext() : goPrev();
    };

    if (!domain) return null;

    return (
        <div style={{ background: '#050508', minHeight: '100vh', color: 'white' }}>
            <Navbar activeSection="" />

            <div style={{
                display: 'flex',
                minHeight: 'calc(100vh - 80px)',
                marginTop: 80,
                overflow: 'hidden',
                position: 'relative',
                flexDirection: isMobile ? 'column' : 'row',
            }}>

                {/* ── Sidebar — desktop ── */}
                {!isMobile && (
                    <div style={{
                        width: '33%', flexShrink: 0,
                        borderRight: '1px solid rgba(255,255,255,0.05)',
                        display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center',
                        position: 'relative', zIndex: 10,
                        paddingLeft: 40,
                    }}>
                        {/* Back button — top left of sidebar */}
                        <button
                            onClick={goBackToEvents}
                            style={{
                                position: 'absolute', top: 40, left: 40,
                                display: 'flex', alignItems: 'center', gap: 8,
                                color: 'white',
                                border: '1px solid rgba(255,255,255,0.2)',
                                padding: '8px 16px',
                                borderRadius: 100,
                                background: 'rgba(255,255,255,0.05)',
                                cursor: 'pointer',
                                fontSize: 10,
                                letterSpacing: '0.3em',
                                textTransform: 'uppercase',
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
                            <ChevronLeft size={16} />
                            Back
                        </button>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}
                        >
                            <span style={{ fontSize: 80 }}>{domain.icon}</span>
                            <div style={{ textAlign: 'center' }}>
                                <h2 style={{
                                    fontFamily: 'Syne, sans-serif',
                                    fontSize: 28, fontWeight: 700,
                                    letterSpacing: '0.3em',
                                    color: 'white', textTransform: 'uppercase',
                                }}>
                                    {domain.name}
                                </h2>
                                <p style={{
                                    fontFamily: 'Space Mono, monospace',
                                    fontSize: 11, color: 'rgba(255,255,255,0.3)',
                                    letterSpacing: '0.4em', textTransform: 'uppercase',
                                    marginTop: 16,
                                }}>
                                    {total} Data Points
                                </p>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* ── Main carousel ── */}
                <main
                    style={{
                        flex: 1, position: 'relative',
                        display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center',
                        paddingTop: isMobile ? 0 : 40,
                        overflow: 'hidden',
                        userSelect: 'none', touchAction: 'none',
                        minHeight: isMobile ? 'calc(100vh - 80px)' : undefined,
                    }}
                    onPointerDown={onPointerDown}
                    onPointerUp={onPointerUp}
                >
                    {/* Mobile top bar */}
                    {isMobile && (
                        <div style={{
                            position: 'absolute', top: 0, left: 0, right: 0,
                            zIndex: 30, pointerEvents: 'none',
                        }}>
                            {/* Back — top left */}
                            <button
                                onClick={goBackToEvents}
                                style={{
                                    position: 'absolute', top: 16, left: 16,
                                    display: 'flex', alignItems: 'center', gap: 6,
                                    color: 'rgba(255,255,255,0.5)',
                                    background: 'none', border: 'none',
                                    cursor: 'pointer', fontSize: 10,
                                    letterSpacing: '0.3em', textTransform: 'uppercase',
                                    fontWeight: 500, pointerEvents: 'auto',
                                    transition: 'color 0.2s',
                                }}
                            >
                                <ChevronLeft size={16} />
                                Back
                            </button>

                            {/* Domain name — centered */}
                            <div style={{
                                display: 'flex', justifyContent: 'center',
                                paddingTop: 16, paddingBottom: 12,
                                paddingLeft: 64, paddingRight: 64,
                            }}>
                                <h1 style={{
                                    fontFamily: 'Syne, sans-serif',
                                    fontSize: 18, fontWeight: 700,
                                    letterSpacing: '0.25em',
                                    color: 'white', textTransform: 'uppercase',
                                    textShadow: '0 0 20px rgba(255,255,255,0.3)',
                                }}>
                                    {domain.name}
                                </h1>
                            </div>
                        </div>
                    )}

                    {/* Cards */}
                    <div style={{ flex: 1, width: '100%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
                    </div>

                    {/* Navigation Hub — dots + sector label */}
                    <div style={{
                        height: 112, width: '100%',
                        display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'flex-end',
                        zIndex: 40, paddingBottom: 16,
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 24, padding: '12px 24px' }}>
                            {domainEvents.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => rotateTo(idx)}
                                    style={{
                                        position: 'relative',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        width: 24, height: 24,
                                        background: 'none', border: 'none', cursor: 'pointer',
                                    }}
                                >
                                    <div style={{
                                        borderRadius: '50%',
                                        transition: 'all 0.3s',
                                        width: idx === activeIdx ? 10 : 6,
                                        height: idx === activeIdx ? 10 : 6,
                                        background: idx === activeIdx ? 'white' : 'rgba(255,255,255,0.7)',
                                        boxShadow: idx === activeIdx ? '0 0 20px rgba(255,255,255,1)' : 'none',
                                    }} />
                                    {idx === activeIdx && (
                                        <motion.div
                                            layoutId="nav-glow"
                                            style={{
                                                position: 'absolute', inset: 0,
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
                            fontSize: 8, color: 'rgba(255,255,255,0.1)',
                            letterSpacing: '0.6em', textTransform: 'uppercase',
                        }}>
                            Sector {activeIdx + 1} // {total}
                        </p>
                    </div>
                </main>
            </div>
        </div>
    );
}