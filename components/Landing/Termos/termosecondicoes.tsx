"use client";

import React from "react";
import { 
  FileText, 
  CheckCircle, 
  Users, 
  GraduationCap, 
  CreditCard, 
  Shield, 
  Briefcase,
  Clock,
  Award,
  Building,
  Mail,
  Phone,
  MapPin
} from "lucide-react";

const TermosCondicoes = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-brand-main/10 rounded-full flex items-center justify-center">
              <FileText className="w-8 h-8 text-brand-main" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Termos e Condições
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Regulamento do PROMET - Programa de Melhoria de Empregabilidade e Trabalho
          </p>
          <div className="mt-4 bg-white dark:bg-gray-800 rounded-lg p-3 inline-block">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>
          </div>
        </div>

        {/* Informações da Unitec */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 border-l-4 border-brand-main">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                Unitec Moçambique, Lda.
              </h2>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>promet@unitec.ac.mz</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>WhatsApp: 83 430 3184 | Chamadas: 87 008 8787</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>Av. Salvador Allende Nr. 60, Maputo</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span>NUIT: 401522050</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Conteúdo dos Termos */}
        <div className="space-y-6">
          {/* Artigo 1 */}
          <section className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                  Artigo 1. Disposições Gerais
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  O presente Regulamento define as normas e condições para participação no PROMET – 
                  Programa de Melhoria de Empregabilidade e Trabalho, um programa desenvolvido pela 
                  Unitec Moçambique, Lda., através da Unitec Academy, com o objetivo de capacitar 
                  jovens e adultos em áreas de alta demanda e facilitar a sua inserção no mercado de trabalho.
                </p>
              </div>
            </div>
          </section>

          {/* Artigo 2 */}
          <section className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                  Artigo 2. Critérios de Elegibilidade
                </h2>
                <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span><strong>Idade:</strong> 18 a 35 anos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span><strong>Nível académico:</strong> não há exigência mínima</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span><strong>Nacionalidade:</strong> aberto a moçambicanos e estrangeiros residentes em Moçambique</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span><strong>Não há preferência</strong> de género ou grupo prioritário</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Artigo 3 */}
          <section className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <GraduationCap className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                  Artigo 3. Formação e Avaliação
                </h2>
                <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">•</span>
                    <span><strong>Metodologia:</strong> presencial em Maputo</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">•</span>
                    <span><strong>Duração:</strong> 30 dias, com carga horária de 3h por dia, de segunda a sexta-feira</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">•</span>
                    <span><strong>Frequência mínima:</strong> 70% para a conclusão com aproveitamento</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">•</span>
                    <span><strong>Não há reprovação;</strong> a frequência final será exibida no perfil do candidato</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Artigo 4 */}
          <section className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <Award className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                  Artigo 4. Teste de Diagnóstico
                </h2>
                <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-500 mt-1">•</span>
                    <span><strong>Formato:</strong> online</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-500 mt-1">•</span>
                    <span><strong>Percentagem mínima para aprovação:</strong> 50%</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-500 mt-1">•</span>
                    <span><strong>Limite:</strong> duas tentativas por curso. Caso reprove, deverá pagar nova taxa de 500 MT para repetir o teste em nova edição</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-500 mt-1">•</span>
                    <span><strong>Isenção:</strong> O teste é obrigatório para todos os candidatos, exceto para formandos e ex-formandos da Unitec, devendo para isso carregar o certificado ou declaração de frequência no perfil</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Artigo 5 */}
          <section className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <CreditCard className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                  Artigo 5. Pagamentos e Reembolsos
                </h2>
                <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span><strong>Meios de pagamento:</strong> M-Pesa (com API automática), eMola e transferência bancária (com envio de comprovativo)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span><strong>Taxa de teste de diagnóstico:</strong> 500 MT (não reembolsável)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span><strong>Taxa da formação intensiva:</strong> 2.500 MT</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span><strong>Emissão de 2ª via de certificado físico:</strong> 1.500 MT (certificado digital sempre disponível no perfil do formando)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span><strong>Reembolsos:</strong> apenas possíveis se houver descumprimento por parte da Unitec e solicitados até 7 dias após o início da formação</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Artigo 6 */}
          <section className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                  Artigo 6. Direitos e Responsabilidades do Candidato
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-white mb-3">Obrigações:</h3>
                    <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                      <li className="flex items-start gap-2">
                        <span className="text-indigo-500 mt-1">•</span>
                        <span>Pontualidade</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-indigo-500 mt-1">•</span>
                        <span>Disciplina</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-indigo-500 mt-1">•</span>
                        <span>Preservação de equipamentos</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-indigo-500 mt-1">•</span>
                        <span>Respeito mútuo</span>
                      </li>
                    </ul>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      <strong>Consequências:</strong> o incumprimento destas obrigações pode levar à exclusão do PROMET
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-white mb-3">Direitos:</h3>
                    <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        <span>Acesso à formação</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        <span>Workshop</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        <span>Certificado</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        <span>Currículo profissional</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        <span>Encaminhamento para empresas parceiras</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Artigo 7 */}
          <section className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <Briefcase className="w-6 h-6 text-teal-600 dark:text-teal-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                  Artigo 7. Estágios e Empregos
                </h2>
                <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="text-teal-500 mt-1">•</span>
                    <span><strong>Seleção:</strong> A seleção para vagas de estágio é responsabilidade das empresas parceiras</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-500 mt-1">•</span>
                    <span><strong>Duração:</strong> A duração típica dos estágios garantidos é de 90 dias</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-500 mt-1">•</span>
                    <span><strong>Base de talentos:</strong> Após o curso, o candidato continua na base de talentos e pode ser encaminhado a novas oportunidades de estágio ou emprego</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Artigo 8 */}
          <section className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                  Artigo 8. Proteção de Dados e Uso de Imagem
                </h2>
                <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1">•</span>
                    <span><strong>Uso de imagem:</strong> Todos os participantes autorizam o uso de sua imagem em materiais de divulgação do PROMET</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1">•</span>
                    <span><strong>Confidencialidade:</strong> Os dados pessoais não serão partilhados com empresas não parceiras e serão tratados com confidencialidade</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Artigo 9 */}
          <section className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                <Building className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                  Artigo 9. Casos Omissos e Foro Legal
                </h2>
                <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="text-gray-500 mt-1">•</span>
                    <span><strong>Casos omissos:</strong> Os casos não previstos neste regulamento serão resolvidos pela Direção da Unitec</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-500 mt-1">•</span>
                    <span><strong>Foro legal:</strong> O foro jurídico para eventuais litígios será a cidade de Maputo</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Aceitação */}
          <section className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
            <div className="text-center">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-green-800 dark:text-green-300 mb-2">
                Aceitação dos Termos e Condições
              </h3>
              <p className="text-green-700 dark:text-green-400">
                Ao candidatar-se a qualquer curso do PROMET, o candidato declara ter lido, 
                compreendido e aceito integralmente todos os termos e condições estabelecidos 
                neste regulamento.
              </p>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            © {new Date().getFullYear()} Unitec Moçambique, Lda. - PROMET Program. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermosCondicoes;