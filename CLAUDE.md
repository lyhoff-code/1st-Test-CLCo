# DataBake.media — Content Creation Platform

## Project Overview
AI-powered content creation platform for e-commerce. It orchestrates the user's existing free tools (Grok Imagine, CapCut, Canva, ElevenLabs) into a streamlined daily content pipeline.

## Tech Stack
- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS + Framer Motion
- **AI**: OpenAI API (script/prompt generation)
- **Audio**: ElevenLabs API (speech generation)
- **Video Processing**: FFmpeg (server-side video splitting)
- **Auth**: NextAuth + Prisma Adapter
- **Icons**: Lucide React

## Brand Colors
- Primary Turquoise: `#A8E6E1`
- Accent Pink: `#F9B4C4`
- Dark variants for contrast
- Glassmorphism + backdrop blur throughout

## Architecture

### Core Modules
1. **Content Pipeline** (`/src/components/pipeline/`) — The main workflow:
   - Select product → Select template → AI generates prompts per cut → Generate assets → Publish
2. **Template Catalog** (`/src/components/templates/`) — Personal library of CapCut/Canva template references
3. **Caption System** (`/src/components/captions/`) — Fixed captions per product per social network
4. **Video Splitter** (`/src/components/video/`) — Split long videos into short clips (FFmpeg)
5. **Publisher** (`/src/components/publisher/`) — Upload final video + publish to all social networks

### Existing Modules (legacy)
- Image Editor, Video Creator, Stories Creator, Ad Generator

### API Routes
- `/api/generate-prompts` — AI generates image/animation/speech prompts per cut
- `/api/generate-speech` — ElevenLabs text-to-speech
- `/api/video/split` — FFmpeg video splitting
- `/api/templates` — CRUD for template catalog
- `/api/captions` — CRUD for product captions
- `/api/publish` — Multi-platform social media publishing

### Data Storage
- `/src/data/templates.json` — Saved template references
- `/src/data/captions.json` — Product captions per platform

## Key Design Decisions
- Platform is an **orchestrator**, not a replacement for CapCut/Canva
- Image and video generation happens in external tools (Grok Imagine) — platform provides prompts + direct links
- Audio generation is direct via ElevenLabs API
- Captions are fixed per product per social network (configured once, used always)
- Templates are references to external CapCut/Canva templates with metadata (cuts, structure, link)

## Conventions
- Components use `'use client'` directive
- Framer Motion for all animations
- Tailwind with databake- prefixed custom colors
- Dark mode support via `dark:` classes
- Lucide icons throughout
- Spanish language for user-facing content labels where applicable
