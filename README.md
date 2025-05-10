# Hackathon

* **Repository Name:** `Hackathon`
* **URL:** [https://github.com/QTelesGabriel/Hackathon](https://github.com/QTelesGabriel/Hackathon)

---

# Hackathon – Term Breaker

Uma extensão de navegador + backend que analisa Termos de Uso e Políticas de Privacidade, aponta cláusulas de risco e impede o aceite automático sem revisão.

---

## 📂 Estrutura do repositório

```
Hackathon/
├─ extensao-frontend/
│  ├─ manifest.json
│  ├─ popup.html
│  ├─ popup.js
│  ├─ content.js
│  ├─ style.css
│  └─ icons/…
│
├─ extensao-backend/
│  ├─ server.js
│  ├─ package.json
│  └─ .env.example
│
└─ README.md         ← (você está aqui)
```

---

## 🚀 Quickstart

1. **Clone o repositório**

   ```bash
   git clone https://github.com/QTelesGabriel/Hackathon.git
   cd Hackathon
   ```

2. **Backend (Node.js 18+)**

   ```bash
   cd extensao-backend
   # configure sua chave:
   cp .env.example .env
   # edite .env e preencha OPENAI_KEY ou GEMINI_API_KEY
   npm install
   node server.js
   ```

   O backend ficará disponível em `http://localhost:3000/analisar`.

3. **Frontend (Extensão Chrome)**

   * Abra `chrome://extensions/` no Chrome/Edge.
   * Ative “Modo de desenvolvedor”.
   * Clique em “Carregar sem compactação” e selecione `extensao-frontend/`.
   * Clique no ícone da extensão e ative o Term Breaker.
   * Navegue a qualquer site com “Terms” e veja o popup de análise.

---

## 🔧 Backend

* **`server.js`**: servidor Express que expõe `/analisar`.
* **Dependências**: `express`, `cors`. Usa `fetch` nativo do Node.js para chamar OpenAI ou Gemini.
* **Env vars** (via `.env`):

  * `OPENAI_KEY` — chave da OpenAI GPT-4.
  * *ou*
  * `GEMINI_API_KEY` & `GCP_PROJECT` — para Google Gemini via Vertex AI.

---

## ⚙️ Frontend

* **`manifest.json`**: configura extensão MV3.
* **`popup.html` + `popup.js`**: botão on/off que salva em `chrome.storage.local`.
* **`content.js`**: injetado em cada página, detecta link de termos, busca texto relevante, chama backend e exibe popup.
* **`style.css`**: estilos do popup.

---

## 📄 Fluxo de dados

1. Usuário clica no ícone e ativa a extensão.
2. `content.js` roda em cada página, busca link de “terms”.
3. Download do HTML, extração de blocos com palavras-chave de risco.
4. Envio do texto filtrado para `POST /analisar`.
5. Backend retorna JSON `{ nota, risco, clausulasProblematicas }`.
6. `content.js` exibe popup com resultado e lista de cláusulas.

---

## 🛠️ Personalização

* Ajuste **palavras-chave** em `content.js` (`termosPossiveis` e `palavrasChaveRisco`).
* Mude modelo (GPT‑4, GPT‑3.5, Gemini) no `server.js`.
* Alterar limites de slice (`.slice(0,8000)`) para maior cobertura.

---

## 📝 Licença

Este projeto é open‑source sob a [MIT License](LICENSE).

---

## 🤝 Contribuições

1. Fork este repositório.
2. Crie uma branch (`git checkout -b feature/foo`).
3. Faça commit das mudanças (`git commit -am 'Add foo'`).
4. Push para a branch (`git push origin feature/foo`).
5. Abra um Pull Request.

---

Project link: [https://github.com/QTelesGabriel/Hackathon](https://github.com/QTelesGabriel/Hackathon)
