import { useState, useEffect } from 'react';
import { createTask, updateTask } from '../api/api';

const EMPTY = { title: '', description: '', priority: 'medium', deadline: '', status: 'pending' };

export default function TaskModal({ task, onClose, onSaved }) {
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'medium',
        deadline: task.deadline || '',
        status: task.status || 'pending',
      });
    } else {
      setForm(EMPTY);
    }
  }, [task]);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = { ...form };
      if (!payload.deadline) delete payload.deadline;
      if (task?.id) {
        await updateTask(task.id, payload);
      } else {
        await createTask(payload);
      }
      onSaved();
    } catch (err) {
      const data = err.response?.data;
      setError(data ? Object.values(data).flat().join(' ') : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{task?.id ? 'Edit Task' : 'New Task'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={submit}>
          <div className="field">
            <label>Title *</label>
            <input name="title" value={form.title} onChange={handle} placeholder="What needs to be done?" required />
          </div>
          <div className="field">
            <label>Description</label>
            <textarea
              name="description" value={form.description} onChange={handle}
              placeholder="Add details..." rows={3}
              style={{ width: '100%', background: 'var(--surface2)', border: '1.5px solid var(--border)', borderRadius: 10, padding: '11px 14px', color: 'var(--text)', fontFamily: 'var(--font-body)', fontSize: 14, outline: 'none', resize: 'vertical' }}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div className="field">
              <label>Priority</label>
              <select name="priority" value={form.priority} onChange={handle} className="select-field">
                <option value="low">🟢 Low</option>
                <option value="medium">🟡 Medium</option>
                <option value="high">🔴 High</option>
              </select>
            </div>
            <div className="field">
              <label>Status</label>
              <select name="status" value={form.status} onChange={handle} className="select-field">
                <option value="pending">⏳ Pending</option>
                <option value="completed">✅ Completed</option>
              </select>
            </div>
          </div>
          <div className="field">
            <label>Deadline</label>
            <input name="deadline" type="date" value={form.deadline} onChange={handle}
              style={{ colorScheme: 'dark' }} />
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button className="btn-primary" disabled={loading} style={{ flex: 1, marginTop: 0 }}>
              {loading ? 'Saving...' : task?.id ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
