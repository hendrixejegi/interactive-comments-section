import './App.scss';
import Comment from './Comment'
import data from '../data.json'
import { useState } from 'react'

export default function App() {
  const { currentUser, comments: commentsData } = data;
  const [comments, setComments] = useState(commentsData)

  return (
    <main>
      {comments.map(comment => {
        const { replies } = comment;
        const { username } = comment.user;

        return (
          <div key={comment.id} className="comment-block">
            <Comment comment={comment} user='' />
            {(replies.length > 0) && <div className="reply-block">
              {replies.map(reply => <Comment key={reply.id} comment={reply} user={username} />)}
            </div>}
          </div>
        )
      })}
    </main>
  )
}