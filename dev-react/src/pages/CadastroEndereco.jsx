import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/cadastro-endereco.css';
import Logo from '../assets/logo_preciosos_lacos.png';

const API_CEP = 'https://viacep.com.br/ws/';
// Use backend endpoint for enderecos
const API_URL = 'http://localhost:8080/enderecos';

export default function CadastroEndereco() {
  const navigate = useNavigate();
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

  const handleCepChange = (e) => {
    const onlyDigits = e.target.value.replace(/\D/g, '').slice(0, 8);
    setCep(onlyDigits);
  };

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
    if (!cep || !uf || !cidade || !bairro || !rua || !numero) {
      setMessage({ type: 'warning', text: 'Por favor, preencha todos os campos obrigatórios.' });
      return;
    }

    // When posting to the backend we send the address fields expected by the
    // server. The server will normally generate the primary key (id).
    const id_usuario = sessionStorage.id_usuario ? Number(sessionStorage.id_usuario) : 4;

    const novoEndereco = {
      usuario_id: id_usuario,
      cep,
      uf,
      localidade: cidade,
      bairro,
      logradouro: rua,
      numero,
      complemento,
      padrao
    };

    try {
      setLoading(true);
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoEndereco)
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Endereço cadastrado com sucesso!' });
        // limpar campos
        setCep(''); setUf(''); setCidade(''); setBairro(''); setRua(''); setNumero(''); setComplemento(''); setPadrao(false);
        // redirecionar após 1.5s (comportamento parecido com versão original)
        setTimeout(() => {
          // navegar para a rota de finalizar compra
          navigate('/finalizar-compra');
        }, 1500);
      } else {
        setMessage({ type: 'error', text: 'Erro ao cadastrar endereço. Tente novamente.' });
      }
    } catch (err) {
      console.error('Erro ao cadastrar endereço:', err);
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
          <h2>Cadastro de endereço</h2>

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

            <button id="cadastrar-endereco" className="btn-cadastrar" onClick={handleSubmit} disabled={loading}>
              {loading ? 'Aguarde...' : 'Cadastrar Endereço'}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
