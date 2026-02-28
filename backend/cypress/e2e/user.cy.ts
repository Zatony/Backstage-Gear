/// <reference types="cypress" />

let userToken: string;
let userAdminToken: string;

before(() => {
  cy.task('resetDb');
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

  // POST

  describe('POST /backstagegear/login', () => {

    it('should login a user', () => {
      cy.request({
        method: 'POST',
        url: '/backstagegear/login',
        body: {
          email: "user.three@example.com",
          password: "jelszo3"
        }
      }).then(res => {
        expect(res.status).to.eq(201);
        expect(res.body).to.have.property('token');
        expect(res.body).to.have.property('is_admin');
      })
    });

    it('should fail with incorrect password', () => {
      cy.request({
        method: 'POST',
        url: '/backstagegear/login',
        body: {
          email: "user.three@example.com",
          password: "jelszo"
        },
        failOnStatusCode: false
      }).then(res => {
        expect(res.status).to.eq(401);
        expect(res.body).contain("Hibásan megadott email vagy jelszó.");
      })
    });

    it('should fail with incorrect email', () => {
      cy.request({
        method: 'POST',
        url: '/backstagegear/login',
        body: {
          email: "user.four@example.com",
          password: "jelszo3"
        },
        failOnStatusCode: false
      }).then(res => {
        expect(res.status).to.eq(401);
        expect(res.body).contain("Hibásan megadott email vagy jelszó.");
      })
    });

    it('should fail without body', () => {
      cy.request({
        method: 'POST',
        url: '/backstagegear/login',
        failOnStatusCode: false
      }).then(res => {
        expect(res.status).to.eq(400);
        expect(res.body).contain("Nem küldte el az adatokat.");
      })
    });

  });

  describe('POST /backstagegear/signup', () => {

    it('should register a new user', () => {
      cy.request({
        method: 'POST',
        url: '/backstagegear/signup',
        body: {
          name: "Kovács Árpád",
          userName: "kovacs.arpad",
          email: "kovacs.arpad@gmail.com",
          phoneNumber: "36301234567",
          dateOfBirth: "1946-01-01",
          password: "asd"
        }
      }).then(res => {
        expect(res.status).to.eq(201);
        expect(res.body).to.have.property('message', "Sikeres regisztráció");
        expect(res.body).to.have.property('token');
      })
    });

    it('should fail with empty fields', () => {
      cy.request({
        method: 'POST',
        url: '/backstagegear/signup',
        body: {
          name: "",
          userName: "",
          email: "",
          phoneNumber: "",
          dateOfBirth: "",
          password: ""
        },
        failOnStatusCode: false
      }).then(res => {
        expect(res.status).to.eq(400);
        expect(res.body).contain("Hibásan vagy hiányosan megadott adatok.");
      })
    });

    it('should fail without body', () => {
      cy.request({
        method: 'POST',
        url: '/backstagegear/signup',
        failOnStatusCode: false
      }).then(res => {
        expect(res.status).to.eq(400);
        expect(res.body).contain("Nem küldte el az adatokat.");
      })
    });

    it('should fail with missing fields', () => {
      cy.request({
        method: 'POST',
        url: '/backstagegear/signup',
        body: {
          name: "Kovács Árpád",
          userName: "kovacs.arpad",
          email: "kovacs@gmail.com",
          password: "asd"
        },
        failOnStatusCode: false
      }).then(res => {
        expect(res.status).to.eq(400);
        expect(res.body).contain("Hibásan vagy hiányosan megadott adatok.");
      })
    });

  });

  // PATCH

  describe('PATCH /backstagegear/me/my_profile/update_password', () => {

    it('should update the password of a user', () => {
      cy.request({
        method: "PATCH",
        url: "/backstagegear/me/my_profile/update_password",
        headers: {
          'x-access-token': userToken
        },
        body: {
          password: "asd"
        }
      }).then(res => {
        expect(res.status).to.eq(204);
      })
    });

    it('should fail without token', () => {
      cy.request({
        method: "PATCH",
        url: "/backstagegear/me/my_profile/update_password",
        body: {
          password: "asd"
        },
        failOnStatusCode: false
      }).then(res => {
        expect(res.status).to.eq(401);
        expect(res.body).contain("Token szükséges.");
      })
    });

    it('should fail without body', () => {
      cy.request({
        method: "PATCH",
        url: "/backstagegear/me/my_profile/update_password",
        headers: {
          'x-access-token': userToken
        },
        failOnStatusCode: false
      }).then(res => {
        expect(res.status).to.eq(400);
        expect(res.body).contain("Nem küldte el az adatokat.");
      })
    });

    it('should fail with empty password field', () => {
      cy.request({
        method: "PATCH",
        url: "/backstagegear/me/my_profile/update_password",
        headers: {
          'x-access-token': userToken
        },
        body: {
          password: ""
        },
        failOnStatusCode: false
      }).then(res => {
        expect(res.status).to.eq(400);
        expect(res.body).contain("Hiányosan megadott adatok.");
      })
    });

  });

  // DELETE

  // describe('DELETE /backstagegear/me/my_profile/delete_my_profile', () => {

  //   it.only('should delete the exact profile', () => {
  //     cy.request({
  //       method: 'DELETE',
  //       url: '/backstagegear/me/my_profile/delete_my_profile',
  //       headers: {
  //         'x-access-token': userToken
  //       }
  //     }).then(res => {
  //       expect(res.status).to.eq(204);
  //     })
  //   });

  // });

})