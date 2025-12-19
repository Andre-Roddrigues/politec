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
  preco: string; // Mantendo como string para exibir "3600mt"
  vagas: number; // Valor padrão
  gratuito: boolean;
  modalidade: 'Presencial' | 'Online' | 'Híbrido';
  inscricoesAbertas: boolean;
  createdAt: string;
  updatedAt: string;
};

// Configuração da API
const API_URL = 'https://backend-politec.unitec.ac.mz';
const API_TIMEOUT = 10000; // 10 segundos

// Função auxiliar para fazer requisições
async function fetchAPI(endpoint: string, options?: RequestInit) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      cache: 'no-store', // Desativa cache para dados sempre atualizados
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Timeout: A requisição demorou muito para responder');
    }
    
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
  
  // Cursos curtos por padrão
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
  
  return 'Outras';
}

// Função para formatar dados da API para o formato do frontend
function formatarCursoAPI(cursoAPI: CursoAPI): Curso {
  const nivel = detectarNivel(cursoAPI.nome);
  const area = detectarArea(cursoAPI.nome, cursoAPI.descricao);
  
  // Verifica se é gratuito (contém "mt" na mensalidade ou valor 0)
  const mensalidadeNum = parseInt(cursoAPI.mensalidade.replace(/\D/g, ''));
  const gratuito = mensalidadeNum === 0 || cursoAPI.mensalidade.toLowerCase().includes('gratuito');
  
  // Padrão: Presencial (ajustar conforme necessidade)
  const modalidade: 'Presencial' | 'Online' | 'Híbrido' = 'Presencial';
  
  // Padrão: Inscrições abertas (baseado na data)
  const dataAtual = new Date();
  const dataCriacao = new Date(cursoAPI.createdAt);
  const mesesDesdeCriacao = (dataAtual.getTime() - dataCriacao.getTime()) / (1000 * 60 * 60 * 24 * 30);
  const inscricoesAbertas = mesesDesdeCriacao < 6; // Considera inscrições abertas por 6 meses
  
  return {
    id: cursoAPI.id,
    titulo: cursoAPI.nome,
    descricao: cursoAPI.descricao,
    duracao: cursoAPI.duracao,
    nivel,
    area,
    preco: cursoAPI.mensalidade,
    vagas: 30, // Valor padrão - ajuste conforme sua API
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
}): Promise<Curso[]> {
  try {
    // Buscar dados da API
    const cursosAPI: CursoAPI[] = await fetchAPI('/cursos');
    
    // Formatando dados
    const cursosFormatados = cursosAPI.map(formatarCursoAPI);
    
    // Aplicar filtros se fornecidos
    let cursosFiltrados = [...cursosFormatados];
    
    if (filtros?.nivel) {
      cursosFiltrados = cursosFiltrados.filter(curso => curso.nivel === filtros.nivel);
    }
    
    if (filtros?.area) {
      cursosFiltrados = cursosFiltrados.filter(curso => curso.area === filtros.area);
    }
    
    if (filtros?.modalidade) {
      cursosFiltrados = cursosFiltrados.filter(curso => curso.modalidade === filtros.modalidade);
    }
    
    if (filtros?.inscricoesAbertas !== undefined) {
      cursosFiltrados = cursosFiltrados.filter(curso => curso.inscricoesAbertas === filtros.inscricoesAbertas);
    }
    
    if (filtros?.busca) {
      const buscaLower = filtros.busca.toLowerCase();
      cursosFiltrados = cursosFiltrados.filter(curso =>
        curso.titulo.toLowerCase().includes(buscaLower) ||
        curso.descricao.toLowerCase().includes(buscaLower) ||
        curso.area.toLowerCase().includes(buscaLower)
      );
    }
    
    return cursosFiltrados;
  } catch (error) {
    console.error('Erro ao buscar cursos:', error);
    
    // Fallback: dados de exemplo em caso de erro na API
    console.log('Usando dados de exemplo devido a erro na API');
    
    const cursosExemploFormatados: Curso[] = [
      {
        id: '1',
        titulo: 'Canalização',
        descricao: 'Cursos de Construção Civil',
        duracao: '3-Anos + Estágio',
        nivel: 'Técnico',
        area: 'Construção Civil',
        preco: '3600mt',
        vagas: 25,
        gratuito: false,
        modalidade: 'Presencial',
        inscricoesAbertas: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        titulo: 'Informática',
        descricao: 'Curso de informática básica e avançada',
        duracao: '2 anos',
        nivel: 'Técnico',
        area: 'Tecnologia',
        preco: '2500mt',
        vagas: 40,
        gratuito: false,
        modalidade: 'Presencial',
        inscricoesAbertas: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '3',
        titulo: 'Enfermagem',
        descricao: 'Formação técnica em enfermagem',
        duracao: '3 anos',
        nivel: 'Técnico',
        area: 'Saúde',
        preco: '4000mt',
        vagas: 30,
        gratuito: false,
        modalidade: 'Presencial',
        inscricoesAbertas: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    
    // Aplicar filtros nos dados de exemplo
    let cursosFiltrados = [...cursosExemploFormatados];
    
    if (filtros?.nivel) {
      cursosFiltrados = cursosFiltrados.filter(curso => curso.nivel === filtros.nivel);
    }
    
    if (filtros?.area) {
      cursosFiltrados = cursosFiltrados.filter(curso => curso.area === filtros.area);
    }
    
    if (filtros?.modalidade) {
      cursosFiltrados = cursosFiltrados.filter(curso => curso.modalidade === filtros.modalidade);
    }
    
    if (filtros?.inscricoesAbertas !== undefined) {
      cursosFiltrados = cursosFiltrados.filter(curso => curso.inscricoesAbertas === filtros.inscricoesAbertas);
    }
    
    if (filtros?.busca) {
      const buscaLower = filtros.busca.toLowerCase();
      cursosFiltrados = cursosFiltrados.filter(curso =>
        curso.titulo.toLowerCase().includes(buscaLower) ||
        curso.descricao.toLowerCase().includes(buscaLower) ||
        curso.area.toLowerCase().includes(buscaLower)
      );
    }
    
    return cursosFiltrados;
  }
}

// Funções para obter opções de filtro
export async function getAreas(): Promise<string[]> {
  try {
    const cursos = await getCursos();
    return Array.from(new Set(cursos.map(curso => curso.area))).sort();
  } catch (error) {
    console.error('Erro ao buscar áreas:', error);
    return ['Construção Civil', 'Tecnologia', 'Saúde', 'Gestão', 'Educação', 'Outras'];
  }
}

export async function getModalidades(): Promise<string[]> {
  try {
    const cursos = await getCursos();
    return Array.from(new Set(cursos.map(curso => curso.modalidade))).sort();
  } catch (error) {
    console.error('Erro ao buscar modalidades:', error);
    return ['Presencial', 'Online', 'Híbrido'];
  }
}

export async function getNiveis(): Promise<string[]> {
  try {
    const cursos = await getCursos();
    return Array.from(new Set(cursos.map(curso => curso.nivel))).sort();
  } catch (error) {
    console.error('Erro ao buscar níveis:', error);
    return ['Técnico', 'Superior', 'Pós-Graduação', 'Curta Duração'];
  }
}

// Função para buscar um curso específico por ID
export async function getCursoById(id: string): Promise<Curso | null> {
  try {
    const cursos = await getCursos();
    return cursos.find(curso => curso.id === id) || null;
  } catch (error) {
    console.error(`Erro ao buscar curso com ID ${id}:`, error);
    return null;
  }
}