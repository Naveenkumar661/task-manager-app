import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-box">
        <div className="auth-logo">Task<span>Flow</span></div>
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-sub">Sign in to manage your tasks</p>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={submit}>
          <div className="field">
            <label>Username</label>
            <input name="username" value={form.username} onChange={handle} placeholder="your_username" required />
          </div>
          <div className="field">
            <label>Password</label>
            <input name="password" type="password" value={form.password} onChange={handle} placeholder="••••••••" required />
          </div>
          <button className="btn-primary" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-switch">
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--accent)', fontWeight: 600 }}>Create one</Link>
        </div>
      </div>
    </div>
  );
}
