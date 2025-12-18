import React, { useState } from 'react';
import { 
  User, 
  GraduationCap, 
  Briefcase, 
  Languages, 
  Award,
  ChevronRight,
  Save,
  Plus,
  Trash2,
  Edit2,
  CheckCircle
} from 'lucide-react';

export default function GraduationForm() {
  const [activeTab, setActiveTab] = useState(0);
  const [completedTabs, setCompletedTabs] = useState<number[]>([]);
  
  // Estados para Dados Pessoais
  const [personalData, setPersonalData] = useState({
    provincia: '',
    morada: '',
    dataNascimento: '',
    numeroBi: '',
    nivelAcademico: '',
    contacto: '',
    whatsapp: '',
    tipoDocumento: '',
    genero: '',
    idiomaNativo: '',
    isFromUnitec: false
  });

  // Estados para Formações
  const [formations, setFormations] = useState<Array<{
    id: number;
    local: string;
    nome: string;
    descricao: string;
    duracao: string;
    dataInicio: string;
    dataFim: string;
  }>>([]);
  const [formationForm, setFormationForm] = useState({
    local: '',
    nome: '',
    descricao: '',
    duracao: '',
    dataInicio: '',
    dataFim: ''
  });

  // Estados para Experiências
  const [experiences, setExperiences] = useState<Array<{
    id: number;
    organizacao: string;
    cargo: string;
    descricao: string;
    dataInicio: string;
    dataFim: string;
  }>>([]);
  const [experienceForm, setExperienceForm] = useState({
    organizacao: '',
    cargo: '',
    descricao: '',
    dataInicio: '',
    dataFim: ''
  });

  // Estados para Idiomas
  const [languages, setLanguages] = useState<Array<{ id: number; idIdioma: string; fluencia: string }>>([]);
  const [languageForm, setLanguageForm] = useState({
    idIdioma: '',
    fluencia: ''
  });

  const tabs = [
    { id: 0, name: 'Dados Pessoais', icon: User },
    { id: 1, name: 'Formação', icon: GraduationCap },
    { id: 2, name: 'Experiência', icon: Briefcase },
    { id: 3, name: 'Idiomas', icon: Languages },
    { id: 4, name: 'Certificados', icon: Award }
  ];

  const markTabComplete = (tabId: number) => {
    if (!completedTabs.includes(tabId)) {
      setCompletedTabs([...completedTabs, tabId]);
    }
  };

  const handleNextTab = () => {
    markTabComplete(activeTab);
    if (activeTab < tabs.length - 1) {
      setActiveTab(activeTab + 1);
    }
  };

  // Handlers para Formação
  const addFormation = () => {
    if (formationForm.local && formationForm.nome && formationForm.dataInicio) {
      setFormations([...formations, { ...formationForm, id: Date.now() }]);
      setFormationForm({
        local: '',
        nome: '',
        descricao: '',
        duracao: '',
        dataInicio: '',
        dataFim: ''
      });
    }
  };

  const removeFormation = (id: number) => {
    setFormations(formations.filter(f => f.id !== id));
  };

  // Handlers para Experiência
  const addExperience = () => {
    if (experienceForm.organizacao && experienceForm.cargo && experienceForm.dataInicio) {
      setExperiences([...experiences, { ...experienceForm, id: Date.now() }]);
      setExperienceForm({
        organizacao: '',
        cargo: '',
        descricao: '',
        dataInicio: '',
        dataFim: ''
      });
    }
  };

  const removeExperience = (id: number) => {
    setExperiences(experiences.filter(e => e.id !== id));
  };

  // Handlers para Idiomas
  const addLanguage = () => {
    if (languageForm.idIdioma && languageForm.fluencia) {
      setLanguages([...languages, { ...languageForm, id: Date.now() }]);
      setLanguageForm({ idIdioma: '', fluencia: '' });
    }
  };

  const removeLanguage = (id: number) => {
    setLanguages(languages.filter(l => l.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[var(--brand-main)] to-[var(--brand-lime)] bg-clip-text text-transparent mb-2">
            Complete seu Perfil
          </h1>
          <p className="text-gray-600">Preencha suas informações para oportunidades incríveis</p>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white rounded-2xl shadow-lg mb-6 p-4">
          <div className="flex overflow-x-auto gap-2 pb-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              const isCompleted = completedTabs.includes(tab.id);
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-gradient-to-r from-[var(--brand-main)] to-[var(--brand-lime)] text-white shadow-lg scale-105'
                      : isCompleted
                      ? 'bg-green-50 text-green-600 hover:bg-green-100'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={20} />
                  <span>{tab.name}</span>
                  {isCompleted && !isActive && <CheckCircle size={16} />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Tab 0: Dados Pessoais */}
          {activeTab === 0 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Dados Pessoais</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Província</label>
                  <input
                    type="text"
                    value={personalData.provincia}
                    onChange={(e) => setPersonalData({...personalData, provincia: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-main)] focus:border-transparent"
                    placeholder="Ex: Maputo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Morada</label>
                  <input
                    type="text"
                    value={personalData.morada}
                    onChange={(e) => setPersonalData({...personalData, morada: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-main)] focus:border-transparent"
                    placeholder="Endereço completo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Data de Nascimento</label>
                  <input
                    type="date"
                    value={personalData.dataNascimento}
                    onChange={(e) => setPersonalData({...personalData, dataNascimento: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-main)] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Documento</label>
                  <select
                    value={personalData.tipoDocumento}
                    onChange={(e) => setPersonalData({...personalData, tipoDocumento: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-main)] focus:border-transparent"
                  >
                    <option value="">Selecione</option>
                    <option value="BI">BI</option>
                    <option value="Passaporte">Passaporte</option>
                    <option value="DIRE">DIRE</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Número do BI</label>
                  <input
                    type="text"
                    value={personalData.numeroBi}
                    onChange={(e) => setPersonalData({...personalData, numeroBi: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-main)] focus:border-transparent"
                    placeholder="000000000X"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gênero</label>
                  <select
                    value={personalData.genero}
                    onChange={(e) => setPersonalData({...personalData, genero: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-main)] focus:border-transparent"
                  >
                    <option value="">Selecione</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Feminino">Feminino</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nível Acadêmico</label>
                  <select
                    value={personalData.nivelAcademico}
                    onChange={(e) => setPersonalData({...personalData, nivelAcademico: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-main)] focus:border-transparent"
                  >
                    <option value="">Selecione</option>
                    <option value="Ensino Básico">Ensino Básico</option>
                    <option value="Ensino Médio">Ensino Médio</option>
                    <option value="Licenciatura">Licenciatura</option>
                    <option value="Mestrado">Mestrado</option>
                    <option value="Doutorado">Doutorado</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contacto</label>
                  <input
                    type="tel"
                    value={personalData.contacto}
                    onChange={(e) => setPersonalData({...personalData, contacto: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-main)] focus:border-transparent"
                    placeholder="+258 84 000 0000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp</label>
                  <input
                    type="tel"
                    value={personalData.whatsapp}
                    onChange={(e) => setPersonalData({...personalData, whatsapp: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-main)] focus:border-transparent"
                    placeholder="+258 84 000 0000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Idioma Nativo</label>
                  <input
                    type="text"
                    value={personalData.idiomaNativo}
                    onChange={(e) => setPersonalData({...personalData, idiomaNativo: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-main)] focus:border-transparent"
                    placeholder="Ex: Português"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  id="isFromUnitec"
                  checked={personalData.isFromUnitec}
                  onChange={(e) => setPersonalData({...personalData, isFromUnitec: e.target.checked})}
                  className="w-5 h-5 text-[var(--brand-main)] rounded focus:ring-2 focus:ring-[var(--brand-main)]"
                />
                <label htmlFor="isFromUnitec" className="text-gray-700 font-medium">
                  Sou estudante da UNITEC
                </label>
              </div>
            </div>
          )}

          {/* Tab 1: Formação */}
          {activeTab === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Formação Acadêmica</h2>
              
              <div className="bg-gradient-to-r from-[var(--brand-main)]/10 to-[var(--brand-lime)]/10 p-6 rounded-xl mb-6">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Plus size={20} />
                  Adicionar Formação
                </h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={formationForm.local}
                    onChange={(e) => setFormationForm({...formationForm, local: e.target.value})}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-main)] focus:border-transparent"
                    placeholder="Instituição"
                  />
                  
                  <input
                    type="text"
                    value={formationForm.nome}
                    onChange={(e) => setFormationForm({...formationForm, nome: e.target.value})}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-main)] focus:border-transparent"
                    placeholder="Nome do Curso"
                  />
                  
                  <input
                    type="text"
                    value={formationForm.duracao}
                    onChange={(e) => setFormationForm({...formationForm, duracao: e.target.value})}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-main)] focus:border-transparent"
                    placeholder="Duração (ex: 4 anos)"
                  />
                  
                  <input
                    type="date"
                    value={formationForm.dataInicio}
                    onChange={(e) => setFormationForm({...formationForm, dataInicio: e.target.value})}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-main)] focus:border-transparent"
                    placeholder="Data Início"
                  />
                  
                  <input
                    type="date"
                    value={formationForm.dataFim}
                    onChange={(e) => setFormationForm({...formationForm, dataFim: e.target.value})}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-main)] focus:border-transparent"
                    placeholder="Data Fim"
                  />
                  
                  <textarea
                    value={formationForm.descricao}
                    onChange={(e) => setFormationForm({...formationForm, descricao: e.target.value})}
                    className="md:col-span-2 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-main)] focus:border-transparent"
                    placeholder="Descrição"
                    rows={3}
                  />
                </div>
                
                <button
                  onClick={addFormation}
                  className="mt-4 px-6 py-3 bg-gradient-to-r from-[var(--brand-main)] to-[var(--brand-lime)] text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <Plus size={20} />
                  Adicionar Formação
                </button>
              </div>

              {/* Lista de Formações */}
              <div className="space-y-4">
                {formations.map((formation) => (
                  <div key={formation.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-gray-800">{formation.nome}</h4>
                        <p className="text-sm text-gray-600">{formation.local}</p>
                        <p className="text-sm text-gray-500 mt-1">{formation.duracao} | {formation.dataInicio}</p>
                      </div>
                      <button
                        onClick={() => removeFormation(formation.id)}
                        className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 2: Experiência */}
          {activeTab === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Experiência Profissional</h2>
              
              <div className="bg-gradient-to-r from-[var(--brand-main)]/10 to-[var(--brand-lime)]/10 p-6 rounded-xl mb-6">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Plus size={20} />
                  Adicionar Experiência
                </h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={experienceForm.organizacao}
                    onChange={(e) => setExperienceForm({...experienceForm, organizacao: e.target.value})}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-main)] focus:border-transparent"
                    placeholder="Empresa/Organização"
                  />
                  
                  <input
                    type="text"
                    value={experienceForm.cargo}
                    onChange={(e) => setExperienceForm({...experienceForm, cargo: e.target.value})}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-main)] focus:border-transparent"
                    placeholder="Cargo"
                  />
                  
                  <input
                    type="date"
                    value={experienceForm.dataInicio}
                    onChange={(e) => setExperienceForm({...experienceForm, dataInicio: e.target.value})}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-main)] focus:border-transparent"
                  />
                  
                  <input
                    type="date"
                    value={experienceForm.dataFim}
                    onChange={(e) => setExperienceForm({...experienceForm, dataFim: e.target.value})}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-main)] focus:border-transparent"
                  />
                  
                  <textarea
                    value={experienceForm.descricao}
                    onChange={(e) => setExperienceForm({...experienceForm, descricao: e.target.value})}
                    className="md:col-span-2 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-main)] focus:border-transparent"
                    placeholder="Descrição das atividades"
                    rows={3}
                  />
                </div>
                
                <button
                  onClick={addExperience}
                  className="mt-4 px-6 py-3 bg-gradient-to-r from-[var(--brand-main)] to-[var(--brand-lime)] text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <Plus size={20} />
                  Adicionar Experiência
                </button>
              </div>

              <div className="space-y-4">
                {experiences.map((exp) => (
                  <div key={exp.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-gray-800">{exp.cargo}</h4>
                        <p className="text-sm text-gray-600">{exp.organizacao}</p>
                        <p className="text-sm text-gray-500 mt-1">{exp.dataInicio} - {exp.dataFim || 'Presente'}</p>
                      </div>
                      <button
                        onClick={() => removeExperience(exp.id)}
                        className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Idiomas */}
          {activeTab === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Idiomas</h2>
              
              <div className="bg-gradient-to-r from-[var(--brand-main)]/10 to-[var(--brand-lime)]/10 p-6 rounded-xl mb-6">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Plus size={20} />
                  Adicionar Idioma
                </h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={languageForm.idIdioma}
                    onChange={(e) => setLanguageForm({...languageForm, idIdioma: e.target.value})}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-main)] focus:border-transparent"
                    placeholder="Idioma (ex: Inglês)"
                  />
                  
                  <select
                    value={languageForm.fluencia}
                    onChange={(e) => setLanguageForm({...languageForm, fluencia: e.target.value})}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-main)] focus:border-transparent"
                  >
                    <option value="">Selecione a fluência</option>
                    <option value="Básico">Básico</option>
                    <option value="Intermediário">Intermediário</option>
                    <option value="Avançado">Avançado</option>
                    <option value="Fluente">Fluente</option>
                    <option value="Nativo">Nativo</option>
                  </select>
                </div>
                
                <button
                  onClick={addLanguage}
                  className="mt-4 px-6 py-3 bg-gradient-to-r from-[var(--brand-main)] to-[var(--brand-lime)] text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <Plus size={20} />
                  Adicionar Idioma
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {languages.map((lang) => (
                  <div key={lang.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold text-gray-800">{lang.idIdioma}</h4>
                      <p className="text-sm text-gray-600">{lang.fluencia}</p>
                    </div>
                    <button
                      onClick={() => removeLanguage(lang.id)}
                      className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 4: Certificados */}
          {activeTab === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Certificados</h2>
              
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-[var(--brand-main)] transition-all cursor-pointer">
                <Award size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 mb-2">Arraste seus certificados aqui ou clique para selecionar</p>
                <p className="text-sm text-gray-500">Formatos aceitos: PDF, JPG, PNG</p>
                <button className="mt-4 px-6 py-3 bg-gradient-to-r from-[var(--brand-main)] to-[var(--brand-lime)] text-white rounded-lg hover:shadow-lg transition-all">
                  Selecionar Arquivos
                </button>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={() => setActiveTab(Math.max(0, activeTab - 1))}
              disabled={activeTab === 0}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            
            {activeTab === tabs.length - 1 ? (
              <button
                onClick={() => {
                  markTabComplete(activeTab);
                  alert('Perfil completo! 🎉');
                }}
                className="px-8 py-3 bg-gradient-to-r from-[var(--brand-main)] to-[var(--brand-lime)] text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
              >
                <Save size={20} />
                Salvar Perfil
              </button>
            ) : (
              <button
                onClick={handleNextTab}
                className="px-6 py-3 bg-gradient-to-r from-[var(--brand-main)] to-[var(--brand-lime)] text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
              >
                Próximo
                <ChevronRight size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {completedTabs.length} de {tabs.length} seções completas
          </p>
          <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden max-w-md mx-auto">
            <div
              className="h-full bg-gradient-to-r from-[var(--brand-main)] to-[var(--brand-lime)] transition-all duration-500"
              style={{ width: `${(completedTabs.length / tabs.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}