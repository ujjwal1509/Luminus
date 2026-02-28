import Navbar from '../components/Navbar';

export default function NotFoundPage() {
  return (
    <div style={{ background: '#05070d', minHeight: '100vh', color: '#e5e7eb' }}>
      <Navbar activeSection="" />
      <main
        className="section"
        style={{
          minHeight: 'calc(100vh - 80px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: 96,
        }}
      >
        <div className="section-inner" style={{ textAlign: 'center' }}>
          <p
            style={{
              fontFamily: 'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)',
              fontSize: 11,
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
              color: 'rgba(148,163,184,0.8)',
              marginBottom: 16,
            }}
          >
            // 404 — ROUTE NOT FOUND
          </p>
          <h1 className="text-h1" style={{ marginBottom: 16 }}>
            Lost in the grid.
          </h1>
          <p
            style={{
              maxWidth: 480,
              margin: '0 auto 24px',
              color: 'rgba(156,163,175,0.9)',
              lineHeight: 1.7,
            }}
          >
            The page you&apos;re looking for doesn&apos;t exist, has moved, or never shipped.
            You can safely return to the main experience.
          </p>
          <a href="/" className="glass-btn glass-btn-sm">
            Back to Home
          </a>
        </div>
      </main>
    </div>
  );
}

