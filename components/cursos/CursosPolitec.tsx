'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, Clock, Globe, MapPin, Home, GraduationCap,
    DollarSign, X, ChevronDown, Loader2, Sparkles, Lock,
    ArrowRight, SlidersHorizontal, Zap, BookOpen
} from 'lucide-react';
import {
    getCursos, getAreas, getModalidades, getNiveis,
    type Curso
} from '../../lib/cursos-actions';
import { useRouter } from 'next/navigation';
import { getCookie } from 'cookies-next';

type Filtros = {
    busca: string;
    nivel: string;
    area: string;
    modalidade: string;
    inscricoesAbertas: boolean;
};

const FILTROS_INICIAIS: Filtros = {
    busca: '',
    nivel: '',
    area: '',
    modalidade: '',
    inscricoesAbertas: true,
};

export default function CursosPolitec() {
    const router = useRouter();

    const [cursos, setCursos] = useState<Curso[]>([]);
    const [areas, setAreas] = useState<string[]>([]);
    const [modalidades, setModalidades] = useState<string[]>([]);
    const [niveis, setNiveis] = useState<string[]>([]);

    const [loading, setLoading] = useState(true);
    const [isFetching, setIsFetching] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [ordenacao, setOrdenacao] = useState<'relevancia' | 'nome' | 'duracao'>('relevancia');

    const [filtros, setFiltros] = useState<Filtros>(FILTROS_INICIAIS);

    useEffect(() => {
        const token = getCookie('auth_token');
        setIsAuthenticated(!!token);
    }, []);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    useEffect(() => {
        (async () => {
            try {
                const [c, a, m, n] = await Promise.all([
                    getCursos(FILTROS_INICIAIS),
                    getAreas(),
                    getModalidades(),
                    getNiveis(),
                ]);
                setCursos(c);
                setAreas(a);
                setModalidades(m);
                setNiveis(n);
            } catch (err) {
                console.error('Erro ao carregar dados:', err);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    useEffect(() => {
        if (loading) return;

        const timer = setTimeout(async () => {
            setIsFetching(true);
            try {
                const data = await getCursos(filtros);
                setCursos(data);
            } catch (err) {
                console.error('Erro ao aplicar filtros:', err);
            } finally {
                setIsFetching(false);
            }
        }, 400);

        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filtros]);

    const cursosOrdenados = useMemo(() => {
        const lista = [...cursos];
        if (ordenacao === 'nome') {
            lista.sort((a, b) => a.titulo.localeCompare(b.titulo, 'pt'));
        } else if (ordenacao === 'duracao') {
            lista.sort((a, b) => (a.duracao ?? '').localeCompare(b.duracao ?? '', 'pt'));
        }
        return lista;
    }, [cursos, ordenacao]);

    const filtrosAtivos = useMemo(() => {
        let count = 0;
        if (filtros.busca) count++;
        if (filtros.nivel) count++;
        if (filtros.area) count++;
        if (filtros.modalidade) count++;
        if (filtros.inscricoesAbertas) count++;
        return count;
    }, [filtros]);

    const totalInscricoesAbertas = useMemo(
        () => cursos.filter((c) => c.inscricoesAbertas).length,
        [cursos]
    );

    const clearFilters = useCallback(() => setFiltros(FILTROS_INICIAIS), []);

    const handleInscreverClick = useCallback(
    (cursoId: string, cursoNome: string) => {
        const token = getCookie('auth_token');

        if (!token) {
            sessionStorage.setItem('redirectAfterLogin', `/cursos/${cursoId}`);
            sessionStorage.setItem(
                'selectedCurso',
                JSON.stringify({ id: cursoId, nome: cursoNome })
            );
            
            window.location.href = '/login';
            return;
        }

        // Se estiver logado, avança normalmente
        router.push(`/cursos/${cursoId}`);
    },
    [router]
);

    function getModalidadeIcon(modalidade: string) {
        switch (modalidade) {
            case 'Presencial': return <MapPin className="w-3.5 h-3.5" />;
            case 'Híbrido': return <Home className="w-3.5 h-3.5" />;
            default: return <Globe className="w-3.5 h-3.5" />;
        }
    }

    return (
        <div className="relative min-h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
            {/* Blobs decorativos de fundo (cores sólidas, sem gradiente) */}
            <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-blue-200/40 blur-3xl dark:bg-blue-900/20" />
            <div className="pointer-events-none absolute top-40 -right-32 h-96 w-96 rounded-full bg-sky-200/40 blur-3xl dark:bg-sky-900/20" />
            <div className="pointer-events-none absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-blue-100/40 blur-3xl dark:bg-blue-950/30" />

            <div className="relative container mx-auto px-4 py-8 md:py-12 max-w-7xl">
                {/* ───────── HERO ───────── */}
                <motion.header
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative mb-10 overflow-hidden rounded-[2rem] bg-blue-600 p-8 md:p-14 text-white shadow-2xl shadow-blue-600/25"
                >
                    <div className="absolute -top-16 -right-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
                    <div className="absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-blue-400/20 blur-2xl" />

                    <div className="relative flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between">
                        <div className="max-w-2xl">
                            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.05]">
                                Aprenda hoje.
                                <br />
                                <span className="text-blue-100">
                                    Brilhe amanhã.
                                </span>
                            </h1>
                            <p className="mt-5 max-w-xl text-base md:text-lg text-white/85 leading-relaxed">
                                Encontre o curso certo para o seu momento e dê o próximo passo
                                na sua carreira, do jeito que faz sentido para si.
                            </p>

                            {!isAuthenticated && (
                                <div className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-white/15 px-4 py-2.5 text-sm font-medium backdrop-blur">
                                    <Lock className="h-4 w-4" />
                                    Inicie sessão para se inscrever nos cursos
                                </div>
                            )}
                        </div>

                        {!loading && (
                            <motion.div
                                initial={{ opacity: 0, x: 16 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.15 }}
                                className="flex gap-3 md:flex-col"
                            >
                                <div className="flex flex-1 items-center gap-3 rounded-2xl bg-white/15 px-5 py-4 backdrop-blur md:min-w-[220px]">
                                    <BookOpen className="h-6 w-6" />
                                    <div>
                                        <p className="text-3xl font-black leading-none">{cursos.length}</p>
                                        <p className="mt-1 text-xs uppercase tracking-wider text-white/75">
                                            {cursos.length === 1 ? 'curso' : 'cursos'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-1 items-center gap-3 rounded-2xl bg-emerald-500/90 px-5 py-4 md:min-w-[220px]">
                                    <span className="relative flex h-3 w-3">
                                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-200 opacity-75" />
                                        <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-100" />
                                    </span>
                                    <div>
                                        <p className="text-3xl font-black leading-none">{totalInscricoesAbertas}</p>
                                        <p className="mt-1 text-xs uppercase tracking-wider text-white/90">
                                            com inscrições abertas
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </motion.header>

                {/* ───────── FILTROS (barra flutuante) ───────── */}
                <motion.section
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="sticky top-4 z-20 mb-10"
                >
                    <div className="rounded-3xl border border-white/70 bg-white/90 p-3 md:p-4 shadow-xl shadow-blue-900/5 backdrop-blur-xl dark:border-gray-800 dark:bg-gray-900/90">
                        {/* Pesquisa */}
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 transition-colors group-focus-within:text-blue-600" />
                            <input
                                type="text"
                                placeholder="O que quer aprender hoje?"
                                value={filtros.busca}
                                onChange={(e) => setFiltros((p) => ({ ...p, busca: e.target.value }))}
                                className="w-full rounded-2xl bg-gray-100/80 py-3.5 pl-12 pr-12 text-gray-900 placeholder-gray-400 transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:bg-gray-800 dark:text-white dark:focus:bg-gray-800"
                            />
                            {filtros.busca && (
                                <button
                                    onClick={() => setFiltros((p) => ({ ...p, busca: '' }))}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-gray-400 transition hover:bg-gray-200 hover:text-gray-700 dark:hover:bg-gray-700"
                                    aria-label="Limpar busca"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        {/* Toggle mobile */}
                        {isMobile && (
                            <button
                                onClick={() => setShowFilters((v) => !v)}
                                className="mt-3 relative flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 py-3 font-semibold text-white shadow-md shadow-blue-600/30 transition active:scale-[0.98] hover:bg-blue-700"
                            >
                                <SlidersHorizontal className="w-4 h-4" />
                                Filtros
                                {filtrosAtivos > 0 && (
                                    <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1.5 text-xs font-bold text-blue-700">
                                        {filtrosAtivos}
                                    </span>
                                )}
                                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                            </button>
                        )}

                        <AnimatePresence initial={false}>
                            {(!isMobile || showFilters) && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="mt-3 grid gap-3 sm:grid-cols-2 md:grid-cols-4">
                                        <SelectFiltro
                                            label="Nível"
                                            value={filtros.nivel}
                                            onChange={(v) => setFiltros((p) => ({ ...p, nivel: v }))}
                                            options={niveis}
                                            placeholder="Todos os níveis"
                                        />
                                        <SelectFiltro
                                            label="Área"
                                            value={filtros.area}
                                            onChange={(v) => setFiltros((p) => ({ ...p, area: v }))}
                                            options={areas}
                                            placeholder="Todas as áreas"
                                        />
                                        <SelectFiltro
                                            label="Modalidade"
                                            value={filtros.modalidade}
                                            onChange={(v) => setFiltros((p) => ({ ...p, modalidade: v }))}
                                            options={modalidades}
                                            placeholder="Todas as modalidades"
                                        />

                                        <div className="flex items-end">
                                            <label
                                                htmlFor="inscricoesAbertas"
                                                className={`flex w-full cursor-pointer select-none items-center gap-3 rounded-xl border px-4 py-3 transition-all ${
                                                    filtros.inscricoesAbertas
                                                        ? 'border-emerald-400 bg-emerald-50 dark:border-emerald-600 dark:bg-emerald-900/30'
                                                        : 'border-gray-200 bg-gray-50 hover:border-blue-300 dark:border-gray-700 dark:bg-gray-800'
                                                }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    id="inscricoesAbertas"
                                                    checked={filtros.inscricoesAbertas}
                                                    onChange={(e) =>
                                                        setFiltros((p) => ({ ...p, inscricoesAbertas: e.target.checked }))
                                                    }
                                                    className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                                                />
                                                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                                    Apenas inscrições abertas
                                                </span>
                                            </label>
                                        </div>

                                        {filtrosAtivos > 0 && (
                                            <div className="sm:col-span-2 md:col-span-4 flex justify-end">
                                                <button
                                                    onClick={clearFilters}
                                                    className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-900/20"
                                                >
                                                    <X className="w-4 h-4" />
                                                    Limpar filtros ({filtrosAtivos})
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Status + ordenação */}
                        <div className="mt-3 flex flex-col items-start justify-between gap-3 px-1 sm:flex-row sm:items-center">
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                                        <span>A carregar cursos...</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="font-bold text-gray-900 dark:text-white">
                                            {cursosOrdenados.length}
                                        </span>
                                        <span>
                                            {cursosOrdenados.length === 1 ? 'curso encontrado' : 'cursos encontrados'}
                                        </span>
                                        {isFetching && <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />}
                                    </>
                                )}
                            </div>

                            <div className="flex items-center gap-2">
                                <label htmlFor="ordenacao" className="text-sm text-gray-600 dark:text-gray-400">
                                    Ordenar por
                                </label>
                                <select
                                    id="ordenacao"
                                    value={ordenacao}
                                    onChange={(e) => setOrdenacao(e.target.value as typeof ordenacao)}
                                    className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                                >
                                    <option value="relevancia">Relevância</option>
                                    <option value="nome">Nome (A–Z)</option>
                                    <option value="duracao">Duração</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* ───────── LISTA ───────── */}
                <motion.section
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mb-16"
                >
                    {loading ? (
                        <SkeletonGrid />
                    ) : cursosOrdenados.length === 0 ? (
                        <EmptyState onClear={clearFilters} />
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {cursosOrdenados.map((curso, index) => (
                                <CursoCard
                                    key={curso.id}
                                    curso={curso}
                                    index={index}
                                    isAuthenticated={isAuthenticated}
                                    onInscrever={() => handleInscreverClick(curso.id, curso.titulo)}
                                    getModalidadeIcon={getModalidadeIcon}
                                />
                            ))}
                        </div>
                    )}
                </motion.section>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────
   SUBCOMPONENTES
   ───────────────────────────────────────────────────────────── */

function SelectFiltro({
    label,
    value,
    onChange,
    options,
    placeholder,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    options: string[];
    placeholder: string;
}) {
    return (
        <div>
            <label className="mb-1.5 block px-1 text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                {label}
            </label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-sm font-medium text-gray-800 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            >
                <option value="">{placeholder}</option>
                {options.map((opt) => (
                    <option key={opt} value={opt}>
                        {opt}
                    </option>
                ))}
            </select>
        </div>
    );
}

function CursoCard({
    curso,
    index,
    isAuthenticated,
    onInscrever,
    getModalidadeIcon,
}: {
    curso: Curso;
    index: number;
    isAuthenticated: boolean;
    onInscrever: () => void;
    getModalidadeIcon: (m: string) => React.ReactNode;
}) {
    return (
        <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -6 }}
            className="group relative flex flex-col overflow-hidden rounded-3xl bg-white shadow-md shadow-blue-900/5 ring-1 ring-gray-200/70 transition-shadow duration-300 hover:shadow-2xl hover:shadow-blue-600/10 dark:bg-gray-900 dark:ring-gray-800"
        >
           

            <div className="flex flex-1 flex-col p-6">
                <div className="mb-4 flex items-start justify-between gap-3">
                    <div className="flex flex-wrap gap-2">
                        {curso.gratuito && (
                            <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                                <Zap className="mr-1 h-3 w-3" />
                                Gratuito
                            </span>
                        )}
                    </div>
                    <div className="flex shrink-0 items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                        {getModalidadeIcon(curso.modalidade)}
                        <span>{curso.modalidade}</span>
                    </div>
                </div>

                <h3
                    title={curso.titulo}
                    className="mb-2 line-clamp-2 text-xl font-black leading-tight text-gray-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400"
                >
                    {curso.titulo}
                </h3>

                <p className="mb-5 line-clamp-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                    {curso.descricao}
                </p>

                <div className="mt-auto grid grid-cols-2 gap-3 rounded-2xl bg-gray-50 p-3 dark:bg-gray-800/60">
                    <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <Clock className="h-4 w-4 shrink-0 text-blue-500" />
                        <span className="font-semibold">{curso.duracao}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <DollarSign
                            className={`h-4 w-4 shrink-0 ${curso.gratuito ? 'text-emerald-500' : 'text-blue-500'}`}
                        />
                        <span
                            className={`font-bold ${
                                curso.gratuito ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-900 dark:text-white'
                            }`}
                        >
                            {curso.gratuito ? 'Gratuito' : curso.preco}
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-gray-100 px-6 py-4 dark:border-gray-800">
                <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${
                        curso.inscricoesAbertas
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300'
                            : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                    }`}
                >
                    <span
                        className={`h-1.5 w-1.5 rounded-full ${
                            curso.inscricoesAbertas ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'
                        }`}
                    />
                    {curso.inscricoesAbertas ? 'Abertas' : 'Encerradas'}
                </span>

                <button
                    onClick={onInscrever}
                    disabled={!curso.inscricoesAbertas}
                    className={`inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-bold transition-all duration-300 ${
                        curso.inscricoesAbertas
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25 hover:bg-blue-700 hover:scale-[1.04] hover:shadow-xl active:scale-[0.97]'
                            : 'cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500'
                    }`}
                >
                    {curso.inscricoesAbertas ? (
                        <>
                            {!isAuthenticated && <Lock className="h-3.5 w-3.5" />}
                            Inscrever-se
                            <ArrowRight className="h-3.5 w-3.5" />
                        </>
                    ) : (
                        'Encerrado'
                    )}
                </button>
            </div>
        </motion.article>
    );
}

function SkeletonGrid() {
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
                <div
                    key={i}
                    className="overflow-hidden rounded-3xl bg-white ring-1 ring-gray-200/70 dark:bg-gray-900 dark:ring-gray-800"
                >
                    <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-800" />
                    <div className="space-y-4 p-6">
                        <div className="flex justify-between">
                            <div className="h-6 w-24 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
                            <div className="h-6 w-16 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
                        </div>
                        <div className="h-6 w-3/4 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800" />
                        <div className="h-3 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                        <div className="h-3 w-5/6 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                        <div className="h-16 w-full animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800" />
                    </div>
                    <div className="border-t border-gray-100 px-6 py-4 dark:border-gray-800">
                        <div className="ml-auto h-9 w-32 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
                    </div>
                </div>
            ))}
        </div>
    );
}

function EmptyState({ onClear }: { onClear: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-16 text-center"
        >
            <div className="mb-6 inline-flex h-24 w-24 items-center justify-center rounded-3xl bg-blue-100 dark:bg-blue-900/40">
                <Search className="h-10 w-10 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="mb-2 text-2xl font-black text-gray-900 dark:text-white">
                Nenhum curso encontrado
            </h3>
            <p className="mx-auto mb-6 max-w-md text-gray-600 dark:text-gray-400">
                Não encontrámos cursos que correspondam aos filtros selecionados.
                Experimente ajustar a sua pesquisa.
            </p>
            <button
                onClick={onClear}
                className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 font-bold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700 hover:scale-[1.03]"
            >
                <X className="w-4 h-4" />
                Limpar filtros
            </button>
        </motion.div>
    );
}