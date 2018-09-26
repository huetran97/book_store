import * as Joi from 'joi';
import Validate from '../../helpers/validate';
import { responseUsecase } from '../../helpers';
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../configs';

interface RequestInterface {
    username: string
    password: string
}

export default function (request: RequestInterface): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            request = new Validate(request)
                .joi({
                    username: Joi.string().required(),
                    password: Joi.string().required()
                }).validate();

            let access_token = jwt.sign({
                id: 'demo'
            }, JWT_SECRET);

            return resolve(responseUsecase({
                data: {
                    access_token: access_token
                }
            }));

        } catch (e) {
            return reject(e);
        }
    });
}