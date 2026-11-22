# FormSaathi

FormSaathi has a React/Vite frontend and a FastAPI backend. The frontend calls the backend through the shared Axios client; the Vite development server proxies `/api` to `http://127.0.0.1:8000` by default.

## Run locally (Windows PowerShell)

1. Configure the backend environment without putting credentials in frontend files:

   ```powershell
   if (-not (Test-Path backend\.env)) { Copy-Item backend\.env.example backend\.env }
   ```

   Set `GEMINI_API_KEY` in `backend\.env`. Keep that file private and out of source control.

2. Install and start the backend:

   ```powershell
   cd backend
   python -m venv .venv
   .\.venv\Scripts\Activate.ps1
   python -m pip install -r requirements.txt
   python -m uvicorn app.main:app --reload
   ```

3. In a second terminal, install and start the frontend:

   ```powershell
   cd frontend
   npm ci
   if (-not (Test-Path .env)) { Copy-Item .env.example .env }
   npm run dev
   ```

   Open the Vite URL (normally `http://localhost:5173`). Set `VITE_API_BASE_URL` to a full backend API URL only if you do not want to use the development proxy. Set `FORM_SAATHI_API_PROXY_TARGET` to change the proxy target.

The backend accepts PDF, PNG, and JPEG uploads up to 10 MB and 20 PDF pages. It extracts digital PDF text directly and uses Tesseract for scanned PDFs and images. Install the Tesseract executable and the trained language data needed for your documents; set `TESSERACT_CMD` in `backend\.env` when Tesseract is not on `PATH` or in its default Windows location. OCR for Hindi, Punjabi, and other supported languages requires the matching Tesseract language data.

## Current backend capabilities and limitations

- Implemented APIs: `GET /health`, `POST /api/upload`, `POST /api/reanalyze`, and `POST /api/ask`.
- Analysis and Q&A require a working Gemini API key and model access. API failures are returned as errors rather than mock results.
- The backend has no registration, login, password reset, authorization, database, or document-history endpoints/models. The existing frontend signup/login is explicitly demo-only and does not create backend accounts. Do not use a real password with it.
- Analyzed document text and results are kept in the current browser tab's `sessionStorage` so the result page and Q&A can survive a refresh. They are cleared on logout and are not durable backend storage.
- Interface language (i18next) is independent from document explanation language (English, Hindi, or Punjabi).
- Text-to-speech and display accessibility settings run in the browser.

The frontend production build is `npm run build`; linting is `npm run lint`.
