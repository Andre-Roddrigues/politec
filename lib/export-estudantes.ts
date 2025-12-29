// lib/utils/export-estudantes.ts
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { Estudante } from './listar-estudantes';

// Tipos para corrigir os problemas do autoTable
declare module 'jspdf' {
  interface jsPDF {
    lastAutoTable?: {
      finalY: number;
    };
    autoTable: (options: any) => void;
  }
}

export function exportarEstudantePDF(estudante: Estudante) {
  const doc = new jsPDF();
  
  // Configurações
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;
  
  // Logo/Instituição
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 139); // Azul escuro
  doc.text('POLITEC - Portal do Estudante', pageWidth / 2, margin - 5, { align: 'center' });
  
  // Título
  doc.setFontSize(20);
  doc.setTextColor(0, 0, 0);
  doc.text('FICHA DO ESTUDANTE', pageWidth / 2, margin + 10, { align: 'center' });
  
  // Data de geração
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Gerado em: ${format(new Date(), "dd/MM/yyyy HH:mm", { locale: pt })}`, pageWidth - margin, margin + 10, { align: 'right' });
  
  // Linha decorativa
  doc.setDrawColor(0, 0, 139);
  doc.setLineWidth(0.5);
  doc.line(margin, margin + 15, pageWidth - margin, margin + 15);
  
  // Dados do Estudante
  let yPos = margin + 25;
  
  // Informações Pessoais
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text('INFORMAÇÕES PESSOAIS', margin, yPos);
  yPos += 8;
  
  doc.setFontSize(10);
  
  // Tabela 1: Informações Pessoais
  autoTable(doc, {
    startY: yPos,
    margin: { left: margin, right: margin },
    head: [['Campo', 'Informação']],
    body: [
      ['Nome Completo', `${estudante.user.nome} ${estudante.user.apelido}`],
      ['Email', estudante.user.email],
      ['Contacto', estudante.user.contacto],
      ['ID do Estudante', estudante.id],
      ['Data de Inscrição', format(new Date(estudante.createdAt), "dd/MM/yyyy HH:mm", { locale: pt })],
    ],
    theme: 'grid',
    headStyles: { 
      fillColor: [41, 128, 185], 
      textColor: 255,
      fontSize: 10,
      fontStyle: 'bold'
    },
    bodyStyles: { fontSize: 9 },
    styles: { 
      cellPadding: 3,
      lineWidth: 0.1,
      lineColor: [200, 200, 200]
    },
    columnStyles: {
      0: { cellWidth: 45, fontStyle: 'bold' },
      1: { cellWidth: 'auto' }
    }
  });
  
  // Informações do Curso
  yPos = doc.lastAutoTable?.finalY || margin + 25;
  yPos += 10;
  doc.setFontSize(14);
  doc.text('INFORMAÇÕES DO CURSO', margin, yPos);
  yPos += 8;
  
  // Tabela 2: Informações do Curso
  autoTable(doc, {
    startY: yPos,
    margin: { left: margin, right: margin },
    head: [['Campo', 'Informação']],
    body: [
      ['Curso', estudante.cursoHorario.curso.nome],
      ['Período', estudante.cursoHorario.horario.periodo],
      ['Horário', estudante.cursoHorario.horario.hora],
      ['ID do Curso', estudante.cursoHorario.curso.id],
      ['ID do Horário', estudante.cursoHorario.horario.id],
    ],
    theme: 'grid',
    headStyles: { 
      fillColor: [46, 204, 113], 
      textColor: 255,
      fontSize: 10,
      fontStyle: 'bold'
    },
    bodyStyles: { fontSize: 9 },
    styles: { 
      cellPadding: 3,
      lineWidth: 0.1,
      lineColor: [200, 200, 200]
    },
    columnStyles: {
      0: { cellWidth: 40, fontStyle: 'bold' },
      1: { cellWidth: 'auto' }
    }
  });
  
  // Valores
  yPos = doc.lastAutoTable?.finalY || yPos;
  yPos += 10;
  doc.setFontSize(14);
  doc.text('VALORES E PAGAMENTOS', margin, yPos);
  yPos += 8;
  
  const valores = [
    ['Taxa de Inscrição', `${Number(estudante.cursoHorario.inscricao).toLocaleString("pt-MZ")} MT`],
    ['Mensalidade', `${Number(estudante.cursoHorario.mensalidade).toLocaleString("pt-MZ")} MT`],
    ['Status da Mensalidade', estudante.mensalidadePaga ? 'Paga' : 'Pendente'],
    ['Status da Inscrição', estudante.status],
    ['Total Estimado (12 meses)', `${(Number(estudante.cursoHorario.inscricao) + (Number(estudante.cursoHorario.mensalidade) * 12)).toLocaleString("pt-MZ")} MT`],
  ];
  
  // Tabela 3: Valores
  autoTable(doc, {
    startY: yPos,
    margin: { left: margin, right: margin },
    head: [['Descrição', 'Valor']],
    body: valores,
    theme: 'grid',
    headStyles: { 
      fillColor: [155, 89, 182], 
      textColor: 255,
      fontSize: 10,
      fontStyle: 'bold'
    },
    bodyStyles: { fontSize: 9 },
    styles: { 
      cellPadding: 3,
      lineWidth: 0.1,
      lineColor: [200, 200, 200]
    },
    columnStyles: {
      0: { cellWidth: 60, fontStyle: 'bold' },
      1: { 
        cellWidth: 40, 
        halign: 'right', 
        fontStyle: 'bold',
        textColor: [41, 128, 185]
      }
    }
  });
  
  // Status visual
  yPos = doc.lastAutoTable?.finalY || yPos;
  yPos += 15;
  doc.setFontSize(14);
  doc.text('STATUS DA INSCRIÇÃO', margin, yPos);
  yPos += 8;
  
  const statusText = estudante.status === 'aprovado' ? 'APROVADO' : 
                    estudante.status === 'pendente' ? 'PENDENTE' : 'REJEITADO';
  
  // Definir cores baseadas no status
  let statusColor: [number, number, number];
  if (estudante.status === 'aprovado') {
    statusColor = [46, 204, 113]; // Verde
  } else if (estudante.status === 'pendente') {
    statusColor = [241, 196, 15]; // Amarelo
  } else {
    statusColor = [231, 76, 60]; // Vermelho
  }
  
  // Tabela simples para o status
  autoTable(doc, {
    startY: yPos,
    margin: { left: margin, right: margin },
    body: [[statusText]],
    theme: 'plain',
    bodyStyles: { 
      fillColor: statusColor,
      textColor: 255,
      fontSize: 12,
      fontStyle: 'bold',
      halign: 'center',
      cellPadding: 8,
      lineWidth: 0,
      lineColor: statusColor
    },
    styles: {
      cellWidth: 'wrap'
    }
  });
  
  // Rodapé
  yPos = doc.lastAutoTable?.finalY || yPos;
  yPos += 15;
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  
  yPos += 10;
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('Documento gerado automaticamente pelo sistema POLITEC', pageWidth / 2, yPos, { align: 'center' });
  yPos += 4;
  doc.text('Este documento é válido apenas para fins administrativos internos', pageWidth / 2, yPos, { align: 'center' });
  yPos += 4;
  doc.text(`Página 1 de 1`, pageWidth / 2, yPos, { align: 'center' });
  
  // Salvar PDF com nome amigável
  const nomeArquivo = `estudante_${estudante.user.nome.replace(/\s+/g, '_')}_${estudante.user.apelido.replace(/\s+/g, '_')}_${format(new Date(), 'yyyy-MM-dd')}.pdf`;
  doc.save(nomeArquivo);
}

export function exportarListaCompletaPDF(estudantes: Estudante[], filtros?: {
  search?: string;
  status?: string;
  cursoId?: string;
}) {
  const doc = new jsPDF('landscape');
  
  // Configurações
  const pageWidth = doc.internal.pageSize.width;
  const margin = 15;
  
  // Cabeçalho
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 139);
  doc.text('POLITEC - Portal do Estudante', pageWidth / 2, margin, { align: 'center' });
  
  doc.setFontSize(20);
  doc.setTextColor(0, 0, 0);
  doc.text('RELATÓRIO COMPLETO DE ESTUDANTES', pageWidth / 2, margin + 10, { align: 'center' });
  
  // Informações do relatório
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  
  const dataGeracao = format(new Date(), "dd/MM/yyyy HH:mm", { locale: pt });
  doc.text(`Data de geração: ${dataGeracao}`, margin, margin + 25);
  
  if (filtros?.search) {
    doc.text(`Busca: "${filtros.search}"`, margin, margin + 32);
  }
  
  if (filtros?.status && filtros.status !== 'all') {
    doc.text(`Status: ${filtros.status}`, margin, margin + 39);
  }
  
  if (filtros?.cursoId && filtros.cursoId !== 'all') {
    const cursoNome = estudantes.length > 0 ? 
      estudantes[0].cursoHorario.curso.nome : filtros.cursoId;
    doc.text(`Curso: ${cursoNome}`, margin, margin + 46);
  }
  
  // Linha decorativa
  doc.setDrawColor(0, 0, 139);
  doc.setLineWidth(0.5);
  doc.line(margin, margin + 50, pageWidth - margin, margin + 50);
  
  // Dados da tabela
  const headers = [
    ['Nome Completo', 'Email', 'Contacto', 'Curso', 'Período', 'Status', 'Mensalidade', 'Data Inscrição']
  ];
  
  const data = estudantes.map(estudante => [
    `${estudante.user.nome} ${estudante.user.apelido}`,
    estudante.user.email,
    estudante.user.contacto,
    estudante.cursoHorario.curso.nome,
    estudante.cursoHorario.horario.periodo,
    estudante.status,
    estudante.mensalidadePaga ? 'Paga' : 'Pendente',
    format(new Date(estudante.createdAt), "dd/MM/yyyy", { locale: pt })
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
    bodyStyles: { 
      fontSize: 8,
      cellPadding: 2
    },
    styles: { 
      lineWidth: 0.1,
      lineColor: [200, 200, 200]
    },
    columnStyles: {
      0: { cellWidth: 35, fontStyle: 'bold' },
      1: { cellWidth: 40 },
      2: { cellWidth: 20 },
      3: { cellWidth: 45 },
      4: { cellWidth: 25 },
      5: { cellWidth: 20 },
      6: { cellWidth: 20 },
      7: { cellWidth: 20 }
    },
    didDrawPage: (data) => {
      // Número da página
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      const pageCount = doc.getNumberOfPages();
      doc.text(`Página ${data.pageNumber} de ${pageCount}`, pageWidth / 2, doc.internal.pageSize.height - 10, { align: 'center' });
    }
  });
  
  // Resumo
  const finalY = doc.lastAutoTable?.finalY || margin + 55;
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  
  const total = estudantes.length;
  const aprovados = estudantes.filter(e => e.status === 'aprovado').length;
  const pendentes = estudantes.filter(e => e.status === 'pendente').length;
  const rejeitados = estudantes.filter(e => e.status === 'rejeitado').length;
  
  doc.text(`Total de estudantes: ${total}`, margin, finalY + 15);
  doc.text(`Aprovados: ${aprovados}`, margin + 50, finalY + 15);
  doc.text(`Pendentes: ${pendentes}`, margin + 100, finalY + 15);
  doc.text(`Rejeitados: ${rejeitados}`, margin + 150, finalY + 15);
  
  // Calcular valores totais
  const totalInscricao = estudantes.reduce((sum, e) => sum + Number(e.cursoHorario.inscricao), 0);
  const totalMensalidade = estudantes.reduce((sum, e) => sum + Number(e.cursoHorario.mensalidade), 0);
  const totalEstimado = totalInscricao + (totalMensalidade * 12);
  
  doc.text(`Valor total de inscrições: ${totalInscricao.toLocaleString("pt-MZ")} MT`, margin, finalY + 25);
  doc.text(`Valor total mensal (estimado): ${totalMensalidade.toLocaleString("pt-MZ")} MT`, margin + 80, finalY + 25);
  doc.text(`Total estimado (12 meses): ${totalEstimado.toLocaleString("pt-MZ")} MT`, margin + 170, finalY + 25);
  
  // Assinatura
  doc.setFontSize(9);
  doc.setTextColor(150, 150, 150);
  doc.text('_________________________________', margin, finalY + 45);
  doc.text('Assinatura do Responsável', margin, finalY + 52);
  doc.text(format(new Date(), "dd/MM/yyyy", { locale: pt }), margin, finalY + 57);
  
  // Salvar PDF
  const nomeArquivo = `relatorio_estudantes_${format(new Date(), 'yyyy-MM-dd_HH-mm')}.pdf`;
  doc.save(nomeArquivo);
}

// Função para exportar em Excel (CSV)
export function exportarEstudantesCSV(estudantes: Estudante[]) {
  // Cabeçalhos
  const headers = [
    'Nome Completo',
    'Email', 
    'Contacto',
    'Curso',
    'Período',
    'Horário',
    'Taxa de Inscrição (MT)',
    'Mensalidade (MT)',
    'Status Inscrição',
    'Mensalidade Paga',
    'Data Inscrição',
    'ID Estudante'
  ];
  
  // Dados
  const data = estudantes.map(estudante => [
    `"${estudante.user.nome} ${estudante.user.apelido}"`,
    `"${estudante.user.email}"`,
    `"${estudante.user.contacto}"`,
    `"${estudante.cursoHorario.curso.nome}"`,
    `"${estudante.cursoHorario.horario.periodo}"`,
    `"${estudante.cursoHorario.horario.hora}"`,
    Number(estudante.cursoHorario.inscricao).toLocaleString("pt-MZ"),
    Number(estudante.cursoHorario.mensalidade).toLocaleString("pt-MZ"),
    estudante.status,
    estudante.mensalidadePaga ? 'Sim' : 'Não',
    format(new Date(estudante.createdAt), "dd/MM/yyyy HH:mm", { locale: pt }),
    estudante.id
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
  link.setAttribute('download', `estudantes_${format(new Date(), 'yyyy-MM-dd')}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Função para exportar múltiplos estudantes em PDF individual
export function exportarEstudantesMultiplosPDF(estudantes: Estudante[]) {
  estudantes.forEach((estudante, index) => {
    setTimeout(() => {
      exportarEstudantePDF(estudante);
    }, index * 1000); // Delay de 1 segundo entre cada exportação
  });
}