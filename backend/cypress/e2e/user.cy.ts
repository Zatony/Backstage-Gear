/// <reference types="cypress" />

let userToken: string;
let userAdminToken: string;

before(() => {
  cy.request('POST', '/backstagegear/login', {
    email: "eva.nagy@example.com",
    password: "jelszo1"
  }).then(res => {
    userToken = res.body.token;
  });

  cy.request('POST', '/backstagegear/login', {
    email: "admin@example.com",
    password: "admin"
  }).then(res => {
    userAdminToken = res.body.token;
  });
});

describe('user tests', () => {
  
  // GET

  describe('GET /backstagegear/me/is_admin', () => {

    it('should return false', () => {
      cy.request({
        method: 'GET',
        url: '/backstagegear/me/is_admin',
        headers: {
          'x-access-token': userToken
        }
      }).then(res => {
        expect(res.status).to.eq(200);
        expect(res.body).to.have.property('is_admin', false);
      })
    });

    it('should return true', () => {
      cy.request({
        method: 'GET',
        url: '/backstagegear/me/is_admin',
        headers: {
          'x-access-token': userAdminToken
        }
      }).then(res => {
        expect(res.status).to.eq(200);
        expect(res.body).to.have.property('is_admin', true);
      })
    });

    it('should fail without token', () => {
      cy.request({
        method: 'GET',
        url: '/backstagegear/me/is_admin',
        failOnStatusCode: false
      }).then(res => {
        expect(res.status).to.eq(401);
        expect(res.body).contain("Token szükséges.");
      })
    });

  });
})