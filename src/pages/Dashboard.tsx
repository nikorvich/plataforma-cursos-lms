import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import type {
  Categoria,
  Curso,
  Modulo,
  Aula
} from '../model/types';

export const Dashboard: React.FC = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [modulos, setModulos] = useState<Modulo[]>([]);
  const [aulas, setAulas] = useState<Aula[]>([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string>('all');
  const [cursoSelecionadoId, setCursoSelecionadoId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      apiService.get<Categoria[]>('/categorias'),
      apiService.get<Curso[]>('/cursos'),
      apiService.get<Modulo[]>('/modulos'),
      apiService.get<Aula[]>('/aulas')
    ])
    .then(([catRes, curRes, modRes, aulRes]) => {
      setCategorias(catRes);
      setCursos(curRes);
      setModulos(modRes);
      setAulas(aulRes);
      setLoading(false);
    })
    .catch(() => {
      setErro("Houve uma inconsistência ao buscar os dados da API remota.");
      setLoading(false);
    });
  }, []);

  const cursosFiltrados = categoriaSelecionada === 'all' 
    ? cursos 
    : cursos.filter(c => c.idCategoria === categoriaSelecionada);

  const cursoAtivo = cursos.find(c => c.id === cursoSelecionadoId);

  if (loading) return <div className="container text-center my-5"><div className="spinner-border text-primary" role="status"></div><p className="mt-2 text-secondary">Sincronizando Plataforma...</p></div>;
  if (erro) return <div className="container my-4"><div className="alert alert-danger shadow-sm">{erro}</div></div>;

  return (
    <div className="container">
      <div className="row g-4">
        <div className="col-lg-7">
          <div className="card border-0 shadow-sm p-3 mb-4 bg-white">
            <label className="form-label text-uppercase text-secondary fw-bold small">Selecione uma Categoria Funcional</label>
            <div className="d-flex flex-wrap gap-2">
              <button className={`btn btn-sm ${categoriaSelecionada === 'all' ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setCategoriaSelecionada('all')}>Todos os Cursos</button>
              {categorias.map(cat => (
                <button key={cat.id} className={`btn btn-sm ${categoriaSelecionada === cat.id ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setCategoriaSelecionada(cat.id)}>{cat.nome}</button>
              ))}
            </div>
          </div>

          <h4 className="fw-bold text-dark mb-3">Grades Curriculares Ativas</h4>
          <div className="row row-cols-1 row-cols-md-2 g-3">
            {cursosFiltrados.map(curso => (
              <div className="col" key={curso.id}>
                <div className="card h-100 border-0 shadow-sm overflow-hidden bg-white">
                  <img src={curso.capaUrl} className="card-img-top object-fit-cover" style={{ height: '140px' }} alt={curso.titulo} />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title fw-bold text-dark mb-1">{curso.titulo}</h5>
                    <span className="badge bg-light text-primary border align-self-start mb-2">{curso.nivel}</span>
                    <p className="card-text text-muted small flex-grow-1">{curso.descricao}</p>
                    <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
                      <span className="small text-secondary font-monospace">⏱️ {curso.totalHoras} Horas</span>
                      <button className="btn btn-dark btn-sm fw-semibold" onClick={() => setCursoSelecionadoId(curso.id)}>Ver Conteúdo</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-lg-5">
          {cursoAtivo ? (
            <div className="card border-0 shadow-sm sticky-top" style={{ top: '15px' }}>
              <div className="card-header bg-dark text-white p-3 d-flex justify-content-between align-items-center">
                <div>
                  <small className="text-primary text-uppercase font-monospace d-block" style={{ fontSize: '0.7rem' }}>Hierarquia do Conteúdo Acadêmico</small>
                  <h6 className="mb-0 fw-bold">{cursoAtivo.titulo}</h6>
                </div>
                <button className="btn-close btn-close-white" onClick={() => setCursoSelecionadoId(null)}></button>
              </div>
              <div className="card-body bg-white" style={{ maxHeight: '75vh', overflowY: 'auto' }}>
                {modulos.filter(m => m.idCurso === cursoAtivo.id).length === 0 ? (
                  <p className="text-muted text-center py-4 small mb-0">Nenhum módulo ou aula indexada para este curso.</p>
                ) : (
                  modulos
                    .filter(m => m.idCurso === cursoAtivo.id)
                    .sort((a,b) => a.ordem - b.ordem)
                    .map(mod => (
                      <div className="border border-light rounded mb-3 bg-light overflow-hidden" key={mod.id}>
                        <div className="bg-light p-2 fw-bold text-dark small border-bottom">📦 Módulo {mod.ordem}: {mod.titulo}</div>
                        <div className="list-group list-group-flush">
                          {aulas
                            .filter(a => a.idModulo === mod.id)
                            .sort((a,b) => a.ordem - b.ordem)
                            .map(aula => (
                              <div key={aula.id} className="list-group-item bg-white d-flex justify-content-between align-items-center py-2 px-3">
                                <span className="small text-dark">▶️ {aula.ordem}. {aula.titulo} <small className="text-muted">({aula.tipoConteudo})</small></span>
                                <span className="badge bg-secondary-subtle text-secondary small">{aula.duracaoMinutes || aula.duracaoMinutos} min</span>
                              </div>
                            ))}
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>
          ) : (
            <div className="card border-0 shadow-sm text-center p-5 text-muted bg-white sticky-top" style={{ top: '15px' }}>
              <div className="fs-1 mb-2">📖</div>
              <h5 className="fw-bold text-dark">Inspetor Hierárquico</h5>
              <p className="small mb-0">Selecione qualquer curso da listagem ao lado para detalhar sua divisão estrutural de módulos e aulas.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
