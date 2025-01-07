export default function Comment({comment, user}) {
  const image = comment.user.image.png;

  return (
    <>
      <div className="comment">
        <div className="vote">
          <div className="vote-control">
            <button className="upvote-btn">+</button>
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
        <p className='content'>{user && <span className="respond-to">@{user}</span>} {comment.content}</p>
      </div>
    </>
  )
}
