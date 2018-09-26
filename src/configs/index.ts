if(process.env.NODE_ENV !== 'production') {
    const path = require('path');

    let env_path = path.join(__dirname, '../../.env');
    
    if (process.env.NODE_ENV === 'test') {
        env_path = path.join(__dirname, '../../.env.test');
    }
    
    // import .env variables
    require('dotenv-safe').load({
        allowEmptyValues: true,
        path: env_path
    });
    
}

declare var process: any;

export const JWT_SECRET  = process.env.JWT_SECRET;
export const MONGODB_URI = process.env.MONGODB_URI;

export const REDIS = {
    HOST: process.env.REDIS_HOST,
    PORT: process.env.REDIS_PORT,
    PREFIX: process.env.REDIS_PREFIX
};

export const DEFAULT_PASSWORD = process.env.DEFAULT_PASSWORD;
export const TIMEZONE      = process.env.TIMEZONE;

export const EXCEPTION_REPORT = [
    'Exception',
    'ValidationError'
];

export const CACHE = {
    REDIS_USER: 'USER_',
};