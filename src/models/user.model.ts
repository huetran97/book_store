import * as mongoose from 'mongoose';

const Schema = new mongoose.Schema({
    _id: String,
    username: { type: String, index: true, required: true, unique: true },
    password: String,
    random_string: String,
    role: { type: String, index: true },
    secret_key: String
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

export interface UserModelInterface extends mongoose.Document {
    _id: string
    username: string
    password: string
    random_string: string
    role: string
    secret_key: string
    updated_at: Date
    created_at: Date
}

export default mongoose.model<UserModelInterface>('users', Schema);