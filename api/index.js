import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const posts = await kv.get('blog-posts') || [];
    const sortedPosts = posts.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    let html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Daily Blog</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
          .post { border-bottom: 1px solid #eee; padding: 20px 0; }
          .post img { max-width: 100%; height: auto; border-radius: 8px; }
          .date { color: #666; font-size: 0.9em; margin-bottom: 10px; }
          .admin-link { position: fixed; top: 10px; right: 10px; background: #007cba; color: white; padding: 8px 16px; text-decoration: none; border-radius: 4px; }
          .admin-link:hover { background: #005a87; }
          .message { white-space: pre-wrap; line-height: 1.6; }
        </style>
      </head>
      <body>
        <a href="/api/admin" class="admin-link">Admin</a>
        <h1>Daily Blog</h1>
    `;
    
    if (sortedPosts.length === 0) {
      html += '<p>No posts yet. <a href="/api/admin">Add the first post!</a></p>';
    } else {
      sortedPosts.forEach(post => {
        html += `
          <div class="post">
            <div class="date">${new Date(post.date).toLocaleDateString()}</div>
            ${post.image ? `<img src="${post.image}" alt="Post image">` : ''}
            <div class="message">${post.message}</div>
          </div>
        `;
      });
    }
    
    html += '</body></html>';
    
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(html);
  } catch (error) {
    console.error('Error loading posts:', error);
    res.status(500).json({ error: 'Failed to load posts' });
  }
}