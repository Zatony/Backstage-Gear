/// <reference types="cypress" />

let profileToken: string;

before(() => {
  cy.task('resetDb');
  cy.request('POST', '/backstagegear/login', {
    email: "eva.nagy@example.com",
    password: "jelszo1"
  }).then(res => {
    profileToken = res.body.token;
  });
});

describe('profiles tests', () => {
  
  // GET

  describe('GET /backstagegear/profiles/:profileId', () => {

    it('should return the datas of the exact profile', () => {
      cy.request({
        method: 'GET',
        url: '/backstagegear/profiles/1',
      }).then(res => {
        expect(res.status).to.eq(200);
        expect(res.body).to.have.property('profile_id', 1);
      })
    });

    it('should fail with non-existent id', () => {
      cy.request({
        method: 'GET',
        url: '/backstagegear/profiles/999999999',
        failOnStatusCode: false
      }).then(res => {
        expect(res.status).to.eq(404);
        expect(res.body).contain("Ilyen azonosítójú felhasználó még nem létezik.");
      })
    });

    it('should fail with wrong format id', () => {
      cy.request({
        method: 'GET',
        url: '/backstagegear/profiles/asd',
        failOnStatusCode: false
      }).then(res => {
        expect(res.status).to.eq(400);
        expect(res.body).contain("Nem megfelelő formátumú azonosító.");
      })
    });

  });

  describe('GET /backstagegear/me/my_profile', () => {

    it("should return the datas of the user's profile", () => {
      cy.request({
        method: 'GET',
        url: '/backstagegear/me/my_profile',
        headers: {
          'x-access-token': profileToken
        }
      }).then(res => {
        expect(res.status).to.eq(200);
        expect(res.body).to.have.property('profile_id', 2);
      })
    });

    it('should fail without token', () => {
      cy.request({
        method: 'GET',
        url: '/backstagegear/me/my_profile',
        failOnStatusCode: false
      }).then(res => {
        expect(res.status).to.eq(401);
        expect(res.body).contain("Token szükséges.");
      })
    });

  });

  // PATCH

  describe('PATCH /backstagegear/me/my_profile/update_datas', () => {

    it('should update the datas of the exact profile', () => {
      cy.request({
        method: 'PATCH',
        url: '/backstagegear/me/my_profile/update_datas',
        headers: {
          'x-access-token': profileToken
        },
        body: {
          username: "eva.nagy",
          phone_number: "1234"
        }
      }).then(res => {
        expect(res.status).to.eq(200);
        expect(res.body).to.have.property('message', "Profil frissítve.");
      })
    });

    it('should fail without token', () => {
      cy.request({
        method: 'PATCH',
        url: '/backstagegear/me/my_profile/update_datas',
        body: {
          username: "eva.nagy",
          phone_number: "1234"
        },
        failOnStatusCode: false
      }).then(res => {
        expect(res.status).to.eq(401);
        expect(res.body).contain("Token szükséges.");
      })
    });

    it('should fail without body', () => {
      cy.request({
        method: 'PATCH',
        url: '/backstagegear/me/my_profile/update_datas',
        headers: {
          'x-access-token': profileToken
        },
        failOnStatusCode: false
      }).then(res => {
        expect(res.status).to.eq(400);
        expect(res.body).contain("Nem küldte el az adatokat.");
      })
    });

  });

  describe('PATCH /backstagegear/me/profiles/:profileId', () => {

    it('should vote the exact profile', () => {
      cy.request({
        method: 'PATCH',
        url: '/backstagegear/me/profiles/1',
        headers: {
          'x-access-token': profileToken
        },
        body: {
          vote: 1
        }
      }).then(res => {
        expect(res.status).to.eq(200);
        expect(res.body).contain("Szavazat rögzítve.");
      })
    });

    it('should fail with the wrong id', () => {
      cy.request({
        method: 'PATCH',
        url: '/backstagegear/me/profiles/999999999',
        headers: {
          'x-access-token': profileToken
        },
        body: {
          vote: 1
        },
        failOnStatusCode: false
      }).then(res => {
        expect(res.status).to.eq(404);
        expect(res.body).contain("Profil nem található.");
      })
    });

    it('should fail with the wrong format id', () => {
      cy.request({
        method: 'PATCH',
        url: '/backstagegear/me/profiles/asd',
        headers: {
          'x-access-token': profileToken
        },
        body: {
          vote: 1
        },
        failOnStatusCode: false
      }).then(res => {
        expect(res.status).to.eq(400);
        expect(res.body).contain("Nem megfelelő formátumú azonosító.");
      })
    });

    it('should fail with wrong value', () => {
      cy.request({
        method: 'PATCH',
        url: '/backstagegear/me/profiles/1',
        headers: {
          'x-access-token': profileToken
        },
        body: {
          vote: 10
        },
        failOnStatusCode: false
      }).then(res => {
        expect(res.status).to.eq(400);
        expect(res.body).contain("Érvénytelen szavazat.");
      })
    });

    it('should fail with own profile', () => {
      cy.request({
        method: 'PATCH',
        url: '/backstagegear/me/profiles/2',
        headers: {
          'x-access-token': profileToken
        },
        body: {
          vote: 1
        },
        failOnStatusCode: false
      }).then(res => {
        expect(res.status).to.eq(403);
        expect(res.body).contain("A saját profilodat nem szavazhatod.");
      })
    });

    it('should fail without token', () => {
      cy.request({
        method: 'PATCH',
        url: '/backstagegear/me/profiles/1',
        body: {
          vote: 1
        },
        failOnStatusCode: false
      }).then(res => {
        expect(res.status).to.eq(401);
        expect(res.body).contain("Token szükséges.");
      })
    });

  });
})