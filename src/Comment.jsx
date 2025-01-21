import { showRelativeDate } from "./utils/date";

export default function Comment({comment, setComments, currentUser, showReplyInput, setShowModal, editComment, setEditComment}) { 
    function updateScoreRecursive(comment, commentId, addOne = true) {
      function updateScore() {
        // If score is greater than zero, add or remove from score
        if (comment.score > 0) {
          return addOne ? comment.score + 1 : comment.score - 1;
        }
        // If score is equal to zero, only add to score
        if (comment.score == 0) {
          return addOne ? comment.score + 1 : comment.score;
        }
      }
      if (comment.id === commentId) {
        // If the current comment matches the target ID, update its score
        return {
          ...comment,
          score: updateScore(),
        };
      } else if (comment.replies && comment.replies.length > 0) {
        // If the comment has replies, recursively traverse them
        return {
          ...comment,
          replies: comment.replies.map(reply =>
            updateScoreRecursive(reply, commentId, addOne)
          ),
        };
      } else {
        // If no match and no replies, return the comment as is
        return comment;
      }
    }

  function addVote(commentId) {
    setComments(prevComments =>
      prevComments.map(comment =>
        updateScoreRecursive(comment, commentId, true)
      )
    );  
  }

  function removeVote(commentId) {
    setComments(prevComments => 
      prevComments.map(comment =>
        updateScoreRecursive(comment, commentId, false)
      )
    );
  }

  async function deleteComment(id) {
    function deleteCommentRecursive(comment, id) {
      if (comment.id === id) {
        return false; // Delete this comment
      }
    
      if (comment.replies) {
        comment.replies = comment.replies.filter(reply => deleteCommentRecursive(reply, id));
      }
    
      return true; // Keep this comment
    }

    function confirmDeleteComment() {
      setShowModal(prev => !prev);
      const cancelBtn = document.getElementById('cancel-btn');
      const confirmBtn = document.getElementById('confirm-btn');
    
      return new Promise((resolve) => {
        cancelBtn.addEventListener('click', () => resolve(false));
        confirmBtn.addEventListener('click', () => resolve(true));
      });
    }

    const result = await confirmDeleteComment();
    if (result) {
      setComments(prevComments => prevComments.filter(
        comment => deleteCommentRecursive(comment, id)
      ));
      setShowModal(prev => !prev)
    } else {
      setShowModal(prev => !prev)
      return;
    }
  }

  // Handle comment edit
  function handleEditComment(comment) {
    setEditComment(comment);
  }

  function updateComment(event) {
    setEditComment(prev => (
      {...prev, content: event.target.value}
    ));
  }

  function updateCommentData() {
    function updateRecursive(comment) {
      if (editComment.id === comment.id) {
        return {
          ...comment,
          content: editComment.content,
        };
      } else if (comment.replies) {
        return {
          ...comment,
          replies: comment.replies.map(reply => updateRecursive(reply)),
        };
      } else {
        return comment;
      }
    }
  
    setComments(prev => prev.map(comment => updateRecursive(comment)));
    setEditComment(null);
  }

  return (
    <>
      <div className="comment">
        <div className="vote">
          <div className="vote-control">
            <button className="upvote-btn" onClick={() => addVote(comment.id)}>
              <svg width="11" height="11" xmlns="http://www.w3.org/2000/svg"><path d="M6.33 10.896c.137 0 .255-.05.354-.149.1-.1.149-.217.149-.354V7.004h3.315c.136 0 .254-.05.354-.149.099-.1.148-.217.148-.354V5.272a.483.483 0 0 0-.148-.354.483.483 0 0 0-.354-.149H6.833V1.4a.483.483 0 0 0-.149-.354.483.483 0 0 0-.354-.149H4.915a.483.483 0 0 0-.354.149c-.1.1-.149.217-.149.354v3.37H1.08a.483.483 0 0 0-.354.15c-.1.099-.149.217-.149.353v1.23c0 .136.05.254.149.353.1.1.217.149.354.149h3.333v3.39c0 .136.05.254.15.353.098.1.216.149.353.149H6.33Z" fill="currentcolor"/></svg>
            </button>
            <span className='score'>{comment.score}</span>
            <button className="downvote-btn" onClick={() => removeVote(comment.id)}>
              <svg width="11" height="3" xmlns="http://www.w3.org/2000/svg"><path d="M9.256 2.66c.204 0 .38-.056.53-.167.148-.11.222-.243.222-.396V.722c0-.152-.074-.284-.223-.395a.859.859 0 0 0-.53-.167H.76a.859.859 0 0 0-.53.167C.083.437.009.57.009.722v1.375c0 .153.074.285.223.396a.859.859 0 0 0 .53.167h8.495Z" fill="currentcolor"/></svg>
            </button>
          </div>
        </div>
        <div className="user">
          <img src={comment.user.image.png} alt="user" />
          <span className='username'>{comment.user.username}</span>
          {currentUser.username === comment.user.username ? <span className='current-user-comment'>you</span> : ''}
          <span className='created-at'>{showRelativeDate(comment.createdAt)}</span>
        </div>
        <div className="comment-btns">
          {currentUser.username === comment.user.username
            ? <button className='delete-btn' onClick={() => deleteComment(comment.id)}>
              <svg width="12" height="14" xmlns="http://www.w3.org/2000/svg"><path d="M1.167 12.448c0 .854.7 1.552 1.555 1.552h6.222c.856 0 1.556-.698 1.556-1.552V3.5H1.167v8.948Zm10.5-11.281H8.75L7.773 0h-3.88l-.976 1.167H0v1.166h11.667V1.167Z" fill="currentcolor"/></svg>
              Delete</button>
            : ''
          }
          {currentUser.username === comment.user.username
            ? <button className="edit-btn" onClick={() => handleEditComment(comment)}>
              <svg width="14" height="14" xmlns="http://www.w3.org/2000/svg"><path d="M13.479 2.872 11.08.474a1.75 1.75 0 0 0-2.327-.06L.879 8.287a1.75 1.75 0 0 0-.5 1.06l-.375 3.648a.875.875 0 0 0 .875.954h.078l3.65-.333c.399-.04.773-.216 1.058-.499l7.875-7.875a1.68 1.68 0 0 0-.061-2.371Zm-2.975 2.923L8.159 3.449 9.865 1.7l2.389 2.39-1.75 1.706Z" fill="currentcolor"/></svg>
              Edit</button>
            : <button className='reply-btn' onClick={showReplyInput}>
              <svg width="14" height="13" xmlns="http://www.w3.org/2000/svg"><path d="M.227 4.316 5.04.16a.657.657 0 0 1 1.085.497v2.189c4.392.05 7.875.93 7.875 5.093 0 1.68-1.082 3.344-2.279 4.214-.373.272-.905-.07-.767-.51 1.24-3.964-.588-5.017-4.829-5.078v2.404c0 .566-.664.86-1.085.496L.227 5.31a.657.657 0 0 1 0-.993Z" fill="currentcolor"/></svg>
              Reply</button>
          }
        </div>
        {editComment && editComment.id === comment.id
          ? <>
            <textarea name="updated-comment" id="update-comment-input" rows={6} defaultValue={comment.content} onChange={updateComment}></textarea>
            <button className="update-btn" onClick={updateCommentData}>UPDATE</button>
          </>
          : <p className='content'>{comment.replyingTo && <span className="replying-to">@{comment.replyingTo} </span>}{comment.content}</p>
        }
      </div>
    </>
  )
}
