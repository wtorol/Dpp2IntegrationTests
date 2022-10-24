const loginPage = require("../../cypress/pages/LoginPage.cy")

describe("simple smoke test", () => {
    let userId;
    let tiempo = 0;
    beforeEach(() => {
        loginPage.setUrlTarget("remote");   //set "remote" or "local"
        loginPage.visitHome();  // load the app - should default to the sign-in page
        cy.wait(tiempo)
        userId = loginPage.login();  // Login and validate with credentials from Servers
        cy.wait(tiempo)
    })
    /* CLEANUP AFTER EACH TEST */
    afterEach(async () => {
        loginPage.cleanUp(await userId)
    })
    it("Login", () => {
        //   // /* THE ACTUAL TEST */
        // verify that we are on the home page and see the correct greeting and workspace name
        cy.wait(tiempo)
        cy.get("app-greeting h3").should('have.text', 'Hi QA Test! Primary');

    })

})