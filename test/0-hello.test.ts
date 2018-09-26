///<reference path="./global.d.ts"/>

import * as chai from 'chai';
import { expect } from 'chai';
import server from '../src';

chai.use(require('chai-http'));

const request = chai.request.agent(server);

describe('TEST API', () => {

    describe('/GET /', () => {
        it('should return Hello', done => {
            // Intest

            request
                .get('/')
                .set({
                    'Content-Type': 'application/json'
                })
                .end((err, res) => {
                    expect(res.status).equal(200);
                    expect(res.body.data).equal('Hello');
                    done();
                });
        });
    });
});
