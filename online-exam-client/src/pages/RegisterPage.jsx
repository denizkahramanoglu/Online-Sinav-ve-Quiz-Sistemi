import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Student');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(fullName, email, password, role);
      navigate('/exams');
    } catch (err) {
      setError(err.response?.data?.message || 'Kayıt sırasında hata oluştu.');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '60px auto', padding: 24, border: '1px solid #ddd', borderRadius: 8 }}>
      <h2>Kayıt Ol</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <input type="text" placeholder="Ad Soyad" value={fullName} onChange={(e) => setFullName(e.target.value)} required style={{ padding: 8 }} />
        <input type="email" placeholder="E-posta" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ padding: 8 }} />
        <input type="password" placeholder="Şifre (min 6 karakter)" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} style={{ padding: 8 }} />
        <select value={role} onChange={(e) => setRole(e.target.value)} style={{ padding: 8 }}>
          <option value="Student">Öğrenci</option>
          <option value="Teacher">Öğretmen</option>
        </select>
        <button type="submit" style={{ padding: 10, cursor: 'pointer' }}>Kayıt Ol</button>
      </form>
      <p style={{ marginTop: 12 }}>
        Zaten hesabın var mı? <Link to="/login">Giriş Yap</Link>
      </p>
    </div>
  );
}
