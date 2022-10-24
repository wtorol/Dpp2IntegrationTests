class homeSaucePage {
  //Urls to get credentials and PWA access
  URLS = {
    localhost: {
      client: "http://localhost:4200",
      server: "http://localhost:3020/api/v2"
    },
    remote: {
      client: "http://54.39.177.218:8080",
      server: "http://54.39.177.218:3020/api/v2"
    }
  }
  urlTarget = ""; 
  // elements from DOM
  elements = {
    usernameInput: () => cy.get("input[type='email']"),
    passWordInput: () => cy.get("input[type='password']"),
    submitBtn: () => cy.get("button[type='submit']"),
    vcodeInput: () => cy.get("input[type='number']:nth-child(1)"),
  }
  setUrlTarget(urlTarget) {
    this.urlTarget = urlTarget;
  }  
  visitHome() {
    cy.viewport(390, 844)
    cy.visit(this.URLS[this.urlTarget].client, {
      onBeforeLoad: (win) => {
        win.sessionStorage.clear();
        win.localStorage.clear();
      }
    });
  } 
  async login() {
    //Load credentials from server
    type NewAccountCredentials = { username: string, password: string, vcode: number, uid: string };
    const serverUrl = this.URLS[this.urlTarget].server;
    let credentials = await new Promise<NewAccountCredentials>((resolve, reject) => {
      cy.request(serverUrl + '/test-accounts/free').then(response => {
        expect(response.body).to.have.property("username");
        resolve(response.body);
      })
    });
    //Submit the credentials to login 
    this.elements.usernameInput().type(credentials.username);
    this.elements.passWordInput().type(credentials.password);
    this.elements.submitBtn().click({force:true});
    this.validateAccount(credentials.vcode)
    return credentials.uid  //return the User id
  }

  validateAccount(vcode) {
    cy.get("app-validate header h4").should('have.text', 'Verify your email');
    this.elements.vcodeInput().type(vcode.toString())
    this.elements.submitBtn().click()
  }

  async cleanUp(userId) { 
        // must always delete the created account even if any of the above testing fails
      await new Promise<void>((resolve, reject) => {
      const serverUrl = this.URLS[this.urlTarget].server;
      cy.request("DELETE", `${serverUrl}/test-accounts/uid/${userId}`).then(response => {
        expect(response.status).to.be.equal(200);
        resolve();
        cy.log("test account is deleted")
      })      
    });
    
  }
  
}// Final 
module.exports = new homeSaucePage();