# Ashtanga Yoga Zentral Astro

## 🧘 About the Project

This repository contains the source code for the official website of Ashtanga Yoga Zentral, a yoga studio located in Berlin. The website is built using **Astro**, a modern static site generator, and is designed to promote the studio's classes, services, and the specialized instruction provided by Elinore Burke.

The goal of the website is to provide a clear, welcoming, and informative digital presence for the yoga community.

## 🚀 Getting Started

Follow these steps to get the project running locally.

### Prerequisites

*   Node.js (Recommended LTS version)
*   npm (Node Package Manager)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [repository-url]
    cd ashtanga_yoga_zentral_astro
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Start the development server:**
    ```bash
    npm run dev
    ```
    The site should now be accessible in your browser (usually at `http://localhost:4321/`).

## 📂 Project Structure

The website follows a standard Astro/frontend structure:

*   **`public/`**: Stores static assets like images (`images/`) and configuration files (`.nojekyll`).
*   **`src/`**: Contains all the core source code.
    *   **`pages/`**: Astro routing pages.
        *   `index.astro`: The main landing page (Home).
        *   `about.astro`: Information about the authorized teacher, Elinore Burke.
        *   `contact.astro`: Contact information (details not shown, but implied).
        *   `moon-days.astro`: Specific page related to class exceptions.
        *   `retreats.astro`: Information about retreat packages.
        *   `index.astro`: (Redundant, but used for the root page, generally the main entry point).
    *   **`layouts/`**: Defines the reusable layout structure for the site (`MainLayout.astro`).
    *   **`components/`**: Contains reusable UI components (e.g., `Navigation.astro`).
    *   **`styles/`**: Global CSS styles (`global.css`).

## ✨ Key Features & Sections

The website is divided into several core areas:

1.  **Home Page (`/`):**
    *   **Hero Section:** Prominently features "Morning Ashtanga Yoga (Mysore style) in Berlin."
    *   **Introduction:** A supportive welcome to the Shala.
    *   **Schedule:** Displays class times and the location (Three Boons Studio, Berlin).
    *   **Pricing:** Details various membership options (Trial Month, Unlimited Month, 12x Month, Drop-In, etc.) with a special note about financial discounts.

2.  **About Page (`/about`):**
    *   Profiles Elinore Burke, the Authorized-Level 2 Ashtanga Yoga Teacher.
    *   Highlights her extensive background, training in Mysore, India, and qualifications (Yoga Therapy, Mindfulness Meditation).
    *   Includes testimonials to build trust and community.

## 🎨 Design & Styling

*   The project uses **Tailwind CSS** (implied by class names like `text-primary`, `bg-light`) and a custom CSS file (`src/styles/global.css`) for specific styling (e.g., `.hero-section`, `.testimonial-card`).
*   The color palette is defined by CSS variables, emphasizing primary and secondary colors relevant to yoga and mindfulness.

## 🏗️ Build and Deployment

To generate the optimized static assets for deployment (e.g., GitHub Pages, Netlify):

```bash
npm run build
```

The resulting static files will be placed in the `dist/` directory (or similar, depending on `astro.config.mjs` setup).