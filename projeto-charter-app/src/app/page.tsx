import Link from 'next/link';
import { PrismaClient } from '@/generated/prisma';
import { TermoAberturaProjeto } from '@/generated/prisma';

const prisma = new PrismaClient();

async function getProjetos() {
  try {
    const projetos = await prisma.termoAberturaProjeto.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return projetos;
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return []; // Return empty array on error
  }
}

const formatDate = (dateString: Date | string | undefined | null) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export default async function HomePage() {
  const projetos = await getProjetos();

  return (
    <div className="space-y-8">
      <section className="bg-white shadow-lg rounded-lg p-8 text-center">
        <h1 className="text-4xl font-bold text-sky-700 mb-4">
          Bem-vindo ao Gerenciador de Termos de Abertura de Projeto
        </h1>
        <p className="text-lg text-slate-600 mb-6">
          Crie, gerencie e visualize seus termos de abertura de projeto de forma eficiente.
        </p>
        <Link
          href="/projetos/novo"
          className="inline-block bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-colors duration-150 ease-in-out"
        >
          Criar Novo Termo de Abertura
        </Link>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-slate-800 mb-6">Projetos Recentes</h2>
        {projetos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projetos.map((projeto: TermoAberturaProjeto) => (
              <Link key={projeto.id} href={`/projetos/${projeto.id}`} legacyBehavior>
                <a className="block bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition-shadow duration-150 ease-in-out">
                  <h3 className="text-xl font-semibold text-sky-700 mb-2">{projeto.nomeProjeto}</h3>
                  <p className="text-sm text-slate-600 mb-1">
                    <span className="font-medium">Gerente:</span> {projeto.gerenteProjeto}
                  </p>
                  <p className="text-sm text-slate-600 mb-3">
                    <span className="font-medium">Criado em:</span> {formatDate(projeto.createdAt)}
                  </p>
                  <p className="text-slate-700 text-sm line-clamp-3">{projeto.objetivo}</p>
                </a>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg p-8 text-center">
            <p className="text-slate-600 text-lg">Nenhum projeto encontrado.</p>
            <p className="text-slate-500 mt-2">
              Comece criando um novo termo de abertura clicando no botão acima.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
