/**
 * motion.ts — the house scroll/reveal engine.
 *
 * THE REVEAL CONTRACT (see CLAUDE.md §4 and base.css §8)
 *
 *   <div data-reveal-stagger>
 *     <h2 data-reveal>…</h2>                        <!-- default: up -->
 *     <p  data-reveal="fade">…</p>
 *     <img data-reveal="left" data-reveal-delay="0.2" />
 *   </div>
 *
 *   data-reveal          up (default) | fade | left | right
 *   data-reveal-stagger  on a PARENT: its [data-reveal] children stagger in
 *   data-reveal-delay    extra delay, seconds
 *   data-parallax        subtle scroll parallax, capped at --motion-parallax
 *
 * FAIL-SAFE: the hidden start state lives behind `.js-motion` on <html>, which
 * this module adds only once it is running. If the bundle 404s, errors, or is
 * blocked, every element is visible. We never hide content and hope JS shows it.
 *
 * All timing is read from CSS custom properties, so a recipe retunes the whole
 * site's motion personality without touching this file.
 */

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type RevealKind = "up" | "fade" | "left" | "right";

const root = document.documentElement;

/** Read a CSS custom property as a number, with a unit stripped. */
function cssNumber(name: string, fallback: number): number {
  const raw = getComputedStyle(root).getPropertyValue(name).trim();
  if (!raw) return fallback;
  const n = parseFloat(raw);
  return Number.isFinite(n) ? n : fallback;
}

/** Durations are authored in ms; GSAP wants seconds. */
function cssSeconds(name: string, fallbackMs: number): number {
  const raw = getComputedStyle(root).getPropertyValue(name).trim();
  if (!raw) return fallbackMs / 1000;
  const n = parseFloat(raw);
  if (!Number.isFinite(n)) return fallbackMs / 1000;
  return raw.endsWith("ms") ? n / 1000 : n;
}

const prefersReduced = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

/**
 * Reduced motion: never hide anything, never animate, never register a single
 * ScrollTrigger. Bail before adding .js-motion so the hidden state never lands.
 */
if (prefersReduced) {
  ScrollTrigger.getAll().forEach((t) => t.kill());
} else {
  root.classList.add("js-motion");
  requestAnimationFrame(init);
}

function init(): void {
  const duration = cssSeconds("--duration-reveal", 700);
  const distance = cssNumber("--motion-distance", 24);
  const stagger = cssNumber("--motion-stagger", 0.08);


  // House curve. Matches --ease-out in tokens.css; ease-out only, never bounce.
  const ease = "power3.out";

  const from = (kind: RevealKind) => {
    switch (kind) {
      case "fade":
        return { opacity: 0 };
      case "left":
        return { opacity: 0, x: -distance };
      case "right":
        return { opacity: 0, x: distance };
      default:
        return { opacity: 0, y: distance };
    }
  };

  const kindOf = (el: Element): RevealKind => {
    const v = el.getAttribute("data-reveal");
    return v === "fade" || v === "left" || v === "right" ? v : "up";
  };

  // Pointer capability gates every hover- and pin-based effect below.
  const coarse = window.matchMedia("(pointer: coarse)").matches;

  const settle = (targets: Element[]) => {
    for (const t of targets) t.classList.add("is-revealed");
  };

  /* ---- staggered groups --------------------------------------------- */
  // Handled first so their children are claimed before the singles pass.
  const claimed = new WeakSet<Element>();

  for (const group of document.querySelectorAll<HTMLElement>(
    "[data-reveal-stagger]"
  )) {
    const children = Array.from(
      group.querySelectorAll<HTMLElement>("[data-reveal]")
    ).filter((el) => !claimed.has(el));
    if (!children.length) continue;
    for (const c of children) claimed.add(c);

    // A group animates as one timeline, so every child shares a kind. Mixed
    // kinds inside one stagger read as noise; the first child wins.
    const kind = kindOf(children[0]);
    const delay = parseFloat(group.dataset.revealDelay ?? "0") || 0;

    gsap.fromTo(children, from(kind), {
      opacity: 1,
      x: 0,
      y: 0,
      duration,
      ease,
      delay,
      stagger,
      onComplete: () => settle(children),
      scrollTrigger: {
        trigger: group,
        start: "top 85%",
        once: true,
      },
    });
  }

  /* ---- individual reveals -------------------------------------------- */
  for (const el of document.querySelectorAll<HTMLElement>("[data-reveal]")) {
    if (claimed.has(el)) continue;
    const kind = kindOf(el);
    const delay = parseFloat(el.dataset.revealDelay ?? "0") || 0;

    gsap.fromTo(el, from(kind), {
      opacity: 1,
      x: 0,
      y: 0,
      duration,
      ease,
      delay,
      onComplete: () => settle([el]),
      scrollTrigger: {
        trigger: el,
        start: "top 88%",
        once: true,
      },
    });
  }

  /* ---- hero -----------------------------------------------------------
     Intentionally NOT handled here. [data-hero-settle] is animated by a pure
     CSS keyframe in base.css §8 so above-the-fold content paints without
     waiting for this bundle, and a throttled rAF can never strand it at
     opacity 0. The hero heading and image are never animated at all — they
     are the LCP candidates.                                                */

  /* ---- parallax --------------------------------------------------------
     Hard-capped at 15%. The cap is enforced here, not trusted to the token,
     because a recipe author editing CSS should not be able to break the rule.
     Skipped entirely on coarse pointers: it costs scroll performance on phones
     and buys nothing.                                                       */
  if (!coarse) {
    const amount = Math.min(cssNumber("--motion-parallax", 0.12), 0.15);
    if (amount > 0) {
      for (const el of document.querySelectorAll<HTMLElement>(
        "[data-parallax]"
      )) {
        const host = el.parentElement ?? el;
        gsap.fromTo(
          el,
          { yPercent: -amount * 50 },
          {
            yPercent: amount * 50,
            ease: "none",
            scrollTrigger: {
              trigger: host,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      }
    }
  }

  /* =====================================================================
     SIGNATURE TIER
     ---------------------------------------------------------------------
     Everything below serves the ONE signature moment per page (CLAUDE.md
     §4a). All of it is opt-in per element, all of it no-ops under reduced
     motion (we never reach here in that case), and all of it degrades to a
     composed static layout if the bundle never runs.
     ===================================================================== */

  /* ---- layered parallax -------------------------------------------------
     data-depth="0.2" … "1" on children of [data-parallax-scene].
     Depth 0 is welded to the page; 1 moves the full signature amount. Layers
     moving at different rates is what reads as depth — a single layer moving
     just reads as a page that will not sit still.                          */
  const sigParallax = Math.min(
    cssNumber("--sig-parallax", 0.32),
    cssNumber("--sig-parallax-max", 0.45)
  );

  for (const scene of document.querySelectorAll<HTMLElement>(
    "[data-parallax-scene]"
  )) {
    const layers = scene.querySelectorAll<HTMLElement>("[data-depth]");
    if (!layers.length) continue;

    for (const layer of layers) {
      const depth = parseFloat(layer.dataset.depth ?? "0.5") || 0;
      if (!depth) continue;
      const shift = sigParallax * depth * 100;

      gsap.fromTo(
        layer,
        { yPercent: -shift / 2 },
        {
          yPercent: shift / 2,
          ease: "none",
          scrollTrigger: {
            trigger: scene,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.6, // slight lag reads as weight, not lateness
          },
        }
      );
    }
  }

  /* ---- masked type reveal -----------------------------------------------
     [data-split="lines"|"words"] wraps each line/word in an overflow-hidden
     span and slides it up from beneath its own baseline. This is the single
     highest-value-per-byte typographic move we have.

     Accessibility: the ORIGINAL text stays intact as the element's
     accessible name via aria-label, and the split fragments are hidden from
     assistive tech — otherwise a screen reader announces the headline one
     word at a time.                                                        */
  for (const el of document.querySelectorAll<HTMLElement>("[data-split]")) {
    const mode = el.dataset.split === "words" ? "words" : "lines";
    const original = el.textContent?.trim() ?? "";
    if (!original) continue;

    el.setAttribute("aria-label", original);

    // Words first — line detection needs them laid out and measured.
    const words = original.split(/\s+/);
    el.textContent = "";
    const wordEls: HTMLElement[] = words.map((w, i) => {
      const span = document.createElement("span");
      span.className = "split__word";
      span.setAttribute("aria-hidden", "true");
      span.textContent = w;
      el.appendChild(span);
      // Inter-word space is a real text node BETWEEN spans, never a trailing
      // space inside one: a trailing space sits at the end of an inline-block's
      // own line box and CSS trims it, rendering the headline as "lineby".
      // Verified in a browser -- do not "simplify" this back.
      if (i < words.length - 1) el.appendChild(document.createTextNode(" "));
      return span;
    });

    let units: HTMLElement[] = wordEls;

    if (mode === "lines") {
      // Group words by their rendered offsetTop — the only reliable way to
      // find visual lines after the browser has wrapped them.
      const rows = new Map<number, HTMLElement[]>();
      for (const w of wordEls) {
        const top = Math.round(w.offsetTop);
        (rows.get(top) ?? rows.set(top, []).get(top)!).push(w);
      }

      el.textContent = "";
      units = [...rows.values()].map((row) => {
        const line = document.createElement("span");
        line.className = "split__line";
        line.setAttribute("aria-hidden", "true");
        row.forEach((w, i) => {
          line.appendChild(w);
          if (i < row.length - 1) line.appendChild(document.createTextNode(" "));
        });
        el.appendChild(line);
        return line;
      });
    }

    // Each unit sits inside a clipping mask so it slides out from nothing.
    const masked = units.map((u) => {
      const mask = document.createElement("span");
      mask.className = "split__mask";
      mask.setAttribute("aria-hidden", "true");
      u.parentNode?.insertBefore(mask, u);
      mask.appendChild(u);
      return u;
    });

    el.classList.add("is-split");

    gsap.fromTo(
      masked,
      { yPercent: 115 },
      {
        yPercent: 0,
        duration: cssSeconds("--sig-mask-duration", 900),
        ease: "power4.out",
        stagger: cssNumber("--sig-stagger-char", 0.055),
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      }
    );
  }

  /* ---- pinned showcase ---------------------------------------------------
     [data-pin-scene] holds a [data-pin-sticky] panel and N [data-pin-step]
     children. The panel pins while the steps scroll past, swapping an
     .is-active class. CSS owns what "active" looks like — this only tracks
     which step you are on.

     Skipped on coarse pointers and short viewports: pinning fights momentum
     scrolling on phones and traps people on small screens.                 */
  const shortViewport = window.innerHeight < 640;
  if (!coarse && !shortViewport) {
    for (const scene of document.querySelectorAll<HTMLElement>(
      "[data-pin-scene]"
    )) {
      const sticky = scene.querySelector<HTMLElement>("[data-pin-sticky]");
      const steps = [...scene.querySelectorAll<HTMLElement>("[data-pin-step]")];
      if (!sticky || steps.length < 2) continue;

      scene.classList.add("is-pinned");

      steps.forEach((step, i) => {
        ScrollTrigger.create({
          trigger: step,
          start: "top 60%",
          end: "bottom 60%",
          onToggle: (self) => {
            if (!self.isActive) return;
            for (const s of steps) s.classList.remove("is-active");
            step.classList.add("is-active");
            sticky.dataset.activeStep = String(i);
          },
        });
      });

      ScrollTrigger.create({
        trigger: scene,
        start: "top top",
        end: "bottom bottom",
        pin: sticky,
        pinSpacing: false,
      });
    }
  }

  /* ---- magnetic / reactive elements --------------------------------------
     [data-magnetic] drifts toward the cursor within a radius. Pointer-device
     only, and it never moves far enough to make the element hard to click —
     a button that runs away from the pointer is a joke, not a delight.     */
  if (!coarse) {
    const radius = cssNumber("--sig-magnet-radius", 90);
    const strength = cssNumber("--sig-magnet-strength", 0.28);

    for (const el of document.querySelectorAll<HTMLElement>("[data-magnetic]")) {
      const setX = gsap.quickTo(el, "x", { duration: 0.45, ease: "power3.out" });
      const setY = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3.out" });

      const onMove = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        if (Math.hypot(dx, dy) > radius + Math.max(r.width, r.height) / 2) {
          setX(0);
          setY(0);
          return;
        }
        setX(dx * strength);
        setY(dy * strength);
      };

      const reset = () => {
        setX(0);
        setY(0);
      };

      window.addEventListener("pointermove", onMove, { passive: true });
      el.addEventListener("pointerleave", reset);
      // Keyboard users must never inherit a displaced element.
      el.addEventListener("focus", reset);
    }

    /* [data-tilt] — hover tilt on cards. Same discipline: small, damped,
       and it resets the moment the pointer leaves. */
    const maxTilt = cssNumber("--sig-tilt", 6);
    for (const el of document.querySelectorAll<HTMLElement>("[data-tilt]")) {
      const rotX = gsap.quickTo(el, "rotationX", { duration: 0.5, ease: "power3.out" });
      const rotY = gsap.quickTo(el, "rotationY", { duration: 0.5, ease: "power3.out" });
      gsap.set(el, { transformPerspective: 900 });

      el.addEventListener(
        "pointermove",
        (e) => {
          const r = el.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5;
          const py = (e.clientY - r.top) / r.height - 0.5;
          rotY(px * maxTilt * 2);
          rotX(-py * maxTilt * 2);
        },
        { passive: true }
      );

      const flat = () => {
        rotX(0);
        rotY(0);
      };
      el.addEventListener("pointerleave", flat);
      el.addEventListener("focusout", flat);
    }
  }

  /* ---- header state ----------------------------------------------------
     Adds .is-scrolled to the header past the fold. CSS owns what that means. */
  const header = document.querySelector<HTMLElement>("[data-site-header]");
  if (header) {
    ScrollTrigger.create({
      start: "top -80",
      end: 99999,
      onToggle: (self) => header.classList.toggle("is-scrolled", self.isActive),
    });
  }

  // Late-loading images change layout height; recompute once they land.
  window.addEventListener("load", () => ScrollTrigger.refresh(), {
    once: true,
  });
}
