import React, { useState, useEffect } from 'react';
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
  const [syncLoading, setSyncLoading] = useState(false);
  const [showPreviewItem, setShowPreviewItem] = useState(null);
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [syncUrlInput, setSyncUrlInput] = useState('');
  const [syncTokenInput, setSyncTokenInput] = useState('');
  const [serverBanners, setServerBanners] = useState([]);
  const [showServerBanners, setShowServerBanners] = useState(false);
  const [bannerForm, setBannerForm] = useState({
    titulo: '',
    linkDestino: '',
    ordem: 0,
    ativo: true,
    dataInicio: '',
    dataFim: ''
  });
  const SERVER_ENABLED = (import.meta.env.VITE_ENABLE_BANNER_SERVER === 'true');

  useEffect(() => {
    // Verificar se é admin
    if (!isAuthenticated() || !isAdmin()) {
      navigate('/', { replace: true });
      return;
    }

    // Carregar banner atual (sem banner padrão, só o salvo)
    const savedBanner = getBannerUrl();
    if (savedBanner) {
      setCurrentBanner(savedBanner);
      setPreview(savedBanner);
    }
    // load history
    try {
      const h = getBannerHistory();
      setHistory(h);
    } catch (e) {
      console.warn('Não foi possível carregar histórico de banners', e);
    }

    // Load server banners
    loadServerBanners();
  }, [navigate]);

  const loadServerBanners = async () => {
    if (!SERVER_ENABLED) return;
    try {
      const BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8080/api').replace(/\/$/, '');
      const res = await fetch(`${BASE}/banners`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const banners = await res.json();
      setServerBanners(Array.isArray(banners) ? banners : (banners?.content || []));
    } catch (error) {
      console.error('Erro ao carregar banners do servidor:', error);
      setMessage({ text: 'Erro ao carregar banners do servidor', type: 'error' });
    }
  };

  const handleCreateBanner = async () => {
    if (!SERVER_ENABLED) {
      setMessage({ text: 'Modo local: criação no servidor está desativada.', type: 'info' });
      setTimeout(() => setMessage({ text: '', type: '' }), 2500);
      return;
    }
    if (!file && !preview) {
      setMessage({ text: 'Selecione uma imagem primeiro.', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      const BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8080/api').replace(/\/$/, '');
      let imagemUrl = preview;
      if (file) {
        const uploaded = await uploadFile('/banners/upload', file);
        imagemUrl = uploaded?.imagemUrl || uploaded?.url || imagemUrl;
      }
      const payload = { ...bannerForm, imagemUrl };
      const token = getAuthToken();
      const headers = { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
      const res = await fetch(`${BASE}/banners`, { method: 'POST', headers, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      setMessage({ text: 'Banner criado com sucesso!', type: 'success' });
      setFile(null);
      setPreview('');
      
      // Reset form
      setBannerForm({
        titulo: '',
        linkDestino: '',
        ordem: 0,
        ativo: true,
        dataInicio: '',
        dataFim: ''
      });

      // Reload server banners
      await loadServerBanners();
      
      setTimeout(() => {
        setMessage({ text: '', type: '' });
      }, 3000);
    } catch (error) {
      setMessage({ text: 'Erro ao criar banner: ' + error.message, type: 'error' });
      console.error('Erro ao criar banner:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteServerBanner = async (bannerId) => {
    if (!SERVER_ENABLED) {
      setMessage({ text: 'Modo local: exclusão no servidor está desativada.', type: 'info' });
      setTimeout(() => setMessage({ text: '', type: '' }), 2500);
      return;
    }
    if (!window.confirm('Deseja realmente excluir este banner do servidor?')) {
      return;
    }

    try {
      const BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8080/api').replace(/\/$/, '');
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
    if (!SERVER_ENABLED) {
      setMessage({ text: 'Modo local: alteração de status no servidor está desativada.', type: 'info' });
      setTimeout(() => setMessage({ text: '', type: '' }), 2500);
      return;
    }
    try {
      const BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8080/api').replace(/\/$/, '');
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
    if (window.confirm('Deseja realmente restaurar o banner padrão?')) {
      const success = resetBanner();
      if (success) {
        // Após resetar, não há banner salvo, então limpa o preview
        setCurrentBanner('');
        setPreview('');
        setFile(null);
        setMessage({ text: 'Banner restaurado ao padrão! A home voltará a exibir o banner padrão.', type: 'success' });

        setTimeout(() => {
          setMessage({ text: '', type: '' });
        }, 3000);
      } else {
        setMessage({ text: 'Erro ao restaurar banner.', type: 'error' });
      }
    }
  };

  const handleCancel = () => {
    setPreview(currentBanner || '');
    setFile(null);
    setMessage({ text: '', type: '' });
  };

  const handleUseHistory = (item) => {
    if (!item || !item.url) return;
    const success = saveBannerUrl(item.url);
    if (success) {
      setCurrentBanner(item.url);
      setPreview(item.url);
      setMessage({ text: 'Banner aplicado a partir do histórico.', type: 'success' });
      // refresh history order
      try {
        const h = getBannerHistory();
        setHistory(h);
      } catch (e) {
        console.warn('Erro ao atualizar histórico após aplicar item:', e);
      }
      setTimeout(() => setMessage({ text: '', type: '' }), 2500);
    } else {
      setMessage({ text: 'Erro ao aplicar banner do histórico.', type: 'error' });
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

  const handleUseServerBanner = (banner) => {
    if (!SERVER_ENABLED) {
      setMessage({ text: 'Modo local: uso de banners do servidor está desativado.', type: 'info' });
      setTimeout(() => setMessage({ text: '', type: '' }), 2500);
      return;
    }
    if (banner.imagemUrl) {
      const success = saveBannerUrl(banner.imagemUrl);
      if (success) {
        setCurrentBanner(banner.imagemUrl);
        setPreview(banner.imagemUrl);
        setMessage({ text: 'Banner do servidor aplicado com sucesso!', type: 'success' });
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
      } else {
        setMessage({ text: 'Erro ao aplicar banner do servidor.', type: 'error' });
      }
    }
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

  return (
    <div className="admin-banner-container">
      <Sidebar />
      <div className="admin-banner-content">
        <header className="admin-banner-header">
          <h1 className="admin-banner-title">Gerenciar Banner da Home</h1>
          <p className="admin-banner-subtitle">
            Faça upload de uma nova imagem para substituir o banner principal da página inicial
          </p>
        </header>

        {message.text && (
          <div className={`admin-banner-message admin-banner-message--${message.type}`}>
            {message.text}
          </div>
        )}

        <section className="admin-banner-section">
          <div className="admin-banner-upload">
            <label htmlFor="banner-upload" className="admin-banner-upload-label">
              <i className="bi bi-cloud-upload"></i>
              <span>Selecionar Nova Imagem</span>
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
              Formatos aceitos: JPG, PNG, WEBP. Tamanho máximo: 5MB
            </p>
          </div>

          <div className="admin-banner-preview">
            <h3>Preview do Banner</h3>
            <div className="admin-banner-preview-container">
              {preview ? (
                <img src={preview} alt="Preview do banner" className="admin-banner-preview-image" />
              ) : (
                <div className="admin-banner-preview-placeholder">
                  <i className="bi bi-image"></i>
                  <p>Nenhuma imagem selecionada</p>
                </div>
              )}
            </div>
          </div>

          <div className="admin-banner-form">
            <h4>Configurações do Banner</h4>
            <div className="form-group">
              <label>Título:</label>
              <input
                type="text"
                name="titulo"
                value={bannerForm.titulo}
                onChange={handleFormChange}
                placeholder="Título do banner (opcional)"
              />
            </div>
            <div className="form-group">
              <label>Link de Destino:</label>
              <input
                type="url"
                name="linkDestino"
                value={bannerForm.linkDestino}
                onChange={handleFormChange}
                placeholder="URL de destino ao clicar no banner"
              />
            </div>
            <div className="form-group">
              <label>Ordem:</label>
              <input
                type="number"
                name="ordem"
                value={bannerForm.ordem}
                onChange={handleFormChange}
                min="0"
              />
            </div>
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  name="ativo"
                  checked={bannerForm.ativo}
                  onChange={handleFormChange}
                />
                Ativo
              </label>
            </div>
            <div className="form-group">
              <label>Data Início:</label>
              <input
                type="date"
                name="dataInicio"
                value={bannerForm.dataInicio}
                onChange={handleFormChange}
              />
            </div>
            <div className="form-group">
              <label>Data Fim:</label>
              <input
                type="date"
                name="dataFim"
                value={bannerForm.dataFim}
                onChange={handleFormChange}
              />
            </div>
          </div>

          <div className="admin-banner-actions">
            <button
              className="admin-banner-btn admin-banner-btn--primary"
              onClick={handleSave}
              disabled={loading || (!file && preview === currentBanner)}
            >
              {loading ? 'Salvando...' : 'Salvar Banner Local'}
            </button>
            <button
              className="admin-banner-btn admin-banner-btn--success"
              onClick={handleCreateBanner}
              disabled={loading || (!file && !preview) || !SERVER_ENABLED}
              title={!SERVER_ENABLED ? 'Modo local: criação no servidor desativada' : ''}
            >
              {loading ? 'Criando...' : (SERVER_ENABLED ? 'Criar Banner no Servidor' : 'Criar no Servidor (desativado)')}
            </button>
            {(file || preview !== currentBanner) && (
              <button
                className="admin-banner-btn admin-banner-btn--secondary"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancelar
              </button>
            )}
            <button
              className="admin-banner-btn admin-banner-btn--danger"
              onClick={handleReset}
              disabled={loading}
            >
              Restaurar Padrão
            </button>
            <button
              className="admin-banner-btn admin-banner-btn--info"
              onClick={() => setShowServerBanners(!showServerBanners)}
              disabled={loading || !SERVER_ENABLED}
              title={!SERVER_ENABLED ? 'Modo local: visualização de servidores desativada' : ''}
            >
              {showServerBanners ? 'Ocultar' : (SERVER_ENABLED ? 'Ver Banners do Servidor' : 'Ver Banners do Servidor (desativado)')}
            </button>
          </div>
        </section>

        {showServerBanners && (
          <section className="admin-banner-section admin-banner-server">
            <div className="admin-banner-server-header">
              <h3>Banners do Servidor</h3>
              <p className="admin-banner-server-note">Gerencie banners armazenados no servidor</p>
            </div>
            <div className="admin-banner-server-grid">
              {serverBanners && serverBanners.length > 0 ? serverBanners.map((banner) => (
                <div key={banner.id} className="admin-banner-server-item">
                  <div className="admin-banner-server-thumb">
                    <img src={banner.imagemUrl} alt={banner.titulo || `Banner ${banner.id}`} />
                    {banner.ativo && <span className="admin-banner-badge">Ativo</span>}
                  </div>
                  <div className="admin-banner-server-meta">
                    <div className="admin-banner-title">{banner.titulo || `Banner ${banner.id}`}</div>
                    <div className="admin-banner-ordem">Ordem: {banner.ordem}</div>
                    <div className="admin-banner-status">
                      Status: {banner.ativo ? 'Ativo' : 'Inativo'}
                    </div>
                    {banner.linkDestino && (
                      <div className="admin-banner-link">
                        Link: <a href={banner.linkDestino} target="_blank" rel="noopener noreferrer">{banner.linkDestino}</a>
                      </div>
                    )}
                  </div>
                  <div className="admin-banner-server-actions">
                    <button className="admin-banner-btn" onClick={() => handleUseServerBanner(banner)}>
                      Usar na Home
                    </button>
                    <button 
                      className={`admin-banner-btn ${banner.ativo ? 'admin-banner-btn--warning' : 'admin-banner-btn--success'}`}
                      onClick={() => handleToggleBannerStatus(banner.id, banner.ativo)}
                    >
                      {banner.ativo ? 'Desativar' : 'Ativar'}
                    </button>
                    <button 
                      className="admin-banner-btn admin-banner-btn--danger"
                      onClick={() => handleDeleteServerBanner(banner.id)}
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              )) : (
                <div style={{ padding: '1rem', color: '#666' }}>
                  Nenhum banner encontrado no servidor.
                </div>
              )}
            </div>
          </section>
        )}

        <section className="admin-banner-section admin-banner-history">
            <div className="admin-banner-history-header">
              <div>
                <h3>Histórico de Banners</h3>
                <p className="admin-banner-history-note">Aqui estão os últimos banners que você salvou. Você pode reutilizá-los sem precisar upar novamente.</p>
              </div>
              <div className="admin-banner-history-controls">
                <button className="admin-banner-btn" onClick={exportHistory}>Exportar</button>
                <label className="admin-banner-btn admin-banner-btn--secondary" style={{ cursor: 'pointer' }}>
                  Importar
                  <input type="file" accept="application/json" onChange={handleImportInput} style={{ display: 'none' }} />
                </label>
                <button className="admin-banner-btn" onClick={seedSampleHistory}>Adicionar exemplos</button>
                <button className="admin-banner-btn admin-banner-btn--secondary" onClick={handleClearHistory}>Limpar histórico</button>
                <button className="admin-banner-btn" onClick={handleSyncToServer} disabled={syncLoading}>{syncLoading ? 'Sincronizando...' : 'Sincronizar com servidor'}</button>
              </div>
            </div>
            <div className="admin-banner-history-grid">
              {history && history.length > 0 ? history.map((item, idx) => {
                const isActive = currentBanner && item.url === currentBanner;
                const filename = (item.url || '').split('/').pop();
                return (
                  <div key={idx} className="admin-banner-history-item">
                    <div className="admin-banner-history-thumb">
                      <img src={item.url} alt={`Banner ${idx + 1}`} />
                      {isActive && <span className="admin-banner-badge">Ativo</span>}
                    </div>
                    <div className="admin-banner-history-meta">
                      <div className="admin-banner-filename" title={filename}>{filename || 'preview'}</div>
                      <div className="admin-banner-savedat">{formatSavedAt(item.savedAt)}</div>
                    </div>
                    <div className="admin-banner-history-actions">
                      <button className="admin-banner-btn" onClick={() => handleUseHistory(item)}>Usar</button>
                      <button className="admin-banner-btn" onClick={() => handlePreview(item)}>Visualizar</button>
                      <a className="admin-banner-btn admin-banner-btn--secondary" href={item.url} download target="_blank" rel="noreferrer">Download</a>
                      <button className="admin-banner-btn admin-banner-btn--danger" onClick={() => handleDeleteHistory(item)}>Deletar</button>
                    </div>
                  </div>
                );
              }) : (
                <div style={{ padding: '1rem', color: '#666' }}>Nenhum banner salvo ainda. Use o botão "Adicionar exemplos" ou faça upload e clique em "Salvar Banner" para popular o histórico.</div>
              )}
            </div>
          </section>

        {/* Clear confirmation modal */}
        {showClearConfirm && (
          <div className="admin-modal-overlay">
            <div className="admin-modal">
              <h4>Limpar histórico</h4>
              <p>Tem certeza de que deseja limpar todo o histórico de banners? A ação não pode ser desfeita.</p>
              <div className="admin-modal-actions">
                <button className="admin-banner-btn admin-banner-btn--danger" onClick={confirmClearHistory}>Sim, limpar</button>
                <button className="admin-banner-btn admin-banner-btn--secondary" onClick={() => setShowClearConfirm(false)}>Cancelar</button>
              </div>
            </div>
          </div>
        )}

        {showPreviewItem && (
          <div className="admin-modal-overlay" onClick={closePreview}>
            <div className="admin-modal admin-modal--preview" onClick={(e) => e.stopPropagation()}>
              <div className="admin-modal-preview-body">
                <img src={showPreviewItem.url} alt="Preview" />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.75rem' }}>
                <button className="admin-banner-btn" onClick={() => { handleUseHistory(showPreviewItem); closePreview(); }}>Usar</button>
                <a className="admin-banner-btn admin-banner-btn--secondary" href={showPreviewItem.url} download target="_blank" rel="noreferrer">Download</a>
                <button className="admin-banner-btn admin-banner-btn--secondary" onClick={closePreview}>Fechar</button>
              </div>
            </div>
          </div>
        )}
        {showSyncModal && (
          <div className="admin-modal-overlay" onClick={() => setShowSyncModal(false)}>
            <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
              <h4>Sincronizar histórico</h4>
              <p>Informe o endpoint para enviar o histórico e, se necessário, um token Bearer.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <input type="text" placeholder="https://api.seusite.com/banner-history" value={syncUrlInput} onChange={(e) => setSyncUrlInput(e.target.value)} />
                <input type="text" placeholder="Token (opcional)" value={syncTokenInput} onChange={(e) => setSyncTokenInput(e.target.value)} />
              </div>
              <div className="admin-modal-actions">
                <button className="admin-banner-btn admin-banner-btn--secondary" onClick={() => setShowSyncModal(false)}>Cancelar</button>
                <button className="admin-banner-btn" onClick={confirmSync}>Sincronizar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CadastroBanner;

