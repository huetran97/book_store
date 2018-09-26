import * as Joi from 'joi';
import ExceptionCode from '../exeptions/ExceptionCode';
import * as _ from 'lodash';

export default class Validate {
    private request;
    private JoiObject;

    constructor(request) {
        request = _.omit(request, _.filter(_.keys(request), function (key) {
            return _.isUndefined(request[key]) || _.isNaN(request[key]) || _.isNull(request[key]);
        }));

        this.request = request;
    }

    public joi = (JoiObject) => {
        this.JoiObject = Joi.object().keys(JoiObject).unknown();
        return this;
    };

    public xor = (data: string[] = []) => {
        this.JoiObject = this.JoiObject.xor(data);
        return this;
    };

    public or = (data: string[] = []) => {
        this.JoiObject = this.JoiObject.or(data);
        return this;
    };

    public nand = (data: string[] = []) => {
        this.JoiObject = this.JoiObject.nand(data);
        return this;
    };

    public when = (ref, options) => {
        this.JoiObject = this.JoiObject.when(ref, options);
        return this;
    };

    public with = (key, peers) => {
        this.JoiObject = this.JoiObject.with(key, peers);
        return this;
    };


    public validate = () => {
        let validate: any = Joi.validate(this.request, this.JoiObject);
        if (validate.error) {
            validate.error.message = 'request invalid';
            validate.error.code    = ExceptionCode.ERROR_REQUEST_INVALID;
            validate.error.errors  = validate.error.details.map(detail => {
                return detail.message;
            });

            throw validate.error;
        }

        return validate.value;
    };
}

const isDateYYYYMMDD = () => Joi.number().min(19000000).max(30000000);

const isMongoObjectId = () => Joi.string().hex().length(24);

const isEmailOrEmpty = () => Joi.string().email().optional().allow('');

export {
    isDateYYYYMMDD,
    isMongoObjectId,
    isEmailOrEmpty
}