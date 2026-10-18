/**
 * Snap – Navigation script
 * Handles:
 *  - Desktop dropdown open/close (click only, not hover)
 *  - Mobile menu open/close
 *  - Mobile dropdown accordion
 *  - Close dropdowns when clicking outside
 *  - Keyboard: Escape closes open dropdowns / mobile menu
 */

(function () {
  "use strict";

  // ── Element references ──────────────────────────────────────────────────────
  const openMenuBtn  = document.querySelector(".open-menu");
  const closeMenuBtn = document.querySelector(".close-menu");
  const mobileMenu   = document.getElementById("mobile-menu");
  const overlay      = document.getElementById("overlay");

  // Desktop nav-link buttons that have dropdowns
  const desktopDropdownTriggers = document.querySelectorAll(
    ".nav-link[data-dropdown]"
  );

  // Mobile nav-link buttons that have dropdowns
  const mobileDropdownTriggers = document.querySelectorAll(
    ".mobile-nav-link[data-mobile-dropdown]"
  );

  // ── Helpers ─────────────────────────────────────────────────────────────────

  /**
   * Open a dropdown list and update the trigger's aria-expanded attribute.
   * @param {HTMLElement} trigger - The button that controls the dropdown.
   * @param {HTMLElement} list    - The <ul> dropdown element.
   */
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
  /**
   * Close ALL desktop dropdowns.
   */
  function closeAllDesktopDropdowns() {
    desktopDropdownTriggers.forEach(function (trigger) {
      const listId = trigger.dataset.dropdown;
      const list   = document.getElementById("dropdown-" + listId);
      if (list) closeDropdown(trigger, list);
    });
  }

  /**
   * Close ALL mobile dropdowns.
   */
  function closeAllMobileDropdowns() {
    mobileDropdownTriggers.forEach(function (trigger) {
      const listId = trigger.dataset.mobileDropdown;
      const list   = document.getElementById(listId);
      if (list) closeDropdown(trigger, list);
    });
  }

  // ── Desktop dropdown logic ───────────────────────────────────────────────────


desktopDropdownTriggers.forEach(function (trigger) {
  trigger.addEventListener("click", function () {
    const listId = trigger.dataset.dropdown;
    const list = document.getElementById("dropdown-" + listId);

    if (!list) return;

    // Clicking an open dropdown closes it.
    if (list.classList.contains("is-open")) {
      closeDropdown(trigger, list);
      return;
    }

    // Close other dropdowns, then open this one.
    closeAllDesktopDropdowns();
    openDropdown(trigger, list);
  });
});


  // ── Mobile menu logic ────────────────────────────────────────────────────────

  function openMobileMenu() {
    mobileMenu.classList.add("is-open");
    mobileMenu.setAttribute("aria-hidden", "false");
    overlay.classList.add("is-visible");
    overlay.setAttribute("aria-hidden", "false");
    openMenuBtn.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }

  function closeMobileMenu() {
  if (!mobileMenu || !overlay || !openMenuBtn) return;

  mobileMenu.classList.remove("is-open");
  mobileMenu.setAttribute("aria-hidden", "true");

  overlay.classList.remove("is-visible");
  overlay.setAttribute("aria-hidden", "true");

  openMenuBtn.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";

  closeAllMobileDropdowns();
}

  if (openMenuBtn)  openMenuBtn.addEventListener("click",  openMobileMenu);
  if (closeMenuBtn) closeMenuBtn.addEventListener("click", closeMobileMenu);
  if (overlay)      overlay.addEventListener("click",      closeMobileMenu);

  // ── Mobile dropdown accordion ────────────────────────────────────────────────

  mobileDropdownTriggers.forEach(function (trigger) {
    trigger.addEventListener("click", function (e) {
      e.stopPropagation();

      const listId = trigger.dataset.mobileDropdown;
      const list   = document.getElementById(listId);
      if (!list) return;

      const isOpen = list.classList.contains("is-open");

      // Close all mobile dropdowns first (accordion behaviour)
      closeAllMobileDropdowns();

      if (!isOpen) {
        openDropdown(trigger, list);
      }
    });
  });

  // ── Close on outside click ───────────────────────────────────────────────────
  // Use mousedown on the document so it fires before the button's click event,
  // but only close when the click target is outside every nav-item.
  document.addEventListener("click", function (e) {
    const insideNav = e.target.closest(".nav-item");
    if (!insideNav) {
      closeAllDesktopDropdowns();
    }
  });

  // ── Keyboard: Escape ─────────────────────────────────────────────────────────

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeAllDesktopDropdowns();
      closeMobileMenu();
    }
  });

})();
