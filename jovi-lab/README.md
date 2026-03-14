# JOVI — Smartphone & IoT Lab

A production-ready tech review tool for Smartphones, Smartwatches, TWS earbuds, and IoT devices. Runs entirely in the browser — no backend required.

## 🚀 Deploy to GitHub Pages

1. Fork or upload this repository to GitHub
2. Go to **Settings → Pages**
3. Under "Source", select **Deploy from a branch**
4. Choose **main** branch, **/ (root)** folder
5. Click **Save** — your site will be live at `https://yourusername.github.io/jovi-lab`

## ✨ Features

- **4 device types**: Smartphone, Smartwatch, TWS Earbuds, IoT Device
- **Full review forms** with collapsible accordion sections per device type
- **1–10 rating buttons** with green/yellow/red color coding (all buttons 1→N fill on selection)
- **Product photo upload** with preview
- **Auto-calculated overall score** from category ratings
- **Dashboard** with radar chart, bar chart, comparison table, pros/cons
- **Export to Excel** (.xlsx) — single review or comparison
- **Export to PowerPoint** (.pptx) — single review (4 slides) or dashboard (3 slides)
- **LocalStorage persistence** — data survives page refreshes, no server needed

## 📁 Structure

```
jovi-lab/
├── index.html          # App shell + navigation
├── css/
│   └── style.css       # Full dark theme stylesheet
└── js/
    ├── data.js         # Section definitions + score helpers
    ├── storage.js      # localStorage CRUD
    ├── form.js         # Accordion builder + rating logic
    ├── detail.js       # Review detail page
    ├── dashboard.js    # Comparison dashboard + charts
    ├── export.js       # Excel + PowerPoint export
    └── app.js          # Routing + page management
```

## 📊 Rating System

Buttons 1–10. When you select a score:
- Buttons **1 through N** all fill with the color of that score range
- **Green** (8–10), **Yellow** (5–7), **Red** (1–4)
- The selected button gets a glow ring
- Score label `N/10` appears after the buttons

## 🛠 Tech Stack

- Vanilla HTML/CSS/JavaScript — zero framework dependencies
- [Chart.js](https://www.chartjs.org/) — radar + bar charts
- [SheetJS / xlsx](https://sheetjs.com/) — Excel export
- [PptxGenJS](https://gitbrent.github.io/PptxGenJS/) — PowerPoint export
- Google Fonts: DM Sans + DM Mono

## 💾 Data Storage

All reviews are stored in `localStorage` under the key `jovi_lab_reviews`. Data is private to each browser — to share reviews, use the Export features.

## 📄 License

MIT — use freely for personal or commercial purposes.
