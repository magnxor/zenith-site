/* ============================================================
   zenith — interações do site
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Navbar: vidro ao rolar ---------- */
  var nav = document.getElementById("nav");

  function onScroll() {
    if (window.scrollY > 30) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Menu mobile ---------- */
  var burger = document.getElementById("burger");
  var navLinks = document.getElementById("navLinks");

  burger.addEventListener("click", function () {
    var isOpen = navLinks.classList.toggle("open");
    burger.classList.toggle("open", isOpen);
    burger.setAttribute("aria-expanded", String(isOpen));
    burger.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
    document.body.style.overflow = isOpen ? "hidden" : "";
  });

  navLinks.addEventListener("click", function (event) {
    if (event.target.tagName === "A") {
      navLinks.classList.remove("open");
      burger.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }
  });

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("visible");
    });
  }

  /* ---------- Contadores animados ---------- */
  var counters = document.querySelectorAll("[data-count]");
  var prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  function animateCounter(el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    if (isNaN(target)) return;

    if (prefersReducedMotion) {
      el.textContent = String(target);
      return;
    }

    var duration = 1600;
    var start = null;

    function step(timestamp) {
      if (!start) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      /* ease-out cúbico */
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = String(Math.round(target * eased));
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }

  if ("IntersectionObserver" in window) {
    var counterObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach(function (el) {
      counterObserver.observe(el);
    });
  } else {
    counters.forEach(animateCounter);
  }

  /* ---------- Formulário de contato ----------
     Sem backend: monta um e-mail pré-preenchido (mailto).
     AJUSTE: troque o endereço abaixo pelo e-mail real da zenith
     (o mesmo usado na seção de contato do index.html).        */
  var DESTINO_EMAIL = "contato@zenithenergia.com.br";

  var form = document.getElementById("formContato");
  var feedback = document.getElementById("formFeedback");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var nome = form.nome.value.trim();
    var email = form.email.value.trim();
    var telefone = form.telefone.value.trim();
    var servico = form.servico.value;
    var mensagem = form.mensagem.value.trim();

    if (!nome || !email) {
      feedback.textContent = "Preencha ao menos nome e e-mail para continuar.";
      return;
    }

    var assunto = "Contato pelo site — " + servico + " (" + nome + ")";
    var corpo =
      "Nome: " + nome + "\n" +
      "E-mail: " + email + "\n" +
      "Telefone: " + (telefone || "não informado") + "\n" +
      "Serviço de interesse: " + servico + "\n\n" +
      "Mensagem:\n" + (mensagem || "—");

    var mailto =
      "mailto:" + DESTINO_EMAIL +
      "?subject=" + encodeURIComponent(assunto) +
      "&body=" + encodeURIComponent(corpo);

    window.location.href = mailto;
    feedback.textContent =
      "Abrindo seu aplicativo de e-mail... Se preferir, escreva direto para " +
      DESTINO_EMAIL + ".";
  });

  /* ---------- Parallax sutil do sol no hero ---------- */
  var sun = document.querySelector(".hero__sun");

  if (sun && !prefersReducedMotion && window.matchMedia("(pointer: fine)").matches) {
    var hero = document.querySelector(".hero");

    hero.addEventListener("mousemove", function (event) {
      var rect = hero.getBoundingClientRect();
      var x = (event.clientX - rect.left) / rect.width - 0.5;
      var y = (event.clientY - rect.top) / rect.height - 0.5;
      sun.style.marginRight = x * -26 + "px";
      sun.style.marginTop = y * -18 + "px";
    });
  }
})();
