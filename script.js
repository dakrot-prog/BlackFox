const serviceCards = document.querySelectorAll(".service-card");
const images = document.querySelectorAll("img");
const heroVideo = document.querySelector(".hero-visual video");
const contactForm = document.querySelector('form[action="https://api.web3forms.com/submit"]');
const phoneInput = document.querySelector('input[name="phone"]');
const siteHeader = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const headerNavigation = document.querySelector("#header-navigation");
const pageLoader = document.querySelector("#page-loader");

if (pageLoader) {
  let loaderHidden = false;

  const hidePageLoader = () => {
    if (loaderHidden) {
      return;
    }

    loaderHidden = true;
    pageLoader.classList.add("is-hidden");
    document.body.classList.remove("is-loading");

    window.setTimeout(() => {
      pageLoader.remove();
    }, 500);
  };

  if (document.readyState === "complete") {
    window.requestAnimationFrame(hidePageLoader);
  } else {
    window.addEventListener("load", hidePageLoader, { once: true });
  }

  window.setTimeout(hidePageLoader, 10000);
}

if (siteHeader && menuToggle && headerNavigation) {
  const closeMenu = () => {
    siteHeader.classList.remove("is-menu-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Відкрити меню");
  };

  menuToggle.addEventListener("click", () => {
    const isOpen = siteHeader.classList.toggle("is-menu-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Закрити меню" : "Відкрити меню");
  });

  headerNavigation.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      closeMenu();
    }
  });

  document.addEventListener("click", (event) => {
    if (!siteHeader.contains(event.target)) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
      menuToggle.focus();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 940) {
      closeMenu();
    }
  });
}

if (phoneInput) {
  phoneInput.addEventListener("input", () => {
    let digits = phoneInput.value.replace(/\D/g, "");

    if (digits.startsWith("38")) {
      digits = digits.slice(2);
    }

    digits = digits.slice(0, 10);

    if (!digits) {
      phoneInput.value = "";
      return;
    }

    let formatted = `+38 (${digits.slice(0, 3)}`;

    if (digits.length >= 3) {
      formatted += ")";
    }

    if (digits.length > 3) {
      formatted += ` ${digits.slice(3, 6)}`;
    }

    if (digits.length > 6) {
      formatted += ` ${digits.slice(6, 8)}`;
    }

    if (digits.length > 8) {
      formatted += ` ${digits.slice(8, 10)}`;
    }

    phoneInput.value = formatted;
  });
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle("is-visible", entry.isIntersecting);
    });
  },
  { threshold: 0.62 }
);

serviceCards.forEach((card) => observer.observe(card));

images.forEach((image) => {
  image.addEventListener("error", () => {
    image.hidden = true;
  });
});

if (heroVideo) {
  heroVideo.playbackRate = 0.75;
}

if (contactForm) {
  const formNote = contactForm.querySelector(".form-note");
  const submitButton = contactForm.querySelector('button[type="submit"]');
  const accessKey = contactForm.querySelector('input[name="access_key"]');
  const defaultNote = formNote ? formNote.textContent : "";

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!accessKey || accessKey.value === "PASTE_YOUR_WEB3FORMS_ACCESS_KEY_HERE") {
      if (formNote) {
        formNote.textContent = "Додайте access key Web3Forms у форму.";
      }
      return;
    }

    if (formNote) {
      formNote.textContent = "Відправляємо заявку...";
    }

    if (submitButton) {
      submitButton.disabled = true;
    }

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: new FormData(contactForm),
        headers: {
          Accept: "application/json",
        },
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Web3Forms request failed");
      }

      contactForm.reset();

      if (formNote) {
        formNote.textContent = "Дякуємо! Заявку відправлено.";
      }
    } catch (error) {
      if (formNote) {
        formNote.textContent = "Не вдалося відправити заявку. Спробуйте ще раз або зателефонуйте нам.";
      }
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
      }

      window.setTimeout(() => {
        if (formNote) {
          formNote.textContent = defaultNote;
        }
      }, 6000);
    }
  });
}
