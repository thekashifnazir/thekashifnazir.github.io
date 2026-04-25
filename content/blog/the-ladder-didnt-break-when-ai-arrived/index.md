---
title: "The Ladder Didn't Break When AI Arrived"
date: 2026-04-25
description: "AI is eating some junior work, but the route into architecture had already been narrowed by cloud, specialisation, and the loss of accidental breadth."
images: ["/images/social/social-card-the-ladder-didnt-break-when-ai-arrived.png"]
tags: ["careers", "ai", "architecture", "mentorship", "cloud"]
categories: ["Architecture"]
ShowToc: true
ShowReadingTime: true
draft: false
---

[The Register reported](https://www.theregister.com/2025/10/16/uk_tech_grad_jobs/) that UK entry-level tech roles fell 46 percent in 2024, with projections hitting 53 percent by the end of 2026, based on figures from the Institute of Student Employers. Most of the commentary points at AI as the cause, and AI is doing something, but the ladder into architecture has been eroding for over a decade and the AI piece is just the wave you can see right now. The earlier waves were quieter and they did most of the damage well before agents showed up.

{{< figure src="missing-rungs-cable-ladder.jpg" alt="A cable ladder mounted on an office wall with lower connections hanging loose" caption="The ladder metaphor only works if the lower rungs and the sideways routes still exist." >}}

## How I learned infrastructure

I came up doing the slow version of infrastructure work: racking servers, running cables, watching a storage array actually fill up, seeing what a switch does when something goes wrong. Most of that stopped being available to anyone joining after about 2015 because cloud abstracted the layer where that learning used to happen. The hardware became somebody else's problem, and the teaching that used to happen by accident when something failed didn't happen either, because there wasn't any hardware in front of the junior to fail.

{{< figure src="hands-on-server-rack.jpg" alt="An engineer installing hardware into a server rack in a data centre" caption="The old junior route included physical work that exposed the layers cloud later abstracted away." >}}

That was the first wave, and it had been working its way through the industry for ten years before anyone started worrying about AI agents.

## When breadth came free

The other thing that used to happen, even in large orgs, was that breadth came free. An EUC person who went looking for a corrupted profile would end up in storage. A Group Policy that wasn't applying would pull you into networking to check the site configuration. By the time you had a few years in, you'd stepped through networking, storage, server, and end user compute without anyone formally teaching you any of it. Most of what made you useful at the next level was that accidental crossover.

Specialisation closed that down by drawing harder lines between teams, so a junior joining a networking team in 2022 stays in networking, and the seat at the change review you'd have ended up in by accident isn't there because the boundaries have been drawn around it. Most of the current career commentary misses this part. The ladder didn't just lose the bottom rung when cloud arrived, it also lost the sideways movement that produced breadth, and that was already happening seven or eight years before AI showed up.

{{< figure src="junior-between-silos.jpg" alt="A junior engineer standing in a glass-walled technical office corridor between server rooms and workspaces" caption="Breadth used to come from drifting across boundaries. Once the boundaries harden, the learning path narrows." >}}

## What AI is eating now

Within whatever silo a junior ends up in, the hands-on grunt work that taught the remaining fundamentals is being automated or assisted away. Boilerplate, ticket triage, log-reading, figuring out why something broke. These are the tasks that used to build mental models by forcing you to fail a few times before getting it right. The junior doesn't do the thing now, they review the thing an agent did.

{{< figure src="mentoring-server-room.jpg" alt="A senior engineer and a junior engineer reviewing a laptop beside server racks" caption="Once the work is produced by an agent, the learning shifts from doing to reviewing, and that only works when someone still has context." >}}

In theory AI also fixes the breadth problem the first two waves created, because a junior can ask an agent about networking, storage, compute, and identity in one afternoon and come away knowing more than someone five years their senior would have. But knowing isn't the same as access, because an agent can't get you sudo on the network team's kit, and the organisational boundaries specialisation built are still there. They're what's gating the breadth, not the knowledge.

I run into the other side of this from the senior end too. If I ask a junior to do something in Terraform and they can't explain what happened because they just got the agent to produce it, the question stops being whether they're learning and starts being whether it would be safer and faster for me to just do it myself. At that point neither side is getting much out of it. The junior isn't picking up Terraform and the senior isn't getting useful work back. It's the Google problem with the friction taken out, because Googling used to make you read three wrong Stack Overflow answers before finding the right one, and the wrong ones taught you the shape of the problem, whereas copy-paste from a CLI collapses that to zero.

## The non-traditional path, briefly

The skills that actually matter at senior architecture level were never produced by the formal training. They were picked up as side effects of surviving messy mixed-role junior work, things like integration thinking, stakeholder translation, trade-off judgement, and knowing what question to ask when something's gone wrong. I came at those skills from a different surface, mainly customer service from before I got into IT properly. Most of a customer service day is spent translating between what people say they want and what they actually need, which turns out to be most of architecture.

{{< figure src="architecture-translation-team.jpg" alt="A technical lead moving between people in a planning workspace with architecture drawings on the wall" caption="Architecture is often translation first: moving between what people say, what they need, and what the system can actually support." >}}

I don't think non-traditional paths should suddenly become fashionable. But if the traditional ladder doesn't produce these skills by accident anymore, the industry will need to find them somewhere, and the routes people used to feel slightly apologetic about might end up looking more like a working alternative to a pipeline that doesn't really exist now.

## Trust and verify, both ways

A recent PR landed on a repo I'd been working on for a while, fully AI-generated, with a description claiming it had consolidated one markdown file into another, when actually it had just deleted the file outright. The only reason I caught it was that I knew the repo well enough to want to go deep on the review, since this was one of the contributor's first PRs and I wanted to actually read what they'd put up rather than just approve it. The honest part is that I don't always go that deep on my own AI-generated PRs, which probably means the advice I'd give a junior about reviewing AI output isn't advice I always follow myself.

I was investigating an issue with a colleague recently, and one of us ran a quick check through an AI tool that returned the right answer, missing files, but the actual root cause was different. The files were there, just at the wrong folder level, and the quick answer would have solved the surface symptom and left the real problem intact. That kind of surface-level confidence is what AI does most reliably when the context is partial, and the only thing that catches it consistently is a second pair of eyes. The value of pairing isn't only that the junior learns from the senior, it's that two people catch the class of mistake one person plus a confident tool will miss.

{{< figure src="pair-reviewing-laptop.jpg" alt="Two engineers reviewing a laptop together in an office" caption="The useful part of review is not approval. It's the second person noticing what the first pass made too easy to miss." >}}

## What I'm watching that the published advice isn't

There was always a joke in IT that we were glorified Google searchers, and the difference between people who did well and people who didn't was who could do that effectively. The same shift is happening with AI tooling, where access to better information just raises the expectation of what you can do with it, and the bar isn't going back. A junior who can orchestrate AI to cross four domains in an afternoon is competing against juniors who couldn't do that at all five years ago, which is fine in itself, but it means the bottom of the ladder has been pulled up rather than removed.

{{< figure src="mid-tier-review-pressure.jpg" alt="Two engineers reviewing a laptop in a meeting room while a senior colleague appears on a wall display" caption="The middle layer is where delivery, review, mentoring, and future seniority start competing for the same time." >}}

The real question to me is what the mid-tier looks like in five years. The published advice is mostly either about saving the juniors or about protecting senior mentorship time, and nobody's looking at the layer in the middle. The mid-tier is the one expected to produce more with AI, take on the reviewing work seniors used to do for juniors, and feed into senior roles when the current seniors age out or step up, all at the same time. If that layer collapses under the weight of being the productivity layer, the review layer, and the future seniority layer at once, it goes quietly over about five years and nobody notices until the next generation of architects is meant to emerge and isn't there. That's the part of this I'd be paying attention to over the next few years.
