'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, Filter, BookOpen, Clock, Users, Globe,
    MapPin, Home, GraduationCap, DollarSign, X,
    ChevronDown, Loader2, Calendar
} from 'lucide-react';
import { getCursos, getAreas, getModalidades, getNiveis, type Curso } from '../../lib/cursos-actions';
import InscreverModal from './InscreverModal';

export default function CursosPolitec() {
    const [cursos, setCursos] = useState<Curso[]>([]);
    const [areas, setAreas] = useState<string[]>([]);
    const [modalidades, setModalidades] = useState<string[]>([]);
    const [niveis, setNiveis] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedCurso, setSelectedCurso] = useState<{ id: string, nome: string } | null>(null);

    // Filtros
    const [filtros, setFiltros] = useState({
        busca: '',
        nivel: '',
        area: '',
        modalidade: '',
        inscricoesAbertas: true,
    });

    // Carregar dados iniciais
    useEffect(() => {
        loadData();
    }, []);

    // Aplicar filtros quando mudarem
    useEffect(() => {
        const timer = setTimeout(() => {
            applyFilters();
        }, 500); // Aumentado para 500ms para melhor UX

        return () => clearTimeout(timer);
    }, [filtros]);

    async function loadData() {
        try {
            const [cursosData, areasData, modalidadesData, niveisData] = await Promise.all([
                getCursos(),
                getAreas(),
                getModalidades(),
                getNiveis(),
            ]);

            setCursos(cursosData);
            setAreas(areasData);
            setModalidades(modalidadesData);
            setNiveis(niveisData);
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        } finally {
            setLoading(false);
        }
    }

    function handleInscreverClick(cursoId: string, cursoNome: string) {
  setSelectedCurso({ id: cursoId, nome: cursoNome });
  setModalOpen(true);
}
    async function applyFilters() {
        setLoading(true);
        try {
            const cursosFiltrados = await getCursos(filtros);
            setCursos(cursosFiltrados);
        } catch (error) {
            console.error('Erro ao aplicar filtros:', error);
        } finally {
            setLoading(false);
        }
    }

    function clearFilters() {
        setFiltros({
            busca: '',
            nivel: '',
            area: '',
            modalidade: '',
            inscricoesAbertas: true,
        });
    }

    function getBadgeColor(nivel: string) {
        switch (nivel) {
            case 'Técnico': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            case 'Superior': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'Pós-Graduação': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
            case 'Curta Duração': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
        }
    }

    function getModalidadeIcon(modalidade: string) {
        switch (modalidade) {
            case 'Online': return <Globe className="w-4 h-4" />;
            case 'Presencial': return <MapPin className="w-4 h-4" />;
            case 'Híbrido': return <Home className="w-4 h-4" />;
            default: return <Globe className="w-4 h-4" />;
        }
    }

    function formatarData(dataString: string) {
        try {
            const data = new Date(dataString);
            return data.toLocaleDateString('pt-MZ', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        } catch {
            return 'Data inválida';
        }
    }

    // Determinar se estamos em mobile
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 text-center"
                >
                    <div className="inline-flex items-center gap-3 mb-4">
                        <div className="p-3 rounded-xl bg-gradient-to-r from-blue-600 to-brand-main">
                            <GraduationCap className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                            Cursos POLITEC
                        </h1>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Descubra todos os cursos disponíveis e encontre a formação ideal para sua carreira.
                    </p>
                </motion.div>

                {/* Filtros e Busca */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-8"
                >
                    <div className="space-y-4">
                        {/* Barra de Busca */}
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Buscar cursos por nome, área ou descrição..."
                                value={filtros.busca}
                                onChange={(e) => setFiltros(prev => ({ ...prev, busca: e.target.value }))}
                                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 dark:placeholder-gray-400"
                            />
                        </div>

                        {/* Botão de Filtros (Mobile) */}
                        {isMobile && (
                            <div>
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="flex items-center justify-center gap-2 w-full py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                    <Filter className="w-5 h-5" />
                                    <span>Filtros</span>
                                    <ChevronDown className={`w-5 h-5 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                                </button>
                            </div>
                        )}

                        {/* Filtros (Desktop e Mobile quando aberto) */}
                        <AnimatePresence>
                            {(!isMobile || showFilters) && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="grid md:grid-cols-4 gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                                        {/* Nível */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Nível
                                            </label>
                                            <select
                                                value={filtros.nivel}
                                                onChange={(e) => setFiltros(prev => ({ ...prev, nivel: e.target.value }))}
                                                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-800 dark:text-gray-200"
                                            >
                                                <option value="">Todos os níveis</option>
                                                {niveis.map((nivel) => (
                                                    <option key={nivel} value={nivel}>{nivel}</option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Área */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Área
                                            </label>
                                            <select
                                                value={filtros.area}
                                                onChange={(e) => setFiltros(prev => ({ ...prev, area: e.target.value }))}
                                                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-800 dark:text-gray-200"
                                            >
                                                <option value="">Todas as áreas</option>
                                                {areas.map((area) => (
                                                    <option key={area} value={area}>{area}</option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Modalidade */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Modalidade
                                            </label>
                                            <select
                                                value={filtros.modalidade}
                                                onChange={(e) => setFiltros(prev => ({ ...prev, modalidade: e.target.value }))}
                                                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-800 dark:text-gray-200"
                                            >
                                                <option value="">Todas as modalidades</option>
                                                {modalidades.map((modalidade) => (
                                                    <option key={modalidade} value={modalidade}>{modalidade}</option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Status Inscrições */}
                                        <div className="flex items-end">
                                            <div className="flex items-center gap-2 w-full">
                                                <input
                                                    type="checkbox"
                                                    id="inscricoesAbertas"
                                                    checked={filtros.inscricoesAbertas}
                                                    onChange={(e) => setFiltros(prev => ({ ...prev, inscricoesAbertas: e.target.checked }))}
                                                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 bg-white dark:bg-gray-900"
                                                />
                                                <label htmlFor="inscricoesAbertas" className="text-sm text-gray-700 dark:text-gray-300">
                                                    Apenas com inscrições abertas
                                                </label>
                                            </div>
                                        </div>

                                        {/* Botão Limpar Filtros */}
                                        {(filtros.nivel || filtros.area || filtros.modalidade || filtros.busca) && (
                                            <div className="md:col-span-4">
                                                <button
                                                    onClick={clearFilters}
                                                    className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                                >
                                                    <X className="w-4 h-4" />
                                                    Limpar filtros
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Contador de Resultados */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                                        <span>Buscando cursos...</span>
                                    </div>
                                ) : (
                                    <span className="font-medium">
                                        {cursos.length} curso{cursos.length !== 1 ? 's' : ''} encontrado{cursos.length !== 1 ? 's' : ''}
                                    </span>
                                )}
                            </div>

                            {/* Ordenação */}
                            <div className="flex items-center gap-2">
                                <label htmlFor="ordenacao" className="text-sm text-gray-600 dark:text-gray-400">
                                    Ordenar por:
                                </label>
                                <select
                                    id="ordenacao"
                                    className="px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-800 dark:text-gray-200"
                                >
                                    <option value="relevancia">Relevância</option>
                                    <option value="nome">Nome A-Z</option>
                                    <option value="duracao">Duração</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Lista de Cursos */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mb-12"
                >
                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="text-center">
                                <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                                <p className="text-gray-600 dark:text-gray-400">Carregando cursos da POLITEC...</p>
                            </div>
                        </div>
                    ) : cursos.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                                <BookOpen className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                Nenhum curso encontrado
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                                Não encontramos cursos correspondentes aos seus filtros de busca.
                            </p>
                            <button
                                onClick={clearFilters}
                                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                            >
                                Limpar filtros e ver todos
                            </button>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {cursos.map((curso, index) => (
                                <motion.div
                                    key={curso.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    whileHover={{ y: -4 }}
                                    className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300"
                                >
                                    {/* Card Header */}
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                {/* <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getBadgeColor(curso.nivel)}`}>
                                                    {curso.nivel}
                                                </span> */}
                                                {curso.gratuito && (
                                                    <span className="inline-block ml-2 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                                        Gratuito
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                                                {getModalidadeIcon(curso.modalidade)}
                                                <span className="text-sm">{curso.modalidade}</span>
                                            </div>
                                        </div>

                                        {/* Título e Descrição */}
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                            {curso.titulo}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 line-clamp-3">
                                            {curso.descricao}
                                        </p>

                                        {/* Detalhes do Curso */}
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                <Clock className="w-4 h-4" />
                                                <span className="font-medium">{curso.duracao}</span>
                                            </div>

                                            {/* <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Users className="w-4 h-4" />
                        <span>{curso.vagas} vagas disponíveis</span>
                      </div> */}

                                            <div className="flex items-center gap-2 text-sm">
                                                <DollarSign className={`w-4 h-4 ${curso.gratuito ? 'text-green-500' : 'text-gray-600 dark:text-gray-400'}`} />
                                                <span className={`font-semibold ${curso.gratuito ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-white'}`}>
                                                    {curso.gratuito ? 'Gratuito' : curso.preco}
                                                </span>
                                            </div>

                                            {/* Data de atualização */}
                                            {/* <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500 mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                        <Calendar className="w-3 h-3" />
                        <span>Atualizado em {formatarData(curso.updatedAt)}</span>
                      </div> */}
                                        </div>
                                    </div>

                                    {/* Card Footer */}
                                    <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                                        <div className="flex justify-between items-center">
                                            <div className={`px-3 py-1 rounded-full text-xs font-medium ${curso.inscricoesAbertas ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                                                {curso.inscricoesAbertas ? 'Inscrições abertas' : 'Inscrições encerradas'}
                                            </div>

                                            <button
                                                onClick={() => handleInscreverClick(curso.id, curso.titulo)}
                                                disabled={!curso.inscricoesAbertas}
                                                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${curso.inscricoesAbertas
                                                    ? 'bg-gradient-to-r from-blue-600 to-brand-main hover:from-blue-700 hover:to-brand-main/90 text-white shadow-sm hover:shadow hover:scale-105'
                                                    : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                                                    }`}
                                            >
                                                {curso.inscricoesAbertas ? 'Inscrever-se' : 'Em breve'}
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* Footer Info */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30 rounded-2xl p-6 border border-blue-200 dark:border-blue-800/30"
                >
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                Precisa de ajuda para escolher seu curso?
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                Nossa equipe de orientadores está disponível para ajudá-lo a tomar a melhor decisão.
                            </p>
                        </div>
                        <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-brand-main text-white font-medium rounded-xl hover:shadow-lg transition-all duration-300 whitespace-nowrap">
                            Falar com orientador
                        </button>
                    </div>
                </motion.div>
            </div>
            <InscreverModal
                isOpen={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    setSelectedCurso(null);
                }}
                cursoId={selectedCurso?.id || ''}
                cursoNome={selectedCurso?.nome || ''}
                usuarioId="" // Em produção, pegar do auth
            />
        </div>
    );
}