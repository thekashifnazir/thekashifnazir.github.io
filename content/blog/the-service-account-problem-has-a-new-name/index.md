---
title: "The Service Account Problem Has a New Name"
date: 2026-05-15
description: "AI agent identity is being treated as a new governance problem, but most enterprises are still carrying the same unresolved service-account hygiene underneath it."
images: ["/images/social/social-card-the-service-account-problem-has-a-new-name.png"]
tags: ["identity", "service-accounts", "ai-agents", "iam", "security", "migration"]
categories: ["Security"]
ShowToc: true
ShowReadingTime: true
draft: false
---

I've sat through more than one migration where something stopped working and the trace eventually led back to a service account nobody knew was there. In one case it was a Windows scheduled task running as domain admin that hadn't been touched in years and didn't have an owner anyone could name. The pattern keeps showing up because migration is the only exercise that forces enumeration of what an application actually depends on, and the dependencies tend to include credentials with more access than anyone remembered granting. Scoping the account down to the permissions it actually needed took longer than anyone wanted to spend on it, but it left the customer with permissions they could justify and revoke if they needed to.

{{< reveal-svg src="service_account_discovery_gap_timeline.svg" alt="Timeline showing a service account created with broad permissions, drifting invisibly, then being discovered during migration and scoped down" caption="The old service-account problem is mostly hidden until a migration forces the inventory." >}}

NIST's National Cybersecurity Center of Excellence published a [draft concept paper](https://www.nccoe.nist.gov/publications/other/accelerating-adoption-software-and-ai-agent-identity-and-authorization-concept) in February 2026 on identity and authorisation for software and AI agents, and the public comment window closed on April 2, 2026. The paper proposes a project to apply identity standards like OAuth 2.0 and policy-based access control to the new class of agent that can act on enterprise systems without much human supervision. The two questions that matter for what I want to talk about are identification, meaning agents distinguished from human users and from each other rather than running under shared credentials, and audit, meaning actions traceable back to a specific agent and a specific human owner. NIST's Center for AI Standards and Innovation also announced April 2026 listening sessions for healthcare, finance, and education, with that sector feedback intended to inform the wider standards conversation.

{{< figure src="access-card-reader.jpg" alt="A modern office access card reader mounted beside a closed door" caption="Agent identity is being framed as new, but the control questions are familiar: who is this, what can it reach, and who owns it?" >}}

## The same unresolved problem

Both of those questions have been open questions for service accounts in enterprise environments for a decade, and most environments have not answered them. Shared credentials with no clear owner, permissions scoped once at creation and never reviewed, and accounts in audit logs that can't be tied to a specific human or team are all common findings. The reason these accounts get found during migration rather than during audit is that migration forces the enumeration nothing else does, and the dependencies turn out to include credentials with more access than anyone remembered granting.

When I've helped customers do this work, we pulled the account, worked out what it actually needed to do, scoped a new permission set to that, swapped the account over, and watched for the things that broke because the old account was quietly being used for something nobody had documented. The customer ended up safer and the migration moved forward, but it added time to a project that was already running tight, which is why this work doesn't happen outside of forcing events. Nothing else is pushing it, so it sits in the backlog while everything more visible gets done first.

## The agent layer moves faster

The agent deployment data mirrors what's true for service accounts in the same environments. A 2026 [Gravitee survey](https://www.gravitee.io/state-of-ai-agent-security) found that only 14.4% of organisations had full IT and security approval for their entire agent fleet, which is the percentage doing the work properly rather than just provisioning and moving on. The same percentage would probably hold for service accounts in the same environments if anyone measured it. The difference is that the service account sits there waiting to be misused while the agent is already making decisions at machine speed about which tools to call and what data to reach for next, and the audit trail it leaves is only as good as the identity it was given when it was provisioned.

{{< figure src="identity-login-screen.jpg" alt="A blurred laptop screen and keyboard in low light" caption="A shared credential makes the log look complete while still hiding who actually caused the action." >}}

## The framing helps and hides

The NIST framing as an AI problem makes the work look new, which makes it look fundable, which is useful for getting it onto a roadmap. The risk is that the framework gets adopted at the agent layer and the underlying access drift gets left alone, because the IAM hygiene work that should have been done for service accounts is the same work, and the reasons it didn't get done before haven't changed. It's slow, mostly invisible from outside the security team, and it competes with work that produces something a stakeholder can actually see. Adding an agent identity layer on top of an environment where the service account identity layer was never properly maintained doesn't fix the underlying problem. It adds a new layer of accounts with the same hygiene defaults.

{{< reveal-svg src="cover_agent_identity_on_service_account_foundations.svg" alt="Diagram showing a thin AI agent identity layer resting on unmaintained service account foundations" caption="A better agent identity model still sits on top of the access hygiene already present in the environment." >}}

## Standards still need the backlog

The OAuth 2.0 extensions, delegation patterns, and identification requirements the framework is drafting are the pieces that need to be there, and the demonstration project will probably produce a guide that some organisations actually use. The organisations most likely to use it well are the ones that already did the service account work, and the ones most exposed are the ones that didn't, and that gap is going to widen.

The framework can describe what good looks like, but it can't make anyone do the unglamorous work that has to happen before good is possible, and that work is the bit that keeps getting deferred for the reason it always has been.
