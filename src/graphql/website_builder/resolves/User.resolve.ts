import { User } from '@private/models';
import { changeAlias, createHash, randomString } from '../../../helpers';
import * as _ from 'lodash';
import { DEFAULT_PASSWORD } from '../../../configs';

export default {
    Mutation: {
        registerUser: async (root, { user_name, name, phone_number, address, email }) => {
            let salt     = randomString(20);
            let password = createHash('sha1', DEFAULT_PASSWORD + salt);
            let user     = new User({
                user_name: user_name,
                name: name,
                email: changeAlias(email),
                salt: salt,
                password: password,
                name_slug: changeAlias(name),
                phone_number: phone_number,
                address: address
            });

            return await user.save();
        },

        updateUser: async (root, { id, name, phone_number, address, is_active, email }) => {

            let user_data = await User.findOne({ _id: id });

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
        }
    },
    Query: {
        user: async (root, { id }) => {
            return await User.findOne({ _id: id });
        }

    }

};