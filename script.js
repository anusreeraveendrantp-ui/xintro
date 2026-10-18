```javascript
/**
 * Snap – Navigation script
 *
 * Features:
 * - Desktop dropdown open/close on click
 * - Close desktop dropdowns when clicking outside
 * - Mobile menu open/close
 * - Mobile dropdown accordion
 * - Overlay click closes mobile menu
 * - Escape key closes dropdowns and mobile menu
 */

(function () {
  "use strict";

  // =========================================
  // ELEMENT REFERENCES
  // =========================================

  const openMenuBtn = document.querySelector(".open-menu");
  const closeMenuBtn = document.querySelector(".close-menu");
  const mobileMenu = document.getElementById("mobile-menu");
  const overlay = document.getElementById("overlay");

  const desktopDropdownTriggers = document.querySelectorAll(
    ".nav-link[data-dropdown]"
  );

  const mobileDropdownTriggers = document.querySelectorAll(
    ".mobile-nav-link[data-mobile-dropdown]"
  );

  // =========================================
  // DROPDOWN HELPERS
  // =========================================

  function openDropdown(trigger, list) {
    if (!trigger || !list) return;

    list.classList.add("is-open");
    trigger.classList.add("link-open");
    trigger.setAttribute("aria-expanded", "true");
  }

  function closeDropdown(trigger, list) {
    if (!trigger || !list) return;

    list.classList.remove("is-open");
    trigger.classList.remove("link-open");
    trigger.setAttribute("aria-expanded", "false");
  }

  // =========================================
  // DESKTOP DROPDOWNS
  // =========================================

  function closeAllDesktopDropdowns() {
    desktopDropdownTriggers.forEach(function (trigger) {
      const dropdownId = "dropdown-" + trigger.dataset.dropdown;
      const list = document.getElementById(dropdownId);

      if (list) {
        closeDropdown(trigger, list);
      }
    });
  }

  desktopDropdownTriggers.forEach(function (trigger) {
    trigger.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();

      const dropdownId = "dropdown-" + trigger.dataset.dropdown;
      const list = document.getElementById(dropdownId);

      if (!list) return;

      const wasOpen = list.classList.contains("is-open");

      // Close all desktop dropdowns first.
      closeAllDesktopDropdowns();

      // If the selected dropdown was closed, open it.
      // If it was already open, leave it closed.
      if (!wasOpen) {
        openDropdown(trigger, list);
      }
    });
  });

  // =========================================
  // MOBILE DROPDOWNS
  // =========================================

  function closeAllMobileDropdowns() {
    mobileDropdownTriggers.forEach(function (trigger) {
      const listId = trigger.dataset.mobileDropdown;
      const list = document.getElementById(listId);

      if (list) {
        closeDropdown(trigger, list);
      }
    });
  }

  mobileDropdownTriggers.forEach(function (trigger) {
    trigger.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();

      const listId = trigger.dataset.mobileDropdown;
      const list = document.getElementById(listId);

      if (!list) return;

      const wasOpen = list.classList.contains("is-open");

      // Accordion behavior: close other mobile dropdowns.
      closeAllMobileDropdowns();

      if (!wasOpen) {
        openDropdown(trigger, list);
      }
    });
  });

  // =========================================
  // MOBILE MENU
  // =========================================

  function openMobileMenu() {
    if (!mobileMenu || !overlay || !openMenuBtn) return;

    mobileMenu.classList.add("is-open");
    mobileMenu.setAttribute("aria-hidden", "false");

    overlay.classList.add("is-visible");
    overlay.setAttribute("aria-hidden", "false");

    openMenuBtn.setAttribute("aria-expanded", "true");

    document.body.style.overflow = "hidden";
  }

  function closeMobileMenu() {
    if (mobileMenu) {
      mobileMenu.classList.remove("is-open");
      mobileMenu.setAttribute("aria-hidden", "true");
    }

    if (overlay) {
      overlay.classList.remove("is-visible");
      overlay.setAttribute("aria-hidden", "true");
    }

    if (openMenuBtn) {
      openMenuBtn.setAttribute("aria-expanded", "false");
    }

    document.body.style.overflow = "";

    closeAllMobileDropdowns();
  }

  if (openMenuBtn) {
    openMenuBtn.addEventListener("click", function (event) {
      event.preventDefault();
      openMobileMenu();
    });
  }

  if (closeMenuBtn) {
    closeMenuBtn.addEventListener("click", function (event) {
      event.preventDefault();
      closeMobileMenu();
    });
  }

  if (overlay) {
    overlay.addEventListener("click", function () {
      closeMobileMenu();
    });
  }

  // =========================================
  // CLICK OUTSIDE DESKTOP DROPDOWNS
  // =========================================

  document.addEventListener("click", function () {
    closeAllDesktopDropdowns();
  });

  // Prevent clicks inside dropdown lists from bubbling to
  // the document-level outside-click handler.
  document.querySelectorAll(".dropdown-list").forEach(function (list) {
    list.addEventListener("click", function (event) {
      event.stopPropagation();
    });
  });

  // =========================================
  // KEYBOARD SUPPORT
  // =========================================

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeAllDesktopDropdowns();
      closeMobileMenu();
    }
  });

})();
```
