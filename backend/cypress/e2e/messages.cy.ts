/// <reference types="cypress" />

let messageToken: string;

before(() => {
  cy.task('resetDb');
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
        url: '/backstagegear/me/sent_messages/3',
        headers: {
          'x-access-token': messageToken
        }
      }).then(res => {
        expect(res.status).to.eq(200);
        expect(res.body[0]).to.have.property('id', 3);
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

  // POST

  describe('POST /backstagegear/me/new_message/:recId', () => {

    it('should send a new message to another user', () => {
      cy.request({
        method: 'POST',
        url: '/backstagegear/me/new_message/3',
        headers: {
          'x-access-token': messageToken
        },
        body: {
          content: "Szia, mizu?"
        }
      }).then(res => {
        expect(res.status).to.eq(201);
        expect(res.body).contain("Sikeres üzenetküldés.");
      })
    });

    it('should fail with empty field', () => {
      cy.request({
        method: 'POST',
        url: '/backstagegear/me/new_message/3',
        headers: {
          'x-access-token': messageToken
        },
        body: {
          content: ""
        },
        failOnStatusCode: false
      }).then(res => {
        expect(res.status).to.eq(400);
        expect(res.body).contain("Hibásan vagy nem megfelelően megadott adatok.");
      })
    });

    it('should fail with missing field', () => {
      cy.request({
        method: 'POST',
        url: '/backstagegear/me/new_message/3',
        headers: {
          'x-access-token': messageToken
        },
        body: {
        },
        failOnStatusCode: false
      }).then(res => {
        expect(res.status).to.eq(400);
        expect(res.body).contain("Hibásan vagy nem megfelelően megadott adatok.");
      })
    });

    it('should fail with missing body', () => {
      cy.request({
        method: 'POST',
        url: '/backstagegear/me/new_message/3',
        headers: {
          'x-access-token': messageToken
        },
        failOnStatusCode: false
      }).then(res => {
        expect(res.status).to.eq(400);
        expect(res.body).contain("Nem küldte el az adatokat.");
      })
    });

    it('should fail without token', () => {
      cy.request({
        method: 'POST',
        url: '/backstagegear/me/new_message/3',
        body: {
          content: "Szia, mizu?"
        },
        failOnStatusCode: false
      }).then(res => {
        expect(res.status).to.eq(401);
        expect(res.body).contain("Token szükséges.");
      })
    });

    it('should fail with the wrong id', () => {
      cy.request({
        method: 'POST',
        url: '/backstagegear/me/new_message/999999999',
        headers: {
          'x-access-token': messageToken
        },
        body: {
          content: "Szia, mizu?"
        },
        failOnStatusCode: false
      }).then(res => {
        expect(res.status).to.eq(404);
        expect(res.body).contain("Ez a felhasználó nem létezik.");
      })
    });

    it('should fail with the wrong format id', () => {
      cy.request({
        method: 'POST',
        url: '/backstagegear/me/new_message/asd',
        headers: {
          'x-access-token': messageToken
        },
        body: {
          content: "Szia, mizu?"
        },
        failOnStatusCode: false
      }).then(res => {
        expect(res.status).to.eq(400);
        expect(res.body).contain("Nem megfelelő formátumú azonosító.");
      })
    });

  });

  // PATCH

  describe('PATCH /backstagegear/me/update_message/:messId', () => {

    it('should update the content of the exact message', () => {
      cy.request({
        method: 'PATCH',
        url: '/backstagegear/me/update_message/3',
        headers: {
          'x-access-token': messageToken
        },
        body: {
          content: "Szia, mizu?"
        }
      }).then(res => {
        expect(res.status).to.eq(204);
      })
    });

    it('should fail with the wrong id', () => {
      cy.request({
        method: 'PATCH',
        url: '/backstagegear/me/update_message/999999999',
        headers: {
          'x-access-token': messageToken
        },
        body: {
          content: "Szia, mizu?"
        },
        failOnStatusCode: false
      }).then(res => {
        expect(res.status).to.eq(404);
        expect(res.body).contain("Nem létezik ilyen üzenet.");
      })
    });

    it('should fail with the wrong format id', () => {
      cy.request({
        method: 'PATCH',
        url: '/backstagegear/me/update_message/asd',
        headers: {
          'x-access-token': messageToken
        },
        body: {
          content: "Szia, mizu?"
        },
        failOnStatusCode: false
      }).then(res => {
        expect(res.status).to.eq(400);
        expect(res.body).contain("Nem megfelelő formátumú azonosító.");
      })
    });

    it('should fail without token', () => {
      cy.request({
        method: 'PATCH',
        url: '/backstagegear/me/update_message/3',
        body: {
          content: "Szia, mizu?"
        },
        failOnStatusCode: false
      }).then(res => {
        expect(res.status).to.eq(401);
        expect(res.body).contain("Token szükséges.");
      })
    });

    it('should fail with empty field', () => {
      cy.request({
        method: 'PATCH',
        url: '/backstagegear/me/update_message/3',
        headers: {
          'x-access-token': messageToken
        },
        body: {
          content: ""
        },
        failOnStatusCode: false
      }).then(res => {
        expect(res.status).to.eq(400);
        expect(res.body).contain("Hiányosan megadott adatok.");
      })
    });

    it('should fail with missing field', () => {
      cy.request({
        method: 'PATCH',
        url: '/backstagegear/me/update_message/3',
        headers: {
          'x-access-token': messageToken
        },
        body: {
        },
        failOnStatusCode: false
      }).then(res => {
        expect(res.status).to.eq(400);
        expect(res.body).contain("Hiányosan megadott adatok.");
      })
    });

    it('should fail without body', () => {
      cy.request({
        method: 'PATCH',
        url: '/backstagegear/me/update_message/3',
        headers: {
          'x-access-token': messageToken
        },
        failOnStatusCode: false
      }).then(res => {
        expect(res.status).to.eq(400);
        expect(res.body).contain("Nem küldte el az adatokat.");
      })
    });

  });

  // DELETE

  describe('DELETE /backstagegear/me/incoming_messages/:messId', () => {

    it('should delete the exact incoming message', () => {
      cy.request({
        method: 'DELETE',
        url: '/backstagegear/me/incoming_messages/1',
        headers: {
          'x-access-token': messageToken
        }
      }).then(res => {
        expect(res.status).to.eq(204);
      })
    });

  });

  describe('DELETE /backstagegear/me/sent_messages/:messId', () => {

    it('should delete the exact sent message', () => {
      cy.request({
        method: 'DELETE',
        url: '/backstagegear/me/sent_messages/3',
        headers: {
          'x-access-token': messageToken
        }
      }).then(res => {
        expect(res.status).to.eq(204);
      })
    });

  });

})