---
title: "Everyone Wants a Good Handover. Nobody Wants to Write One."
date: 2026-05-02
description: "Good documentation feels like overhead until the day it saves the incident, the handover, or your future self from starting again with no context."
images: ["/images/social/social-card-everyone-wants-a-good-handover.png"]
tags: ["documentation", "handover", "incident-response", "operations", "knowledge-management"]
categories: ["Operations"]
ShowToc: true
ShowReadingTime: true
draft: false
---

<!--
Image sources:
- contextless-p1-sticky-notes.jpg: https://www.pexels.com/photo/sticky-notes-on-a-laptop-8386754/ by Tara Winstead
- writing-down-the-work.jpg: generated image supplied by Kashif Nazir, 2026-04-30
- handover-that-works.jpg: generated image supplied by Kashif Nazir, 2026-04-30
-->

A P1 landed mid-morning with no context, the person who'd been handling it was off without a handover, and there were already several people on the call waiting for something to happen. The customer had been sitting with the issue for a while before we got involved, and what I had to work from was basically nothing. I started from scratch, kept it simple and worked up from there, and had it resolved within half an hour. The fix was something I'd documented two years earlier: Windows blocking files downloaded from the internet, unblocked via PowerShell, and I only found it because I'd written it down.

{{< figure src="contextless-p1-sticky-notes.jpg" alt="A laptop covered in blank sticky notes with one note saying help" caption="When the context is missing, even a simple issue starts as a blank screen." >}}

## Writing it down before it was expected

My first IT job, my desk had post-it notes across every surface and a notes document that ran to over a hundred pages, and nobody asked me to do it. I was new, I was being shown systems and processes I'd never seen before, and I couldn't afford to be shown the same thing twice. Internal applications, support processes, anything someone explained to me once went straight into the doc, and it didn't need to be organised particularly well to be useful.

The documentation got more structured as my roles changed, but the underlying reason didn't: I didn't want to rely on my memory for things I'd already worked out. A while back I needed to do something in GCP, which I don't use often enough to keep the specifics fresh. I'd written it up when I first set it up, opened the doc, and got on with it in minutes instead of spending a day finding my feet again.

{{< figure src="writing-down-the-work.jpg" alt="A person writing notes beside a laptop at an office desk" caption="A useful note only has to preserve enough context for the next pass." width="560" >}}

## Why people talk themselves out of it

Some people see documentation as a waste of time, usually because the standards around them are low enough that the output never feels useful, so they conclude documentation is pointless when the real problem is what they're producing. Others treat knowledge as job security, keeping processes in their head because it makes them harder to remove. I saw a lot of this coming up and never bought into it. Writing things down meant I stopped answering the same questions repeatedly, could hand work off cleanly, and didn't have to reconstruct what I'd configured three years ago from scratch.

Receiving documentation that didn't work taught me more about writing it than anything else. Skilled people skip steps without realising it, because those steps are obvious to them. A note that says "add the connection string" sounds complete to the person who wrote it, but the reader has no idea where: ODBC? An IIS config file? An Ora file if it's Oracle? I started writing with the assumption the person reading had zero context, and that applies to documentation I write for myself as much as anything else. When I opened that GCP doc I had almost no memory of the process, so if I'd written it assuming I'd remember the basics, it would have been useless.

## What a good handover actually does

The best handover I've ever received came from a customer who gave me install media, written instructions, test data, and a full set of testing steps, and I handed back a working, smoke-tested application without a single call with them. That's what a good handover actually looks like: the person receiving it doesn't need to contact you because you've answered the questions before they came up.

{{< figure src="handover-that-works.jpg" alt="Two people exchanging a USB drive across a desk with a laptop, checklist papers, and a technical notebook" caption="The best handover removes the need for the follow-up call." >}}

One fix I'd noted myself was about how the registry layers interact when you're running AppSense (Ivanti) and App-V together. Each adds its own registry layer on top of the native one, so you end up with three to account for, and an add-in that wasn't working correctly needed all three understood before the cause was clear. When the same issue surfaced later I had the notes and worked through it quickly.

Someone in my team tracked down why Excel was causing an error in another virtualised application, and I could see straight away the fix was worth capturing properly. I sat with them and wrote it up based on how they explained it. Two years later the same error came up, I pulled up the OneNote page, and when they asked who'd originally found it I told them it was technically them. After that they didn't need much convincing to write things up.

## The quiet bit nobody sees

Nobody on that call made much of it once it was resolved, which is pretty standard. Most of the time you fix something and everyone moves on. The document I'd written two years earlier on a completely different engagement had just saved a P1, and the only person who knew that was me.
