import express from 'express';

const signin = (req: express.Request, res: express.Response) => {
    const { email, password } = req.body;



    res.send("signIn");

};

export { signin };