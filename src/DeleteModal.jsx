import './sass/DeleteModal.scss'

export default function DeleteModal({ showModal }) {
    return (
    <div className={`modal ${showModal ? 'show-md' : ''}`}>
      <div className="modal-content">
        <h2>Delete comment</h2>
        <p>
          Are you sure you want to delete this comment? 
          This will remove the comment and can't be undone.
        </p>
        <div className="buttons">
          <button id='cancel-btn'>NO, CANCEL</button>
          <button id='confirm-btn'>YES, DELETE</button>
        </div>
      </div>      
    </div>
  )
}