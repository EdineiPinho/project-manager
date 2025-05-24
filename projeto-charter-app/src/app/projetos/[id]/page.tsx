import { PrismaClient } from '@/generated/prisma';
import { notFound } from 'next/navigation';

const prisma = new PrismaClient();

interface Props {
  params: {
    id: string;
  };
}

// Helper function to format date (can be moved to a utils file)
const formatDate = (dateString: Date | string | undefined | null) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Helper function to format currency (can be moved to a utils file)
const formatCurrency = (amount: number | undefined | null) => {
  if (amount === undefined || amount === null) return 'N/A';
  return amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

export default async function ProjetoPage({ params }: Props) {
  const { id } = params;

  if (isNaN(parseInt(id))) {
    // If ID is not a number, it's an invalid route
    return (
      <div className="container mx-auto p-4 max-w-2xl">
        <h1 className="text-2xl font-bold text-red-600">ID de Projeto Inválido</h1>
        <p className="text-slate-700">O ID fornecido não é um número válido.</p>
      </div>
    );
  }

  let projeto;
  try {
    projeto = await prisma.termoAberturaProjeto.findUnique({
      where: { id: parseInt(id) },
    });
  } catch (error) {
    console.error("Failed to fetch project charter:", error);
    // This could be a database connection error or other server-side issue
    return (
      <div className="container mx-auto p-4 max-w-2xl">
        <h1 className="text-2xl font-bold text-red-600">Erro ao Carregar Projeto</h1>
        <p className="text-slate-700">Não foi possível buscar os dados do projeto. Tente novamente mais tarde.</p>
      </div>
    );
  }

  if (!projeto) {
    notFound(); // Triggers Next.js 404 page
  }

  const detailItemClass = "py-2";
  const labelClass = "font-semibold text-slate-700";
  const valueClass = "text-slate-900";
  const sectionTitleClass = "text-xl font-semibold text-slate-800 mt-6 mb-3 border-b pb-2";

  return (
    <div className="container mx-auto p-4 max-w-3xl bg-white shadow-md rounded-lg my-8">
      <h1 className="text-3xl font-bold mb-6 text-slate-800 border-b pb-4">{projeto.nomeProjeto}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        
        <div className={detailItemClass}>
          <p className={labelClass}>ID do Projeto:</p>
          <p className={valueClass}>{projeto.id}</p>
        </div>

        <div className={detailItemClass}>
          <p className={labelClass}>Gerente do Projeto:</p>
          <p className={valueClass}>{projeto.gerenteProjeto}</p>
        </div>

        <div className={`${detailItemClass} col-span-1 md:col-span-2`}>
          <p className={labelClass}>Objetivo:</p>
          <p className={`${valueClass} whitespace-pre-wrap`}>{projeto.objetivo}</p>
        </div>

        <div className={`${detailItemClass} col-span-1 md:col-span-2`}>
          <p className={labelClass}>Justificativa:</p>
          <p className={`${valueClass} whitespace-pre-wrap`}>{projeto.justificativa}</p>
        </div>
      </div>

      <h2 className={sectionTitleClass}>Detalhes Operacionais</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        <div className={detailItemClass}>
          <p className={labelClass}>Stakeholders Principais:</p>
          <p className={valueClass}>{projeto.stakeholdersPrincipais}</p>
        </div>
        
        <div className={detailItemClass}>
          <p className={labelClass}>Orçamento Estimado:</p>
          <p className={valueClass}>{formatCurrency(projeto.orcamentoEstimado)}</p>
        </div>

        <div className={detailItemClass}>
          <p className={labelClass}>Cronograma Inicial:</p>
          <p className={valueClass}>{formatDate(projeto.cronogramaInicial)?.split(',')[0]}</p> 
        </div>

        <div className={detailItemClass}>
          <p className={labelClass}>Autorização Formal:</p>
          <p className={valueClass}>{projeto.autorizacaoFormal ? 'Sim' : 'Não'}</p>
        </div>
      </div>
      
      <h2 className={sectionTitleClass}>Premissas e Restrições</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        <div className={`${detailItemClass} col-span-1 md:col-span-2`}>
          <p className={labelClass}>Premissas:</p>
          <p className={`${valueClass} whitespace-pre-wrap`}>{projeto.premissas}</p>
        </div>

        <div className={`${detailItemClass} col-span-1 md:col-span-2`}>
          <p className={labelClass}>Restrições:</p>
          <p className={`${valueClass} whitespace-pre-wrap`}>{projeto.restricoes}</p>
        </div>
      </div>

      <h2 className={sectionTitleClass}>Entregas</h2>
      <div className={detailItemClass}>
        <p className={labelClass}>Principais Entregas:</p>
        <p className={`${valueClass} whitespace-pre-wrap`}>{projeto.principaisEntregas}</p>
      </div>
      
      <h2 className={sectionTitleClass}>Datas de Registro</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        <div className={detailItemClass}>
          <p className={labelClass}>Criado em:</p>
          <p className={valueClass}>{formatDate(projeto.createdAt)}</p>
        </div>

        <div className={detailItemClass}>
          <p className={labelClass}>Última Atualização:</p>
          <p className={valueClass}>{formatDate(projeto.updatedAt)}</p>
        </div>
      </div>

    </div>
  );
}
