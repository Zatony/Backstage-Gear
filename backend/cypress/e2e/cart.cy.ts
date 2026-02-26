/// <reference types="cypress" />

let cartToken: string;

before(() => {
  cy.task('resetDb');
  cy.request('POST', '/backstagegear/login', {
    email: "eva.nagy@example.com",
    password: "jelszo1"
  }).then(res => {
    cartToken = res.body.token;
  });
});

describe('cart tests', () => {
  
  describe('GET /backstagegear/me/cart', () => {

    it('should return all messages of a user', () => {
      cy.request({
        method: 'GET',
        url: '/backstagegear/me/cart',
        headers: {
          'x-access-token': cartToken
        }
      }).then(res => {
        expect(res.status).to.eq(200);
        expect(res.body).to.be.an('array');
      })
    });

    it('should fail without token', () => {
      cy.request({
        method: 'GET',
        url: '/backstagegear/me/cart',
        failOnStatusCode: false
      }).then(res => {
        expect(res.status).to.eq(401);
        expect(res.body).contain("Token szükséges.");
      })
    });

  });

  describe('GET /backstagegear/me/cart/:adId', () => {

    it('should return the exact messages of a user', () => {
      cy.request({
        method: 'GET',
        url: '/backstagegear/me/cart/2',
        headers: {
          'x-access-token': cartToken
        }
      }).then(res => {
        expect(res.status).to.eq(200);
        expect(res.body[0]).to.have.property('id', 2);
      })
    });

    it('should fail with the wrong id', () => {
      cy.request({
        method: 'GET',
        url: '/backstagegear/me/cart/6',
        headers: {
          'x-access-token': cartToken
        },
        failOnStatusCode: false
      }).then(res => {
        expect(res.status).to.eq(404);
        expect(res.body).contain("Nincs ilyen azonosítójú hirdetés.");
      })
    });

    it('should fail with the wrong format id', () => {
      cy.request({
        method: 'GET',
        url: '/backstagegear/me/cart/asd',
        headers: {
          'x-access-token': cartToken
        },
        failOnStatusCode: false
      }).then(res => {
        expect(res.status).to.eq(400);
        expect(res.body).contain("Nem megfelelő formátumú azonosító.");
      })
    });

    it('should fail without token', () => {
      cy.request({
        method: 'GET',
        url: '/backstagegear/me/cart/2',
        failOnStatusCode: false
      }).then(res => {
        expect(res.status).to.eq(401);
        expect(res.body).contain("Token szükséges.");
      })
    });

  });

})