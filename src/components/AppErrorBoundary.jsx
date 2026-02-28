import { Component } from 'react';
import { Link } from 'react-router-dom';

class AppErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error('AppErrorBoundary caught an error', error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            background: '#05070d',
            color: '#e5e7eb',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              maxWidth: 480,
              width: '100%',
              padding: '32px 24px',
              borderRadius: 16,
              border: '1px solid rgba(255,255,255,0.12)',
              background:
                'radial-gradient(circle at top, rgba(123,94,255,0.24), rgba(4,3,10,0.96))',
              boxShadow: '0 18px 45px rgba(0,0,0,0.75)',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)',
                fontSize: 11,
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                color: 'rgba(156,163,175,0.9)',
                marginBottom: 12,
              }}
            >
              // SYSTEM SAFEGUARD
            </p>
            <h1
              style={{
                fontFamily: 'var(--font-display, system-ui, -apple-system, sans-serif)',
                fontSize: 'clamp(24px, 4vw, 32px)',
                marginBottom: 10,
              }}
            >
              Something went wrong.
            </h1>
            <p
              style={{
                fontSize: 14,
                lineHeight: 1.6,
                color: 'rgba(209,213,219,0.85)',
                marginBottom: 24,
              }}
            >
              The interface hit an unexpected error, but your session is safe. You can return
              home and continue browsing.
            </p>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}
            >
              <button
                type="button"
                onClick={this.handleReset}
                style={{
                  width: '100%',
                  padding: '12px 18px',
                  borderRadius: 999,
                  border: 'none',
                  background:
                    'linear-gradient(135deg, rgba(123,94,255,0.85), rgba(0,229,255,0.85))',
                  color: '#0b1020',
                  fontWeight: 700,
                  fontSize: 13,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                }}
              >
                Try again
              </button>

              <Link
                to="/"
                onClick={this.handleReset}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  padding: '10px 16px',
                  borderRadius: 999,
                  border: '1px solid rgba(148,163,184,0.6)',
                  color: 'rgba(209,213,219,0.9)',
                  fontSize: 12,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                }}
              >
                Return Home
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AppErrorBoundary;

