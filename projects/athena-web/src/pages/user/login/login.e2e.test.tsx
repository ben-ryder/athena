import {routes} from "../../../routes";
import {testUsers} from "@ben-ryder/athena-testing";

describe('Login Success Cases', () => {
  beforeEach( () => {
    const url = Cypress.env('apiBaseUrl') + "/testing/reset";
    cy.request({
      method: "POST",
      url,
      headers: {
        "testing-key": Cypress.env('apiTestingKey')
      }
    })
  })

  it('login works for test1', () => {
    cy.visit(routes.users.login);

    // Fill in details and submit form
    cy.get("#username").click().type(testUsers[0].username)
    cy.get("#password").click().type(testUsers[0].password)

    cy.get("button[type='submit']").click()

    cy.location('pathname')

    cy.location('pathname').should('equal', routes.vaults.list);
  })
})