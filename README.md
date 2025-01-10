# **Controle de Ponto - Ilumeo**

Uma aplicação para controle de ponto, permitindo que colaboradores iniciem/encerrem turnos, acompanhem as horas trabalhadas no dia atual e visualizem o histórico de registros.

## **Sumário**

- [**Controle de Ponto - Ilumeo**](#controle-de-ponto---ilumeo)
  - [**Sumário**](#sumário)
  - [**Requisitos**](#requisitos)
  - [**Configuração do Ambiente**](#configuração-do-ambiente)
  - [**Executando a Aplicação**](#executando-a-aplicação)
  - [**Executando os Testes**](#executando-os-testes)
    - [**Testes Unitários**](#testes-unitários)
    - [**Testes E2E**](#testes-e2e)
  - [**Tecnologias Utilizadas**](#tecnologias-utilizadas)
  - [**Contribuição**](#contribuição)
  - [**Licença**](#licença)

---

## **Requisitos**

Antes de começar, certifique-se de que você tem as seguintes ferramentas instaladas:

- [Node.js](https://nodejs.org/) >= 18.x
- [Docker](https://www.docker.com/)
- [PostgreSQL](https://www.postgresql.org/) (se não for usar Docker)
- [Yarn](https://yarnpkg.com/) (opcional, mas recomendado)

---

## **Configuração do Ambiente**

1. Clone este repositório:

   ```bash
   git clone https://github.com/seu-usuario/controle-de-ponto.git
   cd controle-de-ponto
   ```

2. Crie um arquivo `.env` na raiz do projeto, baseado no `.env.example`:

   ```bash
   cp .env.example .env
   ```

   Atualize as variáveis no arquivo `.env` com os detalhes do seu banco de dados e outros parâmetros.

3. Suba o banco de dados com Docker:

   ```bash
   docker-compose up -d
   ```

   **Nota:** O arquivo `docker-compose.yml` já configura o PostgreSQL para a aplicação.

4. Instale as dependências:

   ```bash
   npm install
   ```

5. Configure o banco de dados usando o Prisma:

   ```bash
   npx prisma migrate dev
   ```

   Isso criará as tabelas necessárias no banco de dados.

6. (Opcional) Preencha o banco com dados iniciais:

   ```bash
   npx prisma db seed
   ```

---

## **Executando a Aplicação**

1. Inicie o servidor local:

   ```bash
   npm run dev
   ```

2. Abra o navegador e acesse:

   ```
   http://localhost:3000
   ```

---

## **Executando os Testes**

### **Testes Unitários**

1. Execute os testes unitários com o Jest:

   ```bash
   npm run test
   ```

2. Para executar os testes em modo interativo:

   ```bash
   npm run test:watch
   ```

3. Para exibir a cobertura dos testes:

   ```bash
   npm run test:coverage
   ```

---

### **Testes E2E**

1. Inicie a aplicação em um ambiente de teste:

   ```bash
   npm run dev
   ```

2. Abra o Cypress para executar os testes E2E:

   ```bash
   npm run test:e2e
   ```

3. Para rodar os testes E2E no terminal:

   ```bash
   npm run test:e2e:run
   ```

---

## **Tecnologias Utilizadas**

- **Front-end**:
  - Next.js
  - React
  - TypeScript
  - TailwindCSS

- **Back-end**:
  - Node.js
  - Prisma ORM
  - PostgreSQL

- **Testes**:
  - Jest (Unitários)
  - Cypress (E2E)

- **Ferramentas Auxiliares**:
  - ESLint
  - Prettier
  - Docker

---

## **Contribuição**

Sinta-se à vontade para abrir issues e enviar pull requests. Toda contribuição é bem-vinda!

---

## **Licença**

Este projeto está licenciado sob a [MIT License](LICENSE).

---
