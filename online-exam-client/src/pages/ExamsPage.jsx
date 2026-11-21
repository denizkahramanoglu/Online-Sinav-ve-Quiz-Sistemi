import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function ExamsPage() {
  const { user } = useAuth();
  const [exams, setExams] = useState([]);
  const [search, setSearch] = useState('');
  const [isActive, setIsActive] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchExams = async () => {
    setLoading(true);
    try {
      const params = { page, pageSize: 6 };
      if (search.trim()) params.search = search.trim();
      if (isActive !== '') params.isActive = isActive === 'true';

      const { data } = await api.get('/exams', { params });
      setExams(data.items);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error('Sınavlar yüklenemedi:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, [page, isActive]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchExams();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bu sınavı silmek istediğinize emin misiniz?')) return;
    try {
      await api.delete(/exams/);
      fetchExams();
    } catch (err) {
      alert(err.response?.data?.message || 'Silme işlemi başarısız.');
    }
  };

  return (
    <div style={{ maxWidth: 960, margin: '24px auto', padding: '0 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2>Sınav Listesi</h2>
        {user?.role === 'Teacher' && (
          <Link to="/exams/new" style={{ padding: '8px 16px', background: '#2563eb', color: '#fff', textDecoration: 'none', borderRadius: 6 }}>
            + Yeni Sınav
          </Link>
        )}
      </div>

      <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Sınav başlığı veya açıklama ara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: 220, padding: 8 }}
        />
        <select value={isActive} onChange={(e) => { setIsActive(e.target.value); setPage(1); }} style={{ padding: 8 }}>
          <option value="">Tümü</option>
          <option value="true">Aktif Sınavlar</option>
          <option value="false">Pasif Sınavlar</option>
        </select>
        <button type="submit" style={{ padding: '8px 16px', cursor: 'pointer' }}>Ara</button>
      </form>

      {loading ? (
        <p>Yükleniyor...</p>
      ) : exams.length === 0 ? (
        <p>Kriterlere uygun sınav bulunamadı.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {exams.map((exam) => (
            <div key={exam.id} style={{ border: '1px solid #cbd5e1', borderRadius: 8, padding: 16, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ margin: '0 0 8px 0' }}>{exam.title}</h3>
                  <span style={{ fontSize: 12, padding: '2px 8px', borderRadius: 12, background: exam.isActive ? '#dcfce7' : '#fee2e2', color: exam.isActive ? '#166534' : '#991b1b' }}>
                    {exam.isActive ? 'Aktif' : 'Pasif'}
                  </span>
                </div>
                <p style={{ color: '#475569', fontSize: 14 }}>{exam.description || 'Açıklama yok.'}</p>
                <p style={{ fontSize: 13, color: '#64748b' }}>
                  Süre: {exam.durationMinutes} dk | Soru: {exam.questionCount} | Öğretmen: {exam.teacherName}
                </p>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                {user?.role === 'Student' && exam.isActive && (
                  <Link to={/exams//take} style={{ padding: '6px 12px', background: '#16a34a', color: '#fff', textDecoration: 'none', borderRadius: 4, fontSize: 14 }}>
                    Sınava Gir
                  </Link>
                )}
                {user?.role === 'Teacher' && (
                  <>
                    <Link to={/exams//edit} style={{ padding: '6px 12px', background: '#0284c7', color: '#fff', textDecoration: 'none', borderRadius: 4, fontSize: 14 }}>
                      Düzenle / Sorular
                    </Link>
                    <button onClick={() => handleDelete(exam.id)} style={{ padding: '6px 12px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 14 }}>
                      Sil
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 24, alignItems: 'center' }}>
        <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} style={{ padding: '6px 12px' }}>Önceki</button>
        <span>Sayfa {page} / {totalPages}</span>
        <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} style={{ padding: '6px 12px' }}>Sonraki</button>
      </div>
    </div>
  );
}
