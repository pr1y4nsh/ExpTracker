import { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { getStats } from '../services/api';

ChartJS.register(ArcElement, Tooltip, Legend);

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await getStats();
      setStats(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch dashboard statistics.');
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary"></div></div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  const chartData = {
    labels: stats.category_data.map(item => item.category),
    datasets: [{
      data: stats.category_data.map(item => item.total),
      backgroundColor: [
        '#0d6efd', '#198754', '#ffc107', '#dc3545', 
        '#6f42c1', '#fd7e14', '#20c997', '#0dcaf0'
      ],
      borderWidth: 2,
      borderColor: '#ffffff',
      hoverOffset: 8
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' }
    }
  };

  return (
    <>
      {/* Dashboard Cards */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-lg-3">
          <div className="card dashboard-card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <div className="card-icon bg-primary-subtle text-primary mx-auto mb-2">
                <i className="bi bi-currency-rupee"></i>
              </div>
              <h6 className="card-subtitle text-muted">Total Expenses</h6>
              <h4 className="card-title fw-bold text-primary">&#8377;{stats.total_expenses.toFixed(2)}</h4>
            </div>
          </div>
        </div>
        <div className="col-6 col-lg-3">
          <div className="card dashboard-card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <div className="card-icon bg-success-subtle text-success mx-auto mb-2">
                <i className="bi bi-receipt"></i>
              </div>
              <h6 className="card-subtitle text-muted">Transactions</h6>
              <h4 className="card-title fw-bold text-success">{stats.transaction_count}</h4>
            </div>
          </div>
        </div>
        <div className="col-6 col-lg-3">
          <div className="card dashboard-card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <div className="card-icon bg-warning-subtle text-warning mx-auto mb-2">
                <i className="bi bi-arrow-up-circle"></i>
              </div>
              <h6 className="card-subtitle text-muted">Highest Expense</h6>
              <h4 className="card-title fw-bold text-warning">&#8377;{stats.highest_expense.toFixed(2)}</h4>
            </div>
          </div>
        </div>
        <div className="col-6 col-lg-3">
          <div className="card dashboard-card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <div className="card-icon bg-info-subtle text-info mx-auto mb-2">
                <i className="bi bi-calendar-month"></i>
              </div>
              <h6 className="card-subtitle text-muted">This Month</h6>
              <h4 className="card-title fw-bold text-info">&#8377;{stats.monthly_spending.toFixed(2)}</h4>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      {stats.category_data && stats.category_data.length > 0 && (
        <div className="row mb-4">
          <div className="col-md-6 mb-3 mb-md-0">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-white border-0">
                <h5 className="mb-0"><i className="bi bi-pie-chart me-2"></i>Spending by Category</h5>
              </div>
              <div className="card-body" style={{ height: '300px' }}>
                <Doughnut data={chartData} options={chartOptions} />
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-white border-0">
                <h5 className="mb-0"><i className="bi bi-list-ul me-2"></i>Category Breakdown</h5>
              </div>
              <div className="card-body">
                {stats.category_data.map((item, idx) => (
                  <div key={idx}>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <div>
                        <span className="badge bg-primary me-2">{item.category}</span>
                      </div>
                      <span className="fw-bold">&#8377;{item.total.toFixed(2)}</span>
                    </div>
                    {idx < stats.category_data.length - 1 && <hr className="my-1" />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Dashboard;
