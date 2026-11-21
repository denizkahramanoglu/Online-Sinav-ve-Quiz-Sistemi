import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';

export default function ExamFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [isActive, setIsActive] = useState(true);
  const [questions, setQuestions] = useState([]);

  const [qForm, setQForm] = useState({
    questionText: '', optionA: '', optionB: '', optionC: '', optionD: '', correctOption: 'A', points: 10
  });

  const loadExam = async () => {
    if (!isEdit) return;
    try {
      const { data } = await api.get(/exams/);
      setTitle(data.title);
      setDescription(data.description);
      setDurationMinutes(data.durationMinutes);
      setIsActive(data.isActive);
      setQuestions(data.questions || []);
    } catch (err) {
      alert('Sınav bilgileri yüklenemedi.');
    }
  };

  useEffect(() => {
    loadExam();
  }, [id]);

  const handleSaveExam = async (e) => {
    e.preventDefault();
    try {
      const payload = { title, description, durationMinutes: Number(durationMinutes), isActive };
      if (isEdit) {
        await api.put(/exams/, payload);
        alert('Sınav güncellendi.');
      } else {
        const { data } = await api.post('/exams', payload);
        navigate(/exams//edit);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Kayıt başarısız.');
    }
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    try {
      await api.post(/exams//questions, { ...qForm, points: Number(qForm.points) });
      setQForm({ questionText: '', optionA: '', optionB: '', optionC: '', optionD: '', correctOption: 'A', points: 10 });
      loadExam();
    } catch (err) {
      alert(err.response?.data?.message || 'Soru eklenemedi.');
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    try {
      await api.delete(/exams//questions/);
      loadExam();
    } catch (err) {
      alert('Soru silinemedi.');
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '24px auto', padding: '0 16px' }}>
      <h2>{isEdit ? 'Sınavı Düzenle ve Soru Yönet' : 'Yeni Sınav Oluştur'}</h2>
      <form onSubmit={handleSaveExam} style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32, padding: 16, border: '1px solid #ddd', borderRadius: 8 }}>
        <input type="text" placeholder="Sınav Başlığı" value={title} onChange={(e) => setTitle(e.target.value)} required style={{ padding: 8 }} />
        <textarea placeholder="Açıklama" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} style={{ padding: 8 }} />
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <label>
            Süre (dk):
            <input type="number" min={1} max={300} value={durationMinutes} onChange={(e) => setDurationMinutes(e.target.value)} style={{ marginLeft: 8, width: 70, padding: 6 }} />
          </label>
          <label>
            <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} /> Aktif
          </label>
        </div>
        <button type="submit" style={{ padding: 10, background: '#2563eb', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
          {isEdit ? 'Değişiklikleri Kaydet' : 'Oluştur ve Soru Eklemeye Geç'}
        </button>
      </form>

      {isEdit && (
        <>
          <h3>Sorular ({questions.length})</h3>
          {questions.map((q, idx) => (
            <div key={q.id} style={{ padding: 12, border: '1px solid #e2e8f0', borderRadius: 6, marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>{idx + 1}. {q.questionText} ({q.points} Puan)</strong>
                <button onClick={() => handleDeleteQuestion(q.id)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>Sil</button>
              </div>
              <p style={{ fontSize: 14, margin: '6px 0' }}>A) {q.optionA} | B) {q.optionB} | C) {q.optionC} | D) {q.optionD}</p>
              <small style={{ color: 'green' }}>Doğru Şık: {q.correctOption}</small>
            </div>
          ))}

          <h4 style={{ marginTop: 24 }}>Yeni Soru Ekle</h4>
          <form onSubmit={handleAddQuestion} style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 16, border: '1px solid #ddd', borderRadius: 8 }}>
            <input type="text" placeholder="Soru Metni" value={qForm.questionText} onChange={(e) => setQForm({ ...qForm, questionText: e.target.value })} required style={{ padding: 8 }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <input type="text" placeholder="A Şıkkı" value={qForm.optionA} onChange={(e) => setQForm({ ...qForm, optionA: e.target.value })} required style={{ padding: 8 }} />
              <input type="

@"
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';

export default function ExamFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [isActive, setIsActive] = useState(true);
  const [questions, setQuestions] = useState([]);

  const [qForm, setQForm] = useState({
    questionText: '', optionA: '', optionB: '', optionC: '', optionD: '', correctOption: 'A', points: 10
  });

  const loadExam = async () => {
    if (!isEdit) return;
    try {
      const { data } = await api.get(/exams/);
      setTitle(data.title);
      setDescription(data.description);
      setDurationMinutes(data.durationMinutes);
      setIsActive(data.isActive);
      setQuestions(data.questions || []);
    } catch (err) {
      alert('Sınav bilgileri yüklenemedi.');
    }
  };

  useEffect(() => {
    loadExam();
  }, [id]);

  const handleSaveExam = async (e) => {
    e.preventDefault();
    try {
      const payload = { title, description, durationMinutes: Number(durationMinutes), isActive };
      if (isEdit) {
        await api.put(/exams/, payload);
        alert('Sınav güncellendi.');
      } else {
        const { data } = await api.post('/exams', payload);
        navigate(/exams//edit);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Kayıt başarısız.');
    }
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    try {
      await api.post(/exams//questions, { ...qForm, points: Number(qForm.points) });
      setQForm({ questionText: '', optionA: '', optionB: '', optionC: '', optionD: '', correctOption: 'A', points: 10 });
      loadExam();
    } catch (err) {
      alert(err.response?.data?.message || 'Soru eklenemedi.');
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    try {
      await api.delete(/exams//questions/);
      loadExam();
    } catch (err) {
      alert('Soru silinemedi.');
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '24px auto', padding: '0 16px' }}>
      <h2>{isEdit ? 'Sınavı Düzenle ve Soru Yönet' : 'Yeni Sınav Oluştur'}</h2>
      <form onSubmit={handleSaveExam} style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32, padding: 16, border: '1px solid #ddd', borderRadius: 8 }}>
        <input type="text" placeholder="Sınav Başlığı" value={title} onChange={(e) => setTitle(e.target.value)} required style={{ padding: 8 }} />
        <textarea placeholder="Açıklama" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} style={{ padding: 8 }} />
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <label>
            Süre (dk):
            <input type="number" min={1} max={300} value={durationMinutes} onChange={(e) => setDurationMinutes(e.target.value)} style={{ marginLeft: 8, width: 70, padding: 6 }} />
          </label>
          <label>
            <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} /> Aktif
          </label>
        </div>
        <button type="submit" style={{ padding: 10, background: '#2563eb', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
          {isEdit ? 'Değişiklikleri Kaydet' : 'Oluştur ve Soru Eklemeye Geç'}
        </button>
      </form>

      {isEdit && (
        <>
          <h3>Sorular ({questions.length})</h3>
          {questions.map((q, idx) => (
            <div key={q.id} style={{ padding: 12, border: '1px solid #e2e8f0', borderRadius: 6, marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>{idx + 1}. {q.questionText} ({q.points} Puan)</strong>
                <button onClick={() => handleDeleteQuestion(q.id)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>Sil</button>
              </div>
              <p style={{ fontSize: 14, margin: '6px 0' }}>A) {q.optionA} | B) {q.optionB} | C) {q.optionC} | D) {q.optionD}</p>
              <small style={{ color: 'green' }}>Doğru Şık: {q.correctOption}</small>
            </div>
          ))}

          <h4 style={{ marginTop: 24 }}>Yeni Soru Ekle</h4>
          <form onSubmit={handleAddQuestion} style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 16, border: '1px solid #ddd', borderRadius: 8 }}>
            <input type="text" placeholder="Soru Metni" value={qForm.questionText} onChange={(e) => setQForm({ ...qForm, questionText: e.target.value })} required style={{ padding: 8 }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <input type="text" placeholder="A Şıkkı" value={qForm.optionA} onChange={(e) => setQForm({ ...qForm, optionA: e.target.value })} required style={{ padding: 8 }} />
              <input type="text" placeholder="B Şıkkı" value={qForm.optionB} onChange={(e) => setQForm({ ...qForm, optionB: e.target.value })} required style={{ padding: 8 }} />
              <input type="text" placeholder="C Şıkkı" value={qForm.optionC} onChange={(e) => setQForm({ ...qForm, optionC: e.target.value })} required style={{ padding: 8 }} />
              <input type="text" placeholder="D Şıkkı" value={qForm.optionD} onChange={(e) => setQForm({ ...qForm, optionD: e.target.value })} required style={{ padding: 8 }} />
            </div>
            <div style={{ display: 'flex', gap: 16 }}>
              <label>
                Doğru Şık:
                <select value={qForm.correctOption} onChange={(e) => setQForm({ ...qForm, correctOption: e.target.value })} style={{ marginLeft: 8, padding: 6 }}>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                </select>
              </label>
              <label>
                Puan:
                <input type="number" min={1} max={100} value={qForm.points} onChange={(e) => setQForm({ ...qForm, points: e.target.value })} style={{ marginLeft: 8, width: 70, padding: 6 }} />
              </label>
            </div>
            <button type="submit" style={{ padding: 10, background: '#16a34a', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
              Soru Ekle
            </button>
          </form>
        </>
      )}
    </div>
  );
}
