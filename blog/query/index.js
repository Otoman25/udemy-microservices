const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
const posts = {};

app.use(bodyParser.json());
app.use(cors());

const handleEvent = (eventType, data) => {
    console.log("Event: " + eventType, data);
    
    switch(eventType) {
        case 'PostCreated':
            posts[data.id] = {id: data.id, title: data.title, comments: []};
            break;
        case 'PostDeleted':
            if(data.id in posts) {
                delete(posts[data.id]);
            }
            break;
        case 'CommentCreated':
            if(data.postId in posts) {
                posts[data.postId].comments.push({ id: data.id, content: data.content, status: data.status });
            }
            break;
        case 'CommentDeleted':
            if(data.postId in posts) {
                const commentToDelete = posts[data.postId].comments.find(comment => comment.id === data.id);
                if(commentToDelete) {
                    delete(commentToDelete);
                }
            }
            break;
        case 'CommentUpdated':
            if(data.postId in posts) {
                let indexOfComment = posts[data.postId].comments.findIndex(comment => comment.id === data.id);
                if(indexOfComment > -1) {
                    posts[data.postId].comments[indexOfComment] = data.update;
                }
            }
            break;
    }
}

app.get('/posts', (req, res) => {
    res.send(posts);
});

app.post('/event', (req, res) => {
    const eventType = req.body.eventType;
    const data = req.body.data;
    handleEvent(eventType, data);

    res.status(200).send('Success');
});

app.listen(4004, async () => {
    console.log("Query service running on port 4004");
    try {
    const existingEvents = await axios.get('http://events-cluster-srv:4005/service-start');

    if(!existingEvents) return;
    for(let event of existingEvents.data) {
        handleEvent(event.eventType, event.data);
    };
    } catch (error) {
        console.log("Error getting existing events from event bus");
    }
});