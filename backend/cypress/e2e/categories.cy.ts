/// <reference types="cypress" />

describe('categories tests', () => {
  
  describe('GET /backstagegear/categories', () => {

    it('should return all the categories', () => {
      cy.request({
        method: 'GET',
        url: '/backstagegear/categories'
      }).then(res => {
        expect(res.status).to.eq(200);
        expect(res.body).to.be.an('array');
      })
    });

  });

})