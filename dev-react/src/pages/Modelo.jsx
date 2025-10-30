import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import BarraPesquisa from '../components/BarraPesquisa';
import ModalModelo from '../components/ModalModelo';
import '../styles/Modelo.css';

// Mock de modelos (poderá ser substituído por fetch futuramente)
const modelosIniciais = [
	{ id: '1', nome: 'Laço Bolinha', valor: 49.70, imagem: '/src/assets/laco-bolinha.webp' },
	{ id: '2', nome: 'Laço Jujuba', valor: 56.0, imagem: '/src/assets/laco-pink.webp' },
	{ id: '3', nome: 'Laço Ursinhos Carinhosos', valor: 36.0, imagem: '/src/assets/laco-barbie.webp' },
	{ id: '4', nome: 'Laço Girlie Shine', valor: 26.0, imagem: '/src/assets/laco-azul.webp' },
	{ id: '5', nome: 'Laço Estrela Duo', valor: 46.0, imagem: '/src/assets/laco-kit-6.webp' },
	{ id: '6', nome: 'Laço em tule', valor: 26.0, imagem: '/src/assets/laco-tule-dourado.webp' },
	{ id: '7', nome: 'Laço Mia (mini)', valor: 56.0, imagem: '/src/assets/laco-mia-neon.webp' },
	{ id: '8', nome: 'Lacinho Borboleta', valor: 66.0, imagem: '/src/assets/laco-kit-borboleta.webp' },
	{ id: '9', nome: 'Laço Nina', valor: 76.0, imagem: '/src/assets/laco-kit-12.webp' },
	{ id: '10', nome: 'Laço Linho', valor: 36.0, imagem: '/src/assets/laco-faixinhas.jpg' },
];

const Modelo = () => {
	const [modelos, setModelos] = useState(modelosIniciais);
	const [pesquisa, setPesquisa] = useState('');
 const [modalState, setModalState] = useState({ isOpen: false, type: null, modeloData: null });

	const filtrados = modelos.filter(m => m.nome.toLowerCase().includes(pesquisa.toLowerCase()));

	 const abrirModal = (type, modelo = null) => {
		 setModalState({ isOpen: true, type, modeloData: modelo });
	 };

	 const fecharModal = () => setModalState({ isOpen: false, type: null, modeloData: null });

	 const confirmarExclusao = () => {
		 const alvo = modalState.modeloData;
		 if (alvo) setModelos(prev => prev.filter(m => m.id !== alvo.id));
		 fecharModal();
	 };

	 const handleCadastrar = () => abrirModal('create', null);

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
								<img src={mod.imagem} alt={mod.nome} />
							</div>
							<h5 className="modelo-nome">{mod.nome}</h5>
							<div className="modelo-footer">
								<p className="modelo-valor">Valor: R$ {mod.valor.toFixed(2)}</p>
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
										const novo = { id: String(Date.now()), nome: form.nome || 'Novo Modelo', valor: Number(form.valor) || 6.0, imagem: form.imagem || '/src/assets/laco-personalizado.jpg' };
										setModelos(prev => [novo, ...prev]);
									} else if (modalState.type === 'edit') {
										setModelos(prev => prev.map(m => m.id === modalState.modeloData.id ? { ...m, ...form } : m));
									} else if (modalState.type === 'delete') {
										confirmarExclusao();
									}
								}}
						/>
		</div>
	);
}

export default Modelo;