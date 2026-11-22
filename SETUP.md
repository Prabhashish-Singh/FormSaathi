# FormSaathi – AI-Powered Multilingual Document Accessibility Platform

Complete guide for setup, running, backend integration, and end-to-end testing for FormSaathi.

---

## 1. Project Folder Structure

```
FormSaathi/
├── backend/
│   ├── app/
│   │   ├── main.py                    # FastAPI application & CORS configuration
│   │   ├── routes/
│   │   │   └── document.py            # POST /api/upload, POST /api/ask & /api/documents/*
│   │   ├── schemas/
│   │   │   └── qa.py                  # QuestionRequest & AnalysisRequest models
│   │   └── services/
│   │       ├── ai_service.py          # Gemini AI (explanation, important info, Q&A)
│   │       ├── language_service.py    # 12 Indian languages script & code detection
│   │       ├── ocr_service.py         # PyMuPDF + Tesseract OCR extraction
│   │       └── supabase_service.py    # Supabase admin client & auth verification
│   ├── .env                           # Backend environment variables
│   ├── .env.example
│   └── requirements.txt
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/                # Reusable, modular UI components
│   │   │   ├── Navbar.jsx             # Top branding, universal links & a11y toggles
│   │   │   ├── Footer.jsx             # 12 Indian languages banner, links, disclaimer
│   │   │   ├── UploadBox.jsx          # Drag & drop, file validation, file stats, replace/remove
│   │   │   ├── LanguageSelector.jsx   # OCR source language & 12 output Indian languages
│   │   │   ├── DocumentOverview.jsx   # Document type, detected language, file stats
│   │   │   ├── ExplanationCard.jsx    # Plain-language explanation with Markdown & copy
│   │   │   ├── ImportantInformation.jsx# Dates, deadlines, amounts, eligibility, conditions
│   │   │   ├── ActionChecklist.jsx    # Interactive checkboxes, progress bar, missing info
│   │   │   ├── ChatInterface.jsx      # Conversational Q&A with message history & suggestions
│   │   │   ├── ReadAloud.jsx          # Browser SpeechSynthesis API playback controls
│   │   │   └── LoadingSpinner.jsx     # Multi-stage animated processing indicator
│   │   ├── context/
│   │   │   ├── AccessibilityContext.jsx # Text size (normal/large/xl), contrast, dark mode, RTL
│   │   │   ├── AppContext.jsx           # Application general state
│   │   │   ├── AuthContext.jsx          # Optional user login state
│   │   │   └── DocumentContext.jsx      # Session-persisted document context for zero re-uploads
│   │   ├── pages/
│   │   │   ├── Home.jsx               # Welcoming landing page with features & hero CTA
│   │   │   ├── Upload.jsx             # Frictionless upload page
│   │   │   ├── Results.jsx            # Comprehensive results dashboard & tabs
│   │   │   ├── AskFormSaathi.jsx      # Dedicated conversational Q&A page
│   │   │   ├── AccessibilitySettings.jsx # High contrast, text size, voice speed
│   │   │   ├── HowItWorks.jsx         # 5-step detailed visual walkthrough
│   │   │   └── About.jsx              # Project mission and inclusive design values
│   │   ├── routes/
│   │   │   └── AppRoutes.jsx          # Public citizen journey + optional user routes
│   │   ├── services/
│   │   │   ├── api.js                 # Centralized Axios service: /api/upload & /api/ask
│   │   │   ├── chatService.js         # Q&A helper
│   │   │   └── documentService.js     # History and document fetcher
│   │   ├── utils/
│   │   │   └── speech.js              # Browser SpeechSynthesis API wrapper for 12 languages
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css                  # Forest green theme, typography & accessibility styles
│   ├── .env                           # Frontend environment configuration
│   ├── .env.example
│   ├── tailwind.config.js             # Forest green, sage, cream, gold palette
│   └── package.json
└── SETUP.md
```

---

## 2. Technology Stack

- **Frontend**: React 19, Vite 8, Tailwind CSS 3.4, React Router 7, Axios, Lucide React, React Hot Toast
- **Audio & Accessibility**: Browser SpeechSynthesis API (zero external audio dependency), KaTeX styling, RTL Urdu support, high-contrast, scalable text
- **Backend**: FastAPI, Uvicorn, Google GenAI SDK (Gemini), PyMuPDF (fitz), Tesseract OCR, Pydantic

---

## 3. Installation & Run Commands

### Backend

```bash
cd backend

# 1. Activate Python virtual environment
.venv\Scripts\activate       # Windows PowerShell / CMD
# or: source .venv/bin/activate  # macOS / Linux

# 2. Install dependencies (if not already installed)
pip install -r requirements.txt

# 3. Configure .env file
# Ensure GEMINI_API_KEY is present in backend/.env

# 4. Start the FastAPI server
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

The backend starts at `http://127.0.0.1:8000`. Test the health check endpoint:
`GET http://127.0.0.1:8000/health` → `{"status": "healthy"}`

---

### Frontend

```bash
cd frontend

# 1. Install packages
npm install

# 2. Configure .env file
# Copy .env.example if .env does not exist:
# cp .env.example .env

# 3. Start the Vite development server
npm run dev
```

The frontend will run at `http://localhost:5173`.

---

## 4. Environment Variables (`.env.example`)

### Frontend (`frontend/.env.example`)
```env
# Backend API Base URL
VITE_API_BASE_URL=/api

# Proxy target for Vite dev server (forwards /api/* to FastAPI)
FORM_SAATHI_API_PROXY_TARGET=http://127.0.0.1:8000

# Optional Supabase config (for saving user document history if logged in)
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Backend (`backend/.env.example`)
```env
# Google Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash-lite

# Optional Supabase credentials
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# CORS allowed origins
FORM_SAATHI_CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

---

## 5. Backend ↔ Frontend API Integration

The frontend connects to the backend through a centralized Axios client (`src/services/api.js`). In development, Vite automatically proxies any request starting with `/api` directly to `http://127.0.0.1:8000`.

### A. Document Upload Endpoint
- **Method & Path**: `POST /api/upload`
- **Payload**: `multipart/form-data`
  - `file`: The selected binary file (PDF, JPG, JPEG, PNG)
  - `language`: OCR language (`Auto Detect` or language name)
  - `output_language`: Desired explanation language (e.g. `English`, `Hindi`, `Punjabi`, `Bengali`, etc.)
- **Response Format**:
  ```json
  {
    "message": "Document processed successfully",
    "filename": "pm_kisan_notice.pdf",
    "file_type": ".pdf",
    "size_bytes": 1048576,
    "extracted_text": "...",
    "detected_language": "English",
    "ai_analysis": "This document notifies farmers about mandatory e-KYC...",
    "important_information": {
      "document_type": "Government Notice",
      "summary": "Mandatory e-KYC deadline...",
      "important_dates": ["30 November 2026"],
      "deadlines": ["30 November 2026"],
      "amounts": ["₹2,000 per installment"],
      "required_documents": ["Aadhaar Card", "Bank Passbook", "Khatauni"],
      "eligibility_conditions": ["Landholding farmer families"],
      "important_conditions": ["Failure leads to temporary suspension"],
      "missing_information": [],
      "action_checklist": [
        "Link Aadhaar with active mobile number",
        "Complete OTP-based e-KYC on PM-KISAN portal"
      ]
    },
    "status": "success"
  }
  ```

### B. Document Q&A Endpoint
- **Method & Path**: `POST /api/ask`
- **Content-Type**: `application/json`
- **Payload**:
  ```json
  {
    "document_text": "Extracted document text...",
    "question": "What is the deadline mentioned?",
    "output_language": "English",
    "conversation_history": [
      { "role": "user", "content": "Hello" },
      { "role": "assistant", "content": "How can I help you?" }
    ]
  }
  ```
- **Response Format**:
  ```json
  {
    "question": "What is the deadline mentioned?",
    "answer": "The deadline mentioned in the circular is 30 November 2026.",
    "status": "success"
  }
  ```

---

## 6. Complete User Journey Testing Instructions

Follow this step-by-step walkthrough to demonstrate the full application:

1. **Landing Page (`http://localhost:5173/`)**:
   - Verify the deep forest green branding, soft cream background, and welcoming typography.
   - Inspect the hero heading: *"Understand Every Document. In Every Language."*
   - Review the *How It Works* (1. Upload your document → 2. Choose your language → 3. Understand your document).
   - Review the 12 supported Indian languages grid.
   - Click the primary CTA button: **"Upload Your Document"**.

2. **Document Upload Page (`http://localhost:5173/upload`)**:
   - Drag and drop or browse to select a PDF or image document (sample files, circulars, or certificates up to 10 MB).
   - Note the real-time display of filename, file size, and the *Replace* and *Remove* buttons.
   - Select the **OCR Source Language** (`Auto Detect` or specific language).
   - Select the **Explanation Language** (e.g. `Hindi`, `Punjabi`, `English`, `Bengali`, etc.).
   - Click **"Understand This Document"**.
   - Observe the multi-stage `LoadingSpinner` with real-time feedback (Uploading → OCR → AI Analysis → Checklist).

3. **Document Results Page (`http://localhost:5173/results`)**:
   - **Document Overview**: Displays document type, detected language, and file size.
   - **Simple Explanation**: Read the plain-language summary. Click **"Copy"** to copy the explanation.
   - **Read Aloud**: Click **"Listen Now"** to hear the AI explanation spoken via the browser's SpeechSynthesis API in the chosen language. Test the speed selector (0.75×, 1×, 1.25×, 1.5×), **Pause**, **Resume**, and **Stop**.
   - **Important Information**: Inspect the cards for Important Dates, Deadlines, Financial Amounts, Required Documents, and Eligibility.
   - **Action Checklist**: Check off completed items interactively; notice the real-time completion counter and progress bar.
   - **Extracted Text (OCR)**: Click the collapsible section to inspect or copy the raw extracted OCR text.

4. **Ask FormSaathi (Document Q&A)**:
   - Click **"Ask Questions"** (or navigate to `/ask`).
   - Notice that the user is **NOT** asked to re-upload the document (`DocumentContext` maintains the extracted text).
   - Click one of the suggested question buttons (e.g., *"Am I eligible according to this notice?"*).
   - Type a custom question in the chat input and hit Enter or click the Send button.
   - Observe the loading state and incoming AI answer.
   - Click **"Clear Chat"** to verify chat reset.

5. **Accessibility Testing**:
   - Click the Accessibility icon in the navigation bar (`/accessibility`).
   - Toggle **Text Size** (Normal, Large, Extra Large) and observe the application scaling.
   - Toggle **Dark Mode** and **High Contrast**.
   - Select **Urdu** to test native right-to-left (RTL) reading layout.
