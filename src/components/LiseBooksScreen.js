import React, { useState, useEffect } from 'react';
import BookCard from './BookCard';
import '../styles/LiseBooksScreen.css';
import CameraScanner from './CameraScanner';

const LiseBooksScreen = () => {
  const [activeTab, setActiveTab] = useState('read');
  const [books, setBooks] = useState({ read: [], toRead: [], recommended: [] });
  const [filteredBooks, setFilteredBooks] = useState({ read: [], toRead: [], recommended: [] });
  const [editingBook, setEditingBook] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [cameraModalVisible, setCameraModalVisible] = useState(false);
  const [newBook, setNewBook] = useState({ title: '', author: '', comments: '' });
  const [searchValues, setSearchValues] = useState({ title: '', author: '' });
  const [filterValues, setFilterValues] = useState({ title: '', author: '' });
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const binId = '66fe9cf8ad19ca34f8b216eb';
  const apiKey = '$2a$10$MQ3Szi4z9ipmhLUPthOgK.K3bJNw3.M/UVKAb9EAwDe4Z.G79fu/e';

  useEffect(() => {
    setLoading(true);
    fetch(`https://api.jsonbin.io/v3/b/${binId}/latest`, {
      method: 'GET',
      headers: {
        'X-Master-Key': apiKey,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setBooks({
          read: data.record.read || [],
          toRead: data.record.toRead || [],
          recommended: data.record.recommended || [],
        });
        setFilteredBooks({
          read: data.record.read || [],
          toRead: data.record.toRead || [],
          recommended: data.record.recommended || [],
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error('Erreur lors du chargement des livres:', error);
        setLoading(false);
      });
  }, []);

  const updateBooksInJsonBin = (updatedBooks) => {
    setLoading(true);
    fetch(`https://api.jsonbin.io/v3/b/${binId}/latest`, {
      method: 'GET',
      headers: {
        'X-Master-Key': apiKey,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const updatedJson = { ...data.record, ...updatedBooks };

        fetch(`https://api.jsonbin.io/v3/b/${binId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'X-Master-Key': apiKey,
          },
          body: JSON.stringify(updatedJson),
        })
          .then((response) => response.json())
          .then(() => {
            setBooks(updatedBooks);
            setFilteredBooks(updatedBooks);
            setModalVisible(false);
            setNewBook({ title: '', author: '', comments: '' });
            setLoading(false);
          })
          .catch((error) => {
            console.error('Erreur lors de la mise à jour des livres:', error);
            setLoading(false);
          });
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération du contenu du bin:', error);
        setLoading(false);
      });
  };

  const addBook = (category) => {
    const newBookWithId = { id: books[category].length + 1, ...newBook };
    const updatedBooks = { ...books, [category]: [...books[category], newBookWithId] };

    updateBooksInJsonBin(updatedBooks);
  };

  const addBookFromSearch = (book) => {
    setSearchModalVisible(false);
    const newBookWithId = { id: books[activeTab].length + 1, ...book };
    const updatedBooks = { ...books, [activeTab]: [...books[activeTab], newBookWithId] };
    updateBooksInJsonBin(updatedBooks);
  };

  const saveBook = (editedBook, category) => {
    const updatedCategoryBooks = books[category].map((book) => (book.id === editedBook.id ? editedBook : book));
    const updatedBooks = { ...books, [category]: updatedCategoryBooks };

    updateBooksInJsonBin(updatedBooks);
    setEditingBook(null);
  };

  const deleteBook = (id, category) => {
    const updatedCategoryBooks = books[category].filter((book) => book.id !== id);
    const updatedBooks = { ...books, [category]: updatedCategoryBooks };

    updateBooksInJsonBin(updatedBooks);
  };

  const editBook = (book) => {
    setEditingBook(book);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  }

  const handleScan = (text) => {
    setCameraModalVisible(false);
    setSearchLoading(true); 
    setSearchModalVisible(true);
    fetch(`https://openlibrary.org/search.json?q=${text}`)
      .then((response) => response.json())
      .then((data) => {
        const searchResults = data.docs.map((doc) => ({
          id: doc.key,
          title: doc.title,
          author: doc.author_name ? doc.author_name.join(', ') : 'Unknown',
          comments: doc.first_publish_year ? `First published in ${doc.first_publish_year}` : 'No comments',
          image: doc.cover_i ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg` : null,
        }));

        setSearchResults(searchResults);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Erreur lors de la recherche des livres:', error);
        setLoading(false);
      });
      setSearchLoading(false); 
  };


  const handleSearch = () => {
    setSearchLoading(true); 
    fetch(`https://openlibrary.org/search.json?title=${searchValues.title}&author=${searchValues.author}&limit=30`)
      .then((response) => response.json())
      .then((data) => {
        const searchResults = data.docs.map((doc) => ({
          id: doc.key,
          title: doc.title,
          author: doc.author_name ? doc.author_name.join(', ') : 'Unknown',
          comments: doc.first_publish_year ? `First published in ${doc.first_publish_year}` : 'No comments',
          image: doc.cover_i ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg` : null,
        }));

        setSearchResults(searchResults);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Erreur lors de la recherche des livres:', error);
        setLoading(false);
      });
      setSearchLoading(false); 
  };

  const handleFilter = () => {
    setFilterModalVisible(false);
    // Filtrer les livres en fonction des valeurs de filtre
    const filteredBooks = books[activeTab].filter((book) => {
      const matchesTitle = book.title.toLowerCase().includes(filterValues.title.toLowerCase());
      const matchesAuthor = book.author.toLowerCase().includes(filterValues.author.toLowerCase());
      const matchesRecommendedFor = activeTab !== 'recommended' || (book.recommendedFor && book.recommendedFor.toLowerCase().includes(filterValues.recommendedFor.toLowerCase()));
      
      return matchesTitle && matchesAuthor && matchesRecommendedFor;
    });
    setFilteredBooks({ ...books, [activeTab]: filteredBooks });
  };

  const resetFilter = () => {
    setFilterValues({ title: '', author: '' });
    setFilteredBooks(books);
    setFilterModalVisible(false);
  };

  return (
    <div className="container">
      <div className="tab-container">
        <button
          className={`tab-button ${activeTab === 'read' ? 'active-tab' : ''}`}
          onClick={() => handleTabChange('read')}
        >
          <i className="material-icons">book</i>
          Lus
        </button>
        <button
          className={`tab-button ${activeTab === 'toRead' ? 'active-tab' : ''}`}
          onClick={() => handleTabChange('toRead')}
        >
          <i className="material-icons">bookmark</i>
          Désirés
        </button>
        <button
          className={`tab-button ${activeTab === 'recommended' ? 'active-tab' : ''}`}
          onClick={() => handleTabChange('recommended')}
        >
          <i className="material-icons">star</i>
          Recommandés
        </button>
      </div>

      {Object.values(filterValues).some(value => value) && (
        <div className="reset-filter-container">
          <button className="reset-button" onClick={resetFilter}>
            Réinitialiser les filtres
          </button>
        </div>
      )}

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      ) : (
        <div className={`content-container ${loading ? 'hidden' : ''}`}>
          {filteredBooks[activeTab].map((book) => (
            <BookCard
              key={book.id}
              book={book}
              isEditing={editingBook?.id === book.id}
              onDelete={() => deleteBook(book.id, activeTab)}
              onEdit={editBook}
              onSave={(editedBook) => saveBook(editedBook, activeTab)}
              activeTab={activeTab}
            />
          ))}
        </div>
      )}

      <div className="action-buttons">
        <button onClick={() => setModalVisible(true)} className="add-button">
          <i className="material-icons">add</i>
        </button>
        <button onClick={() => setFilterModalVisible(true)} className="filter-button">
          <i className="material-icons">filter_list</i>
        </button>
        <button onClick={() => setSearchModalVisible(true)} className="search-button">
          <i className="material-icons">search</i>
        </button>
        <button onClick={() => setCameraModalVisible(true)} className="camera-button">
          <i className="material-icons">camera_alt</i>
        </button>
      </div>

      {modalVisible && (
        <div className="modal-container">
          <div className="modal-content">
            <h2 className="modal-title">Ajouter un Livre</h2>
            <input
              placeholder="Titre"
              value={newBook.title}
              onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
              className="input"
            />
            <input
              placeholder="Auteur"
              value={newBook.author}
              onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
              className="input"
            />
            {activeTab === 'recommended' && (
              <input
                placeholder="Recommandé pour"
                value={newBook.recommendedFor}
                onChange={(e) => setNewBook({ ...newBook, recommendedFor: e.target.value })}
                className="input"
              />
            )}
            <input
              placeholder="Commentaires"
              value={newBook.comments}
              onChange={(e) => setNewBook({ ...newBook, comments: e.target.value })}
              className="input"
            />
            <div className="modal-buttons">
              <button className="cancel-button" onClick={() => setModalVisible(false)}>Annuler</button>
              <button className="add-button" onClick={() => addBook(activeTab)}>Ajouter</button>
            </div>
          </div>
        </div>
      )}

      {searchModalVisible && (
        <div className="modal-container">
          <div className="modal-content">
            <h2 className="modal-title">Rechercher un Livre</h2>
            <input
              placeholder="Titre"
              value={searchValues.title}
              onChange={(e) => setSearchValues({ ...searchValues, title: e.target.value })}
              className="input"
            />
            <input
              placeholder="Auteur"
              value={searchValues.author}
              onChange={(e) => setSearchValues({ ...searchValues, author: e.target.value })}
              className="input"
            />
            <div className="modal-buttons">
              <button className="cancel-button" onClick={() => setSearchModalVisible(false)}>Annuler</button>
              <button className="search-button" onClick={handleSearch}>Rechercher</button>
            </div>
            {searchLoading && (
              <div className="loading-spinner">
                <div className="spinner"></div>
              </div>
            )}
            {searchResults.length > 0 && (
              <div className="search-results">
                {searchResults.map((book) => (
                  <div key={book.id} className="search-result-item">
                    <h3>{book.title}</h3>
                    <p>{book.author}</p>
                    {book.image && <img src={book.image} alt={book.title} className="book-image" />}
                    <button onClick={() => addBookFromSearch(book)} className="add-button">
                      Ajouter
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {filterModalVisible && (
        <div className="modal-container">
          <div className="modal-content">
            <h2 className="modal-title">Filtrer les Livres</h2>
            <input
              placeholder="Titre"
              value={filterValues.title}
              onChange={(e) => setFilterValues({ ...filterValues, title: e.target.value })}
              className="input"
            />
            <input
              placeholder="Auteur"
              value={filterValues.author}
              onChange={(e) => setFilterValues({ ...filterValues, author: e.target.value })}
              className="input"
            />
            {activeTab === 'recommended' && (
              <input
                placeholder="Recommandé pour"
                value={filterValues.recommendedFor}
                onChange={(e) => setFilterValues({ ...filterValues, recommendedFor: e.target.value })}
                className="input"
              />
            )}
            <div className="modal-buttons">
              <button className="cancel-button" onClick={() => setFilterModalVisible(false)}>Annuler</button>
              <button className="reset-button" onClick={resetFilter}>Réinitialiser</button>
              <button className="filter-button" onClick={handleFilter}>Filtrer</button>
            </div>
          </div>
        </div>
      )}

      {cameraModalVisible && (
        <div className="modal-container">
          <div className="modal-content">
            <h2 className="modal-title">Caméra</h2>
            <CameraScanner onScan={handleScan} />
            <div className="modal-buttons">
              <button className="cancel-button" onClick={() => setCameraModalVisible(false)}>Fermer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiseBooksScreen;