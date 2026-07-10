import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="navbar" style={{
      /* Apply glassmorphism to navbar if it scrolls, but default is clear */
    }}>
      <div className="nav-logo">
        <div className="nav-logo-icon">S</div>
        <span>Signet</span>
      </div>
      <ul className="nav-links">
        <li><a href="#features">Features</a></li>
        <li><a href="#how-it-works">How It Works</a></li>
        <li><a href="#privacy">Privacy</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#docs">Docs</a></li>
      </ul>
      <Link to="/upload">
        <button className="btn btn-nav-cta">
          Get Started <ArrowRight size={16} />
        </button>
      </Link>
    </nav>
  );
}
