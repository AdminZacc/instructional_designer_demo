// ── Footer year ──────────────────────────────
document.querySelectorAll("#year").forEach((el) => {
  el.textContent = new Date().getFullYear();
});

// ── Mobile nav toggle ─────────────────────────
const toggle = document.querySelector(".nav__toggle");
const navLinks = document.querySelector(".nav__links");

if (toggle && navLinks) {
  toggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  // Close nav when a link is clicked
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

// ── Contact form (Formspree / fetch) ──────────
const form = document.getElementById("contact-form");
const status = document.getElementById("form-status");

if (form && status) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending…";
    status.className = "form-status";
    status.textContent = "";

    try {
      const data = new FormData(form);
      const response = await fetch(form.action, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        status.className = "form-status success";
        status.textContent = "Message sent! I'll get back to you soon.";
        form.reset();
      } else {
        throw new Error("Server error");
      }
    } catch {
      status.className = "form-status error";
      status.textContent = "Something went wrong. Please email me directly.";
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Send Message";
    }
  });
}

// ── Onboarding project interactions ───────────
const toolTabs = document.querySelectorAll(".tool-tab");
const toolPanels = document.querySelectorAll(".tool-panel");

if (toolTabs.length && toolPanels.length) {
  toolTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.getAttribute("data-tab");

      toolTabs.forEach((item) => {
        item.classList.remove("active");
        item.setAttribute("aria-selected", "false");
      });

      toolPanels.forEach((panel) => {
        panel.classList.toggle("active", panel.id === target);
      });

      tab.classList.add("active");
      tab.setAttribute("aria-selected", "true");
    });
  });
}

const scenarioButtons = document.querySelectorAll(".scenario-btn");
const scenarioFeedback = document.getElementById("scenario-feedback");

if (scenarioButtons.length && scenarioFeedback) {
  const feedbackMap = {
    escalate:
      "Strong choice. Escalating early protects compliance and builds confidence through coaching.",
    policy:
      "Solid choice. Checking policy first promotes consistency and helps avoid preventable errors.",
    guess:
      "Risky path. Guessing can create rework and compliance issues. Try policy review or escalation first.",
  };

  const toneMap = {
    escalate: "good",
    policy: "warn",
    guess: "risk",
  };

  scenarioButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const outcome = button.getAttribute("data-outcome");
      scenarioFeedback.textContent =
        feedbackMap[outcome] || "Select an option.";
      scenarioFeedback.className = `scenario-feedback ${toneMap[outcome] || ""}`;
    });
  });
}

// ── Branching scene simulator ─────────────────
const branchingModule = document.getElementById("branching-module");

if (branchingModule) {
  const scenes = branchingModule.querySelectorAll(".branch-scene");
  const stepIndicators = branchingModule.querySelectorAll(
    "[data-step-indicator]",
  );
  const progressBar = document.getElementById("branching-progress-bar");
  const resultBox = document.getElementById("branch-result");
  const restartButton = document.getElementById("branch-restart");

  const state = {
    step: 1,
    score: 0,
    track: [],
  };

  const showScene = (sceneId) => {
    scenes.forEach((scene) => {
      scene.classList.toggle(
        "active",
        scene.getAttribute("data-scene") === String(sceneId),
      );
    });
  };

  const updateProgress = () => {
    const percentMap = { 1: 12, 2: 40, 3: 72, result: 100 };
    const currentStep = state.step;
    progressBar.style.width = `${percentMap[currentStep] || 0}%`;

    stepIndicators.forEach((indicator) => {
      const stepNumber = Number(indicator.getAttribute("data-step-indicator"));
      indicator.classList.remove("active", "done");

      if (typeof currentStep === "number" && stepNumber < currentStep) {
        indicator.classList.add("done");
      }

      if (stepNumber === currentStep) {
        indicator.classList.add("active");
      }
    });
  };

  const setResult = () => {
    const allSafe = state.track.every((choice) => choice === "safe");
    const mostlySafe = state.score >= 4;

    resultBox.classList.remove("success", "partial", "retry");

    if (allSafe) {
      resultBox.classList.add("success");
      resultBox.textContent =
        "Excellent path. You modeled policy-first decision making, cognitive load control, and strong coaching communication. This is the target onboarding behavior.";
      return;
    }

    if (mostlySafe) {
      resultBox.classList.add("partial");
      resultBox.textContent =
        "Good progress. You made several effective decisions but still introduced risk in one moment. Add a policy check before action to improve consistency.";
      return;
    }

    resultBox.classList.add("retry");
    resultBox.textContent =
      "High-risk route. The learner moved too fast without structured checks. Retry and prioritize escalation, chunking, and policy alignment.";
  };

  branchingModule.querySelectorAll(".branch-choice").forEach((button) => {
    button.addEventListener("click", () => {
      const next = button.getAttribute("data-next");
      const points = Number(button.getAttribute("data-points") || 0);
      const track = button.getAttribute("data-track") || "risky";

      state.score += points;
      state.track.push(track);
      state.step = next === "result" ? "result" : Number(next);

      if (state.step === "result") {
        setResult();
      }

      updateProgress();
      showScene(state.step);
    });
  });

  if (restartButton) {
    restartButton.addEventListener("click", () => {
      state.step = 1;
      state.score = 0;
      state.track = [];
      updateProgress();
      showScene(1);
      resultBox.classList.remove("success", "partial", "retry");
      resultBox.textContent = "Reviewing your path...";
    });
  }

  updateProgress();
  showScene(1);
}
