# /deal-review — Deal Intelligence & Risk Analysis

Analyze a deal objectively. Identify risks early. Create an action plan.

## Instructions

The user will describe a deal (company, stage, details). Analyze it systematically.

### Step 1: Gather Deal Context
Ask for (or use what's provided):
- Company name and what they do
- Deal stage (Lead / Discovery / Proposal / Negotiation / Closed)
- Deal value (ARR or total contract)
- Key contacts and their roles
- How long it's been in current stage
- Next scheduled interaction
- Competition status (are they evaluating others?)

### Step 2: Deal Health Scorecard

Rate each dimension 1-5 and calculate overall health:

```
═══ DEAL HEALTH SCORECARD ═══

Deal: [Company] — $[Value] [ARR/Total]
Stage: [Current Stage] | Days in stage: [N]

─── SCORING (1-5) ───
Champion Strength:    [X]/5  [Why]
Multi-threading:      [X]/5  [# contacts engaged / ideal 3+]
Compelling Event:     [X]/5  [What's driving urgency, if anything]
Decision Process:     [X]/5  [How clear is the buy process?]
Budget Confirmed:     [X]/5  [Explicit budget discussion?]
Competition Status:   [X]/5  [Where do we stand vs alternatives?]
Technical Fit:        [X]/5  [How well does our solution match?]
Next Steps Clarity:   [X]/5  [Are next steps specific + time-bound?]

OVERALL HEALTH: [Average]/5  — [HEALTHY / AT RISK / CRITICAL]
```

### Step 3: Risk Analysis

Identify the top 3 risks and mitigation strategies:

```
─── RISK ANALYSIS ───

🔴 Risk 1: [Highest risk]
   Evidence: [Why this is a risk]
   Mitigation: [Specific action to take]

🟡 Risk 2: [Medium risk]
   Evidence: [Why]
   Mitigation: [Action]

🟡 Risk 3: [Lower risk]
   Evidence: [Why]
   Mitigation: [Action]
```

### Step 4: Action Plan

Create specific, time-bound next steps:

```
─── ACTION PLAN ───

This Week:
1. [Specific action] — by [day]
2. [Specific action] — by [day]

Next Week:
3. [Specific action]
4. [Specific action]

To Advance to Next Stage:
- [What needs to happen]
- [Who needs to be involved]
- [What artifact needs to be created (proposal, demo, etc.)]
```

### Step 5: Forecast Assessment

```
─── FORECAST ───
Probability: [X]%
Confidence: [HIGH / MEDIUM / LOW]
Expected close date: [date]
Should this be in commit? [YES / NO — and why]
```

### Rules
- Be BRUTALLY HONEST. Sugarcoating helps nobody.
- If deal health is below 3/5, say so clearly and explain why.
- "No compelling event" = the deal will stall. Always flag this.
- "Single-threaded" (only one contact) = highest risk. Always flag.
- Every action item must be specific enough to calendar.
