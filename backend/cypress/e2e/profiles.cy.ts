/// <reference types="cypress" />

let profileToken: string;

before(() => {
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
})