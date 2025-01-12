
# Controle de Ponto Ilumeo

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://vercel.com)
[![Tests](https://img.shields.io/badge/tests-100%25-brightgreen)](https://github.com/Dev-Lops/controle-de-ponto-ilumeo/actions)

Uma aplicação poderosa e intuitiva para controle de ponto e gestão de horas trabalhadas, permitindo o registro e visualização de sessões diárias com gráficos detalhados.

---

## 🚀 Funcionalidades

- **Registro de ponto:** Controle as entradas e saídas com facilidade.
- **Sessões por dia:** Visualize suas sessões organizadas de forma clara e objetiva.
- **Gráficos dinâmicos:** Analise seus dados de horas trabalhadas com gráficos responsivos.
- **Totalização de horas:** Verifique o total de horas diárias e semanais.
- **Responsividade:** Interface adaptável para dispositivos móveis e desktops.

---

## 🛠️ Tecnologias Utilizadas

- **Next.js** 15.1.4
- **React** 18+
- **TypeScript**
- **Prisma ORM**
- **PostgreSQL**
- **Tailwind CSS**
- **Cypress** (testes end-to-end)
- **Chart.js** (gráficos interativos)

---

## ⚙️ Como Executar o Projeto

### Pré-requisitos

Certifique-se de ter o Node.js e o PostgreSQL instalados em sua máquina.

1. Clone o repositório:

   ```bash
   git clone https://github.com/Dev-Lops/controle-de-ponto-ilumeo.git
   cd controle-de-ponto-ilumeo
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente criando um arquivo `.env`:

   ```env
   DATABASE_URL=postgresql://usuario:senha@localhost:5432/controle_ponto
   ```

4. Execute as migrações do banco de dados:

   ```bash
   npx prisma migrate dev
   ```

5. Inicie a aplicação:

   ```bash
   npm run dev
   ```

A aplicação estará disponível em [http://localhost:3000](http://localhost:3000).

---

## ✅ Testes

### Cypress

- Para abrir o Cypress no modo interativo:

  ```bash
  npx cypress open
  ```

- Para rodar os testes automaticamente:

  ```bash
  npx cypress run
  ```

### Cobertura de Testes

Todos os componentes críticos foram testados, incluindo a página de dashboard, registros de ponto e gráficos dinâmicos.

---

## 🖼️ Capturas de Tela

### Dashboard Responsivo

![Dashboard Screenshot](https://via.placeholder.com/800x400)

---

## 📦 Deploy

A aplicação está hospedada na **Vercel**. Veja o deploy clicando [aqui](https://vercel.com).

---

## 💡 Próximos Passos

- Integração com APIs externas para relatórios avançados.
- Implementação de notificações em tempo real.
- Personalização de temas para diferentes usuários.

---

## 📄 Licença

Este projeto está sob a licença MIT.

---

### 👩‍💻 Contribuidores

Agradecemos a todos que contribuíram para este projeto! 😊
