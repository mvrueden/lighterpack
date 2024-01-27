import express, {Request, Response} from "express"
import * as database from "./user.service"
import {StatusCodes} from "http-status-codes";

export const usersRouter = express.Router()

usersRouter.post('/register', async (req : Request, res : Response) => {
    const password = req.body
    const email = req.body.email.trim();
    const username = req.body.username.toLowerCase().trim();
    const errors = [];
    if (!username) {
        errors.push({ field: 'username', message: 'Please enter a username.' });
    }
    if (username && (username.length < 3 || username.length > 32)) {
        errors.push({ field: 'username', message: 'Please enter a username between 3 and 32 characters.' });
    }
    if (!email) {
        errors.push({ field: 'email', message: 'Please enter an email.' });
    }
    if (!password) {
        errors.push({ field: 'password', message: 'Please enter a password.' });
    }
    if (password && (password.length < 5 || password.length > 60)) {
        errors.push({ field: 'password', message: 'Please enter a password between 5 and 60 characters.' });
    }
    if (errors.length) {
        return res.status(StatusCodes.BAD_REQUEST).json({ errors });
    }

    // logWithRequest(req, { message: 'Attempting to register', username });

    if (await database.findByUsername(username)) {
        // logWithRequest(req, { message: 'User exists', username });
        return res.status(StatusCodes.BAD_REQUEST).json({ errors: [{ field: 'username', message: 'That username already exists, please pick a different username.' }] });
    }
    if (await database.findByEmail(email)) {
        // logWithRequest(req, { message: 'User email exists', email });
        return res.status(StatusCodes.BAD_REQUEST).json({ errors: [{ field: 'email', message: 'A user with that email already exists.' }] });
    }

    const newUser = await database.create(req.body);
    // const out = { username, library: JSON.stringify(newUser.library), syncToken: 0 };
    // res.cookie('lp', token, { path: '/', maxAge: 365 * 24 * 60 * 1000 });
    return res.status(StatusCodes.CREATED).json({newUser});

});