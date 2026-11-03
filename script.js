const menuItems = [
  { category: "The pies", name: "The Ember", description: "Tomato, fior di latte, hot honey, basil, chili", price: "$18" },
  { category: "The pies", name: "Mushroom Moon", description: "Roasted mushroom, mozzarella, garlic cream, thyme", price: "$20" },
  { category: "The pies", name: "Green Light", description: "Pesto, spinach, zucchini, ricotta, lemon", price: "$19" },
  { category: "The pies", name: "Pepperoni Party", description: "Tomato, mozzarella, pepperoni, pickled jalapeño", price: "$21" },
  { category: "Small things", name: "Garlic knots", description: "Parmesan, parsley, whipped marinara", price: "$8" },
  { category: "Small things", name: "Market salad", description: "Seasonal greens, shaved fennel, lemon vinaigrette", price: "$10" },
  { category: "Sweet finish", name: "Olive oil cake", description: "Citrus, sea salt, mascarpone cream", price: "$9" }
];

function renderChrome() {
  const page = window.location.pathname.split("/").pop() || "index.html";
  const header = document.querySelector("[data-site-header]");
  const footer = document.querySelector("[data-site-footer]");
  if (header) {
    header.innerHTML = `<header class="site-header"><div class="container nav-wrap"><a class="logo" href="index.html">The people's pizza</a><button class="menu-toggle" aria-label="Open menu" aria-expanded="false">Menu <span>☰</span></button><nav class="site-nav"><a class="${page === "index.html" ? "active" : ""}" href="index.html">Home</a><a class="${page === "menu.html" ? "active" : ""}" href="menu.html">Menu</a><a class="${page === "calendar.html" ? "active" : ""}" href="calendar.html">Calendar</a><a class="${page === "about.html" ? "active" : ""}" href="about.html">About</a><a class="nav-cta" href="calendar.html">Find us <span>↗</span></a></nav></div></header>`;
    const toggle = header.querySelector(".menu-toggle");
    toggle.addEventListener("click", () => { const open = header.classList.toggle("nav-open"); toggle.setAttribute("aria-expanded", open); });
  }
  if (footer) footer.innerHTML = `<footer class="site-footer"><div class="container footer-grid"><div><a class="logo logo-light" href="index.html">The people's pizza</a><p class="footer-tagline">Pizza on the move.<br />Good times wherever we land.</p></div><div class="footer-links"><a href="calendar.html">Upcoming pop-ups</a><a href="menu.html">The menu</a><a href="mailto:hello@thepeoplespizza.example">Email us</a><a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram ↗</a></div></div><div class="container footer-bottom"><span>© 2024 The people's pizza</span><span>Made for hungry people.</span></div></footer>`;
}

function renderMenu() {
  const target = document.querySelector("#menu-list");
  if (!target) return;
  const categories = [...new Set(menuItems.map((item) => item.category))];
  target.innerHTML = categories.map((category) => `<section class="menu-category"><div class="menu-category-heading"><h2>${category}</h2><span></span></div>${menuItems.filter((item) => item.category === category).map((item) => `<article class="menu-item"><div><h3>${item.name}</h3><p>${item.description}</p></div><strong>${item.price}</strong></article>`).join("")}</section>`).join("");
}

renderChrome();
