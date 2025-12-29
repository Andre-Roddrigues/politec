// components/admin/pagamentos/PagamentosTable.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Search,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  User,
  Calendar,
  CreditCard,
  Smartphone,
  DollarSign,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  FileText,
  FileSpreadsheet,
  TrendingUp,
  Check,
  X,
  AlertCircle,
  ChevronUp,
  ChevronDown
} from "lucide-react";
import { 
  listarPagamentos, 
  Pagamento, 
  getPaymentStats 
} from "../../../lib/admin-payments";
import { 
  exportarPagamentosPDF, 
  exportarPagamentosCSV,
  exportarPagamentoPDF 
} from "../../../lib/export-pagamentos";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import toast from "react-hot-toast";
import ModalConfirmacao from "./ModalConfirmacao";

interface PagamentosTableProps {
  initialData?: Pagamento[];
  initialTotal?: number;
}

type SortField = 'user.nome' | 'metodoPagamento' | 'valor' | 'status' | 'dataPagamento';
type SortDirection = 'asc' | 'desc';

export default function PagamentosTable({
  initialData = [],
  initialTotal = 0
}: PagamentosTableProps) {
  const [allPagamentos, setAllPagamentos] = useState<Pagamento[]>(initialData);
  const [pagamentos, setPagamentos] = useState<Pagamento[]>(initialData);
  const [total, setTotal] = useState(initialTotal);
  const [stats, setStats] = useState<any>(null);
  
  // Filtros
  const [search, setSearch] = useState("");
  const [metodo, setMetodo] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [tipo, setTipo] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  
  // Ordenação
  const [sortField, setSortField] = useState<SortField>('dataPagamento');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  
  // Paginação
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const totalPages = Math.ceil(total / limit);
  
  // Modal
  const [selectedPagamento, setSelectedPagamento] = useState<Pagamento | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Carregar todos os dados uma vez
  useEffect(() => {
    const loadAllData = async () => {
      try {
        // Carregar todos os pagamentos sem paginação para filtragem em tempo real
        const result = await listarPagamentos(1, 1000);
        
        if (result.success) {
          setAllPagamentos(result.pagamentos || []);
          setPagamentos(result.pagamentos || []);
          setTotal(result.total || 0);
        }
      } catch (error) {
        console.error('Erro ao carregar pagamentos:', error);
        toast.error("Erro ao carregar pagamentos");
      }
    };

    const loadStats = async () => {
      const statsData = await getPaymentStats();
      setStats(statsData);
    };

    loadAllData();
    loadStats();
  }, []);

  // Função para ordenação
  const sortPagamentos = (data: Pagamento[]) => {
    return [...data].sort((a, b) => {
      let valueA, valueB;
      
      switch (sortField) {
        case 'user.nome':
          valueA = a.user.nome.toLowerCase();
          valueB = b.user.nome.toLowerCase();
          break;
        case 'metodoPagamento':
          valueA = a.metodoPagamento;
          valueB = b.metodoPagamento;
          break;
        case 'valor':
          valueA = Number(a.valor);
          valueB = Number(b.valor);
          break;
        case 'status':
          valueA = a.status;
          valueB = b.status;
          break;
        case 'dataPagamento':
          valueA = new Date(a.dataPagamento).getTime();
          valueB = new Date(b.dataPagamento).getTime();
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
  const filteredPagamentos = useMemo(() => {
    let filtered = allPagamentos;

    // Filtro por busca
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(p => 
        p.referencia.toLowerCase().includes(searchLower) ||
        p.user.nome.toLowerCase().includes(searchLower) ||
        p.user.email.toLowerCase().includes(searchLower)
      );
    }

    // Filtro por método
    if (metodo !== 'all') {
      filtered = filtered.filter(p => p.metodoPagamento === metodo);
    }

    // Filtro por status
    if (status !== 'all') {
      filtered = filtered.filter(p => p.status === status);
    }

    // Filtro por tipo
    if (tipo !== 'all') {
      filtered = filtered.filter(p => p.itemNome === tipo);
    }

    // Filtro por data
    if (dataInicio) {
      const startDate = new Date(dataInicio);
      startDate.setHours(0, 0, 0, 0);
      filtered = filtered.filter(p => new Date(p.dataPagamento) >= startDate);
    }

    if (dataFim) {
      const endDate = new Date(dataFim);
      endDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(p => new Date(p.dataPagamento) <= endDate);
    }

    return sortPagamentos(filtered);
  }, [allPagamentos, search, metodo, status, tipo, dataInicio, dataFim, sortField, sortDirection]);

  // Paginação dos dados filtrados
  const paginatedPagamentos = useMemo(() => {
    const start = (page - 1) * limit;
    const end = start + limit;
    return filteredPagamentos.slice(start, end);
  }, [filteredPagamentos, page, limit]);

  // Atualizar pagamentos exibidos
  useEffect(() => {
    setPagamentos(paginatedPagamentos);
    setTotal(filteredPagamentos.length);
  }, [paginatedPagamentos, filteredPagamentos]);

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

  // Função para exportar
  const handleExport = async (formato: "excel" | "pdf" | "csv") => {
    try {
      if (formato === 'pdf') {
        exportarPagamentosPDF(filteredPagamentos, { metodo, status, search });
        toast.success('PDF gerado com sucesso!');
      } else if (formato === 'csv') {
        exportarPagamentosCSV(filteredPagamentos);
        toast.success('CSV gerado com sucesso!');
      } else {
        exportarPagamentosCSV(filteredPagamentos);
        toast.success('Arquivo Excel (CSV) gerado com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao exportar:', error);
      toast.error('Erro ao gerar arquivo');
    }
  };

  // Função para exportar individual
  const handleExportIndividual = (pagamento: Pagamento) => {
    exportarPagamentoPDF(pagamento);
    toast.success('Comprovante gerado com sucesso!');
  };

  // Função para abrir modal de confirmação
  const handleOpenConfirmModal = (pagamento: Pagamento) => {
    setSelectedPagamento(pagamento);
    setShowConfirmModal(true);
  };

  // Função para formatar data
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yy HH:mm", { locale: pt });
    } catch {
      return dateString;
    }
  };

  // Função para status
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "confirmado":
        return {
          text: "Confirmado",
          color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
          icon: <CheckCircle className="w-3 h-3" />
        };
      case "processando":
        return {
          text: "Processando",
          color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
          icon: <Clock className="w-3 h-3" />
        };
      case "pendente":
        return {
          text: "Pendente",
          color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
          icon: <Clock className="w-3 h-3" />
        };
      case "falhou":
        return {
          text: "Falhou",
          color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
          icon: <XCircle className="w-3 h-3" />
        };
      case "cancelado":
        return {
          text: "Cancelado",
          color: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
          icon: <XCircle className="w-3 h-3" />
        };
      default:
        return {
          text: status,
          color: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
          icon: <Clock className="w-3 h-3" />
        };
    }
  };

  // Tabs de método
  const tabs = [
    { id: "all", label: "Todos", count: allPagamentos.length },
    { id: "mpesa", label: "M-Pesa", count: allPagamentos.filter(p => p.metodoPagamento === "mpesa").length },
    { id: "transferencia", label: "Transferência", count: allPagamentos.filter(p => p.metodoPagamento === "transferencia").length },
  ];

  // Versão mobile: Card view
  const renderMobileView = () => (
    <div className="space-y-3 md:hidden">
      {pagamentos.map((pagamento) => {
        const statusInfo = getStatusInfo(pagamento.status);
        
        return (
          <div
            key={pagamento.id}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {pagamento.referencia}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <User className="w-3 h-3 text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {pagamento.user.nome}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-1">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color} flex items-center gap-1`}>
                  {statusInfo.icon}
                  <span className="hidden sm:inline">{statusInfo.text}</span>
                </span>
                <span className={`text-xs px-2 py-1 rounded ${
                  pagamento.metodoPagamento === "mpesa" 
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                    : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                }`}>
                  {pagamento.metodoPagamento === "mpesa" ? "M-Pesa" : "Transferência"}
                </span>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <DollarSign className="w-3 h-3 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Valor</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {Number(pagamento.valor).toLocaleString("pt-MZ")} MT
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="w-3 h-3 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Data</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatDate(pagamento.dataPagamento)}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <span className={`px-2 py-1 rounded text-xs ${
                pagamento.itemNome === "inscricao" 
                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                  : "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
              }`}>
                {pagamento.itemNome === "inscricao" ? "Inscrição" : "Mensalidade"}
              </span>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleExportIndividual(pagamento)}
                  className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  title="Exportar"
                >
                  <Download className="w-3 h-3 text-gray-500" />
                </button>
                
                {(pagamento.status === "pendente" || pagamento.status === "processando") && (
                  <button
                    onClick={() => handleOpenConfirmModal(pagamento)}
                    className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    title="Ações"
                  >
                    <Eye className="w-3 h-3 text-gray-500" />
                  </button>
                )}
              </div>
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
                onClick={() => handleSort('dataPagamento')}
                className="flex items-center hover:text-gray-700 dark:hover:text-gray-300"
              >
                Referência
                {renderSortIcon('dataPagamento')}
              </button>
            </th>
            <th className="py-3 px-4 font-medium">
              <button
                onClick={() => handleSort('user.nome')}
                className="flex items-center hover:text-gray-700 dark:hover:text-gray-300"
              >
                Usuário
                {renderSortIcon('user.nome')}
              </button>
            </th>
            <th className="py-3 px-4 font-medium">
              <button
                onClick={() => handleSort('metodoPagamento')}
                className="flex items-center hover:text-gray-700 dark:hover:text-gray-300"
              >
                Método
                {renderSortIcon('metodoPagamento')}
              </button>
            </th>
            <th className="py-3 px-4 font-medium">
              <button
                onClick={() => handleSort('valor')}
                className="flex items-center hover:text-gray-700 dark:hover:text-gray-300"
              >
                Valor
                {renderSortIcon('valor')}
              </button>
            </th>
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
          {pagamentos.map((pagamento) => {
            const statusInfo = getStatusInfo(pagamento.status);
            
            return (
              <tr
                key={pagamento.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
              >
                {/* Referência */}
                <td className="py-3 px-4">
                  <div className="font-medium text-gray-900 dark:text-white text-sm">
                    {pagamento.referencia}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {pagamento.itemNome === "inscricao" ? "Inscrição" : "Mensalidade"}
                  </div>
                </td>

                {/* Usuário */}
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-brand-main flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium text-gray-900 dark:text-white truncate max-w-[150px]">
                        {pagamento.user.nome}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[150px]">
                        {pagamento.user.contacto}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Método */}
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    {pagamento.metodoPagamento === "mpesa" ? (
                      <Smartphone className="w-3 h-3 text-green-500" />
                    ) : (
                      <CreditCard className="w-3 h-3 text-blue-500" />
                    )}
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {pagamento.metodoPagamento === "mpesa" ? "M-Pesa" : "Transferência"}
                    </span>
                  </div>
                </td>

                {/* Valor */}
                <td className="py-3 px-4">
                  <div className="font-bold text-gray-900 dark:text-white">
                    {Number(pagamento.valor).toLocaleString("pt-MZ")} MT
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
                    {formatDate(pagamento.dataPagamento)}
                  </div>
                </td>

                {/* Ações */}
                <td className="py-3 px-4 text-right">
                  <div className="flex justify-end gap-1">
                    <button
                      onClick={() => handleExportIndividual(pagamento)}
                      className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                      title="Exportar"
                    >
                      <Download className="w-4 h-4 text-gray-500" />
                    </button>
                    
                    {(pagamento.status === "pendente" || pagamento.status === "processando") && (
                      <button
                        onClick={() => handleOpenConfirmModal(pagamento)}
                        className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                        title="Ações"
                      >
                        <Eye className="w-4 h-4 text-gray-500" />
                      </button>
                    )}
                    
                    {pagamento.metodoPagamento === "transferencia" && pagamento.transferencias.length > 0 && (
                      <button
                        onClick={() => handleOpenConfirmModal(pagamento)}
                        className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                        title="Ver comprovante"
                      >
                        <FileText className="w-4 h-4 text-gray-500" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Total</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {stats.total}
                </p>
              </div>
              <TrendingUp className="w-5 h-5 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Confirmados</p>
                <p className="text-xl font-bold text-green-600 dark:text-green-400">
                  {stats.confirmados}
                </p>
              </div>
              <Check className="w-5 h-5 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Pendentes</p>
                <p className="text-xl font-bold text-yellow-600 dark:text-yellow-400">
                  {stats.pendentes}
                </p>
              </div>
              <Clock className="w-5 h-5 text-yellow-500" />
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Valor Total</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {stats.totalValor.toLocaleString("pt-MZ")} MT
                </p>
              </div>
              <DollarSign className="w-5 h-5 text-purple-500" />
            </div>
          </div>
        </div>
      )}

      {/* Tabela Container */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Pagamentos
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {filteredPagamentos.length} encontrado(s) de {allPagamentos.length} total
              </p>
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
                disabled={filteredPagamentos.length === 0}
                className="inline-flex items-center gap-2 px-3 py-2 bg-brand-lime text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span className="text-sm">Excel</span>
              </button>
              <button
                onClick={() => handleExport("pdf")}
                disabled={filteredPagamentos.length === 0}
                className="inline-flex items-center gap-2 px-3 py-2 bg-brand-main text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                <FileText className="w-4 h-4" />
                <span className="text-sm">PDF</span>
              </button>
            </div>
          </div>

          {/* Tabs de Método */}
          <div className="mt-4 flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setMetodo(tab.id)}
                className={`flex-shrink-0 px-3 py-2 text-sm font-medium border-b-2 ${
                  metodo === tab.id
                    ? "text-blue-600 border-blue-600"
                    : "text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                {tab.label}
                <span className={`ml-2 px-1.5 py-0.5 text-xs rounded-full ${
                  metodo === tab.id
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                    : "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300"
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por referência, nome ou email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Filtros Expandíveis */}
        {showFilters && (
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Status */}
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
                >
                  <option value="all">Todos status</option>
                  <option value="pendente">Pendentes</option>
                  <option value="processando">Processando</option>
                  <option value="confirmado">Confirmados</option>
                  <option value="falhou">Falhados</option>
                </select>
              </div>

              {/* Tipo */}
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Tipo
                </label>
                <select
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
                >
                  <option value="all">Todos</option>
                  <option value="inscricao">Inscrição</option>
                  <option value="mensalidade">Mensalidade</option>
                </select>
              </div>

              {/* Data Início */}
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Data Início
                </label>
                <input
                  type="date"
                  value={dataInicio}
                  onChange={(e) => setDataInicio(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
                />
              </div>

              {/* Data Fim */}
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Data Fim
                </label>
                <input
                  type="date"
                  value={dataFim}
                  onChange={(e) => setDataFim(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
                />
              </div>
            </div>

            {/* Botões de Ação dos Filtros */}
            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={() => {
                  setStatus('all');
                  setTipo('all');
                  setDataInicio('');
                  setDataFim('');
                  setMetodo('all');
                  setSearch('');
                }}
                className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Limpar Filtros
              </button>

              <div className="ml-auto">
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Itens por página
                </label>
                <select
                  value={limit}
                  onChange={(e) => {
                    setLimit(Number(e.target.value));
                    setPage(1);
                  }}
                  className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Conteúdo da tabela */}
        {pagamentos.length === 0 ? (
          <div className="py-12 text-center">
            <AlertCircle className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">
              Nenhum pagamento encontrado
            </p>
            {search || status !== "all" || metodo !== "all" || dataInicio || dataFim ? (
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
        {pagamentos.length > 0 && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Mostrando {Math.min((page - 1) * limit + 1, total)} a {Math.min(page * limit, total)} de {total} itens
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="p-2 rounded border border-gray-300 dark:border-gray-700 disabled:opacity-30 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 3) {
                      pageNum = i + 1;
                    } else if (page <= 2) {
                      pageNum = i + 1;
                    } else if (page >= totalPages - 1) {
                      pageNum = totalPages - 2 + i;
                    } else {
                      pageNum = page - 1 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`w-8 h-8 rounded text-sm flex items-center justify-center ${
                          page === pageNum
                            ? "bg-blue-600 text-white"
                            : "border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                  className="p-2 rounded border border-gray-300 dark:border-gray-700 disabled:opacity-30 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Confirmação */}
      <ModalConfirmacao
        pagamento={selectedPagamento}
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={() => {
          // Recarregar dados após confirmação
          const loadAllData = async () => {
            const result = await listarPagamentos(1, 1000);
            if (result.success) {
              setAllPagamentos(result.pagamentos || []);
            }
          };
          loadAllData();
        }}
      />
    </div>
  );
}