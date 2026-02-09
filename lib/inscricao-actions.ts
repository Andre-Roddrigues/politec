// lib/inscricao-actions.ts

const API_URL = 'https://backend-politec.unitec.ac.mz';

// Atualizado para incluir matricula
export type TipoItem = 'inscricao' | 'mensalidade' | 'matricula';

export interface ItemFinanceiro {
  id: string;
  tipoItem: TipoItem;
  valor: number;
  descricao: string;
  descontPercentual: number;
  iva: number;
  createdAt: string;
  updatedAt: string;
}

export interface CriarItemFinanceiroDTO {
  tipoItem: TipoItem;
  valor: number;
  descontPercentual?: number;
  descricao?: string;
}

export interface AtualizarItemFinanceiroDTO {
  tipoItem?: TipoItem;
  valor?: number;
  descontPercentual?: number;
  descricao?: string;
}

export interface ItensFinanceirosResponse {
  success: boolean;
  itens: ItemFinanceiro[];
}

/**
 * Buscar todos os itens financeiros
 */
export async function getItensFinanceiros(): Promise<ItemFinanceiro[]> {
  try {
    const response = await fetch(`${API_URL}/itens-financeiros`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar itens financeiros: ${response.statusText}`);
    }

    const data: ItensFinanceirosResponse = await response.json();
    
    if (data.success && data.itens) {
      return data.itens;
    }
    
    throw new Error('Resposta da API inválida');
    
  } catch (error) {
    console.error('Erro em getItensFinanceiros:', error);
    throw error;
  }
}

/**
 * Buscar itens financeiros por tipo
 */
export async function getItensFinanceirosPorTipo(tipo: TipoItem): Promise<ItemFinanceiro[]> {
  try {
    const itens = await getItensFinanceiros();
    return itens.filter(item => item.tipoItem === tipo);
  } catch (error) {
    console.error(`Erro ao buscar itens do tipo ${tipo}:`, error);
    throw error;
  }
}

/**
 * Buscar valor específico de inscrição (último valor ativo)
 */
export async function getValorInscricao(): Promise<number> {
  try {
    const inscricoes = await getItensFinanceirosPorTipo('inscricao');
    
    if (inscricoes.length === 0) {
      return 0;
    }
    
    // Ordenar por data de criação (mais recente primeiro)
    const inscricoesOrdenadas = inscricoes.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    return inscricoesOrdenadas[0].valor;
  } catch (error) {
    console.error('Erro ao buscar valor da inscrição:', error);
    return 0;
  }
}

/**
 * Buscar valor específico de matrícula (último valor ativo)
 */
export async function getValorMatricula(): Promise<number> {
  try {
    const matriculas = await getItensFinanceirosPorTipo('matricula');
    
    if (matriculas.length === 0) {
      return 0;
    }
    
    // Ordenar por data de criação (mais recente primeiro)
    const matriculasOrdenadas = matriculas.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    return matriculasOrdenadas[0].valor;
  } catch (error) {
    console.error('Erro ao buscar valor da matrícula:', error);
    return 0;
  }
}

/**
 * Buscar valores de mensalidade (todos os valores ativos)
 */
export async function getValoresMensalidade(): Promise<number[]> {
  try {
    const mensalidades = await getItensFinanceirosPorTipo('mensalidade');
    return mensalidades.map(item => item.valor);
  } catch (error) {
    console.error('Erro ao buscar valores de mensalidade:', error);
    return [];
  }
}

/**
 * Buscar o valor mais recente de mensalidade
 */
export async function getUltimoValorMensalidade(): Promise<number> {
  try {
    const mensalidades = await getItensFinanceirosPorTipo('mensalidade');
    
    if (mensalidades.length === 0) {
      return 0;
    }
    
    // Ordenar por data de criação (mais recente primeiro)
    const mensalidadesOrdenadas = mensalidades.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    return mensalidadesOrdenadas[0].valor;
  } catch (error) {
    console.error('Erro ao buscar último valor de mensalidade:', error);
    return 0;
  }
}

/**
 * Calcular valor com IVA incluído
 */
export function calcularValorComIVA(valor: number, iva: number = 0.05): number {
  return valor * (1 + iva);
}

/**
 * Calcular valor com desconto aplicado
 */
export function calcularValorComDesconto(valor: number, descontoPercentual: number): number {
  return valor * (1 - descontoPercentual / 100);
}

/**
 * Buscar item financeiro por ID
 */
export async function getItemFinanceiroPorId(id: string): Promise<ItemFinanceiro | null> {
  try {
    const response = await fetch(`${API_URL}/itens-financeiros/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Erro ao buscar item: ${response.statusText}`);
    }

    const item = await response.json();
    return item;
  } catch (error) {
    console.error(`Erro ao buscar item com ID ${id}:`, error);
    throw error;
  }
}

/**
 * Criar novo item financeiro
 */
export async function criarItemFinanceiro(dados: CriarItemFinanceiroDTO): Promise<ItemFinanceiro> {
  try {
    // Configurar dados padrão
    const descricaoPadrao = {
      'inscricao': 'Valor da Inscrição',
      'mensalidade': 'Valor da Mensalidade',
      'matricula': 'Valor da Matrícula'
    };
    
    const dadosCompletos = {
      ...dados,
      descontPercentual: dados.descontPercentual || 0,
      descricao: dados.descricao || descricaoPadrao[dados.tipoItem] || `Valor da ${dados.tipoItem}`,
    };

    const response = await fetch(`${API_URL}/itens-financeiros`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dadosCompletos),
    });

    if (!response.ok) {
      throw new Error(`Erro ao criar item: ${response.statusText}`);
    }

    const novoItem = await response.json();
    return novoItem;
  } catch (error) {
    console.error('Erro em criarItemFinanceiro:', error);
    throw error;
  }
}

/**
 * Atualizar item financeiro existente
 */
export async function atualizarItemFinanceiro(
  id: string, 
  dados: AtualizarItemFinanceiroDTO
): Promise<ItemFinanceiro> {
  try {
    const response = await fetch(`${API_URL}/itens-financeiros/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dados),
    });

    if (!response.ok) {
      throw new Error(`Erro ao atualizar item: ${response.statusText}`);
    }

    const itemAtualizado = await response.json();
    return itemAtualizado;
  } catch (error) {
    console.error(`Erro ao atualizar item com ID ${id}:`, error);
    throw error;
  }
}

/**
 * Excluir item financeiro
 */
export async function excluirItemFinanceiro(id: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/itens-financeiros/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Erro ao excluir item: ${response.statusText}`);
    }

    return true;
  } catch (error) {
    console.error(`Erro ao excluir item com ID ${id}:`, error);
    throw error;
  }
}

/**
 * Criar ou atualizar valor de inscrição
 */
export async function definirValorInscricao(valor: number): Promise<ItemFinanceiro> {
  try {
    const inscricoes = await getItensFinanceirosPorTipo('inscricao');
    
    if (inscricoes.length > 0) {
      const inscricoesOrdenadas = inscricoes.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      const inscricaoAtual = inscricoesOrdenadas[0];
      return await atualizarItemFinanceiro(inscricaoAtual.id, { valor });
    } else {
      return await criarItemFinanceiro({
        tipoItem: 'inscricao',
        valor,
        descricao: 'Valor da Inscrição',
      });
    }
  } catch (error) {
    console.error('Erro ao definir valor de inscrição:', error);
    throw error;
  }
}

/**
 * Criar ou atualizar valor de matrícula
 */
export async function definirValorMatricula(valor: number): Promise<ItemFinanceiro> {
  try {
    const matriculas = await getItensFinanceirosPorTipo('matricula');
    
    if (matriculas.length > 0) {
      const matriculasOrdenadas = matriculas.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      const matriculaAtual = matriculasOrdenadas[0];
      return await atualizarItemFinanceiro(matriculaAtual.id, { valor });
    } else {
      return await criarItemFinanceiro({
        tipoItem: 'matricula',
        valor,
        descricao: 'Valor da Matrícula',
      });
    }
  } catch (error) {
    console.error('Erro ao definir valor de matrícula:', error);
    throw error;
  }
}

/**
 * Adicionar novo valor de mensalidade
 */
export async function adicionarValorMensalidade(valor: number): Promise<ItemFinanceiro> {
  try {
    return await criarItemFinanceiro({
      tipoItem: 'mensalidade',
      valor,
      descricao: 'Valor da Mensalidade',
    });
  } catch (error) {
    console.error('Erro ao adicionar valor de mensalidade:', error);
    throw error;
  }
}

/**
 * Buscar valores formatados para exibição
 */
export async function getValoresFormatados(): Promise<{
  inscricao: string;
  matricula: string;
  mensalidade: string;
  mensalidades: string[];
}> {
  try {
    const [inscricaoValor, matriculaValor, mensalidadeValor, todosValores] = await Promise.all([
      getValorInscricao(),
      getValorMatricula(),
      getUltimoValorMensalidade(),
      getValoresMensalidade(),
    ]);

    return {
      inscricao: inscricaoValor.toLocaleString('pt-MZ', {
        style: 'currency',
        currency: 'MZN',
        minimumFractionDigits: 2,
      }),
      matricula: matriculaValor.toLocaleString('pt-MZ', {
        style: 'currency',
        currency: 'MZN',
        minimumFractionDigits: 2,
      }),
      mensalidade: mensalidadeValor.toLocaleString('pt-MZ', {
        style: 'currency',
        currency: 'MZN',
        minimumFractionDigits: 2,
      }),
      mensalidades: todosValores.map(valor => 
        valor.toLocaleString('pt-MZ', {
          style: 'currency',
          currency: 'MZN',
          minimumFractionDigits: 2,
        })
      ),
    };
  } catch (error) {
    console.error('Erro ao buscar valores formatados:', error);
    return {
      inscricao: '0,00 MT',
      matricula: '0,00 MT',
      mensalidade: '0,00 MT',
      mensalidades: [],
    };
  }
}

/**
 * Verificar se existe valor de inscrição ativo
 */
export async function existeInscricaoAtiva(): Promise<boolean> {
  try {
    const valor = await getValorInscricao();
    return valor > 0;
  } catch (error) {
    console.error('Erro ao verificar inscrição ativa:', error);
    return false;
  }
}

/**
 * Verificar se existe valor de matrícula ativo
 */
export async function existeMatriculaAtiva(): Promise<boolean> {
  try {
    const valor = await getValorMatricula();
    return valor > 0;
  } catch (error) {
    console.error('Erro ao verificar matrícula ativa:', error);
    return false;
  }
}

/**
 * Verificar se existem valores de mensalidade ativos
 */
export async function existemMensalidadesAtivas(): Promise<boolean> {
  try {
    const valores = await getValoresMensalidade();
    return valores.length > 0 && valores.some(valor => valor > 0);
  } catch (error) {
    console.error('Erro ao verificar mensalidades ativas:', error);
    return false;
  }
}

/**
 * Buscar histórico de valores (últimos 30 dias)
 */
export async function getHistoricoValores(dias: number = 30): Promise<{
  inscricoes: ItemFinanceiro[];
  matriculas: ItemFinanceiro[];
  mensalidades: ItemFinanceiro[];
}> {
  try {
    const itens = await getItensFinanceiros();
    const dataLimite = new Date();
    dataLimite.setDate(dataLimite.getDate() - dias);

    const filtrarPorData = (item: ItemFinanceiro) => 
      new Date(item.createdAt) >= dataLimite;

    return {
      inscricoes: itens
        .filter(item => item.tipoItem === 'inscricao')
        .filter(filtrarPorData)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
      
      matriculas: itens
        .filter(item => item.tipoItem === 'matricula')
        .filter(filtrarPorData)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
      
      mensalidades: itens
        .filter(item => item.tipoItem === 'mensalidade')
        .filter(filtrarPorData)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    };
  } catch (error) {
    console.error('Erro ao buscar histórico:', error);
    return { inscricoes: [], matriculas: [], mensalidades: [] };
  }
}

/**
 * Calcular total com IVA para um item específico
 */
export async function calcularTotalItem(id: string): Promise<{
  valorBase: number;
  valorIVA: number;
  valorTotal: number;
  desconto: number;
} | null> {
  try {
    const item = await getItemFinanceiroPorId(id);
    
    if (!item) {
      return null;
    }

    const valorComDesconto = calcularValorComDesconto(item.valor, item.descontPercentual);
    const valorTotal = calcularValorComIVA(valorComDesconto, item.iva);
    const valorIVA = valorTotal - valorComDesconto;

    return {
      valorBase: item.valor,
      valorIVA,
      valorTotal,
      desconto: item.descontPercentual,
    };
  } catch (error) {
    console.error(`Erro ao calcular total do item ${id}:`, error);
    throw error;
  }
}

/**
 * Calcular total de matrícula com desconto aplicado
 */
export async function calcularMatriculaComDesconto(): Promise<{
  valorBase: number;
  descontoPercentual: number;
  valorComDesconto: number;
  valorIVA: number;
  valorTotal: number;
} | null> {
  try {
    const matricula = await getItensFinanceirosPorTipo('matricula');
    
    if (matricula.length === 0) {
      return null;
    }
    
    const matriculaOrdenadas = matricula.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    const item = matriculaOrdenadas[0];
    const valorComDesconto = calcularValorComDesconto(item.valor, item.descontPercentual);
    const valorTotal = calcularValorComIVA(valorComDesconto, item.iva);
    const valorIVA = valorTotal - valorComDesconto;

    return {
      valorBase: item.valor,
      descontoPercentual: item.descontPercentual,
      valorComDesconto,
      valorIVA,
      valorTotal,
    };
  } catch (error) {
    console.error('Erro ao calcular matrícula com desconto:', error);
    return null;
  }
}

/**
 * Calcular total completo do curso
 */
export async function calcularTotalCurso(precoCurso: number): Promise<{
  inscricao: number;
  matricula: number;
  mensalidade: number;
  subtotal: number;
  ivaTotal: number;
  total: number;
}> {
  try {
    const [inscricaoValor, matriculaValor] = await Promise.all([
      getValorInscricao(),
      getValorMatricula()
    ]);

    const subtotal = inscricaoValor + matriculaValor + precoCurso;
    const ivaTotal = subtotal * 0.05; // 5% IVA
    const total = subtotal + ivaTotal;

    return {
      inscricao: inscricaoValor,
      matricula: matriculaValor,
      mensalidade: precoCurso,
      subtotal,
      ivaTotal,
      total,
    };
  } catch (error) {
    console.error('Erro ao calcular total do curso:', error);
    return {
      inscricao: 0,
      matricula: 0,
      mensalidade: precoCurso,
      subtotal: precoCurso,
      ivaTotal: precoCurso * 0.05,
      total: precoCurso * 1.05,
    };
  }
}