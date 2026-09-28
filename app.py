import os
import sqlite3
from datetime import datetime, date
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app) # Enable CORS for frontend

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE = os.path.join(BASE_DIR, 'database', 'expenses.db')

CATEGORIES = ['Food', 'Travel', 'Shopping', 'Education', 'Entertainment', 'Bills', 'Other']
PAYMENT_METHODS = ['Cash', 'UPI', 'Card', 'Other']

def get_db():
    os.makedirs(os.path.dirname(DATABASE), exist_ok=True)
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS expenses (
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
    cursor.execute('SELECT COUNT(*) FROM expenses')
    if cursor.fetchone()[0] == 0:
        sample_expenses = [
            ('Grocery Shopping', 1500.00, 'Food', '2026-09-01', 'UPI', 'Weekly groceries'),
            ('Bus Pass', 500.00, 'Travel', '2026-09-02', 'Cash', 'Monthly bus pass'),
            ('Programming Book', 850.00, 'Education', '2026-09-05', 'Card', 'Amazon'),
            ('Movie Night', 400.00, 'Entertainment', '2026-09-08', 'UPI', 'With friends'),
            ('Headphones', 1200.00, 'Shopping', '2026-09-10', 'Card', 'Boat'),
            ('Electricity Bill', 1800.00, 'Bills', '2026-09-12', 'UPI', 'September bill'),
            ('Lunch', 650.00, 'Food', '2026-09-15', 'Cash', 'Restaurant'),
            ('Uber Ride', 250.00, 'Travel', '2026-09-18', 'UPI', 'To college'),
            ('Stationery', 180.00, 'Education', '2026-09-20', 'Cash', 'Pens'),
            ('Internet Bill', 999.00, 'Bills', '2026-09-22', 'UPI', 'WiFi'),
        ]
        cursor.executemany('INSERT INTO expenses (title, amount, category, date, payment_method, notes) VALUES (?, ?, ?, ?, ?, ?)', sample_expenses)
        conn.commit()
    conn.close()

@app.route('/api/expenses', methods=['GET'])
def get_expenses():
    conn = get_db()
    cursor = conn.cursor()
    search = request.args.get('search', '').strip()
    category = request.args.get('category', '').strip()
    payment_method = request.args.get('payment_method', '').strip()
    
    query = 'SELECT * FROM expenses WHERE 1=1'
    params = []
    
    if search:
        query += ' AND title LIKE ?'
        params.append(f'%{search}%')
    if category:
        query += ' AND category = ?'
        params.append(category)
    if payment_method:
        query += ' AND payment_method = ?'
        params.append(payment_method)
        
    query += ' ORDER BY date DESC, id DESC'
    cursor.execute(query, params)
    expenses = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return jsonify(expenses)

@app.route('/api/expenses', methods=['POST'])
def add_expense():
    data = request.json
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(
        'INSERT INTO expenses (title, amount, category, date, payment_method, notes) VALUES (?, ?, ?, ?, ?, ?)',
        (data.get('title'), float(data.get('amount')), data.get('category'), data.get('date'), data.get('payment_method'), data.get('notes', ''))
    )
    conn.commit()
    new_id = cursor.lastrowid
    conn.close()
    return jsonify({'message': 'Expense added', 'id': new_id}), 201

@app.route('/api/expenses/<int:id>', methods=['GET'])
def get_expense(id):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM expenses WHERE id = ?', (id,))
    expense = cursor.fetchone()
    conn.close()
    if expense:
        return jsonify(dict(expense))
    return jsonify({'error': 'Not found'}), 404

@app.route('/api/expenses/<int:id>', methods=['PUT'])
def update_expense(id):
    data = request.json
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(
        'UPDATE expenses SET title=?, amount=?, category=?, date=?, payment_method=?, notes=? WHERE id=?',
        (data.get('title'), float(data.get('amount')), data.get('category'), data.get('date'), data.get('payment_method'), data.get('notes', ''), id)
    )
    conn.commit()
    conn.close()
    return jsonify({'message': 'Expense updated'})

@app.route('/api/expenses/<int:id>', methods=['DELETE'])
def delete_expense(id):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM expenses WHERE id = ?', (id,))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Expense deleted'})

@app.route('/api/stats', methods=['GET'])
def get_stats():
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute('SELECT COALESCE(SUM(amount), 0) as total FROM expenses')
    total = cursor.fetchone()['total']
    
    cursor.execute('SELECT COUNT(*) as count FROM expenses')
    count = cursor.fetchone()['count']
    
    cursor.execute('SELECT COALESCE(MAX(amount), 0) as highest FROM expenses')
    highest = cursor.fetchone()['highest']
    
    current_month = date.today().strftime('%Y-%m')
    cursor.execute('SELECT COALESCE(SUM(amount), 0) as monthly FROM expenses WHERE date LIKE ?', (f'{current_month}%',))
    monthly = cursor.fetchone()['monthly']
    
    cursor.execute('SELECT category, SUM(amount) as total FROM expenses GROUP BY category ORDER BY total DESC')
    categories = [{'category': row['category'], 'total': row['total']} for row in cursor.fetchall()]
    
    conn.close()
    
    return jsonify({
        'total_expenses': total,
        'transaction_count': count,
        'highest_expense': highest,
        'monthly_spending': monthly,
        'category_data': categories,
        'categories': CATEGORIES,
        'payment_methods': PAYMENT_METHODS
    })

with app.app_context():
    init_db()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5050)
