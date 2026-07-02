# LuminaUI — Roadmap Estratégico

> Posicionamento: **"A biblioteca de interface declarativa mais avançada e leve para projetos que não querem carregar um framework JavaScript completo."**

Este documento é o roadmap público do LuminaUI. Ele lista tudo que planejamos construir para transformar a biblioteca de "100 componentes visuais" em uma plataforma completa de UI declarativa.

Status atual: **100/100 componentes full implementation** ✅

---

## Fase 1 — Sistema de Layout Declarativo (Prioridade Máxima)

**Objetivo:** Trazer o poder do sistema de layout do Flutter para o DOM — sem framework, sem React, sem virtual DOM.

Esta é a **maior oportunidade competitiva**. Nenhuma biblioteca vanilla oferece um sistema de constraints. Todo mundo faz flex/grid manuais ou media queries.

### Componentes a implementar

- [ ] **`LuminaConstraint`** — Sistema de constraints inspirado no Flutter. Cada componente recebe `minWidth`, `maxWidth`, `minHeight`, `maxHeight` do parent e decide seu tamanho. Implementação via ResizeObserver + CSS custom properties + layout passes manuais.
  - [ ] Constraint resolution algorithm (min/max width/height)
  - [ ] Tight vs loose constraints
  - [ ] Unbounded constraints (scroll contexts)
  - [ ] Constraint inheritance chain
  - [ ] Overflow detection + warnings

- [ ] **`LuminaLayoutBuilder`** — Recebe as constraints do parent e rebuilda filhos via callback declarativo. Equivalente direto do `LayoutBuilder` do Flutter.
  - [ ] `builder` callback com `{minWidth, maxWidth, minHeight, maxHeight}`
  - [ ] Rebuild on resize (ResizeObserver)
  - [ ] Debounced rebuild para performance
  - [ ] Conditional rendering baseado em constraints

- [ ] **`LuminaSliver`** + **`LuminaCustomScrollView`** — Scroll virtualizado com slivers reais.
  - [ ] `LuminaSliverList` — lista virtualizada com recycling de DOM nodes
  - [ ] `LuminaSliverGrid` — grid virtualizado
  - [ ] `LuminaSliverPersistentHeader` — header que cola ao rolar (sticky com physics)
  - [ ] `LuminaSliverParallax` — parallax no scroll
  - [ ] `LuminaSliverAppBar` — app bar expansível
  - [ ] Lazy loading inteligente (prefetch de itens próximos)
  - [ ] Scroll physics customizáveis (bounce, momentum, snapping)

- [ ] **`LuminaFractionallySizedBox`** — Filho ocupa fração do parent (40% largura, etc.) sem flex.
  - [ ] `widthFactor` e `heightFactor` (0..1)
  - [ ] Alignment do filho dentro do box

- [ ] **`LuminaStack`** + **`LuminaPositioned`** — Posicionamento absoluto declarativo.
  - [ ] `LuminaStack` com `alignment` default
  - [ ] `LuminaPositioned` com `left`, `top`, `right`, `bottom`, `width`, `height`
  - [ ] `LuminaPositioned.fill` (preenche todo o stack)
  - [ ] `LuminaPositionedDirectional` (suporte a RTL)

- [ ] **`LuminaExpanded`** + **`LuminaFlexible`** — Flex expandido declarativo.
  - [ ] `flex` factor
  - [ ] `fit` (tight / loose)
  - [ ] Integração com `LuminaRow` e `LuminaColumn`

- [ ] **`LuminaRow`** + **`LuminaColumn`** — Flex direction declarativo com constraints.
  - [ ] `mainAxisAlignment` (start, center, end, spaceBetween, spaceAround, spaceEvenly)
  - [ ] `crossAxisAlignment` (start, center, end, stretch, baseline)
  - [ ] `mainAxisSize` (min, max)
  - [ ] Suporte a `LuminaExpanded` e `LuminaFlexible` como filhos

- [ ] **`LuminaWrap`** — Wrap de filhos que não cabem (Flow).
  - [ ] `direction`, `spacing`, `runSpacing`, `alignment`

- [ ] **`LuminaAspectRatio`** — Mantém proporção.
  - [ ] `aspectRatio` (ex: 16/9)

- [ ] **`LuminaIntrinsicWidth`** / **`LuminaIntrinsicHeight`** — Tamanho baseado no conteúdo.
  - [ ] Mede o tamanho intrínseco dos filhos

- [ ] **`LuminaConstrainedBox`** — Aplica constraints adicionais.
  - [ ] `minWidth`, `maxWidth`, `minHeight`, `maxHeight`

- [ ] **`LuminaSizedBox`** — Tamanho fixo.
  - [ ] `width`, `height`
  - [ ] `SizedBox.expand()` (preenche)

- [ ] **`LuminaCenter`** / **`LuminaAlign`** — Alinhamento declarativo.
  - [ ] `alignment` (Alignment.topLeft, center, etc.)
  - [ ] `widthFactor`, `heightFactor`

- [ ] **`LuminaPadding`** — Padding declarativo.
  - [ ] `padding` (EdgeInsets.all / symmetric / only)

- [ ] **`LuminaContainer`** (refatorar) — Combinar decoration + padding + constraints + margin em um só.

### Layout Lab no Playground

- [ ] Nova seção "Layout Lab" no playground
- [ ] Editor visual de constraints (arrastar para redimensionar)
- [ ] Visualização de overflow (bordas vermelhas)
- [ ] Visualização de constraints (bordas coloridas com info)
- [ ] Exemplos: dashboard layout, form layout, card grid, master-detail

### Documentação

- [ ] Página "Layout System" explicando o modelo de constraints
- [ ] Diagrama de como constraints fluem (parent → child)
- [ ] Tabela comparativa: Flutter Widget → LuminaUI Equivalent
- [ ] Guia de migração de CSS flex/grid para LuminaUI Layout

---

## Fase 2 — Data Grid Killer (Alta Prioridade)

**Objetivo:** O melhor Data Grid vanilla do mercado. Melhor que ag-Grid em performance, mais leve em bundle.

### Funcionalidades

- [ ] **Virtualização real** — Renderizar 100k+ linhas sem travar
  - [ ] DOM node recycling (pool de elementos)
  - [ ] IntersectionObserver para detectar visibilidade
  - [ ] Prefetch de itens próximos (buffer zone)
  - [ ] Scroll horizontal virtualizado também
  - [ ] Benchmarks vs. ag-Grid (table Size, FPS, memory)

- [ ] **Edição inline** com validação
  - [ ] Cell editing (click to edit)
  - [ ] Row editing (edit entire row)
  - [ ] Validation em tempo real (zod, valibot, custom)
  - [ ] Undo/redo de edições
  - [ ] Batch editing (salvar múltiplas alterações)

- [ ] **Drag de colunas** reordenável
  - [ ] Drag handle visual
  - [ ] Preview de posição durante drag
  - [ ] Persistência de ordem (localStorage)
  - [ ] Column pinning (fixar à esquerda/direita)

- [ ] **Agrupamento** (grouping)
  - [ ] Group by column
  - [ ] Multi-level grouping
  - [ ] Aggregations (sum, avg, count, min, max)
  - [ ] Expand/collapse de grupos

- [ ] **Filtros avançados**
  - [ ] Filter per column (text, number, date, select)
  - [ ] Multi-condition filters (AND/OR)
  - [ ] Saved filter presets
  - [ ] Global search

- [ ] **Ordenação** multi-coluna
  - [ ] Sort by múltiplas colunas (shift+click)
  - [ ] Sort direction indicator
  - [ ] Custom sort functions

- [ ] **Seleção**
  - [ ] Single selection
  - [ ] Multi selection (checkbox)
  - [ ] Range selection (shift+click)
  - [ ] Select all / deselect all
  - [ ] Selection persistence com scroll virtualizado

- [ ] **Renderização custom** de células
  - [ ] Cell renderer API (retorna HTMLElement)
  - [ ] Cell editor API
  - [ ] Conditional formatting (cor baseada em valor)
  - [ ] Cell templates (button, progress, avatar, etc.)

- [ ] **Performance**
  - [ ] Target: 60fps com 100k linhas
  - [ ] Memory: < 50MB com 100k linhas
  - [ ] Bundle: < 30kb gzip (grid only)
  - [ ] Benchmarks automatizados no CI

- [ ] **Exportação**
  - [ ] CSV export
  - [ ] JSON export
  - [ ] Excel export (via SheetJS opcional)

- [ ] **Acessibilidade**
  - [ ] Navegação por teclado completa (Arrow keys, Enter, Space, F2)
  - [ ] Screen reader announcements
  - [ ] ARIA grid roles

### Data Grid Lab no Playground

- [ ] Demo com 100k linhas (performance test)
- [ ] Demo com edição inline
- [ ] Demo com drag de colunas
- [ ] Demo com agrupamento
- [ ] Demo com filtros
- [ ] Benchmark visual (FPS counter)

---

## Fase 3 — Schema-based Dynamic Forms (Alta Prioridade)

**Objetivo:** Gerar formulários complexos a partir de um JSON schema, usando os 20 inputs LuminaUI.

### Componentes

- [ ] **`LuminaSchemaForm`** — Gera form completo a partir de schema
  - [ ] Schema format: JSON Schema ou LuminaUI Schema (simplificado)
  - [ ] Suporte a field types: text, number, email, password, select, multiselect, date, time, color, slider, range, checkbox, radio, textarea, file, switch
  - [ ] Auto-mapping de schema type → LuminaUI input component
  - [ ] Conditional fields (mostrar/esconder baseado em valores)
  - [ ] Dependent fields (campo B depende de campo A)
  - [ ] Field groups (seções, tabs, accordions)
  - [ ] Repeatable sections (arrays de objetos)
  - [ ] Custom field renderers

- [ ] **Validação integrada**
  - [ ] Zod integration (opcional)
  - [ ] Valibot integration (opcional)
  - [ ] Custom validator functions
  - [ ] Real-time validation (on input, on blur, on submit)
  - [ ] Error messages customizáveis
  - [ ] Cross-field validation

- [ ] **Schema → UI mapping**
  - [ ] `ui:widget` — escolher componente específico
  - [ ] `ui:options` — configurar props do componente
  - [ ] `ui:order` — ordem dos campos
  - [ ] `ui:hidden` — esconder campo condicionalmente
  - [ ] `ui:readonly` — campo somente leitura
  - [ ] `ui:help` — texto de ajuda
  - [ ] `ui:placeholder` — placeholder

- [ ] **Layout do form**
  - [ ] Single column
  - [ ] Two columns
  - [ ] Grid layout (responsivo)
  - [ ] Tabs
  - [ ] Wizard (multi-step)
  - [ ] Accordion sections

- [ ] **Submit + State**
  - [ ] Form state management (values, errors, touched)
  - [ ] Submit handler
  - [ ] Reset form
  - [ ] Autofill / prefill
  - [ ] Autosave (debounced)

### Schema Form Lab no Playground

- [ ] Editor de schema (JSON) com live preview
- [ ] Exemplos prontos: registration, checkout, settings, profile
- [ ] Export do schema + código de uso

---

## Fase 4 — DX Revolucionária (Média Prioridade)

**Objetivo:** Ferramentas que fazem devs adotarem LuminaUI pela experiência, não só pelos componentes.

### Chrome DevTools Extension

- [ ] **LuminaUI DevTools Panel**
  - [ ] Árvore de componentes LuminaUI (como React DevTools)
  - [ ] Inspeção de props em tempo real
  - [ ] Edição de props ao vivo (live edit)
  - [ ] Visualização de constraints (Overlay no DOM)
  - [ ] Overflow detection (bordas vermelhas)
  - [ ] Performance profiler (tempo de render por componente)
  - [ ] Event listener inspector

### Visual Composer

- [ ] **Drag-and-drop builder** que gera código Limpa
  - [ ] Palette de componentes (arrastar para canvas)
  - [ ] Canvas com preview ao vivo
  - [ ] Property panel (editar variant, intensity, accent, etc.)
  - [ ] Export: HTML + TSX + Vue
  - [ ] Save/load layouts (localStorage)
  - [ ] Templates prontos (login, dashboard, landing, form)

### Layout Inspector

- [ ] **Overlay visual** que mostra:
  - [ ] Constraints de cada componente (bordas coloridas)
  - [ ] Overflow warnings
  - [ ] Tamanho real vs. constraints
  - [ ] Box model visual
  - [ ] Flex properties debug

### CLI Tools

- [ ] `npx lumina-ui init` — scaffold de projeto
- [ ] `npx lumina-ui add <component>` — adicionar componente
- [ ] `npx lumina-ui doctor` — diagnosticar problemas
- [ ] `npx lumina-ui generate` — gerar componente custom a partir de template

---

## Fase 5 — Componentes Complexos Avançados (Média Prioridade)

### Canvas + DOM Hybrid Components

- [ ] **`LuminaCanvasWidget`** — base para componentes híbridos
  - [ ] Canvas layer para renderização pesada
  - [ ] DOM layer para interatividade
  - [ ] Sincronização de coordenadas canvas ↔ DOM
  - [ ] Resize handling

- [ ] **Componentes visuais avançados**
  - [ ] `LuminaChart` (bar, line, pie, area, scatter) — sem dependências externas
  - [ ] `LuminaGauge` — gauge circular / semicircular
  - [ ] `LuminaHeatmap` — mapa de calor
  - [ ] `LuminaGraph` — grafo de nós e arestas (network graph)
  - [ ] `LuminaDiagram` — diagrama de fluxo (flowchart)
  - [ ] `LuminaMap` — mapa interativo (overlay sobre map tiles)

### Real-time / Collaborative Primitives

- [ ] **`LuminaCursor`** — cursor remoto com nome e cor
  - [ ] Position sync (via WebSocket / BroadcastChannel)
  - [ ] Multi-cursor support
  - [ ] Follow cursor mode

- [ ] **`LuminaPresence`** — indicador de presença
  - [ ] Who is online
  - [ ] What they're editing
  - [ ] Avatar stack live

- [ ] **`LuminaLiveRegion`** — região de edição colaborativa
  - [ ] CRDT/OT integration hooks
  - [ ] Conflict-free editing
  - [ ] Cursor positions within text
  - [ ] Selection sharing

### State Machine Integration

- [ ] **`LuminaStateMachine`** — integração nativa com XState
  - [ ] Declarative state machine definition
  - [ ] Auto-bind states to component variants
  - [ ] Transition animations
  - [ ] DevTools integration (state inspector)

---

## Fase 6 — Navegador Nativo (Baixa Prioridade, Alto Impacto)

**Objetivo:** Adotar APIs modernas do navegador para reduzir código e melhorar performance.

- [ ] **View Transitions API** — transições nativas entre páginas/estados
  - [ ] `LuminaTransition` wrapper
  - [ ] Auto-naming de elementos para morphing
  - [ ] Fallback para navegadores sem suporte

- [ ] **Popover API** — usar `popover` nativo onde disponível
  - [ ] `LuminaPopover` refatorado para usar Popover API
  - [ ] `LuminaTooltip` refatorado
  - [ ] `LuminaContextMenu` refatorado
  - [ ] Fallback graceful

- [ ] **WebGPU** — rendering acelerado por GPU
  - [ ] Canvas components usando WebGPU quando disponível
  - [ ] Fallback para Canvas2D
  - [ ] Particle system com WebGPU (10x mais partículas)

- [ ] **Container Queries** — responsividade baseada em container
  - [ ] `LuminaContainer` usando Container Queries nativas
  - [ ] Layout adapta ao tamanho do container, não da viewport

- [ ] **CSS Anchor Positioning** — posicionamento relativo declarativo
  - [ ] Usar anchor positioning nativo para Popover/Tooltip
  - [ ] Eliminar JS de posicionamento

- [ ] **Scroll-Driven Animations** — animações baseadas em scroll
  - [ ] `LuminaScrollAnimator` wrapper
  - [ ] Parallax, progress, reveal — tudo nativo

---

## Fase 7 — Performance e Escala (Contínuo)

- [ ] **Bundle optimization**
  - [ ] Tree-shaking por componente (import individual)
  - [ ] Code splitting automático (lazy load de componentes pesados)
  - [ ] Target: < 2kb gzip por componente individual
  - [ ] Bundle analyzer no CI

- [ ] **Performance benchmarks**
  - [ ] Suite de benchmarks automatizados (Tachometer)
  - [ ] Comparison vs. Lit, Stencil, React + MUI, Vue + Element
  - [ ] Metrics: initial render, update, memory, bundle size
  - [ ] Public benchmark page no playground

- [ ] **Memory management**
  - [ ] Component disposal patterns
  - [ ] Canvas cleanup
  - [ ] Event listener cleanup audit
  - [ ] Memory leak detection in CI

---

## Fase 8 — Acessibilidade Avançada (Contínuo)

- [ ] **WCAG 2.2 AAA compliance**
  - [ ] Audit de todos os 100 componentes
  - [ ] Corrigir issues encontrados
  - [ ] Automated a11y testing (axe-core) no CI
  - [ ] Manual screen reader testing (NVDA, VoiceOver, JAWS)

- [ ] **Recursos avançados**
  - [ ] High contrast mode
  - [ ] Reduced motion (já parcialmente implementado)
  - [ ] Focus visible sempre
  - [ ] Keyboard navigation completa em todos os componentes
  - [ ] Screen reader announcements dinâmicos
  - [ ] ARIA live regions para atualizações dinâmicas

- [ ] **A11y Inspector** no playground
  - [ ] Visualizar ARIA tree
  - [ ] Detectar problemas de contraste
  - [ ] Simular screen reader
  - [ ] Keyboard navigation visualizer

---

## Fase 9 — Islands / Partial Hydration (Futuro)

- [ ] **`LuminaIsland`** — componente ilha que hidrata sob demanda
  - [ ] IntersectionObserver trigger
  - [ ] Idle callback trigger
  - [ ] Manual trigger
  - [ ] HTML-first (SSR friendly)

- [ ] **SSR Support**
  - [ ] Declarative Shadow DOM rendering
  - [ ] Streaming SSR
  - [ ] Hydration sem flash

- [ ] **Static Generation**
  - [ ] Pre-render LuminaUI components to HTML
  - [ ] Hydrate only interactive parts

---

## Fase 10 — Ecossistema (Futuro)

- [ ] **npm packages**
  - [ ] `@lumina-ui/core` — base + layout system
  - [ ] `@lumina-ui/components` — 100 componentes
  - [ ] `@lumina-ui/charts` — componentes de visualização
  - [ ] `@lumina-ui/collab` — primitivas colaborativas
  - [ ] `@lumina-ui/devtools` — extensão Chrome + CLI

- [ ] **Framework Adapters**
  - [ ] `@lumina-ui/react` — React wrapper com type safety
  - [ ] `@lumina-ui/vue` — Vue wrapper
  - [ ] `@lumina-ui/svelte` — Svelte wrapper
  - [ ] `@lumina-ui/astro` — Astro integration (islands)

- [ ] **Templates**
  - [ ] Dashboard starter
  - [ ] SaaS landing page
  - [ ] Admin panel
  - [ ] E-commerce storefront
  - [ ] Documentation site

- [ ] **Design System Integration**
  - [ ] Figma plugin (sync design tokens)
  - [ ] Figma → LuminaUI code generator
  - [ ] Design tokens JSON format (W3C spec)

---

## Como Contribuir

Veja um item que você quer implementar? Abra uma issue referenciando o item do roadmap.

### Prioridades atuais (Q1 2026)

1. **Fase 1 — Layout System** (próximas 2-3 semanas)
2. **Fase 2 — Data Grid** (semana 4-5)
3. **Fase 3 — Schema Forms** (semana 6-7)

### Não prioritário agora

- Fase 5 (componentes complexos) — depende das Fases 1-3
- Fase 6 (browser APIs) — adoptar conforme suporte de navegador melhora
- Fase 9 (Islands) — pesquisa, ainda
- Fase 10 (Ecossistema) — depois do core estar sólido

---

## Status

- [x] 100 componentes full implementation ✅
- [x] Playground com Monaco editor ✅
- [x] 6 labs interativos ✅
- [x] 5 docs sections ✅
- [x] Code snippets React + Vanilla ✅
- [x] GitHub Pages deploy automático ✅
- [ ] Layout System (Fase 1)
- [ ] Data Grid virtualizado (Fase 2)
- [ ] Schema Forms (Fase 3)
- [ ] DevTools Extension (Fase 4)
- [ ] Componentes complexos (Fase 5)
- [ ] Browser APIs nativas (Fase 6)
- [ ] Performance benchmarks (Fase 7)
- [ ] A11y AAA (Fase 8)
- [ ] Islands / SSR (Fase 9)
- [ ] Ecossistema npm (Fase 10)
