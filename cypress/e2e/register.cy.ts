/// <reference types="cypress" />
describe("Register test", () => {
  it("should log in wrong with void field", () => {
    cy.visit("/register");

    cy.get('input[placeholder="Email"]').type("john@mail.com");

    cy.get("form").submit();

    cy.get(".toast-content", { timeout: 8000 })
      .should("be.visible")
      .and("contain", "Please fill in all fields.");
  });

  it("should log in wrong passwords no", () => {
    cy.visit("/register");

    cy.get('input[placeholder="Name"]').type("John");
    cy.get('input[placeholder="Email"]').type("john@mail.com");
    cy.get('input[placeholder="Password"').type("123123");
    cy.get('input[placeholder="Repeat password"').type("asds2");

    cy.get("form").submit();

    cy.get(".toast-content", { timeout: 8000 })
      .should("be.visible")
      .and("contain", "Passwords do not match. Please try again.");
  });

  it("should success and create user successfully", () => {
    cy.visit("/register");

    cy.get('input[placeholder="Name"]').type("John");
    cy.get('input[placeholder="Email"]').type("john@mail.com");
    cy.get('input[placeholder="Password"').type("123123");
    cy.get('input[placeholder="Repeat password"').type("123123");

    cy.get("form").submit();

    cy.url().should("include", "/main");
  });
});
