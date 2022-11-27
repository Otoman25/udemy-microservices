import React from "react";

const CommentList = ({ comments }) => {
    const statusColours = {
        approved: 'text-success',
        pending: 'text-muted',
        rejected: 'text-danger',
    };

    return comments.length > 0 ?
     <div>
        <p><i>{comments.length} comment{comments.length > 1 ? 's' : ''}</i></p>
        <ul>
            {comments.map((comment) => <li key={comment.id} className={statusColours[comment.status]}>{comment.content}</li>)}
        </ul>
    </div>
    :
    '';
};

export default CommentList;