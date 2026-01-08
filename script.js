async function loadProjects() {
  try {
    const response = await fetch("projects.json");
    const projects = await response.json();
    renderProjects(projects);
  } catch (error) {
    console.error("Error loading projects:", error);
  }
}

function renderProjects(projects) {
  const app = document.getElementById("app");
  app.innerHTML = "";
  const tracks = {
    personal: [],
    odin: [],
    scrimba: [],
    "frontend-mentor": [],
  };

  projects.forEach((project) => {
    const cat = project.category;

    if (tracks[cat]) {
      tracks[cat].push(project);
    } else {
      console.warn("Unknown track:", cat, "for project", project);
    }
  });

  // key = category, list = [project1, project2...]
  Object.entries(tracks).forEach(([key, list]) => {
    if (list.length === 0) return; // Skip empty tracks

    const sectionTitle = key.toUpperCase().replace("-", " ");
    const html = `
      <section class="track-section">
      <h3>${sectionTitle}</h3>
      <div class="track">
        ${list
          .map(
            (project) => `
            <div class="card">
              <img class="card-image" src="${
                project.image
              }" alt="A screenshot of ${project.title}">
              <div class="card-content">
                <h4 class="card-title">${project.title}</h4>
                <p class="card-desc">${project.description}</p>
                <div class="tech-stack" style="margin-top: auto;">
                    ${project.tech
                      .map(
                        (tech) =>
                          `<span class="tech-tag" style="font-size: 0.75rem; padding: 4px 8px;">${tech}</span>`
                      )
                      .join("")}
                </div>
                <div class="card-actions">
                  <a href="${
                    project.demo
                  }" target="_blank" class="primary-card-btn">DEMO</a>
                  <a href="${
                    project.github
                  }" target="_blank" class="card-btn">CODE</a>
                </div>
              </div>
            </div>`
          )
          .join("")}
      </div>
      </section>
    `;
    app.innerHTML += html;
  });
}

loadProjects();

async function getGithubStats() {
  const statusDiv = document.getElementById("githubStatus");
  const username = "Exc1D";

  try {
    const response = await fetch(
      `https://api.github.com/users/${username}/events/public`
    );
    const data = await response.json();

    console.log("Github Data Received:", data);

    // Find the first "PushEvent"
    const lastPush = data.find((event) => event.type === "PushEvent");

    if (lastPush) {
      const { repo, payload } = lastPush;
      const repoName = repo.name.split("/")[1];

      // Check if commits array exists and has items
      if (payload.commits && payload.commits.length > 0) {
        const { message } = payload.commits[0];
        statusDiv.innerHTML = `LATEST_COMMIT: [${repoName}] ${message}`;
      } else {
        // Fallback if commits array is empty or undefined
        statusDiv.innerHTML = `LATEST_COMMIT: [${repoName}] Push detected (no commit message)`;
      }
    } else {
      statusDiv.innerHTML = "LATEST_COMMIT: No recent pushes found";
    }
  } catch (error) {
    console.error("CRITICAL ERROR:", error);
    statusDiv.innerHTML = "SYSTEM_OFFLINE: Github unreachable";
  }
}

getGithubStats();
