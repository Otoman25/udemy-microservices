import express from 'express';

const signout = (req: express.Request, res: express.Response) => {
    res.send("signout");
};

export { signout };