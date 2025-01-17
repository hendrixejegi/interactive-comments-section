import './App.scss';
import Comment from './Comment';
import data from '../data.json';
import { useState, useEffect } from 'react';
import { generateUniqueId } from './utils/helper';
import { getDate } from './utils/date';

export default function App() {
  const { currentUser, comments: commentsData } = data;

  // Load comment data and change IDs to string
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

  // Add new comment to data
  function handleCommentSubmit(event) {
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
          "createdAt": getDate(),
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

  // Add new reply to comment
  const [replyTo, setReplyTo] = useState(null);
  const [replyingTo, setReplyingTo] = useState('')

  function showReplyInput(commentId) {
    setReplyTo(commentId);
  }

  function checkReplyingTo(comment) {
    let result = false;

    if (!replyTo) {
      return result;
    }

    result = traverseCommentID(comment);
    return result;
  }

  function traverseCommentID(comment) {
    if (comment.id === replyTo.id) {
      return true
    }

    if (comment.replies) {
      for (let reply of comment.replies) {
        if (traverseCommentID(reply)) {
          return true
        }
      }
    }
  }

  // Set state of reply-input when loaded to DOM
  useEffect(() => {
    replyTo && setReplyingTo(replyTo.user.username);
  }, [replyTo]);

  function handleReplySubmit(event) {
    event.preventDefault();
    console.log(replyingTo)
    console.log('bake')
  }

  return (
    <main>
      {comments.map(comment => {
        const { replies } = comment;

        return (
          <div key={comment.id} className="comment-block">
            <Comment
              comment={comment}
              setComments={setComments}
              currentUser={{...currentUser}}
              showReplyInput={() => showReplyInput(comment)}
            />
            <div className="reply-block">
              {(replies.length > 0) && replies.map(
                reply => (
                  <Comment
                    key={reply.id}
                    comment={reply}
                    setComments={setComments}
                    currentUser={{...currentUser}}
                    showReplyInput={() => showReplyInput(reply)}
                  />
                ))
              }
              {checkReplyingTo(comment) && <form action="#" method='post' className="create-reply" onSubmit={handleReplySubmit}>
                <img src={currentUser.image.png} alt="" />
                <textarea
                  name="-reply-input"
                  id="reply-input" rows={5}
                  placeholder='Add a comment...'
                  defaultValue={replyingTo ? `@${replyingTo}, ` : ''}
                ></textarea>
                <button>REPLY</button>
              </form>}
            </div>
          </div>
        )
      })}
      <form action="#" onSubmit={handleCommentSubmit} onKeyDown={handleKeyDown} method='post' className="create-comment">
        <img src={currentUser.image.png} alt="" />
        <textarea name="comment" id="comment-input" rows={5} placeholder='Add a comment...'></textarea>
        <button>SEND</button>
      </form>
    </main>
  )
}