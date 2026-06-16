<div align="center">

<h1>🎙️ Meetily</h1>
<h3>Privacy-First AI Meeting Assistant</h3>

<p>
  <a href="https://github.com/Krish2342/meetily/releases/"><img src="https://img.shields.io/badge/Pre_Release-v0.1.1-brightgreen?style=flat-square" alt="Pre-Release"></a>
  <a href="https://github.com/Krish2342/meetily"><img src="https://img.shields.io/github/stars/Krish2342/meetily?style=flat-square&color=yellow" alt="Stars"></a>
  <a href="https://github.com/Krish2342/meetily/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue?style=flat-square" alt="License"></a>
  <img src="https://img.shields.io/badge/Platform-Windows%20%7C%20macOS-lightgrey?style=flat-square" alt="Platform">
  <img src="https://img.shields.io/badge/Built%20with-Tauri%20%2B%20Next.js-orange?style=flat-square" alt="Tauri">
  <img src="https://img.shields.io/badge/AI-Ollama%20%7C%20OpenAI%20%7C%20Gemini-purple?style=flat-square" alt="AI">
</p>

<br/>

<p><strong>Open Source &nbsp;•&nbsp; Privacy-First &nbsp;•&nbsp; Works Offline &nbsp;•&nbsp; No Subscription</strong></p>

<p>
A privacy-first AI meeting assistant that captures, transcribes, and summarizes meetings entirely on your local machine — no cloud required. Built for professionals who need complete control over their sensitive data.
</p>

<br/>
<p align="center">
  <img src="docs/meetily_demo.gif" width="650" alt="Meetily Demo" />
</p>

</div>

---

<details>
<summary>📋 Table of Contents</summary>

- [What is Meetily?](#-what-is-meetily)
- [Why Meetily?](#-why-meetily)
- [Features](#-features)
- [New: 1-Click Follow-Up Email](#-1-click-follow-up-email-drafter--new)
- [Getting Started](#-getting-started)
- [AI Model Setup](#-ai-model-setup)
- [Usage](#-usage)
- [Project Structure](#-project-structure)
- [Tech Stack](#-tech-stack)
- [Privacy](#-privacy)
- [Contributing](#-contributing)
- [License](#-license)

</details>

---

## 📖 What is Meetily?

Meetily is a desktop app that records your meetings, transcribes them live using **Whisper.cpp**, and uses AI to generate clean, structured meeting notes — including an automatic **Follow-Up Email Draft** you can send with one click.

Everything runs **locally on your machine**. No subscriptions. No data sent to the cloud (when using Ollama).

---

## 💡 Why Meetily?

| Problem | Meetily's Solution |
|---|---|
| Cloud tools upload your private conversations | All processing happens locally on your device |
| Expensive monthly subscriptions | Free with open-source AI models (Ollama) |
| Manual note-taking wastes time | AI generates structured notes automatically |
| Writing follow-up emails takes time | AI drafts the email — you just hit send |
| Complex enterprise tools | Simple desktop app, runs in 3 commands |

---

## ✨ Features

### 🎙️ Live Real-Time Transcription
- Real-time speech-to-text powered by **Whisper.cpp**
- Timestamped transcript segments shown as you speak
- Speaker diarization (identifies multiple speakers)
- Works fully **offline** — no internet required

### 🤖 AI Meeting Summarizer
- Generates structured notes instantly after recording
- Supports **Ollama** (local), **OpenAI** (GPT-4o), and **Google Gemini**
- Multiple summary templates for different meeting types
- Add custom context or instructions before generating

### 📋 Structured Summary Output

Every generated note automatically includes:

| Section | What it contains |
|---|---|
| **Summary** | One-paragraph overview of the full meeting |
| **Key Decisions** | Bullet list of every decision made |
| **Action Items** | Table: Owner · Task · Due Date · Timestamp |
| **Discussion Highlights** | Key talking points with context |
| **Follow-Up Email Draft** | Ready-to-send professional email ⭐ NEW |

### 📁 Meeting History
- All meetings saved locally (SQLite database)
- Searchable meeting list in the sidebar
- Click any past meeting to view its transcript + summary

### 💾 Edit & Save Notes
- All AI-generated notes are fully editable
- Save with the **Save** button or changes persist automatically

### 🎨 Summary Templates
- **General Meeting** — works for any meeting
- **Daily Standup** — blockers, progress, goals
- **Sales Call** — pain points, objections, next steps
- **Project Sync** — decisions, owners, timelines
- **Retrospective** — what went well, improvements

---

## 📧 1-Click Follow-Up Email Drafter ⭐ NEW

> **The most requested feature — now built right in!**

After your meeting summary generates, Meetily automatically drafts a professional follow-up email. Just click **"Copy Email"** and paste it straight into Gmail or Outlook.

**How it works:**

```
1. 🎙️  Record your meeting
       ↓
2. ✨  Click "Generate Note"
       → AI writes the full summary
       → AI drafts the follow-up email
       ↓
3. 📧  Click "Copy Email" button
       ↓
4. 📋  Paste into Gmail / Outlook → Send!
```

**Real example output:**

```
Subject: Follow-Up: Q3 Marketing Review — Action Items & Next Steps

Hi Team,

Following our Q3 marketing review, I wanted to confirm our key decisions
and next steps.

Key Decision:
We have agreed to shift 20% of our ad budget from Facebook to LinkedIn
starting next month to better support our B2B lead performance.

Action Items:
• Sarah  — Finalize LinkedIn ad creatives by Wednesday
• Mark   — Pull Facebook performance report by Friday afternoon
• Team   — Check-in call on Monday to review progress

Please reach out if you have any questions before then.

Best regards,
[Your Name]
```

---

## 🚀 Getting Started

### Prerequisites

| Tool | Version | Purpose |
|---|---|---|
| [Node.js](https://nodejs.org/) | v18+ | Frontend build |
| [pnpm](https://pnpm.io/) | Latest | Package manager |
| [Rust](https://rustup.rs/) | Stable | Tauri desktop runtime |
| [Python](https://python.org/) | 3.10+ | AI backend |
| [Ollama](https://ollama.com/) | Latest | Local AI models (optional) |

---

### ⚡ Quick Start — Windows

```bash
# 1. Clone the repository
git clone https://github.com/Krish2342/meetily.git
cd meetily

# 2. Run everything with one command
start_project.bat
```

The app window will open automatically.

---

### 🔧 Manual Setup

**Step 1 — Start the Whisper transcription server:**
```bash
cd backend/whisper-server-package
./whisper-server.exe --model models/ggml-tiny.en.bin --host 127.0.0.1 --port 8178 --diarize --language en
```

> 💡 Use `ggml-small.en.bin` or `ggml-medium.en.bin` for better accuracy.

**Step 2 — Start the Python AI backend:**
```bash
cd backend
python -m venv venv
venv\Scripts\activate       # Windows
python app\main.py


# source venv/bin/activate  # macOS / Linux
pip install -r requirements.txt
python app/main.py
```

**Step 3 — Start the desktop app:**
```bash
cd frontend
pnpm install
pnpm run tauri dev
```

---

## 🤖 AI Model Setup

### Option A — Local / Offline (Ollama) ✅ Recommended

```bash
# Install Ollama → https://ollama.com
ollama pull gemma3:1b     # Fast, lightweight (good for testing)
ollama pull llama3        # Better quality summaries
ollama pull mistral       # Excellent for meeting notes
```

In Meetily: click **AI Model** → set Provider to **Ollama** → select your model.

### Option B — OpenAI (Cloud)

1. Click **AI Model** in the app
2. Set Provider to **OpenAI**
3. Enter your API key
4. Choose `gpt-4o` or `gpt-4-turbo`

### Option C — Google Gemini (Cloud)

1. Click **AI Model** in the app
2. Set Provider to **Gemini**
3. Enter your Google AI API key

---

## 📖 Usage

```
1. Open Meetily
2. Click "Start Recording" — speak naturally during your meeting
3. Watch live transcript appear on the left panel
4. Click "Stop" when the meeting ends
5. Click "Generate Note" — AI produces the full structured summary
6. Read through: Summary → Key Decisions → Action Items table
7. Scroll down to see the Follow-Up Email Draft
8. Click "Copy Email" → paste into Gmail / Outlook → send!
```

---

## 📁 Project Structure

```
meetily/
├── backend/                          # Python FastAPI AI backend
│   ├── app/
│   │   ├── main.py                   # API server entry point
│   │   └── transcript_processor.py   # AI summarization + email drafting
│   └── whisper-server-package/       # Pre-built Whisper.cpp binary
│       └── models/                   # Whisper model files (.bin)
│
├── frontend/                         # Tauri + Next.js desktop app
│   ├── src/
│   │   ├── app/                      # Next.js pages & routing
│   │   ├── components/               # React UI components
│   │   │   ├── AISummary/            # Summary rendering
│   │   │   └── MeetingDetails/       # Toolbar buttons & panels
│   │   └── hooks/                    # Business logic (copy, save, generate)
│   └── src-tauri/                    # Rust Tauri backend
│       └── src/
│           ├── audio/                # Audio capture & recording
│           └── api/                  # Native Tauri commands
│
├── start_project.bat                 # One-click Windows launcher
└── README.md
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Desktop Runtime | [Tauri](https://tauri.app/) (Rust) |
| Frontend | [Next.js 14](https://nextjs.org/) + React + TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Transcription | [Whisper.cpp](https://github.com/ggerganov/whisper.cpp) |
| AI Backend | Python + FastAPI |
| AI Providers | Ollama / OpenAI / Google Gemini |
| Database | SQLite (local, via Tauri) |
| Markdown Rendering | react-markdown + remark-gfm |

---

## 🔒 Privacy

| What | Status |
|---|---|
| Audio recordings | ✅ Processed **locally** — never uploaded |
| Transcription (Whisper) | ✅ Runs **locally** — no audio leaves your device |
| AI summarization (Ollama) | ✅ Runs **100% offline** |
| AI summarization (OpenAI/Gemini) | ⚠️ Transcript text sent to their APIs |
| Meeting database | ✅ Stored **locally** in SQLite |

---

## 🗺️ Roadmap

- [x] Live real-time transcription (Whisper.cpp)
- [x] AI meeting summarization (Ollama, OpenAI, Gemini)
- [x] Structured notes — Key Decisions, Action Items table
- [x] Multiple AI summary templates
- [x] Meeting history & search
- [x] Editable notes with save
- [x] **1-Click Follow-Up Email Drafter** ⭐ NEW
- [ ] Google Calendar / Outlook integration
- [ ] Automatic speaker name detection
- [ ] Export to Notion / Confluence
- [ ] Slack / Teams post-meeting notification
- [ ] Meeting recording playback

---

## 🤝 Contributing

Contributions are welcome! Here's how:

```bash
# 1. Fork and clone
git clone https://github.com/YOUR-USERNAME/meetily.git

# 2. Create a branch
git checkout -b feature/your-feature-name

# 3. Commit your changes
git commit -m "feat: describe your change"

# 4. Push and open a Pull Request
git push origin feature/your-feature-name
```

Please use conventional commit prefixes: `feat:`, `fix:`, `docs:`, `chore:`

---


<div align="center">
  <br/>
  <p>🎙️ Record. Summarize. Follow up.</p>
  <p>⭐ <strong>Star this repo if Meetily saves you time!</strong></p>
</div>
