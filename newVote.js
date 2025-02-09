import { voteStart, voteEnd, meetingDate } from './variables.js';
document.addEventListener("DOMContentLoaded", function() {
fetch("https://literal.club/graphql/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: "Bearer YOUR_TOKEN_HERE", // replace with your actual token
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
        slug
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
      limit: 100,
      offset: 0,
      readingStatus: "WANTS_TO_READ",
      profileId: "clv06xmq912833100hwerl882vmd", // replace with your actual profile ID
    },
  }),
})
  .then((r) => r.json())
  .then((data) => {
    const books = data.data.booksByReadingStateAndProfile;

    // Clear the container before adding new books
    const bookContainer = document.getElementById("sel");
	if (bookContainer) {
	  bookContainer.innerHTML = ""; // Clear the container only if it exists
	} else {
	  console.error("Element #sel not found in the DOM.");
	}

    // Create a document fragment to improve performance
    const toAdd = document.createDocumentFragment();

    books.forEach((book, i) => {
      // Create a new accordion button for each book
      const newButton = document.createElement("button");
      newButton.classList.add("accordion");
      newButton.textContent = book.title + " by " + `Author: ${book.authors.map(author => author.name).join(", ")}`;

      // Create the corresponding panel for each book
      const newDiv = document.createElement("div");
      newDiv.className = "panel";
      newDiv.style = "min-height: 40px; padding: 20px;";

      const coverImg = document.createElement("img");
      coverImg.src = book.cover;
      coverImg.className = "book-cover";
      coverImg.style = "max-width: 125px; height: auto;";
      
      // Ensure isbn13 is available before proceeding
      const isbn13 = book.isbn13;
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
            'Authorization': 'Bearer YOUR_TOKEN_HERE', // replace with your actual token
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
          const bookDetails = data.data.book;

          // Create the subtitle if it exists
          let subtitle;
          if (bookDetails.subtitle) {
            subtitle = document.createElement("p");
            subtitle.textContent = `Subtitle: ${bookDetails.subtitle}`;
            subtitle.className = "book-subtitle";
            newDiv.appendChild(subtitle); // Append subtitle to the panel
          }

          // Create the page count if it exists
          let pageCount;
          if (bookDetails.pageCount) {
            pageCount = document.createElement("p");
            pageCount.textContent = `${bookDetails.pageCount} pages`;
            pageCount.className = "book-page-count";
            newDiv.appendChild(pageCount); // Append page count to the panel
          }

          // Create the description if it exists
          let description;
          if (bookDetails.description) {
            description = document.createElement("p");
            description.textContent = bookDetails.description;
            description.className = "book-description";
            newDiv.appendChild(description); // Append description to the panel
          }

          // Append all elements to the newDiv (panel)
          newDiv.appendChild(coverImg);

        })
        .catch((error) => {
          alert("Error: " + error.message);
        });
      }

      // Append each new button and panel to the fragment
      toAdd.appendChild(newButton);
      toAdd.appendChild(newDiv);
    });

    // Append the document fragment to the container in the DOM
    bookContainer.appendChild(toAdd);

    // Now add event listeners for the accordion functionality
    const acc = document.getElementsByClassName("accordion");
    for (let i = 0; i < acc.length; i++) {
      acc[i].addEventListener("click", function() {
        this.classList.toggle("active");
        const panel = this.nextElementSibling;
        if (panel.style.maxHeight) {
          panel.style.maxHeight = null;
          panel.style.display = "none";  // Hide the panel when closed
        } else {
          panel.style.display = "block"; // Show the panel when open
          panel.style.maxHeight = panel.scrollHeight + "px";  // Expand the panel smoothly
        }
      });
    }
 
  })
  .catch((error) => {
    alert("Error: " + error.message);
  });
  
  });