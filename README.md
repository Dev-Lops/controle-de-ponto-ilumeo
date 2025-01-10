# Controle de Ponto - Ilumeo

Aplicação para controle de ponto dos colaboradores, permitindo visualizar as horas trabalhadas, iniciar e finalizar turnos, além de acompanhar o total de horas dos dias anteriores.

## Funcionalidades

- **Visualização em tempo real** das horas trabalhadas no dia atual.
- **Início e término de turnos** de trabalho.
- **Histórico de horas trabalhadas** nos dias anteriores.
- **Cadastro de usuários** (apenas para administradores).
- **Carregamento com skeletons** para uma experiência fluida.
- **SEO otimizado** utilizando `next-seo`.
- **Responsividade** para dispositivos móveis e desktops.

---

## Tecnologias Utilizadas

### Frontend

- **Next.js** (Framework React)
- **Tailwind CSS** (Estilização)
- **React Hook Form + Zod** (Validação de formulários)
- **React Toastify** (Mensagens de notificação)

### Backend

- **Next.js API Routes** (Endpoints)
- **Prisma** (ORM para banco de dados)
- **PostgreSQL** (Banco de dados)

### Ferramentas e Configurações

- **Docker** (Ambiente de desenvolvimento e produção)
- **ESLint e Prettier** (Qualidade e formatação de código)
- **Cypress** (Testes E2E)

---

## Configuração e Instalação

### Pré-requisitos

- **Node.js** (v16 ou superior)
- **Docker** (opcional para rodar o banco de dados)

### Passos para rodar localmente

1. Clone o repositório:

   ```bash
   git clone https://github.com/seu-usuario/controle-de-ponto-ilumeo.git
   cd controle-de-ponto-ilumeo
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente:
   Crie um arquivo `.env.local` com os seguintes valores:

   ```.env
   DATABASE_URL=postgresql://user:password@localhost:5432/dbname
   NEXT_PUBLIC_ADMIN_PASSWORD=senha123
   ```

4. Inicie o servidor de desenvolvimento:

   ```bash
   npm run dev
   ```

5. Acesse a aplicação em: [http://localhost:3000](http://localhost:3000)

---

## Funcionalidades Detalhadas

### 1. Cadastro de Usuários

- A funcionalidade de cadastro é restrita para administradores.
- Para acessar, você precisará inserir a senha de administrador.
- **Senha padrão:** `senha123`.

### 2. Início e Finalização de Turnos

- O botão "Hora de entrada" inicia o relógio.
- O botão "Hora de saída" finaliza o turno e salva as informações no banco.

### 3. Histórico de Turnos

- A seção "Dias anteriores" exibe uma lista de turnos anteriores, com data e duração.

### 4. Skeletons para Carregamento

- Enquanto os dados estão sendo buscados, skeletons são exibidos para melhorar a experiência do usuário.

---

## Testes

### Executar Testes E2E (Cypress)

Certifique-se de que o servidor está rodando, então execute:

```bash
npm run cypress
```

---

## Deploy

### Deploy Frontend

- **Plataforma:** Vercel
- [Link da Aplicação](https://sua-aplicacao.vercel.app)

### Deploy Backend

- **Plataforma:** Render
- Banco de dados PostgreSQL configurado no Render.

---

## Contribuição

Contribuições são bem-vindas! Para contribuir:

1. Faça um fork do projeto.
2. Crie uma branch para sua feature: `git checkout -b minha-feature`.
3. Commit suas mudanças: `git commit -m 'Minha nova feature'`.
4. Envie para a branch principal: `git push origin minha-feature`.

---

## Licença

Este projeto está sob a licença MIT.
