import os
import sys
import pytest
import tempfile
import sqlite3

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from app import app, get_db, init_db

@pytest.fixture
def client():
    db_fd, db_path = tempfile.mkstemp(suffix='.db')
    app.config['TESTING'] = True
    
    import app as app_module
    original_db = app_module.DATABASE
    app_module.DATABASE = db_path
    
    with app.test_client() as client:
        with app.app_context():
            conn = sqlite3.connect(db_path)
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            cursor.execute('''
                CREATE TABLE expenses (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    title TEXT NOT NULL,
                    amount REAL NOT NULL,
                    category TEXT NOT NULL,
                    date TEXT NOT NULL,
                    payment_method TEXT NOT NULL,
                    notes TEXT DEFAULT '',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            conn.commit()
            conn.close()
        yield client
    
    app_module.DATABASE = original_db
    os.close(db_fd)
    os.unlink(db_path)

def test_api_add_expense(client):
    res = client.post('/api/expenses', json={
        'title': 'Test React API',
        'amount': 200,
        'category': 'Food',
        'date': '2026-10-01',
        'payment_method': 'Cash'
    })
    assert res.status_code == 201
    assert res.json['message'] == 'Expense added'

def test_api_get_expenses(client):
    client.post('/api/expenses', json={
        'title': 'API Test', 'amount': 100, 'category': 'Other', 'date': '2026-10-01', 'payment_method': 'Cash'
    })
    res = client.get('/api/expenses')
    assert res.status_code == 200
    assert len(res.json) == 1
    assert res.json[0]['title'] == 'API Test'
