import { json } from 'body-parser';
import express from 'express';
import 'express-async-errors'; // Allows for auto handling of async routes
import mongoose from 'mongoose';
import { NotFoundError } from './errors/NotFoundError';
import { errorHandler } from './middlewares/error-handler';

import { currentUser } from './routes/current-user';
import { signin } from './routes/signin';
import { signout } from './routes/signout';
import { signup } from './routes/signup';
import { signupValidator } from './validators/validators';

const app = express();
const router = express.Router();

app.use(json());

app.use(router.get('/api/users/currentuser', currentUser));
app.use(router.post('/api/users/signin', signin));
app.use(router.post('/api/users/signout', signout));
app.use(router.post('/api/users/signup', signupValidator, signup));

// // Example of an async route
// app.all('*', async (req, res, next) => {
//     next(new NotFoundError());
// })

// This one uses the benefits from 'express-async-errors'
app.all('*', async () => {
    throw new NotFoundError();
});

app.use(errorHandler);

const start = async() => {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth').catch((err) => {
        console.error(err);
    });

    app.listen(3000, () => {
        console.log("Listening on port 3000");
    });
};

start();