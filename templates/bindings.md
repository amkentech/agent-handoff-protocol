# Stack bindings

The protocol is tool-agnostic; this file binds it to YOUR stack. Copy it,
fill it in, and give it to every agent alongside the skill.

| Binding | Value | Notes |
|---|---|---|
| **Work store** | {{e.g. Confluence space X / repo folder /work}} | Where work items + artifacts live. One authority — if you mirror state, name which side wins. |
| **Feature tree convention** | {{e.g. Feature page = parent; persona artifacts = children}} | |
| **Status mechanism** | {{e.g. Confluence status lozenge / page property / JSON field}} | Must render the states in protocol/states.md. |
| **Version pin convention** | {{e.g. "Approved for build: v7" line in a Handoff block at top of page}} | |
| **Notification channel** | {{Teams channel / Slack channel}} | Action-needed messages only. |
| **Ask-human channel** | {{same channel, or a form/thread}} | Where agents post blocked-on-decision questions. |
| **Escalation contacts** | {{role → @person}} | Per role. |
| **Roles in play** | {{e.g. product-manager, pm-agent, planning-agent, coding-agent, review-agent, eng-owner}} | |
| **Agent access model** | {{who can read/write what}} | Agents carry their own role's access. Handoffs move context, never privilege. |
