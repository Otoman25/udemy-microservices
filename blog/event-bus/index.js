const express = require('express');
const cors = require('cors');
const axios = require('axios');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(cors());

const serviceLocation = {
    'queryService': 'http://query-cluster-srv:4004/event',
    'commentService': 'http://comments-cluster-srv:4001/event',
    'postService': 'http://posts-cluster-srv:4000/event',
    'moderationService': 'http://moderation-cluster-srv:4003/event',
};

const eventTypeServiceMap = {
    'PostCreated': ['queryService'],
    'PostDeleted': ['queryService', 'commentService'],
    'CommentCreated': ['queryService', 'moderationService'],
    'CommentDeleted': ['queryService'],
    'CommentModerated': ['commentService'],
    'CommentUpdated': ['queryService'],
};

const eventQueue = [];

const handleEvent = async (eventType, data) => {
    if(!(eventType in eventTypeServiceMap)) {
        return {status: 403, description: 'Event not allowed'};
    } 

    const servicesToNotify = eventTypeServiceMap[eventType];

    await Promise.all(servicesToNotify.map(async (service) => {
        if((service in serviceLocation)) {
            await axios.post(serviceLocation[service], {
                eventType,
                data
            }).catch((error) => console.log(service + ' @ ' + serviceLocation[service] + ' unreachable'));
        }
    }));

    console.log("Event: " + eventType, data);

    return {status: 200, description: 'Success'};
};

app.post('/event-bus', async (req, res) => {
    if(!('eventType' in req.body) || !('data' in req.body)) {
        res.status(405).send('Method not allowed');
    }
    eventQueue.push(req.body);
    const result = await handleEvent(req.body.eventType, req.body.data);
    res.status(result.status).send(result.description);
});

app.get('/service-start', async (req, res) => {
    res.send(eventQueue);
});

app.listen(4005, () => {
    console.log("Event service running on port 4005");
});