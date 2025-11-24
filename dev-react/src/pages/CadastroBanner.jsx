const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8080').replace(/\/$/, '');
// Utilitário para obter o token JWT do localStorage
function getAuthToken() {
  return localStorage.getItem('token');
}
import React, { useState, useEffect } from 'react';
import AlertModal from '../components/AlertModal';
import ConfirmModal from '../components/ConfirmModal';

// Utilitário para converter arquivo em base64
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
}
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import '../styles/cadastroBanner.css';

const CadastroBanner = () => {
  const navigate = useNavigate();
  const [currentBanner, setCurrentBanner] = useState('');
  const [preview, setPreview] = useState('');
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false);
  const [syncLoading, setSyncLoading] = useState(false);
  const [showPreviewItem, setShowPreviewItem] = useState(null);
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [syncUrlInput, setSyncUrlInput] = useState('');
  const [syncTokenInput, setSyncTokenInput] = useState('');
  const [serverBanners, setServerBanners] = useState([]);
  const [showServerBanners, setShowServerBanners] = useState(false);
  const [bannerForm, setBannerForm] = useState({
    titulo: '',
    linkDestino: 'http://localhost:5173/catalogo',
    ativo: true,
    dataInicio: '',
    dataFim: ''
  });

  // Fetch initial data and setup
  useEffect(() => {
    const token = getAuthToken();
    const headers = { ...(token ? { Authorization: `Bearer ${token}` } : {}) };
    
    // Load current banner
    fetch(`${API_BASE}/banners/ativo/home`, { headers })
      .then(res => res.ok ? res.json() : '')
      .then(data => {
        if (data && data.imagemUrl) setCurrentBanner(data.imagemUrl);
      })
      .catch(err => console.error('Erro ao carregar banner atual:', err));

    // Load banner history
    fetch(`${API_BASE}/banners`)
      .then(res => res.ok ? res.json() : [])
      .then(data => setHistory(Array.isArray(data) ? data : []))
      .catch(() => {});

    // Load server banners if enabled
    loadServerBanners();
  }, []);

  const loadServerBanners = async () => {
    try {
      const BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8080').replace(/\/$/, '');
      const token = getAuthToken();
      const headers = { ...(token ? { Authorization: `Bearer ${token}` } : {}) };
      const res = await fetch(`${BASE}/banners?ativo=true`, { headers });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setServerBanners(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erro ao carregar banners do servidor:', error);
    }
  };

  const handleCreateBanner = async () => {
    if (loading) return;
    setLoading(true);
    try {
      let imagemUrl = preview;
      const token = getAuthToken();

      // Se há um arquivo novo, fazer upload para o servidor de uploads (dev)
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('titulo', bannerForm.titulo || 'banner');

        // Upload para o endpoint correto do backend
        const resUpload = await fetch(`${API_BASE}/banners/upload`, {
          method: 'POST',
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: formData
        });
        if (!resUpload.ok) throw new Error('Falha no upload da imagem');
        const uploadData = await resUpload.json();
        imagemUrl = uploadData.imagemUrl || uploadData.url || imagemUrl;
      }
      // Enviar dados do banner
      const payload = { ...bannerForm, imagemUrl };
      // Remove ordem do payload se existir
      if (payload.ordem !== undefined) delete payload.ordem;
      const headers = { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
      const res = await fetch(`${API_BASE}/banners`, { method: 'POST', headers, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setMessage({ text: 'Banner criado com sucesso!', type: 'success' });
      setFile(null);
      setPreview('');
      setBannerForm({
        titulo: '',
        linkDestino: 'http://localhost:5173/catalogo',
        ativo: true,
        dataInicio: '',
        dataFim: ''
      });
      setTimeout(() => {
        setMessage({ text: '', type: '' });
      }, 3000);
      // Atualizar histórico
      fetch(`${API_BASE}/banners`)
        .then(res => res.ok ? res.json() : [])
        .then(data => setHistory(Array.isArray(data) ? data : []))
        .catch(() => {});
    } catch (error) {
      setMessage({ text: 'Erro ao criar banner: ' + error.message, type: 'error' });
      console.error('Erro ao criar banner:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteServerBanner = async (bannerId) => {
    if (!window.confirm('Deseja realmente excluir este banner do servidor?')) {
      return;
    }

    try {
      const BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8080').replace(/\/$/, '');
      const token = getAuthToken();
      const headers = { ...(token ? { Authorization: `Bearer ${token}` } : {}) };
      const res = await fetch(`${BASE}/banners/${bannerId}`, { method: 'DELETE', headers });
      if (!res.ok && res.status !== 204) throw new Error(`HTTP ${res.status}`);
      setMessage({ text: 'Banner excluído com sucesso!', type: 'success' });
      await loadServerBanners();
      
      setTimeout(() => {
        setMessage({ text: '', type: '' });
      }, 3000);
    } catch (error) {
      setMessage({ text: 'Erro ao excluir banner: ' + error.message, type: 'error' });
      console.error('Erro ao excluir banner:', error);
    }
  };

  const handleToggleBannerStatus = async (bannerId, currentStatus) => {
    try {
      const BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8080').replace(/\/$/, '');
      const token = getAuthToken();
      const headers = { ...(token ? { Authorization: `Bearer ${token}` } : {}) };
      const res = await fetch(`${BASE}/banners/${bannerId}/toggle`, { method: 'PATCH', headers });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setMessage({ 
        text: `Banner ${currentStatus ? 'desativado' : 'ativado'} com sucesso!`, 
        type: 'success' 
      });
      await loadServerBanners();
      
      setTimeout(() => {
        setMessage({ text: '', type: '' });
      }, 3000);
    } catch (error) {
      setMessage({ text: 'Erro ao alterar status do banner: ' + error.message, type: 'error' });
      console.error('Erro ao alterar status do banner:', error);
    }
  };

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Validar tipo de arquivo
    if (!selectedFile.type.startsWith('image/')) {
      setMessage({ text: 'Por favor, selecione apenas arquivos de imagem.', type: 'error' });
      return;
    }

    // Validar tamanho (máximo 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setMessage({ text: 'O arquivo deve ter no máximo 5MB.', type: 'error' });
      return;
    }

    setFile(selectedFile);
    setLoading(true);

    try {
      // Converter para base64 para preview
      const base64 = await fileToBase64(selectedFile);
      setPreview(base64);
      setMessage({ text: 'Imagem selecionada. Clique em "Salvar Banner" para aplicar.', type: 'info' });
    } catch (error) {
      setMessage({ text: 'Erro ao processar a imagem. Tente novamente.', type: 'error' });
      console.error('Erro ao processar arquivo:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!file && !preview) {
      setMessage({ text: 'Selecione uma imagem primeiro.', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      let bannerUrl = preview;

      // Se há um arquivo novo, fazer upload para o servidor de uploads (dev)
      if (file) {
        try {
          const body = await uploadFile(file);
          // upload server returns an URL like /uploads/xxxx
          if (body && body.url) bannerUrl = body.url;
          else if (body && body.fileName) bannerUrl = `/uploads/${body.fileName}`;
          else {
            // fallback to base64 if upload didn't return expected shape
            bannerUrl = await fileToBase64(file);
          }
        } catch (err) {
          console.warn('Upload failed, falling back to base64 preview:', err);
          bannerUrl = await fileToBase64(file);
        }
      }

      // Salvar localmente (banner da home)
      const success = saveBannerUrl(bannerUrl);
      if (success) {
        setCurrentBanner(bannerUrl);
        setMessage({ text: 'Banner salvo com sucesso!', type: 'success' });
        setFile(null);

        // atualizar histórico local
        try {
          const h = getBannerHistory();
          setHistory(h);
        } catch (e) {
          console.warn('Erro ao atualizar histórico local após salvar:', e);
        }

        // Limpar mensagem após 3 segundos
        setTimeout(() => {
          setMessage({ text: '', type: '' });
        }, 3000);
      } else {
        setMessage({ text: 'Erro ao salvar o banner. Tente novamente.', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Erro ao salvar o banner. Tente novamente.', type: 'error' });
      console.error('Erro ao salvar banner:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setShowRestoreConfirm(true);
  };

  const confirmRestoreBanner = async () => {
    setShowRestoreConfirm(false);
    setLoading(true);
    try {
      // Buscar banner padrão ativo (ordem=0)
      const res = await fetch(`${API_BASE}/banners?ativo=true&ordem=0`);
      if (!res.ok) throw new Error('Não foi possível buscar o banner padrão');
      const banners = await res.json();
      if (Array.isArray(banners) && banners.length > 0) {
        const bannerPadrao = banners[0];
        setCurrentBanner(bannerPadrao.imagemUrl);
        setFile(null);
        setMessage({ text: 'Banner padrão restaurado com sucesso!', type: 'success' });
      } else {
        setMessage({ text: 'Nenhum banner padrão ativo encontrado.', type: 'error' });
      }
      setTimeout(() => {
        setMessage({ text: '', type: '' });
      }, 3000);
    } catch (error) {
      setMessage({ text: 'Erro ao restaurar banner padrão.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setPreview(currentBanner || '');
    setFile(null);
    setMessage({ text: '', type: '' });
  };

  const handleUseHistory = async (item) => {
    if (!item || !item.id) return;
    try {
      // Tornar o banner selecionado como ativo na Home (PATCH)
      const token = getAuthToken();
      const headers = { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
      // Ativa o banner e define ordem 0
      const res = await fetch(`${API_BASE}/banners/${item.id}/ativo?ativo=true`, { method: 'PATCH', headers });
      if (!res.ok) throw new Error('Erro ao ativar banner');
      // Atualiza visualmente
      setCurrentBanner(item.imagemUrl);
      setMessage({ text: 'Banner ativado na Home com sucesso!', type: 'success' });
      // Atualiza histórico
      fetch(`${API_BASE}/banners`)
        .then(res => res.ok ? res.json() : [])
        .then(data => setHistory(Array.isArray(data) ? data : []))
        .catch(() => {});
      setTimeout(() => setMessage({ text: '', type: '' }), 2500);
    } catch (error) {
      setMessage({ text: 'Erro ao ativar banner do histórico.', type: 'error' });
    }
  };

  const handleDeleteHistory = (item) => {
    if (!item || !item.url) return;
    if (!window.confirm('Deseja realmente remover este banner do histórico?')) return;
    const ok = removeBannerFromHistory(item.url);
    if (ok) {
      try {
        const h = getBannerHistory();
        setHistory(h);
      } catch (e) {
        console.warn('Erro ao recarregar histórico após remoção:', e);
      }
      setMessage({ text: 'Banner removido do histórico.', type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 2000);
    } else {
      setMessage({ text: 'Erro ao remover do histórico.', type: 'error' });
    }
  };

  const handlePreview = (item) => {
    setShowPreviewItem(item);
  };

  const closePreview = () => setShowPreviewItem(null);

  const handleClearHistory = () => {
    setShowClearConfirm(true);
  };

  const confirmClearHistory = () => {
    const ok = clearBannerHistory();
    setShowClearConfirm(false);
    if (ok) {
      setHistory([]);
      setMessage({ text: 'Histórico limpo com sucesso.', type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 2000);
    } else {
      setMessage({ text: 'Erro ao limpar histórico.', type: 'error' });
      setTimeout(() => setMessage({ text: '', type: '' }), 2000);
    }
  };
  const handleSyncToServer = () => {
    // open modal to input server URL and optional token
    setSyncUrlInput('');
    setSyncTokenInput('');
    setShowSyncModal(true);
  };

  const confirmSync = async () => {
    if (!syncUrlInput) {
      setMessage({ text: 'Informe a URL do endpoint para sincronizar.', type: 'error' });
      return;
    }
    setShowSyncModal(false);
    setSyncLoading(true);
    try {
      const res = await syncBannerHistory(syncUrlInput, syncTokenInput || undefined);
      if (res && res.ok) setMessage({ text: 'Histórico sincronizado com sucesso.', type: 'success' });
      else {
        const errMsg = res && res.error ? res.error : `Resposta do servidor: ${res && res.status}`;
        setMessage({ text: `Falha ao sincronizar: ${errMsg}`, type: 'error' });
      }
    } catch (e) {
      setMessage({ text: 'Erro ao sincronizar histórico.', type: 'error' });
      console.error(e);
    } finally {
      setSyncLoading(false);
      setTimeout(() => setMessage({ text: '', type: '' }), 3500);
    }
  };

  const exportHistory = () => {
    try {
      const h = getBannerHistory();
      const blob = new Blob([JSON.stringify(h, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'banner-history.json';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Erro ao exportar histórico:', e);
      setMessage({ text: 'Erro ao exportar histórico.', type: 'error' });
      setTimeout(() => setMessage({ text: '', type: '' }), 2500);
    }
  };

  const importHistoryFile = async (file) => {
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      if (!Array.isArray(parsed)) throw new Error('JSON inválido');
      // merge: new entries first, avoid duplicates by url
      const existing = getBannerHistory();
      const urls = new Set(existing.map((e) => e.url));
      const merged = [...parsed.filter((p) => p && p.url && !urls.has(p.url)), ...existing];
      localStorage.setItem('home_banner_history_v1', JSON.stringify(merged.slice(0, 50)));
      setHistory(merged.slice(0, 50));
      setMessage({ text: 'Histórico importado com sucesso.', type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 2500);
    } catch (e) {
      console.error('Erro ao importar histórico:', e);
      setMessage({ text: 'Erro ao importar histórico. Verifique o arquivo.', type: 'error' });
      setTimeout(() => setMessage({ text: '', type: '' }), 2500);
    }
  };

  const handleImportInput = (e) => {
    const f = e.target.files && e.target.files[0];
    if (f) importHistoryFile(f);
    // reset input
    e.target.value = '';
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBannerForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const seedSampleHistory = () => {
    // create small SVG placeholders as data URLs
    const makeSvg = (text, color) => {
      const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='400'><rect width='100%' height='100%' fill='${color}'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='48' fill='#fff' font-family='Arial'>${text}</text></svg>`;
      return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
    };
    const samples = [
      { url: makeSvg('Banner A', '#ff6b6b'), savedAt: new Date().toISOString() },
      { url: makeSvg('Banner B', '#6b9eff'), savedAt: new Date().toISOString() },
      { url: makeSvg('Banner C', '#8d6bff'), savedAt: new Date().toISOString() }
    ];
    try {
      const existing = getBannerHistory();
      const merged = [...samples, ...existing];
      localStorage.setItem('home_banner_history_v1', JSON.stringify(merged.slice(0, 50)));
      setHistory(merged.slice(0, 50));
      setMessage({ text: 'Histórico de exemplo adicionado.', type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 2000);
    } catch (e) {
      console.error('Erro ao semear histórico:', e);
      setMessage({ text: 'Erro ao adicionar exemplos.', type: 'error' });
    }
  };

  // Utilitário para garantir src absoluto para imagens do backend
  function getBannerImageSrc(src) {
    if (!src) return '';
    // Se já é base64 ou começa com http(s), retorna direto
    if (src.startsWith('data:image') || src.startsWith('http')) return src;
    // Se começa com /uploads, monta URL absoluta do backend
    if (src.startsWith('/uploads')) {
      return `${API_BASE}${src}`;
    }
    // Se é apenas o nome do arquivo, monta URL do backend
    if (/^[a-f0-9\-_.]+\.(png|jpg|jpeg|webp)$/i.test(src)) {
      return `${API_BASE}/uploads/${src}`;
    }
    return src;
  }

  return (
    <>
      <AlertModal
        isOpen={alert.open}
        type={alert.type}
        message={alert.text}
        onClose={() => setAlert({ open: false, text: '', type: 'info' })}
      />
      <ConfirmModal
        isOpen={showRestoreConfirm}
        message="Deseja realmente restaurar o banner padrão?"
        onConfirm={confirmRestoreBanner}
        onCancel={() => setShowRestoreConfirm(false)}
      />
      <div className="admin-banner-container">
        <Sidebar />
        <div className="admin-banner-content">
          <header className="admin-banner-header">
            <h1 className="admin-banner-title">Cadastro e Gerenciamento de Banners</h1>
            <p className="admin-banner-subtitle">
              Cadastre, visualize e gerencie os banners exibidos na Home. Acompanhe o histórico e banners do servidor.
            </p>
          </header>
          <div className="admin-banner-grid">
            {/* Cadastro e Preview */}
            <section className="admin-banner-section admin-banner-section--cadastro">
              <h2 className="section-title">Cadastrar Novo Banner</h2>
              <div className="admin-banner-form-wrapper">
                <div className="admin-banner-upload">
                  <label htmlFor="banner-upload" className="admin-banner-upload-label">
                    <i className="bi bi-cloud-upload"></i>
                    <span>Selecionar Imagem</span>
                    <input
                      id="banner-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      disabled={loading}
                      className="admin-banner-upload-input"
                    />
                  </label>
                  <p className="admin-banner-upload-hint">
                    Formatos: JPG, PNG, WEBP | Máx: 5MB
                  </p>
                </div>
                <div className="admin-banner-preview">
                  <h3>Preview</h3>
                  <div className="admin-banner-preview-container">
                    {preview ? (
                      <img src={getBannerImageSrc(preview)} alt="Preview do banner" className="admin-banner-preview-image" />
                    ) : (
                      <div className="admin-banner-preview-placeholder">
                        <i className="bi bi-image"></i>
                        <p>Nenhuma imagem selecionada</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <form className="admin-banner-form">
                <h4>Informações do Banner</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label>Título</label>
                    <input type="text" name="titulo" value={bannerForm.titulo} onChange={handleFormChange} placeholder="Título (opcional)" />
                  </div>
                  <div className="form-group">
                    <label>Link de Destino</label>
                    <input type="url" name="linkDestino" value={bannerForm.linkDestino} onChange={handleFormChange} placeholder="URL ao clicar" />
                  </div>
                  {/* Campo de ordem removido do formulário */}
                  <div className="form-group">
                    <label>Ativo</label>
                    <input type="checkbox" name="ativo" checked={bannerForm.ativo} onChange={handleFormChange} />
                  </div>
                  <div className="form-group">
                    <label>Data Início</label>
                    <input type="date" name="dataInicio" value={bannerForm.dataInicio} onChange={handleFormChange} />
                  </div>
                  <div className="form-group">
                    <label>Data Fim</label>
                    <input type="date" name="dataFim" value={bannerForm.dataFim} onChange={handleFormChange} />
                  </div>
                </div>
                <div className="admin-banner-actions">
                  <button type="button" className="admin-banner-btn admin-banner-btn--success" onClick={handleCreateBanner} disabled={loading || (!file && !preview)}>
                    {loading ? 'Criando...' : 'Criar Banner'}
                  </button>
                  {(file || preview !== currentBanner) && (
                    <button type="button" className="admin-banner-btn admin-banner-btn--secondary" onClick={handleCancel} disabled={loading}>Cancelar</button>
                  )}
                  <button type="button" className="admin-banner-btn admin-banner-btn--danger" onClick={handleReset} disabled={loading}>Restaurar Padrão</button>
                </div>
              </form>
            </section>

            {/* Histórico de Banners */}
            <section className="admin-banner-section admin-banner-section--history">
              <div className="admin-banner-history-header">
                <h2 className="section-title">Histórico de Banners</h2>
                <p>Visualize e reutilize banners antigos já usados. Clique em um banner para torná-lo o atual na Home.</p>
              </div>
              <div className="admin-banner-history-grid">
                {history && history.length > 0 ? history.map((item, idx) => {
                  const isActive = currentBanner && item.imagemUrl === currentBanner;
                  const filename = (item.imagemUrl || '').split('/').pop();
                  return (
                    <div key={item.id || idx} className={`admin-banner-history-item${isActive ? ' active' : ''}`}
                      title="Clique para ativar este banner na Home"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleUseHistory(item)}>
                      <div className="admin-banner-history-thumb">
                        <img src={getBannerImageSrc(item.imagemUrl)} alt={`Banner ${idx + 1}`} />
                        {isActive && <span className="admin-banner-badge">Ativo</span>}
                      </div>
                      <div className="admin-banner-history-meta">
                        <div className="admin-banner-filename" title={filename}>{filename || 'preview'}</div>
                        <div className="admin-banner-savedat">{item.titulo || ''}</div>
                      </div>
                    </div>
                  );
                }) : (
                  <div style={{ padding: '1rem', color: '#666' }}>Nenhum banner cadastrado ainda.</div>
                )}
              </div>
            </section>
            {/* Removido: Banners do Servidor */}
          </div>
        </div>
      </div>
    </>
  );
};

export default CadastroBanner;

