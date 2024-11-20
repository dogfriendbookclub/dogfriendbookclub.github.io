fetch("https://literal.club/graphql/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwcm9maWxlSWQiOiJjbHYwNnhtcTkxMjgzMzEwMGh3ZXJsODgydm1kIiwidHlwZSI6IkFDQ0VTU19UT0tFTiIsInRpbWVzdGFtcCI6MTcyOTA0ODA4MDIzMywiaWF0IjoxNzI5MDQ4MDgwLCJleHAiOjE3NDQ3NzI4ODB9.smTM3wtEVgEWwknwMW7i7hf5uO2cawSiK7JtSbDi444", // replace with your actual token
  },
  body: JSON.stringify({
    query: `query myReadingStates {
  myReadingStates {
    id
    status
    profileId
    createdAt
    book {
        id
        slug
        title
        subtitle
        description
        isbn13
        pageCount
        cover
        authors {
            name
        }
    }
  }
}`
  }),
})
  .then((r) => r.json())
  .then((data) => {
  	
  	
    const books = data.data.myReadingStates;

    // Clear the container before adding new books
    const bookContainer = document.getElementById("sel");
    bookContainer.innerHTML = ""; 

    // Create a document fragment to improve performance
    const toAdd = document.createDocumentFragment();

    books.forEach((book, i) => {
    // if (book.status == "FINISHED") {
      // Create a new div for each book card
      const newDiv = document.createElement("div");
      newDiv.id = "book" + i;
      newDiv.className = "w3-card w3-container";
      newDiv.style = "min-height: 400px; width: 315px; margin: 10px; padding: 20px;";

      // Create and populate elements for each book detail
      const title = document.createElement("h3");
      title.textContent = book.book.title;
      title.className = "book-title";

      const authors = document.createElement("p");
      authors.textContent = `Author: ${book.book.authors.map(author => author.name).join(", ")}`;
      authors.className = "book-authors";

	  const subtitle = document.createElement("p");
      subtitle.textContent = book.book.subtitle;
      subtitle.className = "book-subtitle";

      const description = document.createElement("p");
      description.textContent = book.book.description;
      description.className = "book-description";

      const coverImg = document.createElement("img");
      coverImg.src = book.book.cover;
      coverImg.alt = `${book.title} cover`;
      coverImg.className = "book-cover";
      coverImg.style = "max-width: 125px; height: auto;";
      coverImg.onclick = function() {
    	window.location.href = 'https://literal.club/book/' + book.book.slug;
		};

      // Append all elements to the newDiv (card)
      newDiv.appendChild(coverImg);
      newDiv.appendChild(title);
      newDiv.appendChild(subtitle);
      newDiv.appendChild(authors);

      // Append each card to the document fragment
      toAdd.appendChild(newDiv);
    });

    // Append the document fragment to the container in the DOM
    bookContainer.appendChild(toAdd);
  })
  .catch((error) => {
    alert("Error: " + error.message);
  });
