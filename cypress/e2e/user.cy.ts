describe('Página do Usuário', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/users/ABCD1234');
  });

  it('Deve carregar as informações do usuário', () => {
    cy.contains('Relógio de ponto').should('be.visible');
    cy.contains('Horas de hoje').should('be.visible');
  });

  it('Deve exibir mensagem de erro ao tentar acessar um usuário inexistente', () => {
    cy.visit('http://localhost:3000/users/INVALI');
    cy.contains('Usuário não encontrado').should('be.visible');
  });
});
