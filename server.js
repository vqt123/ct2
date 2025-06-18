const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync('uploads')) {
      fs.mkdirSync('uploads');
    }
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

function loadPosts() {
  try {
    const data = fs.readFileSync('posts.json', 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

function savePosts(posts) {
  fs.writeFileSync('posts.json', JSON.stringify(posts, null, 2));
}

app.get('/', (req, res) => {
  const posts = loadPosts();
  const sortedPosts = posts.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Daily Blog</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        .post { border-bottom: 1px solid #eee; padding: 20px 0; }
        .post img { max-width: 100%; height: auto; }
        .date { color: #666; font-size: 0.9em; }
        .admin-link { position: fixed; top: 10px; right: 10px; }
      </style>
    </head>
    <body>
      <a href="/admin" class="admin-link">Admin</a>
      <h1>Daily Blog</h1>
  `;
  
  if (sortedPosts.length === 0) {
    html += '<p>No posts yet. <a href="/admin">Add the first post!</a></p>';
  } else {
    sortedPosts.forEach(post => {
      html += `
        <div class="post">
          <div class="date">${new Date(post.date).toLocaleDateString()}</div>
          ${post.image ? `<img src="/uploads/${path.basename(post.image)}" alt="Post image">` : ''}
          <p>${post.message}</p>
        </div>
      `;
    });
  }
  
  html += '</body></html>';
  res.send(html);
});

app.get('/admin', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Admin - Daily Blog</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
        form { border: 1px solid #ddd; padding: 20px; border-radius: 5px; }
        input, textarea { width: 100%; padding: 10px; margin: 10px 0; box-sizing: border-box; }
        button { background-color: #007cba; color: white; padding: 10px 20px; border: none; border-radius: 3px; cursor: pointer; }
        button:hover { background-color: #005a87; }
      </style>
    </head>
    <body>
      <h1>Admin Panel</h1>
      <a href="/">← Back to Blog</a>
      
      <h2>Add New Post</h2>
      <form action="/admin/post" method="post" enctype="multipart/form-data">
        <label for="image">Image (optional):</label>
        <input type="file" id="image" name="image" accept="image/*">
        
        <label for="message">Message:</label>
        <textarea id="message" name="message" rows="5" required></textarea>
        
        <button type="submit">Post</button>
      </form>
    </body>
    </html>
  `);
});

app.post('/admin/post', upload.single('image'), (req, res) => {
  const posts = loadPosts();
  
  const newPost = {
    id: Date.now(),
    date: new Date().toISOString(),
    message: req.body.message,
    image: req.file ? req.file.filename : null
  };
  
  posts.push(newPost);
  savePosts(posts);
  
  res.redirect('/');
});

app.use('/uploads', express.static('uploads'));

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

module.exports = app;