/// <reference types="cypress" />

let token: string;
let adminToken: string;

before(() => {
  cy.task('resetDb');
  cy.request('POST', '/backstagegear/login', {
    email: "eva.nagy@example.com",
    password: "jelszo1"
  }).then(res => {
    token = res.body.token;
  });

  cy.request('POST', '/backstagegear/login', {
    email: "admin@example.com",
    password: "admin"
  }).then(res => {
    adminToken = res.body.token;
  });
});

describe('advertisements tests', () => {

  // GET

  describe('GET /backstagegear/ads', () => {

    it('should return all the ads', () => {
      cy.request({
        method: 'GET',
        url: '/backstagegear/ads'
      }).then(res => {
        expect(res.status).to.eq(200);
        expect(res.body).to.be.an('array');
      })
    });

  });

  describe('GET /backstagegear/ads/:adId', () => {

    it('should return the datas of the exact advertisement', () => {
      cy.request({
        method: 'GET',
        url: '/backstagegear/ads/1'
      }).then(res => {
        expect(res.status).to.eq(200);
        expect(res.body[0]).to.have.property('id', 1);
      })
    });

    it('should fail with the wrong format id', () => {
      cy.request({
        method: 'GET',
        url: '/backstagegear/ads/asd',
        failOnStatusCode: false
      }).then(res => {
        expect(res.status).to.eq(400);
        expect(res.body).contain("Nem megfelelő formátumú azonosító.");
      })
    });

    it('should fail with a non-existent id', () => {
      cy.request({
        method: 'GET',
        url: '/backstagegear/ads/999999999',
        failOnStatusCode: false
      }).then(res => {
        expect(res.status).to.eq(404);
        expect(res.body).contain("Nincs ilyen azonosítójú elem.");
      })
    });

  });

  // describe('GET /backstagegear/filtered_ads', () => {

  //   it('should return the datas of the filtered advertisement', () => {
  //     cy.request({
  //       method: 'GET',
  //       url: '/backstagegear/filtered_ads/categoryId=2'
  //     }).then(res => {

  //     })
  //   })

  // });

  describe('GET /backstagegear/latest_ads', () => {

    it('should return the latest ads', () => {
      cy.request({
        method: 'GET',
        url: '/backstagegear/latest_ads'
      }).then(res => {
        expect(res.status).to.eq(200);
        expect(res.body).to.be.an('array');
      })
    });

  });

  describe('GET /backstagegear/brands', () => {

    it('should return the brands', () => {
      cy.request({
        method: 'GET',
        url: '/backstagegear/brands'
      }).then(res => {
        expect(res.status).to.eq(200);
        expect(res.body).to.be.an('array');
      })
    });

  });

  describe('GET /backstagegear/me/my_ads', () => {

    it('should return the advertisements of an exact user', () => {
      cy.request({
        method: 'GET',
        url: '/backstagegear/me/my_ads',
        headers: {
          'x-access-token': token
        }
      }).then(res => {
        expect(res.status).to.eq(200);
        expect(res.body[0]).to.have.property('id', 1);
      })
    });

    it('should fail without token', () => {
      cy.request({
        method: 'GET',
        url: '/backstagegear/me/my_ads',
        failOnStatusCode: false
      }).then(res => {
        expect(res.status).to.eq(401);
        expect(res.body).contain("Token szükséges.");
      })
    });

  });

  describe('GET /backstagegear/me/my_ads/:adId', () => {

    it('should return the datas of the exact advertisement', () => {
      cy.request({
        method: 'GET',
        url: '/backstagegear/me/my_ads/1',
        headers: {
          'x-access-token': token
        }
      }).then(res => {
        expect(res.status).to.eq(200);
        expect(res.body[0]).to.have.property('id', 1);
      })
    });

    it('should fail with the wrong id', () => {
      cy.request({
        method: 'GET',
        url: '/backstagegear/me/my_ads/2',
        headers: {
          'x-access-token': token
        },
        failOnStatusCode: false
      }).then(res => {
        expect(res.status).to.eq(404);
        expect(res.body).contain("Nem létezik ilyen aznosítójú elem.");
      })
    });

    it('should fail with the wrong format id', () => {
      cy.request({
        method: 'GET',
        url: '/backstagegear/me/my_ads/asd',
        headers: {
          'x-access-token': token
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
        url: '/backstagegear/me/my_ads/1',
        failOnStatusCode: false
      }).then(res => {
        expect(res.status).to.eq(401);
        expect(res.body).contain("Token szükséges.");
      })
    });

  });

  describe('GET /backstagegear/me/my_ads/update_ad/:adId', () => {

    it('should return the datas of the exact advertisement', () => {
      cy.request({
        method: 'GET',
        url: '/backstagegear/me/my_ads/update_ad/1',
        headers: {
          'x-access-token': token
        }
      }).then(res => {
        expect(res.status).to.eq(200);
        expect(res.body[0]).to.have.property('id', 1);
      })
    });

    it('should fail with the wrong id', () => {
      cy.request({
        method: 'GET',
        url: '/backstagegear/me/my_ads/update_ad/2',
        headers: {
          'x-access-token': token
        },
        failOnStatusCode: false
      }).then(res => {
        expect(res.status).to.eq(404);
        expect(res.body).contain("Nem létezik ilyen aznosítójú elem.");
      })
    });

    it('should fail with the wrong format id', () => {
      cy.request({
        method: 'GET',
        url: '/backstagegear/me/my_ads/update_ad/asd',
        headers: {
          'x-access-token': token
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
        url: '/backstagegear/me/my_ads/update_ad/1',
        failOnStatusCode: false
      }).then(res => {
        expect(res.status).to.eq(401);
        expect(res.body).contain("Token szükséges.");
      })
    });

  });

  describe('GET /backstagegear/me/reported_ads', () => {

    it('should return the reported advertisements', () => {
      cy.request({
        method: 'GET',
        url: '/backstagegear/me/reported_ads',
        headers: {
          'x-access-token': adminToken
        }
      }).then(res => {
        expect(res.status).to.eq(200);
        expect(res.body[0]).to.have.property('id', 2);
      })
    });

    it('should fail without token', () => {
      cy.request({
        method: 'GET',
        url: '/backstagegear/me/reported_ads',
        failOnStatusCode: false
      }).then(res => {
        expect(res.status).to.eq(401);
        expect(res.body).contain("Token szükséges.");
      })
    });

    it('should fail without admin token', () => {
      cy.request({
        method: 'GET',
        url: '/backstagegear/me/reported_ads',
        headers: {
          'x-access-token': token
        },
        failOnStatusCode: false
      }).then(res => {
        expect(res.status).to.eq(403);
        expect(res.body).contain("Unathorized: Admin jogosultság szükséges.");
      })
    });

  });

  describe('GET /backstagegear/me/reported_ads/:adId', () => {

    it('should return the datas of the exact reported advertisement', () => {
      cy.request({
        method: 'GET',
        url: '/backstagegear/me/reported_ads/2',
        headers: {
          'x-access-token': adminToken
        }
      }).then(res => {
        expect(res.status).to.eq(200);
        expect(res.body[0]).to.have.property('id', 2);
      })
    });

    it('should fail with the wrong id', () => {
      cy.request({
        method: 'GET',
        url: '/backstagegear/me/reported_ads/1',
        headers: {
          'x-access-token': adminToken
        },
        failOnStatusCode: false
      }).then(res => {
        expect(res.status).to.eq(404);
        expect(res.body).contain("Nincs ilyen azonosítójú jelentett hirdetés.");
      })
    });

    it('should fail with the wrong format id', () => {
      cy.request({
        method: 'GET',
        url: '/backstagegear/me/reported_ads/asd',
        headers: {
          'x-access-token': adminToken
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
        url: '/backstagegear/me/reported_ads/2',
        failOnStatusCode: false
      }).then(res => {
        expect(res.status).to.eq(401);
        expect(res.body).contain("Token szükséges.");
      })
    });

    it('should fail without admin token', () => {
      cy.request({
        method: 'GET',
        url: '/backstagegear/me/reported_ads/2',
        headers: {
          'x-access-token': token
        },
        failOnStatusCode: false
      }).then(res => {
        expect(res.status).to.eq(403);
        expect(res.body).contain("Unathorized: Admin jogosultság szükséges.");
      })
    });

  });

  // POST

  describe('POST /backstagegear/me/new_ad', () => {

    it('should create and delete a new advertisement', () => {
      cy.request({
        method: 'POST',
        url: '/backstagegear/me/new_ad',
        headers: {
          'x-access-token': token
        },
        body: {
          categoryId: 1,
          brandId: 1,
          itemName: "asd",
          price: 123,
          condition: "asd",
          description: "asd"
        }
      }).then(res => {
        expect(res.status).to.eq(201);
      });
    });

  });

  // PATCH

  describe('PATCH /backstagegear/me/my_ads/update_ad/:adId', () => {

    it('should update the exact advertisement', () => {
      cy.request({
        method: 'PATCH',
        url: '/backstagegear/me/my_ads/update_ad/3',
        headers: {
          'x-access-token': token
        },
        body: {
          price: 50000,
          condition: "használt"
        }
      }).then(res => {
        expect(res.status).to.eq(200);
      })
    });

  });

  // DELETE

  describe('DELETE /backstagegear/me/my_ads/:adId', () => {

    it('should delete the exact advertisement', () => {
      cy.request({
        method: 'DELETE',
        url: '/backstagegear/me/my_ads/3',
        headers: { 
          'x-access-token': token 
        }
      }).then(res => {
        expect(res.status).to.eq(204);
      });
    });

  });

});