import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/exams');
    } catch (err) {
      setError(err.response?.data?.message || 'Giriş başarısız. Bilgilerinizi kontrol edin.');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '60px auto', padding: 24, border: '1px solid #ddd', borderRadius: 8 }}>
      <h2>Giriş Yap</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <input type="email" placeholder="E-posta" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ padding: 8 }} />
        <input type="password" placeholder="Şifre" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ padding: 8 }} />
        <button type="submit" style={{ padding: 10, cursor: 'pointer' }}>Giriş Yap</button>
      </form>
      <p style={{ marginTop: 12 }}>
        Hesabın yok mu? <Link to="/register">Kayıt Ol</Link>
      </p>
    </div>
  );
}
