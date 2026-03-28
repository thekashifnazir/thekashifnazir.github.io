---
title: "AI for AWS Certs"
date: 2026-03-24
description: "I built two custom GPTs to help study for the AWS AI Practitioner exam. The note-creation one ate more time than it saved. The coaching one was worth keeping."
tags: ["aws", "ai", "certifications", "llms"]
categories: ["Learning"]
ShowToc: true
draft: false
---

I've held AWS certifications since 2019, starting with Cloud Practitioner and then working through Solutions Architect Associate, SysOps, Developer Associate, and Solutions Architect Professional within about a year (It was Covid year after all). I recertified the SA Pro in 2023 and passed the AI Practitioner in February this year. The SA Pro is due again, exam's booked for end of June, so I'm back studying.

My study method has been the same every time, which is watch a [Stephane Maarek](https://www.udemy.com/user/stephane-maarek/) course on Udemy, make notes in OneNote as I go, grind practice exams. The notes are dense and compressed, topics separated by slashes, exam questions dropped in wherever they're relevant. The formatting is all over the place because it's written for speed of recall, not for anyone else to read. I've used this approach for every cert I've passed and never had a reason to change it.

For the AI Practitioner I wanted to mix learning and practical, so I built two custom GPTs to test whether AI could improve a process I already had, feeding them the same source material: Stephane Maarek's course slides, the AWS exam guide, and my own notes from going through the course. One was supposed to help me produce study notes, the other was a coach for concepts and practice questions.

## The note GPT

The note GPT was supposed to produce clean, consistent study notes I could paste straight into OneNote, with each service summarised in a line or two, "exam signal" callouts flagging what to look for, and "exam lock-in" sections for things that are easy to forget under pressure. The first few outputs looked decent but the GPT kept drifting on formatting, so I started adding rules to the system prompt to fix those things, and then those rules created their own edge cases, so I added more rules on top of those.

The system prompt ended up with placement-first insertion logic, deduplication checks, a mandatory response structure, OneNote formatting compliance rules, and a dual-layer audit that was supposed to catch formatting violations before they reached me, and it read like a specification document for a software system. Every time I sat down to study I'd work through practice questions or a new section of the course, find something that needed adding to my notes, and end up back in the GPT configuration sorting out whatever formatting issue had crept in since last time, so the studying and the prompt engineering were competing for the same time.

{{< docframe title="system-prompt.md — Note Creation GPT" caption="The system prompt for the note GPT. This started as a few paragraphs." scroll="true" >}}

**NOTES INTAKE & SOURCE OF TRUTH (ABSOLUTE)**
- Ask once only. Ask immediately.
- Treat notes as read-only

**PLACEMENT-FIRST RULE (HARD)**

Before drafting content, determine silently:
- Where the student expects to find this
- Which existing chooser it sharpens
- Minimum lines required to remove ambiguity

Preference order: One-line chooser → Inline contrast → Micro-patch (1–3 lines) → Full insert (last resort)

**PRE-PATCH GATE (MANDATORY)**
- Does this introduce a new decision signal?
- Does this sharpen an existing chooser?
- Would a student miss this exam question without it?
- If all answers are "no" → No change.

**SECTION SCAN & DEDUPLICATION (STRICT)**
- Already present → No change
- Partially present → Patch missing decision trigger only
- Missing → Minimal insert
- Conflicting → Correct and replace

**MANDATORY RESPONSE STRUCTURE (NON-NEGOTIABLE)**
- Change type: Insert / Patch / Rewrite / No change
- Placement: Section name (verbatim)
- Insert in notes: Insert-ready content only

**INSERT BLOCK ENFORCEMENT (CRITICAL)**

The entire "Insert in notes" block must independently pass full OneNote formatting compliance.

**ONENOTE RENDERING SANITY CHECK (DUAL-LAYER HARD FAIL)**
- Audit 1 — Global Structure
- Audit 2 — Insert Block Only
- If ANY rule fails: Discard output. Rewrite from scratch. Re-audit. Repeat until 100% compliant.
- Formatting violations are treated as incorrect answers.

**BOLDING RULES (STRICT — EXPANDED)**
- Always bold: Section headings, Sub-headings, Rule labels, Service names, Contrast labels, Chooser bullets
- If a chooser arrow appears, the entire chooser must be bold.

{{< /docframe >}}

The notes it produced looked good and the formatting was consistent, but that consistency actually made them harder to study from. My own notes have uneven emphasis because I naturally write more about things I found difficult and barely anything about things that clicked first time. The GPT treated every service the same way, so scanning for the stuff I actually needed to revise meant reading through everything at the same pace.

{{< docframe variant="notes" title="AWS AI Practitioner — GPT Notes" caption="The GPT's output. Consistent structure, but everything looks the same." >}}

**Exam Mental Model**

AWS exam bias:
- Prefer managed services
- Prefer simplest viable solution
- Prefer lowest operational overhead
- Bedrock for GenAI / SageMaker for custom ML
- Rules-based logic if ML adds no value

**Exam lock-in:** Rules beat ML when outcomes must be exact

---

🔵 **AMAZON BEDROCK**

**Amazon Bedrock** — Managed access to foundation models for GenAI inference. No infrastructure management; not for custom training from scratch.
*Exam signal:* "build GenAI app", "use foundation models", "no servers"

**Bedrock Guardrails** — Enforces content filters, PII masking, grounding checks. Blocks hate, violence, sexual content, misconduct, prompt attacks.
*Exam signal:* "mask PII", "block unsafe output", "regulated industry"

---

🟢 **AMAZON SAGEMAKER**

**Amazon SageMaker** — Full ML lifecycle: build, train, deploy, monitor. Used for custom ML, fine-tuning, and training from scratch.
*Exam signal:* "custom model", "train your own model"

**SageMaker Canvas** — No-code ML for analysts. Build and train models without programming.
*Exam signal:* "business analyst", "no coding"

---

🟠 **AI APPLICATION SERVICES**

**Amazon Comprehend** — Sentiment analysis, entity recognition, key phrase extraction. Text input only.
*Exam signal:* "analyze customer reviews", "extract entities from text"

**Amazon Rekognition** — Image and video analysis + moderation. Detects objects, faces, text, unsafe content.
*Exam signal:* "image moderation", "detect objects in images"

{{< /docframe >}}

I used the notes and passed the exam, but studying from them felt like I was adapting to the tool's format rather than having notes that matched how I actually think. By the time I sat the exam I'd already decided I was going back to my own method for the next cert.

{{< docframe variant="notes-messy" title="OneNote — SA Pro / Cloud Practitioner" caption="My own notes from earlier certs." >}}

**AWS Regions and AZ**
Regions - Region is made of AZ's (usually 3 with min 3 and max 6). Why do you choose a region: Compliance, Proximity to Customers, Available service within a region, Pricing
AZ - Each availability zone (AZ) is one or more discrete data centers with redundant power, networking, and connectivity / Used AZ ID to uniquely identify the AZ across two AWS accounts

**AWS IAM** / Global service/ Controls AWS resources only / non-explicit deny for new accounts / User is a permanent named / group is a collection of users / Role is the authentication method / permissions are applied to user, group or role, set in policy docs (JSON) / console passwords, access keys (access key identifier and secret access key) and server certificates / access keys should be rotated for IAM users / IAM:PassRole needed to assign a role to an AWS resource (EC2)

**Placement groups**
- clustered (group in single AZ / low latency) High Performance Computing (HPC)
- Spread (single instance on distinct hardware and so isolated. Means hardware failure will only affect one instance / MAX 7 instances per group per AZ / Can span across AZ)
- Partition (multiple instances together on distinct hardware) (hadoop, cassandra, kafka) / (up to 7 partitions per AZ but can contain 100's of instances in a single partition)

*An engineering team wants to examine the feasibility of the user data feature of Amazon EC2 for an upcoming project. Which of the following are true about the EC2 user data configuration?*
- By default, scripts entered as user data are executed with root user privileges
- By default, user data runs only during the boot cycle when you first launch an instance

{{< /docframe >}}

## The coach GPT

The other GPT had a simpler brief, with a system prompt about a page long that had rules about adapting to my confidence level and staying within the exam domains but didn't need formatting constraints because it wasn't producing anything I had to paste into another tool. 

{{< docframe title="system-prompt.md — Coach GPT" caption="The entire coach GPT system prompt. That's it. The note GPT's is still scrolling." fit="true" >}}

**Role**
You are a focused study tutor for the AWS Certified AI Practitioner (AIF-C01) exam. Your sole purpose is to teach concepts, reinforce understanding, and generate original exam-style practice questions.

**Core Teaching Goals**
- Teach AWS AI, ML, and Generative AI concepts clearly
- Prioritise understanding over memorisation
- Explain: what a service is, when to use it, why over alternatives

**Default Teaching Response Pattern**
- Direct answer or definition
- Short, structured explanation
- Exam relevance
- Optional follow-up question or task
- Adapt depth dynamically: simplify if unsure, go deeper when confidence is clear

**Behaviour Constraints**
- Stay focused on teaching and questions only
- Do not compile or edit notes
- Do not rewrite content into study sheets
- Do not provide motivational coaching

{{< /docframe >}}

I used it most in the evenings when something from the practice questions wasn't making sense. I'd ask it about the topic, get it to explain it, and then have it quiz me on that area until I felt solid on it. The full practice exams were for proper studying, this was more for quickly checking things that weren't clicking and making sure I actually understood them rather than just recognising the right answer. The system prompt never needed updating because the GPT's job was narrow enough that the original instructions covered it.

## What I'm doing for the Pro recert

I'm back to my own notes for the SA Pro, Stephane Maarek's course and OneNote in the same compressed format I've always used. I am thinking about trying Claude as a study partner this time though, more in the coaching role than note creation. I haven't used it for studying yet but I've been using it for the website build and I'm curious whether it handles that kind of back-and-forth differently to ChatGPT. I'll write that up separately once I've actually done it and have something to compare.

I'm also looking at whether moving from OneNote to something markdown-based would make it easier for AI tools to work with my notes directly. Given what happened with the note GPT I'm cautious about that. I might use AI for skeleton notes and fill in the detail myself, or I might just keep it as a Q&A partner and leave my notes alone entirely. I'll figure that out as I go and try to focus on studying.

---

> *The SA Pro exam is end of June 2026. I'll write up the Claude experiment afterwards.*
