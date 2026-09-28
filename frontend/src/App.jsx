import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container mt-4 mb-5">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/expenses" element={<ExpenseList />} />
          <Route path="/add" element={<ExpenseForm />} />
          <Route path="/edit/:id" element={<ExpenseForm />} />
        </Routes>
      </div>
      <footer className="bg-light py-3 mt-auto border-top text-center fixed-bottom" style={{ zIndex: 0 }}>
          <p className="text-muted mb-0">&copy; 2026 Expense Tracker | React + Flask</p>
      </footer>
    </Router>
  );
}

export default App;
