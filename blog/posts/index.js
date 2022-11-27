const express = require('express');
const { randomBytes } = require('crypto');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
const posts = {};

app.use(bodyParser.json());
app.use(cors());

app.get('/posts', (req, res) => {
    res.send(posts);
});

app.post('/posts/create', async (req, res) => {
    const id = randomBytes(4).toString('hex');
    const { title } = req.body;
    posts[id] = { id, title };
    await axios.post(`http://events-cluster-srv:4005/event-bus`, {eventType: 'PostCreated', data: {id, title}}).catch((err) => console.log(err));
    res.status(201).send(posts[id]);
});

app.delete('/posts/:id', async (req, res) => {
    if(req.params.id in posts){
        delete posts[req.params.id];
        await axios.post(`http://events-cluster-srv:4005/event-bus`, {eventType: 'PostDeleted', data: {id: req.params.id}}).catch((error) => console.log("Post deleted - couldn't notify event bus"));
        res.status(200).send('Success');
        return;
    }

    res.status(503).send('Cannot find post');
});

app.listen(4000, () => {
    console.log("Posts service running on port 4000");
});