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

const scenarioButtons = [
  document.getElementById("scenario-choice-1"),
  document.getElementById("scenario-choice-2"),
  document.getElementById("scenario-choice-3"),
].filter(Boolean);
const scenarioFeedback = document.getElementById("scenario-feedback");
const scenarioPrompt = document.getElementById("scenario-prompt");
const scenarioStep = document.getElementById("scenario-step");
const scenarioScore = document.getElementById("scenario-score");
const scenarioNext = document.getElementById("scenario-next");
const scenarioRestart = document.getElementById("scenario-restart");

if (
  scenarioButtons.length === 3 &&
  scenarioFeedback &&
  scenarioPrompt &&
  scenarioStep &&
  scenarioScore &&
  scenarioNext &&
  scenarioRestart
) {
  const miniScenarioQuestions = [
    {
      prompt:
        "A new employee receives a customer request that appears outside policy. What should they do first?",
      answers: [
        {
          label: "Escalate to supervisor",
          points: 2,
          tone: "good",
          feedback:
            "Excellent first move. Escalating quickly protects compliance and gets timely coaching.",
        },
        {
          label: "Make best guess and proceed",
          points: 0,
          tone: "risk",
          feedback:
            "Risky choice. Guessing can create rework and policy violations.",
        },
        {
          label: "Check policy guide first",
          points: 1,
          tone: "warn",
          feedback:
            "Good instinct. Policy review helps, but escalation is stronger in uncertain edge cases.",
        },
      ],
    },
    {
      prompt:
        "The learner is overwhelmed by multiple procedures. Which strategy should they use next?",
      answers: [
        {
          label: "Chunk tasks into short checkpoints",
          points: 2,
          tone: "good",
          feedback:
            "Great strategy. Chunking reduces cognitive load and improves retention.",
        },
        {
          label: "Memorize all steps at once",
          points: 0,
          tone: "risk",
          feedback:
            "Not ideal. Information overload reduces recall and increases errors.",
        },
        {
          label: "Skim and hope to remember later",
          points: 0,
          tone: "risk",
          feedback:
            "Weak strategy. Passive review rarely supports strong transfer to the job.",
        },
      ],
    },
    {
      prompt:
        "After a risky decision, what feedback approach best supports learning transfer?",
      answers: [
        {
          label: "Give immediate, specific coaching",
          points: 2,
          tone: "good",
          feedback:
            "Correct. Immediate and specific coaching drives behavior change.",
        },
        {
          label: "Wait until end of the week",
          points: 0,
          tone: "risk",
          feedback:
            "Too late. Delayed feedback weakens cause-and-effect learning.",
        },
        {
          label: "Only state the final score",
          points: 0,
          tone: "risk",
          feedback:
            "Insufficient. Scores without guidance do not clarify what to improve.",
        },
      ],
    },
  ];

  const scenarioState = {
    index: 0,
    score: 0,
    answered: false,
  };

  const renderScenarioQuestion = () => {
    const current = miniScenarioQuestions[scenarioState.index];
    scenarioPrompt.textContent = current.prompt;
    scenarioStep.textContent = `Question ${scenarioState.index + 1} of ${miniScenarioQuestions.length}`;
    scenarioScore.textContent = `Score: ${scenarioState.score}`;
    scenarioFeedback.className = "scenario-feedback";
    scenarioFeedback.textContent =
      "Choose an option to see coaching feedback, then continue.";
    scenarioNext.disabled = true;
    scenarioNext.textContent =
      scenarioState.index === miniScenarioQuestions.length - 1
        ? "See Results"
        : "Next Question";

    scenarioButtons.forEach((button, idx) => {
      button.disabled = false;
      button.classList.remove("is-selected");
      button.textContent = current.answers[idx].label;
    });

    scenarioRestart.hidden = true;
    scenarioState.answered = false;
  };

  const renderScenarioResult = () => {
    scenarioStep.textContent = "Complete";
    scenarioPrompt.textContent = "Mini Scenario Results";
    scenarioButtons.forEach((button) => {
      button.disabled = true;
      button.classList.remove("is-selected");
    });
    scenarioNext.disabled = true;
    scenarioRestart.hidden = false;

    const maxScore = miniScenarioQuestions.length * 2;
    const pct = Math.round((scenarioState.score / maxScore) * 100);

    if (pct >= 84) {
      scenarioFeedback.className = "scenario-feedback good";
      scenarioFeedback.textContent = `Strong performance (${scenarioState.score}/${maxScore}). You consistently used high-impact instructional decisions.`;
      return;
    }

    if (pct >= 50) {
      scenarioFeedback.className = "scenario-feedback warn";
      scenarioFeedback.textContent = `Solid start (${scenarioState.score}/${maxScore}). You showed good instincts with room to tighten decision consistency.`;
      return;
    }

    scenarioFeedback.className = "scenario-feedback risk";
    scenarioFeedback.textContent = `Needs reinforcement (${scenarioState.score}/${maxScore}). Retry and prioritize escalation, chunking, and immediate feedback.`;
  };

  scenarioButtons.forEach((button, idx) => {
    button.addEventListener("click", () => {
      if (scenarioState.answered) {
        return;
      }

      const current = miniScenarioQuestions[scenarioState.index];
      const selected = current.answers[idx];
      scenarioState.score += selected.points;
      scenarioState.answered = true;

      scenarioButtons.forEach((item) => {
        item.disabled = true;
        item.classList.remove("is-selected");
      });
      button.classList.add("is-selected");

      scenarioFeedback.className = `scenario-feedback ${selected.tone}`;
      scenarioFeedback.textContent = selected.feedback;
      scenarioScore.textContent = `Score: ${scenarioState.score}`;
      scenarioNext.disabled = false;
    });
  });

  scenarioNext.addEventListener("click", () => {
    if (scenarioState.index < miniScenarioQuestions.length - 1) {
      scenarioState.index += 1;
      renderScenarioQuestion();
      return;
    }

    renderScenarioResult();
  });

  scenarioRestart.addEventListener("click", () => {
    scenarioState.index = 0;
    scenarioState.score = 0;
    scenarioState.answered = false;
    renderScenarioQuestion();
  });

  renderScenarioQuestion();
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
