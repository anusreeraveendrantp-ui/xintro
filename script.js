/**
 * Snap – Navigation script
 * Handles:
 *  - Desktop dropdown open/close (click-only toggle)
 *  - Mobile menu open/close with overlay
 *  - Mobile dropdown accordion
 *  - Close dropdowns on outside click
 *  - Keyboard: Escape closes everything
 */

(function () {
  "use strict";

  // ── References ───────────────────────────────────────────────────────────────
  const openMenuBtn  = document.querySelector(".open-menu");
  const closeMenuBtn = document.querySelector(".close-menu");
  const mobileMenu   = document.getElementById("mobile-menu");
  const overlay      = document.getElementById("overlay");

  const desktopTriggers = document.querySelectorAll(".nav-link[data-dropdown]");
  const mobileTriggers  = document.querySelectorAll(".mobile-nav-link[data-mobile-dropdown]");

  // ── Dropdown helpers ─────────────────────────────────────────────────────────

  function openDropdown(trigger, list) {
    list.classList.add("is-open");
    trigger.classList.add("link-open");
    trigger.setAttribute("aria-expanded", "true");
  }

  function closeDropdown(trigger, list) {
    list.classList.remove("is-open");
    trigger.classList.remove("link-open");
    trigger.setAttribute("aria-expanded", "false");
  }

  function closeAllDesktopDropdowns() {
    desktopTriggers.forEach(function (trigger) {
      var list = document.getElementById("dropdown-" + trigger.dataset.dropdown);
      if (list) closeDropdown(trigger, list);
    });
  }

  function closeAllMobileDropdowns() {
    mobileTriggers.forEach(function (trigger) {
      var list = document.getElementById(trigger.dataset.mobileDropdown);
      if (list) closeDropdown(trigger, list);
    });
  }

  // ── Desktop dropdown toggle ──────────────────────────────────────────────────
  // stopPropagation prevents the document listener from interfering
  // with the same click that toggles the dropdown.

  desktopTriggers.forEach(function (trigger) {
    trigger.addEventListener("click", function (e) {
      e.stopPropagation();

      var list = document.getElementById("dropdown-" + trigger.dataset.dropdown);
      if (!list) return;

      if (list.classList.contains("is-open")) {
        // Second click: close this dropdown
        closeDropdown(trigger, list);
      } else {
        // First click: close any other open dropdown, then open this one
        closeAllDesktopDropdowns();
        openDropdown(trigger, list);
      }
    });
  });

  // Close desktop dropdowns when clicking anywhere outside the nav
  document.addEventListener("click", function () {
    closeAllDesktopDropdowns();
  });

  // ── Mobile menu ──────────────────────────────────────────────────────────────

  function openMobileMenu() {
    if (!mobileMenu || !overlay) return;
    mobileMenu.classList.add("is-open");
    mobileMenu.setAttribute("aria-hidden", "false");
    overlay.classList.add("is-visible");
    overlay.setAttribute("aria-hidden", "false");
    if (openMenuBtn) openMenuBtn.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }

  function closeMobileMenu() {
    if (!mobileMenu || !overlay) return;
    mobileMenu.classList.remove("is-open");
    mobileMenu.setAttribute("aria-hidden", "true");
    overlay.classList.remove("is-visible");
    overlay.setAttribute("aria-hidden", "true");
    if (openMenuBtn) openMenuBtn.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    closeAllMobileDropdowns();
  }

  if (openMenuBtn)  openMenuBtn.addEventListener("click",  openMobileMenu);
  if (closeMenuBtn) closeMenuBtn.addEventListener("click", closeMobileMenu);
  if (overlay)      overlay.addEventListener("click",      closeMobileMenu);

  // ── Mobile dropdown accordion ────────────────────────────────────────────────

  mobileTriggers.forEach(function (trigger) {
    trigger.addEventListener("click", function (e) {
      e.stopPropagation();

      var list = document.getElementById(trigger.dataset.mobileDropdown);
      if (!list) return;

      var isOpen = list.classList.contains("is-open");
      closeAllMobileDropdowns();
      if (!isOpen) openDropdown(trigger, list);
    });
  });

  // ── Keyboard: Escape ─────────────────────────────────────────────────────────

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeAllDesktopDropdowns();
      closeMobileMenu();
    }
  });

})();
