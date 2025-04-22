const supabase = window.supabaseClient;

const adminEmails = ['vvce23cseaiml0051@vvce.ac.in'];
let allBooks = []; 

async function checkUserAndInit() {
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    console.log('Logged in as:', user.email);
    if (adminEmails.includes(user.email)) {
      document.getElementById('upload-link').style.display = 'inline';
    }
  }

  await loadBooks(); 
  setupSearch();     
}

let searchTimeout;
document.getElementById('search-input').addEventListener('input', function() {
  clearTimeout(searchTimeout);
  document.getElementById('loading-indicator').style.display = 'block';
  
  searchTimeout = setTimeout(() => {
    document.getElementById('loading-indicator').style.display = 'none';
  }, 300);
});


document.addEventListener('keydown', (e) => {
  if (e.key === '/') {
    e.preventDefault();
    document.getElementById('search-input').focus();
  }
});

async function loadBooks() {
  const { data, error } = await supabase
    .from('ebooks')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error loading books:', error.message);
    document.getElementById('books').innerHTML = `<p>Error loading books.</p>`;
    return;
  }

  allBooks = data || [];
  renderBooks(allBooks);
}

function renderBooks(books) {
  const booksDiv = document.getElementById('books');
  booksDiv.innerHTML = '';

  if (!books || books.length === 0) {
    booksDiv.innerHTML = '<p>No books found.</p>';
    return;
  }

  books.forEach(book => {
    const bookEl = document.createElement('div');
    bookEl.className = 'book';
    bookEl.style.position = 'relative'; 

    const coverImage = book.cover_url ? book.cover_url : 'placeholder.jpg';
    const shortDesc = book.description?.substring(0, 100) + (book.description?.length > 100 ? '...' : '');

    bookEl.innerHTML = `
      <a href="book.html?bookId=${book.id}" class="book-link"></a>
      <img src="${coverImage}" alt="${book.title}" width="100"/>
      <h3>${book.title}</h3>
      <p><strong>Author:</strong> ${book.author}</p>
      <p>${shortDesc}</p>
    `;

    booksDiv.appendChild(bookEl);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    document.getElementById('book-list').classList.add('fade-in');
  }, 100);
});



function setupSearch() {
  const searchInput = document.getElementById('search-input');
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase().trim();
    const filtered = allBooks.filter(book =>
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query)
    );
    renderBooks(filtered);
  });
}

checkUserAndInit();

