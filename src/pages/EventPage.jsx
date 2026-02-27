import { useParams, Link, useNavigate } from 'react-router-dom';
import EventDetail from '../components/EventDetail';
import Navbar from '../components/Navbar';
import { EVENTS } from '../data/mockData';

export default function EventPage() {
    const { slug }  = useParams();
    const navigate  = useNavigate();
    const event     = EVENTS.find(e => e.slug === slug);

    if (!event) {
        return (
            <div style={{
                background: '#04030A', minHeight: '100vh',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                color: 'white', textAlign: 'center',
                padding: '40px 20px',
            }}>
                <h1 style={{
                    fontFamily: 'Syne, sans-serif',
                    fontSize: 'clamp(24px, 5vw, 32px)',
                    marginBottom: 16,
                }}>
                    EVENT NOT FOUND
                </h1>
                <p style={{ color: '#9ca3af', marginBottom: 24, fontSize: 'clamp(13px, 3vw, 16px)' }}>
                    Slug: <code style={{ color: '#f87171' }}>"{slug}"</code>
                </p>
                <Link
                    to="/"
                    style={{
                        color: '#a78bfa', fontWeight: 700,
                        textDecoration: 'none',
                        fontSize: 'clamp(14px, 3.5vw, 16px)',
                    }}
                >
                    ← Return Home
                </Link>
            </div>
        );
    }

    return (
        <div style={{ background: '#04030A', minHeight: '100vh', overflowX: 'hidden' }}>
            <Navbar activeSection="" />
            <div style={{ paddingTop: 80 }}>
                <EventDetail event={event} />
            </div>
        </div>
    );
}
