# Blog and Ticket sales platform in a microservice architecture

A microservice project written in JS/TS with Docker & Kubernetes. Uses skaffold for dev purposes

Client communicates via requests to the /api/${service} routes
Services communicate via the nats streaming server and follows an event based architecture

/blog:
Simple implementation of a post/comment system with basic microservices. With a hand-written event bus

/docker:
An example docker file

/tickets:
Ticket sales platform in a microservice architecture. Using Mongo, Express, React, Node and nats-streaming-server as an event bus

- Auth service
- Client
- Common library
- Expiration service
- Infrastructure (kubernetes)
- Nats proof of concept
- Orders service
- Payments service
- Ticket service

Artifact from following and extending this Udemy course - https://www.udemy.com/course/microservices-with-node-js-and-react/ - Would recommend!
