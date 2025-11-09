import React, { useEffect, useState, useCallback } from 'react';
import Sidebar from '../components/Sidebar';
import BarraPesquisa from '../components/BarraPesquisa';
import ModalModelo from '../components/ModalModelo';
import '../styles/Modelo.css';

const Modelo = () => {
	const [modelos, setModelos] = useState([]);
	const [pesquisa, setPesquisa] = useState('');
	const [modalState, setModalState] = useState({ isOpen: false, type: null, modeloData: null });

	const API_URL = 'http://localhost:8080/modelos';

	const normalizeModelo = (raw) => {
		if (!raw) return null;
		const id = raw.idModelo ?? raw.id ?? raw.id_modelo ?? raw.idmodelo;
		const nome = raw.nomeModelo ?? raw.nome ?? raw.nome_modelo ?? '';
		const descricao = raw.descricao ?? raw.descricaoModelo ?? raw.descricao_modelo ?? '';
		const valor = typeof raw.preco === 'number'
			? raw.preco
			: (typeof raw.valor === 'number'
				? raw.valor
				: parseFloat(String(raw.preco ?? raw.valor ?? 0).toString().replace('R$', '').replace('.', '').replace(',', '.')) || 0);
		const favorito = Boolean(raw.favorito ?? false);

		let imagem = null;
		if (raw.fotoBase64) {
			imagem = `data:image/jpeg;base64,${raw.fotoBase64}`;
		} else if (raw.foto) {
			imagem = `data:image/jpeg;base64,${raw.foto}`;
		}

		return { id, nome, descricao, valor, imagem, favorito };
	};


	const showAlert = (tipo, mensagem) => {
		let bgColor = '#f0f0f0';
		if (tipo === 'sucesso') bgColor = '#28a745';
		else if (tipo === 'erro') bgColor = '#dc3545';
		else if (tipo === 'aviso') bgColor = '#ffc107';

		const alertDiv = document.createElement('div');
		alertDiv.style.position = 'fixed';
		alertDiv.style.top = '20px';
		alertDiv.style.right = '20px';
		alertDiv.style.padding = '15px 20px';
		alertDiv.style.color = '#fff';
		alertDiv.style.backgroundColor = bgColor;
		alertDiv.style.borderRadius = '8px';
		alertDiv.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
		alertDiv.style.zIndex = '9999';
		alertDiv.textContent = mensagem;

		document.body.appendChild(alertDiv);
		setTimeout(() => alertDiv.remove(), 3000);
	};

	const loadModelos = useCallback(async () => {
		try {
			const res = await fetch(API_URL, { method: 'GET', headers: { Accept: 'application/json' } });
			if (res.status === 204) {
				setModelos([]);
				return;
			}
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			const data = await res.json();
			const list = Array.isArray(data)
				? data
				: (Array.isArray(data?.content) ? data.content : []);
			setModelos(list.map(normalizeModelo).filter(Boolean));
		} catch (e) {
			console.error('Erro ao carregar modelos:', e);
			setModelos([]);
		}
	}, []);

	const createModelo = async (form) => {
		try {
			const precoNumerico = parseFloat(String(form.valor ?? form.preco ?? '').replace('R$', '').replace('.', '').replace(',', '.').trim()) || 0.0;
			const payload = {
				nome: form.nome,
				preco: precoNumerico,
				descricao: form.descricao ?? '',
				favorito: Boolean(form.favorito ?? false),
			};
			const res = await fetch(API_URL, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
				body: JSON.stringify(payload)
			});
			if (res.status === 201 || res.ok) {
				const body = await res.json().catch(() => null);
				// Tentar identificar o id do criado
				const id = body?.idModelo ?? body?.id ?? null;
				// Se veio imagem em base64 no form, enviar PATCH da foto
				if (id && form.imagemBase64) {
					await fetch(`${API_URL}/${id}/foto`, {
						method: 'PATCH',
						headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
						body: JSON.stringify({ imagemBase64: form.imagemBase64 })
					}).catch(() => { });
				}
				showAlert('sucesso', 'Modelo cadastrado com sucesso!');
				fecharModal();
				loadModelos();
			} else {
				showAlert('erro', 'Erro ao cadastrar modelo!');
			}
		} catch (e) {
			console.error(e);
			showAlert('erro', 'Erro ao conectar com o servidor!');
		}
	};

	const updateModelo = async (form) => {
		try {
			const id = modalState.modeloData?.id ?? modalState.modeloData?.idModelo ?? modalState.modeloData?.id_modelo;
			if (!id || isNaN(Number(id))) {
				showAlert('aviso', 'Este modelo não pode ser editado (id inválido).');
				fecharModal();
				return;
			}
			const precoNumerico = parseFloat(String(form.valor ?? form.preco ?? '').replace('R$', '').replace('.', '').replace(',', '.').trim()) || 0.0;
			const payload = {
				nome: form.nome,
				preco: precoNumerico,
				descricao: form.descricao ?? '',
				favorito: Boolean(modalState.modeloData?.favorito ?? form.favorito ?? false),
			};
			const res = await fetch(`${API_URL}/${id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
				body: JSON.stringify(payload)
			});
			if (res.ok) {
				if (form.imagemBase64) {
					await fetch(`${API_URL}/${id}/foto`, {
						method: 'PATCH',
						headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
						body: JSON.stringify({ imagemBase64: form.imagemBase64 })
					}).catch(() => { });
				}
				showAlert('sucesso', 'Modelo atualizado com sucesso!');
				fecharModal();
				loadModelos();
			} else {
				showAlert('erro', 'Erro ao atualizar modelo!');
			}
		} catch (e) {
			console.error(e);
			showAlert('erro', 'Erro ao atualizar modelo!');
		}
	};

	const deleteModelo = async () => {
		try {
			const id = modalState.modeloData?.id ?? modalState.modeloData?.idModelo ?? modalState.modeloData?.id_modelo;
			if (!id || isNaN(Number(id))) {
				showAlert('aviso', 'Este modelo não pode ser excluído (id inválido).');
				fecharModal();
				return;
			}
			const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
			if (res.status === 204 || res.ok) {
				showAlert('sucesso', 'Modelo excluído com sucesso!');
				fecharModal();
				loadModelos();
			} else {
				showAlert('erro', 'Erro ao excluir modelo!');
			}
		} catch (e) {
			console.error(e);
			showAlert('erro', 'Erro ao excluir modelo!');
		}
	};

	const abrirModal = (type, modelo = null) => {
		setModalState({ isOpen: true, type, modeloData: modelo });
	};

	const fecharModal = () => setModalState({ isOpen: false, type: null, modeloData: null });

	const handleCadastrar = () => abrirModal('create', null);

	const filtrados = modelos.filter(m => (m.nome ?? '').toLowerCase().includes(pesquisa.toLowerCase()));

	useEffect(() => {
		loadModelos();
	}, [loadModelos]);

	return (
		<div className="modelo-dashboard">
			<Sidebar />
			<header>Modelos</header>
			<BarraPesquisa
				searchTerm={pesquisa}
				onSearchChange={setPesquisa}
				onAddClick={handleCadastrar}
				addLabel="Cadastrar Modelo"
			/>

			<div className="modelo-main">
				<div className="modelo-grid">
					{filtrados.map(mod => (
						<div key={mod.id} className="modelo-card">
							<div className="modelo-img-wrapper">
								<img src={mod.imagem || '/src/assets/laco-personalizado.jpg'} alt={mod.nome} />
							</div>
							<h5 className="modelo-nome">{mod.nome}</h5>
							<div className="modelo-footer">
								<p className="modelo-valor">Valor: R$ {Number(mod.valor || 0).toFixed(2)}</p>
								<div className="modelo-acoes">
									<i className="bi bi-pencil" title="Editar" onClick={() => abrirModal('edit', mod)}></i>
									<i
										className="bi bi-trash"
										title="Excluir"
										onClick={() => abrirModal('delete', mod)}
									></i>
								</div>
							</div>
						</div>
					))}
					{filtrados.length === 0 && (
						<div className="modelo-vazio">Nenhum modelo encontrado.</div>
					)}
				</div>
			</div>

			<ModalModelo
				isOpen={modalState.isOpen}
				onClose={fecharModal}
				type={modalState.type}
				modeloData={modalState.modeloData}
				onSubmit={(form) => {
					if (modalState.type === 'create') {
						createModelo(form);
					} else if (modalState.type === 'edit') {
						updateModelo(form);
					} else if (modalState.type === 'delete') {
						deleteModelo();
					}
				}}
			/>
		</div>
	);
}

export default Modelo;