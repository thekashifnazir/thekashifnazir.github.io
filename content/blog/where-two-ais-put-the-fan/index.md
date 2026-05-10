---
title: "What Two AIs Saw in My Study"
date: 2026-05-10
description: "Asking ChatGPT and Claude the same vision-led room question showed a difference that benchmarks do not always catch: what each model thinks the answer is for."
images: ["/images/social/social-card-what-two-ais-saw-in-my-study.png"]
tags: ["ai", "chatgpt", "claude", "multimodal-ai", "productivity"]
categories: ["AI"]
ShowToc: true
ShowReadingTime: true
draft: false
---

<!--
Image sources:
- study-desk-at-night.avif: image supplied by Kashif Nazir, 2026-05-10
- vintage-desk-fan.avif: image supplied by Kashif Nazir, 2026-05-10
- chatgpt-fan-answer.png: generated image supplied by Kashif Nazir, 2026-05-10
- claude-fan-answer.png: generated image supplied by Kashif Nazir, 2026-05-10
- social-card-what-two-ais-saw-in-my-study.png: social card supplied by Kashif Nazir, 2026-05-10
-->

The biggest change in chat models over the last two years is not the one most articles focus on. It is that they can now actually look at things.

Image input went from a feature you would test once and forget about to something I use weekly without thinking about it, and the gap between describing a problem in words and just showing the model what you are looking at turns out to be much bigger than I expected. The first time it really landed for me was a few years ago when I started feeding ChatGPT photos of error screens and bits of hardware I could not be bothered to describe. By the time photo-based questions felt routine I had built up enough trust in ChatGPT specifically that vision tasks became one of the things I would default to it for, even as Claude took over for almost everything else I do.

Models stopped treating images as captioning problems and started treating them as part of the same context as text, which means a photo and a paragraph of constraints can sit in the same conversation and the model can reason across both. Earlier multimodal versions could tell you what was in a picture. The current generation can reason about why what is in the picture matters for the question you are trying to answer. Most of the public benchmarks have been about object recognition and OCR, and those have got noticeably better, but the bigger shift for everyday use is that you can hand the model a photo of a real space and ask it a question that depends on understanding the space rather than identifying it.

Which is how I ended up asking ChatGPT and Claude where to put a fan in my study. My study warms up nicely in winter from the computer kit, which is almost helpful, but in summer the heat from the kit plus the heat from outside builds up and opening the window brings road noise without doing much for the temperature. I gave both models the same set of photos and the same starting prompt, partly because I had a hunch about where the fan should go and wanted a sanity check, and partly because I wanted to see how Claude would handle a vision-led task.

{{< figure src="study-desk-at-night.avif" alt="A dimly lit study with a desk, monitor, laptop, shelves, blinds, and warm light from the desk area" caption="The useful shift is being able to show the model a real room instead of translating the room into a written floor-plan description." >}}

ChatGPT has been my default for this kind of thing for years. Claude is what I reach for when the structure of the answer matters: code, architecture, writing, anything where I want it to actually think with me rather than at me.

## ChatGPT picked the reachable answer

ChatGPT's first move was to say the fan should go beside or behind the chair near the desk, because the room is small and circulator fans work best moving air diagonally across a room rather than from a corner. It ruled out the windowsill itself as a permanent spot, since the sill warms up in summer sun and the fan would push warm air around. It asked about the fan's features, and once I mentioned automatic oscillation it moved to a floor position front-left of the chair, slightly away from the bookshelf wall, with the sweep crossing the chair area, which is roughly where I had been planning to put it before I asked.

{{< figure src="chatgpt-fan-answer.png" alt="A playful illustration of a ChatGPT icon beside a desk fan with airflow lines between them" caption="ChatGPT stayed close to the everyday version of the decision: where the fan goes for the person sitting in the room." >}}

## Claude solved a cleaner version of the problem

When I gave Claude the same prompt and photos, its first pick was the windowsill, on the basis of elevation and a clear airflow path across the desk. The summer heat point only came up when I asked about it directly, prompted by what ChatGPT had already raised. From there it worked through a floor-aimed-at-you spot, ruled that out because direct airflow for hours dries out your eyes, then a floor-bouncing-off-a-wall option, ruled that out for weaker whole-room circulation, then landed on the top of the bookcase as a year-round answer.

The bookcase top is technically defensible and also odd, because it is not a place you would put a fan you are going to want to reach to switch off, and the airflow at that height skims above the chair rather than across it.

{{< figure src="claude-fan-answer.png" alt="A playful illustration of a Claude-like orange star beside a desk fan with airflow lines between them" caption="Claude's answer was technically coherent, but it weighted the airflow problem more than the reach-and-use problem." >}}

## The difference was not image recognition

The contrast was not about which model has better vision. Both saw the room and placed the furniture and the fan correctly. The contrast was in what each model was reasoning toward.

{{< figure src="vintage-desk-fan.avif" alt="A close-up of a vintage desk fan in a warmly lit room with shelves in the background" caption="The fan was the simple part. The interesting difference was what each model thought the decision was really about." >}}

ChatGPT seemed to be reasoning about a person who was going to sit in the room and reach for the fan, in the order someone making that decision would actually think about it. Claude was reasoning about airflow in the abstract, finding a spot that satisfied the constraints without much weight on whether you would want to live with the answer. Going in I had expected Claude to handle the spatial side better, since that is the kind of structured problem it usually does well on.

This matches what I have found generally with real-world questions: ChatGPT is often quietly better at them than the benchmarks suggest, and the gap does not show up until you put the same prompt to both. I do not think it is a settled answer about either model, more a reminder that the model that is strongest on the structured problems is not automatically the one you want for the unstructured ones.
