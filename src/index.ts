import * as express from 'express';
import { NextFunction, Request, Response } from 'express';
import * as http from 'http';
import * as mongoose from 'mongoose';
import * as morgan from 'morgan';
import * as cors from 'cors';
import * as compress from 'compression';
import * as helmet from 'helmet';
import { EXCEPTION_REPORT, MONGODB_URI, TIMEZONE } from './configs';
import ExceptionCode from './exeptions/ExceptionCode';
import Exception from './exeptions/Exception';
import * as _ from 'lodash';
import routes from './routes';
import bearerToken from './middlewares/bearer.token';
import * as graphql from './graphql';
// import { redis } from './caches';
import dev from './helpers/dev';
import * as moment from 'moment-timezone';
import { verify } from 'jsonwebtoken';
import { JWT_SECRET } from '@private/configs/index';
import {User} from '@private/models';

const { makeExecutableSchema, addMockFunctionsToSchema } = require('graphql-tools');

const { ApolloServer } = require('apollo-server-express');
moment.tz.setDefault(TIMEZONE);

if (process.env.NODE_ENV !== 'test') mongoose.connect(MONGODB_URI);

const app            = express();
const server         = http.createServer(app);
const graphqlExpress = express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(compress());
app.use(bearerToken());

if (process.env.NODE_ENV === 'dev') {
    app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
}

app.use(async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            dev('connect mongodb error', 'error');

            // Reconnect if we can
            await mongoose.connect(MONGODB_URI);
        }


        // Redis handle error
        // if (redis.status !== 'ready') {
        //     dev('redis connect error', 'error');
        //     throw new Error();
        // }

    } catch (e) {
        return next(new Exception('server error', 500));
    }

    next();
});

app.use(routes);

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
    if (_.includes(EXCEPTION_REPORT, error.name)) {
        res.json({
            err: error.code,
            data: null,
            msg: error.message
        });
    } else {
        res.json({
            err: ExceptionCode.ERROR_SYSTEM_ERROR,
            data: null,
            msg: 'server error!'
        });
    }
});

app.use((req: Request, res: Response, next: NextFunction) => {
    res.json({
        err: 404,
        data: null,
        msg: 'request not found!'
    });
});
let schemaCmsGraphql = makeExecutableSchema({
    typeDefs: graphql.cms.typeDef,
    resolvers: graphql.cms.resolves
    // directiveResolvers: {
    //     requireLogged: graphql.machine.directiveResolvers.requireLogged
    // }
});

const serverCmsGraphql = new ApolloServer({
    schema: schemaCmsGraphql,
    debug: true,
    formatError: error => {
        console.log(error, 'other', 'error');
        return error;
    },
    // formatResponse: response => {
    //     console.log(response);
    //     return response;
    // },
    context: async ({ req }) => {
        let context: any = {
            // dataloaders: createLoaders()
        };
        // get the user token from the headers
        try {
            const token = req.headers.authorization;
            if (token) {
                // try to retrieve a user with the token
                // let machine       = await getMachineDataFromAccessToken(token);
                // context.machine = machine;
            }
        } catch (error) {
            console.log(error, 'other', 'error');
        }

        return context;
    }
});

let schemaWebBuilderGraphql = makeExecutableSchema({
    typeDefs: graphql.web_builder.typeDef,
    resolvers: graphql.web_builder.resolves,
    directiveResolvers: {
        requireLogged: graphql.web_builder.directiveResolvers.requireLogged
    }
});

const serverWebBuilderGraphql = new ApolloServer({
    schema: schemaWebBuilderGraphql,
    debug: true,
    formatError: error => {
        console.log(error, 'other', 'error');
        return error;
    },
    formatResponse: response => {
        console.log(response);
        return response;
    },
    context: async ({ req }) => {
        let context: any = {
            // dataloaders: createLoaders()
        };
        // get the user token from the headers
        try {
            const token = req.headers.authorization;
            if (token) {
                let tokenData: any = verify(token, JWT_SECRET);
                console.log('token', tokenData);
                let user_data = await User.findOne({_id: tokenData.id});
                context.user = user_data;
                // try to retrieve a user with the token
                // let u     = await getStaffDataFromAccessToken(token);
                // context.staff = staff;
                // staffId = staff.id;
            }
        } catch (error) {
            console.log(error, 'other', 'error');
        }

        return context;
    }
});

server.listen(3001);

console.log(`🚀 Server ready at http://localhost:${3001}`, 'other', 'log');

serverCmsGraphql.applyMiddleware({ app: graphqlExpress, path: '/graphql/cms' });
serverWebBuilderGraphql.applyMiddleware({ app: graphqlExpress, path: '/graphql/web' });


graphqlExpress.listen({
    port: 4001
}, () => {
    console.log(`🚀 Server graphql ready at http://localhost:${4001}`, 'other', 'log');
});


export default server; // for tests
