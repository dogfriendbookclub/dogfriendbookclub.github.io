// Retrieve the isbn13 from localStorage
    const isbn13 = localStorage.getItem('isbn13');
    
    if (!isbn13) {
      alert("No book found!");
      window.location.href = 'index.html'; // Redirect to the main page if no book data is found
    } else {
      // Run the GraphQL query to fetch the book details by isbn13
      fetch('https://literal.club/graphql/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwcm9maWxlSWQiOiJjbHYwNnhtcTkxMjgzMzEwMGh3ZXJsODgydm1kIiwidHlwZSI6IkFDQ0VTU19UT0tFTiIsInRpbWVzdGFtcCI6MTcyOTA0ODA4MDIzMywiaWF0IjoxNzI5MDQ4MDgwLCJleHAiOjE3NDQ3NzI4ODB9.smTM3wtEVgEWwknwMW7i7hf5uO2cawSiK7JtSbDi444',
        },
        body: JSON.stringify({
          query: `query GetBookByIsbn($isbn13: String!) {
            book(where: {isbn13: $isbn13}) {
              id
              title
              subtitle
              description
              pageCount
              cover
              authors {
                name
              }
            }
          }`,
          variables: { isbn13: isbn13 }
        })
      })
      .then((response) => response.json())
      .then((data) => {
        const book = data.data.book;

        if (book) {
          // Check if title exists and display it
          if (book.title) {
            document.getElementById('book-title').textContent = book.title;
          } else {
            document.getElementById('book-title').style.display = 'none';
          }

          // Check if subtitle exists and display it
          if (book.subtitle) {
            document.getElementById('book-subtitle').textContent = book.subtitle;
          } else {
            document.getElementById('book-subtitle').style.display = 'none';
          }

          // Check if description exists and display it
          if (book.description) {
            document.getElementById('book-description').textContent = book.description;
          } else {
            document.getElementById('book-description').style.display = 'none';
          }

          // Check if pageCount exists and display it
          if (book.pageCount) {
            document.getElementById('book-page-count').textContent = `${book.pageCount} pages`;
          } else {
            document.getElementById('book-page-count').style.display = 'none';
          }


          // Check if cover image exists and display it
          if (book.cover) {
            document.getElementById('book-cover').src = book.cover;
          } else {
            document.getElementById('book-cover').style.display = 'none';
          }

          // Check if authors exist and display them
          if (book.authors && book.authors.length > 0) {
            document.getElementById('book-authors').textContent = `Authors: ${book.authors.map(author => author.name).join(', ')}`;
          } else {
            document.getElementById('book-authors').style.display = 'none';
          }
        } else {
          alert("Book not found!");
        }
      })
      .catch((error) => {
        alert("Error: " + error.message);
      });
    }