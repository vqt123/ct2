# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.


## Project Overview

This is a simple daily blog site built with Node.js and Express where an admin can submit images and messages for each day.

**Architecture:**
- Express server with HTML templates (no frontend framework) for local development
- Vercel API routes for serverless deployment (`api/` directory)
- Vercel KV (Redis) for persistent post storage
- Vercel Blob for image storage and serving
- Inline CSS styling for simplicity

## Development Commands

- `npm start` - Start the Express server locally on http://localhost:3000
- `npm run dev` - Start Vercel development server (for testing Vercel deployment locally)
- `npm test` - Run Jest tests

## Key Routes

**Local Express Server:**
- `/` - Public blog view (shows all posts, newest first)
- `/admin` - Admin form to submit new posts
- `POST /admin/post` - Creates new post with optional image upload
- `/uploads/*` - Serves uploaded images

**Vercel Deployment:**
- `/` - Public blog view (via `api/index.js`)
- `/admin` - Admin form (via `api/admin.js`)
- `POST /admin/post` - Creates new post (via `api/admin/post.js`)

## Deployment

To deploy to Vercel:
1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect the configuration
3. Set up Vercel KV and Blob storage in your Vercel dashboard
4. Environment variables are handled automatically by Vercel

## Development Philosophy

- **Start simple**: Build things in the most straightforward way possible, even naively
- **Don't premature optimize**: Don't build things out to scale until we actually need to
- **Test everything**: Write tests for all functionality to catch regressions when refactoring
- **Refactor with confidence**: Use tests as safety nets when changing pieces later

## Future Updates

This file should be updated once the project structure and technology stack are established to include:
- Build commands (npm run build, make, etc.)
- Test commands (npm test, pytest, etc.)
- Linting and formatting commands
- Architecture overview and key directories
- Development workflow and conventions