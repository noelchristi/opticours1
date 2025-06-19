import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { aiService, exportService, emailService } from '../services/api';

/**
 * Analysis page component for OptiCours application
 * Shows the AI-generated analysis results for a specific course file
 */
const Analysis = () => {
  const { fileId } = useParams();
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('suggestions');
  const [email, setEmail] = useState('');
  const [emailSending, setEmailSending] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState(false);
  const [exportingPDF, setExportingPDF] = useState(false);
  const [exportingPPTX, setExportingPPTX] = useState(false);
  
  // List of available tabs
  const tabs = [
    { id: 'suggestions', label: 'Suggestions', icon: '💡' },
    { id: 'summary', label: 'Résumé', icon: '📝' },
    { id: 'quiz', label: 'QCM', icon: '❓' },
    { id: 'slides', label: 'Slides', icon: '📊' },
    { id: 'courseSheet', label: 'Fiche de cours', icon: '📚' },
    { id: 'tpSheet', label: 'Fiche TP', icon: '🧪' },
  ];

  useEffect(() => {
    const fetchAnalysisData = async () => {
      try {
        setLoading(true);
        // Get initial analysis data
        const analysisResult = await aiService.getAnalysisResults(fileId);
        
        if (!analysisResult) {
          throw new Error('Analyse non trouvée. Veuillez réessayer plus tard.');
        }

        setAnalysisData(analysisResult);

        // Generate missing analysis data if needed
        const pendingPromises = [];

        if (!analysisResult.suggestions) {
          pendingPromises.push(aiService.generateSuggestions(fileId));
        }
        
        if (!analysisResult.summary) {
          pendingPromises.push(aiService.generateSummary(fileId));
        }
        
        if (!analysisResult.quiz) {
          pendingPromises.push(aiService.generateQuiz(fileId));
        }
        
        if (!analysisResult.slides) {
          pendingPromises.push(aiService.generateSlides(fileId));
        }
        
        if (!analysisResult.courseSheet) {
          pendingPromises.push(aiService.generateCourseSheet(fileId));
        }
        
        if (!analysisResult.tpSheet) {
          pendingPromises.push(aiService.generateTPSheet(fileId));
        }

        if (pendingPromises.length > 0) {
          await Promise.all(pendingPromises);
          // Refresh the analysis data after generating additional content
          const updatedAnalysis = await aiService.getAnalysisResults(fileId);
          setAnalysisData(updatedAnalysis);
        }
      } catch (err) {
        setError(err.message || "Une erreur est survenue lors de la récupération des données d'analyse.");
        console.error('Error fetching analysis:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysisData();
  }, [fileId]);

  const handleExportPDF = async () => {
    try {
      setExportingPDF(true);
      await exportService.exportToPDF(fileId);
      alert('Export PDF réussi! Le téléchargement va commencer.');
    } catch (err) {
      setError("Erreur lors de l'export PDF. Veuillez réessayer plus tard.");
      console.error('Error exporting PDF:', err);
    } finally {
      setExportingPDF(false);
    }
  };

  const handleExportPPTX = async () => {
    try {
      setExportingPPTX(true);
      await exportService.exportToPPTX(fileId);
      alert('Export PowerPoint réussi! Le téléchargement va commencer.');
    } catch (err) {
      setError("Erreur lors de l'export PowerPoint. Veuillez réessayer plus tard.");
      console.error('Error exporting PPTX:', err);
    } finally {
      setExportingPPTX(false);
    }
  };

  const handleEmailSend = async (e) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setError('Veuillez saisir une adresse email valide.');
      return;
    }
    
    try {
      setEmailSending(true);
      setError(null);
      
      await emailService.sendResults(fileId, email);
      setEmailSuccess(true);
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setEmailSuccess(false);
        setEmail('');
      }, 5000);
    } catch (err) {
      setError("Erreur lors de l'envoi de l'email. Veuillez réessayer plus tard.");
      console.error('Error sending email:', err);
    } finally {
      setEmailSending(false);
    }
  };

  const renderTabContent = () => {
    if (!analysisData) return null;

    switch (activeTab) {
      case 'suggestions':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Points forts du cours</h3>
              <ul className="mt-3 list-disc pl-5 space-y-2">
                {analysisData.suggestions?.strengths.map((strength, idx) => (
                  <li key={idx} className="text-gray-700">{strength}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900">Suggestions d'amélioration</h3>
              <ul className="mt-3 list-disc pl-5 space-y-2">
                {analysisData.suggestions?.improvements.map((improvement, idx) => (
                  <li key={idx} className="text-gray-700">{improvement}</li>
                ))}
              </ul>
            </div>
          </div>
        );
        
      case 'summary':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900">{analysisData.summary?.title}</h3>
            
            {analysisData.summary?.sections.map((section, idx) => (
              <div key={idx} className="border-l-4 border-blue-200 pl-4">
                <h4 className="text-lg font-medium text-gray-800">{section.title}</h4>
                <p className="mt-2 text-gray-600">{section.content}</p>
                
                {section.keyPoints && (
                  <div className="mt-3">
                    <h5 className="text-sm font-medium text-gray-700">Points clés:</h5>
                    <ul className="mt-2 list-disc pl-5 space-y-1">
                      {section.keyPoints.map((point, pointIdx) => (
                        <li key={pointIdx} className="text-gray-600 text-sm">{point}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        );
        
      case 'quiz':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900">{analysisData.quiz?.title}</h3>
            
            {analysisData.quiz?.questions.map((q, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                <p className="font-medium text-gray-800">{idx + 1}. {q.question}</p>
                
                <div className="mt-3 space-y-2">
                  {q.options.map((option, optionIdx) => (
                    <div 
                      key={optionIdx}
                      className={`p-3 rounded-md ${q.correctAnswer === optionIdx ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}
                    >
                      <div className="flex items-start">
                        <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-gray-200 text-xs font-medium text-gray-800 mr-3">
                          {String.fromCharCode(65 + optionIdx)}
                        </span>
                        <p className="text-gray-700">{option}</p>
                        {q.correctAnswer === optionIdx && (
                          <span className="ml-auto text-green-600">✓</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-3 text-sm text-gray-600 bg-blue-50 p-3 rounded-md">
                  <span className="font-medium">Explication: </span>
                  {q.explanation}
                </div>
              </div>
            ))}
          </div>
        );
        
      case 'slides':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900">{analysisData.slides?.title}</h3>
            
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {analysisData.slides?.slides.map((slide, idx) => (
                <div key={idx} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                  <div className="bg-blue-700 text-white py-2 px-4">
                    <h4 className="text-lg font-medium">{`Diapositive ${idx + 1}: ${slide.title}`}</h4>
                  </div>
                  
                  <div className="p-4">
                    <p className="text-gray-600 mb-4">{slide.content}</p>
                    
                    <h5 className="font-medium text-gray-700 mb-2">Points clés:</h5>
                    <ul className="list-disc pl-5 space-y-1 mb-4">
                      {slide.bulletPoints.map((point, pointIdx) => (
                        <li key={pointIdx} className="text-gray-600">{point}</li>
                      ))}
                    </ul>
                    
                    <div className="mt-4 bg-gray-50 p-3 rounded-md">
                      <h5 className="font-medium text-gray-700 mb-1">Suggestion visuelle:</h5>
                      <p className="text-gray-600 text-sm">{slide.visualSuggestion}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
        
      case 'courseSheet':
        return (
          <div className="space-y-6 bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-xl font-medium text-gray-900 border-b pb-3">{analysisData.courseSheet?.title}</h3>
            
            {analysisData.courseSheet?.sections.map((section, idx) => (
              <div key={idx} className="mb-6">
                <h4 className="text-lg font-medium text-gray-800 mb-3">{section.title}</h4>
                
                {typeof section.content === 'string' ? (
                  <p className="text-gray-700">{section.content}</p>
                ) : Array.isArray(section.content) ? (
                  <ul className="list-disc pl-5 space-y-1">
                    {section.content.map((item, itemIdx) => (
                      <li key={itemIdx} className="text-gray-700">{item}</li>
                    ))}
                  </ul>
                ) : (
                  <div className="pl-4 border-l-2 border-gray-200">
                    {Object.entries(section.content).map(([key, value]) => (
                      <div key={key} className="mb-2">
                        <span className="font-medium text-gray-700">{key}: </span>
                        <span className="text-gray-600">{value}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                {Array.isArray(section.content) && section.content[0]?.concept && (
                  <div className="space-y-4 mt-3">
                    {section.content.map((item, itemIdx) => (
                      <div key={itemIdx} className="bg-gray-50 p-4 rounded-md">
                        <h5 className="font-medium text-gray-800">{item.concept}</h5>
                        <p className="text-gray-600 mt-1">{item.définition}</p>
                        
                        <div className="mt-2">
                          <h6 className="text-sm font-medium text-gray-700">Exemples:</h6>
                          <ul className="list-disc pl-5 mt-1">
                            {item.exemples.map((exemple, exIdx) => (
                              <li key={exIdx} className="text-gray-600 text-sm">{exemple}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        );
        
      case 'tpSheet':
        return (
          <div className="space-y-6 bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="border-b pb-4">
              <h3 className="text-xl font-medium text-gray-900">{analysisData.tpSheet?.title}</h3>
              <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2 text-sm">
                <p><span className="font-medium text-gray-700">Durée:</span> <span className="text-gray-600">{analysisData.tpSheet?.metadata.duration}</span></p>
                <p><span className="font-medium text-gray-700">Niveau:</span> <span className="text-gray-600">{analysisData.tpSheet?.metadata.level}</span></p>
                <p><span className="font-medium text-gray-700">Prérequis:</span> <span className="text-gray-600">{analysisData.tpSheet?.metadata.prerequisites}</span></p>
              </div>
            </div>
            
            {analysisData.tpSheet?.sections.map((section, idx) => (
              <div key={idx} className="mb-6">
                <h4 className="text-lg font-medium text-gray-800 mb-3">{section.title}</h4>
                
                {Array.isArray(section.content) && section.content[0]?.step ? (
                  <div className="space-y-4">
                    {section.content.map((item, itemIdx) => (
                      <div key={itemIdx} className="bg-gray-50 p-4 rounded-md">
                        <h5 className="font-medium text-gray-800">{item.step}</h5>
                        <p className="text-gray-600 mt-1">{item.instructions}</p>
                      </div>
                    ))}
                  </div>
                ) : Array.isArray(section.content) ? (
                  <ul className="list-disc pl-5 space-y-2">
                    {section.content.map((item, itemIdx) => (
                      <li key={itemIdx} className="text-gray-700">{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-700">{section.content}</p>
                )}
              </div>
            ))}
          </div>
        );
        
      default:
        return <div>Contenu non disponible</div>;
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
          <p className="mt-4 text-gray-600">Chargement de l'analyse en cours...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
        <Link to="/dashboard" className="text-blue-600 hover:text-blue-800">
          Retour au tableau de bord
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link to="/dashboard" className="text-blue-600 hover:text-blue-800 inline-flex items-center">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Retour au tableau de bord
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 bg-gray-50">
          <h2 className="text-xl font-bold text-gray-900">
            Analyse du cours: {analysisData?.content?.title || "Document de cours"}
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Analyse réalisée le {new Date(analysisData?.analyzedAt).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
        
        <div className="px-4 py-5 sm:px-6 border-t border-gray-200">
          <div className="flex flex-wrap gap-2 md:gap-4">
            <button
              onClick={handleExportPDF}
              disabled={exportingPDF}
              className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none ${exportingPDF ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {exportingPDF ? 'Export en cours...' : 'Exporter en PDF'}
            </button>
            
            <button
              onClick={handleExportPPTX}
              disabled={exportingPPTX}
              className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none ${exportingPPTX ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {exportingPPTX ? 'Export en cours...' : 'Exporter en PowerPoint'}
            </button>
            
            <form onSubmit={handleEmailSend} className="flex flex-wrap gap-2 items-center ml-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre-email@exemple.com"
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:w-auto sm:text-sm border-gray-300 rounded-md"
                disabled={emailSending || emailSuccess}
              />
              <button
                type="submit"
                disabled={emailSending || emailSuccess}
                className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white ${emailSuccess ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none ${(emailSending || emailSuccess) ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {emailSending ? 'Envoi en cours...' : emailSuccess ? 'Envoyé ✓' : 'Envoyer par email'}
              </button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-gray-200">
          <div className="flex overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        
        <div className="px-4 py-6 sm:px-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default Analysis;