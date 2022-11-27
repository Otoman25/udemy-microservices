const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
const posts = {};

app.use(bodyParser.json());
app.use(cors());

app.post('/event', (req, res) => {
    const event = req.body.eventType;
    const { id, status, content, postId } = req.body.data;
    let newStatus = 'approved';
    console.log("Event: " + event, req.body.data);
    
    if(event !== 'CommentCreated') {
        res.status(403).send('Failure');
    }

    newStatus = content.includes('orange') ? 'rejected' : 'approved';

    axios.post('http://events-cluster-srv:4005/event-bus', {eventType: 'CommentModerated', data: {id, postId, status: newStatus}});

    res.status(200).send('Success');
});

app.listen(4003, () => {
    console.log("Moderation service running on port 4003");
});