"use strict";

const DB_URL ="https://script.google.com/macros/s/AKfycbw_l5Bc0lZmPnUnp7ldAnWAb1TOCRpXJBiFOtJNZkF0PpTOQQiPG-zSN4Po6Lr-8r3pvg/exec"

const adminButton = document.getElementById("admin-btn");
const adminLoginSection = document.getElementById("admin-login");
const adminForm = document.getElementById("admin-form");
const userResponsesSection = document.getElementById("user-responses");
const userMessageContainer = document.getElementById("user-messages");
const contactForm = document.getElementById("contact-form");
const contactStatus = document.getElementById("contact-Status");
const adminStatus = document.getElementById("admin-Status");
const themeToggle = document.getElementById("toggle-theme");
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");


const savedTheme = localStorage.getItem("portfolio-theme");

function updateThemeButton() {
  if (!themeToggle) {
    return;
  }
  const isLight = document.body.classList.contains("light-theme");
  themeToggle.textContent = isLight ? "☀" : "◐";
  themeToggle.setAttribute(
    "aria-label", isLight ? "Switch to dark theme" : "Switch to light theme"
  );
}

if (savedTheme == "light") {
  document.body.classList.add("light-theme");
}
updateThemeButton();

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-theme");
    const isLight = document.body.classList.contains("light-theme");
    localStorage.setItem(
      "portfolio-theme",
      isLight ? "light" : "dark"
    );
    updateThemeButton();
  });
}

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("active");
    menuToggle.setAttribute("aria-expanded", Sting(isOpen));
    menuToggle.textContent = isOpen ? "x" : "☰";
  });
  const navigationLinks = navLinks.querySelectorAll("a");
  navigationLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.textContent = "☰";
    });
  });
}

if (adminButton && adminLoginSection) {
  adminButton.addEventListener("click", () => {
    if (navLinks && menuToggle) {
      navLinks.classList.remove("active");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.textContent = "☰";
    }
    adminLoginSection.style.display = "block";
    setTimeout(() => {
      adminLoginSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }, 50);
  });
}

function showStatus(element, message, type = "info") {
  if (!element) {
    return;
  }
  element.textContent = message;
  element.dataset.status = type;
  element.style.color = "";

  if(type === "success") {
    element.style.color = "var(--success)";
  }
  if (type === "error") {
    element.style.color = "var(--danger)";
  }
  if (type === "info") {
    element.style.color = "var(--text-soft)";
  }
}

if (contactForm) {
  contactForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const name = document.getElementById("input-name") ?.value.trim();
    const email = document.getElementById("input-email") ?.value.trim();
    const message = document.getElementById("input-msg") ?.value.trim();

    if (!name || !email || !message) {
      showStatus(contactStatus, "Please fill in all fields.", "error");
      return;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      showStatus(contactStatus, "Please enter a valid email address.","error");
      return;
    }
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton ? submitButton.innerHTML : "";
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.innerHTML = "Sending...";
    }
    showStatus(contactStatus, "Sending your message...", "info");

    try {
      const response = await fetch (DB_URL,{
        method: "POST",
        headers: {"Content-Type":"text/plain;charset=utf-8"},
        body: JSON.stringify({
          action: "save_message",
          name: name,
          email: email,
          msg: message
        })
      }
    );
    if (!response.ok) {
      throw new Error('HTTP error: ${response.status}');
    }
    const result = await response.json();
    if (result.success){
      showStatus(contactStatus, "Message sent succcessfully. Thank you!", "success");
      contactForm.reset();
    }
    else {
      showStatus(contactStatus, result.message || "Your message could not be saved", "error");
    }
  }
  catch (error) {
    console.error("Contact from errror:", error);
    showStatus(contactStatus, "Unable to send message right now. Please try again.", "error");
  }
  finally {
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.innerHTML = originalButtonText;
    }
  }
  });
}

if (adminForm) {
  adminForm.addEventListener("submit", async function (event){
    event.preventDefault();
    const username = document.getElementById("input-username")?.value.trim();
    const password = document.getElementById("input-password")?.value;
    if (!username || !password) {
      showStatus(adminStatus, "Please enter both username and password.", "error");
      return;
    }
    const loginButton = adminForm.querySelector('button[type="submit"]');
    const originalButtonText = loginButton? loginButton.innerHTML: "";

    if (loginButton) {
      loginButton.disabled = true;
      loginButton.innerHTML = "Authenticating...";
    }
    showStatus(adminStatus, "Authenticating...", "info");

    try {
      const response = await fetch(DB_URL,{
        method: "POST",
        headers: {"Content-Type":"text/plain;charset=utf-8"},
        body: JSON.stringify({
          action: "login",
          username: username,
          password: password
        })
      });
      if (!response.ok) {
        throw new Error('HTTP error: ${response.status}');
      }
      const result = await response.json();
      console.log("LOGIN RESPONSE:", result);
      if (result.success) {
        showStatus(adminStatus,"Login successful.","success");
        adminLoginSection.style.display = "none";
        userResponsesSection.style.display = "block";
        await getUserMessages();
        setTimeout(() => {
          userResponsesSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        }, 100);
      }
      else {
        showStatus(adminStatus,result.message || "Access denied. Please check your credentials.", "error");
      }
    }
    catch (error) {
      console.error("Admin login error:", error);
      showStatus(adminStatus, "Unable to contact the database. Please try again.","error");
    }
    finally {
      if (loginButton) {
        loginButton.disabled = false;
        loginButton.innerHTML = originalButtonText;
      }
    }
  });
}

async function getUserMessages() {
  if (!userMessageContainer) {
    return;
  }
  userMessageContainer.innerHTML ="";
  const loadingMessage = document.createElement("p");
  loadingMessage.textContent = "Loading responses...";
  loadingMessage.style.color = "var(--text-soft)";
  userMessageContainer.appendChild(loadingMessage);

  try {
    const response = await fetch(DB_URL);
    if (!response.ok) {
      throw new Error(
        'HTTP error: ${response.status}'
      );
    }
    const result = await response.json();
    userMessageContainer.innerHTML = "";
    if (!result.success) {
      showResponseError(result.message || "Could not retrieve messages.");
      return;
    }
    const messages = Array.isArray(result.messages)? result.messages: [];
    if (messages.length === 0) {
      const emptyMessage = document.createElement("div");
      emptyMessage.className = "response-card";
      const emptyTitle = document.createElement("h3");
      emptyTitle.textContent = "No messages yet";
      const emptyText = document.createElement("p");
      emptyText.className = "response-message";
      emptyMessage.appendChild(emptyTitle);
      userMessageContainer.appendChild(emptyText);
      userMessageContainer.appendChild(emptyMessage);
      return;
    }

    messages.forEach((message) => {
      const card = createResponseCard(message);
      userMessageContainer.appendChild(card);
    });
  }
  catch (error) {
    console.error(
      "Message retrieval error:",
      error
    );
    userMessageContainer.innerHTML = "";
    showResponseError("There was a problem retrieving messages.");

  }
}

function createResponseCard(message) {
  const card = document.createElement("article");
  card.className = "response-card";
  const header = document.createElement("div");
  header.className = "response-header";
  const name =document.createElement("h3");

  name.className ="response-name";

  name.textContent =
        message.name ||
        "Anonymous";

  const date = document.createElement("span");

  date.className ="response-date";

  date.textContent =
        message.date ||
        "Date unavailable";

  header.appendChild(name);
  header.appendChild(date);

  const email = document.createElement("p");

  email.className = "response-email";

  email.textContent =
        message.email ||
        "Email unavailable";

  const messageText = document.createElement("p");

  messageText.className ="response-message";

  messageText.textContent =
        message.msg ||
        "No message content.";

  card.appendChild(header);
  card.appendChild(email);
  card.appendChild(messageText);
  return card;
}

function showResponseError(message) {
  if (!userMessageContainer) {
    return;
  }
  const errorCard = document.createElement("div");
  errorCard.className = "response-card";
  const title = document.createElement("h3");
  title.textContent = "Unable to load responses";
  const text = document.createElement("p")
  text.textContent = message;
  errorCard.appendChild(title);
  errorCard.appendChild(text);
  userMessageContainer.appendChild(errorCard);
}

const revealElements =document.querySelectorAll(
        ".section-blocks, .project-card, .experience-card, .highlight-card, .skill-group"
    );

if ("IntersectionObserver" in window) {
    const revealObserver =
        new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) {
                        return;
                    }
                    entry.target.classList.add(
                        "visible"
                    );
                    observer.unobserve(
                        entry.target
                    );
                });
            },
            {
                threshold: 0.08
            }
        );
    revealElements.forEach((element) => {
        element.classList.add(
            "reveal-on-scroll"
        );
        revealObserver.observe(element);
    });
}

const currentYear =document.querySelector("[data-current-year]");

if (currentYear) {
    currentYear.textContent =
        new Date().getFullYear();
}

console.log(
    "%cPrabhleen Kaur — Portfolio",
    "color:#7effaa;font-size:18px;font-weight:bold;"
);

console.log(
    "%cCybersecurity • Development • Learning",
    "color:#a8b4af;font-size:12px;"
);
