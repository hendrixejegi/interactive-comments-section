import './sass/App.scss';
import Comment from './Comment';
import data from '../data.json';
import { useState, useEffect } from 'react';
import { generateUniqueId } from './utils/helper';
import { getDate } from './utils/date';
import DeleteModal from './DeleteModal';

const { currentUser, comments: commentsData } = data;

export default function App() {
  // Load comment data and change IDs to string
  const [comments, setComments] = useState(() => {
    const savedComments = localStorage.getItem('comments');
    return savedComments
      ? JSON.parse(savedComments)
      : commentsData.map(
        comment => updateIDRecursive(comment)
      )
  })

  useEffect(() => {
    localStorage.setItem('comments', JSON.stringify(comments))
  }, [comments]);

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

  // Add new comment to data
  function handleCommentSubmit(event) {
    event.preventDefault();
    const formElement = event.target;
    const formData = new FormData(formElement);

    addNewComment(formData, formElement);
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
          id: generateUniqueId(),
          content: comment,
          createdAt: getDate(),
          score: 0,
          user: {...currentUser},
          replies: []
        },
      ]
    ));
    formElement.reset();
    formElement.blur();
  }

  function handleKeyDown(event, cb) {
    if (event.key === 'Enter') {
      const formElement = event.currentTarget;
      const formData = new FormData(formElement);
      cb(formData, formElement);
      formElement.reset();
    } else {return}    
  }

  // Add new reply to comment
  const [replyTo, setReplyTo] = useState(null);
  const [replyingTo, setReplyingTo] = useState('')

  function showReplyInput(comment) {
    setReplyTo(comment);
  }

  function checkReplyingTo(comment) {
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
    
    let result = false;

    if (!replyTo) {
      return result;
    }

    result = traverseCommentID(comment);
    return result;
  }

  useEffect(() => {
    replyTo && setReplyingTo(replyTo.user.username);
  }, [replyTo]);

  function handleReplySubmit(event) {
    event.preventDefault();
    const formElem = event.target;
    const formData = new FormData(formElem);
    addNewReply(formData, formElem);
  }

  function addNewReply(formData, formElem) {
    const reply = formData.get('reply');
    const replyObj = {
      id: generateUniqueId(),
      content: reply.replace(`@${replyingTo}`, '').trim(),
      createdAt: getDate(),
      score: 0,
      replyingTo: replyingTo,
      user: { ...currentUser }
    }

    setComments(prevComments => (
      prevComments.map(comment => {
        // Check if comment is a match
        if (comment.id === replyTo.id) {
          return {
            ...comment,
            replies: [
              ...comment.replies,
              replyObj,
            ]
          }
        }
        //Check if any of the reply is a match
        if (comment.replies) {
          for (let reply of comment.replies) {
            if (reply.id === replyTo.id) {
              return {
                ...comment,
                replies: [
                  ...comment.replies,
                  replyObj,
                ]
              }
            }
          }
        }
        return comment;
      })
    ));

    formElem.reset();
    setReplyTo(null);
    setReplyingTo('');
  }

  const [showModal, setShowModal] = useState(false)
  const [editComment, setEditComment] = useState(null);

  return (
    <>
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
                setShowModal={setShowModal}
                showModal={showModal}
                editComment={editComment}
                setEditComment={setEditComment}
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
                      setShowModal={setShowModal}
                      editComment={editComment}
                      setEditComment={setEditComment}
                    />
                  ))
                }
                {checkReplyingTo(comment) && <form action="#" method='post' className="create-reply" onSubmit={handleReplySubmit} onKeyDown={(event) => handleKeyDown(event, addNewReply)}>
                  <img src={currentUser.image.png} alt="" />
                  <textarea
                    name="reply"
                    id="reply-input" rows={5}
                    placeholder='Add a comment...'
                    defaultValue={replyingTo ? `@${replyingTo} ` : ''}
                  ></textarea>
                  <button>REPLY</button>
                </form>}
              </div>
            </div>
          )
        })}
        <form action="#" onSubmit={handleCommentSubmit} onKeyDown={(event) => handleKeyDown(event, addNewComment)} method='post' className="create-comment">
          <img src={currentUser.image.png} alt="" />
          <textarea name="comment" id="comment-input" rows={5} placeholder='Add a comment...'></textarea>
          <button>SEND</button>
        </form>
      </main>
      <DeleteModal showModal={showModal} />
    </>
  )
}