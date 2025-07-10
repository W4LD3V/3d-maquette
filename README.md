# 3D Maquette — PDP Task Delivery

3D Maquette is a learning-focused web application built with **Next.js 15**, **GraphQL**, and **SWR**, designed to explore SSR/SSG rendering strategies, GraphQL data handling, and client-side data fetching. The project simulates a platform where clients can submit `.stl` files for 3D printing, selecting options like plastic type and color.

This project was developed as part of a **Personal Development Plan (PDP)** to gain practical experience in real-world technologies used by modern full-stack teams.

---

## 🎯 Project Goals & Fulfillment

### ✅ 1. Learn Next.js

| **Goal** | Catch up on the Next.js framework, especially SSR/SSG and App Router concepts |
|----------|-------------------------------------------------------------------------------|
| **Relevancy** | The 3D Maquette project uses Next.js 15 with the App Router and SSR — knowledge is essential to contribute effectively |
| **Specificity** | Understand App Router, layout.tsx, data fetching strategies, layout shift, and SEO optimization |
| **Measurability** | A working Next.js project using App Router, global styling, custom layout, SSR structure |
| **Plan** | Follow Next.js docs, build layout with `src/app/layout.tsx`, apply styling via `globals.css`, test rendering with SSR-compatible structure |

---

### ✅ 2. Learn GraphQL

| **Goal** | Understand GraphQL fundamentals and how it's integrated in a Next.js app |
|----------|---------------------------------------------------------------------------|
| **Relevancy** | The project will use GraphQL for data aggregation between microservices |
| **Specificity** | Understand queries, mutations, resolvers, context, data sources, and testing |
| **Measurability** | GraphQL server is set up and integrated into the Next.js project |
| **Plan** | Read Apollo Server docs, build basic schema, connect it to Next.js, test queries from the frontend |

**✅ Fulfilled Tasks:**
- Apollo Server installed and configured
- GraphQL schema defined using `@graphql-tools/schema`
- GraphQL endpoint exposed via Next.js API route
- Planned integration of GraphQL queries with SWR for client-side data fetching

---

### ✅ 3. Learn SWR

| **Goal** | Understand and apply SWR for client-side data fetching in a Next.js app |
|----------|-------------------------------------------------------------------------|
| **Relevancy** | The project fetches data client-side and benefits from caching and revalidation |
| **Specificity** | Learn about hooks, caching strategies, integration with GraphQL |
| **Measurability** | SWR is integrated and used for real-time client-side data fetching |
| **Plan** | Read SWR docs, implement SWR fetching with sample GraphQL query, test client-only fetch logic |

**✅ Fulfilled Tasks:**
- Installed and configured SWR
- SWR ready for fetching GraphQL queries (via urql or fetch)
- Setup designed for caching & revalidation
- Ensured compatibility with SSR and hydration logic

---

## 🧱 Tech Stack

| Layer        | Technology |
|--------------|------------|
| **Framework** | Next.js 15 App Router |
| **Styling**   | Tailwind CSS v4 (PostCSS + Autoprefixer) |
| **Data Layer** | GraphQL (Apollo Server), Prisma (planned) |
| **Client Data** | SWR |
| **Language** | TypeScript |

---

## 🗂️ Directory Overview

```bash
3d-maquette/
├── src/
│   ├── app/
│   │   ├── layout.tsx       # Global layout using App Router
│   │   ├── page.tsx         # Homepage placeholder
│   │   └── globals.css      # Tailwind styles
├── graphql/
│   └── schema.ts            # GraphQL schema definitions
├── pages/api/graphql.ts     # GraphQL API endpoint
├── postcss.config.cjs       # PostCSS setup (compatible with ESM)
├── tailwind.config.mjs      # Tailwind config
├── package.json             # Project dependencies
