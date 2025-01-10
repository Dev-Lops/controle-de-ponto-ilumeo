describe("Página Inicial", () => {
  it("deve carregar a página inicial corretamente", () => {
    cy.visit("http://localhost:3000");

    // Verifica o título
    cy.contains("Ponto Ilumeo").should("be.visible");

    // Verifica o input de código do usuário
    cy.get("input[placeholder='Digite o código']").should("be.visible");
  });

  it("deve navegar para a página do usuário após enviar o código", () => {
    cy.visit("http://localhost:3000");
    cy.get("input[placeholder='Digite o código']").type("ABCD1234");
    cy.get("form").submit();

    // Verifica redirecionamento
    cy.url().should("include", "/users/ABCD1234");
  });

  it("deve exibir erro para código inválido", () => {
    cy.visit("http://localhost:3000");

    // Submete o formulário sem preencher o campo
    cy.get("input[placeholder='Digite o código']").clear();
    cy.get("form").submit();

    // Verifica a mensagem de erro
    cy.get("span.text-red-500").should("contain.text", "Campo obrigatório");
  });
});
