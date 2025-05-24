import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      nomeProjeto,
      objetivo,
      justificativa,
      stakeholdersPrincipais,
      gerenteProjeto,
      premissas,
      restricoes,
      principaisEntregas,
      orcamentoEstimado,
      cronogramaInicial,
      // autorizacaoFormal is optional and defaults to false in schema
    } = body;

    // Basic validation: Check for required fields
    if (
      !nomeProjeto ||
      !objetivo ||
      !justificativa ||
      !stakeholdersPrincipais ||
      !gerenteProjeto ||
      !premissas ||
      !restricoes ||
      !principaisEntregas ||
      orcamentoEstimado === undefined || // Check for undefined as 0 is a valid budget
      !cronogramaInicial
    ) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Type validation (basic example, more robust validation can be added)
    if (
      typeof nomeProjeto !== 'string' ||
      typeof objetivo !== 'string' ||
      typeof justificativa !== 'string' ||
      typeof stakeholdersPrincipais !== 'string' ||
      typeof gerenteProjeto !== 'string' ||
      typeof premissas !== 'string' ||
      typeof restricoes !== 'string' ||
      typeof principaisEntregas !== 'string' ||
      typeof orcamentoEstimado !== 'number' ||
      (typeof cronogramaInicial !== 'string' && !(cronogramaInicial instanceof Date)) // Allow string or Date
    ) {
      return NextResponse.json({ error: 'Invalid data types' }, { status: 400 });
    }
    
    // Validate cronogramaInicial is a valid date string
    const cronogramaDate = new Date(cronogramaInicial);
    if (isNaN(cronogramaDate.getTime())) {
        return NextResponse.json({ error: 'Invalid cronogramaInicial date format' }, { status: 400 });
    }


    const novoTermo = await prisma.termoAberturaProjeto.create({
      data: {
        nomeProjeto,
        objetivo,
        justificativa,
        stakeholdersPrincipais,
        gerenteProjeto,
        premissas,
        restricoes,
        principaisEntregas,
        orcamentoEstimado,
        cronogramaInicial: cronogramaDate, // Use the validated Date object
        // autorizacaoFormal will default to false as per schema
      },
    });

    return NextResponse.json(novoTermo, { status: 201 });
  } catch (error) {
    console.error('Error creating project charter:', error);
    if (error instanceof SyntaxError) { // Handle JSON parsing errors
        return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
    }
    // Check for Prisma-specific errors if needed, e.g., validation errors
    // if (error instanceof Prisma.PrismaClientKnownRequestError) { ... }
    return NextResponse.json({ error: 'Failed to create project charter' }, { status: 500 });
  }
}
