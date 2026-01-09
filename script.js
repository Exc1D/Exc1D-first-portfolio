async function loadProjects() {
  try {
    const response = await fetch("projects.json");

    if (!response.ok) {
      throw new Error(`Error fetching projects: ${response.statusText}`);
    }
    const projects = await response.json();
    console.log(projects);
    renderProjects(projects);
  } catch (error) {
    console.error("Fetch error:", error.message);
  }
}

function renderProjects(projects) {
  const app = document.getElementById("app");

  // Define categories for display and order
  const categories = [
    "the-odin-project",
    "scrimba",
    "frontend-mentor",
    "personal",
  ];

  categories.forEach((category) => {
    const filtered = projects.filter(
      (project) => project.category === category
    );
    console.log(`Found ${filtered.length} projects for ${category}`);
    if (filtered.length > 0) {
      const cardsHTML = filtered
        .map(
          (project) => `
        <div class="card">
          <img class="card-image" src="${project.image}" alt="Screenshot of ${
            project.title
          }">
          <div class="card-content">
            <p class="card-title">${project.title}</p>
            <p class="card-desc">${project.description}</p>
            <div class="card-tech">
              ${project.tech
                .map((tech) => `<span class="tech-tag">${tech}</span>`)
                .join("")}
            </div>
            <div class="card-actions">
              <a href="${
                project.demo
              }" class="primary-card-btn" target="_blank">DEMO</a>
              <a href="${
                project.github
              }" class="card-btn" target="_blank">CODE</a>
            </div>
          </div>
        </div>`
        )
        .join("");

      const trackSection = `
      <section class="track-section">
        <h3>${category.replaceAll("-", " ").toUpperCase()}</h3>
        <div class="track">
          ${cardsHTML}
        </div>
      </section>
      `;

      app.innerHTML += trackSection;
    }
  });
}

function setupNerdMode() {
  const button = document.querySelector(".nerd-btn");

  if (!button) return; // safety: button not found

  button.addEventListener("click", () => {
    console.log("Button was clicked");
    // Toggle the 'debug' class to apply visual changes
    document.body.classList.toggle("debug");

    // If debug is active, update button text accordingly
    const isDebugActive = document.body.classList.contains("debug");
    button.textContent = `NERD MODE: ${isDebugActive ? "ON" : "OFF"}`;
  });
}

async function fetchGithubStatus() {
  const username = "Exc1D";
  const statusElement = document.getElementById("githubStatus");

  // helper to turn an ISO date into "x minutes/hours/days ago"
  function timeAgo(isoString) {
    const now = new Date();
    const then = new Date(isoString);
    const diffMs = now - then;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHrs = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHrs / 24);

    if (diffSec < 60) return "just now";
    if (diffMin < 60) return `${diffMin} minute${diffMin === 1 ? "" : "s"} ago`;
    if (diffHrs < 24) return `${diffHrs} hour${diffHrs === 1 ? "" : "s"} ago`;
    return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
  }

  try {
    // Fetch github events
    const response = await fetch(
      "https://api.github.com/users/Exc1D/events/public"
    );

    if (!response.ok) {
      throw new Error("Github API Error");
    }
    // Parse json
    const events = await response.json();

    // get multiple recent push events, e.g. top 3
    const recentPushes = events
      .filter((event) => event.type === "PushEvent")
      .slice(0, 3);

    if (recentPushes.length === 0) {
      statusElement.textContent = `No recent pushes for ${username}`;
      return;
    }

    // Build a small list of recent pushes
    const itemsHtml = recentPushes
      .map((event) => {
        const repoName = event.repo?.name ?? "Unknown repo";
        const commitMessage =
          event.payload?.commits?.[0]?.message ?? "No commit message";
        const relTime = timeAgo(event.created_at);

        return `<li>Push to <strong>${repoName}</strong>: "${commitMessage}" (${relTime})</li>`;
      })
      .join("");

    statusElement.innerHTML = `
      <p>Recent GitHub activity:</p>
      <ul>
        ${itemsHtml}
      </ul>
    `;
  } catch (error) {
    statusElement.textContent = "Unable to load GitHub status";
    console.error(error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadProjects();
  setupNerdMode();
  fetchGithubStatus();
});
