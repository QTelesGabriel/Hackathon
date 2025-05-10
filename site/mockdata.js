// mockData.js

// Dados da Análise Rápida (index.html)
window.mockQuickAnalysis = {
    url: "https://example.com",
    score: 7,
    term: "sem risco"
  };
  
  // Lista de Análises Recentes (index.html)
  window.mockRecentAnalyses = [
    {
      site: "example.com",
      score: 10,
      term: "alto risco",
      date: "12/05/2025",
      analysisLink: "analysis.html?site=example.com"
    },
    {
      site: "website.org",
      score: 3,
      term: "baixo risco",
      date: "11/05/2025",
      analysisLink: "analysis.html?site=website.org"
    },
    {
      site: "sitetester.net",
      score: 9,
      term: "alto risco",
      date: "10/05/2025",
      analysisLink: "analysis.html?site=sitetester.net"
    },
    {
      site: "webpage.com",
      score: 5,
      term: "médio risco",
      date: "09/05/2025",
      analysisLink: "analysis.html?site=webpage.com"
    }
  ];
  
  // Detalhes da Análise Completa (analysis.html)
  window.mockFullAnalysis = {
    site: "youtube.com",
    lastAnalysis: "10/05/2025",
    score: 7,
    term: "Sem risco",
    findings: [
      { 
        label: "Coleta de dados de navegação",
        status: "Sem risco",
        color: "green"
      },
      {
        label: "Compartilhamento com terceiros",
        status: "Atenção",
        color: "yellow"
      },
      {
        label: "Cláusulas ambíguas nos termos",
        status: "Risco alto",
        color: "red"
      }
    ]
  };
  