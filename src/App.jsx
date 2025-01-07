import './App.scss';
import replyIcon from  '../images/icon-reply.svg';
import image from '../images/avatars/image-amyrobson.png';

export default function App() {
  function Comment() {
    return (
      <>
        <div className="comment">
          <div className="vote">
            <div className="vote-control">
              <button className="upvote-btn">+</button>
              <span className='score'>12</span>
              <button className="downvote-btn">-</button>
            </div>
          </div>
          <div className="user">
            <img src={image} alt="" />
            <span className='username'>amyrobson</span>
            <span className='created-at'>1 month ago</span>
          </div>
          <button className='reply-btn'>Reply</button>
          <p className='content'>Impressive! Though it seems the drag feature could be improved. But overall it looks incredible. You've nailed the design and the responsiveness at various breakpoints works really well.</p>
        </div>
      </>
    )
  }

  let reply = true;

  return (
    <main>
      <div className="comment-block">
        <Comment />
        {reply && <div className="reply-block">
          <Comment />
          <Comment />
        </div>}
      </div>
      <div className="comment-block">
        <Comment />
      </div>
    </main>
  )
}