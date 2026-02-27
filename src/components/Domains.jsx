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
                <h2 className="text-h1">Your Arena.</h2>

                <div className="domains-swap-layout">

                    <div className="domains-swap-info">
                        <h3 className="domains-title">
                            Pick your <span className="gradient-text">battleground.</span>
                        </h3>

                        <p className="domains-desc">
                            Explore each domain. Click to enter.
                        </p>

                        <div className="domains-list">
                            {DOMAINS.map((d) => (
                                <button
                                    key={d.slug}
                                    onClick={() => navigate(`/domain/${d.slug}`)}
                                    className="domains-list-btn"
                                >
                                    {d.icon} {d.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="domains-swap-stage">
                        <Masonry items={items} />
                    </div>

                </div>
            </div>
        </section>
    );
}