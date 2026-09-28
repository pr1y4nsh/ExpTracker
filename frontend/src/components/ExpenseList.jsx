import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getExpenses, deleteExpense, getStats } from '../services/api';

function ExpenseList() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', category: '', payment_method: '' });
  const [meta, setMeta] = useState({ categories: [], paymentMethods: [] });

  useEffect(() => {
    fetchMetadata();
    fetchExpenses();
  }, []);

  const fetchMetadata = async () => {
    try {
      const res = await getStats();
      setMeta({ categories: res.data.categories, paymentMethods: res.data.payment_methods });
    } catch (err) {
      console.error("Failed to load categories");
    }
  };

  const fetchExpenses = async (appliedFilters = filters) => {
    try {
      setLoading(true);
      const res = await getExpenses(appliedFilters);
      setExpenses(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const newFilters = { ...filters, [e.target.name]: e.target.value };
    setFilters(newFilters);
    fetchExpenses(newFilters);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await deleteExpense(id);
        fetchExpenses();
      } catch (err) {
        alert('Failed to delete expense.');
      }
    }
  };

  return (
    <>
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-white border-0">
          <h5 className="mb-0"><i className="bi bi-funnel me-2"></i>Search & Filter</h5>
        </div>
        <div className="card-body">
          <div className="row g-2">
            <div className="col-md-4">
              <input type="text" className="form-control" name="search" placeholder="Search description..." 
                     value={filters.search} onChange={handleFilterChange} />
            </div>
            <div className="col-md-3">
              <select className="form-select" name="category" value={filters.category} onChange={handleFilterChange}>
                <option value="">All Categories</option>
                {meta.categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="col-md-3">
              <select className="form-select" name="payment_method" value={filters.payment_method} onChange={handleFilterChange}>
                <option value="">All Payments</option>
                {meta.paymentMethods.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div className="col-md-2">
              <button className="btn btn-outline-secondary w-100" onClick={() => {
                const clear = { search: '', category: '', payment_method: '' };
                setFilters(clear);
                fetchExpenses(clear);
              }}>Clear</button>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center">
          <h5 className="mb-0"><i className="bi bi-table me-2"></i>Expenses</h5>
          <Link to="/add" className="btn btn-primary btn-sm">
            <i className="bi bi-plus-lg me-1"></i>Add Expense
          </Link>
        </div>
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
          ) : expenses.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-inbox display-4 text-muted"></i>
              <p className="text-muted mt-2">No expenses found.</p>
              <Link to="/add" className="btn btn-primary"><i className="bi bi-plus-lg me-1"></i>Add Your First Expense</Link>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Description</th>
                    <th>Amount</th>
                    <th>Category</th>
                    <th>Date</th>
                    <th>Payment</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map(expense => (
                    <tr key={expense.id}>
                      <td>
                        <strong>{expense.title}</strong>
                        {expense.notes && <><br/><small className="text-muted">{expense.notes}</small></>}
                      </td>
                      <td className="fw-bold text-danger">&#8377;{expense.amount.toFixed(2)}</td>
                      <td><span className="badge bg-primary">{expense.category}</span></td>
                      <td>{expense.date}</td>
                      <td><span className="badge bg-secondary">{expense.payment_method}</span></td>
                      <td className="text-center">
                        <Link to={`/edit/${expense.id}`} className="btn btn-sm btn-outline-primary me-1" title="Edit">
                          <i className="bi bi-pencil"></i>
                        </Link>
                        <button onClick={() => handleDelete(expense.id)} className="btn btn-sm btn-outline-danger" title="Delete">
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ExpenseList;
