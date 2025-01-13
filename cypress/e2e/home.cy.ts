describe('Página Inicial', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/');
  });

  it('Deve carregar a página inicial corretamente', () => {
    cy.contains('Ponto Ilumeo').should('be.visible'); // Verifica título
    cy.get('input[placeholder="Digite o código"]').should('exist'); // Campo de entrada
    cy.contains('Acessar').should('be.enabled'); // Botão habilitado
  });

  it('Deve redirecionar para http://localhost:3000/users/ABCD1234 ao digitar um código válido', () => {
    cy.get('input[placeholder="Digite o código"]').type('ABCD1234');
    cy.contains('Acessar').click();
    cy.url().should('include', 'http://localhost:3000/users/ABCD1234'); // Redirecionamento esperado
  });
});
