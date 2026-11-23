import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';

export default function TakeExamPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const { data } = await api.get(/exams/);
        setExam(data);
        setTimeLeft(data.durationMinutes * 60);
      } catch (err) {
        setError(err.response?.data?.message || 'Sınav yüklenemedi.');
      }
    };
    fetchExam();
  }, [id]);

  // Geri sayım sayacı
  useEffect(() => {
    if (timeLeft === null || result) return;
    if (timeLeft <= 0) {
      handleSubmit(true);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, result]);

  const handleSelect = (questionId, option) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleSubmit = async (autoSubmit = false) => {
    if (submitting || result) return;
    if (!autoSubmit && !window.confirm('Sınavı bitirip göndermek istediğinize emin misiniz?')) {
      return;
    }

    setSubmitting(true);
    try {
      const formattedAnswers = Object.entries(answers).map(([questionId, selectedOption]) => ({
        questionId: Number(questionId),
        selectedOption,
      }));

      const { data } = await api.post(/submissions/exams/, {
        answers: formattedAnswers,
      });
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Sınav gönderilirken hata oluştu.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return ${String(m).padStart(2, '0')}:;
  };

  if (error) return <div style={{ maxWidth: 700, margin: '40px auto', color: 'red' }}>{error}</div>;
  if (!exam) return <div style={{ maxWidth: 700, margin: '40px auto' }}>Sınav yükleniyor...</div>;

  if (result) {
    return (
      <div style={{ maxWidth: 600, margin: '40px auto', padding: 24, border: '1px solid #cbd5e1', borderRadius: 8, textAlign: 'center' }}>
        <h2>Sınav Tamamlandı!</h2>
        <p style={{ fontSize: 18, margin: '12px 0' }}><strong>{result.examTitle}</strong></p>
        <div style={{ fontSize: 32, fontWeight: 'bold', color: '#16a34a', margin: '16px 0' }}>
          {result.totalScore} / {result.maxPossibleScore} Puan
        </div>
        <p>Doğru Sayısı: <strong>{result.correctCount} / {result.totalQuestions}</strong></p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 24 }}>
          <button onClick={() => navigate('/my-submissions')} style={{ padding: '10px 16px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
            Tüm Sonuçlarım
          </button>
          <button onClick={() => navigate('/exams')} style={{ padding: '10px 16px', background: '#475569', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
            Sınav Listesine Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: '24px auto', padding: '0 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 16, background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 8, marginBottom: 24, position: 'sticky', top: 0 }}>
        <div>
          <h2 style={{ margin: 0 }}>{exam.title}</h2>
          <small style={{ color: '#64748b' }}>Toplam {exam.questions.length} Soru</small>
        </div>
        <div style={{ fontSize: 20, fontWeight: 'bold', color: timeLeft < 60 ? '#dc2626' : '#0f172a' }}>
          Kalan Süre: {formatTime(timeLeft)}
        </div>
      </div>

      {exam.questions.length === 0 ? (
        <p>Bu sınavda henüz soru bulunmuyor.</p>
      ) : (
        exam.questions.map((q, idx) => (
          <div key={q.id} style={{ padding: 16, border: '1px solid #e
@"
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';

export default function TakeExamPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const { data } = await api.get(/exams/);
        setExam(data);
        setTimeLeft(data.durationMinutes * 60);
      } catch (err) {
        setError(err.response?.data?.message || 'Sınav yüklenemedi.');
      }
    };
    fetchExam();
  }, [id]);

  // Geri sayım sayacı
  useEffect(() => {
    if (timeLeft === null || result) return;
    if (timeLeft <= 0) {
      handleSubmit(true);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, result]);

  const handleSelect = (questionId, option) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleSubmit = async (autoSubmit = false) => {
    if (submitting || result) return;
    if (!autoSubmit && !window.confirm('Sınavı bitirip göndermek istediğinize emin misiniz?')) {
      return;
    }

    setSubmitting(true);
    try {
      const formattedAnswers = Object.entries(answers).map(([questionId, selectedOption]) => ({
        questionId: Number(questionId),
        selectedOption,
      }));

      const { data } = await api.post(/submissions/exams/, {
        answers: formattedAnswers,
      });
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Sınav gönderilirken hata oluştu.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return ${String(m).padStart(2, '0')}:;
  };

  if (error) return <div style={{ maxWidth: 700, margin: '40px auto', color: 'red' }}>{error}</div>;
  if (!exam) return <div style={{ maxWidth: 700, margin: '40px auto' }}>Sınav yükleniyor...</div>;

  if (result) {
    return (
      <div style={{ maxWidth: 600, margin: '40px auto', padding: 24, border: '1px solid #cbd5e1', borderRadius: 8, textAlign: 'center' }}>
        <h2>Sınav Tamamlandı!</h2>
        <p style={{ fontSize: 18, margin: '12px 0' }}><strong>{result.examTitle}</strong></p>
        <div style={{ fontSize: 32, fontWeight: 'bold', color: '#16a34a', margin: '16px 0' }}>
          {result.totalScore} / {result.maxPossibleScore} Puan
        </div>
        <p>Doğru Sayısı: <strong>{result.correctCount} / {result.totalQuestions}</strong></p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 24 }}>
          <button onClick={() => navigate('/my-submissions')} style={{ padding: '10px 16px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
            Tüm Sonuçlarım
          </button>
          <button onClick={() => navigate('/exams')} style={{ padding: '10px 16px', background: '#475569', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
            Sınav Listesine Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: '24px auto', padding: '0 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 16, background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 8, marginBottom: 24, position: 'sticky', top: 0 }}>
        <div>
          <h2 style={{ margin: 0 }}>{exam.title}</h2>
          <small style={{ color: '#64748b' }}>Toplam {exam.questions.length} Soru</small>
        </div>
        <div style={{ fontSize: 20, fontWeight: 'bold', color: timeLeft < 60 ? '#dc2626' : '#0f172a' }}>
          Kalan Süre: {formatTime(timeLeft)}
        </div>
      </div>

      {exam.questions.length === 0 ? (
        <p>Bu sınavda henüz soru bulunmuyor.</p>
      ) : (
        exam.questions.map((q, idx) => (
          <div key={q.id} style={{ padding: 16, border: '1px solid #e2e8f0', borderRadius: 8, marginBottom: 16 }}>
            <p style={{ fontWeight: 'bold', marginBottom: 12 }}>
              {idx + 1}. {q.questionText} <span style={{ color: '#64748b', fontWeight: 'normal' }}>({q.points} Puan)</span>
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {['A', 'B', 'C', 'D'].map((opt) => {
                const text = q[option];
                return (
                  <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 8, borderRadius: 6, cursor: 'pointer', background: answers[q.id] === opt ? '#dbeafe' : '#fff', border: '1px solid #cbd5e1' }}>
                    <input
                      type="radio"
                      name={question-}
                      value={opt}
                      checked={answers[q.id] === opt}
                      onChange={() => handleSelect(q.id, opt)}
                    />
                    <span><strong>{opt})</strong> {text}</span>
                  </label>
                );
              })}
            </div>
          </div>
        ))
      )}

      {exam.questions.length > 0 && (
        <button
          disabled={submitting}
          onClick={() => handleSubmit(false)}
          style={{ width: '100%', padding: 14, background: '#16a34a', color: '#fff', fontSize: 16, fontWeight: 'bold', border: 'none', borderRadius: 8, cursor: 'pointer', marginBottom: 40 }}
        >
          {submitting ? 'Gönderiliyor...' : 'Sınavı Bitir ve Gönder'}
        </button>
      )}
    </div>
  );
}
