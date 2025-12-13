# Profit Pulse & Dev Audit Agent - Knowledge Base

**Session Date:** 2025-11-23
**Context:** Comprehensive design discussion covering Profit Pulse framework, meta-analysis, and Dev Audit Agent concept
**Purpose:** Preserve context for continuation in new repo (https://github.com/batkins33/profit_pulse.git)

---

## Table of Contents

1. [Profit Pulse Framework Overview](#profit-pulse-framework-overview)
2. [Profit Pulse 2.0 Enhancement Proposal](#profit-pulse-20-enhancement-proposal)
3. [Meta-Analysis: Profit Pulse on Profit Pulse](#meta-analysis-profit-pulse-on-profit-pulse)
4. [Meta-Analysis: Profit Pulse on Dev Audit Agent](#meta-analysis-profit-pulse-on-dev-audit-agent)
5. [Dev Audit Agent Concept](#dev-audit-agent-concept)
6. [Design Principles & Decisions](#design-principles--decisions)
7. [Next Steps](#next-steps)

---

## Profit Pulse Framework Overview

### Core Concept
**Profit Pulse** is a business idea evaluation framework designed for solo founders and micro-entrepreneurs to assess viability systematically and reduce decision paralysis.

### Current System (v0.3)

**QPV Matrix** (weighted scoring):
- **Quickness (40%):** How fast can you ship an MVP?
- **Profitability (30%):** Revenue potential & margins
- **Validation Ease (30%):** How quickly can you test the market?

**Energy Filter:**
Qualitative gate asking: "Would I maintain this idea at $500/month revenue?"

**Output:**
- Automated reports
- Validation plans
- Execution stacks

### Source Document
Reference: `docs/dev_docs/profit_pulse/profit_pulse_concept_v0.3.md` (GitHub)

---

## Profit Pulse 2.0 Enhancement Proposal

### Multi-Layer Evaluation System

**Four Evaluation Layers:**

1. **Founder Readiness (30%)**
   - Skills match
   - Time availability
   - Financial buffer
   - Emotional resilience

2. **Idea Characteristics (40%)**
   - Enhanced QPV matrix
   - Market demand assessment
   - Competitive differentiation
   - Scalability potential

3. **Historical Patterns (20%)**
   - Category-specific failure modes
   - Common obstacles that kill similar ideas
   - Mitigation strategies database

4. **Contextual Viability (10%)**
   - Life stage fit
   - Market timing
   - Tech maturity
   - Economic conditions

### Critical Addition: Failure Mode Detection

Analyzes historical patterns specific to idea categories:
- Identifies common failure points
- Provides targeted mitigation strategies
- Draws from crowdsourced data + research

### Monetization Strategy: 3-Tier Model

| Tier | Price | Features |
|------|-------|----------|
| **Tier 1 (Free)** | $0 | QPV score + teaser stats on category failure rates |
| **Tier 2 (Pro)** | $9 | Full 4-layer analysis + obstacles report |
| **Tier 3 (Blueprint)** | $29 | Complete execution blueprint + 48-hour launch plan |

**Funnel Strategy:** Leverage curiosity gaps to drive conversions between tiers.

---

## Meta-Analysis: Profit Pulse on Profit Pulse

### QPV Matrix Analysis

**Quickness (40%): 8/10** ⚡
- MVP timeline: 2-3 weeks (Tier 1 free version)
- Full 3-tier system: 6-8 weeks
- Core logic is algorithmic (fast)
- **Blockers:** Curating failure pattern database, Claude API optimization

**Profitability (30%): 9/10** 💰
- Low operational costs (serverless + AI API)
- Clear pricing tiers ($0/$9/$29)
- High margins (80%+ after payment processing)
- **Revenue math:** 100 users/month @ 10% conversion = $90 (Tier 2) + 3% super-conversion = $87 (Tier 3) = ~$177/mo

**Validation Ease (30%): 9/10** ✅
- Target audience extremely accessible (Twitter/IndieHackers/Reddit r/SideProject)
- Can validate Tier 1 immediately (free = no sales friction)
- Built-in feedback loop (users tell you if score matches intuition)

**QPV Total: 8.6/10** 🔥

### Energy Filter: ✅ PASS

**Reasoning:**
- You're the target user (solo founder evaluating ideas)
- Solves your own pain (decision paralysis)
- Interesting technical challenge (AI + evaluation logic)
- Compounds value over time (more data = better failure patterns)
- $500/mo = 55 paid users (very achievable)

### Profit Pulse 2.0 Framework Score

**1. Founder Readiness (30%): 7/10**
- ✅ Skills: Strong (if you can build TangentCore, you can build this)
- ⚠️ Time: Unknown (need to validate 10-15 hrs/week availability)
- ⚠️ Financial buffer: Can you handle $0 revenue for 3 months during build?

**2. Idea Characteristics (40%): 9/10**
- ✅ Market demand: HIGH (founder decision paralysis is universal)
- ✅ Enhanced QPV: 8.6/10
- ✅ Differentiation: Failure mode detection is novel angle

**3. Historical Patterns (20%): 6/10**
- ⚠️ Failure mode category: "Productivity tools for founders"
- **Common failures:**
  - Over-complication (too many features kills speed)
  - Under-monetization (giving too much away free)
  - Distribution challenge (crowded market)
- **Mitigations:**
  - ✅ 3-tier funnel (smart)
  - ✅ Focused scope (just idea evaluation)
  - ⚠️ Need distribution strategy beyond organic

**4. Contextual Viability (10%): 8/10**
- ✅ Market timing: Solo founder economy is booming
- ✅ Tech maturity: Claude API is production-ready

**Total Score: 7.8/10** 🎯

### Critical Obstacles & Mitigations

| Obstacle | Likelihood | Impact | Mitigation |
|----------|-----------|--------|------------|
| Failure pattern database | HIGH | HIGH | Start with 10-15 curated categories, crowdsource rest |
| AI cost runaway | MEDIUM | MEDIUM | Cache results, use Haiku for simple queries |
| Free tier too valuable | MEDIUM | HIGH | Gate failure modes & execution plan behind paywall |
| Distribution | HIGH | CRITICAL | Launch with case study: "I analyzed 100 ideas, here's what I learned" |

### 48-Hour Launch Plan (Tier 1 MVP)

- **Hour 0-8:** Set up Next.js + basic form (idea input + QPV questions)
- **Hour 8-16:** Build QPV calculator algorithm + scoring logic
- **Hour 16-24:** Integrate Claude API for qualitative analysis
- **Hour 24-32:** Design results page + energy filter prompt
- **Hour 32-40:** Add 5-10 failure pattern teasers (seed data)
- **Hour 40-48:** Deploy to Vercel + post on IndieHackers

### Final Verdict: ⚡ BUILD IT

**Recommended Tech Stack:**
```
Frontend: Next.js 14 (App Router) + Tailwind CSS
Backend: Vercel Serverless Functions / Supabase
Database: PostgreSQL (Supabase)
Payments: Stripe (for $9/$29 tiers)
AI: Claude API (Sonnet for analysis)
```

**Recommended Architecture:**
```
profit-pulse/
├── src/
│   ├── app/              # Next.js pages
│   ├── components/       # React components
│   ├── lib/
│   │   ├── analysis/     # Core Profit Pulse logic
│   │   │   ├── qpv-calculator.ts
│   │   │   ├── founder-readiness.ts
│   │   │   ├── failure-modes.ts
│   │   │   └── report-generator.ts
│   │   └── ai/           # Claude API integration
│   └── types/
├── data/
│   └── failure-patterns.json  # Historical failure data
└── docs/
```

---

## Meta-Analysis: Profit Pulse on Dev Audit Agent

### QPV Matrix Analysis

**Quickness (40%): 7/10** ⚡
- MVP timeline: 2-3 weeks for basic PowerShell tool
- Full featured: 6-8 weeks with GUI, profiles, path discovery
- **Blockers:** GUI building, path discovery heuristics, cross-system testing

**Profitability (30%): 6/10** 💰
- Market: Niche (power users + developers)
- Pricing: $9-19 one-time OR $3-5/mo subscription
- Competition: Free alternatives exist (Wise Care 365, CCleaner, Belarc)
- **Differentiation:** "Dev workspace" angle is unique
- **Revenue math:** 50 sales/month @ $12 = $600/mo

**Validation Ease (30%): 8/10** ✅
- Target audience: Super accessible (devs on Twitter/Reddit/Discord)
- Free tier: Easy ("Quick System Snapshot" profile)
- **Validation plan:** Post on r/sysadmin, r/PowerShell, HackerNews

**QPV Total: 7.0/10** 🔥

### Energy Filter: ⚠️ CONDITIONAL PASS

Would maintain at $500/mo IF:
- It becomes part of larger toolkit ecosystem
- You enjoy systems/performance niche
- Roadmap exists (Mac/Linux, CI/CD integration, enterprise)

### Profit Pulse 2.0 Score: 7.1/10

**Critical Obstacles:**

| Obstacle | Likelihood | Impact | Mitigation |
|----------|-----------|--------|------------|
| False positive bloat detection | HIGH | CRITICAL | Protected publishers list + conservative scoring |
| Competition from free tools | HIGH | HIGH | Focus on "Dev Workspace" differentiation |
| Windows updates breaking scripts | MEDIUM | MEDIUM | Use stable APIs (Get-CimInstance, etc.) |
| User expects "fix" not "report" | MEDIUM | MEDIUM | Add "approve to clean" in v2; start read-only |

### Final Verdict: ⚡ BUILD IT (with caveats)

**Recommendation:**
- Build as **open-source MVP** (GitHub)
- Get validation + feedback
- If traction strong, add:
  - **Pro tier** ($9-19): Auto-cleanup, scheduling, advanced reports
  - **Enterprise tier** ($49-99): Fleet management, CI/CD plugins

---

## Dev Audit Agent Concept

### Vision
**"System Health & Performance Advisor"** - Belarc-style dashboard meets Wise Tools performance focus, plus developer workspace hygiene.

### Core Pillars

1. **Task / Process View** (Task Manager lens)
   - What's running, what's heavy (CPU, RAM)
   - Startup items analysis
   - **Module:** `process_classification.ps1`

2. **Storage & Disk View** (Disk Manager lens)
   - Free space, large folders, temp/junk
   - File-type hotspots
   - **Module:** `storage_cleanup.ps1`, `filetype_summary.ps1`

3. **Apps & Features View** (Apps inventory lens)
   - Installed software & drivers
   - Security stack & RMM agents
   - Bloat detection
   - **Module:** `installed_apps_audit.ps1`

4. **Developer Workspace View** (Dev hygiene lens)
   - Dev tools, runtimes, venvs, Docker
   - Repo locations, stale projects
   - **Module:** `dev_workspace.ps1`

### Profile-Based Scanning

**General Profiles:**
- **Quick System Snapshot:** Security, startup, RMM agents
- **Performance & Boot Tuning:** Startup, heavy services, boot time
- **Security & Compliance:** Security stack, BitLocker, updates, RMM
- **Storage & File Types:** Large folders, temp cleanup, file-type stats

**Developer Profile:**
- **Developer Workspace:** Git repos, VS Code extensions, Docker, runtimes
- **Dev Minimal:** Tools detection only

**A-la-Carte Mode:**
- Checkbox list of categories (Belarc-style)
- User picks exactly what to scan

### Path Discovery Helper

**Problem:** Users don't know where their dev projects or large files live.

**Solution:** Lightweight utility that auto-suggests likely paths:
- Scans environment variables
- Checks common patterns (`U:\Dev`, `U:\app-dev`, `%USERPROFILE%\source`)
- Counts `.git` repos or large files
- Suggests top 3 roots

**Module:** `path_suggestions.ps1`

### Smart Advisor Features

**Process Classification:**
- Buckets processes: Security/IT, Driver/Hardware, Cloud Sync, Dev Tools, Updater/Telemetry
- Summarizes count, total CPU, total RAM per category
- Generates advisor text:
  - "Dev tools are using 3.8 GB RAM. Close Antigravity to free this."
  - "Updaters & telemetry processes use ~250 MB. Consider disabling HP Print Scan Doctor."

**Bloat Detection:**
- Reads installed apps from registry
- Scores based on:
  - Publisher (flags known bloat vendors)
  - Name patterns (toolbar, updater, assistant)
  - Install age (old + unused)
- Protected publishers list (Microsoft, Intel, Huntress, etc.)
- Never suggests removing IT/security tools

**Output:**
- Category: `Protected`, `Candidate`, `Neutral`
- BloatScore for ranking

### Report Formats

**Dual Output:**
- **Markdown:** Plain text, grep-able, version-controllable
- **HTML:** Dashboard-style, collapsible sections, advisor boxes

**Report Structure:**
1. **Summary Dashboard:**
   - Health tiles: Performance, Storage, Security, Dev Workspace (🔴/🟡/🟢)
2. **Advisor Notes** (per section):
   - 3-5 bullet insights before raw tables
3. **Detailed Tables:**
   - Collapsible by default
   - Show full data for power users

### Current Implementation Status

**In TangentCore repo (`.ai/` folder):**
- ✅ Comprehensive audit framework template (`AUDIT_PROMPT.md`)
- ✅ Manual process (copy-paste into LLM)
- ❌ No automated PowerShell tool
- ❌ No GUI launcher
- ❌ No scheduled/CI-CD integration

**Next Steps:** Build standalone tool with modules above.

---

## Design Principles & Decisions

### From This Session

1. **Read-only by default**
   - Reports only, zero system changes
   - Safety-first approach
   - Builds trust before adding "approve to clean" features

2. **Profile-driven architecture**
   - YAML config defines profiles & categories
   - Categories map to modules
   - A-la-carte mode = runtime profile generation

3. **Path discovery = UX win**
   - Don't make users hunt for `U:\Dev` or `C:\Users\Brian\source`
   - Auto-suggest based on environment + heuristics
   - Default to smart guesses, allow override

4. **Protected publishers list**
   - Never flag Microsoft, Intel, Huntress, HP, Logitech as bloat
   - Avoids dangerous false positives
   - Maintains trust

5. **Category-based classification**
   - Not "25 processes" but "Dev Tools: 30 processes, 3.8 GB RAM"
   - Helps users understand impact
   - Enables targeted advisor text

6. **Advisor layer > raw dumps**
   - Top section: "What this means for you"
   - Bottom section: Full tables for power users
   - Wise Tools / Belarc feel vs log dump

7. **Dual output (MD + HTML)**
   - MD: Version control, grep, CI/CD integration
   - HTML: Human-friendly dashboard

8. **Modular & extensible**
   - Add new modules without rewriting core
   - Profile config in YAML (no code changes)
   - Easy to contribute new checks

### Design Style Reference

**Requested:** Follow patterns from `DriveCleanupToolkit_v3` repo (URL 404'd - need to verify)

**Assumed patterns:**
- PowerShell-first
- Config-driven
- Modular architecture
- Professional documentation

---

## Next Steps

### For Profit Pulse

1. **Create separate repo:** `profit-pulse`
2. **Copy this knowledge doc** to `docs/KNOWLEDGE_BASE.md` or `.ai/CONTEXT.md`
3. **Build Tier 1 MVP:**
   - Next.js scaffolding
   - QPV calculator logic
   - Claude API integration
   - Basic results page
4. **Launch & validate:**
   - Deploy to Vercel
   - Post on IndieHackers
   - Gather feedback
5. **Build Tier 2/3** based on traction

### For Dev Audit Agent

1. **Clarify repo location:**
   - Is it in TangentCore (just templates)?
   - Separate repo to create?
   - Local files to push?

2. **If building new:**
   - Create `dev-audit-agent` repo
   - Implement modules (already drafted in session):
     - `process_classification.ps1`
     - `installed_apps_audit.ps1`
     - `path_suggestions.ps1`
     - `dev_workspace.ps1`
     - `storage_cleanup.ps1`
   - Wire into `system_audit.ps1` main script
   - Build GUI launcher (`gui_launcher.ps1`)
   - Create profiles in `audit_config.yaml`

3. **Reference DriveCleanupToolkit_v3:**
   - Verify correct URL or check local
   - Match style & patterns

### Immediate Action Required

**User needs to clarify:**
- Correct URL for DriveCleanupToolkit_v3 (or provide access)
- Where Dev Audit Agent repo actually lives
- Whether to continue in `profit_pulse` repo or different location

---

## Key Files Generated in This Session

### PowerShell Modules (ready to use)

1. **`modules/process_classification.ps1`**
   - Classifies running processes into categories
   - Summarizes CPU/RAM per category
   - Outputs CategorySummary + ProcessDetail rows

2. **`modules/installed_apps_audit.ps1`**
   - Reads uninstall registry keys
   - Scores bloat candidates
   - Protects core OS/IT/security publishers
   - Outputs Protected/Candidate/Neutral categorization

3. **Helper functions for report generation:**
   - `Get-PerformanceAdvisorText`: Generates advisor bullets for process data
   - `Get-AppsAdvisorText`: Generates advisor bullets for installed apps

### Report Integration Snippets

- Markdown section handling for `process_classification`
- Markdown section handling for `installed_apps_audit`
- HTML generation patterns (partial - not complete)

### Config Schema (proposed)

```yaml
profiles:
  Quick_Audit:
    label: "Quick System Snapshot"
    group: "General"
    description: "Fast overview of security, startup, and RMM agents."
    categories:
      - System_Config
      - Security
      - Startup
      - RMM

categories:
  Process_Classification:
    modules:
      - process_classification
  Apps_Bloat:
    modules:
      - installed_apps_audit

filetype_sets:
  Light:
    description: "Only major hogs."
    extensions: [".iso", ".zip", ".rar", ".7z", ".mp4", ".mkv", ".mov"]
```

---

## Session Metadata

**Conversation Flow:**
1. Started with Profit Pulse concept review
2. Meta-analysis: Profit Pulse on itself
3. Discussed Dev Audit Agent as system/performance tool
4. Designed smart advisor features (process classification, bloat detection)
5. Built PowerShell modules
6. Created report integration layer
7. Discussed path discovery helper
8. Now preparing knowledge doc for repo switch

**Status:** Ready to transition to `profit_pulse` repo and continue implementation.

**Next Claude Session Should:**
- Review this doc first
- Confirm repo structure
- Begin implementation based on decisions above

---

## Questions for User (when resuming)

1. Which project to focus on first: Profit Pulse or Dev Audit Agent?
2. Correct URL/access for DriveCleanupToolkit_v3?
3. Should Dev Audit Agent be:
   - Standalone repo?
   - Module within TangentCore?
   - Part of a larger toolkit suite?
4. Preferred timeline: MVP in 2 weeks or full-featured in 6-8 weeks?
5. Target platform: Windows only initially, or plan for cross-platform?

---

**End of Knowledge Base**
*Last Updated: 2025-11-23*
*Ready for import to https://github.com/batkins33/profit_pulse.git*
