const yearEl = document.getElementById("year");
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.getElementById("main-nav");

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

if (menuToggle && nav) {
  const closeMenu = () => {
    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  };

  menuToggle.addEventListener("click", () => {
    const isOpen = !nav.classList.contains("open");
    nav.classList.toggle("open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      closeMenu();
    });
  });

  const desktopNavQuery = window.matchMedia("(min-width: 701px)");
  const syncDesktopNav = () => {
    if (desktopNavQuery.matches) {
      closeMenu();
    }
  };

  if (typeof desktopNavQuery.addEventListener === "function") {
    desktopNavQuery.addEventListener("change", syncDesktopNav);
  } else if (typeof desktopNavQuery.addListener === "function") {
    desktopNavQuery.addListener(syncDesktopNav);
  }

  window.addEventListener("orientationchange", syncDesktopNav);

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }

    const clickedInsideMenu = target.closest("#main-nav") || target.closest(".menu-toggle");
    if (!clickedInsideMenu) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });
}

const skillChips = document.querySelectorAll(".skill-chip");

if (skillChips.length > 0) {
  const clearActiveChips = (exceptChip = null) => {
    skillChips.forEach((chip) => {
      if (chip !== exceptChip) {
        chip.classList.remove("is-active");
        chip.setAttribute("aria-expanded", "false");
      }
    });
  };

  skillChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const shouldActivate = !chip.classList.contains("is-active");
      clearActiveChips(chip);
      chip.classList.toggle("is-active", shouldActivate);
      chip.setAttribute("aria-expanded", String(shouldActivate));
    });

    chip.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        chip.classList.remove("is-active");
        chip.setAttribute("aria-expanded", "false");
        chip.blur();
      }
    });
  });

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element) || !target.closest(".skill-chip")) {
      clearActiveChips();
    }
  });
}

const projectLinks = document.querySelectorAll(".project-open-modal");
const projectModal = document.getElementById("projectModal");
const projectModalTitle = document.getElementById("projectModalTitle");
const projectModalImage = document.getElementById("projectModalImage");
const projectModalNote = document.getElementById("projectModalNote");
const projectPreviewBtn = document.getElementById("projectPreviewBtn");
const projectNewTabBtn = document.getElementById("projectNewTabBtn");
const projectModalClose = document.getElementById("projectModalClose");

if (
  projectLinks.length > 0 &&
  projectModal &&
  projectModalTitle &&
  projectModalImage &&
  projectModalNote &&
  projectPreviewBtn &&
  projectNewTabBtn &&
  projectModalClose
) {
  let activeProjectUrl = "";
  let activeProjectPreviewUrl = "";
  let activeProjectTitle = "";
  let lastFocusedElement = null;

  const getPreviewUrlFromDriveId = (driveId) => {
    if (!driveId) {
      return "";
    }

    return `https://drive.google.com/uc?export=view&id=${encodeURIComponent(driveId)}`;
  };

  const renderProjectPreview = (forceReload = false) => {
    if (!activeProjectPreviewUrl) {
      return;
    }

    if (forceReload) {
      projectModalImage.src = "";
    }

    projectModalTitle.textContent = activeProjectTitle;
    projectModalImage.src = activeProjectPreviewUrl;
    projectModalImage.alt = `${activeProjectTitle} preview`;
    projectNewTabBtn.href = activeProjectUrl;
    projectModalNote.textContent = "Preview loaded.";
  };

  const openProjectModal = () => {
    if (document.activeElement instanceof HTMLElement) {
      lastFocusedElement = document.activeElement;
    }
    projectModal.classList.add("is-open");
    projectModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    projectModalImage.src = "";
    projectModalNote.textContent = "Click Preview to load project image.";
    projectNewTabBtn.href = activeProjectUrl || "#";
    projectPreviewBtn.focus();
  };

  const closeProjectModal = () => {
    projectModal.classList.remove("is-open");
    projectModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
      lastFocusedElement.focus();
    }
  };

  projectLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      activeProjectUrl = link.getAttribute("href") || "";
      activeProjectTitle = link.getAttribute("data-project-title") || "Project Preview";
      activeProjectPreviewUrl = getPreviewUrlFromDriveId(link.getAttribute("data-project-id"));
      openProjectModal();
    });
  });

  projectPreviewBtn.addEventListener("click", () => {
    renderProjectPreview(true);
  });

  projectNewTabBtn.addEventListener("click", (event) => {
    const href = projectNewTabBtn.getAttribute("href");
    if (!href || href === "#") {
      event.preventDefault();
      projectModalNote.textContent = "Project link is missing for this item.";
    }
  });

  projectModalImage.addEventListener("error", () => {
    projectModalImage.src = "";
    projectModalNote.textContent =
      "Preview blocked by file permissions. Set Google Drive file access to 'Anyone with the link'.";
  });

  projectModalClose.addEventListener("click", () => {
    closeProjectModal();
  });

  projectModal.addEventListener("click", (event) => {
    if (event.target === projectModal) {
      closeProjectModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && projectModal.classList.contains("is-open")) {
      closeProjectModal();
    }
  });
}
