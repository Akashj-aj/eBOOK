const supabase = window.supabaseClient;

async function loadBook() {
  const params = new URLSearchParams(window.location.search);
  const bookId = params.get('bookId'); // Get book ID from URL

  const { data, error } = await supabase
    .from('ebooks')
    .select('*')
    .eq('id', bookId)
    .single();

  if (error) {
    console.error('Error fetching book:', error.message);
    return;
  }

  // Populate book details
  document.getElementById('book-title').textContent = data.title;
  document.getElementById('book-author').textContent = `Author: ${data.author}`;
  document.getElementById('book-description').textContent = data.description || 'No description available.';
  document.getElementById('book-cover').src = data.cover_url;
  document.getElementById('book-read-link').href = `reader.html?bookId=${bookId}`;

  console.log("File URL:", data.file_url);

  // Extract file path for Supabase signed URL
  const fileUrl = data.file_url; // This is already the public URL

  const downloadBtn = document.getElementById('download-btn');
  if (downloadBtn) {
    // Set the href to the file URL
    downloadBtn.setAttribute('href', fileUrl);
    downloadBtn.setAttribute('download', `${data.title}.pdf`);

    // Direct download using fetch
    downloadBtn.addEventListener('click', async (e) => {
      e.preventDefault();  // Prevent default anchor behavior

      try {
        const response = await fetch(fileUrl);  // Fetch the file from the URL
        const blob = await response.blob();  // Convert to Blob

        const link = document.createElement('a');  // Create an anchor element
        link.href = URL.createObjectURL(blob);  // Create a URL for the Blob
        link.download = `${data.title}.pdf`;  // Set the filename for download
        link.click();  // Trigger the download
      } catch (error) {
        console.error('Error downloading the file:', error);
      }
    });
  }

  // If you want to use it in PDF reader/viewer
  loadPdf(fileUrl);
}

loadBook();


