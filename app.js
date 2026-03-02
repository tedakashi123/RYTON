// Frontend SPA (vanilla JS) conectado a /api

const API = "/api";

const state = {
  token: localStorage.getItem("token") || "",
  user: JSON.parse(localStorage.getItem("user") || "null"),
  cart: JSON.parse(localStorage.getItem("cart") || "[]")
};

const elApp = document.getElementById("app");
const elCartCount = document.getElementById("cartCount");
const elAccountBtn = document.getElementById("accountBtn");
const elMenuBtn = document.getElementById("menuBtn");
const elMobileMenu = document.getElementById("mobileMenu");

// Geo check: Colombia only
window.closeGeoNotice = () => {
  const el = document.getElementById('geo-notice');
  if (el) el.style.display = 'none';
};

async function checkGeoColombia() {
  // 1) Try browser geolocation API
  if ('geolocation' in navigator) {
    try {
      const pos = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 8000, enableHighAccuracy: false });
      });
      const { latitude, longitude } = pos.coords;
      // Rough bounding box for Colombia
      if (latitude < -4.23 || latitude > 12.52 || longitude < -79.1 || longitude > -66.87) {
        showGeoBlocked();
        return;
      }
    } catch (e) {
      // Fall back to IP-based check
    }
  }
  // 2) Fallback: IP-based country detection via ipapi.co (free tier, no key needed)
  try {
    const res = await fetch('https://ipapi.co/json/');
    const data = await res.json();
    if (data.country !== 'CO') {
      showGeoBlocked();
      return;
    }
  } catch (e) {
    // If both fail, allow access (could be offline/dev)
  }
}

function showGeoBlocked() {
  const el = document.getElementById('geo-notice');
  if (el) {
    el.style.display = 'flex';
    // Optionally blur or hide main content
    const app = document.getElementById('app');
    if (app) app.style.display = 'none';
  }
}

// Run geo check on load
checkGeoColombia();

// Scroll reveal animations
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  const revealThreshold = 100;
  
  function checkReveals() {
    reveals.forEach(el => {
      const rect = el.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight - revealThreshold;
      if (isVisible && !el.classList.contains('revealed')) {
        el.classList.add('revealed');
      }
    });
  }
  
  window.addEventListener('scroll', checkReveals);
  checkReveals(); // Initial check
}

// Initialize after DOM loads
document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  updateAuthUI();
  updateCartUI();
});

function setCart(cart) {
  state.cart = cart;
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCartCount();
}

function renderCartCount() {
  const count = state.cart.reduce((acc, it) => acc + Number(it.quantity || 0), 0);
  elCartCount.textContent = String(count);
}

function setSession({ token, user }) {
  state.token = token || "";
  state.user = user || null;
  if (state.token) localStorage.setItem("token", state.token);
  else localStorage.removeItem("token");
  if (state.user) localStorage.setItem("user", JSON.stringify(state.user));
  else localStorage.removeItem("user");
  updateAccountButton();
}

function updateAccountButton() {
  elAccountBtn.textContent = state.user ? `Hola, ${state.user.name.split(" ")[0]}` : "Cuenta";
}

function toast(title, description) {
  const wrap = document.getElementById("toastWrap");
  const t = document.createElement("div");
  t.className = "toast";
  t.innerHTML = `<div class="toast__t"></div><div class="toast__d"></div>`;
  t.querySelector(".toast__t").textContent = title;
  t.querySelector(".toast__d").textContent = description || "";
  wrap.appendChild(t);
  setTimeout(() => t.remove(), 3800);
}

async function api(path, opts = {}) {
  const headers = new Headers(opts.headers || {});
  if (!(opts.body instanceof FormData)) {
    if (!headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  }
  if (state.token) headers.set("Authorization", `Bearer ${state.token}`);

  const res = await fetch(`${API}${path}`, { ...opts, headers });
  const contentType = res.headers.get("content-type") || "";
  const data = contentType.includes("application/json") ? await res.json() : await res.text();
  if (!res.ok) {
    const msg = typeof data === "string" ? data : data?.error || "Error";
    const err = new Error(msg);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

function currency(n, code = "COP") {
  try {
    return new Intl.NumberFormat("es-CO", { style: "currency", currency: code, maximumFractionDigits: 0 }).format(n);
  } catch {
    return `${n} ${code}`;
  }
}

function h(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (k === "class") node.className = v;
    else if (k.startsWith("on") && typeof v === "function") node.addEventListener(k.slice(2).toLowerCase(), v);
    else if (v === false || v === null || v === undefined) {}
    else node.setAttribute(k, String(v));
  }
  for (const c of Array.isArray(children) ? children : [children]) {
    if (c === null || c === undefined) continue;
    node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
  }
  return node;
}

function route() {
  const hash = location.hash || "#/";
  const [path] = hash.slice(1).split("?");
  return path || "/";
}

function navigate(p) {
  location.hash = `#${p}`;
}

function mount(node) {
  elApp.innerHTML = "";
  elApp.appendChild(node);
}

function layoutPage(title, subtitle, bodyNode) {
  const header = h("div", { class: "card hero" }, [
    h("div", { class: "hero__blob" }),
    h("div", { class: "hero__grid" }, [
      h("div", {}, [
        h("h1", { class: "hero__title bounce-in" }, title),
        h("p", { class: "hero__subtitle" }, subtitle),
        h("div", { class: "hero__cta" }, [])
      ]),
      h("div", { class: "card pulse-glow", style: "padding:16px;border-radius:14px;background:rgba(255,255,255,0.04);" }, [
        h("div", { style: "font-weight:900" }, "Garantía y soporte"),
        h("div", { style: "color:var(--muted);margin-top:8px;font-size:13px" }, "Equipos revisados, listos para trabajar. Compra segura y venta sin complicaciones."),
        h("div", { style: "margin-top:12px;display:grid;gap:8px" }, [
          h("div", { class: "feature" }, [h("div", { class: "feature__t" }, "Reacondicionado premium"), h("div", { class: "feature__d" }, "Pruebas, limpieza y optimización.")]),
          h("div", { class: "feature" }, [h("div", { class: "feature__t" }, "Compra y venta"), h("div", { class: "feature__d" }, "Recibimos tu equipo usado y te ofertamos.")])
        ])
      ]),
    ])
  ]);

  return h("div", { class: "section", style: "display:grid;gap:14px" }, [header, bodyNode]);
}

function homePage() {
  const body = h("div", { class: "section", style: "display:grid;gap:14px" }, [
    h("div", { class: "card", style: "padding:14px" }, [
      h("div", { class: "section__title wave-text" }, "Marcas que trabajamos"),
      h("a", { class: "brand", href: "#/" }, [
        h("img", { class: "brand__img", src: "/logo.jpeg", alt: "Ryton" }),
        h("span", {}, "Ryton")
      ]),
      h("div", { class: "links" }, [
        h("a", { href: "#/", class: "nav-link slide-up" }, [
          h("i", { class: "fas fa-home nav-icon" }, ""),
          "Inicio"
        ]),
        h("a", { href: "#/productos", class: "nav-link slide-up" }, [
          h("i", { class: "fas fa-shopping-bag nav-icon" }, ""),
          "Productos"
        ]),
        h("a", { href: "#/vender", class: "nav-link slide-up" }, [
          h("i", { class: "fas fa-hand-holding-usd nav-icon" }, ""),
          "Vender"
        ]),
        h("a", { href: "#/contacto", class: "nav-link slide-up" }, [
          h("i", { class: "fas fa-envelope nav-icon" }, ""),
          "Contacto"
        ]),
        h("a", { href: "#/blog", class: "nav-link slide-up" }, [
          h("i", { class: "fas fa-blog nav-icon" }, ""),
          "Blog"
        ]),
        h("a", { href: "#/carrito", class: "nav-link slide-up" }, [
          h("i", { class: "fas fa-shopping-cart nav-icon" }, ""),
          "Carrito"
        ]),
        h("a", { href: "#/cuenta", class: "nav-link slide-up" }, [
          h("i", { class: "fas fa-user nav-icon" }, ""),
          "Cuenta"
        ])
      ]),
      h("div", { style: "color:var(--muted);margin-top:10px;font-size:13px" }, "Disponibilidad según inventario. Si buscas un modelo específico, escríbenos desde Contacto.")
    ]),

    h("div", { class: "card", style: "padding:14px" }, [
      h("div", { class: "section__title" }, "¿Por qué Ryton?"),
      h("div", { class: "grid3" }, [
        h("div", { class: "feature" }, [h("div", { class: "feature__t" }, "Ahorro inteligente"), h("div", { class: "feature__d" }, "Equipos premium reacondicionados con precios justos.")]),
        h("div", { class: "feature" }, [h("div", { class: "feature__t" }, "Calidad verificada"), h("div", { class: "feature__d" }, "Revisión, pruebas y optimización antes de publicar.")]),
        h("div", { class: "feature" }, [h("div", { class: "feature__t" }, "Experiencia simple"), h("div", { class: "feature__d" }, "Catálogo con filtros, carrito dinámico y confirmación por correo.")])
      ])
    ]),

    h("div", { class: "card", style: "padding:14px" }, [
      h("div", { class: "section__title" }, "Cómo funciona"),
      h("div", { class: "how" }, [
        h("div", { class: "how__col" }, [
          h("div", { class: "how__title" }, "Comprar"),
          h("div", { class: "how__step" }, [h("div", { class: "how__n" }, "1"), h("div", {}, [h("div", { class: "how__t" }, "Explora el catálogo"), h("div", { class: "how__d" }, "Filtra por marca, modelo, precio y estado.")])]),
          h("div", { class: "how__step" }, [h("div", { class: "how__n" }, "2"), h("div", {}, [h("div", { class: "how__t" }, "Añade al carrito"), h("div", { class: "how__d" }, "Calculamos totales al instante.")])]),
          h("div", { class: "how__step" }, [h("div", { class: "how__n" }, "3"), h("div", {}, [h("div", { class: "how__t" }, "Genera tu pedido"), h("div", { class: "how__d" }, "Te llega confirmación al correo.")])])
        ]),
        h("div", { class: "how__col" }, [
          h("div", { class: "how__title" }, "Vender"),
          h("div", { class: "how__step" }, [h("div", { class: "how__n" }, "1"), h("div", {}, [h("div", { class: "how__t" }, "Envía la información"), h("div", { class: "how__d" }, "Describe el equipo y adjunta fotos.")])]),
          h("div", { class: "how__step" }, [h("div", { class: "how__n" }, "2"), h("div", {}, [h("div", { class: "how__t" }, "Evaluación"), h("div", { class: "how__d" }, "Revisamos estado y te contactamos.")])]),
          h("div", { class: "how__step" }, [h("div", { class: "how__n" }, "3"), h("div", {}, [h("div", { class: "how__t" }, "Oferta y acuerdo"), h("div", { class: "how__d" }, "Propuesta clara y proceso sencillo.")])])
        ])
      ]),
      h("div", { class: "section", style: "display:flex;gap:10px;flex-wrap:wrap;justify-content:flex-end" }, [
        h("button", { class: "btn btn--primary", onclick: () => navigate("/productos") }, [
          h("span", { style: "margin-right:6px;" }, "🛒"),
          "Ver catálogo"
        ]),
        h("button", { class: "btn", onclick: () => navigate("/vender") }, [
          h("span", { style: "margin-right:6px;" }, "💻"),
          "Vender mi computador"
        ])
      ])
    ]),

    h("div", { class: "card reveal", style: "padding:14px" }, [
      h("div", { class: "section__title" }, "Números Ryton"),
      h("div", { class: "numbers-grid" }, [
        h("div", { class: "number-card" }, [
          h("div", { class: "number__value" }, "47+"),
          h("div", { class: "number__label" }, "Equipos Vendidos")
        ]),
        h("div", { class: "number-card" }, [
          h("div", { class: "number__value" }, "100%"),
          h("div", { class: "number__label" }, "Clientes Satisfechos")
        ]),
        h("div", { class: "number-card" }, [
          h("div", { class: "number__value" }, "12 Meses"),
          h("div", { class: "number__label" }, "Garantía")
        ]),
        h("div", { class: "number-card" }, [
          h("div", { class: "number__value" }, "24/7"),
          h("div", { class: "number__label" }, "Soporte Técnico")
        ])
      ])
    ]),

    h("div", { class: "card reveal", style: "padding:14px" }, [
      h("div", { class: "section__title" }, "Por qué elegir Ryton"),
      h("div", { class: "features-grid" }, [
        h("div", { class: "feature-card reveal" }, [
          h("div", { class: "feature__icon" }, "🚀"),
          h("div", { class: "feature__title" }, "Entrega Rápida"),
          h("div", { class: "feature__desc" }, "Recibe tu equipo en menos de 48 horas en toda Colombia.")
        ]),
        h("div", { class: "feature-card reveal" }, [
          h("div", { class: "feature__icon" }, "🛡️"),
          h("div", { class: "feature__title" }, "Garantía Real"),
          h("div", { class: "feature__desc" }, "12 meses de garantía y soporte técnico incluido.")
        ]),
        h("div", { class: "feature-card reveal" }, [
          h("div", { class: "feature__icon" }, "💎"),
          h("div", { class: "feature__title" }, "Calidad Premium"),
          h("div", { class: "feature__desc" }, "Equipos certificados y reacondicionados con estándares internacionales.")
        ]),
        h("div", { class: "feature-card reveal" }, [
          h("div", { class: "feature__icon" }, "💰"),
          h("div", { class: "feature__title" }, "Mejor Precio"),
          h("div", { class: "feature__desc" }, "Hasta 40% menos que un equipo nuevo con el mismo rendimiento.")
        ]),
        h("div", { class: "feature-card reveal" }, [
          h("div", { class: "feature__icon" }, "🌱"),
          h("div", { class: "feature__title" }, "Eco-Amigable"),
          h("div", { class: "feature__desc" }, "Contribuyes al reciclaje tecnológico y reduces tu huella de carbono.")
        ]),
        h("div", { class: "feature-card reveal" }, [
          h("div", { class: "feature__icon" }, "🤝"),
          h("div", { class: "feature__title" }, "Compra Segura"),
          h("div", { class: "feature__desc" }, "Pagos protegidos y política de devolución de 30 días.")
        ])
      ])
    ]),

    h("div", { class: "card cta reveal" }, [
      h("div", { class: "cta__inner" }, [
        h("div", {}, [
          h("div", { class: "cta__title" }, "Listo para actualizar tu equipo?"),
          h("div", { class: "cta__desc" }, "Compra reacondicionado premium o vende tu usado en minutos. Ryton lo hace simple."),
        ]),
        h("div", { class: "cta__actions" }, [
          h("button", { class: "btn btn--primary", onclick: () => navigate("/productos") }, [
            h("span", { style: "margin-right:6px;" }, "🚀"),
            "Comprar ahora"
          ]),
          h("button", { class: "btn btn--ghost", onclick: () => navigate("/contacto") }, [
            h("span", { style: "margin-right:6px;" }, "💬"),
            "Hablar con soporte"
          ])
        ])
      ])
    ])
  ]);

  const page = layoutPage(
    "Ryton: reacondicionados premium y compra de usados",
    "Equipos listos para trabajar, con garantía y soporte. Si quieres vender tu computador, envíanos la información y fotos y te contactamos.",
    body
  );

  page.querySelector(".hero__cta").append(
    h("button", { class: "btn btn--primary sound-click rainbow-border shimmer", onclick: () => navigate("/productos") }, [
      h("i", { class: "fas fa-shopping-cart" }, ""),
      " Comprar"
    ]),
    h("button", { class: "btn sound-click hover-lift", onclick: () => navigate("/vender") }, [
      h("i", { class: "fas fa-laptop" }, ""),
      " Vender"
    ]),
    h("a", { class: "btn btn--ghost sound-click magnetic-hover", href: "#/admin" }, [
      h("i", { class: "fas fa-cog" }, ""),
      " Admin"
    ])
  );

  return page;
}

function productsPage() {
  const card = h("div", { class: "card" }, [
    h("div", { class: "toolbar" }, [
      h("div", { class: "field" }, [h("label", {}, "Marca"), h("input", { id: "fBrand", placeholder: "Dell, HP, Lenovo..." })]),
      h("div", { class: "field" }, [h("label", {}, "Modelo"), h("input", { id: "fModel", placeholder: "ThinkPad, EliteBook..." })]),
      h("div", { class: "field" }, [
        h("label", {}, "Estado"),
        (() => {
          const s = h("select", { id: "fCondition" }, [
            h("option", { value: "" }, "Cualquiera"),
            h("option", { value: "reacondicionado" }, "Reacondicionado"),
            h("option", { value: "usado" }, "Usado"),
            h("option", { value: "nuevo" }, "Nuevo")
          ]);
          return s;
        })()
      ]),
      h("div", { class: "field" }, [h("label", {}, "Precio mín"), h("input", { id: "fMin", type: "number", placeholder: "0" })]),
      h("div", { class: "field" }, [h("label", {}, "Precio máx"), h("input", { id: "fMax", type: "number", placeholder: "5000000" })]),
      h("div", { class: "field", style: "min-width:240px" }, [h("label", {}, "Buscar"), h("input", { id: "fQ", placeholder: "i5, 16GB, SSD..." })]),
      h("button", { class: "btn btn--primary", onclick: () => load() }, "Aplicar filtros")
    ]),
    h("div", { class: "products", id: "productsGrid" }, [h("div", { style: "padding:14px;color:var(--muted)" }, "Cargando...")])
  ]);

  async function load() {
    const brand = card.querySelector("#fBrand").value.trim();
    const model = card.querySelector("#fModel").value.trim();
    const condition = card.querySelector("#fCondition").value;
    const minPrice = card.querySelector("#fMin").value;
    const maxPrice = card.querySelector("#fMax").value;
    const q = card.querySelector("#fQ").value.trim();

    const qs = new URLSearchParams();
    if (brand) qs.set("brand", brand);
    if (model) qs.set("model", model);
    if (condition) qs.set("condition", condition);
    if (minPrice) qs.set("minPrice", minPrice);
    if (maxPrice) qs.set("maxPrice", maxPrice);
    if (q) qs.set("q", q);

    const grid = card.querySelector("#productsGrid");
    grid.innerHTML = "";
    grid.appendChild(h("div", { style: "padding:14px;color:var(--muted)" }, "Cargando..."));

    try {
      const data = await api(`/products?${qs.toString()}`);
      const items = data.items || [];
      grid.innerHTML = "";
      if (!items.length) {
        grid.appendChild(h("div", { style: "padding:14px;color:var(--muted)" }, "No hay productos con esos filtros."));
        return;
      }

      for (const p of items) {
        const img = p.images?.[0] || null;
        const cardP = h("div", { class: "product" }, [
          h("div", { class: "product__title" }, p.title),
          h("div", { class: "product__meta" }, [
            h("div", {}, `${p.brand} • ${p.model}`),
            h("div", {}, p.condition)
          ]),
          h("div", { class: "product__meta" }, [
            h("div", { class: "product__price" }, currency(p.price, p.currency || "COP")),
            h("div", {}, `Stock: ${p.stock}`)
          ]),
          h("div", { class: "product__actions" }, [
            h(
              "button",
              {
                class: "btn btn--primary",
                onclick: () => {
                  addToCart(p);
                },
                disabled: p.stock <= 0
              },
              p.stock <= 0 ? "Agotado" : "Añadir"
            ),
            h("button", { class: "btn", onclick: () => openDetails(p) }, "Detalles")
          ])
        ]);
        grid.appendChild(cardP);
      }
    } catch (e) {
      grid.innerHTML = "";
      grid.appendChild(h("div", { style: "padding:14px;color:var(--muted)" }, `Error: ${e.message}`));
    }
  }

  function addToCart(p) {
    const cart = [...state.cart];
    const idx = cart.findIndex((x) => x.productId === String(p._id));
    if (idx >= 0) cart[idx].quantity += 1;
    else cart.push({ productId: String(p._id), title: p.title, unitPrice: p.price, currency: p.currency || "COP", quantity: 1 });
    setCart(cart);
    toast("Añadido al carrito", p.title);
  }

  function openDetails(p) {
    toast("Producto", `${p.title} • ${currency(p.price, p.currency || "COP")}`);
  }

  load();

  return layoutPage(
    "Catálogo de reacondicionados",
    "Filtra por marca, modelo, precio y estado. Añade al carrito y genera tu pedido en segundos.",
    card
  );
}

function cartPage() {
  const root = h("div", { class: "split" }, [
    h("div", { class: "card", style: "padding:14px" }, [
      h("div", { class: "section__title" }, "Tu carrito"),
      h("div", { id: "cartBody" })
    ]),
    h("div", { class: "card", style: "padding:14px" }, [
      h("div", { class: "section__title" }, "Resumen"),
      h("div", { id: "cartSummary", style: "display:grid;gap:10px" })
    ])
  ]);

  function calc() {
    const subtotal = state.cart.reduce((acc, it) => acc + Number(it.unitPrice) * Number(it.quantity), 0);
    const total = subtotal;
    return { subtotal, total, currency: state.cart[0]?.currency || "COP" };
  }

  function render() {
    const body = root.querySelector("#cartBody");
    const summary = root.querySelector("#cartSummary");
    body.innerHTML = "";
    summary.innerHTML = "";

    if (!state.cart.length) {
      body.appendChild(h("div", { style: "color:var(--muted)" }, "Tu carrito está vacío."));
      summary.appendChild(h("div", { style: "color:var(--muted)" }, "Añade productos para continuar."));
      summary.appendChild(h("button", { class: "btn btn--primary", onclick: () => navigate("/productos") }, "Ver productos"));
      return;
    }

    const table = h("table", { class: "table" }, [
      h("thead", {}, [
        h("tr", {}, [
          h("th", {}, "Producto"),
          h("th", {}, "Precio"),
          h("th", {}, "Cantidad"),
          h("th", {}, "Acciones")
        ])
      ]),
      h("tbody", {}, [])
    ]);

    const tbody = table.querySelector("tbody");

    for (const it of state.cart) {
      const tr = h("tr", {}, [
        h("td", {}, it.title),
        h("td", {}, currency(it.unitPrice, it.currency || "COP")),
        h("td", {}, String(it.quantity)),
        h("td", {}, [
          h("button", { class: "btn", onclick: () => changeQty(it.productId, -1) }, "-") ,
          h("span", { style: "display:inline-block;width:10px" }, ""),
          h("button", { class: "btn", onclick: () => changeQty(it.productId, +1) }, "+"),
          h("span", { style: "display:inline-block;width:10px" }, ""),
          h("button", { class: "btn btn--danger", onclick: () => remove(it.productId) }, "Eliminar")
        ])
      ]);
      tbody.appendChild(tr);
    }

    body.appendChild(table);

    const { subtotal, total, currency: code } = calc();

    summary.appendChild(h("div", { style: "display:flex;justify-content:space-between;color:var(--muted)" }, [h("div", {}, "Subtotal"), h("div", {}, currency(subtotal, code))]));
    summary.appendChild(h("div", { style: "display:flex;justify-content:space-between;font-weight:900" }, [h("div", {}, "Total"), h("div", {}, currency(total, code))]));

    summary.appendChild(h("div", { class: "section", style: "display:grid;gap:10px" }, [
      h("button", { class: "btn btn--primary", onclick: () => checkout() }, "Generar pedido"),
      h("button", { class: "btn btn--ghost", onclick: () => { setCart([]); toast("Carrito", "Se vació el carrito"); render(); } }, "Vaciar")
    ]));
  }

  function changeQty(productId, delta) {
    const cart = [...state.cart];
    const idx = cart.findIndex((x) => x.productId === String(productId));
    if (idx < 0) return;
    cart[idx].quantity = Math.max(1, Number(cart[idx].quantity) + delta);
    setCart(cart);
    render();
  }

  function remove(productId) {
    setCart(state.cart.filter((x) => x.productId !== String(productId)));
    render();
  }

  async function checkout() {
    if (!state.token) {
      toast("Inicia sesión", "Para comprar necesitas una cuenta.");
      navigate("/cuenta");
      return;
    }

    try {
      const payload = {
        items: state.cart.map((it) => ({ productId: it.productId, quantity: it.quantity })),
        shipping: {}
      };
      const data = await api("/orders", { method: "POST", body: JSON.stringify(payload) });
      setCart([]);
      toast("Pedido creado", `ID: ${data.item?._id || ""}`);
      navigate("/mis-pedidos");
    } catch (e) {
      toast("Error", e.message);
    }
  }

  render();

  return layoutPage(
    "Carrito y pedido",
    "Revisa cantidades y genera tu pedido. Te enviamos confirmación por correo.",
    root
  );
}

function accountPage() {
  const root = h("div", { class: "card", style: "padding:14px;display:grid;gap:14px" }, []);

  const header = h("div", {}, [
    h("div", { class: "section__title" }, "Mi cuenta"),
    h("div", { style: "color:var(--muted)" }, "Gestiona tu sesión y revisa tus pedidos.")
  ]);

  root.appendChild(header);

  if (state.user) {
    root.appendChild(
      h("div", { style: "display:flex;gap:10px;flex-wrap:wrap;justify-content:flex-end" }, [
        h("a", { class: "btn", href: "#/mis-pedidos" }, "Mis pedidos"),
        h("a", { class: "btn", href: "#/admin" }, "Admin"),
        h(
          "button",
          {
            class: "btn btn--danger",
            onclick: () => {
              setSession({ token: "", user: null });
              toast("Sesión cerrada", "Hasta pronto");
              navigate("/");
            }
          },
          "Cerrar sesión"
        )
      ])
    );

    return layoutPage("Tu cuenta", "Gestiona tu sesión y revisa tus pedidos.", root);
  }

  const formLogin = h("form", { class: "card", style: "padding:14px;display:grid;gap:10px" }, [
    h("div", { style: "font-weight:900" }, "Iniciar sesión"),
    h("div", { class: "field" }, [h("label", {}, "Email"), h("input", { name: "email", type: "email", required: true, autocomplete: "email" })]),
    h("div", { class: "field" }, [h("label", {}, "Contraseña"), h("input", { name: "password", type: "password", required: true, autocomplete: "current-password" })]),
    h("button", { class: "btn btn--primary", type: "submit" }, "Entrar")
  ]);

  formLogin.addEventListener("submit", async (e) => {
    e.preventDefault();
    const fd = new FormData(formLogin);
    try {
      const data = await api("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: fd.get("email"), password: fd.get("password") })
      });
      setSession({ token: data.token, user: data.user });
      toast("Bienvenido", data.user.name);
      navigate("/");
    } catch (err) {
      toast("Error", err.message);
    }
  });

  const formRegister = h("form", { class: "card", style: "padding:14px;display:grid;gap:10px" }, [
    h("div", { style: "font-weight:900" }, "Crear cuenta"),
    h("div", { class: "field" }, [h("label", {}, "Nombre"), h("input", { name: "name", required: true, autocomplete: "name" })]),
    h("div", { class: "field" }, [h("label", {}, "Email"), h("input", { name: "email", type: "email", required: true, autocomplete: "email" })]),
    h("div", { class: "field" }, [h("label", {}, "Contraseña"), h("input", { name: "password", type: "password", required: true, minlength: "6" })]),
    h("button", { class: "btn", type: "submit" }, "Registrarme")
  ]);

  formRegister.addEventListener("submit", async (e) => {
    e.preventDefault();
    const fd = new FormData(formRegister);
    try {
      const data = await api("/auth/register", {
        method: "POST",
        body: JSON.stringify({ name: fd.get("name"), email: fd.get("email"), password: fd.get("password") })
      });
      setSession({ token: data.token, user: data.user });
      toast("Cuenta creada", data.user.email);
      navigate("/");
    } catch (err) {
      toast("Error", err.message);
    }
  });

  root.appendChild(h("div", { class: "grid3" }, [
    h("div", { style: "grid-column: span 2" }, formLogin),
    h("div", {}, formRegister)
  ]));

  return layoutPage("Cuenta", "Inicia sesión para comprar y ver tus pedidos.", root);
}

function myOrdersPage() {
  const root = h("div", { class: "card", style: "padding:14px;display:grid;gap:12px" }, [
    h("div", { class: "section__title" }, "Mis pedidos"),
    h("div", { id: "ordersBody", style: "color:var(--muted)" }, "Cargando...")
  ]);

  async function load() {
    if (!state.token) {
      root.querySelector("#ordersBody").textContent = "Inicia sesión para ver tus pedidos.";
      return;
    }
    try {
      const data = await api("/orders/mine");
      const items = data.items || [];
      const body = root.querySelector("#ordersBody");
      body.innerHTML = "";

      if (!items.length) {
        body.appendChild(h("div", { style: "color:var(--muted)" }, "Aún no tienes pedidos."));
        return;
      }

      const table = h("table", { class: "table" }, [
        h("thead", {}, [h("tr", {}, [h("th", {}, "ID"), h("th", {}, "Fecha"), h("th", {}, "Total"), h("th", {}, "Estado")])]),
        h("tbody", {}, [])
      ]);
      const tbody = table.querySelector("tbody");

      for (const o of items) {
        tbody.appendChild(
          h("tr", {}, [
            h("td", {}, String(o._id)),
            h("td", {}, new Date(o.createdAt).toLocaleString()),
            h("td", {}, currency(o.total, "COP")),
            h("td", {}, o.status)
          ])
        );
      }

      body.appendChild(table);
    } catch (e) {
      root.querySelector("#ordersBody").textContent = `Error: ${e.message}`;
    }
  }

  load();

  return layoutPage("Tus pedidos", "Historial de pedidos creados desde el carrito.", root);
}

function sellPage() {
  const form = h("form", { class: "card", style: "padding:14px;display:grid;gap:10px" }, [
    h("div", { class: "section__title" }, "Vender tu computador usado"),
    h("div", { style: "color:var(--muted)" }, "Completa el formulario y adjunta fotos. Te contactamos con una oferta."),
    h("div", { class: "grid3" }, [
      h("div", { class: "field" }, [h("label", {}, "Nombre"), h("input", { name: "contactName", required: true })]),
      h("div", { class: "field" }, [h("label", {}, "Email"), h("input", { name: "contactEmail", type: "email", required: true })]),
      h("div", { class: "field" }, [h("label", {}, "Teléfono"), h("input", { name: "contactPhone" })])
    ]),
    h("div", { class: "grid3" }, [
      h("div", { class: "field" }, [h("label", {}, "Marca"), h("input", { name: "brand", placeholder: "Dell" })]),
      h("div", { class: "field" }, [h("label", {}, "Modelo"), h("input", { name: "model", placeholder: "Latitude 5490" })]),
      h("div", { class: "field" }, [h("label", {}, "Precio estimado"), h("input", { name: "estimatedPrice", type: "number", placeholder: "1000000" })])
    ]),
    h("div", { class: "field" }, [h("label", {}, "Descripción"), h("textarea", { name: "description", required: true, minlength: "10", placeholder: "Especificaciones, fallas, estado físico..." })]),
    h("div", { class: "field" }, [h("label", {}, "Fotos (máx 6)"), h("input", { name: "photos", type: "file", accept: "image/*", multiple: true })]),
    h("button", { class: "btn btn--primary", type: "submit" }, "Enviar solicitud")
  ]);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fd = new FormData(form);

    try {
      const data = await api("/sell", { method: "POST", body: fd });
      toast("Solicitud enviada", `ID: ${data.item?._id || ""}`);
      form.reset();
    } catch (err) {
      toast("Error", err.message);
    }
  });

  return layoutPage(
    "Vende tu equipo usado",
    "Envíanos la información y fotos para evaluar. Respuesta rápida.",
    form
  );
}

function blogPage() {
  const root = h("div", { class: "card", style: "padding:14px;display:grid;gap:12px" }, [
    h("div", { class: "section__title" }, "Consejos y tecnología"),
    h("div", { id: "blogBody", style: "color:var(--muted)" }, "Cargando...")
  ]);

  async function load() {
    try {
      const data = await api("/blog");
      const items = data.items || [];
      const body = root.querySelector("#blogBody");
      body.innerHTML = "";

      if (!items.length) {
        body.appendChild(h("div", { style: "color:var(--muted)" }, "Aún no hay publicaciones."));
        body.appendChild(h("a", { class: "btn", href: "#/admin" }, "Publicar desde Admin"));
        return;
      }

      for (const p of items) {
        const card = h("div", { class: "feature" }, [
          h("div", { style: "font-weight:900" }, p.title),
          h("div", { style: "color:var(--muted);margin-top:6px;font-size:13px" }, p.excerpt || ""),
          h("div", { style: "margin-top:10px;display:flex;justify-content:space-between;align-items:center" }, [
            h("div", { style: "color:var(--muted);font-size:12px" }, new Date(p.createdAt).toLocaleDateString()),
            h("button", { class: "btn", onclick: () => openPost(p) }, "Leer")
          ])
        ]);
        body.appendChild(card);
      }
    } catch (e) {
      root.querySelector("#blogBody").textContent = `Error: ${e.message}`;
    }
  }

  function openPost(p) {
    const modal = h("div", { class: "card", style: "padding:14px;position:fixed;inset:18px;z-index:80;overflow:auto;background:rgba(11,18,32,0.92);backdrop-filter:blur(10px)" }, [
      h("div", { style: "display:flex;justify-content:space-between;gap:12px;align-items:center" }, [
        h("div", { style: "font-weight:900;font-size:18px" }, p.title),
        h("button", { class: "btn", onclick: () => modal.remove() }, "Cerrar")
      ]),
      h("div", { style: "color:var(--muted);margin-top:10px" }, p.excerpt || ""),
      (() => {
        const c = document.createElement("div");
        c.style.marginTop = "14px";
        c.innerHTML = p.contentHtml;
        return c;
      })()
    ]);

    document.body.appendChild(modal);
  }

  load();

  return layoutPage("Blog", "Consejos para mantenimiento, rendimiento y compras inteligentes.", root);
}

function contactPage() {
  const form = h("form", { class: "card", style: "padding:14px;display:grid;gap:10px" }, [
    h("div", { class: "section__title" }, "Contacto"),
    h("div", { style: "color:var(--muted)" }, "Escríbenos. Te respondemos lo antes posible."),
    h("div", { class: "grid3" }, [
      h("div", { class: "field" }, [h("label", {}, "Nombre"), h("input", { name: "name", required: true })]),
      h("div", { class: "field" }, [h("label", {}, "Email"), h("input", { name: "email", type: "email", required: true })]),
      h("div", { class: "field" }, [h("label", {}, "Asunto"), h("input", { name: "subject" })])
    ]),
    h("div", { class: "field" }, [h("label", {}, "Mensaje"), h("textarea", { name: "message", required: true, minlength: "10" })]),
    h("button", { class: "btn btn--primary", type: "submit" }, "Enviar") ,
    h("div", { class: "feature" }, [
      h("div", { class: "feature__t" }, "Dirección"),
      h("div", { class: "feature__d" }, "Tu ciudad, tu dirección aquí."),
      h("div", { style: "margin-top:10px" }, [
        h("iframe", {
          title: "Mapa",
          style: "width:100%;height:220px;border:0;border-radius:14px;",
          loading: "lazy",
          referrerpolicy: "no-referrer-when-downgrade",
          src: "https://www.google.com/maps?q=Bogota%20Colombia&output=embed"
        })
      ])
    ])
  ]);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const payload = Object.fromEntries(fd.entries());

    try {
      await api("/contact", { method: "POST", body: JSON.stringify(payload) });
      toast("Mensaje enviado", "Gracias por escribirnos.");
      form.reset();
    } catch (err) {
      toast("Error", err.message);
    }
  });

  return layoutPage("Contacto", "Soporte, compras, ventas y garantías.", form);
}

function adminPage() {
  const root = h("div", { class: "card", style: "padding:14px;display:grid;gap:12px" }, [
    h("div", { class: "section__title" }, "Admin Panel"),
    h("div", { style: "color:var(--muted)" }, "Gestiona productos, pedidos y solicitudes."),
    h("div", { id: "adminBody" }, "")
  ]);

  async function load() {
    const body = root.querySelector("#adminBody");
    body.innerHTML = "";

    if (!state.token) {
      body.appendChild(h("div", { style: "color:var(--muted)" }, "Inicia sesión con una cuenta admin."));
      body.appendChild(h("a", { class: "btn btn--primary", href: "#/cuenta" }, "Ir a Cuenta"));
      return;
    }

    try {
      const dash = await api("/admin/dashboard");

      body.appendChild(
        h("div", { class: "grid3" }, [
          h("div", { class: "feature" }, [h("div", { class: "feature__t" }, "Productos"), h("div", { class: "feature__d" }, String(dash.stats.products))]),
          h("div", { class: "feature" }, [h("div", { class: "feature__t" }, "Pedidos"), h("div", { class: "feature__d" }, String(dash.stats.orders))]),
          h("div", { class: "feature" }, [h("div", { class: "feature__t" }, "Solicitudes de venta"), h("div", { class: "feature__d" }, String(dash.stats.sellRequests))])
        ])
      );

      body.appendChild(h("div", { style: "display:flex;gap:10px;flex-wrap:wrap;justify-content:flex-end" }, [
        h("button", { class: "btn", onclick: () => viewProducts() }, "Productos"),
        h("button", { class: "btn", onclick: () => viewOrders() }, "Pedidos"),
        h("button", { class: "btn", onclick: () => viewSell() }, "Ventas"),
        h("button", { class: "btn", onclick: () => viewContacts() }, "Contactos")
      ]));

      const content = h("div", { id: "adminContent", class: "feature" }, [h("div", { style: "color:var(--muted)" }, "Selecciona una sección.")]);
      body.appendChild(content);

      async function viewProducts() {
        content.innerHTML = "";
        content.appendChild(h("div", { style: "font-weight:900" }, "Productos"));

        const form = h("form", { style: "margin-top:10px;display:grid;gap:10px" }, [
          h("div", { class: "grid3" }, [
            h("div", { class: "field" }, [h("label", {}, "Título"), h("input", { name: "title", required: true })]),
            h("div", { class: "field" }, [h("label", {}, "Marca"), h("input", { name: "brand", required: true })]),
            h("div", { class: "field" }, [h("label", {}, "Modelo"), h("input", { name: "model", required: true })])
          ]),
          h("div", { class: "grid3" }, [
            h("div", { class: "field" }, [h("label", {}, "Precio"), h("input", { name: "price", type: "number", required: true })]),
            h("div", { class: "field" }, [h("label", {}, "Stock"), h("input", { name: "stock", type: "number", value: "1" })]),
            (() => {
              const s = h("select", { name: "condition" }, [
                h("option", { value: "reacondicionado" }, "reacondicionado"),
                h("option", { value: "usado" }, "usado"),
                h("option", { value: "nuevo" }, "nuevo")
              ]);
              return h("div", { class: "field" }, [h("label", {}, "Estado"), s]);
            })()
          ]),
          h("button", { class: "btn btn--primary", type: "submit" }, "Crear producto")
        ]);

        form.addEventListener("submit", async (e) => {
          e.preventDefault();
          const fd = new FormData(form);
          const payload = Object.fromEntries(fd.entries());
          payload.price = Number(payload.price);
          payload.stock = Number(payload.stock || 0);

          try {
            await api("/products", { method: "POST", body: JSON.stringify(payload) });
            toast("Producto creado", payload.title);
            form.reset();
            await list();
          } catch (err) {
            toast("Error", err.message);
          }
        });

        content.appendChild(form);

        const listWrap = h("div", { style: "margin-top:12px" }, [h("div", { style: "color:var(--muted)" }, "Cargando...")]);
        content.appendChild(listWrap);

        async function list() {
          listWrap.innerHTML = "";
          try {
            const data = await api("/products");
            const items = data.items || [];
            if (!items.length) {
              listWrap.appendChild(h("div", { style: "color:var(--muted)" }, "No hay productos."));
              return;
            }

            const table = h("table", { class: "table" }, [
              h("thead", {}, [h("tr", {}, [h("th", {}, "Título"), h("th", {}, "Precio"), h("th", {}, "Stock"), h("th", {}, "Acción")])]),
              h("tbody", {}, [])
            ]);

            const tbody = table.querySelector("tbody");
            for (const p of items) {
              const tr = h("tr", {}, [
                h("td", {}, p.title),
                h("td", {}, currency(p.price, p.currency || "COP")),
                h("td", {}, String(p.stock)),
                h("td", {}, [
                  h("button", { class: "btn btn--danger", onclick: async () => {
                    try {
                      await api(`/products/${p._id}`, { method: "DELETE" });
                      toast("Eliminado", p.title);
                      await list();
                    } catch (err) {
                      toast("Error", err.message);
                    }
                  } }, "Desactivar")
                ])
              ]);
              tbody.appendChild(tr);
            }

            listWrap.appendChild(table);
          } catch (e) {
            listWrap.appendChild(h("div", { style: "color:var(--muted)" }, `Error: ${e.message}`));
          }
        }

        await list();
      }

      async function viewOrders() {
        content.innerHTML = "";
        content.appendChild(h("div", { style: "font-weight:900" }, "Pedidos"));
        try {
          const data = await api("/admin/orders");
          const items = data.items || [];
          if (!items.length) {
            content.appendChild(h("div", { style: "color:var(--muted);margin-top:8px" }, "No hay pedidos."));
            return;
          }

          const table = h("table", { class: "table", style: "margin-top:10px" }, [
            h("thead", {}, [h("tr", {}, [h("th", {}, "ID"), h("th", {}, "User"), h("th", {}, "Total"), h("th", {}, "Estado")])]),
            h("tbody", {}, [])
          ]);
          const tbody = table.querySelector("tbody");

          for (const o of items) {
            tbody.appendChild(h("tr", {}, [
              h("td", {}, String(o._id)),
              h("td", {}, String(o.userId)),
              h("td", {}, currency(o.total, "COP")),
              h("td", {}, o.status)
            ]));
          }

          content.appendChild(table);
        } catch (e) {
          content.appendChild(h("div", { style: "color:var(--muted);margin-top:8px" }, `Error: ${e.message}`));
        }
      }

      async function viewSell() {
        content.innerHTML = "";
        content.appendChild(h("div", { style: "font-weight:900" }, "Solicitudes de venta"));
        try {
          const data = await api("/admin/sell-requests");
          const items = data.items || [];
          if (!items.length) {
            content.appendChild(h("div", { style: "color:var(--muted);margin-top:8px" }, "No hay solicitudes."));
            return;
          }

          for (const s of items) {
            content.appendChild(h("div", { class: "feature", style: "margin-top:10px" }, [
              h("div", { style: "font-weight:900" }, `${s.contactName} • ${s.contactEmail}`),
              h("div", { style: "color:var(--muted);margin-top:6px" }, `${s.brand || ""} ${s.model || ""} • ${s.condition}`),
              h("div", { style: "margin-top:6px" }, s.description)
            ]));
          }
        } catch (e) {
          content.appendChild(h("div", { style: "color:var(--muted);margin-top:8px" }, `Error: ${e.message}`));
        }
      }

      async function viewContacts() {
        content.innerHTML = "";
        content.appendChild(h("div", { style: "font-weight:900" }, "Mensajes de contacto"));
        try {
          const data = await api("/admin/contacts");
          const items = data.items || [];
          if (!items.length) {
            content.appendChild(h("div", { style: "color:var(--muted);margin-top:8px" }, "No hay mensajes."));
            return;
          }

          for (const m of items) {
            content.appendChild(h("div", { class: "feature", style: "margin-top:10px" }, [
              h("div", { style: "font-weight:900" }, `${m.name} • ${m.email}`),
              h("div", { style: "color:var(--muted);margin-top:6px" }, m.subject || "(sin asunto)"),
              h("div", { style: "margin-top:6px" }, m.message)
            ]));
          }
        } catch (e) {
          content.appendChild(h("div", { style: "color:var(--muted);margin-top:8px" }, `Error: ${e.message}`));
        }
      }
    } catch (e) {
      body.appendChild(h("div", { style: "color:var(--muted)" }, `No autorizado o error: ${e.message}`));
      body.appendChild(h("div", { style: "margin-top:10px" }, [h("a", { class: "btn", href: "#/cuenta" }, "Revisar sesión") ]));
    }
  }

  load();

  return layoutPage("Admin Panel", "Acceso restringido. Requiere rol admin.", root);
}

function notFoundPage() {
  return layoutPage("Página no encontrada", "Revisa el menú para navegar.", h("div", { class: "card", style: "padding:14px" }, [
    h("button", { class: "btn btn--primary", onclick: () => navigate("/") }, "Volver al inicio")
  ]));
}

const routes = {
  "/": homePage,
  "/productos": productsPage,
  "/carrito": cartPage,
  "/cuenta": accountPage,
  "/mis-pedidos": myOrdersPage,
  "/vender": sellPage,
  "/blog": blogPage,
  "/contacto": contactPage,
  "/admin": adminPage
};

function render() {
  const p = route();
  const fn = routes[p] || notFoundPage;
  mount(fn());
}

window.addEventListener("hashchange", render);

elMenuBtn.addEventListener("click", () => {
  const isHidden = elMobileMenu.hasAttribute("hidden");
  if (isHidden) elMobileMenu.removeAttribute("hidden");
  else elMobileMenu.setAttribute("hidden", "");
});

elMobileMenu.addEventListener("click", (e) => {
  if (e.target && e.target.matches("a")) {
    elMobileMenu.setAttribute("hidden", "");
  }
});

updateAccountButton();
renderCartCount();

if (!location.hash) location.hash = "#/";
render();
