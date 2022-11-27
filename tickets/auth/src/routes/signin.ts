import express from 'express';

const signin = (req: express.Request, res: express.Response) => {
    res.send("signIn");
};

export { signin };