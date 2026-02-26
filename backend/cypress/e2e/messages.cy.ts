/// <reference types="cypress" />

let messageToken: string;

before(() => {
  cy.request('POST', '/backstagegear/login', {
    email: "eva.nagy@example.com",
    password: "jelszo1"
  }).then(res => {
    messageToken = res.body.token;
  });
});

describe('messages tests', () => {

  // GET
  
  describe('GET /backstagegear/me/incoming_messages', () => {

    it('should return all the incoming messages of a user', () => {
      cy.request({
        method: 'GET',
        url: '/backstagegear/me/incoming_messages',
        headers: {
          'x-access-token': messageToken
        }
      }).then(res => {
        expect(res.status).to.eq(200);
        expect(res.body).to.be.an('array');
      })
    });

    it('should fail without token', () => {
      cy.request({
        method: 'GET',
        url: '/backstagegear/me/incoming_messages',
        failOnStatusCode: false
      }).then(res => {
        expect(res.status).to.eq(401);
        expect(res.body).contain("Token szükséges.");
      })
    });

  });

  describe('GET /backstagegear/me/incoming_messages/:messageId', () => {

    it('should return the datas of the exact message of a user', () => {
      cy.request({
        method: 'GET',
        url: '/backstagegear/me/incoming_messages/2',
        headers: {
          'x-access-token': messageToken
        }
      }).then(res => {
        expect(res.status).to.eq(200);
        expect(res.body[0]).to.have.property('id', 2);
      })
    });

    it('should fail with the wrong id', () => {
      cy.request({
        method: 'GET',
        url: '/backstagegear/me/incoming_messages/4',
        headers: {
          'x-access-token': messageToken
        },
        failOnStatusCode: false
      }).then(res => {
        expect(res.status).to.eq(404);
        expect(res.body).contain("Nem létezik ilyen azonosítójú elem.");
      })
    });

    it('should fail with the wrong format id', () => {
      cy.request({
        method: 'GET',
        url: '/backstagegear/me/incoming_messages/asd',
        headers: {
          'x-access-token': messageToken
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
        url: '/backstagegear/me/incoming_messages/2',
        failOnStatusCode: false
      }).then(res => {
        expect(res.status).to.eq(401);
        expect(res.body).contain("Token szükséges.");
      })
    });

  });

  describe('GET /backstagegear/me/sent_messages', () => {

    it('should return all the sent messages of a user', () => {
      cy.request({
        method: 'GET',
        url: '/backstagegear/me/sent_messages',
        headers: {
          'x-access-token': messageToken
        }
      }).then(res => {
        expect(res.status).to.eq(200);
        expect(res.body).to.be.an('array');
      })
    });

    it('should fail without token', () => {
      cy.request({
        method: 'GET',
        url: '/backstagegear/me/sent_messages',
        failOnStatusCode: false
      }).then(res => {
        expect(res.status).to.eq(401);
        expect(res.body).contain("Token szükséges.");
      })
    });

  });

  describe('GET /backstagegear/me/sent_messages/:messageId', () => {

    it('should return the datas of the exact message of a user', () => {
      cy.request({
        method: 'GET',
        url: '/backstagegear/me/sent_messages/4',
        headers: {
          'x-access-token': messageToken
        }
      }).then(res => {
        expect(res.status).to.eq(200);
        expect(res.body[0]).to.have.property('id', 4);
      })
    });

    it('should fail with the wrong id', () => {
      cy.request({
        method: 'GET',
        url: '/backstagegear/me/sent_messages/1',
        headers: {
          'x-access-token': messageToken
        },
        failOnStatusCode: false
      }).then(res => {
        expect(res.status).to.eq(404);
        expect(res.body).contain("Nem létezik ilyen azonosítójú elem.");
      })
    });

    it('should fail with the wrong format id', () => {
      cy.request({
        method: 'GET',
        url: '/backstagegear/me/sent_messages/asd',
        headers: {
          'x-access-token': messageToken
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
        url: '/backstagegear/me/sent_messages/4',
        failOnStatusCode: false
      }).then(res => {
        expect(res.status).to.eq(401);
        expect(res.body).contain("Token szükséges.");
      })
    });

  });

})