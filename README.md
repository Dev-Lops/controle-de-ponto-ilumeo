# **Controle de Ponto - Ilumeo**

Uma aplicação para controle de ponto e gestão de horas de trabalho. Desenvolvida com **Next.js**, **Prisma**, **PostgreSQL**, **Cypress**, e mais, a aplicação possui funcionalidades para registro de ponto, gestão de usuários e autenticação.

---

## **Funcionalidades Principais**

### **Página Inicial**

- **Acessar o sistema com código do usuário.**
  - Redireciona para a página do usuário correspondente.
  - Exibe mensagem de erro para códigos inválidos ou inexistentes.
- **Administração.**
  - Link para a página de verificação do admin.
  - Botão de adição para cadastro e gestão de usuários.
 
  - Senha para criar um novo usuário: minhasenha123.

---

### **Página do Usuário**

- **Exibição de detalhes do usuário.**
  - Exibe o nome, código e informações de criação.
- **Registro de ponto.**
  - Botão "Hora de entrada" para iniciar o relógio de ponto.
  - Botão "Hora de saída" para registrar o encerramento.
  - Tempo atual e total são exibidos e atualizados dinamicamente.
- **Histórico de sessões.**
  - Lista de sessões anteriores com data, horário e duração.

---

### **Página de Verificação do Admin**

- **Autenticação.**
  - Campo para senha administrativa.
  - Exibe mensagem de erro para senhas incorretas.
- **Gerenciamento de usuários.**
  - Listagem, criação e exclusão de usuários.

---

## **Tecnologias Utilizadas**

### **Frontend**

- **React** e **Next.js**: Criação de componentes e páginas dinâmicas.
- **TailwindCSS**: Estilização responsiva e customização.
- **Headless UI**: Componentes acessíveis e personalizáveis.
- **React Icons**: Ícones para botões e elementos visuais.

### **Backend**

- **Next.js API Routes**: Rotas para manipulação de dados.
- **Prisma ORM**: Interação com o banco de dados PostgreSQL.
- **PostgreSQL**: Banco de dados relacional.

### **Testes**

- **Cypress**: Testes end-to-end para garantir a integridade das funcionalidades.

---

## **Instalação**

1. Clone o repositório:

   ```bash
   git clone https://github.com/seu-usuario/controle-de-ponto-ilumeo.git
   cd controle-de-ponto-ilumeo
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente no arquivo `.env`:

   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/controle_de_ponto
   NEXT_PUBLIC_API_URL=http://localhost:3000/api
   ```

4. Execute as migrações do banco de dados:

   ```bash
   npx prisma migrate dev
   ```

5. Execute o servidor de desenvolvimento:

   ```bash
   npm run dev
   ```

---

## **Scripts Disponíveis**

- `npm run dev`: Inicia o servidor de desenvolvimento.
- `npm run build`: Compila a aplicação para produção.
- `npm start`: Inicia o servidor em modo produção.
- `npx prisma studio`: Acessa a interface visual do Prisma.
- `npx cypress open`: Abre a interface do Cypress para testes.
- `npx cypress run`: Executa os testes no terminal.

---

## **Testes E2E**

A aplicação possui cobertura de testes end-to-end utilizando o **Cypress**. Certifique-se de que o servidor está em execução antes de rodar os testes.

1. Execute os testes:

   ```bash
   npx cypress run
   ```

2. Para rodar testes interativos:

   ```bash
   npx cypress open
   ```

---

## **Estrutura de Pastas**

```plaintext
.
├── prisma/                 # Configurações do Prisma ORM
│   ├── schema.prisma       # Esquema do banco de dados
│   └── migrations/         # Migrações do banco
├── cypress/                # Configurações e testes Cypress
│   ├── e2e/                # Testes E2E
│   └── fixtures/           # Dados mockados para testes
├── public/                 # Recursos estáticos
├── src/                    # Código-fonte da aplicação
│   ├── components/         # Componentes reutilizáveis
│   ├── hooks/              # Custom hooks
│   ├── lib/                # Bibliotecas e configurações (e.g., Axios)
│   ├── pages/              # Páginas da aplicação
│   ├── services/           # Lógica de interação com APIs
│   └── utils/              # Utilidades diversas
└── .env                    # Variáveis de ambiente
```

---

## **Roadmap de Melhorias**

- Implementar autenticação JWT para maior segurança.
- Adicionar suporte a múltiplos idiomas.
- Melhorar acessibilidade (WCAG).
- Configurar CI/CD para deploy automático.

---

## **Contribuição**

1. Faça um fork do repositório.
2. Crie uma branch para sua feature/bugfix:

   ```bash
   git checkout -b feature/nova-feature
   ```

3. Envie seu PR com a descrição das alterações.

---

## **Licença**

Este projeto é licenciado sob a **MIT License**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
