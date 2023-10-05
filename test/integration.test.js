const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const expect = chai.expect;

chai.use(chaiHttp);

describe('Health Check API', () => {

  it('Should return status 200 OK if MySQL server is ON', (done) => {
    chai
      .request(server)
      .get('/healthz')
      .end((err, res) => {
        // expect(res).to.have.status(200);

        // Check the status code and exit accordingly
        if (res.status === 200) {
          console.log("------ TEST PASSED -----");
          done();
          //process.exit(0); 
          
        } else {
          console.log("------ TEST FAILED -----");
          
          //process.exit(1); 
        }
      });
  });

});
