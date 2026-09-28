import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { addExpense, updateExpense, getExpense, getStats } from '../services/api';

function ExpenseForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    payment_method: '',
    notes: ''
  });
  const [meta, setMeta] = useState({ categories: [], paymentMethods: [] });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMetadata();
    if (isEdit) fetchExpenseData();
  }, [id]);

  const fetchMetadata = async () => {
    try {
      const res = await getStats();
      setMeta({ categories: res.data.categories, paymentMethods: res.data.payment_methods });
    } catch (err) {
      console.error(err);
    }
  };

  const fetchExpenseData = async () => {
    try {
      const res = await getExpense(id);
      setFormData(res.data);
    } catch (err) {
      setError('Failed to load expense data.');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isEdit) {
        await updateExpense(id, formData);
      } else {
        await addExpense(formData);
      }
      navigate('/expenses');
    } catch (err) {
      setError('An error occurred while saving the expense.');
      setLoading(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-8 col-lg-6">
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white border-0">
            <h4 className="mb-0">
              <i className={`bi ${isEdit ? 'bi-pencil-square' : 'bi-plus-circle'} me-2`}></i>
              {isEdit ? 'Edit Expense' : 'Add New Expense'}
            </h4>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Description <span className="text-danger">*</span></label>
                <input type="text" className="form-control" name="title" required
                       value={formData.title} onChange={handleChange} placeholder="e.g., Grocery Shopping" />
              </div>
              <div className="mb-3">
                <label className="form-label">Amount (&#8377;) <span className="text-danger">*</span></label>
                <input type="number" className="form-control" name="amount" required step="0.01" min="0.01"
                       value={formData.amount} onChange={handleChange} placeholder="500.00" />
              </div>
              <div className="mb-3">
                <label className="form-label">Category <span className="text-danger">*</span></label>
                <select className="form-select" name="category" required value={formData.category} onChange={handleChange}>
                  <option value="" disabled>Select a category</option>
                  {meta.categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Date <span className="text-danger">*</span></label>
                <input type="date" className="form-control" name="date" required
                       value={formData.date} onChange={handleChange} />
              </div>
              <div className="mb-3">
                <label className="form-label">Payment Method <span className="text-danger">*</span></label>
                <select className="form-select" name="payment_method" required value={formData.payment_method} onChange={handleChange}>
                  <option value="" disabled>Select payment method</option>
                  {meta.paymentMethods.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Notes <span className="text-muted">(optional)</span></label>
                <textarea className="form-control" name="notes" rows="2"
                          value={formData.notes || ''} onChange={handleChange} placeholder="Any additional notes..."></textarea>
              </div>
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  <i className="bi bi-check-lg me-1"></i>{isEdit ? 'Update Expense' : 'Add Expense'}
                </button>
                <Link to="/expenses" className="btn btn-outline-secondary">
                  <i className="bi bi-arrow-left me-1"></i>Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExpenseForm;
