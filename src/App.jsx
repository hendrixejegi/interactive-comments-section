import './App.scss';
import Comment from './Comment'
import data from '../data.json'
import { useState } from 'react'

export default function App() {
  const { currentUser, comments: commentsData } = data;

  function updateIDRecursive(comment) {
    if (comment.replies && comment.replies.length > 0) {
      return {
        ...comment,
        replies: comment.replies.map(
          reply => updateIDRecursive(reply)
        ),
        id: String(comment.id)
      }
    } else {
      return {
        ...comment,
        id: String(comment.id)
      }
    }
  }

  const [comments, setComments] = useState(commentsData.map(
    comment => updateIDRecursive(comment)
  ))

  //Helper functions
  function generateUniqueId() {
    const timestamp = Date.now(); // Current timestamp in milliseconds
    const randomNum = Math.floor(Math.random() * 1000000); // Random number between 0 and 999999
    return `${timestamp}-${randomNum}`;
  }

  function handleSubmit(event) {
    event.preventDefault();
    const formElement = event.target;
    const formData = new FormData(formElement);

    addNewComment(formData);
    formElement.reset();
  }

  function addNewComment(formData, formElement) {
    const comment = formData.get('comment');
    if (comment === '') {
      return;
    };
    setComments(prevComments => (
      [
        ...prevComments,
        {
          "id": generateUniqueId(),
          "content": comment,
          "createdAt": "1 month ago",
          "score": 0,
          "user": {...currentUser},
          "replies": []
        },
      ]
    ))
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter') {
      const formElement = event.currentTarget;
      const formData = new FormData(formElement);
      addNewComment(formData);
      formElement.reset();
    } else {return}    
  }

  return (
    <main>
      {comments.map(comment => {
        const { replies } = comment;

        return (
          <div key={comment.id} className="comment-block">
            <Comment comment={comment} setComments={setComments} user={currentUser.username}/>
            {(replies.length > 0) && <div className="reply-block">
              {replies.map(reply => (
                <Comment
                  key={reply.id}
                  comment={reply}
                  setComments={setComments}
                  user={currentUser.username}
                />
              ))}
            </div>}
          </div>
        )
      })}
      <form action="#" onSubmit={handleSubmit} onKeyDown={handleKeyDown} method='post' className="create-comment">
        <img src={currentUser.image.png} alt="" />
        <textarea name="comment" id="comment" rows={5} placeholder='Add a comment...'></textarea>
        <button>Send</button>
      </form>
    </main>
  )
}