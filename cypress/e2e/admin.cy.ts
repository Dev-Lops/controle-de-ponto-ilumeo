describe("Autenticação do Admin", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/admin/verify");
  });

  it("Deve exibir erro para senha incorreta", () => {
    cy.get('input[placeholder="Digite a senha de admin"]').type("senhaerrada");
    cy.contains("Autenticar").click();
    cy.contains("Senha incorreta. Tente novamente.").should("be.visible");
  });

  it("Deve redirecionar para a página de cadastro com senha correta", () => {
    cy.get('input[placeholder="Digite a senha de admin"]').type(
      "minhasenha123"
    );
    cy.contains("Autenticar").click();
    cy.url().should("include", "http://localhost:3000/register");
  });
});
