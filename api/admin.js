export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Admin - Daily Blog</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
        form { border: 1px solid #ddd; padding: 20px; border-radius: 5px; background: #fafafa; }
        input, textarea { width: 100%; padding: 10px; margin: 10px 0; box-sizing: border-box; border: 1px solid #ddd; border-radius: 4px; }
        button { background-color: #007cba; color: white; padding: 12px 24px; border: none; border-radius: 4px; cursor: pointer; font-size: 16px; }
        button:hover { background-color: #005a87; }
        .back-link { color: #007cba; text-decoration: none; }
        .back-link:hover { text-decoration: underline; }
      </style>
    </head>
    <body>
      <h1>Admin Panel</h1>
      <a href="/api" class="back-link">← Back to Blog</a>
      
      <h2>Add New Post</h2>
      <form action="/api/admin/post" method="post" enctype="multipart/form-data">
        <label for="image">Image (optional):</label>
        <input type="file" id="image" name="image" accept="image/*">
        
        <label for="message">Message:</label>
        <textarea id="message" name="message" rows="5" required placeholder="Write your daily message here..."></textarea>
        
        <button type="submit">Post</button>
      </form>
    </body>
    </html>
  `;

  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(html);
}