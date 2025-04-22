const supabase = window.supabaseClient;

async function handleUpload(event) {
  event.preventDefault();

  const title = document.getElementById('title').value.trim();
  const author = document.getElementById('author').value.trim();
  const description = document.getElementById('description').value.trim();
  const coverFile = document.getElementById('cover').files[0];
  const pdfFile = document.getElementById('pdf').files[0];

  // Check if all required fields are filled
  if (!title || !author || !coverFile || !pdfFile) {
    alert('Please fill all required fields and select files.');
    return;
  }

  // Check file types
  if (coverFile.type !== 'image/jpeg') {
    alert('Cover image must be a JPG file.');
    return;
  }

  if (pdfFile.type !== 'application/pdf') {
    alert('Book file must be a PDF.');
    return;
  }

  try {
    // Upload cover image
    const coverPath = `${Date.now()}_${coverFile.name}`;
    let { error: coverError } = await supabase.storage
      .from('ebooks')
      .upload(coverPath, coverFile, { contentType: coverFile.type });

    if (coverError) {
      console.error('Error uploading cover image:', coverError); 
      alert('Error uploading cover image: ' + (coverError.message || JSON.stringify(coverError)));
      return;
    } else {
      console.log('Cover image uploaded successfully:', coverPath);
    }

    // Upload PDF file
    const pdfPath = `${Date.now()}_${pdfFile.name}`;
    let { error: pdfError } = await supabase.storage
      .from('ebooks')
      .upload(pdfPath, pdfFile, { contentType: pdfFile.type });

    if (pdfError) {
      console.error('Error uploading PDF:', pdfError); 
      alert('Error uploading book file: ' + (pdfError.message || JSON.stringify(pdfError)));
      return;
    } else {
      console.log('PDF uploaded successfully:', pdfPath);
    }

    const basePublicUrl = 'https://gdwvaxnctfxxwwhbhmtl.supabase.co/storage/v1/object/public/ebooks';
    const coverURL = `${basePublicUrl}/${coverPath}`;
    const pdfURL = `${basePublicUrl}/${pdfPath}`;

    console.log('Cover Signed URL:', coverURL);
    console.log('PDF Signed URL:', pdfURL);

    if (!coverURL || !pdfURL) {
      alert('Failed to get signed URLs for uploaded files.');
      return;
    }

    // Insert metadata into the database
    const insertPayload = [{
      title,
      author,
      description,
      cover_url: coverURL,
      file_url: pdfURL,
      created_at: new Date().toISOString(),
    }];

    console.log('Insert payload:', insertPayload);

    const { data: insertData, error: dbError } = await supabase
      .from('ebooks')
      .insert(insertPayload);

    console.log('Insert response data:', insertData);
    console.log('Insert response error:', dbError);

    if (dbError) {
      console.error('Error saving book info:', dbError); 
      alert('Error saving book info: ' + (dbError.message || JSON.stringify(dbError)));
      return;
    }

    alert('Book uploaded successfully!');
    window.location.href = 'homepage.html';

  } catch (error) {
    console.error('Unexpected error:', error); 
    alert('Unexpected error: ' + error.message);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    document.getElementById('upload-form').classList.add('fade-in');
  }, 200);
});

// Attach event listener to the form
document.getElementById('book-upload-form').addEventListener('submit', handleUpload);
