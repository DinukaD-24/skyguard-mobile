# SkyGuard — AI-Powered Weather & Disaster Safety Companion

SkyGuard is a cross-platform mobile application that unifies real-time weather monitoring, 
air quality tracking, and AI-driven travel safety planning into a single, location-aware 
safety companion. Built for Sri Lanka's recurring flood, landslide, and storm risks, SkyGuard 
helps users make informed decisions before they leave home — not just check the forecast.

**Team:** RovioTek | **Competition:** IDEALIZE 2026 (Open Category) | **Organized by:** AIESEC in University of Moratuwa

---

## Purpose

Existing weather apps show raw numbers. SkyGuard interprets them — combining live meteorological 
data with an AI-driven safety planner that tells users whether it's actually safe to travel, when, 
and what precautions to take, alongside emergency preparedness tools for high-risk regions.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Mobile Framework | React Native + Expo (SDK 57) |
| Language | TypeScript |
| Navigation | Expo Router (file-based routing) |
| Styling | NativeWind (Tailwind CSS for React Native) |
| State/Auth | JWT-based session handling, local fallback storage |
| Weather Data | Open-Meteo Weather API + Open-Meteo Air Quality API |
| Backend | Node.js + Express (see `skyguard-server` repo) |
| Database | PostgreSQL via Prisma ORM |

This matches the technical architecture outlined in our team proposal.

---

## Core Features

### 1. Personalized Home Dashboard
Live weather and Air Quality Index (AQI) for the user's current or saved locations, an active 
severe-weather alert banner, and a short AI-generated conditions briefing. Users can save and 
switch between multiple locations (Home, Work, Travel destinations).

### 2. AI Travel Planner (AI Agent — Open Category Requirement)
The core AI-driven feature. Users input a **destination** and **travel dates**. The planner:
- **Input:** destination city, planned travel window
- **Processing:** cross-references live weather conditions, air quality, and hazard indicators 
  for the destination and route
- **Output:** a computed safety score, a recommended travel time window, route-specific advice, 
  and itemized precautions — generated dynamically per request, not static text

### 3. Safety Hub
Nearby shelter information, a disaster preparedness checklist, and an offline-ready emergency 
alert toggle (designed for SMS dispatch when connectivity is lost).

### 4. Saved Locations
Add, view, and remove saved locations, persisted to the backend per user account, with local 
fallback storage if the server is temporarily unreachable — the app remains usable offline.

### 5. Secure Authentication
Register/login flow backed by JWT authentication against our Express backend, with session 
persistence and graceful fallback if the backend is unavailable.

### 6. Profile & Preferences
Manage account details and toggle alert preferences — disaster warnings, daily digest, AQI 
notifications.

---

## AI Agent Workflow (Open Category)

The AI Travel Planner is SkyGuard's core intelligent agent:

1. **Input stage** — user submits a destination and date range via the Planner screen
2. **Data gathering** — the app fetches live weather, precipitation, and air quality data for 
   the destination from Open-Meteo
3. **Risk evaluation** — conditions are scored against safety thresholds (rainfall intensity, 
   AQI levels, storm proximity) to produce a numeric safety score
4. **Recommendation generation** — based on the score, the agent outputs a recommended travel 
   window, specific route precautions, and an itemized safety checklist
5. **Output display** — results render live in the Planner UI, updating if the user changes 
   dates or destination

---

## Setup Instructions

### Prerequisites
- Node.js (LTS, v22.x recommended)
- npm
- Expo Go app (for physical device testing) or Android Studio (for emulator)

### Installation

```bash
git clone https://github.com/DinukaD-24/skyguard-mobile.git
cd skyguard-mobile
npm install
```

### Running the app

```bash
npx expo start
```

Then choose:
- Press `w` — open in web browser
- Press `a` — open in Android emulator (requires Android Studio + configured AVD)
- Scan the QR code with **Expo Go** on a physical device (same Wi-Fi network required)

### Backend connection

SkyGuard mobile expects the backend server (`skyguard-server`) running locally at 
`http://localhost:3000` for full functionality (auth, saved locations). Weather data falls back 
to a direct Open-Meteo call if the backend is unreachable. See `skyguard-server`'s README for 
backend setup.

---

## Project Structure

src/
app/ → screens (Expo Router file-based routing)
(tabs)/ → main app tabs: dashboard, planner, safety, profile
login.tsx → login screen
register.tsx → registration screen
components/ → shared UI components (Button, Input, Card)
services/ → API clients (auth, weather, locations)
hooks/ → custom React hooks
constants/ → theme, colors, config

---

## Team

RovioTek — Informatics Institute of Technology (IIT)
- I. P. Dinuka Daksitha Ilangakoon (Team Lead)
- Nimuthu Sipsara Witharana
- Kattadige Tharana Hasintha Mabula
- S.N.H.M. Anuruddha Shanaka
- I.D. Pasindu Tharaka Warnasiri
