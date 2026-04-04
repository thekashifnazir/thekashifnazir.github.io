---
title: "Building This Site"
date: 2026-03-22
description: "How I built kashifnazir.com in two weeks using Hugo, two AI agents, and zero web development experience."
images: ["/images/social/social-card-building-this-site.png"]
tags: ["hugo", "ai", "claude", "codex", "Github-pages"]
categories: ["Build Log"]
ShowToc: true
ShowReadingTime: true
---

## I'm not a web developer

I'm a senior technical architect and my day job is application compatibility, migration, and platform modernisation, figuring out why software breaks when you move it between platforms and fixing it. The tools I reach for are Sysinternals, WinDbg, and Process Hacker, not CSS and JavaScript. Building a website from scratch wasn't exactly in my wheelhouse.

I've wanted a personal site for years but kept putting it off because I didn't want something that looked like it was built in 2003 on GeoCities (though I do miss the flame borders). I also didn't want to just use Squarespace or WordPress because I wanted to understand the build. When I moved into a strategy role last year where thought leadership is actually part of the job, the timing finally made sense. AI tools had collapsed the barrier too. What would have taken me weeks of learning web development took about two weeks of evenings and weekends.

Before writing any code I gave the same brief to ChatGPT, Claude, and Gemini: build a professional site to document a learning journey in AI, AWS, Kubernetes, IaC, Python, and Linux. I wanted to see where they agreed and whether any of them would talk me out of a bad idea. All three independently said GitHub Pages. I have an AWS Solutions Architect Professional cert and the temptation to build a proper stack with Route53, CloudFront, S3, and Terraform was hard to resist, but they were right. Self-hosting a site that serves text is over-engineering for the sake of it, and I'd spend all my time maintaining infrastructure instead of actually writing.

Claude suggested something I liked though: don't build the AWS stack now, but write about what you *would* build and why you're not building it yet, then do it for real later as a capstone project. Use the free thing now, document the ambitious thing, upgrade when you're ready.

So the stack is Hugo, PaperMod theme, GitHub Pages, Namecheap for the domain, ProtonMail for email. The whole thing runs at under £4 a month.

{{< figure src="base_template_light.png" alt="Early light template from first pass" caption="First pass — functional but generic." >}}

{{< figure src="base_template_dark.png" alt="Early dark template from first pass" caption="Dark theme. Both looked like every other AI portfolio." >}}

---

## Running two AIs side by side

Rather than picking one AI and going with it, I ran two: Anthropic's Claude and OpenAI's Codex. Same brief, same inputs, different branches in the same repo. I used Git worktrees to keep both active simultaneously, one worktree per branch, one AI per worktree.

I mostly wanted to see how they approached the same problem differently, and worktrees meant I could switch between them without losing context. It also turned into an unexpectedly good way to learn Git. Managing two AI-driven branches at the same time taught me more about branching, merging, and rolling back than any tutorial ever did.

Claude was more opinionated about design decisions and better at self-correcting when something wasn't working. Codex had a tendency to get stuck in loops. I wanted both versions to have a feature where a data packet follows you down the homepage as you scroll, like a signal travelling through a circuit board. Codex hit issues with tracking the scroll position and spent hours going in circles trying different approaches. I eventually pointed it at Claude's working implementation on the other branch just to get it unstuck. Once it could see a working approach it adapted and moved on, but without that nudge I don't think it would have got there.

{{< video src="codex_packet_issue.mp4" caption="Codex stuck in a loop trying to track scroll position for the data packet animation." >}}

Claude had its own problems though. At one point it hit its token limit mid-session, and when I asked it to continue it came back on the wrong worktree. It had silently switched to the Codex branch and started committing there. It took about six commits before I noticed. The changes weren't catastrophic and I could roll them back, but now I verify the worktree and branch as the first step after every rate limit or session restart.

{{< figure src="github_worktree_claude_codex.png" alt="Illustration of Claude and Codex working on the same Git history — Claude forgot to check the branch, Codex asking why Claude's commits are on its branch" caption="The worktree problem in one picture. Claude switched branches after a rate limit and committed to the wrong one." >}}

---

## The generic AI look

The early output from both AIs looked like every other AI-generated website on the internet. Same gradients, same hero layout, same generic tech portfolio aesthetic. They looked fine but they also looked like everything else.

{{< video src="codex_some_polish.mp4" caption="Codex's early output — polished but generic." >}}

{{< video src="claude_1st_pass.mp4" caption="Claude's first pass — same brief, same template energy." >}}

I kept trying to push for something more distinctive but the results stayed generic. At one point Claude was fairly blunt about it: if you don't want the site to look like AI made it, you need to start making decisions yourself, because AI will default to what it's seen on the internet, which is everything. So I stopped asking the AI to "make it look better" and started getting it to ask me questions instead. What colours do I actually like? What design motifs mean something to me? What sites do I admire and why?

One thing that worked well was getting Codex to generate ten different versions of the homepage with different colour palettes, fonts, and layouts, each deployed as a page I could visit and compare. It's much easier to rule things out when you can see them all at once, and doing that by hand would have required me to actually be a web developer.

{{< video src="codex_colour_choices.mp4" caption="Ten colour and layout variants generated by Codex — easier to rule things out when you can see them all at once." >}}

Comparing those side by side is how I landed on a warm palette (cream, terracotta, warm darks) instead of the cold tech blue that AI defaults to. It's also how I got to the circuit board spine, a PCB-style trace that threads through the homepage connecting sections like nodes on a board. Not because AI suggested it, but because when I was asked what visual metaphors resonated with me, I kept coming back to circuits and signal paths. That felt like mine, not a template.

---

## What shipped

The site is at [kashifnazir.com](http://kashifnazir.com), built with Hugo and PaperMod and deployed to GitHub Pages. The homepage has a circuit spine running through it with scroll-driven animations powered by GSAP, custom typography, and a nav with a monogram that draws itself on load. First-time visitors get a loading screen, and there are editorial blog and project layouts plus a 404 page with a "packet lost" message. The CSS ended up at about 2,200 lines and the JavaScript handles the circuit animations, scroll triggers, page transitions, and a bunch of interaction details I never would have thought to add myself.

It's not going to win any design awards but it looks like something I'd actually want to visit. Going from nothing to a site I'm happy to put my name on in two weeks of evenings and weekends is a decent result for someone whose job has nothing to do with web development.

{{< browser src="final_website.jpeg" alt="The finished kashifnazir.com homepage" url="kashifnazir.com" caption="The finished homepage — warm palette, circuit spine, editorial layout." >}}

---

## Looking back

Asking three AIs the same question before I started took about twenty minutes and saved me from over-engineering the hosting. I'd do that again for any project where I'm not sure of the approach.

The design only started looking like mine once I stopped giving the AI instructions and started answering its questions. Vague briefs got generic results. Having to actually say what I liked and why forced decisions I wouldn't have made otherwise.

Git knowledge matters more than I expected when you're working with AI agents. I ended up on the wrong branch, committed to the wrong worktree, and had to roll things back. Knowing how to fix that without panicking made those moments annoying instead of catastrophic.

The site launched with two blog posts and no project screenshots. I could have waited another month to have everything polished, but I know myself well enough to know I'd have found ten more reasons not to.

---

> *This site is built with Hugo + PaperMod, deployed on GitHub Pages. The source is at [Github.com/thekashifnazir](http://Github.com/thekashifnazir). If you want to see what the Codex version looked like, that's a story for another post.*
