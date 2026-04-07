---
title: "Watching AI Learn to Play Red Light, Green Light"
date: 2026-04-07
description: "Trying AI Warehouse's Red Light, Green Light simulator and watching reinforcement learning agents shift from chaos to strategy."
images: ["/images/social/social-card-watching-ai-learn-to-play-red-light-green-light.png"]
tags: ["ai", "reinforcement-learning", "simulation"]
categories: ["AI"]
ShowToc: true
ShowReadingTime: true
draft: false
---

I came across [AI Warehouse](https://www.youtube.com/@aiwarehouse) while studying for the AWS AI Practitioner cert through the [Stephanie Maarek course](https://www.udemy.com/course/aws-ai-practitioner-certified/). I lost a few hours on their YouTube channel watching reinforcement learning agents figure out games from scratch, and when I found they had a downloadable Windows simulator I wanted to try it myself. Their [Red Light, Green Light scenario](https://www.youtube.com/watch?v=M8eSyh4YlbI), the one from Squid Games, lets you run different shaped agents through the course and adjust the training parameters to see what changes.

The basic idea with reinforcement learning is that agents are not told how to do something. They are given a goal, a set of possible actions, and feedback on whether what they did worked. Everything else they figure out through repetition. In the Red Light, Green Light scenario, the goal is to cross the finish line without moving during a red light, and the agents start with no knowledge of what that means.

## 500 Runs Of Sprinting Into A Wall

{{< video src="run10.mp4" controls="true" loop="false" caption="Early runs: the agents sprint forward with no awareness of the lights." >}}

For the first few hundred runs I left the brain configuration at 20m and let the agents go. The simulator lets you set this anywhere from 100k up to 100m, and it controls how much experience the agent can draw on when deciding what to do.

{{< figure src="config_brain_20m_2.png" alt="AI Warehouse brain configuration screen showing the range from 100k to 100m with 20m selected" caption="The simulator lets you scale the agent brain config from 100k up to 100m." >}}

The early behaviour was exactly what you would expect: every agent sprinted flat out, ignored the red light completely, and got eliminated. By run 30 a few were lasting slightly longer through pure luck, but the strategy was identical. Run and hope.

{{< video src="run50v2.mp4" autoplay="false" controls="true" loop="false" caption="The person-shaped agent never learns to walk properly and instead inches forward by bashing itself along the floor." >}}

Walking turns out to be genuinely hard to learn through reinforcement learning, so the person-shaped agent never figured it out. Instead it developed a technique of bashing itself against the floor, sort of crawling by repeatedly smacking into the ground and inching forward. By run 2050 it was getting further using this method and bashing harder, which suggested the agent was refining the approach even though it looked absurd. The four-legged agent had an easier time with locomotion but was surviving red lights mostly by accident, moving slowly enough between lights that it scraped through rather than making a conscious decision to stop.

{{< video src="run50v3.mp4" autoplay="false" controls="true" loop="false" caption="The four-legged agent survives red lights mostly by accident rather than by making a deliberate stop." >}}

After 500 runs with the 20m brain config, a handful of agents could occasionally survive one red light but none had completed the course on camera. The app has a counter that tracks completions, and I could see the yellow horse standing at the end of the course, so at least one had made it while I was not recording.

## One Parameter Change, Immediate Results

{{< video src="run500v1_M_Increase.mp4" autoplay="false" controls="true" loop="false" caption="At 500 runs, changing the brain config changes the behaviour immediately: the agents start waiting during red lights." >}}

At run 500 I changed the brain configuration from 20m to 100m. The behaviour changed on the next run. Not gradually over 50 more runs. Immediately. Every agent went from sprinting and hoping to waiting during red lights and moving during green.

{{< figure src="config_brain_100m_1.png" alt="AI Warehouse brain configuration screen showing 100m selected" caption="The shift from 20m to 100m changed behaviour on the very next run." >}}

The 20m and 100m values do not control how many training runs the agent does or how long it trains for. They control the scale of experience the agent draws on when making each decision. With 20m, the agents were essentially short-sighted, reacting to whatever was directly in front of them with a small pool of experience to reference. With 100m, they had access to a much larger pool of accumulated patterns from their training. The effect is that the agent shifts from reactive behaviour, see green light, run, to conservative, pattern-based behaviour: I know from experience that a red light is coming, so I should be ready to stop.

That distinction between reactive and strategic is exactly the difference between sprinting into elimination and waiting for the right moment to move, and it happened in a single parameter change rather than requiring hundreds more runs.

{{< video src="Run500v2_M_Increase_Success.mp4" autoplay="false" controls="true" loop="false" caption="With the larger brain config, the blue four-legged agent completes the course." >}}

Within a few more runs the four-legged blue agent completed the full course, waiting through red lights and moving when it could. The purple spider managed it too, and its approach was to wait patiently through every light and then leap onto the finish line at the end.

{{< video src="run500v3_M_Increase_Success.mp4" autoplay="false" controls="true" loop="false" caption="The purple spider waits through the lights and then launches itself across the finish." >}}

All the agents were performing dramatically better by this point. The pink one looked close to succeeding but would need more runs. The combination of accumulated training and a brain config large enough to actually use that training was what made it work. Runs alone were not enough with a small brain config because the agent could not draw on enough experience to behave strategically. A large brain config alone would not have helped either because the agent needs something to have learned from.

## Capacity Before Experience Is Useless

I expected a bigger brain config to mean slower progress, like expanding a container that takes longer to fill. The experience was already there from 500 runs of failing, the agents just could not draw on enough of it to behave differently until the capacity increased. Reinforcement learning and large language model training are different mechanisms, but the same tension keeps showing up: you need enough capacity to make learned experience usable. With LLMs, that is why initial training requires so much compute. The patterns have to be earned at scale first, and once they exist you can distill them into something smaller, but that initial capacity is what makes the learning worth anything.

If you want to try the simulator yourself, [AI Warehouse](https://aiwarehouse.dev/) has it available for Windows. It is a good way to spend an afternoon if you are curious about what reinforcement learning looks like when you can actually watch it happen.
