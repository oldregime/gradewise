# Complete Tools, CLIs, and AI Skills Reference

This reference document provides a complete guide to all tools, command-line interfaces (CLIs), AI skills, MCP servers, VSCode extensions, and environment variables required to develop, test, deploy, and maintain **GradeWise**.

---

## SECTION 1: Tools Already Installed

The following tools have been confirmed installed on the development workstation:

| Tool | CLI Command | Purpose in GradeWise | Verification Command |
| :--- | :--- | :--- | :--- |
| **Oracle CLI** | `oci` | Oracle Cloud Infrastructure (OCI) resource management, bucket creation, object storage access, and VM deployment | `oci --version` |
| **Netlify CLI** | `netlify` | Continuous deployment, preview builds, environment management, and domain routing for the React/Vite SPA frontend | `netlify --version` |
| **Supabase CLI** | `supabase` | Local database development, PostgreSQL migrations, type generation, edge functions, and seed data management | `supabase --version` |
| **Firecrawl CLI** | `firecrawl` | Documentation scraping, web research, and external API specification parsing | `firecrawl --version` |
| **Antigravity CLI** | `agy` | Agentic AI pair programming, task automation, subagent orchestration, and skill execution | `agy --version` |
| **Git** | `git` | Version control, branching strategies, commit history, and GitHub action automation | `git --version` |

---

## SECTION 2: Tools to Install (Ubuntu/Linux Setup)

The following software packages and tools must be installed on the Ubuntu/Linux host or Oracle A1 VM.

### 1. Docker + Docker Compose
* **Purpose**: Containerize the FastAPI backend, Caddy reverse proxy, and local background services on the Oracle A1 VM.
* **Install Command**:
  ```bash
  curl -fsSL https://get.docker.com | sh && sudo usermod -aG docker $USER
  ```
* **Verification Command**:
  ```bash
  docker --version && docker compose version
  ```

### 2. Python 3.11+
* **Purpose**: Runtime environment for the FastAPI backend, PDF parsing pipelines, and Gemini API SDK integrations.
* **Install Command**:
  ```bash
  sudo apt update && sudo apt install python3.11 python3.11-venv python3-pip -y
  ```
* **Verification Command**:
  ```bash
  python3.11 --version
  ```

### 3. Node.js 20+ (via nvm)
* **Purpose**: JavaScript runtime for building and bundling the React 19 + Vite frontend.
* **Install Command**:
  ```bash
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
  source ~/.bashrc
  nvm install 20
  nvm use 20
  ```
* **Verification Command**:
  ```bash
  node -v && npm -v
  ```

### 4. pnpm
* **Purpose**: Fast, disk-space-efficient package manager for frontend dependencies and node scripts.
* **Install Command**:
  ```bash
  npm install -g pnpm
  ```
* **Verification Command**:
  ```bash
  pnpm -v
  ```

### 5. Poetry
* **Purpose**: Python dependency management, virtualenv isolation, and reproducible builds for the backend.
* **Install Command**:
  ```bash
  curl -sSL https://install.python-poetry.org | python3 -
  ```
* **Verification Command**:
  ```bash
  poetry --version
  ```

### 6. DuckDNS Client
* **Purpose**: Free dynamic DNS provider script to resolve the dynamic IP of the Oracle VM host to `gradewise.duckdns.org`.
* **Install Command (Cron Script)**:
  ```bash
  mkdir -p ~/duckdns && cd ~/duckdns
  cat << 'EOF' > duck.sh
  echo url="https://www.duckdns.org/update?domains=YOUR_DUCKDNS_SUBDOMAIN&token=YOUR_DUCKDNS_TOKEN&ip=" | curl -k -K -
  EOF
  chmod 700 duck.sh
  (crontab -l 2>/dev/null; echo "*/5 * * * * ~/duckdns/duck.sh >/dev/null 2>&1") | crontab -
  ```
* **Verification Command**:
  ```bash
  crontab -l && ~/duckdns/duck.sh && cat ~/duckdns/duck.log
  ```

### 7. Caddy (Runs in Docker)
* **Purpose**: High-performance reverse proxy with automatic HTTPS/TLS certificate provisioning (Let's Encrypt / ZeroSSL) for the FastAPI backend API.
* **Setup**: Configured via `Caddyfile` inside `docker-compose.yml` (no local host installation needed).
* **Verification Command**:
  ```bash
  docker compose ps caddy
  ```

### 8. PyMuPDF (`fitz`)
* **Purpose**: High-speed rendering of exam PDFs and student answer sheets into high-resolution PNG images for Gemini multimodal analysis.
* **Install Command**:
  ```bash
  pip install pymupdf
  ```
* **Verification Command**:
  ```bash
  python3 -c "import fitz; print(fitz.__version__)"
  ```

### 9. poppler-utils
* **Purpose**: System-level PDF rendering utilities (`pdftoppm`, `pdfinfo`) used as a fallback for image extraction and document validation.
* **Install Command**:
  ```bash
  sudo apt install poppler-utils -y
  ```
* **Verification Command**:
  ```bash
  pdftoppm -v
  ```

### 10. libmagic
* **Purpose**: Native C library used by `python-magic` for strict file-type detection and MIME verification of uploaded PDF files.
* **Install Command**:
  ```bash
  sudo apt install libmagic1 -y
  ```
* **Verification Command**:
  ```bash
  file --version
  ```

---

## SECTION 3: AI Skills Available in Antigravity

Antigravity skills automate domain-specific coding tasks. Below is the mapping of available skills to GradeWise development phases:

| Skill Name | Path | Purpose & When to Use in GradeWise | Relevant Phase |
| :--- | :--- | :--- | :--- |
| `frontend-design` | `/home/dj/.gemini/config/skills/frontend-design/SKILL.md` | Crafting anti-slop, high-contrast React UI elements, split-screen PDF viewers, and design system components. | Phase 4: Frontend Development |
| `vibe-coding-starter` | `/home/dj/.gemini/config/skills/vibe-coding-starter/SKILL.md` | Rapid MVP prototyping, scaffolding initial layouts, and setting up rapid code structures. | Phase 1 & Phase 4 |
| `research` | `/home/dj/.gemini/config/skills/research/SKILL.md` | Investigating new libraries (e.g., PyMuPDF, Supabase RLS policies, Gemini 1.5 Structured Output schemas). | Phase 1: Architecture & Planning |
| `diagnosing-bugs` | `/home/dj/.gemini/config/skills/diagnosing-bugs/SKILL.md` | Structured debugging of FastAPI exceptions, CORS headers issues, or PDF parsing failures. | Phase 4 & Phase 5: Debugging |
| `code-review` | `/home/dj/.gemini/config/skills/code-review/SKILL.md` | Performing dual-axis standards and specification reviews before merging major pull requests. | All Development Phases |
| `web-perf` | `/home/dj/.gemini/config/skills/web-perf/SKILL.md` | Measuring Core Web Vitals, canvas render speeds, and asset bundling efficiency in the React frontend. | Phase 4 & Phase 5: Optimization |
| `tdd` | `/home/dj/.gemini/config/skills/tdd/SKILL.md` | Test-driven development for core grading logic, BYOK key encryption/decryption, and evaluation scoring APIs. | Phase 3 & Phase 4: Testing |
| `domain-modeling` | `/home/dj/.gemini/config/skills/domain-modeling/SKILL.md` | Refining and maintaining GradeWise domain terminology, database schemas, and `CONTEXT.md`. | Phase 1 & Phase 2 |
| `grilling` | `/home/dj/.gemini/config/skills/grilling/SKILL.md` | Stress-testing architectural decisions, security models (BYOK), and API contracts. | Phase 1: Architecture Validation |
| `prototype` | `/home/dj/.gemini/config/skills/prototype/SKILL.md` | Building throwaway state models or visual proof-of-concept components for the grading UI. | Phase 1 & Phase 3 |
| `codebase-design` | `/home/dj/.gemini/config/skills/codebase-design/SKILL.md` | Defining deep module interfaces for OCI storage service, Gemini agent service, and Encryption services. | Phase 2 & Phase 3 |
| `firecrawl` | `/home/dj/.gemini/config/skills/firecrawl/SKILL.md` | Scraping third-party API documentation and PyMuPDF release specs directly into markdown. | Phase 1 & Phase 2 |
| `browser-automation` | `/home/dj/.gemini/config/skills/browser-automation/SKILL.md` | Automated browser testing of the split-screen grading interface and PDF mark annotation overlays. | Phase 4 & Phase 5: E2E Testing |

### Built-in Meta Skills
* **`antigravity-guide`** (`/home/dj/.gemini/antigravity-cli/builtin/skills/antigravity_guide/SKILL.md`): Quick reference for AGY CLI capabilities, slash commands, context tracking, and subagent management.
* **`agy-customizations`** (`/home/dj/.gemini/antigravity-cli/builtin/skills/agy-customizations/SKILL.md`): Guide for authoring custom GradeWise skills, workflows, rules, and local hooks.
* **`writing-for-agents`** (`/home/dj/.gemini/config/skills/writing-for-agents/SKILL.md`): Best practices for writing structured markdown documentation optimized for AI consumption.

---

## SECTION 4: MCP Tools Available

Model Context Protocol (MCP) tools provide direct runtime integrations with external engines and devtools:

1. **Puppeteer MCP**: Enables visual browser testing, taking page screenshots, inspecting DOM elements, and verifying responsive layouts of the GradeWise split-screen interface.
2. **Chrome DevTools MCP**: Provides real-time performance tracing, console log capturing, layout shift detection, and network request monitoring for frontend optimization.
3. **Firecrawl MCP**: Fetches raw HTML/Markdown from live API documentation pages and converts them into structured context for AI agents.

---

## SECTION 5: Recommended VSCode Extensions

To ensure consistent code quality, formatting, and developer productivity, install the following extensions in VSCode:

1. **Python** (`ms-python.python`) — IntelliSense, debugging, and linting for FastAPI.
2. **Pylance** (`ms-python.vscode-pylance`) — Fast, feature-rich language support for Python 3.11.
3. **ESLint** (`dbaeumer.vscode-eslint`) — Real-time JavaScript/TypeScript code linting.
4. **Prettier - Code formatter** (`esbenp.prettier-vscode`) — Opinionated code formatting for React, HTML, CSS, and JSON.
5. **Docker** (`ms-azuretools.vscode-docker`) — Container, image, and `docker-compose` management.
6. **REST Client** (`humao.rest-client`) — Execute raw HTTP API requests directly from `.http` or `.rest` files inside VSCode.
7. **GitLens** (`eamodio.gitlens`) — Enhanced Git blame, line annotations, and repository visualization.
8. **Tailwind CSS IntelliSense** (`bradlc.vscode-tailwindcss`) — Autocompletion and syntax highlighting for utility classes.

---

## SECTION 6: Environment Variables Reference

Complete breakdown of environment variables across backend, frontend, and CLI environments:

### Backend (`backend/.env` for FastAPI)

| Variable Name | Required | Description | Example Value |
| :--- | :--- | :--- | :--- |
| `GOOGLE_GEMINI_API_KEY` | Yes | Default Gemini API Key (Fallback from AI Studio free tier) | `AIzaSyD...` |
| `SUPABASE_URL` | Yes | Supabase Project URL | `https://xyzproject.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase Service Role Secret (Bypasses RLS for backend tasks) | `eyJhbGciOi...` |
| `OCI_NAMESPACE` | Yes | Oracle Cloud Infrastructure Object Storage Namespace | `ax7812903` |
| `OCI_BUCKET_NAME` | Yes | OCI Bucket designated for PDF exam storage | `gradewise-pdf-bucket` |
| `OCI_REGION` | Yes | OCI Region | `ap-mumbai-1` |
| `OCI_USER_OCID` | Yes | OCID of the Oracle IAM User | `ocid1.user.oc1..aaaa...` |
| `OCI_TENANCY_OCID` | Yes | OCID of the Oracle Tenancy | `ocid1.tenancy.oc1..aaaa...` |
| `OCI_FINGERPRINT` | Yes | Fingerprint of the OCI API Signing Key | `20:3a:4b:...` |
| `OCI_PRIVATE_KEY_PATH` | Yes | Absolute path to OCI RSA Private Key file (`.pem`) | `/app/keys/oci_private.pem` |
| `ENCRYPTION_SECRET` | Yes | 32-byte (64 hexadecimal characters) key for AES-256-GCM BYOK encryption | `a3f890b...` (64 hex chars) |
| `JWT_SECRET` | Yes | Secret key used for signing FastAPI JWT bearer tokens | `super-secret-jwt-key` |
| `ENVIRONMENT` | Yes | Application execution mode (`development` or `production`) | `development` |
| `CORS_ORIGINS` | Yes | Comma-separated allowed frontend origins | `http://localhost:5173,https://gradewise.netlify.app` |

### Frontend (`frontend/.env` for Vite)

| Variable Name | Required | Description | Example Value |
| :--- | :--- | :--- | :--- |
| `VITE_SUPABASE_URL` | Yes | Public Supabase project URL | `https://xyzproject.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Yes | Public Supabase anonymous client key (Subject to RLS) | `eyJhbGciOi...` |
| `VITE_API_BASE_URL` | Yes | Base endpoint for the FastAPI backend API | `http://localhost:8000/api/v1` |
| `VITE_APP_NAME` | No | Frontend Application Title | `GradeWise` |
| `VITE_APP_VERSION` | No | Current Version tag | `1.0.0` |

### Supabase CLI (`supabase/.env.local`)

| Variable Name | Required | Description | Example Value |
| :--- | :--- | :--- | :--- |
| `SUPABASE_ACCESS_TOKEN` | Yes | Supabase personal access token for CLI deployment & migrations | `sbp_a1b2c3d4...` |
