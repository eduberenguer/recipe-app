/// <reference types="cypress" />
describe("Login test", () => {
  it("should log in wrong with void field", () => {
    cy.visit("/login");

    cy.get('input[placeholder="Email"]').type("pepe@mail.com");

    cy.get("form").submit();

    cy.get(".toast-content", { timeout: 8000 })
      .should("be.visible")
      .and("contain", "Please fill in all fields.");
  });

  it("should log in succesfully with valid credentials", () => {
    cy.visit("/login");

    cy.get('input[placeholder="Email"]').type("pepe@mail.com");
    cy.get('input[placeholder="Password"').type("123123");

    cy.get("form").submit();

    cy.url().should("include", "/main");

    cy.get(".toast-content", { timeout: 8000 })
      .should("be.visible")
      .and("contain", "Login successfully");
  });

  it("should log in wrong with invalid credentials", () => {
    cy.visit("/login");

    cy.get('input[placeholder="Email"]').type("pepe@mail.com");
    cy.get('input[placeholder="Password"').type("invalidCredentials");

    cy.get("form").submit();

    cy.get(".toast-content", { timeout: 8000 })
      .should("be.visible")
      .and("contain", "Invalid email or password.");
  });
});
