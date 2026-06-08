import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';

import type {
  Categoria,
  Curso,
  Usuario,
  Modulo,
  Aula
} from '../model/types';

export const Admin: React.FC = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [modulos, setModulos] = useState<Modulo[]>([]);
  const [feedback, setFeedback] = useState<{ type: string; msg: string } | null>(null);

  // Estados dos formulários individuais de inserção com labels acessíveis
  const [nomeCat, setNomeCat] = useState('');
  const [descCat, setDescCat] = useState('');

  const [titCurso, setTitCurso] = useState('');
  const [descCurso, setDescCurso] = useState('');
  const [catCurso, setCatCurso] = useState('');
  const [nivelCurso, setNivelCurso] = useState('Iniciante');
  const [horasCurso, setHorasCurso] = useState(10);
  const [capaCurso, setCapaCurso] = useState('');

  const [titMod, setTitMod] = useState('');
  const [cursoMod, setCursoMod] = useState('');
  const [ordemMod, setOrdemMod] = useState(1);

  const [titAula, setTitAula] = useState('');
  const [modAula, setModAula] = useState('');
  const [tipoAula, setTipoAula] = useState('Vídeo');
  const [duracaoAula, setDuracaoAula] = useState(15);
  const [ordemAula, setOrdemAula] = useState(1);

  const [titTrilha, setTitTrilha] = useState('');
  const [descTrilha, setDescTrilha] = useState('');
  const [catTrilha, setCatTrilha] = useState('');

  const recarregarListas = () => {
    Promise.all([
      apiService.get<Categoria[]>('/categorias'),
      apiService.get<Curso[]>('/cursos'),
      apiService.get<Modulo[]>('/modulos')
    ]).then(([cat, cur, mod]) => {
      setCategorias(cat);
      setCursos(cur);
      setModulos(mod);
    });
  };

  useEffect(() => { recarregarListas(); }, []);

  const triggerAlert = (type: string, msg: string) => {
    setFeedback({ type, msg });
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleCadastrarCategoria = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nomeCat.trim()) return triggerAlert('danger', 'Preencha o nome da categoria.');
    const nova = { id: crypto.randomUUID(), nome: nomeCat, descricao: descCat };
    await apiService.post('/categorias', nova);
    setNomeCat(''); setDescCat('');
    recarregarListas();
    triggerAlert('success', 'Categoria persistida com sucesso.');
  };

  const handleCadastrarCurso = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titCurso.trim() || !catCurso) return triggerAlert('danger', 'Preencha os dados obrigatórios do curso.');
    if (horasCurso <= 0) return triggerAlert('danger', 'A carga horária precisa ser maior que zero.');
    const novo = {
      id: crypto.randomUUID(), titulo: titCurso, descricao: descCurso, idInstrutor: "u1",
      idCategoria: catCurso, nivel: nivelCurso, dataPublicacao: "2026-06-07", totalAulas: 0,
      totalHoras: Number(horasCurso), capaUrl: capaCurso.trim() || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop"
    };
    await apiService.post('/cursos', novo);
    setTitCurso(''); setDescCurso(''); setHorasCurso(10); setCapaCurso('');
    recarregarListas();
    triggerAlert('success', 'Curso estruturado e ativo no banco.');
  };

  const handleCadastrarModulo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titMod.trim() || !cursoMod) return triggerAlert('danger', 'Vincule um módulo a um curso.');
    if (ordemMod <= 0) return triggerAlert('danger', 'Ordem inválida.');
    const novo = { id: crypto.randomUUID(), idCurso: cursoMod, titulo: titMod, ordem: Number(ordemMod) };
    await apiService.post('/modulos', novo);
    setTitMod('');
    recarregarListas();
    triggerAlert('success', 'Módulo indexado com sucesso.');
  };

  const handleCadastrarAula = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titAula.trim() || !modAula) return triggerAlert('danger', 'Selecione o módulo de vinculação da aula.');
    if (duracaoAula <= 0 || ordemAula <= 0) return triggerAlert('danger', 'Valores de tempo/ordem inválidos.');
    const nova = { id: crypto.randomUUID(), idModulo: modAula, titulo: titAula, tipoConteudo: tipoAula, urlConteudo: "https://plataforma.cdn/stream", duracaoMinutos: Number(duracaoAula), ordem: Number(ordemAula) };
    await apiService.post('/aulas', nova);
    setTitAula('');
    triggerAlert('success', 'Aula adicionada com sucesso.');
  };

  const handleCadastrarTrilha = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titTrilha.trim() || !catTrilha) return triggerAlert('danger', 'Preencha os campos obrigatórios da trilha.');
    const nova = { id: crypto.randomUUID(), titulo: titTrilha, descricao: descTrilha, idCategoria: catTrilha };
    await apiService.post('/trilhas', nova);
    setTitTrilha(''); setDescTrilha('');
    triggerAlert('success', 'Trilha de conhecimento estabelecida.');
  };

  return (
    <div className="container">
      <h3 className="fw-bold text-dark mb-1">Painel Avançado de Controle</h3>
      <p className="text-secondary small mb-4">Gerencie as propriedades estruturais da universidade corporativa.</p>

      {feedback && <div className={`alert alert-${feedback.type} shadow-sm mb-4`}>{feedback.msg}</div>}

      <div className="row g-4 mb-5">
        <div className="col-md-6 col-lg-4">
          <div className="card border-0 shadow-sm p-3 h-100 bg-white">
            <h6 className="fw-bold text-primary mb-3">➕ Cadastrar Categoria</h6>
            <form onSubmit={handleCadastrarCategoria}>
              <div className="mb-2"><label className="form-label small fw-semibold">Nome da Categoria</label><input type="text" className="form-control form-control-sm" placeholder="Ex: Cloud Computing" value={nomeCat} onChange={e => setNomeCat(e.target.value)} /></div>
              <div className="mb-3"><label className="form-label small fw-semibold">Descrição Resumida</label><textarea className="form-control form-control-sm" rows={2} placeholder="Escopo conceitual..." value={descCat} onChange={e => setDescCat(e.target.value)}></textarea></div>
              <button type="submit" className="btn btn-primary btn-sm w-100 fw-bold">Salvar Categoria</button>
            </form>
          </div>
        </div>

        <div className="col-md-6 col-lg-4">
          <div className="card border-0 shadow-sm p-3 h-100 bg-white">
            <h6 className="fw-bold text-success mb-3">➕ Estruturar Novo Curso</h6>
            <form onSubmit={handleCadastrarCurso}>
              <div className="mb-2"><label className="form-label small fw-semibold">Título</label><input type="text" className="form-control form-control-sm" placeholder="Ex: Docker para Produção" value={titCurso} onChange={e => setTitCurso(e.target.value)} /></div>
              <div className="mb-2"><label className="form-label small fw-semibold">Categoria Relacionada</label><select className="form-select form-select-sm" value={catCurso} onChange={e => setCatCurso(e.target.value)}><option value="">Selecione...</option>{categorias.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}</select></div>
              <div className="row g-2 mb-2">
                <div className="col-6"><label className="form-label small fw-semibold">Nível</label><select className="form-select form-select-sm" value={nivelCurso} onChange={e => setNivelCurso(e.target.value)}><option value="Iniciante">Iniciante</option><option value="Intermediário">Intermediário</option><option value="Avançado">Avançado</option></select></div>
                <div className="col-6"><label className="form-label small fw-semibold">Horas</label><input type="number" className="form-control form-control-sm" value={horasCurso} onChange={e => setHorasCurso(Number(e.target.value))} /></div>
              </div>
              <div className="mb-2"><label className="form-label small fw-semibold">URL da Imagem de Capa</label><input type="text" className="form-control form-control-sm" placeholder="https://..." value={capaCurso} onChange={e => setCapaCurso(e.target.value)} /></div>
              <div className="mb-3"><label className="form-label small fw-semibold">Descrição</label><textarea className="form-control form-control-sm" rows={1} value={descCurso} onChange={e => setDescCurso(e.target.value)}></textarea></div>
              <button type="submit" className="btn btn-success btn-sm w-100 fw-bold">Salvar Curso</button>
            </form>
          </div>
        </div>

        <div className="col-md-6 col-lg-4">
          <div className="card border-0 shadow-sm p-3 h-100 bg-white">
            <h6 className="fw-bold text-warning mb-3">➕ Indexar Novo Módulo</h6>
            <form onSubmit={handleCadastrarModulo}>
              <div className="mb-2"><label className="form-label small fw-semibold">Curso Alvo</label><select className="form-select form-select-sm" value={cursoMod} onChange={e => setCursoMod(e.target.value)}><option value="">Selecione o Curso...</option>{cursos.map(c => <option key={c.id} value={c.id}>{c.titulo}</option>)}</select></div>
              <div className="mb-2"><label className="form-label small fw-semibold">Nome do Módulo</label><input type="text" className="form-control form-control-sm" placeholder="Ex: Orquestração Avançada" value={titMod} onChange={e => setTitMod(e.target.value)} /></div>
              <div className="mb-3"><label className="form-label small fw-semibold">Ordem Sequencial</label><input type="number" className="form-control form-control-sm" value={ordemMod} onChange={e => setOrdemMod(Number(e.target.value))} /></div>
              <button type="submit" className="btn btn-warning btn-sm w-100 fw-bold">Salvar Módulo</button>
            </form>
          </div>
        </div>

        <div className="col-md-6 col-lg-4">
          <div className="card border-0 shadow-sm p-3 h-100 bg-white">
            <h6 className="fw-bold text-info mb-3">➕ Adicionar Nova Aula</h6>
            <form onSubmit={handleCadastrarAula}>
              <div className="mb-2"><label className="form-label small fw-semibold">Módulo Alvo</label><select className="form-select form-select-sm" value={modAula} onChange={e => setModAula(e.target.value)}><option value="">Selecione o Módulo...</option>{modulos.map(m => <option key={m.id} value={m.id}>[{cursos.find(c => c.id === m.idCurso)?.titulo?.substring(0,10)}...] - {m.titulo}</option>)}</select></div>
              <div className="mb-2"><label className="form-label small fw-semibold">Nome do Conteúdo</label><input type="text" className="form-control form-control-sm" placeholder="Ex: Estruturas de Containers" value={titAula} onChange={e => setTitAula(e.target.value)} /></div>
              <div className="row g-2 mb-3">
                <div className="col-4"><label className="form-label small fw-semibold">Tipo</label><select className="form-select form-select-sm" value={tipoAula} onChange={e => setTipoAula(e.target.value)}><option value="Vídeo">Vídeo</option><option value="Texto">Texto</option><option value="Quiz">Quiz</option></select></div>
                <div className="col-4"><label className="form-label small fw-semibold">Minutos</label><input type="number" className="form-control form-control-sm" value={duracaoAula} onChange={e => setDuracaoAula(Number(e.target.value))} /></div>
                <div className="col-4"><label className="form-label small fw-semibold">Ordem</label><input type="number" className="form-control form-control-sm" value={ordemAula} onChange={e => setOrdemAula(Number(e.target.value))} /></div>
              </div>
              <button type="submit" className="btn btn-info text-white btn-sm w-100 fw-bold">Salvar Aula</button>
            </form>
          </div>
        </div>

        <div className="col-md-6 col-lg-4">
          <div className="card border-0 shadow-sm p-3 h-100 bg-white">
            <h6 className="fw-bold text-purple mb-3" style={{ color: '#6f42c1' }}>➕ Nova Trilha de Conhecimento</h6>
            <form onSubmit={handleCadastrarTrilha}>
              <div className="mb-2"><label className="form-label small fw-semibold">Título da Trilha</label><input type="text" className="form-control form-control-sm" placeholder="Ex: Especialista DevOps" value={titTrilha} onChange={e => setTitTrilha(e.target.value)} /></div>
              <div className="mb-2"><label className="form-label small fw-semibold">Categoria Macro</label><select className="form-select form-select-sm" value={catTrilha} onChange={e => setCatTrilha(e.target.value)}><option value="">Selecione...</option>{categorias.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}</select></div>
              <div className="mb-3"><label className="form-label small fw-semibold">Objetivos de Carreira</label><textarea className="form-control form-control-sm" rows={1} value={descTrilha} onChange={e => setDescTrilha(e.target.value)}></textarea></div>
              <button type="submit" className="btn btn-sm w-100 text-white fw-bold" style={{ backgroundColor: '#6f42c1' }}>Salvar Trilha</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
