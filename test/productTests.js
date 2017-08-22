/* eslint-disable no-unused-expressions */
/* eslint-disable handle-callback-err */
/* eslint-disable no-unused-vars*/
process.env.NODE_ENV = "test";
const mongoose = require("mongoose");
const {bootstrapAdmin} = require('../Config');
const Models = require("../Models");
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const should = chai.should();
chai.use(chaiHttp);

function createProduct(ACCESS_TOKEN, dummyProductDetails, done) {
    chai.request(server)
        .post('/api/v1/product')
        .set('authorization', ACCESS_TOKEN)
        .send(dummyProductDetails)
        .end(done);
}

describe('Products', () => {
    let ACCESS_TOKEN = '';
    const dummyProductDetails = {
        "productName": "Dummy Product name",
        "description": "some random description",
        "totalStock": 10,
        "totalSold": 0,
        "price": 30,
        "discount": 0,
        "salePrice": 30,
        "brand": "VERY HI FI BRAND",
        "isAvailable": true
    };
    before((done) => {
        setTimeout(done, 20000);//hack to add delay for bootstrapping to get completed
    });
    before((done) => { //Before any test we will create a auth token
        const loginDetails = {
            loginId: bootstrapAdmin[0].phoneNumber,
            password: bootstrapAdmin[0].password
        };
        chai.request(server)
            .post('/api/v1/admin/login')
            .send(loginDetails)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.should.have.property('data');
                res.body.data.should.be.a('object');
                res.body.data.should.have.property('accessToken');
                res.body.data.accessToken.should.be.a('string');
                if (res.body && res.body.data && res.body.data.accessToken) ACCESS_TOKEN = `bearer ${res.body.data.accessToken}`;
                done();
            });
    });
    describe('/GET product', () => {
        before((done) => { //Before the test we empty the database
            Models.product.remove({}, (err) => {
                done();
            });
        });
        it('it should GET products and total product count should be zero', (done) => {
            chai.request(server)
                .get('/api/v1/product')
                .set('authorization', ACCESS_TOKEN)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message');
                    res.body.should.have.property('data');
                    res.body.data.should.have.property('totalCount');
                    res.body.data.should.have.property('products');
                    res.body.data.products.should.be.a('array');
                    res.body.data.products.length.should.be.eql(0);
                    res.body.data.totalCount.should.be.eql(0);
                    done();
                });
        });
    });
    describe('/POST product', () => {
        it('it should add the product', (done) => {
            createProduct(ACCESS_TOKEN, dummyProductDetails, (err, res) => {
                res.should.have.status(201);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.should.have.property('data');
                res.body.data.should.have.property('_id');
                res.body.data._id.should.be.a('string');
                done();
            });
        });
    });
    describe('/Delete product', () => {
        let productId = '';
        before((done) => { //first add the product
            createProduct(ACCESS_TOKEN, dummyProductDetails, (err, res) => {
                res.should.have.status(201);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.should.have.property('data');
                res.body.data.should.have.property('_id');
                res.body.data._id.should.be.a('string');
                productId = res.body.data._id;
                done();
            });
        });
        it('it should delete the product', (done) => {
            chai.request(server)
                .delete(`/api/v1/product/${productId}`)
                .set('authorization', ACCESS_TOKEN)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message');
                    res.body.should.have.property('data');
                    done();
                });
        });
    });
    describe('/GET product', () => {
        let productId = '';
        before((done) => { //first add the product
            createProduct(ACCESS_TOKEN, dummyProductDetails, (err, res) => {
                res.should.have.status(201);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.should.have.property('data');
                res.body.data.should.have.property('_id');
                res.body.data._id.should.be.a('string');
                productId = res.body.data._id;
                done();
            });
        });
        it('it should get the product', (done) => {
            chai.request(server)
                .get(`/api/v1/product`)
                .set('authorization', ACCESS_TOKEN)
                .query({productId})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message');
                    res.body.should.have.property('data');
                    res.body.data.should.have.property('totalCount');
                    res.body.data.should.have.property('products');
                    res.body.data.products.should.be.a('array');
                    res.body.data.products.length.should.be.eql(1);
                    res.body.data.totalCount.should.be.eql(1);
                    done();
                });
        });
    });
    describe('/UPDATE product', () => {
        let productId = '';
        before((done) => { //first add the product
            createProduct(ACCESS_TOKEN, dummyProductDetails, (err, res) => {
                res.should.have.status(201);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.should.have.property('data');
                res.body.data.should.have.property('_id');
                res.body.data._id.should.be.a('string');
                productId = res.body.data._id;
                done();
            });
        });
        it('it should update the product', (done) => {
            const updatedProduct = Object.assign({}, dummyProductDetails);
            updatedProduct.price = 10;
            updatedProduct.discount = 10;
            updatedProduct.salePrice = 9;
            updatedProduct.totalStock = 100;
            chai.request(server)
                .put(`/api/v1/product/${productId}`)
                .set('authorization', ACCESS_TOKEN)
                .send(updatedProduct)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message');
                    res.body.should.have.property('data');
                    done();
                });
        });
    });
});