import express from 'express';

const currentUser = (req: express.Request, res: express.Response) => {
    res.send("currentUser");
};

export { currentUser };