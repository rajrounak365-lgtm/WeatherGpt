// WeatherGPT Website Landing Page Script — Pure Static Presentation

// 1. Theme Toggle
const themeBtn = document.getElementById("themeToggle");
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("website_theme", theme);
  if (themeBtn) {
    themeBtn.textContent = theme === "dark" ? "☀" : "◐";
  }
}
if (themeBtn) {
  themeBtn.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme") || "dark";
    applyTheme(current === "dark" ? "light" : "dark");
  });
  const saved = localStorage.getItem("website_theme") || "dark";
  applyTheme(saved);
}

// 2. Mobile Nav Toggle
const mobileBtn = document.getElementById("navMobileToggle");
const navLinks = document.getElementById("navLinks");
if (mobileBtn && navLinks) {
  mobileBtn.addEventListener("click", () => {
    navLinks.classList.toggle("mobile-open");
  });
  // Close menu when link clicked on mobile
  navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("mobile-open");
    });
  });
}

// 3. Interactive Model Accuracy Simulator Chart
const gfsData = [34.5, 35.8, 36.2, 33.1, 31.5, 29.8, 28.5];
const era5Data = [31.8, 33.2, 33.5, 30.8, 29.2, 27.5, 26.2]; // Actual Ground Truth
const xgbData = [32.0, 33.4, 33.7, 30.9, 29.3, 27.6, 26.4];  // ML Corrected (MAE < 0.3°C)
const dates = ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00", "24:00"];

function drawChart(mode = "all") {
  const chartEl = document.getElementById("mlChart");
  if (!chartEl) return;
  const W = 800, H = 220, pad = 30;
  const min = 24, max = 38;

  function y(v) { return H - pad - ((v - min) / (max - min)) * (H - 2 * pad); }
  function x(i) { return pad + (i / (dates.length - 1)) * (W - 2 * pad); }

  let pathGFS = "", pathERA5 = "", pathXGB = "";
  for (let i = 0; i < dates.length; i++) {
    pathGFS += (i === 0 ? "M" : "L") + x(i) + "," + y(gfsData[i]) + " ";
    pathERA5 += (i === 0 ? "M" : "L") + x(i) + "," + y(era5Data[i]) + " ";
    pathXGB += (i === 0 ? "M" : "L") + x(i) + "," + y(xgbData[i]) + " ";
  }

  let html = `
    <!-- Grid lines -->
    <line x1="${pad}" y1="${y(35)}" x2="${W-pad}" y2="${y(35)}" stroke="var(--border)" stroke-dasharray="4 4" />
    <line x1="${pad}" y1="${y(30)}" x2="${W-pad}" y2="${y(30)}" stroke="var(--border)" stroke-dasharray="4 4" />
    <line x1="${pad}" y1="${y(25)}" x2="${W-pad}" y2="${y(25)}" stroke="var(--border)" stroke-dasharray="4 4" />
  `;

  if (mode === "all" || mode === "gfs") {
    html += `<path d="${pathGFS}" fill="none" stroke="#ef4444" stroke-width="2.5" stroke-dasharray="6 4" opacity="0.85" />`;
    gfsData.forEach((v, i) => {
      html += `<circle cx="${x(i)}" cy="${y(v)}" r="4" fill="#ef4444" />`;
    });
  }

  if (mode === "all" || mode === "era5") {
    html += `<path d="${pathERA5}" fill="none" stroke="#94a3b8" stroke-width="2" />`;
    era5Data.forEach((v, i) => {
      html += `<circle cx="${x(i)}" cy="${y(v)}" r="3" fill="#94a3b8" />`;
    });
  }

  if (mode === "all" || mode === "xgb") {
    html += `<path d="${pathXGB}" fill="none" stroke="#38bdf8" stroke-width="3" />`;
    xgbData.forEach((v, i) => {
      html += `<circle cx="${x(i)}" cy="${y(v)}" r="5" fill="#38bdf8" stroke="#020617" stroke-width="2" />`;
    });
  }

  chartEl.innerHTML = html;
}

document.querySelectorAll("[data-chart-mode]").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll("[data-chart-mode]").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    drawChart(btn.dataset.chartMode);
  });
});

drawChart("all");
