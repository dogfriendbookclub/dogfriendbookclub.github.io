fetch("https://literal.club/graphql/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: "Bearer YOUR_ACTUAL_TOKEN_HERE", // replace with your actual token
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
        isbn13
        cover
        authors {
          name
        }
      }
    }`,
    variables: {
      limit: 1,
      offset: 0,
      readingStatus: "IS_READING",
      profileId: "clv06xmq912833100hwerl882vmd", // replace with your actual profile ID
    },
  }),
})
  .then((response) => response.json())
  .then((data) => {
    const books = data.data.booksByReadingStateAndProfile;
    const nowReadingContainer = document.getElementById("nowReading");
    nowReadingContainer.innerHTML = ""; // Clear any existing content
    
    const heading = document.createElement("h3")
    heading.textContent = "Currently Reading"

    books.forEach((book) => {

      const title = document.createElement("h4");
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
      coverImg.onclick = function() {
    	// Store the book data in localStorage before redirecting
        localStorage.setItem('isbn13', book.isbn13);
        window.location.href = 'bookDetail.html';  // Change to your book details page URL
		};

      nowReadingContainer.appendChild(heading);
      nowReadingContainer.appendChild(coverImg);
      nowReadingContainer.appendChild(title);
      nowReadingContainer.appendChild(authors);
      nowReadingContainer.appendChild(description);
    });
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
    alert("Error: " + error.message);
  });
