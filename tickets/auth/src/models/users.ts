import mongoose, { Schema } from 'mongoose';
import { Password } from '../utils/password';

// expected parameters to build a user
interface UserProperties {
    email: string,
    password: string,
};

// defining own methods to add to the mongoose model
interface UserModel extends mongoose.Model<any> {
    build(properties: UserProperties): UserDocument,
}

// structure of a single user returned from mongoose
interface UserDocument extends mongoose.Document {
    email: string;
    password: string;
}

// Schema for the mongoose model
const userSchema: Schema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    }
});

userSchema.pre('save', async function(done) {
    if (this.isModified('password')) {
        const hashed = await Password.toHash(this.get('password'));
        this.set('password', hashed);
    }

    done();
});

userSchema.statics.build = (properties: UserProperties) => {
    return new User(properties);
}

const User = mongoose.model<UserDocument, UserModel>('User', userSchema);

export { User };