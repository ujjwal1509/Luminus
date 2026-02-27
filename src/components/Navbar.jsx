import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'Events', href: '#events' },
  { label: 'Register', href: '#register' },
];

export default function Navbar({ activeSection }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 900) setMenuOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const handleNav = (e, id) => {
    e.preventDefault();
    setMenuOpen(false);

    if (isHome) {
      // Already on home — just scroll to section
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      // On a subpage — navigate to home then scroll after page loads
      navigate('/');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <header className={`navbar-wrapper${scrolled ? ' scrolled' : ''}`}>
      <nav className="navbar-glass">

        <a href="/" className="navbar-brand" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
          LUMINUS
        </a>

        <ul className="navbar-links">
          {NAV_LINKS.map((link) => {
            const id = link.href.replace('#', '');
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={`navbar-link${isHome && activeSection === id ? ' active' : ''}`}
                  onClick={(e) => handleNav(e, id)}
                >
                  {link.label}
                  <span className="link-underline" />
                </a>
              </li>
            );
          })}
        </ul>

        <a href="#register" className="navbar-cta" onClick={(e) => handleNav(e, 'register')}>
          Register Now
        </a>

        <button
          className={`hamburger${menuOpen ? ' open' : ''}`}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </nav>

      <div className={`mobile-drawer${menuOpen ? ' open' : ''}`} aria-hidden={!menuOpen}>
        {NAV_LINKS.map((link) => {
          const id = link.href.replace('#', '');
          return (
            <a
              key={link.href}
              href={link.href}
              className={`mobile-link${isHome && activeSection === id ? ' active' : ''}`}
              onClick={(e) => handleNav(e, id)}
            >
              {link.label}
            </a>
          );
        })}
        <a href="#register" className="mobile-cta" onClick={(e) => handleNav(e, 'register')}>
          Register Now
        </a>
      </div>
    </header>
  );
}