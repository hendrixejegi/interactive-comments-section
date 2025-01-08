export default function Comment({comment, setComments, user}) {
  const image = comment.user.image.png;
  const { replyingTo = ''} = comment;

  function addVote(event) {
    const { commentId } = event.target.dataset;
    setComments(prevComments => prevComments.map(comment => {
      if (comment.id === Number(commentId)) {
        return {
          ...comment,
          score: comment.score + 1,
        }
      } else if (comment.replies && comment.replies.length > 0) {
        // Check if comment has replies
        const modReplies = comment.replies.map(reply => {
          if (reply.id === Number(commentId)) {
            return {
              ...reply,
              score: reply.score + 1,
            }
          } else {
            return reply;
          }
        })
        return {
          ...comment,
          replies: modReplies
        };
      } else {
        return comment
      }
    }))
  }

  return (
    <>
      <div className="comment">
        <div className="vote">
          <div className="vote-control">
            <button className="upvote-btn" data-comment-id={comment.id} onClick={addVote}>+</button>
            <span className='score'>{comment.score}</span>
            <button className="downvote-btn">-</button>
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
