# Plataforma de Cursos Online (LMS)

Sistema web de gerenciamento de cursos desenvolvido com React e TypeScript. A aplicação permite organizar conteúdos educacionais em categorias, cursos, módulos e aulas, além de simular funcionalidades comuns de plataformas de ensino, como matrículas, acompanhamento de progresso, certificados e planos de assinatura.

## Tecnologias Utilizadas

* React
* TypeScript
* Bootstrap 5
* Vite
* JSON Server

## Funcionalidades

### Catálogo de Cursos

* Listagem de cursos disponíveis
* Filtro por categorias
* Visualização detalhada do conteúdo de cada curso

### Estrutura Acadêmica

* Organização em categorias
* Cursos divididos em módulos
* Módulos compostos por aulas
* Navegação hierárquica do conteúdo

### Matrículas e Progresso

* Simulação de matrícula em cursos
* Controle de aulas concluídas
* Acompanhamento do progresso do aluno

### Certificados

* Geração de certificados de conclusão
* Código de verificação para cada certificado emitido

### Planos e Assinaturas

* Gerenciamento de planos disponíveis
* Controle de assinaturas
* Registro de pagamentos

## Estrutura do Projeto

```text
src/
├── components/
│   └── Navbar.tsx
├── model/
│   └── types.ts
├── pages/
│   ├── Dashboard.tsx
│   ├── UserProgress.tsx
│   ├── Financial.tsx
│   └── Admin.tsx
├── services/
│   └── api.ts
├── App.tsx
└── main.tsx
```

## Instalação

Clone o repositório:

```bash
git clone https://github.com/nikorvich/plataforma-cursos-lms
```

Acesse a pasta do projeto:

```bash
cd plataforma-cursos-lms
```

Instale as dependências:

```bash
npm install
```

Inicie a aplicação:

```bash
npm run dev
```

A aplicação ficará disponível normalmente em:

```text
http://localhost:5173
```

## API de Desenvolvimento

O projeto utiliza JSON Server para simular uma API REST local a partir do arquivo `db.json`.

Endpoints disponíveis:

* `/usuarios`
* `/categorias`
* `/cursos`
* `/modulos`
* `/aulas`
* `/matriculas`
* `/progresso_aulas`
* `/avaliacoes`
* `/trilhas`
* `/trilhas_cursos`
* `/certificados`
* `/planos`
* `/assinaturas`
* `/pagamentos`

## Objetivo

Este projeto foi desenvolvido para praticar conceitos de desenvolvimento frontend com React, TypeScript, consumo de API REST, componentização, gerenciamento de estado e modelagem de dados.
