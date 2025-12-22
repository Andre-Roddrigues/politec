'use server';

// Tipos baseados na sua resposta da API
export type CursoAPI = {
  id: string;
  nome: string;
  duracao: string;
  mensalidade: string;
  descricao: string;
  createdAt: string;
  updatedAt: string;
};

// Tipo formatado para uso no frontend
export type Curso = {
  id: string;
  titulo: string;
  descricao: string;
  duracao: string;
  nivel: 'Técnico' | 'Superior' | 'Pós-Graduação' | 'Curta Duração';
  area: string;
  preco: string;
  vagas: number;
  gratuito: boolean;
  modalidade: 'Presencial' | 'Online' | 'Híbrido';
  inscricoesAbertas: boolean;
  createdAt: string;
  updatedAt: string;
};

// Configuração da API
const API_URL = 'https://backend-politec.unitec.ac.mz';
const API_TIMEOUT = 15000; // Aumentado para 15 segundos

// Função auxiliar para fazer requisições
async function fetchAPI(endpoint: string, options?: RequestInit) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

  try {
    console.log(`[API] Fazendo requisição para: ${API_URL}${endpoint}`);
    
    const response = await fetch(`https://backend-politec.unitec.ac.mz/cursos`, {
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
  
  return 'Curta Duração';
}

// Função para detectar área baseada no nome ou descrição
function detectarArea(cursoNome: string, descricao: string): string {
  const texto = `${cursoNome} ${descricao}`.toLowerCase();
  
  if (texto.includes('informática') || texto.includes('computação') || texto.includes('software') || texto.includes('programação')) {
    return 'Tecnologia';
  }
  
  if (texto.includes('construção') || texto.includes('civil') || texto.includes('canalização') || texto.includes('edificação')) {
    return 'Construção Civil';
  }
  
  if (texto.includes('saúde') || texto.includes('enfermagem') || texto.includes('medicina') || texto.includes('fisioterapia')) {
    return 'Saúde';
  }
  
  if (texto.includes('administração') || texto.includes('gestão') || texto.includes('contabilidade') || texto.includes('negócios')) {
    return 'Gestão';
  }
  
  if (texto.includes('educação') || texto.includes('pedagogia') || texto.includes('ensino')) {
    return 'Educação';
  }
  
  if (texto.includes('minas') || texto.includes('geologia') || texto.includes('petróleo')) {
    return 'Minas e Geologia';
  }
  
  if (texto.includes('eletro') || texto.includes('mecânica') || texto.includes('automóveis')) {
    return 'Engenharia';
  }
  
  return 'Outras';
}

// Função para formatar dados da API para o formato do frontend
function formatarCursoAPI(cursoAPI: CursoAPI): Curso {
  const nivel = detectarNivel(cursoAPI.nome);
  const area = detectarArea(cursoAPI.nome, cursoAPI.descricao);
  
  // Verifica se é gratuito
  const mensalidadeLower = cursoAPI.mensalidade.toLowerCase();
  const mensalidadeNum = parseInt(cursoAPI.mensalidade.replace(/\D/g, ''));
  const gratuito = mensalidadeNum === 0 || 
                   mensalidadeLower.includes('gratuito') || 
                   mensalidadeLower.includes('livre');
  
  // Determinar modalidade baseada na descrição
  const descricaoLower = cursoAPI.descricao.toLowerCase();
  let modalidade: 'Presencial' | 'Online' | 'Híbrido' = 'Presencial';
  if (descricaoLower.includes('online') || descricaoLower.includes('remoto') || descricaoLower.includes('virtual')) {
    modalidade = 'Online';
  } else if (descricaoLower.includes('híbrido') || descricaoLower.includes('hibrido') || descricaoLower.includes('semi-presencial')) {
    modalidade = 'Híbrido';
  }
  
  // Determinar se inscrições estão abertas
  // Baseado na data de criação e atualização
  const dataAtual = new Date();
  const dataCriacao = new Date(cursoAPI.createdAt);
  const dataAtualizacao = new Date(cursoAPI.updatedAt);
  const mesesDesdeAtualizacao = (dataAtual.getTime() - dataAtualizacao.getTime()) / (1000 * 60 * 60 * 24 * 30);
  const inscricoesAbertas = mesesDesdeAtualizacao < 6; // Considera cursos atualizados nos últimos 6 meses como ativos
  
  // Estimar vagas baseado no tipo de curso
  let vagas = 30; // Valor padrão
  if (nivel === 'Técnico') vagas = 40;
  if (nivel === 'Superior') vagas = 35;
  if (nivel === 'Pós-Graduação') vagas = 25;
  if (nivel === 'Curta Duração') vagas = 50;

  return {
    id: cursoAPI.id,
    titulo: cursoAPI.nome,
    descricao: cursoAPI.descricao,
    duracao: cursoAPI.duracao,
    nivel,
    area,
    preco: cursoAPI.mensalidade,
    vagas,
    gratuito,
    modalidade,
    inscricoesAbertas,
    createdAt: cursoAPI.createdAt,
    updatedAt: cursoAPI.updatedAt,
  };
}

// Função principal para buscar cursos - SEM MOCK DATA
export async function getCursos(filtros?: {
  nivel?: string;
  area?: string;
  modalidade?: string;
  inscricoesAbertas?: boolean;
  busca?: string;
}): Promise<Curso[]> {
  try {
    console.log('[getCursos] Iniciando busca de cursos da API...');
    
    // Buscar dados da API
    const cursosAPI: CursoAPI[] = await fetchAPI('https://backend-politec.unitec.ac.mz/cursos');
    
    if (!cursosAPI || cursosAPI.length === 0) {
      console.warn('[getCursos] API retornou array vazio ou nulo');
      return [];
    }
    
    console.log(`[getCursos] ${cursosAPI.length} cursos recebidos da API`);
    
    // Formatando dados
    const cursosFormatados = cursosAPI.map(curso => {
      console.log(`[getCursos] Formatando curso: ${curso.nome}`);
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
    
    // RETORNA APENAS ARRAY VAZIO EM CASO DE ERRO - SEM MOCK DATA
    console.log('[getCursos] Retornando array vazio devido a erro na API');
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
    return []; // Retorna array vazio em vez de mock data
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
    return []; // Retorna array vazio em vez de mock data
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
    return []; // Retorna array vazio em vez de mock data
  }
}

// Função para buscar um curso específico por ID
export async function getCursoById(id: string): Promise<Curso | null> {
  try {
    // Tentar buscar diretamente da API primeiro
    console.log(`[getCursoById] Buscando curso com ID: ${id}`);
    
    // Se a API tiver endpoint específico por ID, use:
    // const cursoAPI: CursoAPI = await fetchAPI(`/cursos/${id}`);
    // return formatarCursoAPI(cursoAPI);
    
    // Como alternativa, buscar todos e filtrar
    const cursos = await getCursos();
    const cursoEncontrado = cursos.find(curso => curso.id === id);
    
    if (cursoEncontrado) {
      console.log(`[getCursoById] Curso encontrado: ${cursoEncontrado.titulo}`);
      return cursoEncontrado;
    }
    
    console.log(`[getCursoById] Curso com ID ${id} não encontrado`);
    return null;
    
  } catch (error) {
    console.error(`Erro ao buscar curso com ID ${id}:`, error);
    return null; // Retorna null em vez de mock data
  }
}