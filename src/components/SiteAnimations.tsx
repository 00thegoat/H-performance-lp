"use client";

import { useEffect } from "react";
import { animate } from "motion";

/**
 * Adds gentle entrance animation + scroll reveal to the rendered Wix snapshot.
 * Runs on mount and observes top-level sections (#SITE_PAGES_TRANSITION_GROUP > *)
 * adding [data-h-fade="visible"] when they enter the viewport.
 *
 * The CSS rule for [data-h-fade] is in globals.css.
 */
export default function SiteAnimations() {
  useEffect(() => {
    // Page entrance: fade body in from a slight Y offset
    animate(
      document.body,
      { opacity: [0, 1], y: [8, 0] },
      { duration: 0.9, ease: [0.2, 0.65, 0.2, 1] }
    );

    // Mark major top-level sections of the Wix snapshot for scroll reveal
    const candidates = Array.from(
      document.querySelectorAll<HTMLElement>(
        "#SITE_PAGES_TRANSITION_GROUP > section, #SITE_PAGES_TRANSITION_GROUP > div, #SITE_PAGES > section, main section, footer"
      )
    );

    const targets = candidates.filter(
      (el) => el.getBoundingClientRect().height > 100
    );

    targets.forEach((el) => {
      el.setAttribute("data-h-fade", "");
    });

    // Observe + reveal
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-h-fade", "visible");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 }
    );
    targets.forEach((el) => io.observe(el));

    // Already-in-viewport sections should appear immediately (no flash)
    targets.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) {
        el.setAttribute("data-h-fade", "visible");
      }
    });

    // Toggle body.scrolled class for header frosted-glass state
    const onScroll = () => {
      if (window.scrollY > 100) {
        document.body.classList.add("scrolled");
      } else {
        document.body.classList.remove("scrolled");
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return null;
}
