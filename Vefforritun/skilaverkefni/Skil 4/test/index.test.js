//Importing the application to test
let server = require('../index');

//These are the actual modules we use
let chai = require('chai');
let should = chai.should();
let chaiHttp = require('chai-http');
chai.use(chaiHttp);

let apiUrl = "http://localhost:3000";

describe('Endpoint tests', () => {
    //###########################
    //The beforeEach function makes sure that before each test, 
    //there are exactly two tunes and two genres.
    //###########################
    beforeEach((done) => {
        server.resetState();
        done();
    });

    //###########################
    //Write your tests below here
    //###########################

    // BASIC ENDPOINTS (6):

    // 1. Test GET /tunes - should return an array with tunes
    it("GET /tunes", function (done) {
        chai.request(apiUrl).get('/api/v1/tunes').end( (err, res) => {
            chai.expect(res).to.have.status(200);
            chai.expect(res).to.be.json;
            chai.expect(res.body).to.be.a('array')
            chai.expect(res.body).to.have.length(2)
            
            done();
        });
    });

    // 2. Test GET /genres/:genreId/tunes/:tuneId for genreId: 1 and tuneId: 0 - should return a single tune object
    it("GET /genres/:genreId/tunes/:tuneId", function (done) {
        chai.request(apiUrl).get('/api/v1/genres/1/tunes/0').end( (err, res) => {
            chai.expect(res).to.have.status(200);
            chai.expect(res).to.be.json;
            chai.expect(res.body).to.be.a('object')
            
            chai.expect(res.body).to.have.property('id').eql("0");
            chai.expect(res.body).to.have.property('name').eql("Für Elise");
            chai.expect(res.body).to.have.property('genreId').eql("1");
            chai.expect(res.body).to.have.property('content');

            chai.expect(Object.keys(res.body).length).to.be.eql(4)

            done();
        });
    });

    // 3. Test PATCH /genres/:genreId/tunes/:tuneId for genreId: 1 and tuneId: 0 - should return a single tune object 
    it("PATCH /genres/:genreId/tunes/:tuneId", function (done) {
        chai.request(apiUrl).patch('/api/v1/genres/1/tunes/0')
        .set('Content-type', 'application/json')
        .send({"name": "new_name", "genreId": "0"})
        .end( (err, res) => {
            chai.expect(res).to.have.status(200);
            chai.expect(res).to.be.json;
            chai.expect(res.body).to.be.a('object')

            chai.expect(res.body).to.have.property("name").eql("new_name");
            chai.expect(res.body).to.have.property("id").eql("0");
            chai.expect(res.body).to.have.property('genreId').eql("0");
            chai.expect(res.body).to.have.property('content');

            chai.expect(Object.keys(res.body).length).to.be.eql(4)
            
            done();
        });
    });

    // 4. Test PATCH /genres/:genreId/tunes/:tuneId for genreId: 0 and tuneId: 0 - FAIL scenario; id's don't match
    it("PATCH /genres/:genreId/tunes/:tuneId failure; genre and id don't match", function (done) {
        chai.request(apiUrl).patch('/api/v1/genres/0/tunes/0')
        .set('Content-type', 'application/json')
        .send({"name": "new_name", "genreId": "0"})
        .end( (err, res) => {
            chai.expect(res).to.have.status(400);
            chai.expect(res).to.be.json;
            chai.expect(res.body).to.be.a('object')

            chai.expect(res.body).to.have.property('message').eql("Tune with id 0 does not have genre id 0.");
            chai.expect(Object.keys(res.body).length).to.be.eql(1)

            done();
        });
    });

    // 5. Test PATCH /genres/:genreId/tunes/:tuneId for genreId: 1 and tuneId: 0 - FAIL scenario; only unvalid property 
    it("PATCH /genres/:genreId/tunes/:tuneId failure; only unvalid property for tune", function (done) {
        chai.request(apiUrl).patch('/api/v1/genres/1/tunes/0')
        .set('Content-type', 'application/json')
        .send({"name": "", "genreId": "", "content": 123})
        .end( (err, res) => {
            chai.expect(res).to.have.status(400);
            chai.expect(res).to.be.json;
            chai.expect(res.body).to.be.a('object')

            chai.expect(res.body).to.have.property('message').eql("To update a tune, you need to provide a name, a non-empty content array, or a new genreId.");
            chai.expect(Object.keys(res.body).length).to.be.eql(1)

            done();
        });
    });

    // 6. Test GET /genres/:genreId/tunes/:tuneId for genreId: 1 and tuneId: 10 - FAIL scenario; tuneId doesn't exist
    it("GET /genres/:genreId/tunes/:tuneId failure; tuneId doesn't exist", function (done) {
        chai.request(apiUrl).get('/api/v1/genres/1/tunes/10').end( (err, res) => {
            chai.expect(res).to.have.status(404);
            chai.expect(res).to.be.json;
            chai.expect(res.body).to.be.a('object')

            chai.expect(res.body).to.have.property('message').eql("Tune with id 10 does not exist.");
            chai.expect(Object.keys(res.body).length).to.be.eql(1)
            
            done();
        });
    });   


    // POST TUNE TEST (1)
    it("POST /genres/:genreId/tunes/", function (done) {
        chai.request(apiUrl).post('/api/v1/genres/1/tunes/')
        .set('Content-type', 'application/json')
        .send({"name": "CrashSong"})
        .end( (err, res) => {
            chai.expect(res).to.have.status(500);
            done();
        });
    });   

    
    // POST GENRE TEST (1)
    TOKEN = 'HMAC f1a71952d1c9d661edf9fe8825ee711b6dc07408903de1e763a58baa0eda82fc'
    it("POST /genres", function (done) {
        chai.request(apiUrl).post('/api/v1/genres')
        .set('Authorization', TOKEN)
        .set('Content-type', 'application/json')
        .send({"genreName": "hackerman"})
        .end( (err, res) => {
            chai.expect(res).to.have.status(201);
            done();
        });
    });    

    // Do something weird
    it("GET /randomURL causes 405", function (done) {
        chai.request(apiUrl)
            .get('/randomURL')
            .end((err, res) => {
                res.should.have.status(405);
                done();
            });
    });
});