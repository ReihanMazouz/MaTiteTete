import React, { useState } from 'react';
import '../styles/LiseBooksScreen.css';

const BookCard = ({ book, isEditing, onDelete, onEdit, onSave, activeTab }) => {
  const [editedBook, setEditedBook] = useState(book);

  return (
    <div className="card">
      <div className="title-row">
        <h3 className="card-title">{book.title}</h3>
        <div className="icon-container">
          {!isEditing ? (
            <>
              <button onClick={() => onEdit(book)} className="icon-button">
                <i className="material-icons" style={{ color: 'blue' }}>edit</i>
              </button>
              <button onClick={onDelete} className="icon-button">
                <i className="material-icons" style={{ color: 'red' }}>delete</i>
              </button>
            </>
          ) : (
            <>
              <button onClick={() => onSave(editedBook)} className="icon-button">
                <i className="material-icons" style={{ color: 'green' }}>save</i>
              </button>
              <button onClick={() => onEdit(null)} className="icon-button">
                <i className="material-icons" style={{ color: 'red' }}>close</i>
              </button>
            </>
          )}
        </div>
      </div>

      {!isEditing ? (
        <>
          {book.image && (
            <div className="image-container">
              <img src={book.image} alt={book.title} className="book-image" />
            </div>
          )}
          <p className="card-author">{book.author}</p>
          <p className="card-comments">{book.comments}</p>
          {activeTab === 'recommended' && (
            <p className="card-recommended-for">Recommandés pour: {book.recommendedFor || 'N/A'}</p>
          )}
        </>
      ) : (
        <>
          <input
            value={editedBook.title}
            onChange={(e) => setEditedBook({ ...editedBook, title: e.target.value })}
            placeholder="Titre"
            className="input"
          />
          <input
            value={editedBook.author}
            onChange={(e) => setEditedBook({ ...editedBook, author: e.target.value })}
            placeholder="Auteur"
            className="input"
          />
          <input
            value={editedBook.comments}
            onChange={(e) => setEditedBook({ ...editedBook, comments: e.target.value })}
            placeholder="Commentaires"
            className="input"
          />
          {activeTab === 'recommended' && (
            <input
              value={editedBook.recommendedFor || ''}
              onChange={(e) => setEditedBook({ ...editedBook, recommendedFor: e.target.value })}
              placeholder="Recommandés pour"
              className="input"
            />
          )}
        </>
      )}
    </div>
  );
};

export default BookCard;