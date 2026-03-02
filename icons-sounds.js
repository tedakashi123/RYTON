// Sound effects and enhanced icons for Ryton
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const sounds = {
  click: () => playSound(800, 0.1, 0.2),
  success: () => playSound(600, 0.2, 0.3),
  error: () => playSound(300, 0.2, 0.3),
  notification: () => playSound(1000, 0.1, 0.2)
};

function playSound(frequency, startTime, duration) {
  if (!audioContext) return;
  
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.frequency.value = frequency;
  oscillator.type = 'sine';
  
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration);
}

// Enhanced navigation with icons
function createNav() {
  return h("nav", { class: "nav" }, [
    h("div", { class: "brand" }, [
      h("img", { class: "brand__img", src: "/logo.jpeg", alt: "Ryton" }),
      h("span", {}, "Ryton")
    ]),
    h("div", { class: "links" }, [
      h("a", { href: "#/", class: "nav-link" }, [
        h("i", { class: "fas fa-home nav-icon" }, ""),
        "Inicio"
      ]),
      h("a", { href: "#/productos", class: "nav-link" }, [
        h("i", { class: "fas fa-shopping-bag nav-icon" }, ""),
        "Productos"
      ]),
      h("a", { href: "#/vender", class: "nav-link" }, [
        h("i", { class: "fas fa-hand-holding-usd nav-icon" }, ""),
        "Vender"
      ]),
      h("a", { href: "#/contacto", class: "nav-link" }, [
        h("i", { class: "fas fa-envelope nav-icon" }, ""),
        "Contacto"
      ]),
      h("a", { href: "#/blog", class: "nav-link" }, [
        h("i", { class: "fas fa-blog nav-icon" }, ""),
        "Blog"
      ]),
      h("a", { href: "#/carrito", class: "nav-link" }, [
        h("i", { class: "fas fa-shopping-cart nav-icon" }, ""),
        "Carrito"
      ]),
      h("a", { href: "#/cuenta", class: "nav-link" }, [
        h("i", { class: "fas fa-user nav-icon" }, ""),
        "Cuenta"
      ])
    ])
  ]);
}

// Sound toggle button
function createSoundToggle() {
  return h("button", { 
    class: "sound-toggle", 
    onclick: () => {
      const isEnabled = localStorage.getItem('soundsEnabled') !== 'false';
      localStorage.setItem('soundsEnabled', !isEnabled);
      sounds.notification();
    }
  }, [
    h("i", { class: "fas fa-volume-up" }, ""),
    " Sonido"
  ]);
}

// Initialize sound system
function initSoundSystem() {
  const soundToggle = createSoundToggle();
  document.body.appendChild(soundToggle);
}

// Enhanced toast with sound
function toast(title, message, type = "info") {
  const existing = document.querySelector(".toast");
  if (existing) existing.remove();
  
  const toastEl = h("div", { class: `toast ${type}` }, [
    h("div", { style: "font-weight:600;margin-bottom:4px" }, title),
    h("div", { style: "font-size:14px" }, message)
  ]);
  
  document.body.appendChild(toastEl);
  
  // Play sound based on type
  if (type === "success") sounds.success();
  if (type === "error") sounds.error();
  
  setTimeout(() => toastEl.remove(), 3000);
}

// Add sound effects to clicks
document.addEventListener('DOMContentLoaded', () => {
  // Add sound to all buttons
  document.querySelectorAll('.btn, .sound-click').forEach(btn => {
    btn.addEventListener('click', () => sounds.click());
  });
  
  // Add sound to navigation
  document.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => sounds.click());
  });
  
  // Add sound to form submissions
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', () => sounds.success());
  });
  
  // Initialize sound system
  initSoundSystem();
});
