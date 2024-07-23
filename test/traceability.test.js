import request from 'supertest';
import { expect } from 'chai';
import app from '../server';

describe('Traceability API', () => {
  let traceabilityId;

  it('should create a new traceability', (done) => {
    request(app)
      .post('/traceabilities')
      .send({
        product_id: 1,
        farm_id: 1,
        supplier_id: 1,
        retailer_id: 1,
        transportation_id: 1
      })
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.equal(201);
        expect(res.body).to.have.property('id');
        traceabilityId = res.body.id;
        done();
      });
  });

  it('should fetch the traceability by id', (done) => {
    request(app)
      .get(`/traceabilities/${traceabilityId}`)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('id', traceabilityId);
        done();
      });
  });

  it('should update the traceability', (done) => {
    request(app)
      .put(`/traceabilities/${traceabilityId}`)
      .send({
        product_id: 1,
        farm_id: 2,
        supplier_id: 1,
        retailer_id: 1,
        transportation_id: 1
      })
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('farm_id', 2);
        done();
      });
  });

  it('should delete the traceability', (done) => {
    request(app)
      .delete(`/traceabilities/${traceabilityId}`)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('message', 'Traceability deleted successfully');
        done();
      });
  });
});
