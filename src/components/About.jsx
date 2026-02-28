import Lanyard from './Lanyard';

const HACKATHON_TRACKS = [
    {
        id: 'aiml',
        label: 'Track 1',
        name: 'AI/ML',
        description: 'Tackle real-world challenges using Machine Learning, Deep Learning, and Generative AI. Build models that see, speak, and reason.',
        accent: 'var(--accent-aurora)',
        accentRgb: '139,92,246',
        tags: ['Machine Learning', 'Deep Learning', 'GenAI'],
    },
    {
        id: 'cse',
        label: 'Track 2',
        name: 'CSE',
        description: 'Engineer scalable systems, web platforms, and developer tools. From full-stack apps to low-level optimizations — this is where code meets craft.',
        accent: 'var(--accent-plasma)',
        accentRgb: '59,130,246',
        tags: ['Full-Stack', 'Systems', 'DevTools'],
    },
    {
        id: 'ise',
        label: 'Track 3',
        name: 'ISE',
        description: 'Solve information security, data engineering, and network intelligence problems. Protect, analyze, and optimize the digital backbone.',
        accent: 'var(--accent-nova)',
        accentRgb: '6,182,212',
        tags: ['Cybersecurity', 'Data Eng', 'Networks'],
    },
];

export default function About() {
    return (
        <section className="section section--alt" id="about">
            <div className="section-inner">

                <span className="section-label reveal">// 01 — ABOUT</span>

                {/* Two-column: text left, lanyard right */}
                <div className="about-content">

                    <div className="about-text">
                        <h2 className="text-h1 reveal reveal-delay-1">
                            Built by Curiosity.
                        </h2>
                        <h2
                            className="text-h1 gradient-text-warm reveal reveal-delay-2"
                            style={{ marginBottom: 'var(--space-md)' }}
                        >
                            Driven by Innovation.
                        </h2>
                        <p className="reveal reveal-delay-3" style={{ color: 'var(--text-secondary)', lineHeight: 1.75, marginBottom: 'var(--space-sm)' }}>
                            LUMINUS is more than a tech fest — it's a convergence of the brightest
                            minds, boldest ideas, and most disruptive technologies. For three days,
                            our campus transforms into a launchpad for innovation.
                        </p>
                        <p className="reveal reveal-delay-4" style={{ color: 'var(--text-secondary)', lineHeight: 1.75 }}>
                            From cutting-edge AI workshops to high-stakes hackathons, every event
                            is designed to push boundaries, forge connections, and ignite the spark
                            that turns students into pioneers.
                        </p>
                    </div>

                    {/* Lanyard in right column — replaces 3D model placeholder */}
                    <div className="lanyard-container reveal reveal-delay-3">
                        <Lanyard />
                    </div>

                </div>

                {/* ── Grand Hackathon ─────────────────────────────────────── */}
                <div className="grand-hackathon reveal reveal-delay-2" style={{ marginTop: 'var(--space-xl, 80px)' }}>

                    {/* Section header */}
                    <div style={{ textAlign: 'center', marginBottom: 48 }}>
                        <span className="section-label" style={{ display: 'block', marginBottom: 16 }}>// FLAGSHIP EVENT</span>
                        <h2 className="text-h1" style={{ marginBottom: 8 }}>
                            Grand{' '}
                            <span className="gradient-text">Hackathon</span>
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: 15, maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>
                            24 hours. Three tracks. One winner. Choose your battleground and build something legendary.
                        </p>
                    </div>

                    {/* Track cards */}
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 24,
                        justifyContent: 'center',
                        alignItems: 'stretch',
                    }}>
                        {HACKATHON_TRACKS.map((track, i) => (
                            <div
                                key={track.id}
                                className={`reveal reveal-delay-${i + 2}`}
                                style={{
                                    flex: '1 1 280px',
                                    maxWidth: 340,
                                    minWidth: 260,
                                    position: 'relative',
                                    borderRadius: 20,
                                    background: 'rgba(8,6,20,0.85)',
                                    border: `1px solid rgba(${track.accentRgb},0.25)`,
                                    backdropFilter: 'blur(16px)',
                                    overflow: 'hidden',
                                    padding: '32px 28px 28px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 16,
                                    transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
                                    cursor: 'default',
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.transform = 'translateY(-8px)';
                                    e.currentTarget.style.boxShadow = `0 20px 48px rgba(${track.accentRgb},0.18)`;
                                    e.currentTarget.style.borderColor = `rgba(${track.accentRgb},0.55)`;
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'none';
                                    e.currentTarget.style.borderColor = `rgba(${track.accentRgb},0.25)`;
                                }}
                            >
                                {/* Top glow strip */}
                                <div style={{
                                    position: 'absolute',
                                    top: 0, left: 0, right: 0,
                                    height: 2,
                                    background: `linear-gradient(to right, transparent, rgba(${track.accentRgb},0.8), transparent)`,
                                }} />

                                {/* Corner accent */}
                                <div style={{
                                    position: 'absolute',
                                    top: 0, right: 0,
                                    width: 80, height: 80,
                                    background: `radial-gradient(circle at top right, rgba(${track.accentRgb},0.12), transparent 70%)`,
                                }} />

                                {/* Track label pill */}
                                <div style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 6,
                                    padding: '4px 12px',
                                    borderRadius: 999,
                                    background: `rgba(${track.accentRgb},0.1)`,
                                    border: `1px solid rgba(${track.accentRgb},0.3)`,
                                    fontSize: 10,
                                    fontWeight: 900,
                                    letterSpacing: '0.25em',
                                    textTransform: 'uppercase',
                                    color: track.accent,
                                    width: 'fit-content',
                                    fontFamily: 'var(--font-mono)',
                                }}>
                                    {track.label}
                                </div>

                                {/* Icon + name */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                    <span style={{
                                        fontSize: 36,
                                        lineHeight: 1,
                                        filter: `drop-shadow(0 0 12px rgba(${track.accentRgb},0.6))`,
                                    }}>
                                    </span>
                                    <h3 style={{
                                        fontFamily: 'Syne, sans-serif',
                                        fontSize: 28,
                                        fontWeight: 900,
                                        color: 'white',
                                        letterSpacing: '-0.01em',
                                        margin: 0,
                                    }}>
                                        {track.name}
                                    </h3>
                                </div>

                                {/* Description */}
                                <p style={{
                                    color: 'var(--text-secondary)',
                                    fontSize: 13,
                                    lineHeight: 1.7,
                                    margin: 0,
                                    flexGrow: 1,
                                }}>
                                    {track.description}
                                </p>

                                {/* Tags */}
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                    {track.tags.map(tag => (
                                        <span key={tag} style={{
                                            padding: '3px 10px',
                                            borderRadius: 6,
                                            background: `rgba(${track.accentRgb},0.08)`,
                                            border: `1px solid rgba(${track.accentRgb},0.18)`,
                                            fontSize: 10,
                                            fontWeight: 700,
                                            letterSpacing: '0.1em',
                                            color: `rgba(${track.accentRgb === '139,92,246' ? '196,181,253' : track.accentRgb === '59,130,246' ? '147,197,253' : '103,232,249'},0.9)`,
                                            textTransform: 'uppercase',
                                            fontFamily: 'var(--font-mono)',
                                        }}>
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Bottom flourish */}
                    <div style={{
                        marginTop: 40,
                        textAlign: 'center',
                        color: 'var(--text-muted)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: 10,
                        letterSpacing: '0.4em',
                        textTransform: 'uppercase',
                        opacity: 0.5,
                    }}>
                        ── 24 HRS · ALL TRACKS OPEN · PRIZES AWAIT ──
                    </div>

                </div>
                {/* ── /Grand Hackathon ────────────────────────────────────── */}

            </div>
        </section>
    );
}