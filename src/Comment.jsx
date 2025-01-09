export default function Comment({comment, setComments, user}) {
  const image = comment.user.image.png;
  const { replyingTo = ''} = comment;

    function updateScoreRecursive(comment, commentId, addOne = true) {
      function updateScore() {
        if (comment.score > 0) {
          return addOne ? comment.score + 1 : comment.score - 1;
        }

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

  function addVote(event) {
    const { commentId } = event.target.dataset;
    setComments(prevComments =>
      prevComments.map(comment =>
        updateScoreRecursive(comment, Number(commentId), true)
      )
    )    
  }

  function removeVote(event) {
    const { commentId } = event.target.dataset;
    setComments(prevComments => 
      prevComments.map(comment =>
        updateScoreRecursive(comment, Number(commentId), false)
      )
    )
  }

  return (
    <>
      <div className="comment">
        <div className="vote">
          <div className="vote-control">
            <button className="upvote-btn" data-comment-id={comment.id} onClick={addVote}>+</button>
            <span className='score'>{comment.score}</span>
            <button className="downvote-btn" data-comment-id={comment.id} onClick={removeVote}>-</button>
          </div>
        </div>
        <div className="user">
          <img src={image} alt="" />
          <span className='username'>{comment.user.username}</span>
          <span className='created-at'>{comment.createdAt}</span>
        </div>
        <button className='reply-btn'>Reply</button>
        <p className='content'>{replyingTo && <span className="replying-to">@{replyingTo} </span>}{comment.content}</p>
      </div>
    </>
  )
}
