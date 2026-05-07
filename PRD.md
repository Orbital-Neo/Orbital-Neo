# PRD (Product Requirements Document) - Orbital Neo

## 1. Quem é o usuário?
O usuário do **Orbital Neo** são donos e operadores de **Pizzarias de pequeno e médio porte** que dependem de fluxos rápidos de produção. 
* **Perfil:** Operadores que precisam gerenciar múltiplos pedidos simultâneos vindos de canais diversos (WhatsApp, balcão).
* **Necessidade:** Clareza visual sobre o que está em preparo, o que já saiu e o que está atrasado.

## 2. Qual é o problema central?
O "caos invisível" das pizzarias de bairro:
* **Perda de informação:** Pedidos anotados em papéis que somem ou sujam.
* **Falta de rastreabilidade:** O atendente não sabe informar ao cliente o status exato da pizza sem ir até a cozinha.
* **Cegueira Gerencial:** O dono não sabe o tempo médio de entrega ou quais sabores vendem mais até o fim do mês.

## 3. O que o sistema faz?
O Orbital Neo substitui o varal de comandas por um **Orquestrador de Fluxo em tempo real**. Ele centraliza o recebimento, a produção e a entrega em um Kanban digital fluido.

## 4. O que o sistema NÃO faz? (Escopo Delimitado)
* **Integração com iFood/Marketplaces:** Foco exclusivo na operação própria da pizzaria.
* **Controle de Estoque de Insumos:** Não faz a contagem de gramas de farinha ou queijo.
* **Roteirização de Motoboys:** O sistema foca no fluxo interno da loja.

## 5. Funcionalidades Essenciais
* **Kanban de Produção:** Gestão visual com colunas: Recebido, Em Preparo, Pronto, Saiu p/ Entrega e Concluído.
* **Drag and Drop:** Movimentação fluida de pedidos entre etapas via `dnd-kit`.
* **Segurança por Cargo:** Operadores gerenciam o fluxo, enquanto clientes podem acompanhar apenas seus pedidos.
* **Responsividade:** Interface adaptada para tablets de cozinha e monitores de balcão.

## 6. Diferencial da Squad: Dashboard de Inteligência
Diferente de um simples quadro de tarefas, o Orbital Neo entrega **visibilidade estratégica**:
* **Faturamento Real:** Soma automática de pedidos finalizados no dia.
* **Tempo Médio de Preparo:** Cálculo exato da eficiência da cozinha.
* **Ranking de Sabores:** Top 5 pizzas mais pedidas para otimização de insumos.

## 7. Divisão da Squad
* **Lucas (Líder/Back-end):** Arquitetura, Deploy, Tipagem e Motor de Tempo.
* **Jorge (Back-end):** Inteligência de Dados e Rota de Métricas.
* **Jeferson (Back-end/Dados):** CRUD de Pedidos e Persistência Prisma.
* **Vitória (Front-end/Estado):** Zustand, TanStack Query e Segurança de Rotas.
* **Fabyola (Front-end):** Layout Kanban, Interface e Drag and Drop.
* **Stella (UX/Qualidade):** Design Responsivo, Badges e Indicadores Visuais.