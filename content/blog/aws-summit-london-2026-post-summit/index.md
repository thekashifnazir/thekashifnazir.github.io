---
title: "AWS Summit London 2026 — Post-Summit"
date: 2026-04-22
description: "The AI Builders Breakfast ended up being the most useful part of the day, and it sharpened the same question I arrived with: where the application layer fits in the AWS Summit conversation."
images: ["/images/social/social-card-aws-summit-london-2026-post-summit.png"]
tags: ["aws", "cloud", "events", "ai", "vmware"]
categories: ["Events"]
ShowToc: true
ShowReadingTime: true
draft: false
---

{{< figure src="summit-badge.jpg" alt="AWS Summit London 2026 attendee badge held in front of the Badge Pickup wall at ExCeL London" width="560" >}}

## The AI Builders Breakfast

Before the main programme opened there was a smaller invite-only session called the AI Builders Breakfast, which I hadn't known about when I wrote the [pre-Summit piece](/blog/aws-summit-london-2026-pre-summit/) and only found out about after. It ended up being the part of the day I got the most out of. The room was smaller than anything else I sat in all day and the conversations were about what's actually hard rather than what's being announced.

{{< panorama src="builders-breakfast-multiverse.jpg" alt="Discussion at the AI Builders Breakfast with a Multiverse Computing slide visible on screen" ratio="2 / 1" position="50% 56%" >}}

Multiverse Computing are doing tensor network compression to bring inference cost down 50-80%, with models that can run on-prem or on-device with no internet dependency. In the pre-Summit piece I said I'd be watching for whether the application layer showed up anywhere in the Summit conversation, and Multiverse were the closest anyone got to it all day. Their angle is that you can't always depend on the hosted endpoint and the design has to account for that, which isn't a framing I saw come up again for the rest of the day.

Fin is Intercom's AI agent, and the team running it were at the breakfast talking about the flywheel they've built. Revenue from customer inference funds compute, which funds training, which improves Fin, which drives more usage. The economics only work at Intercom's scale and they were upfront about that. Most organisations looking at production AI aren't anywhere near the scale where that loop closes on itself, and they didn't pretend otherwise.

## Kiro, Six Months Later

{{< figure src="kiro-workshop.jpg" alt="Attendees in the Kiro workshop at AWS Summit London 2026, seated with headphones while the presenters introduce the session" >}}

The Kiro workshop was the session I'd been least willing to miss, and what I took from it was mostly about how quickly the field has moved rather than about the tool itself. When Kiro first showed up in preview I wasn't working in a way that made it immediately relevant, which is what I wrote about in the pre-Summit piece. Sitting in the workshop six months later, the spec-driven approach they were walking through was essentially what I've been doing for months.

What I want to come back to in a separate piece is the point where fully automated workflows push you toward agent personas instead of skills, because that's where the interesting design decisions are now and a workshop session isn't the place to work through them.

## AWS Transform for VMware

The AWS Transform for VMware lab was what I'd been calling the fast-track VMware migration workshop in the pre-Summit piece. There were no seats when I arrived and I sat outside to join instead, until someone came out and waved me in when a spot opened up. AWS Transform is the agentic AI service that walks through discovery, dependency mapping, wave planning, network conversion, and server migration as a sequence, and the lab took you through each of those stages with the agent processing between them.

{{< figure src="vmware-transform-workshop-slip.jpg" alt="Workshop slip with QR code and handwritten note for the VMware migration with AWS Transform session" width="560" >}}

The waits between stages were genuinely long, which given what the agent is doing under the hood is fair enough, but it means you're sat there for a while with nothing to do before the next step is ready. Most of what I've seen on VMware to AWS migration has been partner slides that stop where the actual work starts, and a lab that runs through the mechanics with the tool doing them in real time was what I was there for.

## Sports Zone

The Sports Zone was worth a proper look but the queues were long enough that picking anything meant missing a workshop. I'd done a racing sim at a place in Brighton recently on a single rig, and seeing the Summit setup with about ten networked rigs running side by side made it the demo I was most disappointed not to get on.

{{< panorama src="sports-zone-racing-sims.jpg" alt="AWS Summit London 2026 Sports Zone racing simulator setup with Fanatec rigs and spectators around the track area" ratio="2 / 1" position="50% 42%" >}}

## Walking the Floor

{{< figure src="startup-zone-floor.jpg" alt="Crowded AWS Summit London 2026 startup zone with attendees wearing silent-disco style headphones during a presentation" >}}

Walking the floor, pretty much every company was something AI and it all just kind of blurred. I don't think that's unique to this Summit, it's what every tech expo has felt like for a while now, but the scale of it at ExCeL made it harder than usual to pick out who was doing what.

I did spend more time at Tailscale than I'd planned. Mesh VPN built on WireGuard, handles the key management and NAT traversal for you so it's one of those rare things that scales down to a homelab and up to an enterprise without feeling like a different product at either end. Most of what I look at on expo floors only really makes sense inside a company-scale deployment, and something that works the same way at both ends of that was a welcome shift.

I'd had Darktrace filed as a network anomaly detection company from years back and hadn't checked in since, so stopping at the stand was a reset. They're well beyond network detection now, into broader AI-driven analysis, and look further along that shift than most security vendors I've tracked.

## What Stayed Missing

The question I'd set up in the pre-Summit piece was whether the application compatibility layer would show up in the Summit conversation at all, and it mostly didn't. The main stage and the expo floor were shaped around infrastructure and AI capability, with the applications running on top of that infrastructure, which in my day-to-day are frequently the part that doesn't move, sitting outside the frame. The Builders Breakfast got closest to it, and that was partly because it was a smaller room before the main programme where people were talking about constraints rather than positioning.

{{< figure src="what-stayed-missing.jpg" alt="Crowded AWS Summit London 2026 Developer Community Zone session showing the scale of the floor and the audience around the theater space" >}}

I was there from 8am through to mid-afternoon and by that point I'd seen what I came to see. The gap between what the Summit is optimised to talk about and what the work in front of most of us actually involves is the thing I came away thinking about more than any individual session.
