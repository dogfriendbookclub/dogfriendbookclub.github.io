fetch("https://literal.club/graphql/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwcm9maWxlSWQiOiJjbHYwNnhtcTkxMjgzMzEwMGh3ZXJsODgydm1kIiwidHlwZSI6IkFDQ0VTU19UT0tFTiIsInRpbWVzdGFtcCI6MTcyOTA0ODA4MDIzMywiaWF0IjoxNzI5MDQ4MDgwLCJleHAiOjE3NDQ3NzI4ODB9.smTM3wtEVgEWwknwMW7i7hf5uO2cawSiK7JtSbDi444", // replace with your actual token
  },
  body: JSON.stringify({
    query: `query booksByReadingStateAndProfile(
      $limit: Int!
      $offset: Int!
      $readingStatus: ReadingStatus!
      $profileId: String!
    ) {
      booksByReadingStateAndProfile(
        limit: $limit
        offset: $offset
        readingStatus: $readingStatus
        profileId: $profileId
      ) {
        id
        title
        description
        cover
        authors {
          name
        }
      }
    }`,
    variables: {
      limit: 100,
      offset: 0,
      readingStatus: "DROPPED",
      profileId: "clv06xmq912833100hwerl882vmd", // replace with your actual profile ID
    },
  }),
})
  .then((r) => r.json())
  .then((data) => {
    const books = data.data.booksByReadingStateAndProfile;

    // Clear the container before adding new books
    const bookContainer = document.getElementById("sel");
    bookContainer.innerHTML = ""; 

    // Create a document fragment to improve performance
    const toAdd = document.createDocumentFragment();

    books.forEach((book, i) => {
      // Create a new div for each book card
      const newDiv = document.createElement("div");
      newDiv.id = "book" + i;
      newDiv.className = "w3-card w3-container";
      newDiv.style = "min-height: 460px; min-width: 315px; margin: 10px; padding: 20px;";

      // Create and populate elements for each book detail
      const title = document.createElement("h3");
      title.textContent = book.title;
      title.className = "book-title";

      const authors = document.createElement("p");
      authors.textContent = `Author: ${book.authors.map(author => author.name).join(", ")}`;
      authors.className = "book-authors";

      const description = document.createElement("p");
      description.textContent = book.description;
      description.className = "book-description";

      const coverImg = document.createElement("img");
      coverImg.src = book.cover;
      coverImg.alt = `${book.title} cover`;
      coverImg.className = "book-cover";
      coverImg.style = "max-width: 125px; height: auto;";

      // Append all elements to the newDiv (card)
      newDiv.appendChild(coverImg);
      newDiv.appendChild(title);
      newDiv.appendChild(authors);
      newDiv.appendChild(description);

      // Append each card to the document fragment
      toAdd.appendChild(newDiv);
    });

    // Append the document fragment to the container in the DOM
    bookContainer.appendChild(toAdd);
  })
  .catch((error) => {
    alert("Error: " + error.message);
  });
