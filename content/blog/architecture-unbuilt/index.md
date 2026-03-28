---
title: "The Architecture Unbuilt"
date: 2026-03-23
description: "There are a lot of ways to build a personal site. I went with the simplest one. Here's what I considered, what I'm planning to build later, and some stuff about AI agents that I didn't expect to care about."
tags: ["aws", "architecture", "github-pages", "ai", "llms-txt"]
categories: ["Infrastructure"]
ShowToc: true
draft: false
---

I'm recertifying my AWS Solutions Architect Professional cert for the second time right now, so when I decided to build a personal site the temptation to go straight to Route53, CloudFront, S3, and Terraform was real. I asked ChatGPT, Claude, and Gemini what they thought before starting, and while they disagreed on a few things they all said to use GitHub Pages and not overthink the hosting. Gemini included a cost comparison that had an EKS cluster as one of the options at £150-200/month, which is overkill for basically any website, but it helped make the point that GitHub Pages with a custom domain was the obvious starting point. I could have spent weeks on infrastructure before writing a single post, or I could just start writing.

{{< figure src="Chatgpt_Claude_Gemini.svg" alt="ChatGPT, Claude, and Gemini all recommending GitHub Pages" caption="All three agreed: start with GitHub Pages, document the ambitious plan, build it later." >}}

## What I didn't use

WordPress, Squarespace, and Substack would have been quicker, but I wanted to understand the build myself even if it ended up being simple. Self-hosting on AWS from day one would have meant weeks of Terraform and cert automation before I'd got anything live. I also looked at some impressive portfolio sites and briefly wanted something like that, but the custom assets alone (illustrations, animations, 3D elements) would have taken longer than the infrastructure. I had Codex generate about ten homepage variants with different palettes and fonts to compare side by side, but it was Claude's approach of asking me questions about what I actually liked that helped more. It was pretty clear early on that the site I'd get done in two weeks of evenings and weekends wouldn't be the finished version, and I was fine with that.

{{< video src="lusion_demo.mp4" caption="Lusion's portfolio — the kind of site I briefly wanted. Custom 3D elements, illustrations, and animations that would have taken longer than the infrastructure." >}}

## Chat-first websites

While looking into all of this I noticed a few companies have replaced their traditional website with a chat interface. Satisfi Labs rebuilt their site around what they call a "chatsite," a two-column layout with nav on the left and AI chat on the right, with a toggle between chat and traditional views. Nearly 60% of Google searches now end without a click, and there's a growing argument that page hierarchies are becoming less relevant when people show up with a question and expect an answer.

{{< browser src="chatsite_example.png" alt="Satisfi Labs chatsite — two-column layout with AI chat on the right and a Classic Site toggle on the left" url="satisfilabs.com" caption="Satisfi Labs replaced their traditional site with a chat interface. The 'Classic Site' toggle at the bottom left is the fallback." >}}

For a personal site the question is whether someone wanting to know what I think about multi-cloud architecture would rather browse posts or just ask. Right now it's browse, because that's what I've built. When I rebuild in a year I'll be thinking about whether a conversational layer alongside the written content makes sense.

## Designing for AI agents

There's a weirder version of that question: will a human even visit the site? AI agents already crawl the web to answer questions on behalf of users. If someone asks AI about something I've written, it fetches my site and summarises it, and that might be as far as it goes.

It reminded me of the early web, when people stuffed pages with white text on white backgrounds so search engine crawlers could read keywords that were invisible to humans. Google eventually got smart enough to penalise all of it and building for humans became the right approach. The modern crawlers are language models, and they don't need hidden keywords, they need clean, structured, machine-readable content.

There's already a proposed standard for this called llms.txt, a markdown file at your site root that gives AI models a structured summary of your content. Jeremy Howard proposed it in September 2024 and companies like Anthropic, Cursor, Vercel, and Stripe use it. The major LLM providers haven't implemented automatic discovery of it yet, so the practical impact right now is debatable. But the file takes minutes to write and costs nothing, so I added one while researching this article.

{{< codeblock file="kashifnazir.com/llms.txt" caption="The full file is at kashifnazir.com/llms.txt — a curated summary of the site for AI models." >}}
```markdown
# Kashif Nazir

> Senior Technical Architect writing about cloud architecture,
> platform modernisation, and learning in public.

## Blog Posts

- [Building This Site](/blog/building-this-site/): Two weeks,
  two AI agents, zero web development experience.
- [Why GitHub Pages Over AWS](/blog/why-github-pages-over-aws/):
  Deferring complexity and why it's the right first move.
  ...

## About

- [About](/about/): Background, experience, and what this site is for.
```
{{< /codeblock >}}

Hugo already does most of the work here without any extra effort. It generates static HTML with minimal JavaScript, and since a lot of AI crawlers don't execute JavaScript at all, content behind client-side rendering is just invisible to them. A static site is actually easier for AI to read than something built on a heavier framework. There are a few other things worth setting up like JSON-LD structured data and making sure robots.txt allows AI user agents, but none of it takes long. It's basically the opposite of the old white-text-keywords approach. Instead of hiding stuff for machines while making the page look good for humans, you're making content clean enough that both can use it, which is a much easier problem.

## The AWS stack I'm going to build

Once I've been publishing for a while and have content worth migrating, the plan is to move from GitHub Pages to a self-hosted setup: Route53 for DNS (moving from Namecheap for programmatic control via Terraform), S3 for hosting the Hugo build output, and CloudFront in front for HTTPS with ACM, edge caching, and HTTP/2.

{{< aws-architecture >}}

The whole stack gets defined in Terraform with state in S3 and DynamoDB locking, so someone could reproduce it from scratch with a single `terraform apply`. CI/CD stays on GitHub Actions: push to main, Hugo builds, output syncs to S3, CloudFront invalidates. Should still deploy in under 60 seconds. Monitoring is CloudWatch alarms and AWS Budgets alerts, and the whole thing should cost under £5/month. I haven't built any of this yet, and writing it out now is partly to think through the decisions before I'm actually doing it, and partly so there's something to compare against when I do.

## What comes after

If AI agents become the main way people find my content, the visual design matters less than the data model. Clean HTML, structured data, llms.txt, maybe an API endpoint that lets agents query content directly. If the chatsite idea keeps growing, maybe the rebuild includes a conversational layer alongside the written articles, not replacing them but giving people another way to find what's in them. Or maybe it stays as static HTML on AWS instead of GitHub Pages and nothing else changes. I'll make that call with a year of watching this stuff behind me.

---

> *This site runs on Hugo + PaperMod, deployed to GitHub Pages. The AWS migration plan above is the Year 1 capstone.*
