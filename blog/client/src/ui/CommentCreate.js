import axios from "axios";
import React, { useState } from "react";

const CommentCreate = ({ postId }) => {
    const [content, setContent] = useState('');
    const onSubmit = async (event) => {
        event.preventDefault();
        await axios.post(`http://posts-microservices-srv.com/posts/${postId}/comments`, { content });
        setContent('');
    }

    return <div>
        <form onSubmit={onSubmit}>
            <div className="form-group">
                <label>New comment</label>
                <input className="form-control" onChange={ e => setContent(e.target.value) }/>
            </div>
            <button className="btn btn-primary">Submit</button>
        </form>
    </div>;
};

export default CommentCreate;