---
title: "Microsoft's New Outlook Took Two Years to Get Colour Categories Back"
date: 2026-04-28
description: "A small missing calendar rule in new Outlook shows the hidden cost of migrating users before the new client can carry their workflows."
images: ["/images/social/social-card-microsoft-s-new-outlook-took-two-years-to-get-colour-categories-back.png"]
tags: ["microsoft", "outlook", "migration", "productivity", "enterprise-it"]
categories: ["Migration"]
ShowToc: true
ShowReadingTime: true
draft: false
---

I avoided the new Outlook for over a year before eventually giving in, and the feature that kept me on the old version wasn't anything complicated. In a previous role where my calendar was packed with recurring internal meetings and customer calls, I had a rule in classic Outlook that automatically colour-coded any meeting I created as purple, so I could see at a glance which ones I could move and which were fixed. When I switched, that rule was gone.

{{< figure src="unsplash-calendar-laptop.jpg" alt="Outlook calendar open on a laptop screen" caption="The missing feature was small, but it carried a real workflow: knowing at a glance which meetings were moveable." >}}

## The web-wrapper trade-off

[Microsoft describes](https://learn.microsoft.com/en-us/microsoft-365-apps/outlook/overview-new-outlook-windows) the new Outlook for Windows as being inspired by the Outlook web experience, running through a Native Windows Integration Component and WebView2. That makes sense from their side. It cuts down what they need to maintain across platforms and makes it easier to ship the same codebase to Windows, Mac, and web at the same time.

{{< figure src="outlook-icon-2025.png#center" alt="Microsoft Outlook app icon" caption="The Outlook icon stayed familiar, but the client underneath changed substantially." width="220" >}}

The consequence was that features which had existed in classic Outlook for years simply weren't there. Not because anyone had decided those features were pointless, but because the new architecture couldn't carry them yet and Microsoft had shipped anyway. Automated colour rules for the calendar fell into that category, along with proper offline support and PST handling.

## The gap arrives after the switch

When I moved to a Mac last year the choice was made for me, since Mac users only get the new client. Calendar conditional formatting, the feature that covers exactly the kind of rule I used to have, is still listed as upcoming in Microsoft's [feature comparison between new and classic Outlook](https://support.microsoft.com/en-us/office/feature-comparison-between-new-outlook-and-classic-outlook-de453583-1e76-48bf-975a-2e9cd2ee16dd), while [roadmap item 529849](https://www.microsoft.com/en-us/microsoft-365/roadmap?id=529849) puts it in the April 2026 window and the Windows release notes show related conditional-formatting options moving forward in the [17 April 2026 update](https://learn.microsoft.com/en-us/officeupdates/release-notes-outlook-new).

That is roughly two years after the push to get users off the classic client started in earnest, for a feature that existed in 2019, with no confirmed date for Mac parity.

Microsoft pushing the opt-out phase back from April 2026 to March 2027 is explained officially as part of readiness, feedback, and adoption, and Microsoft's own [migration-stage documentation](https://learn.microsoft.com/en-us/microsoft-365-apps/outlook/get-started/guide-product-availability) says the opt-out phase follows feature capability development and quality assessment. But the feature comparison documentation tells a more honest story. The new version still doesn't do what the old one did, and the gap turned out to be wider than the rollout assumed. The organisations holding back aren't being awkward. They built workflows on top of capabilities that disappeared.

{{< figure src="migration-gap-calendar.jpg" alt="Person in a meeting room looking at a generic calendar grid with a missing highlighted category slot" caption="Feature gaps rarely announce themselves during the migration plan. They show up later, inside someone's normal working day." >}}

## The hidden cost

The application gets declared migrated, the user is on the new platform, and then somewhere between week two and month six it becomes apparent that things they relied on aren't there. Sometimes those things are documented gaps the project team deprioritised, and sometimes nobody inventoried them in the first place because they looked like default application behaviour rather than custom workflow.

Automated calendar rules look like default behaviour until the person relying on them has to manually work out which meetings are moveable, and the time that takes is the hidden cost nobody put in the migration plan.

{{< figure src="calendar-rule-workflow.jpg" alt="Laptop showing a generic colour-coded calendar beside a notebook with hand-drawn category rules" caption="The rule itself was simple. The value was in removing a small decision from every calendar review." >}}

The new Outlook client is genuinely different in architecture, and that comes with real constraints on which classic features can be rebuilt and on what timeline. Microsoft was clear enough about this in the feature comparison documentation, but shipping a product with a known gap list and calling it the migration target puts the cost of that gap on the user.

Calendar conditional formatting reached the April 2026 Windows release window, two years after the migration push started, for a feature that existed in 2019, with no confirmed date for Mac. From what I've seen in enterprise migrations, that's usually where the trust goes.
