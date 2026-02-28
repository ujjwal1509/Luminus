import { Suspense, lazy } from 'react';

const Lanyard = lazy(() => import('./Lanyard'));



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

                    {/* Lanyard in right column — lazy-loaded 3D module */}
                    <div className="lanyard-container reveal reveal-delay-3">
                        <Suspense
                            fallback={
                                <div
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        borderRadius: 24,
                                        background: 'radial-gradient(circle at 20% 0%, rgba(123,94,255,0.25), rgba(4,3,10,0.9))',
                                        border: '1px solid rgba(255,255,255,0.06)',
                                        boxShadow: '0 18px 40px rgba(0,0,0,0.6)',
                                    }}
                                />
                            }
                        >
                            <Lanyard />
                        </Suspense>
                    </div>

                </div>

            </div>
        </section>
    );
}