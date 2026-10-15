# Indiawalls Infratech — Official Website

Modern, high-performance web platform for **Indiawalls Infratech Private Limited**, built with **Next.js 14 (App Router)** and **Tailwind CSS**. 

This platform showcases Indiawalls' precast RCC compound walls, folding boundary walls, and heavy-duty paver block solutions, serving industrial, commercial, and agricultural clients across Delhi NCR and Rajasthan.

---

## 🚀 Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (React 18 App Router)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Icons & Visuals:** Next.js Image Optimization & Custom SVG Icons
- **Deployment:** Vercel / Node.js Host

---

## 🛠️ Key Features & Sections

- **Hero & About Us Section:** Clear brand proposition highlighting speed, durability, and precast engineering excellence.
- **Product Catalog & Services:** Highlights RCC compound walls, prestressed boundary walls, and interlocking paver blocks.
- **How We Complete a Full Project:** Step-by-step workflow (Consultation → Engineering → Factory Production → On-Site Assembly → Final Inspection).
- **Benefits of RCC Walls:** 9 structural advantages comparing precast concrete against traditional brick walls.
- **Our Work Portfolio Showcase:** Showcase of completed industrial, commercial, and agricultural installations.
- **Manufacturing Units & Geo-Locations:** Network details with coordinates and Google Maps integration for factory units in **Bhiwadi, Alwar, Faridabad, and Gurugram**.
- **Infinite Clientele Marquee:** Animated partner showcase featuring **Tata, Adani, One Group, Nagar Nigam, Indian Railways, and Humanity Ahead**.
- **Customer Testimonials:** Client reviews with ratings from site managers and contractors.

---

## 📂 Project Structure

```text
indiawalls/
├── public/
│   └── images/
│       ├── clients/         # Client logo assets (tata.png, adani.png, etc.)
│       └── projects/        # Project showcase gallery images
├── src/
│   ├── app/
│   │   ├── globals.css      # Global CSS & Tailwind imports
│   │   ├── layout.jsx       # Root layout component
│   │   └── page.jsx         # Main homepage integration
│   └── components/
│       ├── Navbar.jsx               # Navigation Bar
│       ├── AboutSection.jsx         # Hero / Brand intro
│       ├── WhyUsSection.jsx         # Core advantages
│       ├── ProjectProcess.jsx       # Step-by-step process workflow
│       ├── BenefitsSection.jsx      # RCC Wall advantages grid
│       ├── ManufacturingUnits.jsx   # Factory locations & geo-coords
│       ├── ClienteleSection.jsx     # Animated infinite client marquee
│       └── TestimonialsSection.jsx  # Customer reviews grid
├── tailwind.config.js       # Tailwind CSS configuration & keyframes
└── package.json