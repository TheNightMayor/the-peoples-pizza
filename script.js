const menuItems = [
  { category: "12-inch pizzas", name: "Comrade Zephrum", description: "Red sauce, mozzarella", price: "$15" },
  { category: "12-inch pizzas", name: "Comrade Hastur", description: "Pesto sauce, mozzarella", price: "$16" },
  { category: "12-inch pizzas", name: "Comrade Ostensibly", description: "Red sauce, mozzarella, pepperoni", price: "$16" },
  { category: "12-inch pizzas", name: "Comrade Teacup", description: "Red sauce, mozzarella, mushroom, onion, bell peppers", price: "$16" },
  { category: "12-inch pizzas", name: "Comrade Clawwdia", description: "Pesto sauce, mozzarella, chicken, red onion, ricotta", price: "$17" },
  { category: "Sweet finish", name: "Peanut butter & chocolate chip cookie", description: "One for $3 or two for $5", price: "$3" }
];

const calendarConfig = {
  calendarId: "YOUR_GOOGLE_CALENDAR_ID",
  apiKey: "YOUR_GOOGLE_CALENDAR_API_KEY",
  timeZone: "America/New_York"
};

function renderChrome() {
  const page = window.location.pathname.split("/").pop() || "index.html";
  const header = document.querySelector("[data-site-header]");
  const footer = document.querySelector("[data-site-footer]");
  if (header) {
    header.innerHTML = `<header class="site-header"><div class="container nav-wrap"><a class="logo" href="index.html">The people's pizza</a><button class="menu-toggle" aria-label="Open menu" aria-expanded="false">Menu <span>☰</span></button><nav class="site-nav"><a class="${page === "index.html" ? "active" : ""}" href="index.html">Home</a><a class="${page === "menu.html" ? "active" : ""}" href="menu.html">Menu</a><a class="${page === "calendar.html" ? "active" : ""}" href="calendar.html">Calendar</a><a class="${page === "about.html" ? "active" : ""}" href="about.html">About</a><a class="nav-cta" href="calendar.html">Find us <span>↗</span></a></nav></div></header>`;
    const toggle = header.querySelector(".menu-toggle");
    toggle.addEventListener("click", () => { const open = header.classList.toggle("nav-open"); toggle.setAttribute("aria-expanded", open); });
  }
  if (footer) footer.innerHTML = `<footer class="site-footer"><div class="container footer-grid"><div><a class="logo logo-light" href="index.html">The people's pizza <span class="logo-cat">🐈</span></a><p class="footer-tagline">Worker-owned pizza.<br />Solidarity wherever we land.</p></div><div class="footer-links"><a href="calendar.html">Upcoming assemblies</a><a href="menu.html">The menu</a><a href="mailto:hello@thepeoplespizza.example">Write to the collective</a><a href="https://instagram.com" target="_blank" rel="noreferrer">Catsgram ↗</a></div></div><div class="container footer-bottom"><span>© 2024 The people's pizza</span><span>Вперёд · Forward together.</span></div></footer>`;
}

function renderMenu() {
  const target = document.querySelector("#menu-list");
  if (!target) return;
  const categories = [...new Set(menuItems.map((item) => item.category))];
  target.innerHTML = categories.map((category) => `<section class="menu-category"><div class="menu-category-heading"><h2>${category}</h2><span></span></div>${menuItems.filter((item) => item.category === category).map((item) => `<article class="menu-item"><div><h3>${item.name}</h3><p>${item.description}</p></div><strong>${item.price}</strong></article>`).join("")}</section>`).join("");
}

function escapeHtml(value = "") {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[character]));
}

async function renderCalendar() {
  const target = document.querySelector("#events-list");
  if (!target) return;
  if (calendarConfig.calendarId.startsWith("YOUR_") || calendarConfig.apiKey.startsWith("YOUR_")) {
    target.innerHTML = `<div class="calendar-message"><strong>Calendar setup needed.</strong><p>Add the public Google Calendar ID and API key in <code>script.js</code> to show upcoming pop-ups here.</p></div>`;
    return;
  }

  const params = new URLSearchParams({
    key: calendarConfig.apiKey,
    timeMin: new Date().toISOString(),
    singleEvents: "true",
    orderBy: "startTime",
    maxResults: "12",
    timeZone: calendarConfig.timeZone
  });
  const endpoint = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarConfig.calendarId)}/events?${params}`;

  try {
    const response = await fetch(endpoint);
    if (!response.ok) throw new Error(`Google Calendar returned ${response.status}`);
    const data = await response.json();
    const events = data.items || [];
    if (!events.length) {
      target.innerHTML = `<div class="calendar-message"><strong>No upcoming pop-ups yet.</strong><p>Check back soon for the next event.</p></div>`;
      return;
    }
    target.innerHTML = events.map((event) => {
      const allDay = !event.start.dateTime;
      const start = event.start.dateTime || `${event.start.date}T12:00:00`;
      const date = new Date(start);
      const dateLabel = new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: calendarConfig.timeZone }).format(date);
      const timeLabel = allDay ? "All day" : new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", timeZone: calendarConfig.timeZone }).format(date);
      const summary = escapeHtml(event.summary || "Pizza pop-up");
      const location = escapeHtml(event.location || "");
      const description = escapeHtml(event.description || "").replace(/\n/g, "<br />");
      return `<article class="event-card"><div class="event-date"><strong>${dateLabel.split(",")[0]}</strong><span>${dateLabel.split(",").slice(1).join(",").trim()}</span></div><div class="event-details"><h3>${summary}</h3><p>${timeLabel}${location ? ` · ${location}` : ""}</p>${description ? `<p class="event-description">${description}</p>` : ""}</div></article>`;
    }).join("");
  } catch (error) {
    target.innerHTML = `<div class="calendar-message calendar-message-error"><strong>We couldn’t load the calendar.</strong><p>Check that the calendar is public and the API key is valid.</p></div>`;
    console.error("Unable to load Google Calendar events:", error);
  }
}

renderChrome();
renderCalendar();
