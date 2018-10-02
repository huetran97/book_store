import { User } from '@private/models';
import { changeAlias, createHash, randomString } from '../../../helpers';
import * as _ from 'lodash';

export default {
    Mutation: {
        registerUser: async (root, { user_name, name, phone_number, address, email, password }) => {
            let salt = randomString(20);
            let pass = createHash('sha1', password + salt);
            console.log('pass', password);
            let user = new User({
                user_name: user_name,
                name: name,
                email: changeAlias(email),
                salt: salt,
                password: pass,
                name_slug: changeAlias(name),
                phone_number: phone_number,
                address: address
            });

            return await user.save();
        },

        updateUser: async (root, { name, phone_number, address, is_active, email }, { user }) => {

            let user_data = await User.findOne({ _id: user._id });

            if (!user_data)
                throw new Error('User not found');

            if (name) {
                user_data.name      = name;
                user_data.name_slug = changeAlias(name);
            }

            if (email) {
                user_data.email = changeAlias(email);
            }

            if (phone_number)
                user_data.phone_number = phone_number;

            if (address)
                user_data.address = address;

            if (_.isBoolean(is_active))
                user_data.is_active = is_active;

            await user_data.save();

            return user_data;
        },
        changeUserPassword: async (root, { current_password, new_password }, { user }) => {
            let user_data = await User.findOne({ _id: user._id });
            if (!user_data)
                throw new Error('User not found');

            if (user_data.password !== createHash('sha1', current_password + user_data.salt))
                throw new Error('Wrong current password!');

            user_data.password = createHash('sha1', new_password + user_data.salt);

            await user_data.save();
        }
    },
    Query: {
        user: async (root, {}, { user }) => {
            return await user;
        }

    }

};