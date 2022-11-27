import React, { useState, useEffect } from "react";
import axios from 'axios';
import CommentList from "./CommentList";
import CommentCreate from "./CommentCreate";

const PostList = () => {
    const [posts, setPosts] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            const result = await axios.get('http://posts-microservices-srv.com/posts');
            setPosts(result.data);
        }

        fetchData();
    },[]);

    const createList = (data) => {
        return Object.values(posts).map((post) => {
            return <div className="card" style={{ width: '30%', marginBottom: '20px' }} key={post.id}>
                <div className="card-body">
                    <h3>{post.title ?? '-'}</h3>
                </div>
                <hr/>
                <div className="card-body">
                    <CommentList comments={post.comments} />
                    <CommentCreate postId={post.id}/>
                </div>
            </div>
        });
    };

    return <div className="d-flex flex-row flex-wrap justify-content-between">
        {createList(posts)}
    </div>
}

export default PostList;