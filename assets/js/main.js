import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin, DrawSVGPlugin);

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ============================================
// Lenis smooth scrolling
// ============================================
let lenis;
if (!prefersReducedMotion) {
  lenis = new Lenis({
    duration: 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    touchMultiplier: 2,
  });

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

// ============================================
// Circuit Spine — PCB trace connecting sections
// ============================================
function initCircuit() {
  const svg = document.querySelector('.circuit-svg');
  const mainEl = document.querySelector('.main');
  if (!svg || !mainEl) return;

  const nodes = document.querySelectorAll('[data-circuit-node]');
  if (nodes.length < 2) return;

  const SVG_NS = 'http://www.w3.org/2000/svg';

  // Measure node positions relative to .main
  function getNodeCenter(node, index) {
    const mainRect = mainEl.getBoundingClientRect();
    const nodeRect = node.getBoundingClientRect();
    // First node (hero) sits slightly below center to clear the headline
    const yRatio = index === 0 ? 0.48 : 0.5;
    const xRatio = index === 0 ? 0.065 : 0.08;
    return {
      x: nodeRect.left - mainRect.left + nodeRect.width * xRatio,
      y: nodeRect.top - mainRect.top + nodeRect.height * yRatio,
    };
  }

  function buildPath() {
    const mainRect = mainEl.getBoundingClientRect();
    const W = mainRect.width;
    const H = mainEl.scrollHeight;

    svg.setAttribute('width', W);
    svg.setAttribute('height', H);
    svg.style.width = W + 'px';
    svg.style.height = H + 'px';

    const points = [];
    nodes.forEach((node, i) => points.push(getNodeCenter(node, i)));

    const startY = Math.max(0, points[0].y - 160);
    const endY = points[points.length - 1].y + 160;
    const vias = [];

    // Entry — small horizontal jog before first node
    const entryX = points[0].x + 70;
    let d = `M ${entryX} ${startY}`;
    const entryTurnY = startY + 50;
    d += ` L ${entryX} ${entryTurnY}`;
    d += ` L ${points[0].x} ${entryTurnY}`;
    d += ` L ${points[0].x} ${points[0].y}`;
    vias.push({ x: entryX, y: entryTurnY }, { x: points[0].x, y: entryTurnY });

    // Route between consecutive nodes with alternating patterns
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const gap = p1.y - p0.y;

      if (i % 2 === 0) {
        // Pattern A — wide right sweep across the page
        const sweepX = Math.min(W - 60, p0.x + W * 0.48);

        // Drop below node
        const y1 = p0.y + gap * 0.12;
        d += ` L ${p0.x} ${y1}`;
        vias.push({ x: p0.x, y: y1 });

        // Sweep right
        d += ` L ${sweepX} ${y1}`;
        vias.push({ x: sweepX, y: y1 });

        // Run down the right side
        const y2 = p0.y + gap * 0.48;
        d += ` L ${sweepX} ${y2}`;
        vias.push({ x: sweepX, y: y2 });

        // PCB dogleg — small jog right and back
        const dogX = sweepX + 35;
        d += ` L ${dogX} ${y2}`;
        const y2b = y2 + 55;
        d += ` L ${dogX} ${y2b}`;
        d += ` L ${sweepX} ${y2b}`;
        vias.push({ x: dogX, y: y2 }, { x: dogX, y: y2b }, { x: sweepX, y: y2b });

        // Continue down
        const y3 = p0.y + gap * 0.78;
        d += ` L ${sweepX} ${y3}`;
        vias.push({ x: sweepX, y: y3 });

        // Return left to next node
        d += ` L ${p1.x} ${y3}`;
        vias.push({ x: p1.x, y: y3 });

        // Arrive at node
        d += ` L ${p1.x} ${p1.y}`;

      } else {
        // Pattern B — left offset then right return
        const leftX = Math.max(40, p0.x - 90);
        const rightX = Math.min(W - 60, p0.x + W * 0.28);

        // Drop below node
        const y1 = p0.y + gap * 0.1;
        d += ` L ${p0.x} ${y1}`;
        vias.push({ x: p0.x, y: y1 });

        // Jog left
        d += ` L ${leftX} ${y1}`;
        vias.push({ x: leftX, y: y1 });

        // Run down the left side
        const y2 = p0.y + gap * 0.32;
        d += ` L ${leftX} ${y2}`;
        vias.push({ x: leftX, y: y2 });

        // Sweep right across
        d += ` L ${rightX} ${y2}`;
        vias.push({ x: rightX, y: y2 });

        // Run down the right side
        const y3 = p0.y + gap * 0.68;
        d += ` L ${rightX} ${y3}`;
        vias.push({ x: rightX, y: y3 });

        // Return to next node x
        d += ` L ${p1.x} ${y3}`;
        vias.push({ x: p1.x, y: y3 });

        // Arrive at node
        d += ` L ${p1.x} ${p1.y}`;
      }
    }

    // Exit tail — small routing after last node
    const last = points[points.length - 1];
    const exitX = Math.min(W - 60, last.x + 100);
    const ey1 = last.y + 60;
    const ey2 = last.y + 120;
    d += ` L ${last.x} ${ey1}`;
    d += ` L ${exitX} ${ey1}`;
    d += ` L ${exitX} ${ey2}`;
    d += ` L ${last.x} ${ey2}`;
    d += ` L ${last.x} ${endY}`;
    vias.push(
      { x: last.x, y: ey1 }, { x: exitX, y: ey1 },
      { x: exitX, y: ey2 }, { x: last.x, y: ey2 }
    );

    renderVias(vias);
    renderStubs(points, W);

    return d;
  }

  // Via pads — small circles at each PCB direction change
  function renderVias(positions) {
    // Remove old vias
    svg.querySelectorAll('.circuit-via').forEach((el) => el.remove());

    const g = document.createElementNS(SVG_NS, 'g');
    g.classList.add('circuit-vias');

    positions.forEach((pt) => {
      const c = document.createElementNS(SVG_NS, 'circle');
      c.classList.add('circuit-via');
      c.setAttribute('cx', pt.x);
      c.setAttribute('cy', pt.y);
      c.setAttribute('r', '2.5');
      g.appendChild(c);
    });

    // Remove old group and insert before nodes
    svg.querySelectorAll('.circuit-vias').forEach((el) => el.remove());
    const firstNode = svg.querySelector('.circuit-node');
    if (firstNode) {
      svg.insertBefore(g, firstNode);
    } else {
      svg.appendChild(g);
    }
  }

  // Stubs — short dead-end branches (test points) for PCB texture
  function renderStubs(points, W) {
    svg.querySelectorAll('.circuit-stubs').forEach((el) => el.remove());

    const g = document.createElementNS(SVG_NS, 'g');
    g.classList.add('circuit-stubs');

    const stubs = [];

    if (points.length > 1) {
      const p0 = points[0];
      const gap01 = points[1].y - p0.y;
      const sweepX = Math.min(W - 60, p0.x + W * 0.48);

      // Stub 1: horizontal test point branching left from the entry line
      const stubY1 = p0.y + gap01 * 0.3;
      stubs.push(`M ${sweepX} ${stubY1} L ${sweepX + 45} ${stubY1}`);

      // Stub 2: short vertical branch near the dogleg
      const stubY2 = p0.y + gap01 * 0.62;
      stubs.push(`M ${sweepX} ${stubY2} L ${sweepX} ${stubY2 - 35}`);
    }

    if (points.length > 2) {
      const p1 = points[1];
      const gap12 = points[2].y - p1.y;
      const leftX = Math.max(40, p1.x - 90);

      // Stub 3: short horizontal branch from the left run
      const stubY3 = p1.y + gap12 * 0.2;
      stubs.push(`M ${leftX} ${stubY3} L ${leftX - 40} ${stubY3}`);
    }

    stubs.forEach((d) => {
      const path = document.createElementNS(SVG_NS, 'path');
      path.classList.add('circuit-stub');
      path.setAttribute('d', d);
      g.appendChild(path);

      // Pad at end of each stub
      const parts = d.split(' ');
      const endX = parseFloat(parts[parts.length - 2]);
      const endY = parseFloat(parts[parts.length - 1]);
      const pad = document.createElementNS(SVG_NS, 'circle');
      pad.classList.add('circuit-stub-pad');
      pad.setAttribute('cx', endX);
      pad.setAttribute('cy', endY);
      pad.setAttribute('r', '3');
      g.appendChild(pad);
    });

    const firstNode = svg.querySelector('.circuit-node');
    if (firstNode) {
      svg.insertBefore(g, firstNode);
    } else {
      svg.appendChild(g);
    }
  }

  function positionNodes() {
    const points = [];
    nodes.forEach((node, i) => points.push(getNodeCenter(node, i)));

    const nodeEls = svg.querySelectorAll('.circuit-node');
    nodeEls.forEach((el, i) => {
      if (points[i]) {
        const pt = points[i];
        el.querySelector('circle').setAttribute('cx', pt.x);
        el.querySelector('circle').setAttribute('cy', pt.y);
        const label = el.querySelector('.circuit-node__label');
        label.setAttribute('x', pt.x - 16);
        label.setAttribute('y', pt.y);
      }
    });
  }

  function render() {
    const d = buildPath();
    const bgTrace = svg.querySelector('.circuit-trace--bg');
    const fillTrace = svg.querySelector('.circuit-trace--fill');
    bgTrace.setAttribute('d', d);
    fillTrace.setAttribute('d', d);
    positionNodes();
    return d;
  }

  render();

  if (prefersReducedMotion) return;

  const fillTrace = svg.querySelector('.circuit-trace--fill');
  const packet = svg.querySelector('.circuit-packet');

  gsap.fromTo(fillTrace,
    { drawSVG: '0%' },
    {
      drawSVG: '100%',
      ease: 'none',
      scrollTrigger: {
        trigger: mainEl,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.3,
      },
    }
  );

  gsap.set(packet, { opacity: 1 });
  gsap.to(packet, {
    motionPath: {
      path: fillTrace,
      align: fillTrace,
      alignOrigin: [0.5, 0.5],
    },
    ease: 'none',
    scrollTrigger: {
      trigger: mainEl,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.3,
    },
  });

  // Activate nodes when packet reaches them — powers the section
  const nodeEls = svg.querySelectorAll('.circuit-node');
  nodes.forEach((section, i) => {
    ScrollTrigger.create({
      trigger: section,
      start: 'top 60%',
      onEnter: () => {
        if (nodeEls[i]) nodeEls[i].classList.add('is-active');
        section.classList.add('is-powered');
      },
      onLeaveBack: () => {
        if (nodeEls[i]) nodeEls[i].classList.remove('is-active');
        section.classList.remove('is-powered');
      },
    });
  });

  // Recalculate on resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      render();
      ScrollTrigger.refresh();
    }, 200);
  });
}

// ============================================
// Hero entrance
// ============================================
function initHero() {
  if (prefersReducedMotion) return;

  const heroName = document.querySelector('.hero-name');
  const heroRole = document.querySelector('.hero-role');
  const heroLede = document.querySelector('.hero-lede');
  const heroCta = document.querySelector('.hero .hero-cta');
  const heroPortrait = document.querySelector('.hero-portrait');

  if (!heroName) return;

  const els = [heroName, heroRole, heroLede, heroCta].filter(Boolean);
  els.forEach(el => { el.style.opacity = '0'; el.style.transform = 'translateY(20px)'; });

  if (heroPortrait) {
    heroPortrait.style.opacity = '0';
    heroPortrait.style.transform = 'translateY(24px)';
  }

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.to(heroName,     { opacity: 1, y: 0, duration: 0.8 }, 0.1)
    .to(heroRole,     { opacity: 1, y: 0, duration: 0.5 }, 0.5)
    .to(heroLede,     { opacity: 1, y: 0, duration: 0.5 }, 0.7)
    .to(heroCta,      { opacity: 1, y: 0, duration: 0.4 }, 0.9);

  if (heroPortrait) {
    tl.to(heroPortrait, { opacity: 1, y: 0, duration: 0.7 }, 0.3);
  }

  // Parallax on scroll
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    gsap.to(heroContent, {
      y: -60, opacity: 0, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
    });
  }
}

// ============================================
// Navigation — entrance + scroll-linked + mobile menu
// ============================================
function initNav() {
  const header = document.querySelector('.header');
  if (!header) return;

  // Only animate the header entrance if the loader is already done (repeat visits).
  // On first visit, CSS handles the reveal after the loader finishes — running
  // gsap.from here would capture opacity:0 as the "to" value, blocking the reveal.
  if (!prefersReducedMotion && document.body.classList.contains('loader-done')) {
    gsap.from(header, { y: -20, opacity: 0, duration: 0.4, ease: 'power4.out' });
  }

  // Scroll-linked: add .is-scrolled class after 80px
  const onScroll = () => {
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    header.classList.toggle('is-scrolled', scrollY > 80);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile hamburger toggle
  const toggle = document.querySelector('.nav-toggle');
  const overlay = document.querySelector('.nav-overlay');
  if (!toggle || !overlay) return;

  function closeMenu() {
    toggle.classList.remove('is-open');
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    toggle.setAttribute('aria-expanded', 'false');
  }

  toggle.addEventListener('click', () => {
    const isOpen = toggle.classList.toggle('is-open');
    overlay.classList.toggle('is-open', isOpen);
    overlay.setAttribute('aria-hidden', !isOpen);
    toggle.setAttribute('aria-expanded', isOpen);
  });

  // Close dropdown when a link is clicked
  overlay.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !overlay.contains(e.target)) {
      closeMenu();
    }
  });
}

// ============================================
// Section reveals — powered by circuit activation
// ============================================
function initSectionReveals() {
  const hero = document.querySelector('.hero');
  if (hero) hero.classList.add('is-powered');
}

// ============================================
// Inner page reveals
// ============================================
function initInnerPages() {
  if (prefersReducedMotion) return;

  const pageHeader = document.querySelector('.page-header');
  if (pageHeader) gsap.from(pageHeader, { opacity: 0, y: 20, duration: 0.5, ease: 'power3.out', delay: 0.1 });

  const postHeader = document.querySelector('.post-header');
  if (postHeader) gsap.from(postHeader, { opacity: 0, y: 20, duration: 0.5, ease: 'power3.out', delay: 0.1 });

  const postContentEl = document.querySelector('.post-content');
  if (postContentEl) gsap.from(postContentEl, { opacity: 0, y: 16, duration: 0.5, ease: 'power3.out', delay: 0.25 });

  gsap.utils.toArray('.post-entry').forEach((entry, i) => {
    gsap.from(entry, {
      opacity: 0, y: 20, duration: 0.4, delay: i * 0.07, ease: 'power3.out',
      scrollTrigger: { trigger: entry, start: 'top 90%', once: true },
    });
  });

  // Blog grid cards
  gsap.utils.toArray('.blog-card').forEach((card, i) => {
    gsap.from(card, {
      opacity: 0, y: 20, duration: 0.4, delay: i * 0.06, ease: 'power3.out',
      scrollTrigger: { trigger: card, start: 'top 90%', once: true },
    });
  });

  // Project grid cards
  gsap.utils.toArray('.project-card').forEach((card, i) => {
    gsap.from(card, {
      opacity: 0, y: 20, duration: 0.4, delay: i * 0.06, ease: 'power3.out',
      scrollTrigger: { trigger: card, start: 'top 90%', once: true },
    });
  });

  // Mobile: scroll-driven motion effects
  const isMobile = window.innerWidth <= 768;
  if (isMobile) {
    // 1. Heading clip-path wipe reveals (left-to-right sweep)
    gsap.utils.toArray('.writing-title, .beyond-heading').forEach(el => {
      gsap.set(el, { clipPath: 'inset(0 100% 0 0)', opacity: 1 });
      ScrollTrigger.create({
        trigger: el, start: 'top 88%', once: true,
        onEnter: () => gsap.to(el, { clipPath: 'inset(0 0% 0 0)', duration: 0.6, ease: 'power3.inOut' }),
      });
    });

    // 2. Writing cards — alternating slide directions (odd left, even right)
    gsap.utils.toArray('.writing-card').forEach((card, i) => {
      const xDir = i % 2 === 0 ? -30 : 30;
      gsap.set(card, { opacity: 0, x: xDir });
      ScrollTrigger.create({
        trigger: card, start: 'top 88%', once: true,
        onEnter: () => gsap.to(card, { opacity: 1, x: 0, duration: 0.5, ease: 'power3.out' }),
      });
    });

    // 3. Beyond items — fade up with top-border draw (staggered)
    const beyondContainer = document.querySelector('.beyond-items');
    if (beyondContainer) {
      const items = gsap.utils.toArray('.beyond-item');
      items.forEach(item => {
        gsap.set(item, { opacity: 0, y: 16 });
      });
      ScrollTrigger.create({
        trigger: beyondContainer, start: 'top 88%', once: true,
        onEnter: () => {
          items.forEach((item, i) => {
            gsap.to(item, {
              opacity: 1, y: 0, duration: 0.5, delay: i * 0.12, ease: 'power3.out',
            });
            gsap.to(item, {
              borderTopColor: 'var(--accent)', duration: 0.6, delay: i * 0.12, ease: 'power2.out',
            });
          });
        },
      });
    }

    // 5. Hero role text — subtle parallax (moves slower than surroundings)
    const heroRole = document.querySelector('.hero-role');
    if (heroRole) {
      gsap.to(heroRole, {
        y: -15, ease: 'none',
        scrollTrigger: {
          trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true,
        },
      });
    }

    // 6. Card corner traces — L-shaped PCB corners that appear on scroll
    gsap.utils.toArray('.blog-card, .project-card').forEach(card => {
      // Add via pad element
      const via = document.createElement('div');
      via.classList.add('card-corner-via');
      card.appendChild(via);

      ScrollTrigger.create({
        trigger: card,
        start: 'top 85%',
        once: true,
        onEnter: () => card.classList.add('is-traced'),
      });
    });
  }
}

// ============================================
// Mobile spine — vertical thread connecting sections
// ============================================
function initMobileSpine() {
  if (window.innerWidth > 768) return;

  // Only show on homepage (sections with data-circuit-node)
  const sections = document.querySelectorAll('[data-circuit-node]');
  if (sections.length === 0) return;

  // Build the spine DOM
  const spine = document.createElement('div');
  spine.classList.add('mobile-spine');
  spine.setAttribute('aria-hidden', 'true');

  const track = document.createElement('div');
  track.classList.add('mobile-spine__track');
  spine.appendChild(track);

  const fill = document.createElement('div');
  fill.classList.add('mobile-spine__fill');
  spine.appendChild(fill);

  // Create nodes for each section
  const nodeLabels = { origin: 'Origin', output: 'Output', signal: 'Signal' };
  const nodes = [];

  sections.forEach(section => {
    const nodeId = section.getAttribute('data-circuit-node');
    const node = document.createElement('div');
    node.classList.add('mobile-spine__node');
    node.dataset.node = nodeId;

    const label = document.createElement('span');
    label.classList.add('mobile-spine__label');
    label.textContent = nodeLabels[nodeId] || nodeId;
    node.appendChild(label);

    spine.appendChild(node);
    nodes.push({ el: node, section });
  });

  document.body.appendChild(spine);

  if (prefersReducedMotion) return;

  // Space nodes evenly within the viewport (20% → 80%)
  const count = nodes.length;
  nodes.forEach(({ el }, i) => {
    const pct = 20 + (i / (count - 1)) * 60;
    el.style.top = pct + '%';
  });

  // Scroll-driven fill height
  gsap.to(fill, {
    height: '100%',
    ease: 'none',
    scrollTrigger: {
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
    },
  });

  // Node activation — appear and light up as you reach each section
  nodes.forEach(({ el, section }) => {
    // Appear when section is near
    ScrollTrigger.create({
      trigger: section,
      start: 'top 95%',
      once: true,
      onEnter: () => el.classList.add('is-visible'),
    });

    // Activate when section enters viewport
    const nodeId = section.getAttribute('data-circuit-node');
    const activateStart = nodeId === 'signal' ? 'top 85%'
                        : nodeId === 'output' ? 'top 40%'
                        : 'top 60%';
    const label = el.querySelector('.mobile-spine__label');

    function flashLabel() {
      if (!label) return;
      gsap.killTweensOf(label);
      gsap.to(label, { opacity: 1, duration: 0.3, ease: 'power2.out' });
      gsap.to(label, { opacity: 0, duration: 0.4, ease: 'power2.in', delay: 1.2 });
    }

    ScrollTrigger.create({
      trigger: section,
      start: activateStart,
      end: 'bottom 40%',
      onEnter: () => { el.classList.add('is-active'); flashLabel(); },
      onLeave: () => el.classList.remove('is-active'),
      onEnterBack: () => { el.classList.add('is-active'); flashLabel(); },
      onLeaveBack: () => el.classList.remove('is-active'),
    });
  });
}

// ============================================
// Inner page mobile spine — node markers for non-homepage pages
// ============================================
function initInnerMobileSpine() {
  if (window.innerWidth > 768) return;
  if (prefersReducedMotion) return;

  // Skip homepage (has its own mobile spine)
  if (document.querySelectorAll('[data-circuit-node]').length > 0) return;

  // Gather landmarks based on page type
  let landmarks = [];

  // Blog single: header, each h2, footer
  const postHeader = document.querySelector('.editorial-post .post-header');
  if (postHeader) {
    landmarks.push(postHeader);
    document.querySelectorAll('.post-content h2').forEach(h => landmarks.push(h));
    const postFooter = document.querySelector('.editorial-post .post-footer');
    if (postFooter) landmarks.push(postFooter);
  }

  // List pages: page header, each card
  const pageHeader = document.querySelector('.page-header');
  if (pageHeader && !postHeader) {
    landmarks.push(pageHeader);
    document.querySelectorAll('.blog-card, .project-card').forEach(c => landmarks.push(c));
  }

  // About page
  const aboutHero = document.querySelector('.about-hero');
  if (aboutHero) {
    landmarks.push(aboutHero);
    document.querySelectorAll('.about-body h2, .about-section').forEach(s => landmarks.push(s));
    const connectSection = document.querySelector('.about-connect');
    if (connectSection) landmarks.push(connectSection);
  }

  if (landmarks.length < 2) return;

  // Build spine DOM
  const spine = document.createElement('div');
  spine.classList.add('mobile-spine', 'mobile-spine--inner');
  spine.setAttribute('aria-hidden', 'true');

  const track = document.createElement('div');
  track.classList.add('mobile-spine__track');
  spine.appendChild(track);

  const fill = document.createElement('div');
  fill.classList.add('mobile-spine__fill');
  spine.appendChild(fill);

  // Create nodes (no labels — just dots)
  const nodes = [];
  landmarks.forEach(section => {
    const node = document.createElement('div');
    node.classList.add('mobile-spine__node');
    spine.appendChild(node);
    nodes.push({ el: node, section });
  });

  document.body.appendChild(spine);

  // Scroll-driven fill
  gsap.to(fill, {
    height: '100%',
    ease: 'none',
    scrollTrigger: {
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
    },
  });

  // Position nodes based on their section's position in the document
  function positionNodes() {
    const docHeight = document.documentElement.scrollHeight;
    nodes.forEach(({ el, section }) => {
      const rect = section.getBoundingClientRect();
      const absTop = rect.top + window.scrollY;
      const pct = (absTop / docHeight) * 100;
      el.style.top = Math.min(Math.max(pct, 5), 95) + '%';
    });
  }
  positionNodes();

  // Node activation
  nodes.forEach(({ el, section }) => {
    ScrollTrigger.create({
      trigger: section,
      start: 'top 90%',
      once: true,
      onEnter: () => el.classList.add('is-visible'),
    });

    ScrollTrigger.create({
      trigger: section,
      start: 'top 60%',
      end: 'bottom 40%',
      onEnter: () => el.classList.add('is-active'),
      onLeave: () => el.classList.remove('is-active'),
      onEnterBack: () => el.classList.add('is-active'),
      onLeaveBack: () => el.classList.remove('is-active'),
    });
  });
}

// ============================================
// Reading progress bar (blog posts)
// ============================================
function initReadingProgress() {
  const article = document.querySelector('.editorial-post') || document.querySelector('.post-content');
  if (!article || prefersReducedMotion) return;

  const bar = document.createElement('div');
  bar.classList.add('reading-progress');
  document.body.prepend(bar);
  gsap.to(bar, {
    width: '100%', ease: 'none',
    scrollTrigger: { trigger: article, start: 'top top', end: 'bottom bottom', scrub: true },
  });
}

// ============================================
// Page transitions
// ============================================
function initTransitions() {
  if (prefersReducedMotion) return;

  const mainEl = document.querySelector('.main');
  if (!mainEl) return;

  // Only intercept internal same-origin links
  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a');
    if (!anchor) return;

    const href = anchor.getAttribute('href');
    if (!href) return;

    // Skip external links, hash links, new tab links
    if (anchor.target === '_blank') return;
    if (href.startsWith('#')) return;
    if (href.startsWith('mailto:')) return;
    if (href.startsWith('http') && !href.startsWith(window.location.origin)) return;

    e.preventDefault();

    // Use View Transitions API if available
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        window.location.href = href;
      });
    } else {
      // Fallback: fade out, navigate
      mainEl.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
      mainEl.style.opacity = '0';
      mainEl.style.transform = 'translateY(8px)';
      setTimeout(() => {
        window.location.href = href;
      }, 200);
    }
  });
}

// ============================================
// Loader — monogram draw on first visit
// ============================================
function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) {
    // Loader was removed by inline script (repeat visit or reduced motion)
    document.body.classList.add('loader-done');
    return;
  }

  // After animations finish (draw 0.7s + text 0.35s + pause), dismiss
  setTimeout(() => {
    loader.classList.add('is-done');
    document.body.classList.add('loader-done');
    sessionStorage.setItem('kn-loaded', '1');

    // Remove from DOM after fade-out transition
    setTimeout(() => loader.remove(), 500);
  }, 1300);
}

// ============================================
// Inner page circuit traces — PCB lines routing
// around the page like a real circuit board
// ============================================
function initInnerCircuit() {
  // Skip homepage (has its own circuit spine) and mobile
  if (document.querySelector('.hero')) return;
  if (window.innerWidth <= 768) return;

  const mainEl = document.querySelector('.main');
  if (!mainEl) return;

  const SVG_NS = 'http://www.w3.org/2000/svg';

  // Find content boxes to route through
  const cards = Array.from(mainEl.querySelectorAll(
    '.blog-card, .project-card, .writing-card'
  ));
  // For pages with cards, also include the page header and grid as landmarks
  const listSections = Array.from(mainEl.querySelectorAll(
    '.page-header, .blog-grid, .project-grid'
  ));
  const singleSections = Array.from(mainEl.querySelectorAll(
    '.page-header, .about-hero, .about-body, .editorial-post .post-header, .editorial-post__body'
  ));
  // Use card-based routing when we have cards, section-based otherwise
  const isCardGrid = cards.length >= 1;
  const targets = isCardGrid
    ? (cards.length >= 2 ? cards : listSections)
    : singleSections;
  if (targets.length < 2) return;

  // Create SVG container
  const wrapper = document.createElement('div');
  wrapper.classList.add('inner-circuit');
  wrapper.setAttribute('aria-hidden', 'true');
  mainEl.style.position = 'relative';
  mainEl.prepend(wrapper);

  const svg = document.createElementNS(SVG_NS, 'svg');
  wrapper.appendChild(svg);

  function getBox(el) {
    const mainRect = mainEl.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    return {
      x: r.left - mainRect.left,
      y: r.top - mainRect.top,
      right: r.left - mainRect.left + r.width,
      bottom: r.top - mainRect.top + r.height,
      width: r.width,
      height: r.height,
    };
  }

  // Group cards into rows by similar y-position
  function groupIntoRows(boxes) {
    if (boxes.length === 0) return [];
    const rows = [];
    let currentRow = [boxes[0]];
    for (let i = 1; i < boxes.length; i++) {
      if (Math.abs(boxes[i].y - currentRow[0].y) < 40) {
        currentRow.push(boxes[i]);
      } else {
        rows.push(currentRow);
        currentRow = [boxes[i]];
      }
    }
    rows.push(currentRow);
    return rows;
  }

  // Track rendered fill traces and packets for animation
  const animPaths = [];

  function renderPath(d, vias, stubs) {
    // Background trace (static)
    const trace = document.createElementNS(SVG_NS, 'path');
    trace.classList.add('inner-circuit__trace');
    trace.setAttribute('d', d);
    svg.appendChild(trace);

    // Fill trace (animated via DrawSVG)
    const fillTrace = document.createElementNS(SVG_NS, 'path');
    fillTrace.classList.add('inner-circuit__trace', 'inner-circuit__trace--fill');
    fillTrace.setAttribute('d', d);
    svg.appendChild(fillTrace);

    // Packet
    const packet = document.createElementNS(SVG_NS, 'circle');
    packet.classList.add('inner-circuit__packet');
    packet.setAttribute('r', '4');
    svg.appendChild(packet);

    animPaths.push({ fillTrace, packet });

    // Stubs
    stubs.forEach(s => {
      const stub = document.createElementNS(SVG_NS, 'path');
      stub.classList.add('inner-circuit__stub');
      stub.setAttribute('d', s.d);
      svg.appendChild(stub);

      const pad = document.createElementNS(SVG_NS, 'circle');
      pad.classList.add('inner-circuit__stub-pad');
      pad.setAttribute('cx', s.ex);
      pad.setAttribute('cy', s.ey);
      pad.setAttribute('r', '3');
      svg.appendChild(pad);
    });

    // Vias
    vias.forEach(pt => {
      const c = document.createElementNS(SVG_NS, 'circle');
      c.classList.add('inner-circuit__via');
      c.setAttribute('cx', pt.x);
      c.setAttribute('cy', pt.y);
      c.setAttribute('r', '2.5');
      svg.appendChild(c);
    });
  }

  function render() {
    while (svg.firstChild) svg.removeChild(svg.firstChild);

    const mainRect = mainEl.getBoundingClientRect();
    const W = mainRect.width;
    const H = mainEl.scrollHeight;
    svg.setAttribute('width', W);
    svg.setAttribute('height', H);
    svg.style.width = W + 'px';
    svg.style.height = H + 'px';

    const boxes = targets.map(el => getBox(el));
    if (boxes.length < 2) return;

    const PAD = 18;          // clearance around content
    const LEFT = 12;         // left edge margin
    const RIGHT = W - 12;    // right edge margin

    // Content bounding box (area where content lives)
    const contentLeft = Math.min(...boxes.map(b => b.x));
    const contentRight = Math.max(...boxes.map(b => b.right));

    // --- Primary trace: sweeps across the full page ---
    let activeVias;
    let curX, curY;

    function moveTo(x, y) { curX = x; curY = y; return `M ${x} ${y}`; }
    function lineTo(x, y) { activeVias.push({ x: curX, y: curY }); curX = x; curY = y; return ` L ${x} ${y}`; }

    const vias = [];
    activeVias = vias;
    const stubs = [];

    if (isCardGrid) {
      const rows = groupIntoRows(boxes);
      const firstRow = rows[0];
      const startY = Math.max(0, firstRow[0].y - 80);

      // Entry: come in from top-right, sweep left above the content
      let d = moveTo(RIGHT, startY);
      d += lineTo(RIGHT, firstRow[0].y - 40);
      d += lineTo(LEFT, firstRow[0].y - 40);
      d += lineTo(LEFT, firstRow[0].y - 10);

      // Route around card rows — traces stay in margins and gaps
      for (let ri = 0; ri < rows.length; ri++) {
        const row = rows[ri];
        const rowTop = Math.min(...row.map(b => b.y));
        const rowBottom = Math.max(...row.map(b => b.bottom));
        const rowLeft = Math.min(...row.map(b => b.x));
        const rowRight = Math.max(...row.map(b => b.right));
        // Gap between cards (for 2-col grids)
        const gutter = row.length > 1
          ? row[0].right + (row[1].x - row[0].right) * 0.5
          : rowLeft + (rowRight - rowLeft) * 0.5;

        if (ri % 2 === 0) {
          // Pattern A: run down the left edge, sweep across in the gap
          // below the row, run up the right edge
          d += lineTo(LEFT, rowBottom + 10);
          // Sweep right in the gap below cards
          d += lineTo(RIGHT, rowBottom + 10);
          // Run up the right side a bit
          d += lineTo(RIGHT, rowBottom - 20);

          // Dogleg jog on the right margin
          const dogY = rowBottom + 30;
          const dogX = RIGHT - 30;
          d += lineTo(RIGHT, dogY);
          d += lineTo(dogX, dogY);
          d += lineTo(dogX, dogY + 35);
          d += lineTo(RIGHT, dogY + 35);

          // Stub: vertical drop through the gutter between cards
          if (row.length > 1) {
            stubs.push({
              d: `M ${gutter} ${rowTop - 5} L ${gutter} ${rowBottom + 5}`,
              ex: gutter, ey: rowBottom + 5,
            });
          }

          // Stub: short horizontal branch from the left edge
          const stubY = rowTop + (rowBottom - rowTop) * 0.4;
          stubs.push({
            d: `M ${LEFT} ${stubY} L ${Math.max(LEFT, rowLeft - 10)} ${stubY}`,
            ex: Math.max(LEFT, rowLeft - 10), ey: stubY,
          });

          // Position for next row
          if (ri < rows.length - 1) {
            const nextTop = Math.min(...rows[ri + 1].map(b => b.y));
            d += lineTo(RIGHT, nextTop - 10);
          }
        } else {
          // Pattern B: run down the right edge, sweep across in the gap
          // below the row, run up the left edge
          d += lineTo(RIGHT, rowBottom + 10);
          // Sweep left in the gap below cards
          d += lineTo(LEFT, rowBottom + 10);
          d += lineTo(LEFT, rowBottom - 20);

          // Dogleg jog on the left margin
          const dogY = rowBottom + 30;
          const dogX = LEFT + 25;
          d += lineTo(LEFT, dogY);
          d += lineTo(dogX, dogY);
          d += lineTo(dogX, dogY + 30);
          d += lineTo(LEFT, dogY + 30);

          // Stub: vertical drop through the gutter
          if (row.length > 1) {
            stubs.push({
              d: `M ${gutter} ${rowTop - 5} L ${gutter} ${rowBottom + 5}`,
              ex: gutter, ey: rowBottom + 5,
            });
          }

          // Stub: short horizontal branch from the right edge
          const stubY = rowTop + (rowBottom - rowTop) * 0.5;
          stubs.push({
            d: `M ${RIGHT} ${stubY} L ${Math.min(RIGHT, rowRight + 10)} ${stubY}`,
            ex: Math.min(RIGHT, rowRight + 10), ey: stubY,
          });

          // Position for next row
          if (ri < rows.length - 1) {
            const nextTop = Math.min(...rows[ri + 1].map(b => b.y));
            d += lineTo(LEFT, nextTop - 10);
          }
        }
      }

      // Exit tail
      const lastRow = rows[rows.length - 1];
      const lastBottom = Math.max(...lastRow.map(b => b.bottom));
      const exitFromRight = (rows.length - 1) % 2 === 0;
      d += lineTo(curX, lastBottom + 50);
      d += lineTo(exitFromRight ? LEFT + 80 : RIGHT - 80, lastBottom + 50);
      d += lineTo(exitFromRight ? LEFT + 80 : RIGHT - 80, lastBottom + 100);

      renderPath(d, vias, stubs);

      // --- Secondary trace: runs in the opposite margin ---
      if (rows.length >= 2) {
        const vias2 = [];
        activeVias = vias2;
        const stubs2 = [];
        const r0 = rows[0];
        const r0Bottom = Math.max(...r0.map(b => b.bottom));
        const r1Top = Math.min(...rows[1].map(b => b.y));
        const gapY = r0Bottom + (r1Top - r0Bottom) * 0.5;

        // Short trace that runs through the gap between first two rows
        let d2 = moveTo(RIGHT, r0[0].y - 15);
        d2 += lineTo(RIGHT, gapY);
        d2 += lineTo(LEFT, gapY);
        d2 += lineTo(LEFT, gapY + 50);

        stubs2.push({
          d: `M ${LEFT} ${gapY + 20} L ${LEFT + 40} ${gapY + 20}`,
          ex: LEFT + 40, ey: gapY + 20,
        });

        renderPath(d2, vias2, stubs2);
      }
    } else {
      // --- Section-based layout (about page, blog post) ---
      // Traces route around the content — edges, margins, and gaps only

      const startY = Math.max(0, boxes[0].y - 60);
      // Outer margins: space between content and page edge
      const marginL = Math.max(LEFT, contentLeft - 10);
      const marginR = Math.min(RIGHT, contentRight + 10);

      // Entry: top-right, sweep left above content
      let d = moveTo(RIGHT, startY);
      d += lineTo(RIGHT, boxes[0].y - 25);
      d += lineTo(LEFT, boxes[0].y - 25);

      for (let i = 0; i < boxes.length; i++) {
        const box = boxes[i];
        // Gap between this section and the next
        const hasNext = i < boxes.length - 1;
        const gapTop = box.bottom;
        const gapBottom = hasNext ? boxes[i + 1].y : box.bottom + 80;
        const gapMid = gapTop + (gapBottom - gapTop) * 0.5;

        if (i % 2 === 0) {
          // Run down the left margin, sweep right in the gap below
          d += lineTo(LEFT, gapTop + 5);
          d += lineTo(RIGHT, gapTop + 5);

          // Dogleg on the right side in the gap
          if (hasNext) {
            const dogX = RIGHT - 30;
            d += lineTo(RIGHT, gapMid);
            d += lineTo(dogX, gapMid);
            d += lineTo(dogX, gapMid + 30);
            d += lineTo(RIGHT, gapMid + 30);
            d += lineTo(RIGHT, gapBottom - 5);
          }

          // Stub: short branch from right margin alongside the section
          const stubY = box.y + box.height * 0.4;
          stubs.push({
            d: `M ${RIGHT} ${stubY} L ${marginR} ${stubY}`,
            ex: marginR, ey: stubY,
          });
        } else {
          // Run down the right margin, sweep left in the gap below
          d += lineTo(RIGHT, gapTop + 5);
          d += lineTo(LEFT, gapTop + 5);

          // Dogleg on the left side in the gap
          if (hasNext) {
            const dogX = LEFT + 25;
            d += lineTo(LEFT, gapMid);
            d += lineTo(dogX, gapMid);
            d += lineTo(dogX, gapMid + 25);
            d += lineTo(LEFT, gapMid + 25);
            d += lineTo(LEFT, gapBottom - 5);
          }

          // Stub: short branch from left margin alongside the section
          const stubY = box.y + box.height * 0.5;
          stubs.push({
            d: `M ${LEFT} ${stubY} L ${marginL} ${stubY}`,
            ex: marginL, ey: stubY,
          });
        }
      }

      // Exit tail
      const lastBox = boxes[boxes.length - 1];
      const exitY = lastBox.bottom + 60;
      const exitFromRight = (boxes.length - 1) % 2 === 0;
      d += lineTo(curX, exitY);
      d += lineTo(exitFromRight ? LEFT + 80 : RIGHT - 80, exitY);
      d += lineTo(exitFromRight ? LEFT + 80 : RIGHT - 80, exitY + 60);

      renderPath(d, vias, stubs);

      // --- Secondary trace: runs through a gap between sections ---
      if (boxes.length >= 3) {
        const vias2 = [];
        activeVias = vias2;
        const stubs2 = [];
        const b1 = boxes[1];
        const b2 = boxes[2];
        const gapY = b1.bottom + (b2.y - b1.bottom) * 0.5;

        let d2 = moveTo(RIGHT, b1.bottom + 10);
        d2 += lineTo(RIGHT, gapY);
        d2 += lineTo(LEFT + 50, gapY);
        d2 += lineTo(LEFT + 50, gapY + 40);

        stubs2.push({
          d: `M ${LEFT + 50} ${gapY + 15} L ${LEFT} ${gapY + 15}`,
          ex: LEFT, ey: gapY + 15,
        });

        renderPath(d2, vias2, stubs2);
      }
    }
  }

  render();

  // Animate fill traces and packets (scroll-driven)
  // Delay one frame so SVG paths are fully painted before DrawSVGPlugin reads lengths
  let innerTriggers = [];
  function animateTraces() {
    innerTriggers.forEach(st => st.kill());
    innerTriggers = [];

    if (prefersReducedMotion) return;

    animPaths.forEach(({ fillTrace, packet }) => {
      // Build a custom ease that maps scroll progress (vertical) to
      // path-length progress, so the packet tracks the reader's Y position
      // even when the path has horizontal segments and doglegs.
      const pathLen = fillTrace.getTotalLength();
      const N = 200;
      const pts = [];
      let minPY = Infinity, maxPY = -Infinity;
      for (let i = 0; i <= N; i++) {
        const pt = fillTrace.getPointAtLength((i / N) * pathLen);
        pts.push({ pathProg: i / N, y: pt.y });
        if (pt.y < minPY) minPY = pt.y;
        if (pt.y > maxPY) maxPY = pt.y;
      }
      const pathH = maxPY - minPY;

      // Monotonic forward-only mapping: cumulative max Y ensures
      // we never jump backwards on doglegs
      let maxYSeen = minPY;
      const map = pts.map(p => {
        if (p.y > maxYSeen) maxYSeen = p.y;
        return { yProg: pathH > 0 ? (maxYSeen - minPY) / pathH : 0, pathProg: p.pathProg };
      });

      // Ease function: scroll progress (0-1) → path progress (0-1)
      // with linear interpolation between samples for smoothness
      function yEase(scrollProg) {
        for (let i = 1; i < map.length; i++) {
          if (map[i].yProg >= scrollProg) {
            const prev = map[i - 1], next = map[i];
            if (next.yProg === prev.yProg) return next.pathProg;
            const t = (scrollProg - prev.yProg) / (next.yProg - prev.yProg);
            return prev.pathProg + t * (next.pathProg - prev.pathProg);
          }
        }
        return 1;
      }

      // DrawSVG with Y-proportional ease
      gsap.fromTo(fillTrace,
        { drawSVG: '0%' },
        {
          drawSVG: '100%',
          ease: yEase,
          scrollTrigger: {
            trigger: mainEl,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.3,
            invalidateOnRefresh: true,
          },
        }
      );
      innerTriggers.push(ScrollTrigger.getAll().pop());

      // Packet with the same Y-proportional ease
      gsap.set(packet, { opacity: 1 });
      gsap.to(packet, {
        motionPath: {
          path: fillTrace,
          align: fillTrace,
          alignOrigin: [0.5, 0.5],
        },
        ease: yEase,
        scrollTrigger: {
          trigger: mainEl,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.3,
          invalidateOnRefresh: true,
        },
      });
      innerTriggers.push(ScrollTrigger.getAll().pop());
    });
  }

  // Rebuild SVG paths and recreate ScrollTriggers with correct measurements
  function rebuildCircuit() {
    animPaths.length = 0;
    render();
    innerTriggers.forEach(st => st.kill());
    innerTriggers = [];
    requestAnimationFrame(() => {
      animateTraces();
      ScrollTrigger.refresh(true);
    });
  }

  requestAnimationFrame(() => animateTraces());

  // Debounced rebuild: restarts a 0.5s timer on each layout shift,
  // fires once after things settle. Max 5s fallback.
  const media = mainEl.querySelectorAll('img, video');
  if (media.length > 0) {
    const debouncedRebuild = gsap.delayedCall(0.5, rebuildCircuit).pause();
    const maxTimeout = gsap.delayedCall(5, rebuildCircuit);

    media.forEach(el => {
      const event = el.tagName === 'VIDEO' ? 'loadedmetadata' : 'load';
      const isReady = el.tagName === 'VIDEO' ? el.readyState >= 1 : el.complete;
      if (!isReady) {
        el.addEventListener(event, () => debouncedRebuild.restart(true), { once: true });
        el.addEventListener('error', () => debouncedRebuild.restart(true), { once: true });
      }
    });

    // If all media already loaded, rebuild once
    const allReady = Array.from(media).every(el =>
      el.tagName === 'VIDEO' ? el.readyState >= 1 : el.complete
    );
    if (allReady) {
      maxTimeout.kill();
      rebuildCircuit();
    }
  }

  // Catch-all: ResizeObserver on content container handles font swaps,
  // late-loading embeds, or anything else that shifts layout
  let lastHeight = mainEl.scrollHeight;
  const ro = new ResizeObserver(() => {
    if (Math.abs(mainEl.scrollHeight - lastHeight) > 20) {
      lastHeight = mainEl.scrollHeight;
      rebuildCircuit();
    }
  });
  ro.observe(mainEl);

  // Recalculate on window resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.innerWidth <= 768) {
        wrapper.style.display = 'none';
        return;
      }
      wrapper.style.display = '';
      rebuildCircuit();
    }, 200);
  });
}

function initVideoPrompts() {
  const clickableVideos = document.querySelectorAll('.video-embed[data-click-prompt="true"]');
  if (!clickableVideos.length) return;

  clickableVideos.forEach((embed) => {
    const prompt = embed.querySelector('.video-play-prompt');
    const video = embed.querySelector('video');
    if (!prompt || !video) return;

    prompt.addEventListener('click', async () => {
      embed.classList.add('is-activated');
      try {
        await video.play();
      } catch (error) {
        embed.classList.remove('is-activated');
      }
    });

    video.addEventListener('play', () => {
      embed.classList.add('is-activated');
    }, { once: true });
  });
}

function initImageLightbox() {
  const imageCandidates = document.querySelectorAll('.post-content figure img, .post-content p > img');
  const images = Array.from(imageCandidates).filter((img) => (
    img.getAttribute('src') &&
    !img.closest('a') &&
    !img.closest('.codeblock-frame, .docframe, .arch-diagram') &&
    img.dataset.noLightbox !== 'true'
  ));

  if (!images.length) return;

  const lightbox = document.createElement('div');
  lightbox.className = 'image-lightbox';
  lightbox.hidden = true;
  lightbox.innerHTML = `
    <div class="image-lightbox__dialog" role="dialog" aria-modal="true" aria-label="Expanded image">
      <button class="image-lightbox__close" type="button" aria-label="Close expanded image">&times;</button>
      <img class="image-lightbox__image" alt="">
      <div class="image-lightbox__footer">
        <p class="image-lightbox__caption"></p>
        <a class="image-lightbox__open" target="_blank" rel="noopener noreferrer">Open original</a>
      </div>
    </div>
  `;
  document.body.appendChild(lightbox);

  const dialog = lightbox.querySelector('.image-lightbox__dialog');
  const closeButton = lightbox.querySelector('.image-lightbox__close');
  const lightboxImage = lightbox.querySelector('.image-lightbox__image');
  const caption = lightbox.querySelector('.image-lightbox__caption');
  const openLink = lightbox.querySelector('.image-lightbox__open');
  let activeTrigger = null;
  let closeTimer = null;

  function getCaption(img) {
    const figureCaption = img.closest('figure')?.querySelector('figcaption');
    return figureCaption?.innerText?.trim() || img.getAttribute('alt') || '';
  }

  function openLightbox(img) {
    window.clearTimeout(closeTimer);
    activeTrigger = img;
    const imageSrc = img.currentSrc || img.src;
    const imageCaption = getCaption(img);

    lightboxImage.src = imageSrc;
    lightboxImage.alt = img.getAttribute('alt') || '';
    caption.textContent = imageCaption;
    caption.hidden = !imageCaption;
    openLink.href = img.src;

    lightbox.hidden = false;
    document.body.classList.add('image-lightbox-open');
    requestAnimationFrame(() => {
      lightbox.classList.add('is-open');
      closeButton.focus({ preventScroll: true });
    });
  }

  function closeLightbox() {
    if (lightbox.hidden) return;
    lightbox.classList.remove('is-open');
    document.body.classList.remove('image-lightbox-open');
    closeTimer = window.setTimeout(() => {
      lightbox.hidden = true;
      lightboxImage.removeAttribute('src');
      if (activeTrigger) activeTrigger.focus({ preventScroll: true });
      activeTrigger = null;
    }, 180);
  }

  images.forEach((img) => {
    img.classList.add('is-lightboxable');
    img.setAttribute('role', 'button');
    img.setAttribute('tabindex', '0');
    img.setAttribute('aria-label', `${img.getAttribute('alt') || 'Image'}: open larger view`);

    img.addEventListener('click', () => openLightbox(img));
    img.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openLightbox(img);
      }
    });
  });

  closeButton.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (event) => {
    if (!dialog.contains(event.target)) closeLightbox();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !lightbox.hidden) closeLightbox();
  });
}

// ============================================
// Init
// ============================================
initLoader();
initHero();
initNav();
initCircuit();
initMobileSpine();
initInnerMobileSpine();
initSectionReveals();
initInnerPages();
initInnerCircuit();
initVideoPrompts();
initImageLightbox();
initReadingProgress();
initTransitions();
