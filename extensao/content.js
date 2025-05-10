console.log("[TERM BREAKER] content.js carregado");

(async () => {
  const { termBreakerEnabled } = await new Promise(resolve => {
    chrome.storage.local.get(["termBreakerEnabled"], resolve);
  });

  if (!termBreakerEnabled) return;
  console.log("[TERM BREAKER] extensão ativada, executando anális...");
  
  const termosPossiveis = [
    "termos", "termos de uso", "termos e condições", "termos do serviço", "termos do site", "termos legais",
    "termos do contrato", "condições de uso", "condições gerais", "política de privacidade", "política de dados",
    "política de cookies", "política de segurança", "privacidade", "declaração de privacidade", "aviso legal",
    "acordo de usuário", "contrato de serviço", "informações legais", "informações de privacidade", "uso do site",
    "regras do site", "direitos e deveres", "direitos do usuário", "terms", "terms of use", "terms and conditions",
    "terms of service", "site terms", "legal terms", "user agreement", "user terms", "conditions of use",
    "privacy policy", "cookie policy", "data policy", "security policy", "legal notice", "legal info",
    "privacy statement", "data protection", "user rights", "website rules", "agreement terms", "disclaimer"
  ];
  console.log(termosPossiveis);

  const links = document.querySelectorAll("a");
  
  console.log("asgd");
  console.log(links);

  let url = null;
  for (const link of links) {
    const texto = (link.innerText || link.textContent || "").toLowerCase().trim();
    const href = link.href.toLowerCase().trim();

    const ehLinkValido = href.startsWith("http") && !href.startsWith("javascript:") && href.length > 10;

    const contemTermo = termosPossiveis.some(termo =>
      texto.includes(termo) || href.includes(termo.replace(/\s+/g, "-"))
    );

    if (ehLinkValido && contemTermo) {
      url = link.href;
      console.log(`[TermBreaker] Link identificado: ${url}`);
      break;
    }
  }

  console.log(url);

  if (!url) return;

  try {
    const response = await fetch(url);
    const html = await response.text();
    const div = document.createElement("div");
    div.innerHTML = html;
  
    // Extrair texto apenas de elementos que contenham termos relevantes
    const palavrasChaveRisco = [
      // Privacidade e Dados
      "compartilhamento de dados",
      "compartilhamento de dados com terceiros",
      "venda de dados",
      "cessão de dados",
      "monitoramento de atividades",
      "rastreamento de usuários",
      "trackear usuário",
      "coleta automática de informações",
      "coleta de dados",
      "uso de cookies",
      "uso de beacons",
      "divulgação de dados a autoridades",
      "entrega de dados",
      "solicitação de autoridades",
      
      // Conteúdo e Moderação
      "remoção de conteúdo a critério exclusivo",
      "remoção unilateral de conteúdo",
      "conteúdo ofensivo",
      "conteúdo inapropriado",
      "obsceno",
      "discriminatório",
      "discursão de ódio",
      "censura privada",
      
      // Licenciamento e Direitos do Usuário
      "licença mundial",
      "licença perpétua",
      "licença irrevogável",
      "licença sublicenciável",
      "transferível",
      "livre de royalties",
      "sem royalties",
      "sem compensação",
      "uso comercial irrestrito",
      
      // Jurisdição e Disputas
      "elegibilidade de foro estrangeiro",
      "eleição de foro estrangeiro",
      "lei aplicável estrangeira",
      "jurisdição estrangeira",
      "arbitragem vinculativa",
      "arbitragem obrigatória",
      "renúncia de ação coletiva",
      "ação coletiva proibida",
      "class action waiver",
      
      // Alterações e Término
      "alteração unilateral dos termos",
      "modificações a qualquer momento",
      "sem aviso prévio",
      "notificação posterior",
      "suspensão de conta",
      "cancelamento de conta",
      "encerramento de conta a critério",
      "rescisão imotivada",
      
      // Financeiro e Cobranças
      "renovação automática",
      "cobrança recorrente",
      "pagamento recorrente",
      "assinatura automática",
      "não reembolsável",
      "sem reembolso",
      "sem devolução",
      "valor não reembolsável",
      "taxas e encargos",
      "encargos extras",
      "mult a por atraso",
      "juros de mora",
      
      // Responsabilidade
      "isenção de responsabilidade",
      "sem garantia",
      "limitado a nosso critério",
      "responsabilidade limitada",
      "exclusão de garantias",
      "não nos responsabilizamos"
    ];
  
    // Selecionar todos os parágrafos e divs com texto
    const elementos = div.querySelectorAll("p, div, li, span");
  
    const blocosRelevantes = [];
  
    for (const el of elementos) {
      const texto = el.innerText?.trim().toLowerCase();
      if (!texto || texto.length < 10) continue; // ignora blocos curtos ou vazios
  
      console.log(texto);

      const relevante = palavrasChaveRisco.some(t => texto.includes(t));
      if (relevante) {
        blocosRelevantes.push(el.innerText.trim());
      }
    }

    console.log(blocosRelevantes)
  
    // Junta tudo em um único texto filtrado
    const textoFiltrado = blocosRelevantes.join("\n\n"); // limite opcional
  
    if (textoFiltrado.length < 100) {
      console.log("[TERM BREAKER] Nenhum conteúdo relevante detectado.");
      return;
    }
  
    console.log("Hello: ", textoFiltrado)
    const { resposta } = await analisarComIA(textoFiltrado);
    console.log("OIgjidgjid");
    console.log(resposta)
    exibirPopup(resposta);
  } catch (err) {
    console.warn("[TERM BREAKER] Erro ao analisar termos:", err);
  }

  async function analisarComIA(texto) {
    try {
      const resposta = await fetch("http://localhost:3000/analisar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texto })
      });

      const data = await resposta.json();
      return data;
    } catch (err) {
      console.error("[TERM BREAKER] Erro na chamada ao backend:", err);
      return "Erro ao acessar o serviço de análise.";
    }
  }


  function exibirPopup(resposta) {
    const nota = resposta.match(/nota.*?(\d+)/i)?.[1] || "?";
    const risco = resposta.match(/risco.*?(sem risco|baixo|m[eé]dio|alto)/i)?.[1] || "Desconhecido";

    const popup = document.createElement("div");
    popup.id = "term-breaker-popup";
    popup.style = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #1b1b1b;
      color: white;
      padding: 16px 24px;
      font-family: sans-serif;
      border: 1px solid #ccc;
      z-index: 99999;
      box-shadow: 0 0 10px #000;
    `;
    popup.innerHTML = `
      <h3 style="margin: 0 0 8px 0;">TERM BREAKER</h3>
      <p style="margin: 0;">Nota: <strong>${nota}</strong></p>
      <p style="margin: 0;">Risco: <strong>${risco}</strong></p>
    `;

    document.body.appendChild(popup);
  }
})();
