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


## 6. Collections:





