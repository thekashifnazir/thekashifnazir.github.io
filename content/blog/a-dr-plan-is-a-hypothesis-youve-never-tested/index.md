---
title: "A DR Plan Is a Hypothesis You've Never Tested"
date: 2026-05-26
description: "A failed backup story about why disaster recovery plans, fault injection, and restore tests only matter once someone has proved the recovery path works."
images: ["/images/social/social-card-a-dr-plan-is-a-hypothesis-youve-never-tested.png"]
tags: ["aws", "disaster-recovery", "backups", "fault-injection", "resilience"]
categories: ["Operations"]
ShowToc: true
ShowReadingTime: true
draft: false
---

<!--
Image sources:
- tape-drive-error.webp: generated image supplied by Kashif Nazir, 2026-05-26
- recovery-test-blind-spot.svg: original diagram created for this post, 2026-05-26
-->

A few weeks ago, recertifying my AWS Solutions Architect Professional cert for the second time, the course covered [AWS Fault Injection Service](https://docs.aws.amazon.com/fis/latest/userguide/what-is.html), and it made me think about a company where the backups had been failing for a long time and nobody knew.

The backups ran weekly to a server at a remote site, and the tapes were swapped by someone there whose job had nothing to do with infrastructure. Every swap the job had failed and the screen had shown a red line saying so, but the person doing the swapping had no reason to know red meant the backup had not worked. The job ran every week and the light was red every week. Nobody who could read the light was looking at it.

{{< figure src="assets/tape-drive-error.webp" alt="An LTO tape drive in a server rack showing red Drive Error and Tape Error lights with a tape cartridge loaded" caption="The red light is only useful if it reaches someone who knows what it means." width="560" >}}

Nothing like AWS FIS existed when that backup was quietly failing. It lets you inject controlled failures into AWS resources with a defined blast radius and automatic stop conditions, so you can break something deliberately on a quiet afternoon and watch what happens, and it is genuinely easy to use now in a way it would not have been years ago.

When the server actually failed, there was no good tape to restore from. It came down to a fresh build and copying data back off other shares that happened to have enough of it, and it was not the kind of week that leaves you with much faith in the word "backup" as a noun.

The recovery plan had never been run. So the red line that came up every week was not a warning anyone was ignoring, it was a warning nobody in a position to see it could read, sitting on a screen at a remote site in front of a person whose job was swapping tapes. The alert worked exactly as designed and reached someone who had no reason to understand it, which is not negligence, it is a system built so the only person watching was the wrong one. I spend most of my working life on the same failure with old applications, where something runs fine until it meets the one context nobody checked it against and then stops, and you only ever find out on the day it has to work.

None of this would have been caught by fault injection either, and that is the honest limit of the tooling. AWS FIS injects faults into the failover path to see whether the system recovers, but the broken thing here was the backup job itself, sitting upstream of anything an injection test would touch. A flawless chaos experiment against that environment would have proved nothing, because an experiment only proves recovery works if there is something good to recover from, and the one way to know that is to take a tape and actually restore from it and watch. The deliberate-failure part has got dramatically easier. The part where someone decides to pull a tape and prove the restore before they need it has not moved at anything like the same rate.

{{< reveal-svg src="assets/recovery-test-blind-spot.svg" alt="Diagram showing backup creation upstream of fault injection and restore testing as the missing proof point" caption="FIS can prove one half of DR: the response path. A restore test proves the other half: that there is something usable to recover from." >}}

It is an old line and it keeps being right: a disaster recovery procedure does not really exist until you use it, and that is when you find out whether it was ever true. The red line had been on the screen the entire time and the company never knew.
