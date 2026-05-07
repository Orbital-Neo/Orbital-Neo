# 🍕 Orbital Neo
> Orquestrador de fluxo em tempo real para pizzarias pequenas e de médio porte.

O **Orbital Neo** transforma o caos das comandas de papel em uma operação digital eficiente. Através de um Kanban dinâmico e um dashboard de métricas, entregamos controle total para o dono da pizzaria e agilidade para a cozinha.

## 🛠️ Tecnologias Utilizadas

### Backend
* **Node.js + Fastify:** API de alta performance.
* **Prisma ORM:** Modelagem de dados tipada.
* **PostgreSQL (Neon):** Banco de dados relacional robusto hospedado na nuvem.
* **JWT:** Autenticação e segurança.

### Frontend
* **React + Vite:** Interface rápida e moderna.
* **TailwindCSS:** Estilização responsiva e profissional.
* **Zustand:** Estado global de autenticação.
* **TanStack Query:** Sincronização de dados e atualização em tempo real (Polling).
* **dnd-kit:** Experiência de drag and drop fluida.

## 📂 Estrutura do Projeto
```text
orbital-neo/
├── backend/            # API Node.js/Fastify
│   ├── prisma/         # Schema e Migrations
│   └── src/
│       ├── controllers/# Lógica de rotas
│       ├── services/   # Regras de negócio e métricas
│       └── routes/     # Definição de endpoints
└── frontend/           # Aplicação React
    ├── src/
    │   ├── components/ # UI Reutilizável (Kanban, Sidebar)
    │   ├── hooks/      # Lógica de consumo de API (React Query)
    │   ├── store/      # Estado global (Zustand)
    │   └── pages/      # Telas (Login, Pedidos, Dashboard) 

🚀 Como Rodar o Projeto
Pré-requisitos

Node.js (v18+)

npm ou yarn

1. Configuração do Backend

Bash
cd backend
npm install
npx prisma migrate dev    # Criar o banco SQLite
npm run seed              # Popular o banco com dados iniciais
npm run dev               # Iniciar o servidor (Porta 3333)

2. Configuração do Frontend
Bash
cd frontend
npm install
npm run dev               # Iniciar aplicação (Porta 5173)

👥 Squad
Lucas (Líder / Full Stack)

Vitória (Front-end / Estado)

Fabyola (Front-end / Interface)

Jorge (Back-end / Inteligência)

Jeferson (Back-end / Dados)

Stella (UX / Design)

Projeto desenvolvido para o Módulo 4 do curso de Desenvolvimento Full Stack.