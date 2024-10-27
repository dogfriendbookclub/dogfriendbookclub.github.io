const inputElement = document.getElementById('text-input');
    const sendButton = document.getElementById('send-button');
    const bookContainer = document.getElementById('book-container');
    const bookTitle = document.getElementById('book-title');
    const bookSubtitle = document.getElementById('book-subtitle');
    const bookAuthors = document.getElementById('book-authors');
    const bookPageCount = document.getElementById('book-page-count');
    const bookPublishedDate = document.getElementById('book-published-date');
    const bookDescription = document.getElementById('book-description');
    const bookCoverImg = document.getElementById('book-cover-img');
    const confirmButton = document.getElementById('confirm-button');
    const confirmationMessage = document.getElementById('confirmation-message');
    const cancelButton = document.getElementById('cancel-button');
    const cancelMessage = document.getElementById('cancel-message');

    let currentBookId = null;

    sendButton.addEventListener('click', () => {
      const text = inputElement.value;

      fetch('https://literal.club/graphql/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': 'Bearer process.env.LITERAL_KEY',

        },
        body: JSON.stringify({
          query: `query GetBookByIsbn($isbn13: String!) {
            book(where: {isbn13: $isbn13}) {
              id
              title
              subtitle
              description
              pageCount
              publishedDate
              cover
              authors {
                name
              }
            }
          }`,
          variables: { isbn13: text }
        })
      })
      .then(r => r.json())
      .then(data => {
        const book = data.data.book;
        currentBookId = book.id; // Store the book ID
        
        // Populate the fields with the book data
        bookTitle.textContent = book.title;
        bookSubtitle.textContent = book.subtitle;
        bookAuthors.textContent = `Author: ${book.authors.map(author => author.name).join(', ')}`;
        bookPageCount.textContent = `Page Count: ${book.pageCount}`;
        bookPublishedDate.textContent = `Published Date: ${new Date(book.publishedDate).toDateString()}`;
        bookDescription.textContent = book.description;
        bookCoverImg.src = book.cover;
        
        // Display the book container and the confirm/cancel buttons
        bookContainer.style.display = 'block';
        confirmButton.style.display = 'inline-block';
        cancelButton.style.display = 'inline-block';
        confirmationMessage.style.display = 'none';
        cancelMessage.style.display = 'none';
      })
      .catch(error => {
        alert('Error: ' + error.message);
      });
    });

    confirmButton.addEventListener('click', () => {
      confirmationMessage.style.display = 'block';
      confirmButton.style.display = 'none';
      cancelButton.style.display = 'none';
      bookContainer.style.display = 'none';

      fetch('https://literal.club/graphql/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': 'Bearer process.env.LITERAL_KEY',
        },
        body: JSON.stringify({
          query: `mutation UpdateReadingState($bookId: String!, $readingStatus: ReadingStatus!) {
            updateReadingState(bookId: $bookId, readingStatus: $readingStatus) {
              status
              profileId
              book {
                id
                title
              }
            }
          }`,
          variables: { bookId: currentBookId, readingStatus: "WANTS_TO_READ" }
        })
      })
      .then(r => r.json())
      .catch(error => {
        alert('Error updating reading state: ' + error.message);
      });
    });

    cancelButton.addEventListener('click', () => {
      cancelMessage.style.display = 'block';
      cancelButton.style.display = 'none';
      confirmButton.style.display = 'none';
      bookContainer.style.display = 'none';
    });