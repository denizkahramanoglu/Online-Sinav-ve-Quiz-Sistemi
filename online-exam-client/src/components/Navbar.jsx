import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 24px', background: '#1e293b', color: '#fff' }}>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        <Link to="/exams" style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold', fontSize: 18 }}>
          OnlineExam
        </Link>
        {user && (
          <>
            <Link to="/exams" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Sınavlar</Link>
            {user.role === 'Teacher' && (
              <>
                <Link to="/exams/new" style={{ color: '#cbd5e1', textDecoration: 'none' }}>+ Sınav Oluştur</Link>
                <Link to="/dashboard" style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: 'bold' }}>Canlı Pano (SSE)</Link>
              </>
            )}
            {user.role === 'Student' && (
              <Link to="/my-submissions" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Sonuçlarım</Link>
            )}
          </>
        )}
      </div>
      <div>
        {user ? (
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <span style={{ fontSize: 14, color: '#94a3b8' }}>
              {user.fullName} ({user.role === 'Teacher' ? 'Öğretmen' : 'Öğrenci'})
            </span>
            <button onClick={handleLogout} style={{ padding: '6px 12px', cursor: 'pointer', background: '#ef4444', color: '#fff', border: 'none', borderRadius: 4 }}>
              Çıkış
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 12 }}>
            <Link to="/login" style={{ color: '#fff', textDecoration: 'none' }}>Giriş</Link>
            <Link to="/register" style={{ color: '#38bdf8', textDecoration: 'none' }}>Kayıt Ol</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
