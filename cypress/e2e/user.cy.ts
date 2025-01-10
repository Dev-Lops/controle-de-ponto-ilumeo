describe("Página do Usuário", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/users/ABCD1234"); // Certifique-se de que a rota e o código existem
  });

  it("deve carregar as informações do usuário", () => {
    cy.contains("Relógio de ponto").should("be.visible");
    cy.contains("Horas de hoje").should("be.visible");
  });

  it("deve iniciar e parar o relógio", () => {
    cy.get("button").contains("Hora de entrada").click();
    cy.get(".animate-pulse").should("be.visible"); // Verifica a bolinha verde
    cy.get("button").contains("Hora de saída").click();
    cy.get(".animate-pulse").should("not.exist");
  });

  it("deve mostrar os registros anteriores", () => {
    cy.contains("Dias anteriores").should("be.visible");
    cy.get("ul li").should("have.length.greaterThan", 0);
  });
});
