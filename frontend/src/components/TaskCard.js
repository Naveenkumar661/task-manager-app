import { deleteTask, updateTask } from '../api/api';

const PRIORITY_COLORS = { high: '#f87171', medium: '#fbbf24', low: '#34d399' };
const PRIORITY_LABELS = { high: '🔴 High', medium: '🟡 Medium', low: '🟢 Low' };

export default function TaskCard({ task, onEdit, onRefresh }) {

  const toggleStatus = async () => {
    await updateTask(task.id, {
      status: task.status === 'completed' ? 'pending' : 'completed',
    });
    onRefresh();
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${task.title}"?`)) return;
    await deleteTask(task.id);
    onRefresh();
  };

  const isOverdue = task.deadline && task.status === 'pending'
    && new Date(task.deadline) < new Date();

  return (
    <div className={`task-card ${task.status === 'completed' ? 'task-done' : ''}`}>
      <div className="task-top">
        <button className={`check-btn ${task.status === 'completed' ? 'checked' : ''}`} onClick={toggleStatus} title="Toggle complete">
          {task.status === 'completed' ? '✓' : ''}
        </button>
        <div className="task-body">
          <div className="task-title">{task.title}</div>
          {task.description && <div className="task-desc">{task.description}</div>}
          <div className="task-meta">
            <span className="badge" style={{ color: PRIORITY_COLORS[task.priority], borderColor: PRIORITY_COLORS[task.priority] + '44', background: PRIORITY_COLORS[task.priority] + '18' }}>
              {PRIORITY_LABELS[task.priority]}
            </span>
            {task.deadline && (
              <span className="badge" style={isOverdue ? { color: '#f87171', borderColor: '#f8717144', background: '#f8717118' } : {}}>
                📅 {task.deadline}{isOverdue ? ' (Overdue)' : ''}
              </span>
            )}
            <span className={`badge status-badge ${task.status}`}>
              {task.status === 'completed' ? '✅ Done' : '⏳ Pending'}
            </span>
          </div>
        </div>
        <div className="task-actions">
          <button className="icon-btn edit-btn" onClick={() => onEdit(task)} title="Edit">✏️</button>
          <button className="icon-btn del-btn" onClick={handleDelete} title="Delete">🗑️</button>
        </div>
      </div>
    </div>
  );
}
