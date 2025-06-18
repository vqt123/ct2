import { kv } from '@vercel/kv';
import { put } from '@vercel/blob';
import { IncomingForm } from 'formidable';

export const config = {
  api: {
    bodyParser: false,
  },
};

function parseForm(req) {
  return new Promise((resolve, reject) => {
    const form = new IncomingForm();
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { fields, files } = await parseForm(req);
    
    const message = Array.isArray(fields.message) ? fields.message[0] : fields.message;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    let imageUrl = null;
    if (files.image && files.image.size > 0) {
      const imageFile = Array.isArray(files.image) ? files.image[0] : files.image;
      const imageBuffer = require('fs').readFileSync(imageFile.filepath);
      
      const blob = await put(`${Date.now()}-${imageFile.originalFilename}`, imageBuffer, {
        access: 'public',
      });
      
      imageUrl = blob.url;
    }

    const posts = await kv.get('blog-posts') || [];
    
    const newPost = {
      id: Date.now(),
      date: new Date().toISOString(),
      message: message,
      image: imageUrl
    };
    
    posts.push(newPost);
    await kv.set('blog-posts', posts);
    
    res.redirect(302, '/api');
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
}