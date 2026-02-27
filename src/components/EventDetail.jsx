import { useNavigate } from 'react-router-dom';

export default function EventDetail({ event }) {
    const navigate = useNavigate();

    return (
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '64px 24px', color: 'white' }}>

            {/* Back */}
            <button
                onClick={() => navigate(-1)}
                style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#a78bfa', marginBottom: 48, background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700 }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Return to Domain
            </button>

            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: 64 }}>
                <div style={{ display: 'inline-block', padding: '6px 20px', borderRadius: 999, background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.3)', color: '#a78bfa', fontSize: 10, fontWeight: 900, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 24 }}>
                    SECTOR: {event.department}
                </div>
                <h1 style={{ fontSize: 'clamp(32px, 6vw, 72px)', fontWeight: 900, color: 'white', marginBottom: 16, lineHeight: 1.1, letterSpacing: '-0.02em', fontFamily: 'Syne, sans-serif' }}>
                    {event.title.toUpperCase()}
                </h1>
                <p style={{ fontSize: 18, color: '#9ca3af', fontStyle: 'italic', maxWidth: 600, margin: '0 auto', borderLeft: '2px solid rgba(168,85,247,0.2)', borderRight: '2px solid rgba(168,85,247,0.2)', padding: '0 32px' }}>
                    "{event.description}"
                </p>
            </div>

            {/* Info grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 64 }}>
                {[
                    { label: 'Timeline', value: event.timeline || 'TBA', accent: '#a78bfa' },
                    { label: 'Prize Pool', value: event.prizePool || 'Top Secret', accent: '#60a5fa' },
                    { label: 'Location', value: event.venue || 'On-Site', accent: '#a78bfa' },
                    { label: 'Team Size', value: event.teamSize || 'Solo / Team', accent: '#60a5fa' },
                    { label: 'Entry Fee', value: event.entryFee || 'Free', accent: '#a78bfa' },
                ].map(({ label, value, accent }) => (
                    <div key={label} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '24px 16px', textAlign: 'center' }}>
                        <div style={{ color: accent, fontSize: 10, fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 8 }}>{label}</div>
                        <div style={{ color: 'white', fontWeight: 700, fontSize: 14 }}>{value}</div>
                    </div>
                ))}
            </div>

            {/* Mission Statement */}
            <div style={{ textAlign: 'center', maxWidth: 800, margin: '0 auto 64px' }}>
                <h3 style={{ color: 'white', fontSize: 20, fontWeight: 900, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 32, position: 'relative', display: 'inline-block' }}>
                    MISSION STATEMENT
                    <div style={{ position: 'absolute', bottom: -8, left: '50%', transform: 'translateX(-50%)', width: 60, height: 2, background: 'linear-gradient(to right, transparent, #a78bfa, transparent)' }} />
                </h3>
                <p style={{ color: '#d1d5db', fontSize: 16, lineHeight: 1.8, marginTop: 16 }}>
                    {event.longDescription || event.description}
                </p>
            </div>

            {/* CTA */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(168,85,247,0.3)', borderRadius: 24, padding: '48px 32px', width: '100%', maxWidth: 600, textAlign: 'center', boxShadow: '0 0 40px rgba(168,85,247,0.1)' }}>
                    <div style={{ color: 'rgba(168,85,247,0.5)', fontSize: 11, fontWeight: 700, letterSpacing: '0.4em', textTransform: 'uppercase', marginBottom: 24 }}>
                        OPERATIONAL DIRECTIVES
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center' }}>
                        <button style={{ padding: '14px 32px', borderRadius: 12, border: '1px solid rgba(168,85,247,0.4)', background: 'transparent', color: '#a78bfa', fontWeight: 700, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', cursor: 'pointer' }}>
                            PROTOCOL / RULES
                        </button>
                        <button
                            onClick={() => navigate('/#register')}
                            style={{ padding: '14px 40px', borderRadius: 12, background: 'linear-gradient(135deg, #7c3aed, #2563eb)', color: 'white', fontWeight: 900, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', border: 'none', cursor: 'pointer', boxShadow: '0 0 20px rgba(124,58,237,0.4)' }}
                        >
                            INITIALIZE REGISTRATION
                        </button>
                    </div>
                </div>
            </div>

            <div style={{ marginTop: 80, textAlign: 'center', color: '#374151', fontSize: 10, letterSpacing: '0.8em', textTransform: 'uppercase' }}>
                LUMINUS 2025 // RNS INSTITUTE OF TECHNOLOGY
            </div>
        </div>
    );
}