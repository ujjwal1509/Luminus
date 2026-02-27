const DETAILS = [
    { label: 'Date', value: 'March 28 – 30, 2025' },
    { label: 'Venue', value: 'RNSIT campus, Main Auditorium' },
    { label: 'Entry Fee', value: '₹299 / participant' },
    { label: 'Team Size', value: '1 – 4 members' },
];

export default function Register() {
    return (
        <section className="section" id="register">
            <div className="section-inner register-layout">

                <span className="section-label reveal">// 04 — REGISTER</span>

                <h2
                    className="text-h1 gradient-text reveal reveal-delay-1"
                    style={{ marginBottom: 'var(--space-sm)' }}
                >
                    Ready to Shine?
                </h2>

                <p
                    className="text-body-lg reveal reveal-delay-2"
                    style={{
                        color: 'var(--text-secondary)',
                        maxWidth: 480,
                        margin: '0 auto var(--space-lg)',
                    }}
                >
                    Secure your spot at the biggest tech fest of the year. Three days of
                    innovation, competition, and unforgettable experiences.
                </p>

                <div className="register-panel glass-card reveal reveal-delay-3">

                    {/* Glowing brand mark */}
                    <div className="register-brand">✦ LUMINUS ✦</div>

                    {/* Event details table */}
                    <div className="register-details">
                        {DETAILS.map(({ label, value }) => (
                            <div key={label} className="register-detail-row">
                                <span>{label}</span>
                                <span>{value}</span>
                            </div>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="register-actions">
                        <button className="glass-btn register-cta">
                            Register Now
                        </button>
                        <a href="#" className="register-ghost">
                            ↓ Download Brochure
                        </a>
                    </div>

                </div>

                {/* Footer note */}
                <p
                    className="reveal reveal-delay-4"
                    style={{
                        color: 'var(--text-muted)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: 11,
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        marginTop: 'var(--space-md)',
                    }}
                >
                    RNS Institute of Technology · Bengaluru
                </p>

            </div>
        </section>
    );
}