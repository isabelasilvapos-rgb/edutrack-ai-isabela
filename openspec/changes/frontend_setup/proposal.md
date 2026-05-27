# Proposal: Configuração do Frontend MVP

## Objetivo
Estabelecer a base do Frontend do EduTrack AI utilizando HTML5, CSS3 (Vanilla puro) e JavaScript moderno, garantindo uma arquitetura modular que facilite a integração com as APIs do Xano e que respeite as diretrizes de design definidas no `03_design_system.md`.

## Arquitetura Proposta
A aplicação será dividida em páginas estáticas que se comportam de forma dinâmica via JavaScript:
1. **`index.html`**: Tela inicial com Login e Cadastro de Usuários (Autenticação).
2. **`dashboard.html`**: Painel principal listando todas as Disciplinas e seus respectivos cálculos de progresso.
3. **`subject.html`**: Visão detalhada de uma disciplina, permitindo gerenciar as Tarefas Acadêmicas atreladas a ela.

### Estrutura de Diretórios
- `/frontend/`
  - `/css/styles.css`: Único arquivo CSS contendo variáveis (paleta `#8c52ff`, dark mode) e utilitários flex/grid.
  - `/js/api.js`: Camada de rede (abstração de `fetch`) para comunicar com o Xano.
  - `/js/progress.js`: Lógica de cálculo de porcentagem baseada no script Python `calculo_progresso.py`.
  - `/js/app.js`: Script principal para manipulação do DOM e eventos.

## Identidade Visual e UX
Conforme o Design System:
- Utilizaremos as fontes **Inter** e **Roboto** via Google Fonts.
- Componentes terão bordas arredondadas de `16px`.
- Tema com suporte a variáveis globais para esquema de cores elegante.
- Transições suaves (`transition: all 0.3s ease`) aplicadas a botões e modais.

## Limitações Iniciais
- Inicialmente, as respostas da API (`api.js`) retornarão **dados mockados** para podermos validar as telas. Em uma etapa futura, substituiremos os mocks pela URL real da API do Xano.
