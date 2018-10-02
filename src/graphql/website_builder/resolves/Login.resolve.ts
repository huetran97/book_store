import { User } from '@private/models';
import { sign } from 'jsonwebtoken';
import { ACCESS_TOKEN_WEB_EXPIRE_IN, JWT_SECRET, REFRESH_TOKEN_WEB_EXPIRE_IN, TOKEN_WEB_SALT } from '@private/configs';
import { changeAlias, createHash } from '../../../helpers';


export default {

    Mutation: {
        login: async (root, { user_name, password }) => {
            let user_data;

            user_data = await User.findOne({
                user_name: changeAlias(user_name)
            });

            if (!user_data)
                throw new Error('User not found');
            console.log('user', user_data);
            console.log('pass', createHash('sha1', '123' + user_data.salt));

            if (user_data.password !== createHash('sha1', password + user_data.salt))
                throw new Error('Wrong password!');


            let accessToken = sign({
                id: user_data.id,
                salt: TOKEN_WEB_SALT
            }, JWT_SECRET, {
                expiresIn: ACCESS_TOKEN_WEB_EXPIRE_IN
            });

            let refreshToken = sign({
                id: user_data.id,
                salt: TOKEN_WEB_SALT
            }, JWT_SECRET, {
                expiresIn: REFRESH_TOKEN_WEB_EXPIRE_IN
            });

            return {
                id: user_data.id,
                access_token: accessToken,
                refresh_token: refreshToken,
                user_name: user_data.user_name,
                sex: user_data.sex,
                name: user_data.name,
                avatar: user_data.avatar
            };
        }
    }
};