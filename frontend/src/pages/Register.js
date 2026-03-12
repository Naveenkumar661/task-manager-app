import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '', password2: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.password2) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      const data = err.response?.data;
      if (data) {
        const msgs = Object.values(data).flat().join(' ');
        setError(msgs);
      } else {
        setError('Registration failed. Try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-box">
        <div className="auth-logo">Task<span>Flow</span></div>
        <h1 className="auth-title">Create account</h1>
        <p className="auth-sub">Start managing your tasks today</p>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={submit}>
          <div className="field">
            <label>Username</label>
            <input name="username" value={form.username} onChange={handle} placeholder="your_username" required />
          </div>
          <div className="field">
            <label>Email</label>
            <input name="email" type="email" value={form.email} onChange={handle} placeholder="you@example.com" required />
          </div>
          <div className="field">
            <label>Password</label>
            <input name="password" type="password" value={form.password} onChange={handle} placeholder="Min 6 characters" required />
          </div>
          <div className="field">
            <label>Confirm Password</label>
            <input name="password2" type="password" value={form.password2} onChange={handle} placeholder="••••••••" required />
          </div>
          <button className="btn-primary" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-switch">
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 600 }}>Sign in</Link>
        </div>
      </div>
    </div>
  );
}
