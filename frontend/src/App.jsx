import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const API = 'http://localhost:3001';

// Axios instance that auto-attaches token
const api = axios.create({ baseURL: API });
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});



// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0e0e12;
    --surface: #16161d;
    --surface2: #1e1e28;
    --border: rgba(255,255,255,0.07);
    --accent: #c8f135;
    --text: #f0f0f0;
    --muted: #6b6b7a;
    --danger: #ff5c5c;
    --error-bg: rgba(255,92,92,0.1);
  }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: 40px 16px 80px;
  }

  .app { width: 100%; max-width: 560px; }

  /* ── Auth ── */
  .auth-wrapper {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 24px 16px;
  }

  .auth-box {
    width: 100%;
    max-width: 420px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 40px 36px;
    animation: fadeUp 0.3s ease;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .auth-logo {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 2rem;
    letter-spacing: -1px;
    margin-bottom: 6px;
  }

  .auth-logo span { color: var(--accent); }

  .auth-subtitle {
    color: var(--muted);
    font-size: 0.85rem;
    margin-bottom: 32px;
  }

  .auth-tabs {
    display: flex;
    gap: 4px;
    background: var(--surface2);
    border-radius: 10px;
    padding: 4px;
    margin-bottom: 28px;
  }

  .auth-tab {
    flex: 1;
    background: none;
    border: none;
    color: var(--muted);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.85rem;
    font-weight: 500;
    padding: 8px;
    border-radius: 7px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .auth-tab.active {
    background: var(--surface);
    color: var(--text);
    border: 1px solid var(--border);
  }

  .field { margin-bottom: 16px; }

  .field label {
    display: block;
    font-size: 0.78rem;
    color: var(--muted);
    margin-bottom: 6px;
    font-weight: 500;
    letter-spacing: 0.02em;
  }

  .field input {
    width: 100%;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 11px 14px;
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.92rem;
    outline: none;
    transition: border-color 0.2s;
  }

  .field input:focus { border-color: var(--accent); }
  .field input::placeholder { color: var(--muted); }

  .error-msg {
    background: var(--error-bg);
    border: 1px solid rgba(255,92,92,0.3);
    border-radius: 8px;
    padding: 10px 14px;
    font-size: 0.82rem;
    color: var(--danger);
    margin-bottom: 16px;
  }

  .submit-btn {
    width: 100%;
    background: var(--accent);
    color: #0e0e12;
    border: none;
    border-radius: 10px;
    padding: 13px;
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 0.9rem;
    cursor: pointer;
    margin-top: 8px;
    transition: opacity 0.2s, transform 0.15s;
  }

  .submit-btn:hover { opacity: 0.88; }
  .submit-btn:active { transform: scale(0.98); }
  .submit-btn:disabled { opacity: 0.4; cursor: not-allowed; }

  /* ── App header ── */
  .top-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 28px;
  }

  .greeting {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 2.2rem;
    line-height: 1;
    letter-spacing: -1px;
  }

  .greeting span { color: var(--accent); }
  .greeting-sub { color: var(--muted); font-size: 0.82rem; margin-top: 4px; }

  .logout-btn {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 10px;
    color: var(--muted);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.8rem;
    padding: 8px 14px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .logout-btn:hover { color: var(--danger); border-color: rgba(255,92,92,0.4); }

  /* Progress */
  .progress-wrap { margin-bottom: 28px; }

  .progress-info {
    display: flex;
    justify-content: space-between;
    font-size: 0.78rem;
    color: var(--muted);
    margin-bottom: 8px;
  }

  .progress-track {
    height: 3px;
    background: var(--border);
    border-radius: 999px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background: var(--accent);
    border-radius: 999px;
    transition: width 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  /* Input row */
  .input-row {
    display: flex;
    gap: 10px;
    margin-bottom: 24px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 6px 6px 6px 18px;
    transition: border-color 0.2s;
  }

  .input-row:focus-within { border-color: var(--accent); }

  .input-row input {
    flex: 1;
    background: none;
    border: none;
    outline: none;
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.95rem;
  }

  .input-row input::placeholder { color: var(--muted); }

  .add-btn {
    background: var(--accent);
    color: #0e0e12;
    border: none;
    border-radius: 10px;
    padding: 10px 20px;
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 0.85rem;
    cursor: pointer;
    transition: transform 0.15s, opacity 0.15s;
    white-space: nowrap;
  }

  .add-btn:hover { opacity: 0.85; transform: scale(0.98); }
  .add-btn:active { transform: scale(0.95); }
  .add-btn:disabled { opacity: 0.4; cursor: not-allowed; }

  /* Filters */
  .filters {
    display: flex;
    gap: 4px;
    margin-bottom: 16px;
    background: var(--surface);
    border-radius: 10px;
    padding: 4px;
    border: 1px solid var(--border);
  }

  .filter-btn {
    flex: 1;
    background: none;
    border: none;
    color: var(--muted);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.82rem;
    font-weight: 500;
    padding: 7px;
    border-radius: 7px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .filter-btn.active { background: var(--surface2); color: var(--text); }

  /* Todo list */
  .todo-list { display: flex; flex-direction: column; gap: 8px; }

  .empty {
    text-align: center;
    color: var(--muted);
    font-size: 0.9rem;
    padding: 40px 0;
    font-style: italic;
  }

  .todo-item {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 14px 16px;
    display: flex;
    align-items: center;
    gap: 12px;
    transition: border-color 0.2s, opacity 0.2s;
    animation: slideIn 0.2s ease;
  }

  @keyframes slideIn {
    from { opacity: 0; transform: translateY(-8px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .todo-item.done { opacity: 0.5; }
  .todo-item:hover { border-color: rgba(255,255,255,0.13); }

  .checkbox {
    width: 20px;
    height: 20px;
    border-radius: 6px;
    border: 2px solid var(--border);
    background: none;
    cursor: pointer;
    flex-shrink: 0;
    transition: all 0.2s;
    appearance: none;
    -webkit-appearance: none;
    position: relative;
  }

  .checkbox:checked { background: var(--accent); border-color: var(--accent); }

  .checkbox:checked::after {
    content: '';
    position: absolute;
    width: 5px;
    height: 9px;
    border: 2px solid #0e0e12;
    border-top: none;
    border-left: none;
    transform: rotate(45deg);
    top: 1px;
    left: 5px;
  }

  .todo-title {
    flex: 1;
    font-size: 0.92rem;
    font-weight: 400;
    line-height: 1.4;
    word-break: break-word;
  }

  .todo-title.striked { text-decoration: line-through; color: var(--muted); }

  .edit-input {
    flex: 1;
    background: var(--surface2);
    border: 1px solid var(--accent);
    border-radius: 8px;
    padding: 6px 10px;
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.92rem;
    outline: none;
  }

  .actions { display: flex; gap: 6px; flex-shrink: 0; }

  .icon-btn {
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 8px;
    width: 32px;
    height: 32px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s;
    font-size: 13px;
  }

  .icon-btn:hover { border-color: rgba(255,255,255,0.2); transform: scale(1.05); }
  .icon-btn.save { border-color: var(--accent); color: var(--accent); }
  .icon-btn.cancel { color: var(--muted); }
  .icon-btn.edit { color: #a0a0b0; }
  .icon-btn.delete { color: var(--muted); }
  .icon-btn.delete:hover { border-color: var(--danger); color: var(--danger); }

  .footer {
    margin-top: 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.78rem;
    color: var(--muted);
  }

  .clear-btn {
    background: none;
    border: none;
    color: var(--muted);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.78rem;
    cursor: pointer;
    text-decoration: underline;
    text-underline-offset: 3px;
    transition: color 0.2s;
  }

  .clear-btn:hover { color: var(--danger); }
`;

// ─── Auth Screen ──────────────────────────────────────────────────────────────
function AuthScreen({ onLogin }) {
  const [tab, setTab] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const submit = async () => {
    setError('');
    setLoading(true);
    try {
      const endpoint = tab === 'login' ? '/auth/login' : '/auth/register';
      const payload = tab === 'login'
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, password: form.password };

      const res = await api.post(endpoint, payload);
      localStorage.setItem('token', res.data.access_token);
      onLogin(res.data.user);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-box">
        <div className="auth-logo">My<span>Tasks.</span></div>
        <p className="auth-subtitle">Your personal task manager</p>

        <div className="auth-tabs">
          <button className={`auth-tab ${tab === 'login' ? 'active' : ''}`}
            onClick={() => { setTab('login'); setError(''); }}>Login</button>
          <button className={`auth-tab ${tab === 'register' ? 'active' : ''}`}
            onClick={() => { setTab('register'); setError(''); }}>Register</button>
        </div>

        {error && <div className="error-msg">{error}</div>}

        {tab === 'register' && (
          <div className="field">
            <label>Name</label>
            <input name="name" placeholder="Your name" value={form.name} onChange={handle}
              onKeyDown={e => e.key === 'Enter' && submit()} />
          </div>
        )}

        <div className="field">
          <label>Email</label>
          <input name="email" type="email" placeholder="you@email.com" value={form.email} onChange={handle}
            onKeyDown={e => e.key === 'Enter' && submit()} />
        </div>

        <div className="field">
          <label>Password</label>
          <input name="password" type="password" placeholder="••••••••" value={form.password} onChange={handle}
            onKeyDown={e => e.key === 'Enter' && submit()} />
        </div>

        <button className="submit-btn" onClick={submit} disabled={loading}>
          {loading ? '...' : tab === 'login' ? 'Login →' : 'Create Account →'}
        </button>
      </div>
    </div>
  );
}

// ─── Todo App ─────────────────────────────────────────────────────────────────
function TodoApp({ user, onLogout }) {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const editRef = useRef(null);
const [page, setPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);
const [total, setTotal] = useState(0);

const fetchTodos = async () => {
  const res = await api.get(`/todos?page=${page}&limit=10`);
  setTodos(res.data.data);       // ← data is now nested
  setTotalPages(res.data.totalPages);
  setTotal(res.data.total);
};

useEffect(() => { fetchTodos(); }, [page]); // ← re-fetch on page change
  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));


  const addTodo = async () => {
  if (!input.trim()) return;
  setLoading(true);
  await api.post('/todos', { title: input });
  setInput('');
  setPage(1); // ← reset to first page
  await fetchTodos();
  setLoading(false);
};

  const toggleTodo = async (id, completed) => {
    await api.put(`/todos/${id}`, { completed: !completed });
    fetchTodos();
  };

  const deleteTodo = async (id) => {
    await api.delete(`/todos/${id}`);
    fetchTodos();
  };

  const startEdit = (todo) => { setEditingId(todo.id); setEditValue(todo.title); };
  const cancelEdit = () => { setEditingId(null); setEditValue(''); };

  const saveEdit = async (id) => {
    if (!editValue.trim()) return;
    await api.put(`/todos/${id}`, { title: editValue });
    setEditingId(null);
    fetchTodos();
  };

  const filtered = todos.filter(t => {
    if (filter === 'active') return !t.completed;
    if (filter === 'done') return t.completed;
    return true;
  });

  const doneCount = todos.filter(t => t.completed).length;
  const progress = todos.length ? Math.round((doneCount / todos.length) * 100) : 0;

  return (
    <div className="app">
      <div className="top-bar">
        <div>
          <h1 className="greeting">Hey, <span>{user?.name || 'there'}</span></h1>
          <p className="greeting-sub">{todos.length === 0 ? 'No tasks yet' : `${doneCount} of ${todos.length} done`}</p>
        </div>
        <button className="logout-btn" onClick={onLogout}>Logout</button>
      </div>

      <div className="progress-wrap">
        <div className="progress-info">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="input-row">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addTodo()}
          placeholder="What needs to be done?"
        />
        <button className="add-btn" onClick={addTodo} disabled={loading}>
          {loading ? '...' : '+ Add'}
        </button>
      </div>

      <div className="filters">
        {['all', 'active', 'done'].map(f => (
          <button key={f} className={`filter-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
            {f === 'all' && ` (${todos.length})`}
            {f === 'active' && ` (${todos.length - doneCount})`}
            {f === 'done' && ` (${doneCount})`}
          </button>
        ))}
      </div>

      <div className="todo-list">
        {filtered.length === 0 && (
          <p className="empty">
            {filter === 'done' ? 'Nothing completed yet 🌱' :
             filter === 'active' ? 'All done! Great work 🎉' :
             'Add your first task above ✨'}
          </p>
        )}

        {filtered.map(todo => (
          <div key={todo.id} className={`todo-item ${todo.completed ? 'done' : ''}`}>
            <input
              type="checkbox"
              className="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id, todo.completed)}
            />
            {editingId === todo.id ? (
              <>
                <input ref={editRef} className="edit-input" value={editValue}
                  onChange={e => setEditValue(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') saveEdit(todo.id); if (e.key === 'Escape') cancelEdit(); }}
                />
                <div className="actions">
                  <button className="icon-btn save" onClick={() => saveEdit(todo.id)}>✓</button>
                  <button className="icon-btn cancel" onClick={cancelEdit}>✕</button>
                </div>
              </>
            ) : (
              <>
                <span className={`todo-title ${todo.completed ? 'striked' : ''}`}>{todo.title}</span>
                <div className="actions">
                  <button className="icon-btn edit" onClick={() => startEdit(todo)}>✎</button>
                  <button className="icon-btn delete" onClick={() => deleteTodo(todo.id)}>⌫</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {doneCount > 0 && (
        <div className="footer">
          <span>{todos.length - doneCount} task{todos.length - doneCount !== 1 ? 's' : ''} remaining</span>
          <button className="clear-btn" onClick={async () => {
            await Promise.all(todos.filter(t => t.completed).map(t => api.delete(`/todos/${t.id}`)));
            fetchTodos();
          }}>Clear completed</button>
        </div>
      )}
      {totalPages > 1 && (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 24,
  }}>
    <button
      className="icon-btn"
      onClick={() => setPage(p => Math.max(1, p - 1))}
      disabled={page === 1}
      style={{ width: 'auto', padding: '0 12px', opacity: page === 1 ? 0.4 : 1 }}
    >
      ← Prev
    </button>

    <span style={{ color: 'var(--muted)', fontSize: '0.82rem' }}>
      Page {page} of {totalPages} · {total} tasks
    </span>

    <button
      className="icon-btn"
      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
      disabled={page === totalPages}
      style={{ width: 'auto', padding: '0 12px', opacity: page === totalPages ? 0.4 : 1 }}
    >
      Next →
    </button>
  </div>
)}
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    const saved = localStorage.getItem('user');
    return token && saved ? JSON.parse(saved) : null;
  });

  const handleLogin = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <>
      <style>{styles}</style>
      {user
        ? <TodoApp user={user} onLogout={handleLogout} />
        : <AuthScreen onLogin={handleLogin} />
      }
    </>
  );
}