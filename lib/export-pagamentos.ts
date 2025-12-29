// lib/utils/export-pagamentos.ts
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { Pagamento } from './admin-payments';

// Exportar pagamento individual em PDF
export function exportarPagamentoPDF(pagamento: Pagamento) {
  const doc = new jsPDF();
  
  // Configurações
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;
  
  // Cabeçalho
  doc.setFontSize(20);
  doc.setTextColor(0, 0, 139);
  doc.text('COMPROVANTE DE PAGAMENTO', pageWidth / 2, margin, { align: 'center' });
  
  // Data de geração
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Gerado em: ${format(new Date(), "dd/MM/yyyy HH:mm", { locale: pt })}`, pageWidth - margin, margin, { align: 'right' });
  
  // Linha decorativa
  doc.setDrawColor(0, 0, 139);
  doc.setLineWidth(0.5);
  doc.line(margin, margin + 5, pageWidth - margin, margin + 5);
  
  let yPos = margin + 20;
  
  // Informações do Pagamento
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text('INFORMAÇÕES DO PAGAMENTO', margin, yPos);
  yPos += 10;
  
  doc.setFontSize(10);
  autoTable(doc, {
    startY: yPos,
    margin: { left: margin, right: margin },
    head: [['Campo', 'Informação']],
    body: [
      ['ID do Pagamento', pagamento.id],
      ['Referência', pagamento.referencia],
      ['Método', pagamento.metodoPagamento === 'mpesa' ? 'M-Pesa' : 'Transferência'],
      ['Tipo', pagamento.itemNome === 'inscricao' ? 'Inscrição' : pagamento.itemNome === 'mensalidade' ? 'Mensalidade' : 'Curso'],
      ['Valor', `${Number(pagamento.valor).toLocaleString("pt-MZ")} MT`],
      ['Status', pagamento.status],
      ['Data do Pagamento', format(new Date(pagamento.dataPagamento), "dd/MM/yyyy HH:mm", { locale: pt })],
    ],
    theme: 'grid',
    headStyles: { 
      fillColor: [41, 128, 185], 
      textColor: 255,
      fontSize: 10,
      fontStyle: 'bold'
    },
    styles: { fontSize: 9, cellPadding: 3 },
  });
  
  // Informações do Usuário
  yPos = doc.lastAutoTable?.finalY || yPos;
  yPos += 10;
  doc.setFontSize(14);
  doc.text('INFORMAÇÕES DO USUÁRIO', margin, yPos);
  yPos += 8;
  
  autoTable(doc, {
    startY: yPos,
    margin: { left: margin, right: margin },
    head: [['Campo', 'Informação']],
    body: [
      ['Nome', `${pagamento.user.nome} ${pagamento.user.apelido}`],
      ['Email', pagamento.user.email],
      ['Contacto', pagamento.user.contacto],
      ['Telefone M-Pesa', pagamento.telefone || 'N/A'],
    ],
    theme: 'grid',
    headStyles: { 
      fillColor: [46, 204, 113], 
      textColor: 255,
      fontSize: 10,
      fontStyle: 'bold'
    },
    styles: { fontSize: 9, cellPadding: 3 },
  });
  
  // Comprovante de Transferência (se aplicável)
  if (pagamento.metodoPagamento === 'transferencia' && pagamento.transferencias.length > 0) {
    yPos = doc.lastAutoTable?.finalY || yPos;
    yPos += 10;
    doc.setFontSize(14);
    doc.text('COMPROVANTE DE TRANSFERÊNCIA', margin, yPos);
    yPos += 8;
    
    const transferencia = pagamento.transferencias[0];
    autoTable(doc, {
      startY: yPos,
      margin: { left: margin, right: margin },
      head: [['Campo', 'Informação']],
      body: [
        ['Referência', transferencia.referencia || 'N/A'],
        ['Status', transferencia.status],
        ['Data de Upload', format(new Date(transferencia.createdAt), "dd/MM/yyyy HH:mm", { locale: pt })],
        ['URL da Imagem', transferencia.imageUrl || 'N/A'],
      ],
      theme: 'grid',
      headStyles: { 
        fillColor: [155, 89, 182], 
        textColor: 255,
        fontSize: 10,
        fontStyle: 'bold'
      },
      styles: { fontSize: 9, cellPadding: 3 },
    });
  }
  
  // Rodapé
  yPos = doc.lastAutoTable?.finalY || yPos;
  yPos += 15;
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('Documento gerado automaticamente pelo sistema POLITEC', pageWidth / 2, yPos, { align: 'center' });
  yPos += 4;
  doc.text('Este comprovante é válido apenas para fins administrativos', pageWidth / 2, yPos, { align: 'center' });
  
  // Salvar PDF
  const nomeArquivo = `pagamento_${pagamento.referencia}_${format(new Date(), 'yyyy-MM-dd')}.pdf`;
  doc.save(nomeArquivo);
}

// Exportar lista completa de pagamentos
export function exportarPagamentosPDF(pagamentos: Pagamento[], filtros?: {
  metodo?: string;
  status?: string;
  search?: string;
}) {
  const doc = new jsPDF('landscape');
  
  // Configurações
  const pageWidth = doc.internal.pageSize.width;
  const margin = 15;
  
  // Cabeçalho
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 139);
  doc.text('POLITEC - Relatório de Pagamentos', pageWidth / 2, margin, { align: 'center' });
  
  doc.setFontSize(20);
  doc.setTextColor(0, 0, 0);
  doc.text('RELATÓRIO COMPLETO DE PAGAMENTOS', pageWidth / 2, margin + 10, { align: 'center' });
  
  // Informações do relatório
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text(`Data de geração: ${format(new Date(), "dd/MM/yyyy HH:mm", { locale: pt })}`, margin, margin + 25);
  
  if (filtros?.metodo && filtros.metodo !== 'all') {
    doc.text(`Método: ${filtros.metodo === 'mpesa' ? 'M-Pesa' : 'Transferência'}`, margin, margin + 32);
  }
  
  if (filtros?.status && filtros.status !== 'all') {
    doc.text(`Status: ${filtros.status}`, margin, margin + 39);
  }
  
  if (filtros?.search) {
    doc.text(`Busca: "${filtros.search}"`, margin, margin + 46);
  }
  
  // Linha decorativa
  doc.setDrawColor(0, 0, 139);
  doc.setLineWidth(0.5);
  doc.line(margin, margin + 50, pageWidth - margin, margin + 50);
  
  // Dados da tabela
  const headers = [
    ['Referência', 'Usuário', 'Método', 'Tipo', 'Valor (MT)', 'Status', 'Data', 'Telefone']
  ];
  
  const data = pagamentos.map(pagamento => [
    pagamento.referencia,
    `${pagamento.user.nome} ${pagamento.user.apelido}`,
    pagamento.metodoPagamento === 'mpesa' ? 'M-Pesa' : 'Transferência',
    pagamento.itemNome === 'inscricao' ? 'Inscrição' : pagamento.itemNome === 'mensalidade' ? 'Mensalidade' : 'Curso',
    Number(pagamento.valor).toLocaleString("pt-MZ"),
    pagamento.status,
    format(new Date(pagamento.dataPagamento), "dd/MM/yyyy HH:mm", { locale: pt }),
    pagamento.telefone || 'N/A'
  ]);
  
  // Tabela principal
  autoTable(doc, {
    startY: margin + 55,
    margin: { left: margin, right: margin },
    head: headers,
    body: data,
    theme: 'grid',
    headStyles: { 
      fillColor: [41, 128, 185], 
      textColor: 255,
      fontSize: 9,
      fontStyle: 'bold',
      cellPadding: 3
    },
    bodyStyles: { fontSize: 8, cellPadding: 2 },
    styles: { lineWidth: 0.1, lineColor: [200, 200, 200] },
    columnStyles: {
      0: { cellWidth: 35 },
      1: { cellWidth: 40 },
      2: { cellWidth: 25 },
      3: { cellWidth: 25 },
      4: { cellWidth: 25, halign: 'right' },
      5: { cellWidth: 25 },
      6: { cellWidth: 30 },
      7: { cellWidth: 25 }
    },
  });
  
  // Estatísticas
  const finalY = doc.lastAutoTable?.finalY || margin + 55;
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  
  const total = pagamentos.length;
  const confirmados = pagamentos.filter(p => p.status === 'confirmado').length;
  const pendentes = pagamentos.filter(p => p.status === 'pendente' || p.status === 'processando').length;
  const falhados = pagamentos.filter(p => p.status === 'falhou').length;
  
  const totalValor = pagamentos
    .filter(p => p.status === 'confirmado')
    .reduce((sum, p) => sum + Number(p.valor), 0);
  
  doc.text(`Total de pagamentos: ${total}`, margin, finalY + 15);
  doc.text(`Confirmados: ${confirmados}`, margin + 60, finalY + 15);
  doc.text(`Pendentes: ${pendentes}`, margin + 120, finalY + 15);
  doc.text(`Falhados: ${falhados}`, margin + 180, finalY + 15);
  doc.text(`Valor total confirmado: ${totalValor.toLocaleString("pt-MZ")} MT`, margin, finalY + 25);
  
  // Salvar PDF
  const nomeArquivo = `relatorio_pagamentos_${format(new Date(), 'yyyy-MM-dd_HH-mm')}.pdf`;
  doc.save(nomeArquivo);
}

// Exportar para CSV
export function exportarPagamentosCSV(pagamentos: Pagamento[]) {
  // Cabeçalhos
  const headers = [
    'Referência',
    'Usuário',
    'Email',
    'Contacto',
    'Método',
    'Tipo',
    'Valor (MT)',
    'Status',
    'Data Pagamento',
    'Telefone',
    'ID Pagamento',
    'ID Usuário'
  ];
  
  // Dados
  const data = pagamentos.map(pagamento => [
    `"${pagamento.referencia}"`,
    `"${pagamento.user.nome} ${pagamento.user.apelido}"`,
    `"${pagamento.user.email}"`,
    `"${pagamento.user.contacto}"`,
    pagamento.metodoPagamento === 'mpesa' ? 'M-Pesa' : 'Transferência',
    pagamento.itemNome === 'inscricao' ? 'Inscrição' : pagamento.itemNome === 'mensalidade' ? 'Mensalidade' : 'Curso',
    Number(pagamento.valor).toLocaleString("pt-MZ"),
    pagamento.status,
    format(new Date(pagamento.dataPagamento), "dd/MM/yyyy HH:mm", { locale: pt }),
    pagamento.telefone || '',
    pagamento.id,
    pagamento.user.id
  ]);
  
  // Criar CSV
  const csvContent = [
    headers.join(','),
    ...data.map(row => row.join(','))
  ].join('\n');
  
  // Criar blob e download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `pagamentos_${format(new Date(), 'yyyy-MM-dd')}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}