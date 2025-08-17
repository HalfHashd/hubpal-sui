# HubPal_v2

**ENS + Chainlink “Shopify for Projects & Crowdfunding” Demo**  
Hackathon Submission  

---

## 🚀 Overview
HubPal_v2 is a decentralized **project creation, curation, and crowdfunding platform**.  
Think of it as **Shopify for projects** — anyone can create, manage, and fund projects with milestone-based accountability.  

Key features:  
- **ENS for Projects & Milestones**  
  - Each project and milestone gets an ENS subdomain.  
  - Identity everywhere: addresses auto-resolve to ENS names in the UI.  

- **Chainlink Oracles**  
  - Certify Web2 + real-world events.  
  - Milestones update automatically when QuickBooks-style deliverables are marked complete.  

- **PYUSD + USDC Payments**  
  - Milestone-based funding releases.  
  - Installment-style “Pay Over Time” model for services (adapted from PayPal).  

- **Walrus Decentralized Storage**  
  - Store project docs, invoices, and media in a distributed way.  

- **QuickBooks-style Web2 Feed (Demo)**  
  - Real-world invoice/approval → triggers Chainlink → updates milestones → visible in marketplace.  

---

## 🏅 Hackathon Tracks
This project directly targets the following sponsor tracks:

1. **ENS** – First integration of ENS subnames for **projects, milestones, and participants**.  
2. **Chainlink** – First demo of using Chainlink to **validate real-world project deliverables**.  
3. **PayPal PYUSD** – Milestone escrow + “Pay Over Time” simulation.  
4. **Walrus** – Demo of decentralized file storage for project data.  

---

## 🖥️ Live Demo
👉 [View Live App](https://v0.app/chat/no-content-fY03UScKZ5V)  
👉 [GitHub Repo](https://github.com/HalfHashd/hubpal_v2)  

---

## 📸 Screenshots
*(add screenshots of Home, Marketplace, Create Project, and Sponsor Demos here)*  

---

## 🛠️ How It Works
1. Create a new project from the home page.  
2. Assign milestones (e.g., Planning, Prototype, MVP, Production).  
3. Each milestone = ENS subdomain + Chainlink feed.  
4. Mark milestone complete via QuickBook-style page → Chainlink verifies → updates marketplace/project view.  
5. Payments release in PYUSD/USDC as milestones complete.  

---

## 📂 Project Structure
- `pages/index.tsx` → Home page  
- `pages/marketplace.tsx` → Project marketplace tiles  
- `pages/create.tsx` → Create Project form  
- `pages/project/[slug].tsx` → Individual project detail + timeline  
- `pages/sponsor/*` → Sponsor demo pages (ENS, Chainlink, PYUSD, Walrus, QuickBooks)  
- `lib/` → Store, types, utilities  

---

## 📌 Key Innovation
- ✅ **First use of ENS for projects & milestones**  
- ✅ **First Chainlink demo for real-world project completion**  
- ✅ **Shopify-style marketplace for crowdfunding with milestones**  

---

## 👥 Team
Project by **HubPal.org**  
Hackathon Demo 2025

================================= 
================================= 
Below was created by teh V0.app - I am saving it by pushing it down. (08.17.22025. 2:52 am)

# HubPal_2

*Automatically synced with your [v0.app](https://v0.app) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/halfhashds-projects/v0-hub-pal-2)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/projects/1KPWSugTFD6)

## Overview

This repository will stay in sync with your deployed chats on [v0.app](https://v0.app).
Any changes you make to your deployed app will be automatically pushed to this repository from [v0.app](https://v0.app).

## Deployment

Your project is live at:

**[https://vercel.com/halfhashds-projects/v0-hub-pal-2](https://vercel.com/halfhashds-projects/v0-hub-pal-2)**

## Build your app

Continue building your app on:

**[https://v0.app/chat/projects/1KPWSugTFD6](https://v0.app/chat/projects/1KPWSugTFD6)**

## How It Works

1. Create and modify your project using [v0.app](https://v0.app)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository
