<p align="center">
  <img src="assets/HubPal_difference.png" alt="HubPal logo" width="60%">
</p>

Read me: This README.md is a clone of hubpal-ethgb (08.15-17) which was the project done at the hackathon. Here, we (GPT4 and V0 and me) simply replaced ENS to SNS and .eth to .sui. At the new /hubpal-sui2, we will rebuild fucused on Walrus* and SUI. I am not a coder or trained engineer, but I am near peerless in imagining new use cases, new systems, with a focus on mating the blockchain + AI + the Woo. Yes. ; ) ... I know of SUI*, but have only just begun to dig in, esp. after Daniel L's (dev ops) presentation of Walrus - SUI mission to be, im my words: the d/d/d (decentralized-distributed-data) to be as "maximally-feasible" as possible. (*Raoul Pal, and his maxi macro exponetial age thesis and his support of SUI. I agree.) With my minimally knowledge of Walrus and SUI, I have done a new use case and demo project at [GitHub Repo](https://github.com/HalfHashd/hubpal-sui2 08.18) 

(The below is the clone.)  

# HubPal-sui — SNS + Chainlink + PYUSD “Shopify for Projects & Crowdfunding”

## 🖥️ Live Demo  
👉 [View Live App](https://hubpal-ethgb.vercel.app)  
👉 [GitHub Repo](https://github.com/HalfHashd/hubpal-ethgb)  

## 📂 Continue Building on v0.app  
👉 [Open in v0.app](https://v0.app/chat/projects/1KPWSugTFD6)  

---

## 🌍 Overview
**HubPal** is a decentralized **project creation, crowdfunding, and milestone management platform**.  

- **SNS**: Each project and milestone gets its own SNS subdomain.  
- **Chainlink**: Validates deliverables using QuickBooks / real-world data feeds.  
- **PYUSD (PayPal stablecoin)**: Enables staking + milestone payments, with installment/credit-style models.  
- **Walrus (Sui storage)**: Decentralized storage for critical data and proofs.  

Think of HubPal as a **“Shopify for projects & crowdfunding”** — where every deliverable, milestone, and fund release is tracked transparently.

---

## ✨ Key Features
- **SNS Integration**  
  Projects auto-mint SNS subdomains for milestones, suppliers, lenders, auditors.  
- **Chainlink Data Feeds**  
  QuickBooks/Shopify events trigger milestone completions + fund releases.  
- **Project Marketplace**  
  OpSNSea-style tiles showing active projects, milestones, progress, and funding.  
- **Payments**  
  PYUSD for staking & milestone payouts. Installment/“Pay Over Time” models for services.  
- **Stretch Goals**  
  Oracles and CCIP endpoints with their own SNS identities + staking mechanisms.  

---

## 🛠️ Tech Stack
- **Language**: TypeScript (auto-generated via [v0.app](https://v0.app) AI builder).  
- **Frameworks**: React + Next.js (via v0.app / Vercel).  
- **Blockchain**: Ethereum (SNS + Chainlink CCIP).  
- **Storage**: Walrus (Sui).  
- **Payments**: PayPal PYUSD.  
- **Infra/Deploy**: GitHub + Vercel.  

---

## 🔗 Protocol Usage

**SNS**  
- First application of SNS to crowdfunding & project milestones.  
- Every project → SNS name; every milestone/supplier/lender → SNS subdomain.  
- SNS names resolve across marketplace & project timelines.

**Chainlink**  
- First demonstration of QuickBooks → Chainlink CCIP → SNS project milestone flow.  
- Invoices/revenue events in QuickBooks trigger smart contract releases to suppliers/lenders.  

**PayPal (PYUSD)**  
- Milestone payouts funded in PYUSD.  
- Modeled PayPal “Pay Over Time” as a layaway/credit-style option for projects & services.  

---

## 🏗️ How It’s Made
- The "decentralized commerce platform" concept was researched, evolved, and developed over many months. I typically use 2 to 3, and recently 4 (Grok was added) LLM AIs - giving the same prompt to all 3 or 4 to get their different respective responses. I had been looking for a unique use of SNS for 3+ years actually, after meeting them at ETHSF hackathon. Also I have been studying the uses of ChainLink for offchain and RW events. And that PayPal is one of the early payment systems to integrate crypto and stablecoin was of interest to me as well. Few days before the hackathon, I got the idea to use SNS for projects.   
- For the hackathon, we pivoted 3 days before kickoff to focus on **SNS + Chainlink** integration.  
- The staff/tips from Chainlink team suggested using **v0.app (AI coding tool)** to accelerate build.  
- Built 100% AI-assisted:  
  - ChatGPT wrote the **prompts**  
  - v0.app generated the **code + UI**  
  - Synced to **GitHub + Vercel** automatically  
- Two builds:  
  1. First prototype (7h) — scrapped after merging issues.  
  2. Final build (8–10h) — clean restart, stable + demo-ready.  
- This is my **first GitHub code repo** (previous experience was only uploading PDFs).  

---

## 📸 ScreSNShots
<p align="center">
  <img src="assets/HubPal_final_home-page.png" width="70%">
  <br/>
  <img src="assets/HubPal_screSNShot_create_project.png" width="70%">
  <br/>
  <img src="assets/HubPal_screSNShot_ChainLink.png" width="70%">
</p>

More in `/assets`.

---

## 📚 Additional Resources
Older repository with **business model notes & drafts**:  
👉 [hubpal (original repo)](https://github.com/HalfHashd/hubpal)  

---

## 🚀 Mission
> **Don’t we all want responsible projects?**  
> Make the world safe from dumps and rugs!  


---

## 🏅 Hackathon Tracks
This project directly targets the following sponsor tracks:

1. **SNS** – First integration of SNS subnames for **projects, milestones, and participants**.  
2. **Chainlink** – First demo of using Chainlink to **validate real-world project deliverables**.  
3. **PayPal PYUSD** – Milestone escrow + “Pay Over Time” simulation.  
4. **Walrus** – Demo of decentralized file storage for project data.  

---

## 🖥️ Live Demo
👉 [View Live App](https://hubpal-ethgb.vercel.app)  
👉 [GitHub Repo](https://github.com/HalfHashd/hubpal-ethgb)  

---

## 📸 ScreSNShots
*(add screSNShots of Home, Marketplace, Create Project, and Sponsor Demos here)*  

---

## 🛠️ How It Works
1. Create a new project from the home page.  
2. Assign milestones (e.g., Planning, Prototype, MVP, Production).  
3. Each milestone = SNS subdomain + Chainlink feed.  
4. Mark milestone complete via QuickBook-style page → Chainlink verifies → updates marketplace/project view.  
5. Payments release in PYUSD/USDC as milestones complete.  

---

## 📂 Project Structure
- `pages/index.tsx` → Home page  
- `pages/marketplace.tsx` → Project marketplace tiles  
- `pages/create.tsx` → Create Project form  
- `pages/project/[slug].tsx` → Individual project detail + timeline  
- `pages/sponsor/*` → Sponsor demo pages (SNS, Chainlink, PYUSD, Walrus, QuickBooks)  
- `lib/` → Store, types, utilities  

---

## 📌 Key Innovation
- ✅ **First use of SNS for projects & milestones**  
- ✅ **First Chainlink demo for real-world project completion**  
- ✅ **Shopify-style marketplace for crowdfunding with milestones**  

---

## 👥 Team
Project by **HubPal.org**  
Hackathon Demo 2025

---

## Additional Resources

📖 **Earlier Project Documentation:**  
For more background on the HubPal project (business model, extended description, and initial design notes), see the original README here:  
👉 [https://github.com/HalfHashd/hubpal](https://github.com/HalfHashd/hubpal)

<p align="center">
  <img src="assets/Gemini_Image5.png" alt="HubPal logo" width="20%">
</p>

<h3 align="center">Mission: Don't we all want responsible projects? Make the world safe from dumps and rugs!</h3>
</p>
<p align="center">
  <img src="assets/kids-dumps-upside down 30k.png" alt="HubPal mockup" width="18%">
</p>

ℹ️ This current repository (`hubpal_v2`) is the live hackathon demo build created with [v0.app](https://v0.app) and deployed on [Vercel](https://vercel.com).

<p align="center">
  <img src="assets/HubPal_difference.png" alt="HubPal difference" width="70%">
</p>

<p align="center">
  <img src="assets/HubPal_screSNShot_home.png" alt="HubPal Home ScreSNShot" width="70%">
</p>

<p align="center">
  <img src="assets/HubPal_final_home-page.png" alt="HubPal Final Home Page" width="70%">
</p>

<p align="center">
  <img src="assets/HubPal_screSNShot_ChainLink.png" alt="HubPal Chainlink ScreSNShot" width="70%">
</p>

<p align="center">
  <img src="assets/HubPal_screSNShot_ChainLink2.png" alt="HubPal Chainlink ScreSNShot 2" width="70%">
</p>

<p align="center">
  <img src="assets/HubPal_screSNShot_pyusd.png" alt="HubPal PYUSD ScreSNShot" width="70%">
</p>

<p align="center">
  <img src="assets/HubPal_screSNShot_create_project.png" alt="HubPal Create Project ScreSNShot" width="70%">
</p>

<p align="center">
  <img src="assets/HubPal_screSNShot_Walrus.png" alt="HubPal Walrus ScreSNShot" width="70%">
</p>

<p align="center">
  <img src="assets/HubPal_screSNShot_sponsor demos.png" alt="HubPal Sponsor Demos ScreSNShot" width="70%">
</p>

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

Thank you. 
**Have your AI call my AI sometimes...**

--- 
This README contains two sections: 
1. **Project Overview** – a detailed description of …………. and its intended use.  
2. **LicSNSe & Notices** – patent, usage restrictions, and licSNSing terms.

For inquiries, contact:  
Email: 1@1000x10.com  
dba: HalfHashd<sup>™</sup>

The HalfHashd welcomes inquiries for partnerships, licSNSing arrangements, and collaborative developments. Public good, government, and educational uses are invited to inquire for free use considerations.

## 2. LicSNSe & Notices

### COPYRIGHT NOTICE

### MIT LicSNSe + Commons Clause Restriction
Copyright (c) 2025 HalfHashd (dba)
---

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to use, copy, modify, merge, publish, and distribute the Software for personal, educational, or non-commercial purposes, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. Certain aspects of this software and/or its underlying methods are patent pending. 

**Commercial Use Restriction:**  
The "Commons Clause" LicSNSe Condition v1.0 is hereby added to the MIT LicSNSe: 
You may not sell, rent, lease, offer as a service, or otherwise use the Software for a commercial purpose without express prior written permission from the copyright holder, except where specific free use permission is granted for public-interest or educational projects.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

