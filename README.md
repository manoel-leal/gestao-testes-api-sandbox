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


[Gestão de Testes - API.postman_collection.json](https://github.com/user-attachments/files/25016213/Gestao.de.Testes.-.API.postman_collection.json)
{
  "info": {
    "_postman_id": "30d0bfbc-43a7-49a8-bf07-788339f4af27",
    "name": "Gestão de Testes - API",
    "description": "Collection da API de Gestão de Testes",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
    "_exporter_id": "1115700"
  },
  "item": [
    {
      "name": "Usuários",
      "item": [
        {
          "name": "Listar Usuários",
          "request": {
            "auth": {
              "type": "bearer",
              "bearer": [
                {
                  "key": "token",
                  "value": "{{token}}",
                  "type": "string"
                }
              ]
            },
            "method": "GET",
            "header": [],
            "url": {
              "raw": "http://localhost:3000/api/usuarios",
              "protocol": "http",
              "host": [
                "localhost"
              ],
              "port": "3000",
              "path": [
                "api",
                "usuarios"
              ]
            }
          },
          "response": []
        },
        {
          "name": "Criar Usuário",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "let response = pm.response.json();\r",
                  "let userId = response.id;\r",
                  "\r",
                  "pm.collectionVariables.set(\"userId\", userId);"
                ],
                "type": "text/javascript",
                "packages": {},
                "requests": {}
              }
            }
          ],
          "request": {
            "auth": {
              "type": "bearer",
              "bearer": [
                {
                  "key": "token",
                  "value": "{{token}}",
                  "type": "string"
                }
              ]
            },
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{ \"username\": \"manoel.leal\", \"senha\": \"sistema1234\", \"nome\": \"Manoel\", \"sobrenome\": \"Leal\", \"role\": \"LIDER\" }"
            },
            "url": {
              "raw": "http://localhost:3000/api/usuarios",
              "protocol": "http",
              "host": [
                "localhost"
              ],
              "port": "3000",
              "path": [
                "api",
                "usuarios"
              ]
            }
          },
          "response": []
        }
      ]
    },
    {
      "name": "Planos de Teste",
      "item": [
        {
          "name": "Listar Planos",
          "protocolProfileBehavior": {
            "disableBodyPruning": true
          },
          "request": {
            "auth": {
              "type": "bearer",
              "bearer": [
                {
                  "key": "token",
                  "value": "{{token}}",
                  "type": "string"
                }
              ]
            },
            "method": "GET",
            "header": [],
            "body": {
              "mode": "raw",
              "raw": "",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            },
            "url": {
              "raw": "{{base_url}}/api/planos",
              "host": [
                "{{base_url}}"
              ],
              "path": [
                "api",
                "planos"
              ]
            }
          },
          "response": []
        },
        {
          "name": "Consultar Plano por id",
          "protocolProfileBehavior": {
            "disableBodyPruning": true
          },
          "request": {
            "auth": {
              "type": "bearer",
              "bearer": [
                {
                  "key": "token",
                  "value": "{{token}}",
                  "type": "string"
                }
              ]
            },
            "method": "GET",
            "header": [],
            "body": {
              "mode": "raw",
              "raw": "",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            },
            "url": {
              "raw": "{{base_url}}/api/planos/{{planoId}}",
              "host": [
                "{{base_url}}"
              ],
              "path": [
                "api",
                "planos",
                "{{planoId}}"
              ]
            }
          },
          "response": []
        },
        {
          "name": "Criar Plano",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "let response = pm.response.json();\r",
                  "let planoId = response.id;\r",
                  "\r",
                  "pm.collectionVariables.set(\"planoId\", planoId);"
                ],
                "type": "text/javascript",
                "packages": {},
                "requests": {}
              }
            }
          ],
          "request": {
            "auth": {
              "type": "bearer",
              "bearer": [
                {
                  "key": "token",
                  "value": "{{token}}",
                  "type": "string"
                }
              ]
            },
            "method": "POST",
            "header": [],
            "body": {
              "mode": "raw",
              "raw": "{\r\n    \"titulo\": \"Plano de testes - E-commerce xpto\",\r\n    \"descricao\": \"Plano de testes que vai centralizar os artefatos de testes do E-commerce xpto.\"\r\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            },
            "url": {
              "raw": "{{base_url}}/api/planos",
              "host": [
                "{{base_url}}"
              ],
              "path": [
                "api",
                "planos"
              ]
            }
          },
          "response": []
        },
        {
          "name": "Update Plano",
          "request": {
            "method": "PUT",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              },
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"titulo\": \"Plano atualizado\",\n  \"descricao\": \"Descrição alterada\"\n}"
            },
            "url": {
              "raw": "{{base_url}}/api/planos/{{planoId}}",
              "host": [
                "{{base_url}}"
              ],
              "path": [
                "api",
                "planos",
                "{{planoId}}"
              ]
            }
          },
          "response": []
        },
        {
          "name": "Delete Plano",
          "request": {
            "method": "DELETE",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "{{base_url}}/api/planos/{{planoId}}",
              "host": [
                "{{base_url}}"
              ],
              "path": [
                "api",
                "planos",
                "{{planoId}}"
              ]
            }
          },
          "response": []
        }
      ]
    },
    {
      "name": "Suites de Teste",
      "item": [
        {
          "name": "Listar Suites",
          "request": {
            "auth": {
              "type": "bearer",
              "bearer": [
                {
                  "key": "token",
                  "value": "{{token}}",
                  "type": "string"
                }
              ]
            },
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{base_url}}/api/suites",
              "host": [
                "{{base_url}}"
              ],
              "path": [
                "api",
                "suites"
              ]
            }
          },
          "response": []
        },
        {
          "name": "Criar Suite",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "let response = pm.response.json();\r",
                  "let suiteId = response.id;\r",
                  "\r",
                  "pm.collectionVariables.set(\"suiteId\", suiteId);"
                ],
                "type": "text/javascript",
                "packages": {},
                "requests": {}
              }
            }
          ],
          "request": {
            "auth": {
              "type": "bearer",
              "bearer": [
                {
                  "key": "token",
                  "value": "{{token}}",
                  "type": "string"
                }
              ]
            },
            "method": "POST",
            "header": [],
            "body": {
              "mode": "raw",
              "raw": "{\r\n    \"titulo\": \"Cadastrar produto\",\r\n    \"descricao\": \"Suite de testes que vai agrupar os casos de testes da cadastrar usuário do sistema cadastro de produtos.\",\r\n    \"funcionalidade\": \"Cadastrar Produtos\",\r\n    \"planoId\": \"{{planoId}}\"\r\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            },
            "url": {
              "raw": "http://localhost:3000/api/suites",
              "protocol": "http",
              "host": [
                "localhost"
              ],
              "port": "3000",
              "path": [
                "api",
                "suites"
              ]
            }
          },
          "response": []
        },
        {
          "name": "Update Suite",
          "request": {
            "method": "PUT",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              },
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"titulo\": \"Suite atualizada\",\n  \"descricao\": \"Descrição alterada\"\n}"
            },
            "url": {
              "raw": ""
            }
          },
          "response": []
        },
        {
          "name": "Delete Suite",
          "request": {
            "method": "DELETE",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": ""
            }
          },
          "response": []
        }
      ]
    },
    {
      "name": "Casos de Teste",
      "item": [
        {
          "name": "Listar Casos",
          "request": {
            "auth": {
              "type": "bearer",
              "bearer": [
                {
                  "key": "token",
                  "value": "{{token}}",
                  "type": "string"
                }
              ]
            },
            "method": "GET",
            "header": [],
            "url": {
              "raw": "http://localhost:3000/api/casos",
              "protocol": "http",
              "host": [
                "localhost"
              ],
              "port": "3000",
              "path": [
                "api",
                "casos"
              ]
            }
          },
          "response": []
        },
        {
          "name": "Criar Caso",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "let response = pm.response.json();\r",
                  "let casoId = response.id;\r",
                  "\r",
                  "pm.collectionVariables.set(\"casoId\", casoId);"
                ],
                "type": "text/javascript",
                "packages": {},
                "requests": {}
              }
            }
          ],
          "request": {
            "auth": {
              "type": "bearer",
              "bearer": [
                {
                  "key": "token",
                  "value": "{{token}}",
                  "type": "string"
                }
              ]
            },
            "method": "POST",
            "header": [],
            "body": {
              "mode": "raw",
              "raw": "{\r\n    \"titulo\": \"Cadastro com sucesso\",\r\n    \"descricao\": \"O usuário deve conseguir cadastrar um produto\",\r\n    \"prioridade\": \"ALTA\", \r\n    \"preCondicao\" : \"Possuir usuário válido para realizar a ação.\",\r\n    \"suiteId\": \"{{suiteId}}\"\r\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            },
            "url": {
              "raw": "http://localhost:3000/api/casos",
              "protocol": "http",
              "host": [
                "localhost"
              ],
              "port": "3000",
              "path": [
                "api",
                "casos"
              ]
            }
          },
          "response": []
        },
        {
          "name": "Executar Caso",
          "request": {
            "auth": {
              "type": "bearer",
              "bearer": [
                {
                  "key": "token",
                  "value": "{{token}}",
                  "type": "string"
                }
              ]
            },
            "method": "POST",
            "header": [],
            "body": {
              "mode": "raw",
              "raw": "{ \"idCaso\": \"uuid\", \"resultado\": \"SUCESSO\", \"observacao\": \"Login realizado com sucesso\" }"
            },
            "url": {
              "raw": "http://localhost:3000/api/casos/execucao",
              "protocol": "http",
              "host": [
                "localhost"
              ],
              "port": "3000",
              "path": [
                "api",
                "casos",
                "execucao"
              ]
            }
          },
          "response": []
        },
        {
          "name": "Update Caso",
          "request": {
            "method": "PUT",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              },
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"titulo\": \"Caso atualizado\",\n  \"descricao\": \"Descrição alterada\",\n  \"resultado\": \"SUCESSO\"\n}"
            },
            "url": {
              "raw": ""
            }
          },
          "response": []
        },
        {
          "name": "Delete Caso",
          "request": {
            "method": "DELETE",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": ""
            }
          },
          "response": []
        }
      ]
    },
    {
      "name": "Scripts de Teste",
      "item": [
        {
          "name": "Listar Scripts",
          "request": {
            "auth": {
              "type": "bearer",
              "bearer": [
                {
                  "key": "token",
                  "value": "{{token}}",
                  "type": "string"
                }
              ]
            },
            "method": "GET",
            "header": [],
            "url": {
              "raw": "http://localhost:3000/api/scripts",
              "protocol": "http",
              "host": [
                "localhost"
              ],
              "port": "3000",
              "path": [
                "api",
                "scripts"
              ]
            }
          },
          "response": []
        },
        {
          "name": "Criar Script",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "let response = pm.response.json();\r",
                  "let scriptId = response.id;\r",
                  "\r",
                  "pm.collectionVariables.set(\"scriptId\", scriptId);"
                ],
                "type": "text/javascript",
                "packages": {},
                "requests": {}
              }
            }
          ],
          "request": {
            "auth": {
              "type": "bearer",
              "bearer": [
                {
                  "key": "token",
                  "value": "{{token}}",
                  "type": "string"
                }
              ]
            },
            "method": "POST",
            "header": [],
            "body": {
              "mode": "raw",
              "raw": "{\r\n  \"casoId\": \"{{casoId}}\"\r\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            },
            "url": {
              "raw": "http://localhost:3000/api/scripts",
              "protocol": "http",
              "host": [
                "localhost"
              ],
              "port": "3000",
              "path": [
                "api",
                "scripts"
              ]
            }
          },
          "response": []
        },
        {
          "name": "Update Script",
          "request": {
            "method": "PUT",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              },
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"casoId\": \"{{casoId}}\"\n}"
            },
            "url": {
              "raw": ""
            }
          },
          "response": []
        },
        {
          "name": "Delete Script",
          "request": {
            "method": "DELETE",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": ""
            }
          },
          "response": []
        }
      ]
    },
    {
      "name": "Defeitos",
      "item": [
        {
          "name": "Listar Defeitos",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "http://localhost:3000/api/defeitos",
              "protocol": "http",
              "host": [
                "localhost"
              ],
              "port": "3000",
              "path": [
                "api",
                "defeitos"
              ]
            }
          },
          "response": []
        },
        {
          "name": "Criar Defeito",
          "request": {
            "auth": {
              "type": "bearer",
              "bearer": [
                {
                  "key": "token",
                  "value": "{{token}}",
                  "type": "string"
                }
              ]
            },
            "method": "POST",
            "header": [],
            "body": {
              "mode": "raw",
              "raw": "{ \"titulo\": \"Erro login\", \"descricao\": \"Sistema não permite login válido\", \"criticidade\": \"ALTA\" }",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            },
            "url": {
              "raw": "http://localhost:3000/api/defeitos",
              "protocol": "http",
              "host": [
                "localhost"
              ],
              "port": "3000",
              "path": [
                "api",
                "defeitos"
              ]
            }
          },
          "response": []
        },
        {
          "name": "adicionar comentario",
          "request": {
            "method": "POST",
            "header": [],
            "body": {
              "mode": "raw",
              "raw": "{\r\n  \"comentario\": \"Reproduzido em ambiente de teste\"\r\n}\r\n",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            },
            "url": {
              "raw": "http://localhost:3000/api/defeitos/{{defeitoId}}/comentarios",
              "protocol": "http",
              "host": [
                "localhost"
              ],
              "port": "3000",
              "path": [
                "api",
                "defeitos",
                "{{defeitoId}}",
                "comentarios"
              ]
            }
          },
          "response": []
        },
        {
          "name": "Update Defeito",
          "request": {
            "method": "PUT",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              },
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"titulo\": \"Defeito atualizado\",\n  \"descricao\": \"Descrição alterada\"\n}"
            },
            "url": {
              "raw": ""
            }
          },
          "response": []
        },
        {
          "name": "Delete Defeito",
          "request": {
            "method": "DELETE",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": ""
            }
          },
          "response": []
        }
      ]
    },
    {
      "name": "procedimentos",
      "item": [
        {
          "name": "Cadastrar Procedimento",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              },
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"acao\": \"Abrir página de login\",\n  \"resultadoEsperado\": \"Página de login deve ser exibida\",\n  \"criadoPor\": \"Manoel Leal\",\n  \"scriptId\": \"{{scriptId}}\"\n}"
            },
            "url": {
              "raw": "http://localhost:3000/api/procedimentos",
              "protocol": "http",
              "host": [
                "localhost"
              ],
              "port": "3000",
              "path": [
                "api",
                "procedimentos"
              ]
            }
          },
          "response": []
        },
        {
          "name": "Update Procedimento",
          "request": {
            "method": "PUT",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              },
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"acao\": \"Ação atualizada\",\n  \"resultadoEsperado\": \"Resultado alterado\"\n}"
            },
            "url": {
              "raw": ""
            }
          },
          "response": []
        },
        {
          "name": "Delete Procedimento",
          "request": {
            "method": "DELETE",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": ""
            }
          },
          "response": []
        }
      ]
    },
    {
      "name": "Auth - Login Admin",
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "let response = pm.response.json();\r",
              "let token = response.token;\r",
              "\r",
              "pm.collectionVariables.set(\"token\", token);"
            ],
            "type": "text/javascript",
            "packages": {},
            "requests": {}
          }
        }
      ],
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{ \"username\": \"admin\", \"senha\": \"admin\" }"
        },
        "url": {
          "raw": "http://localhost:3000/api/auth/login",
          "protocol": "http",
          "host": [
            "localhost"
          ],
          "port": "3000",
          "path": [
            "api",
            "auth",
            "login"
          ]
        }
      },
      "response": []
    }
  ],
  "event": [
    {
      "listen": "prerequest",
      "script": {
        "type": "text/javascript",
        "packages": {},
        "requests": {},
        "exec": [
          ""
        ]
      }
    },
    {
      "listen": "test",
      "script": {
        "type": "text/javascript",
        "packages": {},
        "requests": {},
        "exec": [
          ""
        ]
      }
    }
  ],
  "variable": [
    {
      "key": "token",
      "value": ""
    },
    {
      "key": "suiteId",
      "value": ""
    },
    {
      "key": "casoId",
      "value": ""
    },
    {
      "key": "defeitoId",
      "value": ""
    },
    {
      "key": "userId",
      "value": ""
    },
    {
      "key": "planoId",
      "value": ""
    },
    {
      "key": "scriptId",
      "value": ""
    },
    {
      "key": "base_url",
      "value": ""
    }
  ]
}


