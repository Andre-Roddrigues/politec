// lib/cursos-actions.ts
'use server';

// Tipos baseados na sua resposta da API
export type CursoAPI = {
  id: string;
  nome: string;
  duracao: string;
  mensalidade: string;
  descricao: string;
  preco: number;
  createdAt: string;
  updatedAt: string;
};

// Tipo formatado para uso no frontend
export type Curso = {
  id: string;
  titulo: string;
  descricao: string;
  duracao: string;
  nivel: 'Técnico' | 'Superior' | 'Pós-Graduação' | 'Médio';
  area: string;
  preco: number; // Agora é número
  precoFormatado: string; // Mantém a string formatada
  vagas: number;
  gratuito: boolean;
  modalidade: 'Presencial' | 'Online' | 'Híbrido';
  inscricoesAbertas: boolean;
  createdAt: string;
  updatedAt: string;
};

// Configuração da API
const API_URL = 'https://backend-politec.unitec.ac.mz';
const API_TIMEOUT = 15000;

// Função auxiliar para fazer requisições
async function fetchAPI(endpoint: string, options?: RequestInit) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

  try {
    console.log(`[API] Fazendo requisição para: ${API_URL}${endpoint}`);
    
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      cache: 'no-store',
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[API] Erro ${response.status}: ${errorText}`);
      throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`[API] Resposta recebida de: ${endpoint}`, data ? `Com ${Array.isArray(data) ? data.length : 1} itens` : 'Vazia');
    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('[API] Timeout: A requisição demorou muito para responder');
      throw new Error('Timeout: A requisição demorou muito para responder. Tente novamente.');
    }
    
    console.error('[API] Erro na requisição:', error);
    throw error;
  }
}

// Função para extrair número de uma string de preço
function extrairPrecoNumero(mensalidade: string): number {
  if (!mensalidade) return 0;
  
  // Remove caracteres não numéricos, mantendo apenas números
  const numeros = mensalidade.match(/\d+/g);
  if (!numeros) return 0;
  
  // Junta todos os números encontrados
  const numeroString = numeros.join('');
  return parseInt(numeroString) || 0;
}

// Função para detectar nível do curso baseado no nome ou descrição
function detectarNivel(cursoNome: string): Curso['nivel'] {
  const nomeLower = cursoNome.toLowerCase();
  
  if (nomeLower.includes('técnico') || nomeLower.includes('tecnico')) {
    return 'Técnico';
  }
  
  if (nomeLower.includes('superior') || nomeLower.includes('licenciatura') || nomeLower.includes('engenharia')) {
    return 'Superior';
  }
  
  if (nomeLower.includes('pós') || nomeLower.includes('pos') || nomeLower.includes('especialização')) {
    return 'Pós-Graduação';
  }
  
  return 'Médio';
}

// Função para detectar área baseada no nome ou descrição
function detectarArea(cursoNome: string, descricao: string): string {
  const texto = `${cursoNome} ${descricao}`.toLowerCase();
  
  // Tecnologia da Informação
  if (texto.includes('informática') || texto.includes('computação') || 
      texto.includes('software') || texto.includes('programação') ||
      texto.includes('suporte') || texto.includes('web') ||
      texto.includes('administração de sistemas') || texto.includes('redes')) {
    return 'Tecnologia da Informação';
  }
  
  // Gestão & Negócios
  if (texto.includes('contabilidade') || texto.includes('gestão') || 
      texto.includes('recursos humanos') || texto.includes('logística') ||
      texto.includes('geral') || texto.includes('negócios')) {
    return 'Gestão & Negócios';
  }
  
  // Manutenção Industrial
  if (texto.includes('elétrica') || texto.includes('electricidade') ||
      texto.includes('mecânica') || texto.includes('refrigeração') ||
      texto.includes('climatização') || texto.includes('manutenção')) {
    return 'Manutenção Industrial';
  }
  
  // Construção Civil
  if (texto.includes('construção civil') || texto.includes('civil') ||
      texto.includes('edificação') || texto.includes('engenharia civil')) {
    return 'Construção Civil';
  }
  
  // Saúde
  if (texto.includes('saúde') || texto.includes('enfermagem') || 
      texto.includes('medicina') || texto.includes('fisioterapia')) {
    return 'Saúde';
  }
  
  // Educação
  if (texto.includes('educação') || texto.includes('pedagogia') || 
      texto.includes('ensino')) {
    return 'Educação';
  }
  
  return 'Outras';
}

// Função para formatar dados da API para o formato do frontend
function formatarCursoAPI(cursoAPI: CursoAPI): Curso {
  const nivel = detectarNivel(cursoAPI.nome);
  const area = detectarArea(cursoAPI.nome, cursoAPI.descricao);
  
  // Extrair valor numérico do preço
  const precoNumero = cursoAPI.preco || extrairPrecoNumero(cursoAPI.mensalidade);
  
  // Verifica se é gratuito
  const gratuito = precoNumero === 0;
  
  // Determinar modalidade baseada na descrição
  const descricaoLower = cursoAPI.descricao.toLowerCase();
  let modalidade: 'Presencial' | 'Online' | 'Híbrido' = 'Presencial';
  if (descricaoLower.includes('online') || descricaoLower.includes('remoto') || descricaoLower.includes('virtual')) {
    modalidade = 'Online';
  } else if (descricaoLower.includes('híbrido') || descricaoLower.includes('hibrido') || descricaoLower.includes('semi-presencial')) {
    modalidade = 'Híbrido';
  }
  
  // Determinar se inscrições estão abertas (sempre true para cursos ativos)
  const dataAtual = new Date();
  const dataAtualizacao = new Date(cursoAPI.updatedAt);
  const diasDesdeAtualizacao = (dataAtual.getTime() - dataAtualizacao.getTime()) / (1000 * 60 * 60 * 24);
  const inscricoesAbertas = diasDesdeAtualizacao < 180; // Considera cursos atualizados nos últimos 180 dias
  
  // Estimar vagas baseado na área
  let vagas = 30;
  if (area === 'Tecnologia da Informação') vagas = 35;
  if (area === 'Gestão & Negócios') vagas = 40;
  if (area === 'Manutenção Industrial') vagas = 30;
  if (area === 'Construção Civil') vagas = 25;
  
  // Formatar preço para exibição
  const precoFormatado = precoNumero.toLocaleString('pt-MZ', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }) + ' MT';

  return {
    id: cursoAPI.id,
    titulo: cursoAPI.nome,
    descricao: cursoAPI.descricao,
    duracao: cursoAPI.duracao,
    nivel,
    area,
    preco: precoNumero, // Agora é número
    precoFormatado, // String formatada para exibição
    vagas,
    gratuito,
    modalidade,
    inscricoesAbertas,
    createdAt: cursoAPI.createdAt,
    updatedAt: cursoAPI.updatedAt,
  };
}

// Função principal para buscar cursos
export async function getCursos(filtros?: {
  nivel?: string;
  area?: string;
  modalidade?: string;
  inscricoesAbertas?: boolean;
  busca?: string;
  minPreco?: number;
  maxPreco?: number;
}): Promise<Curso[]> {
  try {
    console.log('[getCursos] Iniciando busca de cursos da API...');
    
    // Buscar dados da API
    const cursosAPI: CursoAPI[] = await fetchAPI('/cursos');
    
    if (!cursosAPI || cursosAPI.length === 0) {
      console.warn('[getCursos] API retornou array vazio ou nulo');
      return [];
    }
    
    console.log(`[getCursos] ${cursosAPI.length} cursos recebidos da API`);
    
    // Formatando dados
    const cursosFormatados = cursosAPI.map(curso => {
      console.log(`[getCursos] Formatando curso: ${curso.nome} (Preço: ${curso.preco})`);
      return formatarCursoAPI(curso);
    });
    
    // Aplicar filtros se fornecidos
    let cursosFiltrados = [...cursosFormatados];
    
    if (filtros?.nivel) {
      cursosFiltrados = cursosFiltrados.filter(curso => curso.nivel === filtros.nivel);
      console.log(`[getCursos] Após filtro de nível "${filtros.nivel}": ${cursosFiltrados.length} cursos`);
    }
    
    if (filtros?.area) {
      cursosFiltrados = cursosFiltrados.filter(curso => curso.area === filtros.area);
      console.log(`[getCursos] Após filtro de área "${filtros.area}": ${cursosFiltrados.length} cursos`);
    }
    
    if (filtros?.modalidade) {
      cursosFiltrados = cursosFiltrados.filter(curso => curso.modalidade === filtros.modalidade);
      console.log(`[getCursos] Após filtro de modalidade "${filtros.modalidade}": ${cursosFiltrados.length} cursos`);
    }
    
    if (filtros?.inscricoesAbertas !== undefined) {
      cursosFiltrados = cursosFiltrados.filter(curso => curso.inscricoesAbertas === filtros.inscricoesAbertas);
      console.log(`[getCursos] Após filtro de inscrições abertas "${filtros.inscricoesAbertas}": ${cursosFiltrados.length} cursos`);
    }
    
    if (filtros?.minPreco !== undefined) {
      cursosFiltrados = cursosFiltrados.filter(curso => curso.preco >= filtros.minPreco!);
      console.log(`[getCursos] Após filtro de preço mínimo "${filtros.minPreco}": ${cursosFiltrados.length} cursos`);
    }
    
    if (filtros?.maxPreco !== undefined) {
      cursosFiltrados = cursosFiltrados.filter(curso => curso.preco <= filtros.maxPreco!);
      console.log(`[getCursos] Após filtro de preço máximo "${filtros.maxPreco}": ${cursosFiltrados.length} cursos`);
    }
    
    if (filtros?.busca) {
      const buscaLower = filtros.busca.toLowerCase();
      cursosFiltrados = cursosFiltrados.filter(curso =>
        curso.titulo.toLowerCase().includes(buscaLower) ||
        curso.descricao.toLowerCase().includes(buscaLower) ||
        curso.area.toLowerCase().includes(buscaLower)
      );
      console.log(`[getCursos] Após filtro de busca "${filtros.busca}": ${cursosFiltrados.length} cursos`);
    }
    
    console.log(`[getCursos] Retornando ${cursosFiltrados.length} cursos filtrados`);
    return cursosFiltrados;
    
  } catch (error) {
    console.error('[getCursos] Erro ao buscar cursos:', error);
    return [];
  }
}

// Funções para obter opções de filtro
export async function getAreas(): Promise<string[]> {
  try {
    const cursos = await getCursos();
    if (cursos.length === 0) {
      return [];
    }
    return Array.from(new Set(cursos.map(curso => curso.area))).sort();
  } catch (error) {
    console.error('Erro ao buscar áreas:', error);
    return [];
  }
}

export async function getModalidades(): Promise<string[]> {
  try {
    const cursos = await getCursos();
    if (cursos.length === 0) {
      return [];
    }
    return Array.from(new Set(cursos.map(curso => curso.modalidade))).sort();
  } catch (error) {
    console.error('Erro ao buscar modalidades:', error);
    return [];
  }
}

export async function getNiveis(): Promise<string[]> {
  try {
    const cursos = await getCursos();
    if (cursos.length === 0) {
      return [];
    }
    return Array.from(new Set(cursos.map(curso => curso.nivel))).sort();
  } catch (error) {
    console.error('Erro ao buscar níveis:', error);
    return [];
  }
}

// Função para buscar um curso específico por ID
export async function getCursoById(id: string): Promise<Curso | null> {
  try {
    console.log(`[getCursoById] Buscando curso com ID: ${id}`);
    
    // Buscar curso específico da API
    const cursoAPI: CursoAPI = await fetchAPI(`/cursos/${id}`);
    
    if (!cursoAPI) {
      console.log(`[getCursoById] Curso com ID ${id} não encontrado`);
      return null;
    }
    
    const curso = formatarCursoAPI(cursoAPI);
    console.log(`[getCursoById] Curso encontrado: ${curso.titulo} (Preço: ${curso.preco} MT)`);
    
    return curso;
    
  } catch (error) {
    console.error(`Erro ao buscar curso com ID ${id}:`, error);
    
    // Fallback: buscar todos e filtrar
    try {
      const cursos = await getCursos();
      const cursoEncontrado = cursos.find(curso => curso.id === id);
      
      if (cursoEncontrado) {
        console.log(`[getCursoById] Curso encontrado via fallback: ${cursoEncontrado.titulo}`);
        return cursoEncontrado;
      }
    } catch (fallbackError) {
      console.error('Erro no fallback:', fallbackError);
    }
    
    return null;
  }
}

// Função para obter cursos por área
export async function getCursosPorArea(area: string): Promise<Curso[]> {
  try {
    return await getCursos({ area });
  } catch (error) {
    console.error(`Erro ao buscar cursos da área ${area}:`, error);
    return [];
  }
}

// Função para obter cursos por preço
export async function getCursosPorFaixaPreco(min: number, max: number): Promise<Curso[]> {
  try {
    return await getCursos({ minPreco: min, maxPreco: max });
  } catch (error) {
    console.error(`Erro ao buscar cursos por faixa de preço ${min}-${max}:`, error);
    return [];
  }
}

// Função para obter estatísticas de preços
export async function getEstatisticasPrecos(): Promise<{
  media: number;
  minimo: number;
  maximo: number;
  totalCursos: number;
}> {
  try {
    const cursos = await getCursos();
    
    if (cursos.length === 0) {
      return { media: 0, minimo: 0, maximo: 0, totalCursos: 0 };
    }
    
    const precos = cursos.map(curso => curso.preco).filter(preco => preco > 0);
    
    if (precos.length === 0) {
      return { media: 0, minimo: 0, maximo: 0, totalCursos: cursos.length };
    }
    
    const media = precos.reduce((sum, preco) => sum + preco, 0) / precos.length;
    const minimo = Math.min(...precos);
    const maximo = Math.max(...precos);
    
    return {
      media: Math.round(media),
      minimo,
      maximo,
      totalCursos: cursos.length,
    };
  } catch (error) {
    console.error('Erro ao calcular estatísticas de preços:', error);
    return { media: 0, minimo: 0, maximo: 0, totalCursos: 0 };
  }
}

// Função para agrupar cursos por preço
export async function getCursosAgrupadosPorPreco(): Promise<Record<number, Curso[]>> {
  try {
    const cursos = await getCursos();
    const agrupados: Record<number, Curso[]> = {};
    
    cursos.forEach(curso => {
      if (!agrupados[curso.preco]) {
        agrupados[curso.preco] = [];
      }
      agrupados[curso.preco].push(curso);
    });
    
    return agrupados;
  } catch (error) {
    console.error('Erro ao agrupar cursos por preço:', error);
    return {};
  }
}