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

// ── Storyline mock interaction preview ───────
const storylineButtons = document.querySelectorAll("[data-storyline-choice]");
const storylineFeedback = document.getElementById("storyline-mock-feedback");
const storylineStages = document.querySelectorAll("[data-storyline-stage]");
const storylineTitle = document.getElementById("storyline-mock-title");
const storylineDescription = document.getElementById(
  "storyline-mock-description",
);
const storylineChoicesWrap = document.querySelector(".storyline-mock__choices");

if (
  storylineButtons.length &&
  storylineFeedback &&
  storylineStages.length &&
  storylineTitle &&
  storylineDescription &&
  storylineChoicesWrap
) {
  const stageCopy = {
    1: {
      title: "Customer Exception Request",
      description:
        "A customer asks for policy bypass. Start in Context, then move to Decision.",
      showChoices: false,
      feedback:
        "Context stage: review the situation first, then open Decision to choose an action.",
      tone: "",
    },
    2: {
      title: "Decision",
      description:
        "Now choose a response path. Your selection will move to Feedback automatically.",
      showChoices: true,
      feedback: "Decision stage: select one option to see coaching feedback.",
      tone: "",
    },
    3: {
      title: "Feedback",
      description:
        "Review the consequence and coaching note. You can return to Decision to try again.",
      showChoices: false,
      feedback:
        "Feedback stage: this is where Storyline delivers immediate coaching based on learner action.",
      tone: "",
    },
  };

  const storylineMessages = {
    safe: "Correct path. Escalating keeps policy intact and gives the learner guided support before action.",
    risk: "Risk path selected. Quick approval can create compliance issues and rework. Consider escalation first.",
  };

  const setStorylineStage = (stage, preserveFeedback = false) => {
    const nextStage = String(stage);
    const config = stageCopy[nextStage] || stageCopy[1];

    storylineStages.forEach((item) => {
      item.classList.toggle(
        "active",
        item.getAttribute("data-storyline-stage") === nextStage,
      );
    });

    storylineTitle.textContent = config.title;
    storylineDescription.textContent = config.description;
    storylineChoicesWrap.style.display = config.showChoices ? "grid" : "none";

    if (!preserveFeedback) {
      storylineFeedback.classList.remove("safe", "risk");
      storylineFeedback.textContent = config.feedback;
    }
  };

  storylineStages.forEach((stageButton) => {
    stageButton.addEventListener("click", () => {
      const stage = stageButton.getAttribute("data-storyline-stage") || "1";
      setStorylineStage(stage);
    });
  });

  storylineButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const choice = button.getAttribute("data-storyline-choice") || "risk";

      storylineButtons.forEach((item) => {
        item.classList.remove("is-selected");
      });
      button.classList.add("is-selected");

      storylineFeedback.classList.remove("safe", "risk");
      storylineFeedback.classList.add(choice);
      storylineFeedback.textContent = storylineMessages[choice];

      // Move to Feedback stage once the learner makes a decision.
      setStorylineStage("3", true);
    });
  });

  setStorylineStage("1");
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
  const mapNodes = document.querySelectorAll(".branch-node[data-jump-scene]");
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

    mapNodes.forEach((node) => {
      const target = node.getAttribute("data-jump-scene");
      node.classList.toggle("active", target === String(currentStep));
    });
  };

  const setResult = () => {
    const allSafe = state.track.every((choice) => choice === "safe");
    const mostlySafe = state.score >= 4;

    resultBox.classList.remove("success", "partial", "retry", "demo");

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
      resultBox.classList.remove("success", "partial", "retry", "demo");
      resultBox.textContent = "Reviewing your path...";
    });
  }

  const jumpToScene = (jumpTarget) => {
    state.step = jumpTarget === "result" ? "result" : Number(jumpTarget);

    if (state.step === "result") {
      resultBox.classList.remove("success", "partial", "retry");
      resultBox.classList.add("demo");
      resultBox.textContent =
        "Demo mode: this is the outcome screen preview. Complete the scenario choices to generate a scored coaching result.";
    } else {
      resultBox.classList.remove("success", "partial", "retry", "demo");
      resultBox.textContent = "Reviewing your path...";
    }

    updateProgress();
    showScene(state.step);
  };

  if (mapNodes.length) {
    mapNodes.forEach((node) => {
      node.addEventListener("click", () => {
        const jumpTarget = node.getAttribute("data-jump-scene") || "1";
        jumpToScene(jumpTarget);
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
        return;
      }

      const target = event.target;
      const isTypingContext =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement ||
        (target instanceof HTMLElement && target.isContentEditable);

      if (isTypingContext) {
        return;
      }

      const keyToScene = {
        1: "1",
        2: "2",
        3: "3",
        0: "result",
      };

      const jumpTarget = keyToScene[event.key];
      if (!jumpTarget) {
        return;
      }

      event.preventDefault();
      jumpToScene(jumpTarget);
    });
  }

  updateProgress();
  showScene(1);
}
