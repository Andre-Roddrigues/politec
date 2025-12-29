// components/admin/estudantes/EstudantesTableLite.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import {
    Search,
    Download,
    ChevronLeft,
    ChevronRight,
    User,
    Mail,
    Phone,
    Calendar,
    BookOpen,
    Clock,
    CheckCircle,
    Clock3,
    XCircle,
    Eye,
    Filter,
    ChevronUp,
    ChevronDown,
    Users,
    FileSpreadsheet,
    FileText,
    X
} from "lucide-react";
import { listarEstudantes, getCursosOptions, Estudante } from "../../../lib/listar-estudantes";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import toast from "react-hot-toast";
import ModalDetalhes from "./ModalDetalhes";
import { exportarEstudantePDF, exportarEstudantesCSV, exportarListaCompletaPDF } from "../../../lib/export-estudantes";

interface EstudantesTableLiteProps {
    initialData?: Estudante[];
    initialTotal?: number;
}

type SortField = 'user.nome' | 'status' | 'cursoHorario.curso.nome' | 'createdAt';
type SortDirection = 'asc' | 'desc';

export default function EstudantesTableLite({
    initialData = [],
    initialTotal = 0
}: EstudantesTableLiteProps) {
    const [allEstudantes, setAllEstudantes] = useState<Estudante[]>(initialData);
    const [estudantes, setEstudantes] = useState<Estudante[]>(initialData);
    const [total, setTotal] = useState(initialTotal);
    const [selectedEstudante, setSelectedEstudante] = useState<Estudante | null>(null);
    const [showDetails, setShowDetails] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    
    // Filtros
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState<string>("all");
    const [cursoId, setCursoId] = useState<string>("all");
    const [cursosOptions, setCursosOptions] = useState<{ id: string, nome: string }[]>([]);

    // Ordenação
    const [sortField, setSortField] = useState<SortField>('user.nome');
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

    // Paginação
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    // Carregar todos os dados uma vez
    useEffect(() => {
        const loadAllData = async () => {
            try {
                const result = await listarEstudantes(1, 1000);
                
                if (result.success) {
                    setAllEstudantes(result.data || []);
                    setEstudantes(result.data || []);
                    setTotal(result.data?.length || 0);
                } else {
                    toast.error("Erro ao carregar estudantes");
                }
            } catch (error) {
                console.error('Erro ao carregar estudantes:', error);
                toast.error("Erro ao carregar estudantes");
            }
        };

        loadAllData();
    }, []);

    // Carregar opções de cursos
    useEffect(() => {
        const loadCursosOptions = async () => {
            try {
                const cursos = await getCursosOptions();
                setCursosOptions(cursos);
            } catch (error) {
                console.error("Erro ao carregar cursos:", error);
            }
        };

        loadCursosOptions();
    }, []);

    // Função para ordenação
    const sortEstudantes = (data: Estudante[]) => {
        return [...data].sort((a, b) => {
            let valueA, valueB;
            
            switch (sortField) {
                case 'user.nome':
                    valueA = `${a.user.nome} ${a.user.apelido}`.toLowerCase();
                    valueB = `${b.user.nome} ${b.user.apelido}`.toLowerCase();
                    break;
                case 'status':
                    valueA = a.status;
                    valueB = b.status;
                    break;
                case 'cursoHorario.curso.nome':
                    valueA = a.cursoHorario.curso.nome.toLowerCase();
                    valueB = b.cursoHorario.curso.nome.toLowerCase();
                    break;
                case 'createdAt':
                    valueA = new Date(a.createdAt).getTime();
                    valueB = new Date(b.createdAt).getTime();
                    break;
                default:
                    return 0;
            }
            
            if (sortDirection === 'asc') {
                return valueA > valueB ? 1 : -1;
            } else {
                return valueA < valueB ? 1 : -1;
            }
        });
    };

    // Filtragem em tempo real
    const filteredEstudantes = useMemo(() => {
        let filtered = allEstudantes;

        // Filtro por busca
        if (search) {
            const searchLower = search.toLowerCase();
            filtered = filtered.filter(e => 
                e.user.nome.toLowerCase().includes(searchLower) ||
                e.user.apelido.toLowerCase().includes(searchLower) ||
                e.user.email.toLowerCase().includes(searchLower) ||
                e.user.contacto.toLowerCase().includes(searchLower)
            );
        }

        // Filtro por status
        if (status !== 'all') {
            filtered = filtered.filter(e => e.status === status);
        }

        // Filtro por curso
        if (cursoId !== 'all') {
            filtered = filtered.filter(e => e.cursoHorario.curso.id === cursoId);
        }

        return sortEstudantes(filtered);
    }, [allEstudantes, search, status, cursoId, sortField, sortDirection]);

    // Paginação dos dados filtrados
    const paginatedEstudantes = useMemo(() => {
        const start = (page - 1) * limit;
        const end = start + limit;
        return filteredEstudantes.slice(start, end);
    }, [filteredEstudantes, page, limit]);
// Calcular totalPages
const totalPages = useMemo(() => {
    return Math.ceil(total / limit);
}, [total, limit]);
    // Atualizar estudantes exibidos
    useEffect(() => {
        setEstudantes(paginatedEstudantes);
        setTotal(filteredEstudantes.length);
    }, [paginatedEstudantes, filteredEstudantes]);

    // Função para alternar ordenação
    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    // Renderizar ícone de ordenação
    const renderSortIcon = (field: SortField) => {
        if (sortField !== field) return null;
        return sortDirection === 'asc' ? 
            <ChevronUp className="w-3 h-3 ml-1" /> : 
            <ChevronDown className="w-3 h-3 ml-1" />;
    };

    // Funções de detalhes
    const handleOpenDetails = (estudante: Estudante) => {
        setSelectedEstudante(estudante);
        setShowDetails(true);
    };
    
    const handleExportEstudante = (estudante: Estudante) => {
        exportarEstudantePDF(estudante);
        toast.success('Ficha do estudante exportada com sucesso!');
    };
    
    const handleCloseDetails = () => {
        setShowDetails(false);
        setSelectedEstudante(null);
    };

    // Função para exportar
    const handleExport = async (formato: "excel" | "pdf" | "csv") => {
        try {
            if (formato === 'pdf') {
                exportarListaCompletaPDF(filteredEstudantes, {
                    search: search || undefined,
                    status: status === "all" ? undefined : status,
                    cursoId: cursoId === "all" ? undefined : cursoId,
                });
                toast.success('PDF gerado com sucesso!');
            } else if (formato === 'csv') {
                exportarEstudantesCSV(filteredEstudantes);
                toast.success('CSV gerado com sucesso!');
            } else {
                exportarEstudantesCSV(filteredEstudantes);
                toast.success('Arquivo Excel (CSV) gerado com sucesso!');
            }
        } catch (error) {
            console.error('Erro ao exportar:', error);
            toast.error('Erro ao gerar arquivo');
        }
    };

    // Função para formatar data
    const formatDate = (dateString: string) => {
        try {
            return format(new Date(dateString), "dd/MM/yyyy", { locale: pt });
        } catch {
            return dateString;
        }
    };

    // Função para status
    const getStatusInfo = (status: string, mensalidadePaga: boolean) => {
        switch (status) {
            case "aprovado":
                return {
                    text: "Aprovado",
                    color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
                    icon: <CheckCircle className="w-3 h-3" />
                };
            case "pendente":
                return {
                    text: mensalidadePaga ? "Ativo" : "Pendente",
                    color: mensalidadePaga
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                        : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
                    icon: mensalidadePaga
                        ? <CheckCircle className="w-3 h-3" />
                        : <Clock3 className="w-3 h-3" />
                };
            case "rejeitado":
                return {
                    text: "Rejeitado",
                    color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
                    icon: <XCircle className="w-3 h-3" />
                };
            default:
                return {
                    text: status,
                    color: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
                    icon: <Clock3 className="w-3 h-3" />
                };
        }
    };

    // Estatísticas rápidas
    const stats = useMemo(() => {
        const aprovados = filteredEstudantes.filter(e => e.status === "aprovado").length;
        const pendentes = filteredEstudantes.filter(e => e.status === "pendente").length;
        const rejeitados = filteredEstudantes.filter(e => e.status === "rejeitado").length;

        return { aprovados, pendentes, rejeitados };
    }, [filteredEstudantes]);

    // Versão mobile: Card view
    const renderMobileView = () => (
        <div className="space-y-3 md:hidden">
            {estudantes.map((estudante) => {
                const statusInfo = getStatusInfo(estudante.status, estudante.mensalidadePaga);

                return (
                    <div
                        key={estudante.id}
                        className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                                    <User className="w-5 h-5 text-white" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h3 className="font-medium text-gray-900 dark:text-white truncate">
                                        {estudante.user.nome} {estudante.user.apelido}
                                    </h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Mail className="w-3 h-3 text-gray-400" />
                                        <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                            {estudante.user.email}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Phone className="w-3 h-3 text-gray-400" />
                                        <span className="text-xs text-gray-600 dark:text-gray-300">
                                            {estudante.user.contacto}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col items-end gap-1">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color} flex items-center gap-1`}>
                                    {statusInfo.icon}
                                    <span className="hidden sm:inline">{statusInfo.text}</span>
                                </span>
                            </div>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-3">
                            <div className="flex items-center gap-2">
                                <BookOpen className="w-3 h-3 text-gray-400" />
                                <div className="min-w-0">
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Curso</p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                        {estudante.cursoHorario.curso.nome}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Clock className="w-3 h-3 text-gray-400" />
                                <div className="min-w-0">
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Horário</p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                        {estudante.cursoHorario.horario.periodo}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-3 h-3 text-gray-400" />
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {formatDate(estudante.createdAt)}
                                </span>
                            </div>
                            <button
                                onClick={() => handleOpenDetails(estudante)}
                                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                            >
                                <Eye className="w-4 h-4 text-gray-500" />
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );

    // Versão desktop: Table view
    const renderDesktopView = () => (
        <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="text-left text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                        <th className="py-3 px-4 font-medium">
                            <button
                                onClick={() => handleSort('user.nome')}
                                className="flex items-center hover:text-gray-700 dark:hover:text-gray-300"
                            >
                                Estudante
                                {renderSortIcon('user.nome')}
                            </button>
                        </th>
                        <th className="py-3 px-4 font-medium">
                            <button
                                onClick={() => handleSort('cursoHorario.curso.nome')}
                                className="flex items-center hover:text-gray-700 dark:hover:text-gray-300"
                            >
                                Curso
                            </button>
                        </th>
                        <th className="py-3 px-4 font-medium">Horário</th>
                        <th className="py-3 px-4 font-medium">
                            <button
                                onClick={() => handleSort('status')}
                                className="flex items-center hover:text-gray-700 dark:hover:text-gray-300"
                            >
                                Status
                                {renderSortIcon('status')}
                            </button>
                        </th>
                        <th className="py-3 px-4 font-medium">Data</th>
                        <th className="py-3 px-4 font-medium text-right">Ações</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {estudantes.map((estudante) => {
                        const statusInfo = getStatusInfo(estudante.status, estudante.mensalidadePaga);

                        return (
                            <tr
                                key={estudante.id}
                                className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                            >
                                {/* Estudante */}
                                <td className="py-3 px-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                                            <User className="w-4 h-4 text-white" />
                                        </div>
                                        <div className="min-w-0">
                                            <div className="font-medium text-gray-900 dark:text-white truncate max-w-[180px]">
                                                {estudante.user.nome} {estudante.user.apelido}
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[180px]">
                                                {estudante.user.email}
                                            </div>
                                        </div>
                                    </div>
                                </td>

                                {/* Curso */}
                                <td className="py-3 px-4">
                                    <div className="flex items-center gap-2">
                                        <BookOpen className="w-3 h-3 text-gray-400 flex-shrink-0" />
                                        <div className="text-sm text-gray-700 dark:text-gray-300 truncate max-w-[200px]">
                                            {estudante.cursoHorario.curso.nome}
                                        </div>
                                    </div>
                                </td>

                                {/* Horário */}
                                <td className="py-3 px-4">
                                    <div className="text-sm text-gray-700 dark:text-gray-300">
                                        {estudante.cursoHorario.horario.periodo}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                        {estudante.cursoHorario.horario.hora}
                                    </div>
                                </td>

                                {/* Status */}
                                <td className="py-3 px-4">
                                    <div className="flex items-center gap-2">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color} flex items-center gap-1`}>
                                            {statusInfo.icon}
                                            {statusInfo.text}
                                        </span>
                                    </div>
                                </td>

                                {/* Data */}
                                <td className="py-3 px-4">
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        {formatDate(estudante.createdAt)}
                                    </div>
                                </td>

                                {/* Ações */}
                                <td className="py-3 px-4 text-right">
                                    <button 
                                        onClick={() => handleOpenDetails(estudante)}
                                        className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                                    >
                                        <Eye className="w-4 h-4 text-gray-500" />
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            {/* Header */}
            <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Estudantes
                        </h2>
                        <div className="flex items-center gap-2 mt-1">
                            <Users className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                {filteredEstudantes.length} estudante(s) de {allEstudantes.length} total
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                            <Filter className="w-4 h-4" />
                            <span className="text-sm">Filtros</span>
                        </button>

                        <button
                            onClick={() => handleExport("csv")}
                            disabled={filteredEstudantes.length === 0}
                            className="inline-flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <FileSpreadsheet className="w-4 h-4" />
                            <span className="text-sm">Excel</span>
                        </button>
                        <button
                            onClick={() => handleExport("pdf")}
                            disabled={filteredEstudantes.length === 0}
                            className="inline-flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <FileText className="w-4 h-4" />
                            <span className="text-sm">PDF</span>
                        </button>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative mt-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar por nome, email ou telefone..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                {/* Filtros Expandíveis */}
                {showFilters && (
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                        <div>
                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                Status
                            </label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
                            >
                                <option value="all">Todos</option>
                                <option value="pendente">Pendentes</option>
                                <option value="aprovado">Aprovados</option>
                                <option value="rejeitado">Rejeitados</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                Curso
                            </label>
                            <select
                                value={cursoId}
                                onChange={(e) => setCursoId(e.target.value)}
                                className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
                            >
                                <option value="all">Todos os cursos</option>
                                {cursosOptions.map((curso) => (
                                    <option key={curso.id} value={curso.id}>
                                        {curso.nome}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                Itens por página
                            </label>
                            <select
                                value={limit}
                                onChange={(e) => {
                                    setLimit(Number(e.target.value));
                                    setPage(1);
                                }}
                                className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
                            >
                                <option value="5">5</option>
                                <option value="10">10</option>
                                <option value="15">15</option>
                                <option value="20">20</option>
                                <option value="50">50</option>
                            </select>
                        </div>

                        {/* Botão Limpar Filtros */}
                        <div className="sm:col-span-3">
                            <button
                                onClick={() => {
                                    setSearch("");
                                    setStatus("all");
                                    setCursoId("all");
                                }}
                                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                                <X className="w-3 h-3" />
                                Limpar Filtros
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Conteúdo da tabela */}
            {estudantes.length === 0 ? (
                <div className="py-12 text-center">
                    <Users className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-500 dark:text-gray-400">
                        Nenhum estudante encontrado
                    </p>
                    {search || status !== "all" || cursoId !== "all" ? (
                        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                            Tente ajustar os filtros de busca
                        </p>
                    ) : null}
                </div>
            ) : (
                <>
                    {/* Views responsivas */}
                    {renderMobileView()}
                    {renderDesktopView()}
                </>
            )}

            {/* Paginação */}
            {estudantes.length > 0 && (
                <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                            Mostrando {Math.min((page - 1) * limit + 1, total)} a {Math.min(page * limit, total)} de {total} itens
                        </div>

                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setPage(page - 1)}
                                disabled={page === 1}
                                className="p-1.5 rounded border border-gray-300 dark:border-gray-700 disabled:opacity-30 hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>

                            {/* Números de página simplificados */}
                            <div className="flex items-center gap-1">
                                {page > 2 && (
                                    <button
                                        onClick={() => setPage(1)}
                                        className="w-8 h-8 rounded text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
                                    >
                                        1
                                    </button>
                                )}
                                {page > 3 && (
                                    <span className="px-1">...</span>
                                )}
                                {page > 1 && (
                                    <button
                                        onClick={() => setPage(page - 1)}
                                        className="w-8 h-8 rounded text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
                                    >
                                        {page - 1}
                                    </button>
                                )}
                                <button className="w-8 h-8 rounded bg-blue-600 text-white text-sm">
                                    {page}
                                </button>
                                {page < totalPages && (
                                    <button
                                        onClick={() => setPage(page + 1)}
                                        className="w-8 h-8 rounded text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
                                    >
                                        {page + 1}
                                    </button>
                                )}
                                {page < totalPages - 2 && (
                                    <span className="px-1">...</span>
                                )}
                                {page < totalPages - 1 && (
                                    <button
                                        onClick={() => setPage(totalPages)}
                                        className="w-8 h-8 rounded text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
                                    >
                                        {totalPages}
                                    </button>
                                )}
                            </div>

                            <button
                                onClick={() => setPage(page + 1)}
                                disabled={page === totalPages}
                                className="p-1.5 rounded border border-gray-300 dark:border-gray-700 disabled:opacity-30 hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Estatísticas Rápidas */}
            {estudantes.length > 0 && (
                <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="text-center">
                            <div className="text-lg font-semibold text-gray-900 dark:text-white">
                                {total}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                Total
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-lg font-semibold text-green-600 dark:text-green-400">
                                {stats.aprovados}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                Aprovados
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-lg font-semibold text-yellow-600 dark:text-yellow-400">
                                {stats.pendentes}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                Pendentes
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-lg font-semibold text-red-600 dark:text-red-400">
                                {stats.rejeitados}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                Rejeitados
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Modal de Detalhes */}
            <ModalDetalhes
                estudante={selectedEstudante}
                isOpen={showDetails}
                onClose={handleCloseDetails}
                onExport={handleExportEstudante}
            />
        </div>
    );
}