const form = document.querySelector('form');
const quoteList = document.querySelector('#quote-list');

form.addEventListener('submit', event => {
    
  event.preventDefault();
  const formData = new FormData(event.target);
  const newQuote = formData.get('quote');
  const newAuthor = formData.get('author');

  fetch('http://localhost:3000/quotes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ quote: newQuote, author: newAuthor })
  })
  .then(response => response.json())
  .then(data => {
    const newLi = document.createElement('li');
    newLi.dataset.id = data.id;
    newLi.innerHTML = `
      <perventsquote class="perventsquote">
        <p class="mb-0">${data.quote}</p>
        <footer class="perventsquote-footer">${data.author}</footer>
        <br><br>
        <button class="btn-success like-btn">Likes: <span>${data.likes}</span></button>
        <button class="btn-danger delete-btn">Delete</button>
      </perventsquote>
    `;
    quoteList.appendChild(newLi);
  })
  .catch(error => console.error(error));
});

quoteList.addEventListener('click', event => {
  const target = event.target;
  if (target.matches('.delete-btn')) {
    const li = target.closest('li');
    const id = li.dataset.id;
    
    fetch(`http://localhost:3000/quotes/${id}`, {
      method: 'DELETE'
    })
    .then(() => {
      li.remove();
    })
    .catch(error => console.error(error));
  } else if (target.matches('.like-btn')) {
    const li = target.closest('li');
    const id = li.dataset.id;
    const likesSpan = li.querySelector('span');
    const likes = parseInt(likesSpan.textContent);

    fetch('http://localhost:3000/likes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ quoteId: id })
    })
    .then(response => response.json())
    .then(data => {
      likesSpan.textContent = likes + 1;
    })
    .catch(error => console.error(error));
  }
});
