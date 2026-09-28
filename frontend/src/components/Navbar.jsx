import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
        <div className="container">
            <Link className="navbar-brand fw-bold" to="/">
                <i className="bi bi-wallet2 me-2"></i>Expense Tracker
            </Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav ms-auto">
                    <li className="nav-item">
                        <Link className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} to="/">
                            <i className="bi bi-house-door me-1"></i>Dashboard
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className={`nav-link ${location.pathname === '/expenses' ? 'active' : ''}`} to="/expenses">
                            <i className="bi bi-list-ul me-1"></i>All Expenses
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className={`nav-link ${location.pathname === '/add' ? 'active' : ''}`} to="/add">
                            <i className="bi bi-plus-circle me-1"></i>Add Expense
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
  );
}

export default Navbar;
