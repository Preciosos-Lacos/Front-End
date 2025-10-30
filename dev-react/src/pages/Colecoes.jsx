import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import BarraPesquisa from '../components/BarraPesquisa';
import ModalColecoes from '../components/ModalColecoes';
import CardColecao from '../components/CardColecao';
import '../styles/Colecoes.css';

import img1 from '../assets/laco-kit-6.webp';
import img2 from '../assets/laco-piscina.jpg';
import img3 from '../assets/laco-barbie.webp';
import img4 from '../assets/laco-bolinha.webp';

const mockCollections = [
  { id: '1', nome: 'São João', descricao: 'Coleção temática de São João', imagem: img1, modelos: ['Laço Padrão', 'Laço Linho'] },
  { id: '2', nome: 'Páscoa', descricao: 'Coleção especial de Páscoa', imagem: img2, modelos: ['Laço Padrão'] },
  { id: '3', nome: 'Volta as Aulas', descricao: 'Coleção para volta às aulas', imagem: img3, modelos: ['Laço Infantil'] },
  { id: '4', nome: 'Inverno', descricao: 'Coleção de inverno', imagem: img4, modelos: ['Laço Princesa'] },
  { id: '5', nome: 'Natal', descricao: 'Coleção de natal', imagem: img1, modelos: ['Laço Padrão'] },
  { id: '6', nome: 'Dia dos Namorados', descricao: 'Coleção romântica', imagem: img3, modelos: ['Laço Festa'] },
  { id: '7', nome: 'Viagens', descricao: 'Coleção temática de viagens', imagem: img2, modelos: ['Laço Piscina'] },
  { id: '8', nome: 'Halloween', descricao: 'Coleção de Halloween', imagem: img4, modelos: ['Laço Festa'] }
];

export default function Colecoes() {
  const [collections, setCollections] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalState, setModalState] = useState({ isOpen: false, type: null, data: null });

  useEffect(() => {
    // Carrega mock (ou daqui você pode trocar por fetch ao backend)
    setCollections(mockCollections);
  }, []);

  const openCreateModal = () => setModalState({ isOpen: true, type: 'create', data: null });
  const openEditModal = (col) => setModalState({ isOpen: true, type: 'edit', data: col });
  const openDeleteModal = (col) => setModalState({ isOpen: true, type: 'delete', data: col });
  const closeModal = () => setModalState({ isOpen: false, type: null, data: null });

  const handleModalSubmit = (formData) => {
    if (modalState.type === 'create') {
      const novo = {
        id: String(collections.length + 1),
        nome: formData.nome || 'Nova Coleção',
        descricao: formData.descricao || '',
        imagem: formData.imagem || img1,
        modelos: Array.isArray(formData.modelos) ? formData.modelos : []
      };
      setCollections(prev => [novo, ...prev]);
    } else if (modalState.type === 'edit') {
      setCollections(prev => prev.map(c => c.id === modalState.data.id ? { ...c, ...formData } : c));
    } else if (modalState.type === 'delete') {
      setCollections(prev => prev.filter(c => c.id !== modalState.data.id));
    }

    closeModal();
  };

  const filtered = collections.filter(c => (c.nome || '').toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="colecoes-page">
      <Sidebar />

      <div className="colecoes-main">
        
      <header>Coleções</header>

        <BarraPesquisa
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onAddClick={openCreateModal}
          addLabel="Cadastrar Coleções"
        />

        <div className="colecoes-grid">
          {filtered.map((col) => (
            <CardColecao
              key={col.id}
              collection={col}
              onEdit={() => openEditModal(col)}
              onDelete={() => openDeleteModal(col)}
            />
          ))}
        </div>
      </div>

      {modalState.isOpen && (
        <ModalColecoes
          isOpen={modalState.isOpen}
          onClose={closeModal}
          type={modalState.type}
          data={modalState.data}
          onSubmit={handleModalSubmit}
        />
      )}
    </div>
  );
}
