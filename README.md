# ChinaReady

Static homepage prototype for ChinaReady: a service that helps foreign travelers prepare China arrival essentials, hotel delivery, and English first-day city maps before landing.

## Files

- `index.html` - homepage markup
- `city-maps.html` - interactive MapLibre/OpenFreeMap Shanghai route planner and printable tour map
- `cards.html` - printable Hotel Pickup / Check-in Card prototype
- `docs/HOTEL_PICKUP_CARD.md` - production notes for the first printed card
- `styles.css` - responsive styling
- Hero image is loaded from a public remote image URL in `styles.css`

## First Printed Card

The first card to make is the Hotel Pickup / Check-in Card because it supports the hotel delivery handoff before the traveler opens the kit. It gives hotel front desk staff a clear bilingual holding note and gives the traveler a simple pickup phrase for check-in.

## City Map Direction

The first production-style map focuses on Shanghai first, then expands to six high-demand arrival cities:

- Beijing
- Shanghai
- Xi'an
- Chengdu
- Guangzhou
- Shenzhen

The map product should be an arrival-oriented interactive map, not a copied tourism poster. Each city map should include:

- airport or station arrival routes
- recommended hotel districts
- first-day walking or metro orientation
- Chinese names for major places
- payment, SIM, transit card, tax refund, pharmacy, and convenience-store notes
- short bilingual help phrases
- Google Maps search and directions handoff
- MapLibre language switching for English, Chinese, and bilingual labels
- two-step destination and travel-mode selection, selectable POIs, custom map pins, ordered route stops, and A4-friendly print layout

## Official References To Check

- Beijing English Map 2025: `english.beijing.gov.cn`
- Shanghai official travel portal and Amap English map announcement: `english.shanghai.gov.cn`
- Xi'an culture and travel pages: `en.xa.gov.cn`
- Chengdu inbound tourism guide and metro app guide: `gochengdu.cn`
- Guangzhou Culture, Radio, Television and Tourism Bureau: `wglj.gz.gov.cn`
- Shenzhen Government Online travel guide and AI Travel Pass notes: `sz.gov.cn`

## Preview

Open `index.html`, `city-maps.html`, or `cards.html` directly in a browser, or serve the folder with any static server.