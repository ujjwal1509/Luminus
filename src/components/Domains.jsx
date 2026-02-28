import { useNavigate } from "react-router-dom";
import Masonry from "./Masonry";
import { DOMAINS } from "../data/mockData";

const ACCENTS = [
    "var(--accent-aurora)",
    "var(--accent-plasma)",
    "var(--accent-nova)"
];

export default function Domains() {
    const navigate = useNavigate();

    const items = DOMAINS.map((domain, i) => ({
        id: domain.slug,
        height: 260 + (i % 3) * 70,
        onClick: () => navigate(`/domain/${domain.slug}`),
        render: (
            <div className="masonry-card">
                <div className="masonry-card-top">{domain.icon}</div>
                <div className="masonry-card-content">
                    <h3>{domain.name}</h3>
                    <p>{domain.description}</p>
                </div>
            </div>
        )
    }));

    return (
        <section className="section section--alt" id="events">
            <div className="section-inner">

            <span className="section-label">// 02 — EVENTS</span>
            <h1 className="domains-title" style={{ fontSize: "5.5rem" }}>
                Pick your <span className="gradient-text" style={{ fontSize: "5.5rem" }}>battleground.</span>
            </h1>


                <div className="domains-swap-layout">

                    <div className="domains-swap-info">
                        <p className="domains-desc">
                            Explore each domain. Click to enter.
                        </p>

                        <div className="domains-list">
                            {DOMAINS.length === 0 ? (
                                <p style={{ color: 'var(--text-secondary)' }}>
                                    Domains will be announced soon. Check back for the full grid of events.
                                </p>
                            ) : (
                                DOMAINS.map((d) => (
                                    <button
                                        key={d.slug}
                                        type="button"
                                        onClick={() => navigate(`/domain/${d.slug}`)}
                                        className="domains-list-btn"
                                    >
                                        {d.icon} {d.name}
                                    </button>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="domains-swap-stage">
                        {items.length === 0 ? (
                            <div
                                className="glass-card"
                                style={{
                                    height: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    textAlign: 'center',
                                }}
                            >
                                <p style={{ color: 'var(--text-secondary)' }}>
                                    Once domains are live, a dynamic event grid will appear here.
                                </p>
                            </div>
                        ) : (
                            <Masonry items={items} />
                        )}
                    </div>

                </div>
            </div>
        </section>
    );
}