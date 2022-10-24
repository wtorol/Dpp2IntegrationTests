type NewAccountCredentials = {username:string, password: string, vcode: number, uid: string};

const URLS = {
  localhost: {
    client: "http://localhost:4200",
    server: "http://localhost:3020/api/v2"
  },
  remote: {
    client: "http://54.39.177.218:8080",
    server: "http://54.39.177.218:3020/api/v2"
  }
}

const urlTarget = "remote";

const clientUrl = URLS[urlTarget].client;
const serverUrl = URLS[urlTarget].server;

describe('Simple smoke test', () => {
  it('checks that a new user can login, validate, and see the home page', async () => {

    /* BEFORE EACH TEST */
    cy.viewport(390, 844);
    // create a new non-validated account in the back-end
    let credentials = await new Promise<NewAccountCredentials>((resolve, reject)=>{
      cy.request(serverUrl + '/test-accounts/free').then(response=>{
        expect(response.body).to.have.property("username");
        resolve(response.body);
      })
    });
    cy.log("Thread main" + credentials.uid )
    
    // load the app - should default to the sign-in page
    cy.visit(clientUrl, {
      onBeforeLoad: (win) => {
        win.sessionStorage.clear();
        win.localStorage.clear();
      }
    });

    // sign-in
    cy.get("input[type='email']")
      .type(credentials.username)
      .should('have.value',credentials.username);
    cy.get("input[type='password']")
      .type(credentials.password)
      .should('have.value',credentials.password);
    cy.get("button[type='submit']")
      .click();

    // validate account
    cy.get("app-validate header h4").should('have.text','Verify your email');
    cy.get("input[type='number']:nth-child(1)").type(credentials.vcode.toString());
    cy.get("button[type='submit']").click();


    /* THE ACTUAL TEST */

    // verify that we are on the home page and see the correct greeting and workspace name
    cy.get("app-greeting h3").should('have.text','Hi QA Test! Primary');



    /* CLEANUP AFTER EACH TEST */

    // must always delete the created account even if any of the above testing fails
    await new Promise<void>((resolve, reject)=>{
      cy.request("DELETE",`${serverUrl}/test-accounts/uid/${credentials.uid}`).then(response=>{
        expect(response.status).to.be.equal(200);
        resolve();
        cy.log("erased")
      })
    });

  })
})