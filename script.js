function showFormMessage(text, type) {
  const messageBox = document.getElementById("formMessage");
  if (!messageBox) return;
  messageBox.textContent = text;
  messageBox.className = "form-message " + type;
}

function validateForm() {
  let name = document.getElementById("name").value.trim();
  let email = document.getElementById("email").value.trim();
  let message = document.getElementById("message").value.trim();

  if (name === "" || email === "" || message === "") {
    showFormMessage("Please fill in all fields before sending.", "error");
    return false;
  }

  showFormMessage("Message sent successfully! We will contact you shortly.", "success");
  document.getElementById("contactForm").reset();
  return false; // keep page from reloading for this demo
}

function setupPageTransitions() {
  document.body.classList.add("fade-in");

  const isLocalLink = (href) => {
    if (!href) return false;
    if (href.startsWith("http://") || href.startsWith("https://") || href.startsWith("mailto:") || href.startsWith("tel:")) return false;
    if (href.startsWith("#")) return false;
    return true;
  };

  document.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      if (!isLocalLink(href)) return;
      event.preventDefault();
      document.body.classList.remove("fade-in");
      document.body.classList.add("fade-out");
      setTimeout(() => {
        window.location.href = href;
      }, 440);
    });
  });
}

function forceDownload(filename, text) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

function getReportContent() {
  return `Cybersecurity & Cybercrime Awareness Report 2026\n\n` +
    `1. Introduction\n` +
    `- This report is produced for the Cybersecurity & Cybercrime Awareness program.\n` +
    `- Focus: MoMo Fraud, Fake Job Recruitment, Trader risk mitigation.\n\n` +
    `2. Regional threat summary\n` +
    `- MoMo fraud highest-reported scam vector in Ghana 2026.\n` +
    `- NCA, MTN, Vodafone, AirtelTigo alerts show social engineering activity.\n\n` +
    `3. Case statistics\n` +
    `- 95% of fraud attempts are calls/SMS social engineering.\n` +
    `- 70% report OTP pressure.\n` +
    `- 62% lack incident-report process.\n\n` +
    `4. Recommended actions\n` +
    `- Never share OTP with anyone.\n` +
    `- Validate all payment requests with official numbers.\n` +
    `- Use MFA, password management, and monitoring.\n` +
    `- Report incidents to NCA and your bank.\n\n` +
    `5. Community plan\n` +
    `- Weekly awareness sessions at markets.\n` +
    `- Rapid-report channel: fraudreport@umat.edu.gh.\n` +
    `- Audit after 30 days.\n`;
}

function setupDownloadLinks() {
  const reportContent = getReportContent();
  const downloadBtn = document.getElementById("downloadReportButton");
  const reportText = document.getElementById("reportTextBlock");
  const showBtn = document.getElementById("showReportBtn");

  if (reportText) {
    reportText.textContent = reportContent;
  }

  if (showBtn) {
    showBtn.addEventListener("click", () => {
      if (!reportText) return;
      reportText.classList.toggle("hidden");
      showBtn.textContent = reportText.classList.contains("hidden") ? "Show Report Text" : "Hide Report Text";
    });
  }

  if (downloadBtn) {
    downloadBtn.addEventListener("click", () => {
      forceDownload("Cybercrime-Report-2026.txt", reportContent);
    });

    setTimeout(() => {
      forceDownload("Cybercrime-Report-2026.txt", reportContent);
    }, 1500);
  }
}

function getFraudReports() {
  const raw = localStorage.getItem("fraudReports");
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveFraudReport(data) {
  const reports = getFraudReports();
  reports.unshift({ ...data, id: Date.now(), createdAt: new Date().toLocaleString() });
  localStorage.setItem("fraudReports", JSON.stringify(reports));
  renderFraudReports();
}

function renderFraudReports() {
  const tableBody = document.querySelector("#fraudReportsTable tbody");
  if (!tableBody) return;

  const reports = getFraudReports();
  if (!reports.length) {
    tableBody.innerHTML = `<tr><td colspan="6">No reports submitted yet.</td></tr>`;
    return;
  }

  tableBody.innerHTML = reports.map((r) => `
    <tr>
      <td>${r.createdAt}</td>
      <td>${r.type}</td>
      <td>${r.amount}</td>
      <td>${r.location}</td>
      <td>${r.platform}</td>
      <td>${r.description}</td>
    </tr>
  `).join("");
}

function setupFraudForm() {
  const form = document.getElementById("fraudReportForm");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = {
      type: document.getElementById("reportType").value.trim(),
      amount: document.getElementById("reportAmount").value.trim(),
      location: document.getElementById("reportLocation").value.trim(),
      platform: document.getElementById("reportPlatform").value.trim(),
      description: document.getElementById("reportDetails").value.trim(),
    };

    if (!data.type || !data.amount || !data.description) {
      showFormMessage("Please enter type, amount and description.", "error");
      return;
    }

    saveFraudReport(data);
    showFormMessage("Fraud report saved locally and displayed below.", "success");
    form.reset();
  });
}

function updateScrollProgress() {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  const bar = document.getElementById("scrollBar");
  if (bar) bar.style.width = `${scrollPercent}%`;
}

function startNumberCounting() {
  const counters = document.querySelectorAll('.count-up');
  counters.forEach((counter) => {
    const target = parseInt(counter.getAttribute('data-target') || '0', 10);
    let current = 0;
    const step = Math.max(1, Math.floor(target / 30));
    const interval = setInterval(() => {
      current += step;
      if (current >= target) {
        counter.textContent = String(target);
        clearInterval(interval);
      } else {
        counter.textContent = String(current);
      }
    }, 25);
  });
}

function setupScrollAnimations() {
  const items = document.querySelectorAll('.animate-item');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      }
    });
  }, { threshold: 0.2 });
  items.forEach((item) => observer.observe(item));
}

function setupLightbox() {
  const overlay = document.getElementById('lightboxOverlay');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const closeBtn = document.getElementById('lightboxClose');

  if (!overlay || !lightboxImage || !lightboxCaption || !closeBtn) return;

  const closeLightbox = () => {
    overlay.classList.add('hidden');
    overlay.setAttribute('aria-hidden', 'true');
    lightboxImage.src = '';
  };

  const fallbackImage = 'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="450" height="300" viewBox="0 0 450 300"%3E%3Crect width="450" height="300" fill="%231a253f"/%3E%3Ctext x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23a1dfff" font-family="Segoe UI,Arial,sans-serif" font-size="20"%3EImage unavailable%3C/text%3E%3C/svg%3E';

  document.querySelectorAll('.gallery-item img').forEach((img) => {
    img.onerror = () => {
      const fallbackPaths = [];
      const imageSrc = img.src;
      const imageName = imageSrc.split('/').pop();

      if (img.dataset.altSrc) {
        const altSources = img.dataset.altSrc.split(',').map(s => s.trim()).filter(Boolean);
        fallbackPaths.push(...altSources);
      }

      if (imageSrc.includes('/gallery/')) {
        fallbackPaths.push(imageSrc.replace('/gallery/', '/'));
        fallbackPaths.push(imageSrc.replace('/gallery/', '/gallery-event')); // e.g., /gallery/gallery-event1.jpg
      }

      if (imageSrc.includes('/gallery-event')) {
        fallbackPaths.push(imageSrc.replace('/gallery-event', '/event'));
      }

      if (!imageName.startsWith('gallery-event') && !imageName.startsWith('event')) {
        fallbackPaths.push(`images/gallery/gallery-${imageName}`);
        fallbackPaths.push(`images/${imageName}`);
      }

      const currentFallback = img.dataset.fallbackStep ? Number(img.dataset.fallbackStep) : 0;
      if (currentFallback < fallbackPaths.length) {
        img.dataset.fallbackStep = String(currentFallback + 1);
        img.src = fallbackPaths[currentFallback];
        return;
      }

      img.src = fallbackImage;
      img.alt = 'Image could not be loaded';
    };

    img.addEventListener('click', () => {
      lightboxImage.src = img.src;
      lightboxImage.alt = img.alt || 'Gallery image';
      lightboxCaption.textContent = img.closest('figure')?.querySelector('.gallery-caption')?.textContent || '';
      overlay.classList.remove('hidden');
      overlay.removeAttribute('aria-hidden');
    });
  });

  closeBtn.addEventListener('click', closeLightbox);
  overlay.addEventListener('click', (event) => {
    if (event.target === overlay || event.target === closeBtn) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeLightbox();
    }
  });
}

window.addEventListener('scroll', updateScrollProgress);

window.addEventListener('load', () => {
  const overlay = document.getElementById('pageOverlay');
  if (overlay) {
    overlay.classList.add('hidden');
    setTimeout(() => overlay.remove(), 800);
  }
  updateScrollProgress();
  startNumberCounting();
  setupScrollAnimations();
});

  function initParticles() {
    const canvas = document.createElement('canvas');
    canvas.id = 'particlesCanvas';
    canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:1;opacity:0.3;';
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    let particles = [];
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: Math.random() * 0.5 + 0.2,
        size: Math.random() * 2 + 1,
        color: `hsl(${Math.random()*60 + 180}, 100%, 60%)`
      });
    }
    
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y > canvas.height) p.y = 0;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      requestAnimationFrame(animate);
    }
    animate();
    
    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });
  }

  function addGlitchEffect() {
    document.querySelectorAll('.linkedin-card').forEach(card => {
      card.addEventListener('mouseenter', () => card.classList.add('glitch'));
      card.addEventListener('mouseleave', () => card.classList.remove('glitch'));
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    console.log('Cyber Awareness script: DOM loaded');
    setupPageTransitions();
    setupDownloadLinks();
    setupFraudForm();
    renderFraudReports();
    setupLightbox();
    updateScrollProgress();
    initParticles();
    addGlitchEffect();
  });
