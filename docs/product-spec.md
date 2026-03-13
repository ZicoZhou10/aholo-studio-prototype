# Aholo Studio - Product Specification

## 1. Product Vision

Aholo Studio is a spatial intelligence application building platform serving **all roles** (R&D, business, external developers) across **all endpoints** (humans, Agents). It enables the full lifecycle from algorithm research to production-grade 3D/spatial AI applications.

## 2. Architecture Overview

| Layer | Name | Target User | Paradigm |
|-------|------|-------------|----------|
| L3 | Delivery | Business / Non-technical | No-Code |
| L2 | Orchestration | Technical PM / Solution Architect | Low-Code |
| L1 | Atomic API | Researcher / Backend Dev | Pro-Code |
| L0 | Infrastructure & Security | Platform Team | Managed |

## 3. Core Modules

### 3.1 API Marketplace (L1)
- Unified catalog of Aholo Core APIs and external partner APIs
- Categories: 3D Generation, Spatial Intelligence, Rendering, AI/LLM, Asset Management
- Each API: OpenAPI spec, playground, usage metrics, token pricing
- Researcher Fast-Track: Pydantic scaffold -> CI/CD auto-deploy -> auto-documentation

### 3.2 Visual Workflow Canvas (L2)
- Node-based drag-and-connect editor (ComfyUI-style)
- Node types: API Call, Condition, Loop, Data Transform, Human-in-the-loop
- Real-time preview and debug mode
- Version control and collaboration

### 3.3 Agent Builder (L2)
- Wrap LLM + API permissions into autonomous agents
- Configurable tools, memory, and guardrails
- Skill registry for reusable agent capabilities

### 3.4 App Studio (L3)
- UI component library optimized for 3D/spatial apps
- Template Hub: scene template marketplace with creator revenue sharing
- One-click publish to web URL

## 4. Tokenomics

- Unified billing unit: Token (核豆)
- Pay-per-use pricing per API call
- Creator revenue sharing: 70/30 split (creator/platform)
- Tiered quotas: Free / Pro / Enterprise

## 5. Key User Scenarios

| ID | Persona | Flow |
|----|---------|------|
| A | Researcher | Upload algorithm -> auto-deploy as API -> business team consumes via workflow |
| B | Sales | Workflow canvas -> 3D showroom -> App Studio web page -> send to client |
| C | External Dev | Agent auto-generates 3D assets via API 24/7 |
| D | SpatialAgent | L1 API -> L2 workflow -> L3 published app (full stack) |

## 6. Non-functional Requirements

- API p99 latency < 500ms (excluding GPU-bound render)
- 99.9% uptime SLA for L0/L1
- RBAC with tenant isolation
- Circuit breaker and rate limiting at gateway level
- SOC 2 Type II compliance target

## 7. MVP Scope (v0.1)

1. API Marketplace with 10+ APIs browsable and testable
2. Workflow Canvas with basic node editor (3 pre-built templates)
3. App Studio with template gallery (read-only preview)
4. Dashboard with usage stats and token balance
5. Agent Builder with config UI (2 pre-built agents)

## 8. V2 Changes

### 8.1 From Admin Dashboard to Creative Tool

V2 repositions Aholo Studio from an internal admin dashboard (API management + usage monitoring) to a **creator-facing creative tool**. The primary interaction model shifts from browsing/configuring to **building/publishing**:

- **Project-centric navigation**: Users start from their project gallery rather than a dashboard. Each project encapsulates an app, workflow, agent, or capability with all associated resources.
- **Unified Build page**: A single AI-assisted Build view replaces separate editors. The Build page combines a chat-based AI copilot (left panel), a live code/preview canvas (center), and an auto-generated workflow graph (right panel). Users describe what they want in natural language; the system selects APIs, generates code, and wires up the workflow automatically.
- **Community & remixing**: Published projects become discoverable in a public gallery. Other users can remix (fork + modify) any public project, driving a flywheel of templates and reusable patterns.
- **Simplified information architecture**: The top-level navigation is reduced to Home (project gallery), Build (AI-assisted editor), and Explore (community marketplace). Admin functions (API keys, billing, team) move to a Settings area.

### 8.2 L1 Researcher Fast-Track Capability

V2 introduces a streamlined path for researchers to deploy algorithms as platform APIs:

- **Code-first onboarding**: Researchers upload a Python function with Pydantic-annotated input/output schemas. The platform auto-generates REST endpoints, documentation, and a playground.
- **Automated CI/CD pipeline**: Upload -> container build -> unit tests -> integration tests -> GPU deployment. The full pipeline runs in under 10 minutes. Deployment status is tracked through stages: `uploading`, `building`, `testing`, `deploying`, `live`, `failed`.
- **CapabilityDraft entity**: A new data model tracks each researcher submission through the deployment lifecycle, including code content, schemas, pricing configuration, and deployment logs.
- **Researcher as API source**: The `ApiSource` type now includes `'researcher'` alongside `'aholo_core'`, `'partner'`, and `'community'`, enabling filtering and discovery of researcher-contributed capabilities.

### 8.3 Unified Build Page Concept

The Build page is the centerpiece of V2, replacing the separate Workflow Canvas, Agent Builder, and App Studio editors:

- **AI Chat Copilot**: An LLM-powered assistant that understands the user's intent, selects appropriate APIs (capabilities), generates frontend code, and auto-wires workflow nodes. The conversation history is persisted per project.
- **Live Preview Canvas**: Generated code renders in real-time. Users see their app take shape as they chat, with hot-reload on every code update.
- **Auto-generated Workflow**: As the AI selects and connects APIs, a visual workflow graph updates automatically in a side panel. Users can inspect and manually adjust the workflow if needed.
- **Iterative refinement**: Users refine their app through conversational iterations (e.g., "add a color picker", "change the background"). Each iteration updates code, preview, and workflow simultaneously.
- **One-click publish**: When satisfied, users publish directly from the Build page, generating a shareable URL for their app.
