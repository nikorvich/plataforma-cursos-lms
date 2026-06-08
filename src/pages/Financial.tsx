import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import type {
  Plano,
  Assinatura,
  Pagamento,
  Usuario
} from '../model/types';

export const Financial: React.FC = () => {
  const [planos, setPlanos] = useState<Plano[]>([]);
  const [assinaturas, setAssinaturas] = useState<Assinatura[]>([]);
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
  const [planoSelecionado, setPlanoSelecionado] = useState<Plano | null>(null);
  const [metodoPagamento, setMetodoPagamento] = useState<string>('Cartão de Crédito');
  const [feedback, setFeedback] = useState<string | null>(null);

  const carregarFinanceiro = () => {
    Promise.all([
      apiService.get<Plano[]>('/planos'),
      apiService.get<Assinatura[]>('/assinaturas'),
      apiService.get<Pagamento[]>('/pagamentos')
    ]).then(([pl, ass, pag]) => {
      setPlanos(pl); setAssinaturas(ass); setPagamentos(pag);
    });
  };

  useEffect(() => { carregarFinanceiro(); }, []);

  const handleFinalizarCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!planoSelecionado) return;

    const idAssinatura = crypto.randomUUID();
    const novaAssinatura: Assinatura = { id: idAssinatura, idUsuario: "u2", idPlano: planoSelecionado.id, dataInicio: "2026-06-07", dataFim: "2026-07-07" };
    const novoPagamento: Pagamento = { id: crypto.randomUUID(), idAssinatura: idAssinatura, valorPago: planoSelecionado.preco, dataPagamento: "2026-06-07", metodoPagamento: metodoPagamento, idTransacaoGateway: `TX-GATE-${Math.floor(Math.random()*90000+10000)}` };

    await apiService.post('/assinaturas', novaAssinatura);
    await apiService.post('/pagamentos', novoPagamento);

    setPlanoSelecionado(null);
    setFeedback("Transação de checkout concluída e homologada pelo gateway financeiro!");
    carregarFinanceiro();
    setTimeout(() => setFeedback(null), 4000);
  };

  return (
    <div className="container">
      <h3 className="fw-bold text-dark mb-1">Módulo Corporativo e Checkout</h3>
      <p className="text-secondary small mb-4">Escolha planos de assinatura recorrente com processamento em tempo real.</p>

      {feedback && <div className="alert alert-success shadow-sm mb-4">{feedback}</div>}

      <div className="row g-4">
        <div className="col-lg-7">
          <h5 className="fw-bold mb-3">Planos de Assinatura Disponíveis</h5>
          <div className="row g-3 mb-4">
            {planos.map(pl => (
              <div className="col-md-6" key={pl.id}>
                <div className="card h-100 border-0 shadow-sm p-3 bg-white text-center">
                  <h6 className="fw-bold text-dark mb-1">{pl.nome}</h6>
                  <p className="text-muted small flex-grow-1 mb-3">{pl.descricao}</p>
                  <h4 className="fw-bold text-primary font-monospace mb-3">R$ {pl.preco.toFixed(2)}<small className="text-secondary fs-6"> / {pl.duracaoMeses}M</small></h4>
                  <button className="btn btn-outline-primary btn-sm w-100 fw-bold" onClick={() => setPlanoSelecionado(pl)}>Selecionar Plano</button>
                </div>
              </div>
            ))}
          </div>

          <h5 className="fw-bold mb-3">Histórico de Transações de Assinantes</h5>
          <div className="card border-0 shadow-sm bg-white overflow-hidden">
            <table className="table table-sm table-hover align-middle mb-0 small">
              <thead className="table-dark">
                <tr>
                  <th className="p-2">ID Transação</th>
                  <th className="p-2">Método</th>
                  <th className="p-2">Valor Pago</th>
                  <th className="p-2">Data</th>
                </tr>
              </thead>
              <tbody>
                {pagamentos.map(p => (
                  <tr key={p.id}>
                    <td className="p-2 font-monospace text-primary fw-bold">{p.idTransacaoGateway}</td>
                    <td className="p-2">{p.metodoPagamento}</td>
                    <td className="p-2 font-monospace text-success fw-bold">R$ {p.valorPago.toFixed(2)}</td>
                    <td className="p-2 text-secondary">{p.dataPagamento}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="col-lg-5">
          {planoSelecionado ? (
            <div className="card border-0 shadow-sm sticky-top p-3 bg-white" style={{ top: '15px' }}>
              <h5 className="fw-bold text-dark border-bottom pb-2 mb-3">💳 Checkout de Segurança</h5>
              <form onSubmit={handleFinalizarCheckout}>
                <div className="mb-2 bg-light p-2 rounded border">
                  <span className="small text-muted d-block">Item Selecionado:</span>
                  <span className="fw-bold text-dark d-block">{planoSelecionado.nome}</span>
                  <span className="text-success fw-bold font-monospace">R$ {planoSelecionado.preco.toFixed(2)}</span>
                </div>

                <div className="mb-4">
                  <label className="form-label small fw-semibold">Método de Liquidação</label>
                  <select className="form-select form-select-sm" value={metodoPagamento} onChange={e => setMetodoPagamento(e.target.value)}>
                    <option value="Cartão de Crédito">Cartão de Crédito (Visa/Master)</option>
                    <option value="Pix Instantâneo">Pix Instantâneo Nacional</option>
                    <option value="Boleto Bancário">Boleto Bancário</option>
                  </select>
                </div>

                <button type="submit" className="btn btn-primary btn-sm w-100 fw-bold py-2">Confirmar Pagamento Simulado</button>
              </form>
            </div>
          ) : (
            <div className="card border-0 shadow-sm text-center p-5 text-muted bg-white sticky-top" style={{ top: '15px' }}>
              <div className="fs-2 mb-2">💳</div>
              <h5 className="fw-bold text-dark">Checkout Seguro</h5>
              <p className="small mb-0">Selecione um plano à esquerda para iniciar o formulário de simulação financeira.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
