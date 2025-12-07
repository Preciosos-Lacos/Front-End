
import Logo from '../assets/logo_preciosos_lacos.png';
import { useNavigate, useLocation } from 'react-router-dom';

const BASE_URL = 'http://localhost:8080';

function getAuthToken() {
  return localStorage.getItem('token');
}

function decodeJwt(token) {
  try {
    const payload = token.split('.')[1];
    const json = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    return json || {};
  } catch {
    return {};
  }
}
import { useEffect, useState } from 'react';


export default function AtualizarEndereco() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const id = params.get('id');

  const [form, setForm] = useState({
    logradouro: '',
    numero: '',
    bairro: '',
    localidade: '',
    uf: '',
    cep: '',
    complemento: '',
    padrao: false,
    usuarioId: ''
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null); // { type: 'success'|'error'|'warning', text }

  useEffect(() => {
    async function fetchEndereco() {
      setLoading(true);
      setMessage(null);
      try {
        const token = getAuthToken();
        if (!token) throw new Error('Você precisa estar logado para atualizar o endereço.');
        const res = await fetch(`${BASE_URL}/enderecos/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });
        if (!res.ok) throw new Error('Endereço não encontrado');
        const data = await res.json();
        setForm({
          logradouro: data.logradouro || '',
          numero: data.numero || '',
          bairro: data.bairro || '',
          localidade: data.localidade || '',
          uf: data.uf || '',
          cep: data.cep || '',
          complemento: data.complemento || '',
          padrao: data.padrao || false,
          usuarioId: data.usuarioId || ''
        });
      } catch (e) {
        setMessage({ type: 'error', text: e.message });
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchEndereco();
  }, [id]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const token = getAuthToken();
      if (!token) {
        setMessage({ type: 'error', text: 'Você precisa estar logado para atualizar o endereço.' });
        setLoading(false);
        return;
      }
      const payload = decodeJwt(token);
      // Log do payload decodificado para identificar o campo correto do usuarioId
      console.log('Payload JWT decodificado:', payload);
      // Usa o campo 'sub' do JWT como e-mail
      let usuarioId = form.usuarioId || '';
      const email = payload?.sub;
      // Log dos campos obrigatórios antes da validação
      console.log('Validação dos campos obrigatórios:', {
        cep: form.cep,
        uf: form.uf,
        localidade: form.localidade,
        bairro: form.bairro,
        logradouro: form.logradouro,
        numero: form.numero,
        usuarioId,
        email
      });
      // Se usuarioId não for numérico, buscar pelo e-mail usando o endpoint de autenticação da tela de perfil
      if (!usuarioId || isNaN(Number(usuarioId))) {
        if (!email) {
          setMessage({ type: 'warning', text: 'Não foi possível obter o e-mail do usuário.' });
          setLoading(false);
          return;
        }
        // Buscar usuário pelo e-mail (login)
        try {
          const resUser = await fetch(`${BASE_URL}/usuarios/login/${encodeURIComponent(email)}`, {
            method: 'GET',
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            }
          });
          if (!resUser.ok) {
            const msg = await resUser.text();
            throw new Error(msg || 'Não foi possível obter o ID do usuário pelo e-mail.');
          }
          const userData = await resUser.json();
          console.log('Dados do usuário retornados:', userData);
          usuarioId = userData.idUsuario || userData.id || userData.usuarioId || userData.userId;
          if (!usuarioId) {
            setMessage({ type: 'warning', text: 'ID do usuário não encontrado.' });
            setLoading(false);
            return;
          }
        } catch (err) {
          setMessage({ type: 'error', text: err.message });
          setLoading(false);
          return;
        }
      }
      // Validação dos campos obrigatórios
      if (!form.cep || !form.uf || !form.localidade || !form.bairro || !form.logradouro || !form.numero || !usuarioId) {
        setMessage({ type: 'warning', text: 'Preencha todos os campos obrigatórios.' });
        setLoading(false);
        return;
      }
      const enderecoPayload = {
        usuarioId,
        cep: form.cep,
        uf: form.uf,
        localidade: form.localidade,
        bairro: form.bairro,
        logradouro: form.logradouro,
        numero: form.numero,
        complemento: form.complemento,
        padrao: form.padrao
      };
      console.log('Payload enviado:', enderecoPayload);
      const res = await fetch(`${BASE_URL}/enderecos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(enderecoPayload)
      });
      if (!res.ok) {
        const errMsg = await res.text();
        throw new Error(errMsg || 'Erro ao atualizar endereço');
      }
      setMessage({ type: 'success', text: 'Endereço atualizado com sucesso!' });
      setTimeout(() => navigate('/perfil'), 1200);
    } catch (e) {
      setMessage({ type: 'error', text: e.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="cadastro-container">
      <button type="button" className="btn-voltar" onClick={() => navigate(-1)} title="Voltar">
        <i className="bi bi-arrow-left-circle"></i>
      </button>

      <section className="cadastro-section">
        <div className="logo-cadastro">
          <img src={Logo} alt="Logo Preciosos Laços" />
        </div>

        <div className="form-cadastro">
          <h2>Atualizar endereço</h2>

          {message && (
            <div className={`alert alert-${message.type === 'error' ? 'danger' : message.type === 'warning' ? 'warning' : 'success'}`} role="alert">
              {message.text}
            </div>
          )}

          {loading ? (
            <div className="inputs"><p>Carregando...</p></div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="inputs">
                <input type="text" name="cep" maxLength={8} placeholder="Digite o CEP (Apenas números)" value={form.cep} onChange={handleChange} required />
                <input type="text" name="uf" placeholder="UF" value={form.uf} onChange={handleChange} maxLength={2} required style={{ textTransform: 'uppercase' }} />
                <input type="text" name="localidade" placeholder="Cidade" value={form.localidade} onChange={handleChange} required />
                <input type="text" name="bairro" placeholder="Bairro" value={form.bairro} onChange={handleChange} required />
                <input type="text" name="logradouro" placeholder="Rua" value={form.logradouro} onChange={handleChange} required />
                <input type="text" name="numero" placeholder="Número" value={form.numero} onChange={handleChange} required />
                <input type="text" name="complemento" placeholder="Complemento" value={form.complemento} onChange={handleChange} />
                <label className="checkbox-padrao">
                  <input type="checkbox" name="padrao" checked={form.padrao} onChange={handleChange} />
                  Usar como meu endereço principal
                </label>
                <button type="submit" className="btn-cadastrar" disabled={loading}>
                  {loading ? 'Aguarde...' : 'Salvar Alterações'}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
