# Project Overview
This is a modern web application built with **Next.js 16 (v15+)** and **React 19**. It leverages **TypeScript** for type safety and **Tailwind CSS v4** for styling. The project structure follows the Next.js App Router convention.

## Project Structure
- `app/`: Contains the main application logic, including layouts, pages, and global styles.
- `public/`: Static assets like images and SVGs.
- `my-profile/`: A secondary Next.js project or component library located within the repository.
- `eslint.config.mjs`: ESLint configuration for code quality.
- `next.config.ts`: Next.js specific configurations.
- `tsconfig.json`: TypeScript configuration with path aliases (e.g., `@/*` for root).

## Main Technologies
- **Framework:** Next.js 16.1.6 (App Router)
- **Library:** React 19.2.3
- **Styling:** Tailwind CSS v4
- **Language:** TypeScript
- **Linting:** ESLint 9

## Building and Running
You can manage the project using the following commands:

- **Development Server:**
  ```bash
  npm run dev
  ```
- **Build for Production:**
  ```bash
  npm run build
  ```
- **Start Production Server:**
  ```bash
  npm run start
  ```
- **Linting:**
  ```bash
  npm run lint
  ```

## Development Conventions
- **App Router:** Use the `app/` directory for routing and server components.
- **Styling:** Utilize Tailwind CSS v4 classes directly in JSX/TSX files. Global styles are defined in `app/globals.css`.
- **Fonts:** Geist and Geist Mono are used via `next/font/google`.
- **Path Aliases:** Use `@/` to reference files from the root directory as configured in `tsconfig.json`.
- **Strict Mode:** TypeScript is configured with `strict: true` to ensure high code quality.
