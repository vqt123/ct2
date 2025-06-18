const request = require('supertest');
const fs = require('fs');
const path = require('path');

let app;

describe('Blog Server', () => {
  beforeEach(() => {
    delete require.cache[require.resolve('./server.js')];
    
    if (fs.existsSync('posts.json')) {
      fs.unlinkSync('posts.json');
    }
    
    if (fs.existsSync('uploads')) {
      const files = fs.readdirSync('uploads');
      for (const file of files) {
        fs.unlinkSync(path.join('uploads', file));
      }
      fs.rmdirSync('uploads');
    }
  });

  beforeEach(() => {
    app = require('./server.js');
  });

  test('GET / shows empty blog when no posts', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toContain('No posts yet');
    expect(response.text).toContain('Daily Blog');
  });

  test('GET /admin shows admin form', async () => {
    const response = await request(app).get('/admin');
    expect(response.status).toBe(200);
    expect(response.text).toContain('Admin Panel');
    expect(response.text).toContain('Add New Post');
  });

  test('POST /admin/post creates a new post', async () => {
    const response = await request(app)
      .post('/admin/post')
      .field('message', 'Test message');
    
    expect(response.status).toBe(302);
    
    const posts = JSON.parse(fs.readFileSync('posts.json', 'utf8'));
    expect(posts).toHaveLength(1);
    expect(posts[0].message).toBe('Test message');
    expect(posts[0].date).toBeDefined();
  });

  test('GET / shows posts after creation', async () => {
    await request(app)
      .post('/admin/post')
      .field('message', 'Test message');
    
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toContain('Test message');
    expect(response.text).not.toContain('No posts yet');
  });

  test('POST /admin/post with image uploads file', async () => {
    const testImagePath = path.join(__dirname, 'test-image.png');
    fs.writeFileSync(testImagePath, 'fake image data');

    try {
      const response = await request(app)
        .post('/admin/post')
        .field('message', 'Test with image')
        .attach('image', testImagePath);
      
      expect(response.status).toBe(302);
      
      const posts = JSON.parse(fs.readFileSync('posts.json', 'utf8'));
      expect(posts).toHaveLength(1);
      expect(posts[0].image).toBeDefined();
      expect(fs.existsSync(path.join('uploads', posts[0].image))).toBe(true);
    } finally {
      fs.unlinkSync(testImagePath);
    }
  });
});