'use client';

import { useState, FormEvent } from 'react';

type FormData = {
  nomeProjeto: string;
  objetivo: string;
  justificativa: string;
  stakeholdersPrincipais: string;
  gerenteProjeto: string;
  premissas: string;
  restricoes: string;
  principaisEntregas: string;
  orcamentoEstimado: number | string; // string to allow empty input for number type
  cronogramaInicial: string;
  autorizacaoFormal: boolean;
};

export default function NovoProjetoPage() {
  const [formData, setFormData] = useState<FormData>({
    nomeProjeto: '',
    objetivo: '',
    justificativa: '',
    stakeholdersPrincipais: '',
    gerenteProjeto: '',
    premissas: '',
    restricoes: '',
    principaisEntregas: '',
    orcamentoEstimado: '', // Initialize as empty string
    cronogramaInicial: '',
    autorizacaoFormal: false,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; content: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: value === '' ? '' : parseFloat(value) }));
    } 
    else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    // Ensure orcamentoEstimado is a number before sending
    const submissionData = {
      ...formData,
      orcamentoEstimado: parseFloat(formData.orcamentoEstimado as string),
    };

    // Basic validation before submission (can be expanded)
    if (isNaN(submissionData.orcamentoEstimado)) {
      setMessage({ type: 'error', content: 'Orçamento Estimado deve ser um número válido.' });
      setIsLoading(false);
      return;
    }
    if (!submissionData.cronogramaInicial) {
        setMessage({ type: 'error', content: 'Cronograma Inicial é obrigatório.'});
        setIsLoading(false);
        return;
    }

    try {
      const response = await fetch('/api/projetos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', content: 'Projeto criado com sucesso! ID: ' + result.id });
        // Reset form
        setFormData({
          nomeProjeto: '',
          objetivo: '',
          justificativa: '',
          stakeholdersPrincipais: '',
          gerenteProjeto: '',
          premissas: '',
          restricoes: '',
          principaisEntregas: '',
          orcamentoEstimado: '',
          cronogramaInicial: '',
          autorizacaoFormal: false,
        });
      } else {
        setMessage({ type: 'error', content: `Erro ao criar projeto: ${result.error || response.statusText}` });
      }
    } catch (error) {
      console.error('Falha ao submeter formulário:', error);
      setMessage({ type: 'error', content: 'Falha ao conectar com o servidor. Tente novamente.' });
    } finally {
      setIsLoading(false);
    }
  };

  const commonInputClass = "mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none";
  const commonLabelClass = "block text-sm font-medium text-slate-700";
  const commonTextareaClass = `${commonInputClass} min-h-24`; // min-h-24 for textareas

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6 text-slate-800">Criar Novo Termo de Abertura de Projeto</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="nomeProjeto" className={commonLabelClass}>Nome do Projeto:</label>
          <input type="text" name="nomeProjeto" id="nomeProjeto" value={formData.nomeProjeto} onChange={handleChange} required className={commonInputClass} />
        </div>

        <div>
          <label htmlFor="objetivo" className={commonLabelClass}>Objetivo:</label>
          <textarea name="objetivo" id="objetivo" value={formData.objetivo} onChange={handleChange} required className={commonTextareaClass} />
        </div>

        <div>
          <label htmlFor="justificativa" className={commonLabelClass}>Justificativa:</label>
          <textarea name="justificativa" id="justificativa" value={formData.justificativa} onChange={handleChange} required className={commonTextareaClass} />
        </div>

        <div>
          <label htmlFor="stakeholdersPrincipais" className={commonLabelClass}>Stakeholders Principais:</label>
          <input type="text" name="stakeholdersPrincipais" id="stakeholdersPrincipais" value={formData.stakeholdersPrincipais} onChange={handleChange} required className={commonInputClass} />
        </div>

        <div>
          <label htmlFor="gerenteProjeto" className={commonLabelClass}>Gerente do Projeto:</label>
          <input type="text" name="gerenteProjeto" id="gerenteProjeto" value={formData.gerenteProjeto} onChange={handleChange} required className={commonInputClass} />
        </div>

        <div>
          <label htmlFor="premissas" className={commonLabelClass}>Premissas:</label>
          <textarea name="premissas" id="premissas" value={formData.premissas} onChange={handleChange} required className={commonTextareaClass} />
        </div>

        <div>
          <label htmlFor="restricoes" className={commonLabelClass}>Restrições:</label>
          <textarea name="restricoes" id="restricoes" value={formData.restricoes} onChange={handleChange} required className={commonTextareaClass} />
        </div>

        <div>
          <label htmlFor="principaisEntregas" className={commonLabelClass}>Principais Entregas:</label>
          <textarea name="principaisEntregas" id="principaisEntregas" value={formData.principaisEntregas} onChange={handleChange} required className={commonTextareaClass} />
        </div>

        <div>
          <label htmlFor="orcamentoEstimado" className={commonLabelClass}>Orçamento Estimado (R$):</label>
          <input type="number" name="orcamentoEstimado" id="orcamentoEstimado" value={formData.orcamentoEstimado} onChange={handleChange} required className={commonInputClass} step="0.01" />
        </div>

        <div>
          <label htmlFor="cronogramaInicial" className={commonLabelClass}>Cronograma Inicial:</label>
          <input type="date" name="cronogramaInicial" id="cronogramaInicial" value={formData.cronogramaInicial} onChange={handleChange} required className={commonInputClass} />
        </div>

        <div className="flex items-center">
          <input type="checkbox" name="autorizacaoFormal" id="autorizacaoFormal" checked={formData.autorizacaoFormal} onChange={handleChange} className="h-4 w-4 text-sky-600 border-slate-300 rounded focus:ring-sky-500" />
          <label htmlFor="autorizacaoFormal" className="ml-2 block text-sm text-slate-900">Autorização Formal Recebida</label>
        </div>

        <div>
          <button type="submit" disabled={isLoading} className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline disabled:bg-slate-400">
            {isLoading ? 'Criando...' : 'Criar Projeto'}
          </button>
        </div>
      </form>

      {message && (
        <div className={`mt-4 p-4 rounded-md ${message.type === 'success' ? 'bg-green-100 border border-green-400 text-green-700' : 'bg-red-100 border border-red-400 text-red-700'}`}>
          <p>{message.content}</p>
        </div>
      )}
    </div>
  );
}
