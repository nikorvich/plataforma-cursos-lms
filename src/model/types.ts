export interface Usuario { id: string; nomeCompleto: string; email: string; senhaHash: string; dataCadastro: string; }
export interface Categoria { id: string; nome: string; descricao: string; }
export interface Curso { id: string; titulo: string; descricao: string; idInstrutor: string; idCategoria: string; nivel: string; dataPublicacao: string; totalAulas: number; totalHoras: number; capaUrl: string; }
export interface Modulo { id: string; idCurso: string; titulo: string; ordem: number; }
export interface Aula { id: string; idModulo: string; titulo: string; tipoConteudo: string; urlConteudo: string; duracaoMinutos: number; ordem: number; }
export interface Matricula { id: string; idUsuario: string; idCurso: string; dataMatricula: string; dataConclusao: string | null; }
export interface ProgressoAula { id: string; idUsuario: string; idAula: string; dataConclusao: string; status: string; }
export interface Avaliacao { id: string; idUsuario: string; idCurso: string; nota: number; comentario: string | null; dataAvaliacao: string; }
export interface Trilha { id: string; titulo: string; descricao: string; idCategoria: string; }
export interface TrilhaCurso { id: string; idTrilha: string; idCurso: string; ordem: number; }
export interface Certificado { id: string; idUsuario: string; idCurso: string; idTrilha: string | null; codigoVerificacao: string; dataEmissao: string; }
export interface Plano { id: string; nome: string; descricao: string; preco: number; duracaoMeses: number; }
export interface Assinatura { id: string; idUsuario: string; idPlano: string; dataInicio: string; dataFim: string; }
export interface Pagamento { id: string; idAssinatura: string; valorPago: number; dataPagamento: string; metodoPagamento: string; idTransacaoGateway: string; }
