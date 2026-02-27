import Lanyard from './Lanyard';



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

            </div>
        </section>
    );
}