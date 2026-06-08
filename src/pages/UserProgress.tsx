import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import type {
  Usuario,
  Curso,
  Matricula,
  ProgressoAula,
  Certificado,
  Aula
} from '../model/types';

export const UserProgress: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [matriculas, setMatriculas] = useState<Matricula[]>([]);
  const [aulas, setAulas] = useState<Aula[]>([]);
  const [progresos, setProgresos] = useState<ProgressoAula[]>([]);
  const [certificados, setCertificados] = useState<Certificado[]>([]);

  // Estado do simulador de login de aluno ativo
  const [alunoAtivoId, setAlunoAtivoId] = useState<string>('u2');
  const [cursoMatriculaId, setCursoMatriculaId] = useState<string>('');

  const sincronizarAmbiente = () => {
    Promise.all([
      apiService.get<Usuario[]>('/usuarios'),
      apiService.get<Curso[]>('/cursos'),
      apiService.get<Matricula[]>('/matriculas'),
      apiService.get<Aula[]>('/aulas'),
      apiService.get<ProgressoAula[]>('/progresso_aulas'),
      apiService.get<Certificado[]>('/certificados')
    ]).then(([u, c, m, a, p, cert]) => {
      setUsuarios(u); setCursos(c); setMatriculas(m); setAulas(a); setProgresos(p); setCertificados(cert);
    });
  };

  useEffect(() => { sincronizarAmbiente(); }, []);

  const handleSimularMatricula = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cursoMatriculaId) return;
    const jaMatriculado = matriculas.some(m => m.idUsuario === alunoAtivoId && m.idCurso === cursoMatriculaId);
    if (jaMatriculado) return alert("O usuário logado já possui matrícula neste curso.");

    const novaMatricula: Matricula = {
      id: crypto.randomUUID(), idUsuario: alunoAtivoId, idCurso: cursoMatriculaId,
      dataMatricula: "2026-06-07", dataConclusao: null
    };
    await apiService.post('/matriculas', novaMatricula);
    sincronizarAmbiente();
  };

  const handleToggleAula = async (aulaId: string) => {
    const progExistente = progresos.find(p => p.idUsuario === alunoAtivoId && p.idAula === aulaId);
    if (progExistente) return; // Simulação direta de conclusão permanente

    const novoProg: ProgressoAula = { id: crypto.randomUUID(), idUsuario: alunoAtivoId, idAula: aulaId, dataConclusao: "2026-06-07", status: "Concluído" };
    await apiService.post('/progresso_aulas', novoProg);
    sincronizarAmbiente();
  };

  const handleEmitirCertificado = async (cursoId: string) => {
    const jaPossui = certificados.some(c => c.idUsuario === alunoAtivoId && c.idCurso === cursoId);
    if (jaPossui) return;

    const novoCert: Certificado = { id: crypto.randomUUID(), idUsuario: alunoAtivoId, idCurso: cursoId, idTrilha: null, codigoVerificacao: `CERT-${Math.floor(Math.random()*900000+100000)}-ACAD`, dataEmissao: "2026-06-07" };
    await apiService.post('/certificados', novoCert);
    sincronizarAmbiente();
  };

  const matriculasDoAluno = matriculas.filter(m => m.idUsuario === alunoAtivoId);
  const certificadosDoAluno = certificados.filter(c => c.idUsuario === alunoAtivoId);

  return (
    <div className="container">
      <div className="row g-4">
        
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm p-3 mb-4 bg-white">
            <h6 className="fw-bold text-dark mb-3">👤 Simulador de Contexto de Usuário</h6>
            <label className="form-label small fw-semibold">Aluno Ativo no Sistema</label>
            <select className="form-select form-select-sm mb-3" value={alunoAtivoId} onChange={e => setAlunoAtivoId(e.target.value)}>
              {usuarios.map(u => <option key={u.id} value={u.id}>{u.nomeCompleto} ({u.email})</option>)}
            </select>

            <h6 className="fw-bold text-primary small border-top pt-3">⚡ Nova Matrícula Instantânea</h6>
            <form onSubmit={handleSimularMatricula} className="d-flex gap-2">
              <select className="form-select form-select-sm" value={cursoMatriculaId} onChange={e => setCursoMatriculaId(e.target.value)}>
                <option value="">Selecione o Curso Alvo...</option>
                {cursos.map(c => <option key={c.id} value={c.id}>{c.titulo}</option>)}
              </select>
              <button type="submit" className="btn btn-primary btn-sm px-3 fw-bold text-nowrap">Matricular Aluno</button>
            </form>
          </div>

          <h4 className="fw-bold text-dark mb-3">Cursos Matriculados & Progresso</h4>
          {matriculasDoAluno.length === 0 ? (
            <p className="text-muted small">Nenhuma matrícula registrada para este usuário.</p>
          ) : (
            matriculasDoAluno.map(m => {
              const curso = cursos.find(c => c.id === m.idCurso);
              if (!curso) return null;
              return (
                <div className="card border-0 shadow-sm p-3 mb-3 bg-white" key={m.id}>
                  <h6 className="fw-bold text-dark mb-2">{curso.titulo}</h6>
                  <p className="text-muted small mb-3">Data de Entrada: {m.dataMatricula}</p>
                  
                  <div className="p-2 bg-light rounded border mb-3">
                    <span className="small text-uppercase text-secondary d-block fw-bold mb-2" style={{ fontSize: '0.65rem' }}>Aulas do Curso</span>
                    {aulas.map(aula => {
                      const concluida = progresos.some(p => p.idUsuario === alunoAtivoId && p.idAula === aula.id);
                      return (
                        <div className="d-flex justify-content-between align-items-center mb-1 bg-white p-1 rounded px-2" key={aula.id}>
                          <span className="small text-dark">{aula.titulo}</span>
                          <button className={`btn btn-sm py-0 font-monospace ${concluida ? 'btn-success disabled' : 'btn-outline-secondary'}`} style={{ fontSize: '0.75rem' }} onClick={() => handleToggleAula(aula.id)} disabled={concluida}>
                            {concluida ? '✓ Concluída' : 'Marcar Conclusão'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                  <button className="btn btn-dark btn-sm fw-bold w-100" onClick={() => handleEmitirCertificado(curso.id)}>Gerar Certificado de Conclusão</button>
                </div>
              );
            })
          )}
        </div>

        <div className="col-lg-6">
          <h4 className="fw-bold text-dark mb-3">📜 Livro de Certificados Emitidos</h4>
          {certificadosDoAluno.length === 0 ? (
            <div className="card border-0 p-4 text-center text-muted bg-white shadow-sm small">Termine as aulas de sua matrícula e clique em gerar para ver o documento legal assinado eletronicamente aqui.</div>
          ) : (
            certificadosDoAluno.map(cert => {
              const curso = cursos.find(c => c.id === cert.idCurso);
              return (
                <div className="card border border-primary shadow-sm bg-white text-dark mb-3 overflow-hidden position-relative" key={cert.id} style={{ borderStyle: 'dashed !important', borderWidth: '2px !important' }}>
                  <div className="card-body p-4 text-center">
                    <div className="fs-3 mb-1">🎓</div>
                    <h5 className="fw-serif text-primary fw-bold mb-1">CERTIFICADO ACADÊMICO</h5>
                    <p className="text-secondary small mb-3" style={{ fontSize: '0.75rem' }}>A plataforma oficial valida que o aluno concluiu com êxito:</p>
                    <h6 className="fw-bold text-dark border-bottom pb-2 mb-3 px-3">{curso?.titulo || 'Formação Executiva'}</h6>
                    <div className="d-flex justify-content-between text-start border-top pt-2 mt-3 text-secondary font-monospace" style={{ fontSize: '0.7rem' }}>
                      <span>Emissão: {cert.dataEmissao}</span>
                      <span className="text-primary fw-bold">Chave: {cert.codigoVerificacao}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
};
