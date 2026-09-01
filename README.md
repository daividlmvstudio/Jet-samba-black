# 🎵 JET SAMBA BLACK — Site Oficial & Painel de Gestão

Aplicação web completa e responsiva para a banda **JET SAMBA BLACK**, com streaming integrado de áudio (Rádio JET), agenda de shows, galeria multimídia (fotos e vídeos do YouTube), biografia, portal de fãs e área de contratações com painel administrativo seguro.

---

## 🚀 Tecnologias Utilizadas

- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Linguagem**: [TypeScript](https://www.typescriptlang.org/)
- **Estilização**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animações**: [Motion (Framer Motion)](https://motion.dev/)
- **Ícones**: [Lucide React](https://lucide.dev/)
- **Efeitos**: [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
- **Persistência**: LocalStorage + IndexedDB (para armazenamento local de áudios offline/carregados)

---

## 💻 Como Rodar Localmente

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/jetsamba-black.git
   cd jetsamba-black
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
   Acesse a aplicação em `http://localhost:3000`.

4. **Gerar build de produção:**
   ```bash
   npm run build
   ```

5. **Testar preview do build:**
   ```bash
   npm run preview
   ```

---

## ⚡ Como Fazer Deploy na Vercel

O projeto já inclui o arquivo `vercel.json` configurado para SPA (Single Page Application).

### Método 1: Via GitHub (Recomendado)
1. Crie um repositório no **GitHub** e envie o código (`git push origin main`).
2. Acesse [vercel.com](https://vercel.com) e faça login.
3. Clique em **"Add New..."** > **"Project"**.
4. Importe o repositório do GitHub.
5. A Vercel detectará automaticamente o framework **Vite**:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Clique em **"Deploy"**.

### Método 2: Via Vercel CLI
```bash
npm i -g vercel
vercel
```

---

## 📁 Estrutura do Projeto

```
├── public/                 # Imagens, logos e recursos estáticos
├── src/
│   ├── assets/             # Recursos embutidos (logos base64, etc.)
│   ├── components/         # Componentes modulares de UI e Portais
│   │   ├── AdminPanel.tsx          # Painel administrativo completo
│   │   ├── MusicPlayerSection.tsx  # Rádio JET e player de músicas
│   │   ├── TourSection.tsx         # Agenda e ingressos de shows
│   │   ├── MembersSection.tsx      # Integrantes oficiais e biografia
│   │   ├── PhotoGallerySection.tsx # Galeria de fotos
│   │   ├── VideoGallerySection.tsx # Galeria de vídeos do YouTube
│   │   ├── BookingSection.tsx      # Orçamentos e contratação de shows
│   │   ├── FanClubPortal.tsx       # Mural, votação de setlist e recados de fãs
│   │   └── ContractorPortal.tsx    # Portal do contratante
│   ├── context/
│   │   └── BandContext.tsx # Gerenciador de estado global
│   ├── data/
│   │   └── initialData.ts  # Informações iniciais, faixas, fotos e vídeos
│   ├── types.ts            # Tipagens TypeScript da aplicação
│   ├── utils/              # Armazenamento IndexedDB e síntese de áudio
│   ├── App.tsx             # Componente raiz da aplicação
│   ├── main.tsx            # Ponto de entrada React
│   └── index.css           # Estilos globais e Tailwind CSS
├── vercel.json             # Configuração de rotas para Vercel
├── vite.config.ts          # Configuração do bundler Vite
└── package.json            # Dependências e scripts
```

---

## 🛡️ Licença
Distribuído sob licença proprietária da banda **JET SAMBA BLACK**.
