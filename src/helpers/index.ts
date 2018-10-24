import * as _ from 'lodash';
import * as crypto from 'crypto';

function uniqid() {
    let c = Date.now() / 1000;
    let d = c.toString(16).split('.').join('');
    while (d.length < 14) {
        d += '0';
    }
    return d;
}

type algorithm = 'sha1' | 'sha256' | 'md5';
export const createHash = (algorithm: algorithm, data) => {
    return crypto.createHash(algorithm).update(data).digest('hex');
};

export function nanoTime() {

    return Date.now();
}

export const changeAlias  = (alias) => {
    let str = alias;
    if (alias) {
        str = str.toLowerCase();
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
        str = str.replace(/đ/g, 'd');
    }


    return str;
};


export const sortByKeys = object => {
    const keys       = Object.keys(object);
    const sortedKeys = _.sortBy(keys);

    return _.fromPairs(
        _.map(sortedKeys, key => [key, object[key]])
    );
};


export function transID(prefix) {
    return (prefix + Math.round(Math.random() * 100000) + uniqid() + Math.round(Math.random() * 100000)).toUpperCase();
}

export const randomString = (len) => {
    const charSet    = 'ABCDEF012GHIJKL345MNOPQR678STUVWXYZ9';
    let randomString = '';
    for (let i = 0; i < len; i++) {
        let randomPoz = Math.floor(Math.random() * charSet.length);
        randomString += charSet.substring(randomPoz, randomPoz + 1);
    }
    return randomString;
};



export function responseUsecase(data: any = {}) {
    return {
        err: data.err || 0,
        data: data.data || null,
        msg: data.msg || null
    };
}