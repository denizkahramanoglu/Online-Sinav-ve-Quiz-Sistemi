import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function MySubmissionsPage() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const { data } = await api.get('/submissions/my');
        setSubmissions(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Sonuçlar yüklenirken hata oluştu.');
      } finally {
        setLoading(false);
      }
    };
    fetchSubmissions();
  }, []);

  if (loading) return <div style={{ maxWidth: 900, margin: '32px auto', padding: '0 16px' }}>Yükleniyor...</div>;
  if (error) return <div style={{ maxWidth: 900, margin: '32px auto', padding: '0 16px', color: 'red' }}>{error}</div>;

  return (
    <div style={{ maxWidth: 900, margin: '24px auto', padding: '0 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2>Geçmiş Sınav Sonuçlarım</h2>
        <Link to="/exams" style={{ padding: '8px 14px', background: '#2563eb', color: '#fff', textDecoration: 'none', borderRadius: 6 }}>
          Sınavlara Dön
        </Link>
      </div>

      {submissions.length === 0 ? (
        <div style={{ padding: 24, border: '1px solid #cbd5e1', borderRadius: 8, textAlign: 'center', color: '#64748b' }}>
          Henüz tamamladığınız bir sınav bulunmuyor.
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #cbd5e1' }}>
            <thead>
              <tr style={{ background: '#f1f5f9', textAlign: 'left' }}>
                <th style={{ padding: 12, borderBottom: '1px solid #cbd5e1' }}>Sınav</th>
                <th style={{ padding: 12, borderBottom: '1px solid #cbd5e1' }}>Doğru / Toplam</th>
                <th style={{ padding: 12, borderBottom: '1px solid #cbd5e1' }}>Puan</th>
                <th style={{ padding: 12, borderBottom: '1px solid #cbd5e1' }}>Tamamlanma Tarihi</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((sub) => {
                const percent = sub.maxPossibleScore > 0 ? Math.round((sub.totalScore / sub.maxPossibleScore) * 100) : 0;
                return (
                  <tr key={sub.submissionId} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: 12, fontWeight: 'bold' }}>{sub.examTitle}</td>
                    <td style={{ padding: 12 }}>{sub.correctCount} / {sub.totalQuestions}</td>
                    <td style={{ padding: 12 }}>
                      <span style={{ fontWeight: 'bold', color: percent >= 50 ? '#16a34a' : '#dc2626' }}>
                        {sub.totalScore} / {sub.maxPossibleScore} (%{percent})
                      </span>
                    </td>
                    <td style={{ padding: 12, color: '#475569', fontSize: 14 }}>
                      {new Date(sub.completedAt).toLocaleString('tr-TR')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
