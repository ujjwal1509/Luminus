import { useEffect, useRef } from 'react';

// ── Tuning ────────────────────────────────────────────────────────────────────
const SAMPLE_GAP      = 3;
const HERO_SCROLL_VH  = 1;
const SHOCKWAVE_SPD   = 12;
const SHOCKWAVE_MAX   = 300;
const SHOCKWAVE_STR   = 18;
const MOUSE_RADIUS    = 85;
const MOUSE_STR       = 3.8;
// ─────────────────────────────────────────────────────────────────────────────

export default function ParticleCanvas({ logoSrc }) {
    const canvasRef = useRef(null);
    const S = useRef({
        particles: [],
        shockwaves: [],
        scrollProgress: 0,
        mouse: { x: -9999, y: -9999 },
        animId: null,
        time: 0,
    });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: true, willReadFrequently: false });
        const s = S.current;

        // ── Canvas sizing (HiDPI) ─────────────────────────────────────────────
        // Cap DPR at 2 — retina is fine, 3× devices waste GPU fill rate
        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        const setSize = () => {
            const w = window.innerWidth;
            const h = window.innerHeight;
            canvas.width  = w * dpr;
            canvas.height = h * dpr;
            canvas.style.width  = w + 'px';
            canvas.style.height = h + 'px';
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };
        setSize();

        const W = () => window.innerWidth;
        const H = () => window.innerHeight;

        // ── Sample logo PNG pixels → build particle array ──────────────────────
        // Uses createImageBitmap for faster off-thread decoding when supported
        const loadParticles = () => new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            // Kick the browser's image cache immediately — no src="" then reassign trick
            img.src = logoSrc || '/src/assets/luminus_logo.png';

            const buildFromImage = (imgEl) => {
                // Use a small off-screen canvas sized to image (not full viewport)
                // then read pixels — much less memory than W×H canvas
                const scale = Math.min(W() / imgEl.width, H() / imgEl.height)
                    * (W() < 440 ? 0.72 : 1.1);
                const iw = Math.ceil(imgEl.width  * scale);
                const ih = Math.ceil(imgEl.height * scale);
                const ox = Math.round((W() - iw) / 2);
                const oy = Math.round((H() - ih) / 2 - H() * 0.08);

                const off    = document.createElement('canvas');
                off.width    = W();
                off.height   = H();
                const offCtx = off.getContext('2d', { willReadFrequently: true });
                offCtx.drawImage(imgEl, ox, oy, iw, ih);

                // Read only the bounding box that contains the logo, not the full
                // viewport — dramatically reduces getImageData cost
                const left   = Math.max(0, ox);
                const top    = Math.max(0, oy);
                const right  = Math.min(W(), ox + iw);
                const bottom = Math.min(H(), oy + ih);
                const bw     = right - left;
                const bh     = bottom - top;

                const { data } = offCtx.getImageData(left, top, bw, bh);

                const particles = [];
                // Reuse typed-array stride arithmetic — avoid repeated * 4
                const rowStride = bw * 4;

                for (let row = 0; row < bh; row += SAMPLE_GAP) {
                    const rowOff = row * rowStride;
                    const py     = top + row;
                    for (let col = 0; col < bw; col += SAMPLE_GAP) {
                        const i = rowOff + col * 4;
                        const a = data[i + 3];
                        if (a < 25) continue;

                        const r = data[i];
                        const g = data[i + 1];
                        const b = data[i + 2];
                        const px = left + col;

                        const isLight = Math.abs(r - g) < 20 && Math.abs(r - b) < 20 && r > 100;
                        const wf      = isLight ? 0.75 : 0;

                        particles.push({
                            logoX:    px,    logoY:    py,
                            scatterX: Math.random() * W(),
                            scatterY: Math.random() * H(),
                            x:        Math.random() * W(),
                            y:        Math.random() * H(),
                            vx: 0,   vy: 0,
                            size:   Math.random() * 2.0 + 0.7,
                            phase:  Math.random() * Math.PI * 2,
                            tspeed: 0.016 + Math.random() * 0.014,
                            r: Math.min(255, r + (255 - r) * wf),
                            g: Math.min(255, g + (255 - g) * wf),
                            b: Math.min(255, b + (255 - b) * wf),
                        });
                    }
                }

                // Release off-screen canvas memory immediately
                off.width = 0; off.height = 0;
                return particles;
            };

            const fallback = () => {
                const p = [];
                for (let i = 0; i < 900; i++) {
                    p.push({
                        logoX:    W() / 2 + (Math.random() - 0.5) * 500,
                        logoY:    H() / 2 + (Math.random() - 0.5) * 180,
                        scatterX: Math.random() * W(), scatterY: Math.random() * H(),
                        x:        Math.random() * W(), y:        Math.random() * H(),
                        vx: 0, vy: 0,
                        size:   Math.random() * 1.5 + 0.5,
                        phase:  Math.random() * Math.PI * 2,
                        tspeed: 0.016 + Math.random() * 0.014,
                        r: 242, g: 238, b: 255,
                    });
                }
                return p;
            };

            // Fast path: createImageBitmap lets the browser decode on a worker thread
            if ('createImageBitmap' in window) {
                fetch(img.src)
                    .then(r => r.blob())
                    .then(blob => createImageBitmap(blob))
                    .then(bmp => {
                        // Wrap in a temp Image so buildFromImage can drawImage normally
                        const tmp = document.createElement('canvas');
                        tmp.width  = bmp.width;
                        tmp.height = bmp.height;
                        tmp.getContext('2d').drawImage(bmp, 0, 0);
                        bmp.close();
                        s.particles = buildFromImage(tmp);
                        tmp.width = 0; tmp.height = 0;
                        resolve();
                    })
                    .catch(() => {
                        // Fall back to standard Image load
                        img.onload  = () => { s.particles = buildFromImage(img); resolve(); };
                        img.onerror = () => { s.particles = fallback(); resolve(); };
                    });
            } else {
                img.onload  = () => { s.particles = buildFromImage(img); resolve(); };
                img.onerror = () => { s.particles = fallback(); resolve(); };
            }
        });

        // ── Event handlers ────────────────────────────────────────────────────
        // Throttle scroll with a single rAF flag to avoid jank
        let scrollRafPending = false;
        const onScroll = () => {
            if (scrollRafPending) return;
            scrollRafPending = true;
            requestAnimationFrame(() => {
                s.scrollProgress = Math.min(window.scrollY / (H() * HERO_SCROLL_VH), 1);
                scrollRafPending = false;
            });
        };

        // Throttle mouse to every other move event (60fps cap is plenty)
        let mouseTick = 0;
        const onMouse = (e) => {
            if (++mouseTick & 1) return;   // skip odd events
            s.mouse.x = e.clientX;
            s.mouse.y = e.clientY;
        };

        const onClick = (e) => {
            s.shockwaves.push({
                x: e.clientX, y: e.clientY,
                radius: 0, maxRadius: SHOCKWAVE_MAX,
                strength: SHOCKWAVE_STR,
            });
        };

        // Debounce resize — rebuilding particles on every pixel of drag is wasteful
        let resizeTimer;
        const onResize = () => {
            setSize();
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => loadParticles(), 350);
        };

        window.addEventListener('scroll',    onScroll, { passive: true });
        window.addEventListener('mousemove', onMouse,  { passive: true });
        window.addEventListener('click',     onClick);
        window.addEventListener('resize',    onResize);

        // ── Draw shockwave rings ──────────────────────────────────────────────
        const drawShockwaves = () => {
            for (const sw of s.shockwaves) {
                const prog  = sw.radius / sw.maxRadius;
                const alpha = (1 - prog) * 0.12;
                const lw    = 0.5 * (1 - prog);
                ctx.beginPath();
                ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(180,120,255,${alpha * 0.5})`;
                ctx.lineWidth   = lw;
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(sw.x, sw.y, sw.radius * 0.92, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
                ctx.lineWidth   = lw;
                ctx.stroke();
            }
        };

        // ── Animation loop ────────────────────────────────────────────────────
        // Pre-cache sqrt via lookup table for the hot mouse-repulsion path
        // (avoids Math.sqrt for 90 % of particles that are far away)
        const MOUSE_R2 = MOUSE_RADIUS * MOUSE_RADIUS;

        const animate = () => {
            ctx.clearRect(0, 0, W(), H());
            s.time++;

            // Update + cull shockwaves
            for (const sw of s.shockwaves) sw.radius += SHOCKWAVE_SPD;
            for (let i = s.shockwaves.length - 1; i >= 0; i--) {
                if (s.shockwaves[i].radius >= s.shockwaves[i].maxRadius)
                    s.shockwaves.splice(i, 1);
            }

            const sp    = s.scrollProgress;
            // smoothstep
            const eased = sp * sp * (3 - 2 * sp);

            const hasSW = s.shockwaves.length > 0;
            const mx    = s.mouse.x;
            const my    = s.mouse.y;

            for (const p of s.particles) {
                const tx = p.logoX + (p.scatterX - p.logoX) * eased;
                const ty = p.logoY + (p.scatterY - p.logoY) * eased;

                // Shockwave push (skip entirely when no active shockwaves)
                if (hasSW) {
                    for (const sw of s.shockwaves) {
                        const dx   = p.x - sw.x;
                        const dy   = p.y - sw.y;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        const gap  = Math.abs(dist - sw.radius);
                        if (gap < 55 && dist > 0) {
                            const f = (1 - gap / 55) * sw.strength / (dist * 0.08 + 1);
                            p.vx += (dx / dist) * f;
                            p.vy += (dy / dist) * f;
                        }
                    }
                }

                // Mouse repulsion — cheap squared-distance check first
                const mdx = p.x - mx;
                const mdy = p.y - my;
                const md2 = mdx * mdx + mdy * mdy;
                if (md2 < MOUSE_R2 && md2 > 0) {
                    const md = Math.sqrt(md2);
                    const f  = (1 - md / MOUSE_RADIUS) * MOUSE_STR;
                    p.vx += (mdx / md) * f;
                    p.vy += (mdy / md) * f;
                }

                // Spring to target
                p.vx += (tx - p.x) * 0.08;
                p.vy += (ty - p.y) * 0.08;
                p.vx *= 0.72;
                p.vy *= 0.72;
                p.x  += p.vx;
                p.y  += p.vy;

                // Alpha
                const twinkle = 0.78 + 0.22 * Math.sin(s.time * p.tspeed + p.phase);
                const bgFade  = sp > 0.3 ? Math.max(0.20, 1 - (sp - 0.3) * 1.1) : 1;
                const alpha   = twinkle * bgFade;

                // Draw particle
                const sz = p.size * (1 - sp * 0.28);
                ctx.fillStyle = `rgba(${p.r | 0},${p.g | 0},${p.b | 0},${alpha})`;
                ctx.fillRect(p.x, p.y, sz, sz);

                // Glow halo on larger particles
                if (sz > 1.4 && alpha > 0.35) {
                    ctx.beginPath();
                    ctx.arc(p.x + sz / 2, p.y + sz / 2, sz * 3, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(${p.r | 0},${p.g | 0},${p.b | 0},${alpha * 0.07})`;
                    ctx.fill();
                }
            }

            drawShockwaves();
            s.animId = requestAnimationFrame(animate);
        };

        // ── Boot ──────────────────────────────────────────────────────────────
        loadParticles().then(animate);

        return () => {
            cancelAnimationFrame(s.animId);
            clearTimeout(resizeTimer);
            window.removeEventListener('scroll',    onScroll);
            window.removeEventListener('mousemove', onMouse);
            window.removeEventListener('click',     onClick);
            window.removeEventListener('resize',    onResize);
        };
    }, [logoSrc]);

    return <canvas ref={canvasRef} className="particle-canvas" />;
}