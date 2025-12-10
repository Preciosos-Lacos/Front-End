import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import '../styles/cadastro-endereco.css';
import Logo from '../assets/logo_preciosos_lacos.png';


const API_CEP = 'https://viacep.com.br/ws/';
const API_URL = 'http://localhost:8080/enderecos';

export default function AtualizarEndereco() {
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();
  const stateEndereco = location && location.state && location.state.endereco ? location.state.endereco : null;
  const initialEnderecoId = params.id || params.idEndereco || (stateEndereco && (stateEndereco.id || stateEndereco.idEndereco || stateEndereco.id_endereco)) || null;
  const [enderecoIdState, setEnderecoIdState] = useState(initialEnderecoId);
  const [cep, setCep] = useState('');
  const [uf, setUf] = useState('');
  const [cidade, setCidade] = useState('');
  const [bairro, setBairro] = useState('');
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [padrao, setPadrao] = useState(false);

  const [message, setMessage] = useState(null); // { type: 'success'|'error'|'warning', text }
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const handleCepChange = (e) => {
    const onlyDigits = e.target.value.replace(/\D/g, '').slice(0, 8);
    setCep(onlyDigits);
  };

  // Try to prefill from stateEndereco and resolve id if missing
  useEffect(() => {
    let active = true;

    const tryResolve = async () => {
      if (stateEndereco && !enderecoIdState) {
        // prefill visible fields immediately
        setCep(stateEndereco.cep || '');
        setUf(stateEndereco.uf || stateEndereco.estado || '');
        setCidade(stateEndereco.localidade || stateEndereco.cidade || '');
        setBairro(stateEndereco.bairro || '');
        setRua(stateEndereco.logradouro || stateEndereco.rua || '');
        setNumero(stateEndereco.numero !== undefined && stateEndereco.numero !== null ? String(stateEndereco.numero) : '');
        setComplemento(stateEndereco.complemento || '');
        setPadrao(Boolean(stateEndereco.padrao));

        // attempt to resolve an id by listing user's addresses
        try {
          const idUsuario = sessionStorage.id_usuario ? Number(sessionStorage.id_usuario) : (stateEndereco && stateEndereco.usuario && (stateEndereco.usuario.idUsuario || stateEndereco.usuario.id) ? Number(stateEndereco.usuario.idUsuario || stateEndereco.usuario.id) : null);
          if (!idUsuario) return;
          const backendBase = API_URL.replace('/enderecos', '');
          const candidateUrls = [
            `${backendBase}/usuarios/${idUsuario}/enderecos`,
            `${API_URL}?usuarioId=${idUsuario}`
          ];

          const normalize = (s='') => String(s).toLowerCase().replace(/\s+/g,'').replace(/[^a-z0-9]/g,'');
          const targetCep = normalize(stateEndereco.cep || '');
          const targetRua = normalize(stateEndereco.logradouro || stateEndereco.rua || '');
          const targetNum = normalize(stateEndereco.numero ?? '');

          for (const url of candidateUrls) {
            try {
              const r = await fetch(url);
              if (!r.ok) continue;
              const list = await r.json();
              if (!Array.isArray(list)) continue;

              const found = list.find(e => (
                normalize(e.cep || '') === targetCep &&
                normalize(e.logradouro || e.rua || '') === targetRua &&
                normalize(String(e.numero || '')) === targetNum
              ));
              if (found) {
                if (!active) return;
                const foundId = found.idEndereco || found.id || found.id_endereco || found.idEndereco;
                if (foundId) setEnderecoIdState(foundId);
                return;
              }
            } catch (e) {
              // ignore per-endpoint errors
            }
          }
        } catch (e) {
          console.error('Erro ao tentar resolver id do endereco:', e);
        }
      }
    };

    tryResolve();
    return () => { active = false; };
  }, [stateEndereco, enderecoIdState]);

  // When we have an endereco id (from params or resolved) fetch authoritative data
  useEffect(() => {
    if (!enderecoIdState) return;
    let active = true;

    const fetchEndereco = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/${enderecoIdState}`);
        if (res.status === 404) {
          setNotFound(true);
          setMessage({ type: 'error', text: 'Endereço não encontrado.' });
          return;
        }
        if (!res.ok) {
          setMessage({ type: 'error', text: 'Erro ao carregar o endereço.' });
          return;
        }
        const data = await res.json();
        console.log('GET /enderecos/{id} response:', { status: res.status, data });
        if (!active) return;
        // repopular campos com o objeto retornado
        setCep(data.cep || '');
        setUf(data.uf || '');
        setCidade(data.localidade || '');
        setBairro(data.bairro || '');
        setRua(data.logradouro || '');
        setNumero(data.numero !== undefined && data.numero !== null ? String(data.numero) : '');
        setComplemento(data.complemento || '');
        setPadrao(Boolean(data.padrao));
      } catch (err) {
        console.error('Erro ao carregar endereço:', err);
        setMessage({ type: 'error', text: 'Erro ao carregar o endereço. Tente novamente.' });
      } finally {
        setLoading(false);
      }
    };

    fetchEndereco();
    return () => { active = false; };
  }, [enderecoIdState]);

  const buscarCep = async () => {
    if (!cep || cep.length !== 8) {
      if (cep.length > 0) setMessage({ type: 'warning', text: 'CEP inválido. Informe 8 dígitos.' });
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_CEP}${cep}/json/`);
      const data = await res.json();
      if (data.erro) {
        setMessage({ type: 'warning', text: 'CEP não encontrado.' });
      } else {
        setUf(data.uf || '');
        setCidade(data.localidade || '');
        setBairro(data.bairro || '');
        setRua(data.logradouro || '');
        setMessage(null);
      }
    } catch (err) {
      console.error('Erro ao buscar CEP:', err);
      setMessage({ type: 'error', text: 'Erro ao buscar o CEP. Tente novamente mais tarde.' });
    } finally {
      setLoading(false);
    }
  };

  // When using the backend API (Spring) the id is usually generated server-side —
  // we don't need to compute next id on the client. Keep this function commented
  // in case you need a client-side fallback for a different dev server.
  /*
  const getNextId = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      if (!Array.isArray(data) || data.length === 0) return 1;
      return Math.max(...data.map((i) => Number(i.id))) + 1;
    } catch (err) {
      console.error('Erro ao obter next id:', err);
      return Date.now();
    }
  };
  */

  const handleSubmit = async () => {
    if (!cep || cep.length !== 8) {
      setMessage({ type: 'warning', text: 'CEP inválido. Informe 8 dígitos.' });
      return;
    }
    if (!uf || !cidade || !bairro || !rua || !numero) {
      setMessage({ type: 'warning', text: 'Por favor, preencha todos os campos obrigatórios.' });
      return;
    }

    const numeroNum = Number(numero);
    if (Number.isNaN(numeroNum) || numeroNum < 1) {
      setMessage({ type: 'warning', text: 'Número do endereço inválido.' });
      return;
    }

    if (!enderecoIdState) {
      setMessage({ type: 'error', text: 'ID do endereço não informado.' });
      return;
    }

    const id_usuario = sessionStorage.id_usuario ? Number(sessionStorage.id_usuario) : 4;

    const payload = {
      usuarioId: id_usuario,
      cep,
      logradouro: rua,
      bairro,
      numero: numeroNum,
      complemento: complemento || null,
      localidade: cidade,
      uf
    };

    try {
      setLoading(true);
      console.log('PUT /enderecos/{id} request:', { url: `${API_URL}/${enderecoIdState}`, payload });
      const res = await fetch(`${API_URL}/${enderecoIdState}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      console.log('PUT /enderecos/{id} status:', res.status);
      try {
        const debugBody = await res.clone().json();
        console.log('PUT /enderecos/{id} body:', debugBody);
      } catch (e) {
        try {
          const txt = await res.clone().text();
          console.log('PUT /enderecos/{id} text body:', txt);
        } catch (e2) {
          // ignore
        }
      }

      if (res.status === 404) {
        setMessage({ type: 'error', text: 'Endereço não encontrado.' });
        setNotFound(true);
        return;
      }

      if (res.status === 400) {
        let errBody = null;
        try { errBody = await res.json(); } catch (e) { /* ignore */ }
        const text = errBody && (errBody.message || errBody.errors) ? JSON.stringify(errBody) : 'Dados inválidos. Verifique os campos.';
        setMessage({ type: 'error', text });
        return;
      }

      if (!res.ok) {
        setMessage({ type: 'error', text: 'Erro ao atualizar endereço. Tente novamente.' });
        return;
      }

      const updated = await res.json();
      // repopular campos com o objeto retornado (usando campos informados na especificação)
      setCep(updated.cep || '');
      setUf(updated.uf || '');
      setCidade(updated.localidade || '');
      setBairro(updated.bairro || '');
      setRua(updated.logradouro || '');
      setNumero(updated.numero !== undefined && updated.numero !== null ? String(updated.numero) : '');
      setComplemento(updated.complemento || '');
      setPadrao(Boolean(updated.padrao));

      setMessage({ type: 'success', text: 'Endereço atualizado com sucesso.' });
      // Volta para a tela anterior imediatamente após sucesso
      try {
        navigate(-1);
      } catch (e) {
        // fallback: navega para a rota de compra
        navigate('/compra');
      }
    } catch (err) {
      console.error('Erro ao atualizar endereço:', err);
      setMessage({ type: 'error', text: 'Erro ao conectar com o servidor.' });
    } finally {
      setLoading(false);
    }
  };

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
          <h2>Atualizar Endereço</h2>

          {message && (
            <div className={`alert alert-${message.type === 'error' ? 'danger' : message.type === 'warning' ? 'warning' : 'success'}`} role="alert">
              {message.text}
            </div>
          )}

          <div className="inputs">
            <input type="text" id="CEP" name="CEP" maxLength={8} placeholder="Digite o CEP (Apenas números)" value={cep} onChange={handleCepChange} onBlur={buscarCep} />

            <input type="text" id="uf" placeholder="UF" readOnly value={uf} onChange={() => {}} />

            <input type="text" id="cidade" placeholder="Cidade" readOnly value={cidade} onChange={() => {}} />

            <input type="text" id="bairro" placeholder="Bairro" readOnly value={bairro} onChange={() => {}} />

            <input type="text" id="rua" placeholder="Rua" readOnly value={rua} onChange={() => {}} />

            <input type="text" id="numero" placeholder="Número" value={numero} onChange={(e) => setNumero(e.target.value)} />

            <input type="text" id="complemento" placeholder="Complemento" value={complemento} onChange={(e) => setComplemento(e.target.value)} />

            <label className="checkbox-padrao">
              <input type="checkbox" id="padrao" checked={padrao} onChange={(e) => setPadrao(e.target.checked)} />
              Usar como meu endereço principal
            </label>

            <button id="atualizar-endereco" className="btn-cadastrar" onClick={handleSubmit} disabled={loading}>
              {loading ? 'Aguarde...' : 'Atualizar Endereço'}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
