# Fenica Invitation & Ranking Platform

A high-performance Next.js application built for the **"SĂN VÉ LÊN TÀU CÙNG FENICA"** campaign. It features a luxury 3D WebGL background, dynamic invitation card generation, social ranking boards, and an admin dashboard.

## 🌟 Key Features

- **Dynamic Invitation Card Generation:** 
  Users can generate personalized high-resolution invitation cards with their name and custom titles using HTML2Canvas, with smart aspect-ratio correction to prevent image distortion.
- **Premium 3D WebGL Background:**
  A luxurious interactive fluid wave background powered by `React Three Fiber`, `Three.js`, and Custom GLSL ShaderMaterials (Simplex Noise) that reacts dynamically to mouse movement and creates a stunning visual aesthetic.
- **Social Ranking Board:** 
  A real-time ranking page (`/ranking`) displaying live metrics (Likes, Comments, Shares) fetched from Upstash Redis.
- **Shareable Links & QR Codes:** 
  Generate unique `/share/[slug]` pages with dynamic OpenGraph SEO metadata, QR code generation, and 1-click clipboard/Facebook sharing functionality.
- **Admin Dashboard:**
  A fully responsive, mobile-first admin interface (`/dashboard`) to manage generated invitations and view scraped social data.
- **Next.js 16 Optimizations:**
  Utilizes the latest Next.js 16 features including Turbopack, App Router, Server Components, and Partial Prerendering (PPR) for blazing fast load times.

## 🛠 Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **3D Graphics:** [Three.js](https://threejs.org/) & [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction)
- **Database:** [PostgreSQL](https://www.postgresql.org/) + [Drizzle ORM](https://orm.drizzle.team/)
- **Cache / Redis:** [Upstash Redis](https://upstash.com/)
- **Image Generation:** `html2canvas`
- **UI Components:** [Lucide React](https://lucide.dev/), Radix UI

## 🚀 Getting Started

### 1. Installation

Install the dependencies:

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file in the root directory and add the required environment variables:

```bash
# Database (PostgreSQL)
POSTGRES_URL=postgresql://user:password@localhost:5432/fenica

# Redis (Upstash for Social Data)
UPSTASH_REDIS_REST_URL=your_upstash_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_token

# Application URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 3. Database Setup

Push the database schema using Drizzle:

```bash
npm run db:generate
npm run db:migrate
```

### 4. Running the Development Server

Start the application using Turbopack:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to interact with the application.

## 📂 Project Structure

- `app/(board)`: Main public pages (Home, Ranking, Invitations).
- `app/(dashboard)`: Admin dashboard with responsive sidebar layout.
- `app/share/[slug]`: Dynamic shareable pages with SEO OpenGraph integration.
- `components/atoms`: Reusable micro-components (e.g., `ParticleBackground`, `ShareButtons`, `InvitationCard`).
- `lib/db`: Drizzle ORM schema and database connection setup.
