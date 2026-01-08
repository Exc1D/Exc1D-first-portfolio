async function loadProjects(projects) {
  try {
    const response = await fetch("projects.json");
    const data = await response.json();
    renderProjects(data);
  } catch (error) {
    console.error("Error loading projects:", error);
    return [];
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
      console.warn("Unknown track:", track, "for project", project);
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
              <img class="card-image" src="${project.image}" alt="A screenshot of ${project.title}">
              <div class="card-content">
                <h4 class="card-title">${project.title}</h4>
                <p class="card-desc">${project.description}</p>
                <p class="card-tech">${project.tech}</p>
                <div class="card-actions">
                  <a href="${project.demo}" target="_blank" class="card-btn">DEMO</a>
                  <a href="${project.github}" target="_blank" class="card-btn">CODE</a>
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
