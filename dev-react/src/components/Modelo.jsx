import React, { useState } from 'react';
import Sidebar from './Sidebar';
import './Modelo.css';

// Mock de modelos (poderá ser substituído por fetch futuramente)
const modelosIniciais = [
	{ id: '1', nome: 'Laço Gravatinha', valor: 6.0, imagem: '/src/assets/laco_bolinhas.png' },
	{ id: '2', nome: 'Laço Jujuba', valor: 6.0, imagem: '/src/assets/laco-pink.webp' },
	{ id: '3', nome: 'Laço Ursinhos Carinhosos', valor: 6.0, imagem: '/src/assets/laco-barbie.webp' },
	{ id: '4', nome: 'Laço Girlie Shine', valor: 6.0, imagem: '/src/assets/laco-azul.webp' },
	{ id: '5', nome: 'Laço Estrela Duo', valor: 6.0, imagem: '/src/assets/laco-kit-6.webp' },
	{ id: '6', nome: 'Laço em tule', valor: 6.0, imagem: '/src/assets/laco-tule-dourado.webp' },
	{ id: '7', nome: 'Laço Mia (mini)', valor: 6.0, imagem: '/src/assets/laco-mia-neon.webp' },
	{ id: '8', nome: 'Lacinho Borboleta', valor: 6.0, imagem: '/src/assets/laco-kit-borboleta.webp' },
	{ id: '9', nome: 'Laço Nina', valor: 6.0, imagem: '/src/assets/laco-kit-12.webp' },
	{ id: '10', nome: 'Laço Linho', valor: 6.0, imagem: '/src/assets/laco-faixinhas.jpg' },
];

const Modelo = () => {
	const [modelos, setModelos] = useState(modelosIniciais);
	const [pesquisa, setPesquisa] = useState('');
	const [mostrarModalExcluir, setMostrarModalExcluir] = useState(false);
	const [modeloParaExcluir, setModeloParaExcluir] = useState(null);

	const filtrados = modelos.filter(m => m.nome.toLowerCase().includes(pesquisa.toLowerCase()));

	const abrirModalExcluir = (modelo) => {
		setModeloParaExcluir(modelo);
		setMostrarModalExcluir(true);
	};

	const fecharModalExcluir = () => {
		setModeloParaExcluir(null);
		setMostrarModalExcluir(false);
	};

	const confirmarExclusao = () => {
		if (modeloParaExcluir) {
			setModelos(prev => prev.filter(m => m.id !== modeloParaExcluir.id));
		}
		fecharModalExcluir();
	};

	const handleCadastrar = () => {
		// Placeholder: você pode substituir por abertura de modal de criação.
		const novo = {
			id: String(Date.now()),
			nome: 'Novo Modelo',
			valor: 6.0,
			imagem: '/src/assets/laco-personalizado.jpg'
		};
		setModelos(prev => [novo, ...prev]);
	};

	return (
		<div className="modelo-dashboard">
			<Sidebar />
			<div className="modelo-main">
				<header>Modelos</header>
				<div className="modelo-toolbar">
					<div className="modelo-search-wrapper">
						<input
							type="text"
							className="modelo-search-input"
							placeholder="Pesquisar Modelo"
							value={pesquisa}
							onChange={e => setPesquisa(e.target.value)}
						/>
						<i className="bi bi-search" />
					</div>
					<button className="modelo-btn-cadastrar" onClick={handleCadastrar}>
						<i className="bi bi-patch-plus"></i>
						<span>Cadastrar Modelo</span>
					</button>
				</div>

				<div className="modelo-grid">
					{filtrados.map(mod => (
						<div key={mod.id} className="modelo-card">
							<div className="modelo-img-wrapper">
								<img src={mod.imagem} alt={mod.nome} />
							</div>
							<h5 className="modelo-nome">{mod.nome}</h5>
							<div className="modelo-footer">
								<p className="modelo-valor">Valor: R$ {mod.valor.toFixed(2)}</p>
								<div className="modelo-acoes">
									<i className="bi bi-pencil" title="Editar"></i>
									<i
										className="bi bi-trash"
										title="Excluir"
										onClick={() => abrirModalExcluir(mod)}
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

			{mostrarModalExcluir && (
				<div className="modal modelo-modal">
					<div className="modal-content modelo-modal-content">
						<span className="close" onClick={fecharModalExcluir}>&times;</span>
						<h2 className="tituloPopUp">Você deseja deletar: "{modeloParaExcluir?.nome}"?</h2>
						<div className="modelo-modal-actions">
							<button className="modelo-btn-excluir" onClick={confirmarExclusao}>Deletar modelo</button>
							<button className="modelo-btn-cancelar" onClick={fecharModalExcluir}>Cancelar</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default Modelo;