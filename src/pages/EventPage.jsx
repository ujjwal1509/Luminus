import { useParams, useNavigate } from 'react-router-dom';
import EventDetail from '../components/EventDetail';
import Navbar from '../components/Navbar';
import { EVENTS } from '../data/mockData';

export default function EventPage() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const event = EVENTS.find(e => e.slug.toLowerCase() === slug?.toLowerCase());

    if (!event) {
        return (
            <div style={{
                background: '#05070d', minHeight: '100vh',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                color: 'white', textAlign: 'center', padding: '24px 16px',
            }}>
                <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 32, marginBottom: 16 }}>
                    EVENT NOT FOUND
                </h1>
                <p style={{ color: '#9ca3af', marginBottom: 8 }}>
                    Slug: <span style={{ color: '#f87171' }}>"{slug}"</span>
                </p>
                <p style={{ color: '#6b7280', marginBottom: 24, fontSize: 13 }}>
                    Available: {EVENTS.map(e => e.slug).join(', ')}
                </p>
                <button
                    onClick={() => navigate('/')}
                    style={{ color: '#a78bfa', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', fontSize: 16 }}
                >
                    ← Return Home
                </button>
            </div>
        );
    }

    return (
        <div style={{ background: '#05070d', minHeight: '100vh' }}>
            <Navbar activeSection="" />
            <div style={{ paddingTop: 80 }}>
                <EventDetail event={event} />
            </div>
        </div>
    );
}