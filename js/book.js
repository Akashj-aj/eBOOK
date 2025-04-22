const supabase = window.supabaseClient;

async function loadBook() {
  const params = new URLSearchParams(window.location.search);
  const bookId = params.get('bookId'); 

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
  const fileUrl = data.file_url; 

  const downloadBtn = document.getElementById('download-btn');
  if (downloadBtn) {
    // Set the href to the file URL
    downloadBtn.setAttribute('href', fileUrl);
    downloadBtn.setAttribute('download', `${data.title}.pdf`);

    // Direct download using fetch
    downloadBtn.addEventListener('click', async (e) => {
      e.preventDefault();  // Prevent default anchor behavior

      try {
        const response = await fetch(fileUrl); 
        const blob = await response.blob();  

        const link = document.createElement('a');  
        link.href = URL.createObjectURL(blob);  
        link.download = `${data.title}.pdf`;  
        link.click();  
      } catch (error) {
        console.error('Error downloading the file:', error);
      }
    });
  }
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      document.getElementById('book-detail').classList.add('fade-in');
    }, 100);
  });

  
  loadPdf(fileUrl);
}

loadBook();


