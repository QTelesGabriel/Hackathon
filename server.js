// server.js
import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "500kb" }));

const OPENAI_KEY = process.env.OPENAI_KEY || "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";  // ou configure via ENV

app.post("/analisar", async (req, res) => {
  const { texto } = req.body;

  const prompt = 
    "Você é um especialista jurídico em proteção de dados e direitos do consumidor.\n\n" +
    "Sua tarefa é analisar cláusulas de Termos de Uso e Políticas de Privacidade, com o objetivo de avaliar riscos para o usuário comum.\n\n" +
    "Atribua uma nota de risco de 0 a 10, onde:\n" +
    "- 0 = sem risco relevante\n" +
    "- 10 = múltiplas cláusulas gravemente prejudiciais\n\n" +
    "Use a seguinte lógica:\n" +
    "Para cada ocorrência de cláusulas prejudiciais, aplique pontuação negativa:\n" +
    "- Cláusula leve: +1 ponto\n" +
    "- Cláusula moderada: +2 pontos\n" +
    "- Cláusula grave: +3 pontos\n\n" +
    "Considere como cláusulas prejudiciais, por exemplo:\n" +
    "- Coleta ampla de dados sem finalidade clara\n" +
    "- Compartilhamento de dados com terceiros sem consentimento explícito\n" +
    "- Exclusão de responsabilidade da empresa em caso de danos\n" +
    "- Alterações unilaterais sem notificação\n" +
    "- Venda de dados pessoais\n" +
    "- Imposição de arbitragem obrigatória sem alternativa\n" +
    "- Transferência internacional de dados sem garantias\n" +
    "- Renúncia a direitos legais ou jurídicos\n" +
    "- Monitoramento contínuo da atividade do usuário\n\n" +
    "🔷 RESPONDA **APENAS** EM JSON COM ESTA ESTRUTURA:\n" +
    "{\n" +
    '  "nota": <número 0–10>,\n' +
    '  "risco": "sem risco"|"baixo"|"médio"|"alto",\n' +
    '  "clausulasProblematicas": [ "cláusula 1", "cláusula 2", … ]\n' +
    "}";

  try {
    // fetch global do Node.js 18+ :contentReference[oaicite:1]{index=1}
    const apiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "",
        messages: [
          { role: "system", content: prompt },
          { role: "user", content: texto }
        ],
        temperature: 0.5
      })
    });

    const text = await apiRes.text();
    if (!apiRes.ok) {
      console.error("[OPENAI] status", apiRes.status, "body", text);
      return res.status(apiRes.status).json({ error: "OpenAI API error", details: text });
    }

    // parse da resposta completa
    const data = JSON.parse(text);
    const choice = data.choices?.[0]?.message?.content;
    if (!choice) {
      console.error("[SERVER] sem content em choices:", data);
      return res.status(500).json({ error: "Sem content na resposta da IA", data });
    }

    // parse do JSON interno que o modelo devolveu
    let result;
    try {
      result = JSON.parse(choice);
    } catch (e) {
      console.error("[SERVER] falha ao parsear JSON interno:", e, choice);
      return res.status(500).json({ error: "JSON interno inválido", raw: choice });
    }

    return res.json(result);
  } catch (err) {
    console.error("[ERRO] Falha na chamada à OpenAI:", err);
    res.status(500).json({ error: "Erro ao analisar com IA.", details: err.toString() });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
});
