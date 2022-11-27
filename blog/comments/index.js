const express = require('express');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(cors());
const commentsByPostId = {};

app.get('/posts/:id/comments', (req, res) => {
    res.send(commentsByPostId[req.params.id] ?? []);
});

app.post('/posts/:id/comments', async (req, res) => {
    const commentId = randomBytes(4).toString('hex');
    const { content } = req.body;
    const comments = commentsByPostId[req.params.id] ?? [];
    const newComment = { id: commentId, content, status: 'pending' };

    comments.push(newComment); 
    commentsByPostId[req.params.id] = comments;

    const result = await axios.post('http://events-cluster-srv:4005/event-bus', {eventType: 'CommentCreated', data: {...newComment, postId: req.params.id}});

    res.status(201).send(comments);
});

app.post('/event', async (req, res) => {
    const { eventType, data } = req.body;
    console.log("Event: " + eventType, data);
    if(eventType === 'PostDeleted'){
        if(data.id in commentsByPostId) {
            delete(commentsByPostId[data.id]);
        }
    }

    if(eventType === 'CommentModerated') {
        let comment;

        if(data.postId in commentsByPostId) {
            comment = commentsByPostId[data.postId].find(element => element.id === data.id);
            comment.content = data.status === "rejected" ? 'comment moderated' : comment.content;
            comment.status = data.status;
        }

        console.log(eventType + ": ", comment);
        if(comment) {
            const result = await axios.post('http://events-cluster-srv:4005/event-bus', {eventType: 'CommentUpdated', data: { postId: data.postId, id: data.id, update: comment}});
        }
    }

    res.status(200).send('Success');
});

app.listen(4001, () => {
    console.log("Comment service running on port 4001");
});