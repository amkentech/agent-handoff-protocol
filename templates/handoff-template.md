# Handoff package template

The markdown rendering of `protocol/handoff.schema.json`. Fill it in and post
it on the work item when transferring responsibility. This is the system of
record — chat messages may add color but never replace it.

---

## Handoff: {{WORK_ITEM_TITLE}}

| | |
|---|---|
| **Work item** | {{WORK_ITEM_ID / link}} |
| **From** | {{ROLE}} ({{human or agent + model}}) |
| **To** | {{NEXT_ROLE}} |
| **Date** | {{DATE}} |

### Work completed
{{One paragraph: what was accomplished.}}

### Actions taken
- {{...}}

### Artifacts produced
| Artifact | System | Version | Link |
|---|---|---|---|
| {{PRD}} | {{confluence}} | {{v7}} | {{url}} |

### Source versions built from
| Source | Version |
|---|---|
| {{upstream artifact}} | {{v3}} |

### Decisions made
- {{...}}

### Open questions
- {{...}}

### Known risks
- {{...}}

### Recommended next action
{{One sentence.}}

### Approval required before next step?
{{No / Yes — @who}}

### Context links
- {{...}}
