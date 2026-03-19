# GEMINI.md - MyLink (Linktree Clone)

This file provides context and instructions for AI agents working on the MyLink project.

## Project Overview
**MyLink** is a Linktree clone service designed for creators, freelancers, and small businesses. It allows users to aggregate multiple social media, website, and portfolio links into a single, customizable landing page.

- **Primary Stack:** Next.js 16 (App Router), React 19, TypeScript.
- **Styling:** Tailwind CSS 4 (using `@tailwindcss/postcss`).
- **UI Framework:** shadcn/ui (leveraging `@base-ui/react` and `class-variance-authority`).
- **Authentication:** Google Social Login (Planned).
- **Core Feature:** Automatic favicon generation for links using the Google Favicon API.

## Building and Running
| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Next.js development server with Turbopack. |
| `npm run build` | Builds the application for production. |
| `npm run start` | Starts the production server. |
| `npm run lint` | Runs ESLint for code quality checks. |
| `npm run format` | Formats code using Prettier. |
| `npm run typecheck` | Runs TypeScript compiler to verify types. |

## Development Conventions
- **Component Strategy:** Follow the shadcn/ui pattern. Components are placed in `components/ui/` and use `@base-ui/react` primitives where possible.
- **Styling:** Use Tailwind CSS 4 utility classes. Prefer vanilla CSS variables if complex customization is needed beyond Tailwind.
- **Architecture:** 
  - `app/`: Contains the Next.js App Router routes, layouts, and page-specific logic.
  - `components/`: Houses reusable UI components.
  - `lib/`: Contains shared utility functions (e.g., `cn` for class merging).
  - `docs/`: Stores project documentation (PRD, User Scenarios, Data Models).
- **Iconography:** Use `lucide-react` for application icons. For user-provided links, use the Google Favicon API: `https://www.google.com/s2/favicons?domain=[domain]&sz=64`.
- **Import Aliases:** Use `@/` for absolute imports from the project root.

## Project Structure (Key Files)
- `docs/PRD.md`: Core product requirements and feature list.
- `app/layout.tsx`: Root layout with theme providers and global styles.
- `components/ui/`: Base UI components (Button, etc.).
- `tailwind.config.ts`: Tailwind CSS configuration (Note: Tailwind 4 primarily uses CSS variables in `globals.css`).

## Instructions for AI Agents
- **Contextual Precedence:** Always refer to `docs/PRD.md` before implementing new features.
- **Testing:** Add or update tests when modifying core logic or components.
- **Security:** Never commit or log secrets. Use environment variables for sensitive configuration.
- **Consistency:** Maintain the established coding style (Next.js 16 + React 19 + Tailwind 4).
