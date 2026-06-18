# 📖 Sistema de Gestão de Testes – API Sandbox

## 1. Sobre o sistema

Este projeto é uma **API REST** desenvolvida em **Node.js + Express + Sequelize**, com persistência em banco de dados relacional.  
O objetivo é servir como um **sistema sandbox** para prática de ferramentas de automação de testes de API (como Rest Assured, Supertest, Cypress, Postman, etc.), permitindo que usuários tenham uma aplicação alvo para treinar e validar suas estratégias de testes.

### ✨ Tecnologias utilizadas
- **Node.js** (backend em JavaScript)
- **Express.js** (framework web)
- **Sequelize** (ORM para banco relacional)
- **JWT** (autenticação)
- **Docker & Docker Compose** (containerização e orquestração)

---

## 2. Pré-requisitos

Antes de iniciar, certifique-se de ter instalado:

- **Docker** versão 20.10 ou superior  
  [Instalação do Docker](https://docs.docker.com/get-docker/)  

- **Docker Compose** versão 2.0 ou superior  
  (já vem junto com versões recentes do Docker Desktop)  

- **Node.js** versão 18 ou superior *(opcional, apenas se quiser rodar localmente sem Docker)*  
  [Instalação do Node.js](https://nodejs.org/)

---

## 3. Executando o projeto com Docker

No diretório raiz do projeto (onde estão `Dockerfile` e `docker-compose.yml`), execute:

```bash
# Construir a imagem
docker-compose build

# Subir os containers (API + banco de dados)
docker-compose up -d

```

- Após a execução, a API estará disponível em:
http://localhost:3000/api

## 4. Comandos úteis do Docker

- Ver containers em execução
```bash
    docker ps
```

- Ver logs da aplicação
```bash
    docker-compose logs -f
    docker logs node_app
```

- Recriar containers após alterações
```bash
    docker-compose up -d --build
  ```

- Acessar o container da API
```bash
    docker exec -it <nome_do_container_api> /bin/sh
  ```

- Parar os containers
```bash
    docker-compose down
  ```

## 5. Regras de negócios


### 📌 Entidades principais
- **Usuários**: possuem papéis (`ADMIN`, `LIDER`, `ANALISTA`, `TESTADOR`) que definem permissões.  
- **Planos de Teste**: agrupam suites e casos de teste.  
- **Suites de Teste**: agrupam casos relacionados.  
- **Casos de Teste**: possuem título, descrição, prioridade (`BAIXA`, `MEDIA`, `ALTA`) e criticidade (`BAIXA`, `MEDIA`, `ALTA`).  
- **Registros de Execução**: armazenam resultados (`NAO_EXECUTADO`, `SUCESSO`, `FALHA`, `BLOQUEADO`, `CANCELADO`).  
- **Defeitos**: possuem situação (`ABERTO`, `EM_CORRECAO`, `CORRIGIDO`, `EM_TESTES`, `CONCLUIDO`, `CANCELADO`) e criticidade.  
- **Scripts e Procedimentos**: detalham passos de execução.

### 📌 Regras de negócio
- Autenticação via **JWT**.  
- Apenas **ADMIN** e **LIDER** podem criar/editar/deletar planos de teste.  
- **ANALISTA** e **TESTADOR** podem consultar planos e executar casos.  
- Cada entidade valida os campos contra os **enums** definidos (`Role`, `Prioridade`, `Resultado`, `Criticidade`, `Situacao`).  
- O middleware de permissões garante que apenas usuários com papéis adequados executem determinadas ações.  
- O middleware de erros padroniza respostas de falha:  
  - **400** → erros de validação  
  - **401** → token inválido ou não fornecido  
  - **403** → acesso negado  
  - **404** → recurso não encontrado  


### 📌 Pipelines de CI/CD (GitHub Actions)

O projeto possui **3 pipelines** configuradas no GitHub Actions, cada uma com um gatilho diferente, mas compartilhando os mesmos steps de execução. Abaixo a descrição de cada uma:

| Pipeline | Arquivo | Gatilho |
|---|---|---|
| **Execução Manual** | `01-manual-exec.yaml` | `workflow_dispatch` — iniciada manualmente pela interface do GitHub Actions |
| **Execução Agendada** | `02-scheduled-exec.yaml` | `schedule` — executa automaticamente todos os dias às 09:00 (UTC) via cron (`0 9 * * *`) |
| **Execução por Push** | `03-push-exec.yaml` | `push` — disparada automaticamente quando há push na branch `main` |

Todas as pipelines executam os mesmos steps, organizados em **2 jobs**:

---

#### Job 1: `api-test`

Executa os passos de infraestrutura e testes funcionais da API.

| Step | Ação | Descrição |
|---|---|---|
| **Checkout** | `actions/checkout@v4` | Faz o clone do repositório para o runner |
| **Subir containers** | `docker compose up -d` | Sobe os containers da aplicação (API + banco Postgres) em modo detached |
| **Aguardar banco ficar pronto** | `pg_isready` | Loop de espera ativa verificando se o PostgreSQL está aceitando conexões |
| **Rodar migrations** | `npx sequelize-cli db:migrate` | Executa as migrations do Sequelize para criar as tabelas no banco |
| **Rodar seeds** | `npx sequelize-cli db:seed:all` | Popula o banco com dados iniciais (seeds) |
| **Verificar containers** | `docker ps` | Lista os containers em execução para logging/debug |
| **Instalar dependências** | `npm install` no diretório `test/` | Instala as dependências dos testes automatizados |
| **Executar testes de API** | `npm test` no diretório `test/` | Roda a suíte de testes contra a API rodando em `http://localhost:3000` |
| **Preparar relatório para Pages** | Script shell | Cria o diretório `pages-deploy/` e copia o relatório HTML gerado (`test/report-site/index.html`) e o relatório CTRF (`ctrf-report.json`) |
| **Upload relatório para Pages** | `actions/upload-pages-artifact@v3` | Faz upload dos artefatos de relatório para o deploy no GitHub Pages |

> **Nota:** Os steps "Preparar relatório" e "Upload relatório" possuem `if: always()`, garantindo que sejam executados mesmo se os testes falharem.

---

#### Job 2: `deploy-report`

Responsável por publicar o relatório de testes no GitHub Pages.

| Step | Ação | Descrição |
|---|---|---|
| **Deploy para GitHub Pages** | `actions/deploy-pages@v4` | Faz o deploy do artefato de relatório na página do GitHub Pages, disponibilizando o resultado dos testes publicamente |

> Este job depende do `api-test` (`needs: api-test`) e também executa com `if: always()`, assegurando que o relatório seja publicado independentemente do resultado dos testes.

---

#### Fluxo completo

```
Push (main) / Agendamento / Manual
        │
        ▼
  ┌─────────────┐
  │  api-test   │
  │  ─────────  │
  │  checkout   │
  │  docker up  │
  │  pg_isready │
  │  migrate    │
  │  seed       │
  │  npm test   │
  │  report     │
  └──────┬──────┘
         │
         ▼
  ┌──────────────┐
  │ deploy-report│
  │  ─────────── │
  │  pages deploy│
  └──────────────┘
         │
         ▼
  Relatório publicado no GitHub Pages
```



