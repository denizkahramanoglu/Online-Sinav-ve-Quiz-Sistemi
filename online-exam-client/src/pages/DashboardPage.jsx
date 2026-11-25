import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const [metrics, setMetrics] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const eventSource = new EventSource('http://localhost:5086/api/dashboard/stream');

    eventSource.onopen = () => setConnected(true);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setMetrics(data);
        setConnected(true);
      } catch (err) {
        console.error('SSE verisi ayrıştırılamadı:', err);
      }
    };

    eventSource.onerror = () => {
      setConnected(false);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div style={{ maxWidth: 960, margin: '24px auto', padding: '0 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2>Canlı Yönetici Panosu (SSE)</h2>
        <span style={{ padding: '4px 12px', borderRadius: 12, fontSize: 13, fontWeight: 'bold', background: connected ? '#dcfce7' : '#fee2e2', color: connected ? '#166534' : '#991b1b' }}>
          {connected ? '● Canlı Bağlı' : '○ Bağlantı Bekleniyor...'}
        </span>
      </div>

      {!metrics ? (
        <p>Canlı veriler yükleniyor...</p>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
            <div style={{ padding: 20, background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 8 }}>
              <div style={{ color: '#64748b', fontSize: 14 }}>Toplam Sınav</div>
              <div style={{ fontSize: 28, fontWeight: 'bold', marginTop: 6 }}>{metrics.totalExams}</div>
            </div>
            <div style={{ padding: 20, background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 8 }}>
              <div style={{ color: '#64748b', fontSize: 14 }}>Kayıtlı Öğrenci</div>
              <div style={{ fontSize: 28, fontWeight: 'bold', marginTop: 6 }}>{metrics.totalStudents}</div>
            </div>
            <div style={{ padding: 20, background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 8 }}>
              <div style={{ color: '#64748b', fontSize: 14 }}>Tamamlanan Sınav</div>
              <div style={{ fontSize: 28, fontWeight: 'bold', marginTop: 6 }}>{metrics.totalSubmissions}</div>
            </div>
            <div style={{ padding: 20, background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 8 }}>
              <div style={{ color: '#64748b', fontSize: 14 }}>Ortalama Puan</div>
              <div style={{ fontSize: 28, fontWeight: 'bold', marginTop: 6, color: '#2563eb' }}>{metrics.averageScore}</div>
            </div>
          </div>

          <h3>Son Tamamlanan Sınavlar (Anlık Akış)</h3>
          {metrics.recentSubmissions.length === 0 ? (
            <p style={{ color: '#64748b' }}>Henüz tamamlanan sınav yok. Bir öğrenci sınavı bitirdiğinde burası sayfa yenilenmeden anında güncellenecektir.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #cbd5e1' }}>
              <thead>
                <tr style={{ background: '#f1f5f9', textAlign: 'left' }}>
                  <th style={{ padding: 10, borderBottom: '1px solid #cbd5e1' }}>Öğrenci</th>
                  <th style={{ padding: 10, borderBottom: '1px solid #cbd5e1' }}>Sınav</th>
                  <th style={{ padding: 10, borderBottom: '1px solid #cbd5e1' }}>Puan</th>
                  <th style={{ padding: 10, borderBottom: '1px solid #cbd5e1' }}>Tarih</th>
                </tr>
              </thead>
              <tbody>
                {metrics.recentSubmissions.map((item) => (
                  <tr key={item.submissionId} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: 10 }}>{item.studentName}</td>
                    <td style={{ padding: 10 }}>{item.examTitle}</td>
                    <td style={{ padding: 10, fontWeight: 'bold', color: '#16a34a' }}>{item.score}</td>
                    <td style={{ padding: 10, fontSize: 13, color: '#475569' }}>{new Date(item.completedAt).toLocaleString('tr-TR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
}
