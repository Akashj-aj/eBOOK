const supabase = window.supabaseClient;
const urlParams = new URLSearchParams(window.location.search);
const bookId = urlParams.get('bookId');

if (!bookId) {
  console.error("No bookId found in the URL.");
} else {
  async function fetchBookForReading(bookId) {
    const { data, error } = await supabase
      .from('ebooks')
      .select('title, file_url')
      .eq('id', bookId)
      .single();

    if (error) {
      console.error("Error fetching book:", error);
      return;
    }

    document.getElementById('book-title').textContent = data.title;
    document.getElementById('prev-book-link').href = `book.html?bookId=${bookId}`;
    
    loadPdf(data.file_url);
  }

  fetchBookForReading(bookId);
}

// PDF.js logic
let pdfDoc = null,
    pageNum = 1,
    pageIsRendering = false,
    pageNumIsPending = null;

const scale = 1.5,
      canvas = document.getElementById('pdf-render'),
      ctx = canvas.getContext('2d');

function renderPage(num) {
  pageIsRendering = true;

  pdfDoc.getPage(num).then(page => {
    const viewport = page.getViewport({ scale });
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderCtx = {
      canvasContext: ctx,
      viewport: viewport
    };

    page.render(renderCtx).promise.then(() => {
      pageIsRendering = false;

      if (pageNumIsPending !== null) {
        renderPage(pageNumIsPending);
        pageNumIsPending = null;
      }
    });

    document.getElementById('page-num').textContent = num;
  });
}

function queueRenderPage(num) {
  if (pageIsRendering) {
    pageNumIsPending = num;
  } else {
    renderPage(num);
  }
}

function showPrevPage() {
  if (pageNum <= 1) return;
  pageNum--;
  queueRenderPage(pageNum);
}

function showNextPage() {
  if (pageNum >= pdfDoc.numPages) return;
  pageNum++;
  queueRenderPage(pageNum);
}

document.getElementById('prev-page').addEventListener('click', showPrevPage);
document.getElementById('next-page').addEventListener('click', showNextPage);

function loadPdf(pdfUrl) {
  const loadingTask = pdfjsLib.getDocument(pdfUrl);
  loadingTask.promise.then(pdf => {
    pdfDoc = pdf;
    document.getElementById('page-count').textContent = pdf.numPages;
    renderPage(pageNum);
  }).catch(err => {
    console.error('Error loading PDF:', err.message);
  });
}
document.getElementById('jump-btn').addEventListener('click', () => {
  const input = document.getElementById('jump-to-page');
  const page = parseInt(input.value, 10);

  if (Number.isInteger(page) && page >= 1 && page <= pdfDoc.numPages) {
    pageNum = page;
    queueRenderPage(pageNum);
  } else {
    alert(`Please enter a valid page number (1 to ${pdfDoc.numPages})`);
  }
});

// Handle ENTER key inside input box
document.getElementById('jump-to-page').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    document.getElementById('jump-btn').click();
  }
});
