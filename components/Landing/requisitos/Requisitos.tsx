'use client';

import { FileText, UserCheck, CreditCard, BookOpen, Camera, IdCard, Building, CheckCircle } from 'lucide-react';

export default function Requisitos() {
  const documentos = [
    {
      icon: <IdCard className="w-6 h-6" />,
      title: "Documento de Identificação",
      description: "BI ou passaporte válido (original e cópia)",
      obrigatorio: true
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Certificado de Habilitações",
      description: "9º, 10º ou 12º ano (original e cópia autenticada)",
      obrigatorio: true
    },
    {
      icon: <Camera className="w-6 h-6" />,
      title: "Fotografias",
      description: "2 fotografias tipo passe, actualizadas",
      obrigatorio: true
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "NUIT",
      description: "Documento do Número Único de Identificação Tributária",
      obrigatorio: true
    }
    // {
    //   icon: <CreditCard className="w-6 h-6" />,
    //   title: "Comprovativo de Pagamento",
    //   description: "Recibo de pagamento da taxa de inscrição/matrícula",
    //   obrigatorio: true
    // },
    // {
    //   icon: <UserCheck className="w-6 h-6" />,
    //   title: "Formulário Preenchido",
    //   description: "Formulário de inscrição devidamente assinado",
    //   obrigatorio: true
    // }
  ];

  const taxas = [
    { item: "Inscrição", valor: "1.470 MT" },
    { item: "Matrícula", valor: "1.050 MT" },
    { item: "Manual do Curso", valor: "1.050 MT" },
    { item: "Taxa de Exame", valor: "1.365 MT" },
    // { item: "Camisete (Completo)", valor: "2.570 MT" },
    { item: "Cartão de Estudante", valor: "210.00 MT" }
  ];

  return (
    <section className="py-16 bg-blue-100 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-700 mb-4">
            Requisitos de <span className="bg-gradient-to-r from-brand-main to-brand-lime bg-clip-text text-transparent">Inscrição</span>
          </h2>
          
          <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto">
            Toda a documentação necessária para efetuar a sua matrícula com sucesso
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Documentos */}
          <div>
            <h3 className="text-2xl font-bold text-gray-700 mb-6 flex items-center gap-3">
              <FileText className="w-8 h-8 text-brand-main" />
              Documentação Exigida
            </h3>
            
            <div className="space-y-4">
              {documentos.map((doc, index) => (
                <div 
                  key={index}
                  className="bg-gray-50 rounded-xl p-5 hover:bg-gradient-to-r hover:from-brand-main/5 hover:to-brand-lime/5 transition-all duration-300 border border-gray-200 hover:border-brand-main/30"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${doc.obrigatorio ? 'bg-brand-main/10 text-brand-main' : 'bg-gray-100 text-gray-500'}`}>
                      {doc.icon}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-gray-700">{doc.title}</h4>
                        {doc.obrigatorio && (
                          <span className="text-xs bg-brand-main/10 text-brand-main px-2 py-1 rounded-full">
                            Obrigatório
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm">{doc.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Taxas e Pagamentos */}
          <div className="space-y-8">
            {/* Taxas */}
            <div>
              <h3 className="text-2xl font-bold text-gray-700 mb-6 flex items-center gap-3">
                <CreditCard className="w-8 h-8 text-brand-main" />
                Taxas e Valores
              </h3>
              
              <div className="bg-gradient-to-br from-brand-main/5 to-brand-lime/5 rounded-2xl p-6 border border-brand-main/20">
                <div className="space-y-3">
                  {taxas.map((taxa, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                      <span className="text-gray-700">{taxa.item}</span>
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-blue-100 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-brand-main/60" />
                    </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 pt-4 border-t border-gray-300">
                  <div className="flex justify-between items-center">
                  </div>
                  <p className="text-sm text-gray-500 mt-2">*Aplica-se IVA de 5% em todos os valores</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}