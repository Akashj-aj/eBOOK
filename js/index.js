
const supabase = window.supabaseClient;

const adminEmails = ['vvce23cseaiml0051@vvce.ac.in'];
let allBooks = []; // To store fetched books

async function checkUserAndInit() {
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    console.log('Logged in as:', user.email);
    if (adminEmails.includes(user.email)) {
      document.getElementById('upload-link').style.display = 'inline';
    }
  }

  await loadBooks(); // Load all books
  setupSearch();     // Attach search functionality
}

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

    const coverImage = book.cover_url ? book.cover_url : 'placeholder.jpg';

    bookEl.innerHTML = `
      <img src="${coverImage}" alt="${book.title}" width="100"/>
      <h3>${book.title}</h3>
      <p><strong>Author:</strong> ${book.author}</p>
      <p>${book.description || ''}</p>
      <a href="book.html?bookId=${book.id}">Read More</a>
    `;

    booksDiv.appendChild(bookEl);
  });
}

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

