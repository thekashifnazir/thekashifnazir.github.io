---
title: "Pilot to Production: The Gap Nobody Plans For"
date: 2026-04-04
description: "Pilots get support, rollouts get a prayer. Why OS migrations and AI tool rollouts fail in the same human ways."
images: ["/images/social/social-card-the-pilot-to-production-gap-nobody-plans-for.png"]
tags: ["migration", "windows", "copilot", "ai", "change-management"]
categories: ["Projects"]
ShowToc: true
draft: false
---

Most migrations don't start because someone planned one, they start because half the organisation is already using something unsanctioned and you're formalising it before it turns into a compliance problem. I've seen that across different types of tech, and the failure mode is always the same: the pilot gets all the investment and the rollout gets whatever's left, which is usually not much.

{{< figure src="rollout-at-scale-office.png" alt="A large open-plan office filled with rows of desks and computer screens" caption="The hard part of a migration is usually the stretch between a successful pilot and a real rollout." >}}

## The expectation gap

Before any pilot starts, people have already decided what the new thing will do for them. With an OS migration, it's "the new version will fix everything." With an AI tool, it's "this will transform how we work." Neither of those is true, and when reality doesn't match the expectation, people don't explore further.

With a Copilot rollout for a small business, the team expected the AI features to be the big win, but in practice the thing that actually changed their working day was Teams transcription. Being able to pull what was said in a meeting into a usable starting point for documentation was huge, especially for technical people who don't like writing things up. The AI piece was useful but not transformative in the way they'd imagined, and if nobody had managed that expectation upfront the whole thing would have been written off as a disappointment, when actually the value was real, just not where they expected it.

I've watched people move from Windows 7 to Windows 10 and then get frustrated that Adobe Reader still can't do the thing they wanted it to do. New operating system, same third-party limitations, but people blame the migration because that's the change they noticed.

## Picking your pilot group

If you pick a department because it's convenient, or because the manager volunteered, your pilot data is fiction. You need people who'll actually push through friction and give you feedback you can act on, and the difference between someone who'll explore a new tool and someone who'll file a ticket at the first unexpected behaviour is the difference between a pilot that tells you something useful and one that tells you nothing.

This applies whether you're testing an OS image or an AI assistant, and if your pilot group isn't representative of how the wider organisation works, you're validating the wrong thing.

{{< figure src="pilot-group-workshop.png" alt="A team gathered around a meeting table looking at rollout plans" caption="A useful pilot group is representative, curious, and willing to push through friction long enough to tell you what actually broke." >}}

## The training problem

People don't read documentation until they're stuck, and by then they're frustrated and looking for confirmation that the new thing is worse than the old thing. Training sessions alone don't work either because you can run a great session on a Tuesday and by Thursday people have forgotten half of it because they haven't had to use it under real conditions yet.

What actually works is availability, having someone around who can answer questions in the moment while the person is trying to do their actual job with the new tool. That's where champions come in, not as advocates or cheerleaders, but as a live support layer that formal IT support can't provide at scale. Someone sitting three desks away who already knows the new system and can say "yeah, that button moved, it's under settings now" is worth more than a 40-page deployment guide.

You can demo an AI tool beautifully in a training session, but the moment someone tries to use it on their own data with their own workflow they hit friction that nobody covered, and having someone nearby who's already past that friction is the difference between the tool getting adopted and getting abandoned.

{{< figure src="new-protocol-support-comic.png" alt="A retro office comic scene where one colleague is helping another with a new protocol on a computer" caption="This is what most real training looks like: someone nearby explaining the new thing in the moment it stops being theoretical." >}}

## The bedding-in period

I worked on a migration where some sites were jumping from XP straight to Windows 10, and after the deployment I went up to a remote site once a week for a bedding-in period. It was just being there, answering questions, showing the team that they hadn't been handed a new system and then abandoned. Most of what I did in those visits was small stuff: someone couldn't find a setting, someone's printer wasn't mapped, someone wanted to know why their desktop looked different. None of it was technically complex but all of it mattered to the people asking.

For another company, I travelled across the US for a Windows 7 to Windows 10 migration. I was there for the image build and application packaging, making sure things worked, but the real lesson was watching the US site lead do her job. She knew every remote office personally. When we visited sites across different states, she wasn't just rolling out software. She had relationships with the people in those offices. They trusted her, and that trust meant the migration landed in a way it wouldn't have if it had been purely contractor-led.

{{< figure src="us-migration-route-map.png" alt="A vintage map of the United States marked with a red route and Xs across multiple states" caption="Large rollouts are never only about the image, the package, or the tool. They're about whether trust travels with the change." >}}

Contractors bring scale, technical capability, and bodies, but the people users already know and trust bring something contractors can't, which is the confidence that someone who understands their work is watching out for them. The sites with a known, trusted presence during the transition had fewer issues on every large migration I've worked on, not because the tech was better but because people felt supported enough to actually learn the new system rather than fighting it.

When you move from a pilot of 50 people who had dedicated support to a rollout of 5,000 who don't, the tool doesn't get worse but the support disappears, and without it people quietly stop using the thing.

## The post-pilot void

The transition from "50 people using it with support" to "the whole organisation using it without" just doesn't get designed. The pilot had a project manager, a champion, a feedback loop, and executive attention, and the rollout has a deployment date and an FAQ document.

If you don't plan the rollout properly you end up back where you started, with people finding their own solutions, adopting their own tools, and creating exactly the kind of shadow IT problem that triggered the migration in the first place.

{{< figure src="pilot-to-production-gap.png" alt="An office corridor split by a deep chasm" caption="Scale changes the support model even when the tool stays the same. That's the gap most pilots never test." >}}

I've done this across different decades, different countries, and different types of technology, and the human problems have been the same every time.

---

> *Pilots prove the technology can work. Rollouts prove whether the organisation can absorb it.*
