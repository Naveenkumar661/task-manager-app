import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTasks, getTaskStats } from '../api/api';
import { useAuth } from '../context/AuthContext';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, high_priority: 0 });
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);

  // Filters
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [darkMode, setDarkMode] = useState(true);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (filterStatus) params.status = filterStatus;
      if (filterPriority) params.priority = filterPriority;
      const [taskRes, statsRes] = await Promise.all([getTasks(params), getTaskStats()]);
      setTasks(taskRes.data);
      setStats(statsRes.data);
    } catch {
      // Token expired — go to login
      navigate('/login');
    } finally {
      setLoading(false);
    }
  }, [search, filterStatus, filterPriority, navigate]);

  useEffect(() => { loadTasks(); }, [loadTasks]);

  const openNew = () => { setEditTask(null); setModalOpen(true); };
  const openEdit = (task) => { setEditTask(task); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditTask(null); };
  const handleSaved = () => { closeModal(); loadTasks(); };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className={`app-shell ${darkMode ? 'dark' : 'light'}`}>

      {/* ── Sidebar ── */}
      <aside className="sidebar">
        <div className="sb-logo">Task<span>Flow</span></div>
        <div className="sb-section">
          <div className="sb-label">Menu</div>
          <button className="sb-item active">📋 All Tasks</button>
          <button className="sb-item" onClick={() => setFilterStatus('pending')}>⏳ Pending</button>
          <button className="sb-item" onClick={() => setFilterStatus('completed')}>✅ Completed</button>
          <button className="sb-item" onClick={() => setFilterPriority('high')}>🔴 High Priority</button>
        </div>
        <div className="sb-section" style={{ marginTop: 'auto', paddingBottom: 8 }}>
          <button className="sb-item" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
          <button className="sb-item" onClick={handleLogout}>🚪 Logout</button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="main-content">

        {/* Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">Good day, {user?.username}! 👋</h1>
            <p className="page-sub">Here's what's on your plate today.</p>
          </div>
          <button className="btn-new" onClick={openNew}>＋ New Task</button>
        </div>

        {/* Stats */}
        <div className="stats-row">
          {[
            { label: 'Total Tasks', value: stats.total, color: '#5b7fff' },
            { label: 'Completed', value: stats.completed, color: '#34d399' },
            { label: 'Pending', value: stats.pending, color: '#fbbf24' },
            { label: 'High Priority', value: stats.high_priority, color: '#f87171' },
          ].map((s) => (
            <div className="stat-card" key={s.label} style={{ borderTopColor: s.color }}>
              <div className="stat-val" style={{ color: s.color }}>{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="filters-row">
          <input
            className="search-input" placeholder="🔍 Search tasks..."
            value={search} onChange={(e) => setSearch(e.target.value)}
          />
          <select className="select-field" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
          <select className="select-field" value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
            <option value="">All Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          {(search || filterStatus || filterPriority) && (
            <button className="btn-secondary" onClick={() => { setSearch(''); setFilterStatus(''); setFilterPriority(''); }}>
              Clear
            </button>
          )}
        </div>

        {/* Tasks */}
        {loading ? (
          <div className="empty-state">Loading tasks...</div>
        ) : tasks.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: 48 }}>📝</div>
            <div style={{ marginTop: 12, fontSize: 18, fontWeight: 600 }}>No tasks found</div>
            <div style={{ color: 'var(--muted)', marginTop: 6 }}>
              {search || filterStatus || filterPriority ? 'Try clearing filters' : 'Create your first task!'}
            </div>
            {!search && !filterStatus && !filterPriority && (
              <button className="btn-primary" onClick={openNew} style={{ width: 'auto', marginTop: 18, padding: '10px 24px' }}>
                ＋ Create Task
              </button>
            )}
          </div>
        ) : (
          <div className="tasks-list">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} onEdit={openEdit} onRefresh={loadTasks} />
            ))}
          </div>
        )}
      </main>

      {/* Modal */}
      {modalOpen && <TaskModal task={editTask} onClose={closeModal} onSaved={handleSaved} />}
    </div>
  );
}
