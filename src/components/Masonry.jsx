/**
 * Masonry.jsx
 *
 * • 3 columns, each offset downward in a staircase step pattern
 * • Each column scrolls upward continuously — once a card exits the top
 *   it seamlessly reappears at the bottom (two-strip clone technique)
 * • Pure CSS animation on transform only → GPU composited, zero JS per frame
 * • GSAP kept only for the one-time fade-in intro (what it's good at)
 * • ResizeObserver for fluid responsive width — no layout thrashing
 * • will-change only on the two moving strips per column, not every card
 */

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import "./Masonry.css";

// ── Config ────────────────────────────────────────────────────────────────────
const COLS_DESKTOP   = 3;
const COLS_MOBILE    = 2;          // 2 columns on phones (< 640px)
const MOBILE_BP      = 640;        // breakpoint in px
const GAP            = 12;         // px gap between columns
const SCROLL_SPEED   = 40;         // px / second upward scroll speed
// Each column is offset downward by this multiplier × its index
// creating the staircase / step look
const STEP_OFFSET_VH = 8;          // 8 vh per column step

// ── useContainerWidth ─────────────────────────────────────────────────────────
function useContainerWidth(ref) {
    const [w, setW] = useState(0);
    useLayoutEffect(() => {
        if (!ref.current) return;
        const ro = new ResizeObserver(([entry]) => setW(entry.contentRect.width));
        ro.observe(ref.current);
        return () => ro.disconnect();
    }, []);
    return w;
}

// ── ScrollColumn ──────────────────────────────────────────────────────────────
// Renders two stacked strips; CSS animates both at the same rate.
// Strip B starts exactly one strip-height below strip A so when A exits
// the top, B is already filling the view — perfectly seamless.
function ScrollColumn({ items, colWidth, stepOffset, introDelay }) {
    const stripRef  = useRef(null);
    const colRef    = useRef(null);
    const [height, setHeight] = useState(0);

    // Measure one strip's natural height after first paint
    useLayoutEffect(() => {
        if (!stripRef.current) return;
        const ro = new ResizeObserver(([entry]) => {
            setHeight(entry.contentRect.height);
        });
        ro.observe(stripRef.current);
        return () => ro.disconnect();
    }, [items]);

    // duration = distance ÷ speed
    const duration = height > 0 ? height / SCROLL_SPEED : 0;

    // One-time fade-in intro via GSAP (doesn't conflict — only runs once,
    // targets colRef directly, and opacity is separate from transform)
    useEffect(() => {
        if (!colRef.current) return;
        gsap.fromTo(
            colRef.current,
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, duration: 0.7, delay: introDelay, ease: "power2.out" }
        );
    }, [introDelay]);

    return (
        <div
            ref={colRef}
            className="msn-col"
            style={{
                width: colWidth,
                // Step offset — each column starts lower than the previous
                paddingTop: stepOffset,
                opacity: 0, // GSAP will fade this in
            }}
        >
            {/*
             * Two identical strips stacked vertically inside a scrolling track.
             * The CSS @keyframes scroll-up translates the track by -50%
             * (which equals exactly one strip height since there are 2 strips).
             * This gives a perfect seamless loop with no JavaScript per frame.
             */}
            <div
                className="msn-track"
                style={
                    duration > 0
                        ? { animationDuration: `${duration}s` }
                        : { animation: "none" }
                }
            >
                {/* Strip A */}
                <div ref={stripRef} className="msn-strip">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="item-wrapper"
                            style={{ height: item.height ?? 200 }}
                            onClick={() => item.onClick?.()}
                        >
                            <div className="item-img">{item.render}</div>
                        </div>
                    ))}
                </div>

                {/* Strip B — exact clone, sits directly below A */}
                <div className="msn-strip" aria-hidden="true">
                    {items.map((item) => (
                        <div
                            key={`clone-${item.id}`}
                            className="item-wrapper"
                            style={{ height: item.height ?? 200 }}
                        >
                            <div className="item-img">{item.render}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ── Masonry ───────────────────────────────────────────────────────────────────
export default function Masonry({
    items = [],
    scrollSpeed,   // ignored — use SCROLL_SPEED constant above
    animateFrom,   // kept for API compat
    stagger = 0.12,
}) {
    const wrapRef = useRef(null);
    const totalW  = useContainerWidth(wrapRef);

    // Derive column count reactively from measured container width —
    // safer than matchMedia alone since the component may be in a narrow
    // container even on a wide screen.
    const cols = totalW > 0 && totalW < MOBILE_BP ? COLS_MOBILE : COLS_DESKTOP;

    // Distribute items into columns round-robin
    const columns = Array.from({ length: cols }, (_, ci) =>
        items.filter((_, i) => i % cols === ci)
    );

    const colWidth = totalW > 0
        ? (totalW - GAP * (cols - 1)) / cols
        : 0;

    // Responsive step offset: scales with viewport height
    const stepOffsets = Array.from({ length: cols }, (_, i) => {
        const vh = typeof window !== "undefined" ? window.innerHeight : 800;
        return i * (vh * STEP_OFFSET_VH / 100);
    });

    return (
        <div ref={wrapRef} className="msn-wrapper">
            {colWidth > 0 && columns.map((colItems, ci) => (
                <ScrollColumn
                    key={`col-${cols}-${ci}`}
                    items={colItems}
                    colWidth={colWidth}
                    stepOffset={stepOffsets[ci]}
                    introDelay={ci * stagger}
                />
            ))}
        </div>
    );
}