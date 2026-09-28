# 💰 Expense Tracker (React + Flask)

A simple and clean full-stack **Expense Tracker** web application. Originally built with Flask templates, now converted to a modern **React SPA (Single Page Application)** with a **Flask REST API** backend.

> Built as a college CCA 2 project to demonstrate software development, GitHub version control, deployment, and CI/CD.

---

## ✨ Features

- ✅ **Add Expenses** – Record expenses with description, amount, category, date, payment method, and notes
- ✅ **View Expenses** – See all expenses in a clean table layout
- ✅ **Edit Expenses** – Update existing expense details
- ✅ **Delete Expenses** – Remove expenses with confirmation
- ✅ **Dashboard** – View total spending, transaction count, highest expense, and monthly spending
- ✅ **Category Summary** – See spending breakdown by category with a Chart.js doughnut chart
- ✅ **Search & Filter** – Search by description, filter by category and payment method
- ✅ **Modern React Frontend** – Fast, smooth client-side routing with React Router
- ✅ **RESTful API** – Well-structured JSON endpoints powered by Flask
- ✅ **Automated Tests** – Comprehensive API test suite using pytest
- ✅ **CI/CD Pipeline** – GitHub Actions workflow for continuous integration

---

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| **React 18** | Frontend Library |
| **Vite** | Frontend Build Tool |
| **React Router** | Client-side routing |
| **Chart.js** | Category spending chart |
| **Axios** | HTTP client for API requests |
| **Bootstrap 5.3** | UI framework & styling |
| **Python 3.11+** | Backend language |
| **Flask 3.0** | Backend API framework |
| **SQLite** | Database |
| **pytest** | Automated testing |

---

## 📁 Project Structure

```
expense-tracker/
│
├── app.py                  # Main Flask REST API
├── requirements.txt        # Python dependencies
├── Procfile                # Deployment configuration
├── README.md               # Project documentation
├── setup_git_react.bat     # Helper script to commit React changes
│
├── database/               # SQLite database (auto-created)
│
├── frontend/               # React application
│   ├── package.json        # Node.js dependencies
│   ├── vite.config.js      # Vite build config
│   ├── index.html          # HTML entry point
│   └── src/                # React components and services
│       ├── App.jsx         # Main router component
│       ├── components/     # React UI components (Navbar, Dashboard, etc.)
│       └── services/       # API wrapper functions (Axios)
│
└── tests/                  # Automated tests
    └── test_app.py         # Pytest API test suite
```

---

## 🚀 Installation & Setup

### 1. Backend (Flask API)
```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/expense-tracker.git
cd expense-tracker

# Create and activate a virtual environment (optional but recommended)
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Mac/Linux

# Install Python dependencies
pip install -r requirements.txt

# Start the Flask API
python app.py
```
*The API will run on `http://127.0.0.1:5050`*

### 2. Frontend (React)
Open a **second terminal** and run:
```bash
cd expense-tracker/frontend

# Install Node modules
npm install

# Start the React development server
npm run dev
```
*The React app will be available on `http://localhost:4000`*

---

## 🧪 Running Tests (Backend)

Run the automated test suite using pytest:

```bash
python -m pytest tests/ -v
```

---

## ⚙️ GitHub Actions CI/CD

This project uses GitHub Actions. The CI pipeline runs automatically on every push to the `main` branch.

### Pipeline Steps:
1. Set up Python and install requirements
2. Run pytest for the Flask API
3. Set up Node.js and install npm dependencies
4. Build the React application via Vite

---

## 👤 Author

**Priyansh**

---

## 📄 License

This project is open source and available for educational purposes.
