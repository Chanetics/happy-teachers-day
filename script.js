/* =========================================================
   HAPPY TEACHERS' DAY · MAGICAL GIFT FLOW
   Edit the CONFIG below to change photos and captions.
   ========================================================= */

const CONFIG = {
  bubblePhotos: [
    "picture/pic1.jpg",
    "picture/pic2.jpg",
    "picture/pic3.jpg",
    "picture/pic4.jpg",
    "picture/pic5.jpg",
    "picture/pic6.jpg",
    "picture/pic7.jpg",
    "picture/pic8.jpg",
    "picture/pic9.jpg",
    "picture/pic10.jpg",
    "picture/pic11.jpg",
    "picture/pic12.jpg",
    "picture/pic13.jpg",
    "picture/pic14.jpg",
    "picture/pic15.jpg",
    "picture/pic16.jpg",
    "picture/pic17.jpg",
    "picture/pic18.jpg",
    "picture/pic19.jpg",
    "picture/pic20.jpg",
    "picture/pic21.jpg",
    "picture/pic22.jpg",
    "picture/pic23.jpg",
    "picture/pic24.jpg",
    "picture/pic25.jpg",
  ],
  bubbleCount: 16,

  homeBubblePhotos: [
    "picture/call1.jpg",
    "picture/call2.jpg",
    "picture/call3.jpg",
    "picture/call4.jpg",
  ],

  homeQuestion: {
    replyYes: "A person... I think so too. Let me show you what home means to me.",
    replyNo: "A place can feel like home, but I think home is more than walls. Let me show you what it means to me.",
  },

  memories: [
    { img: "picture/my baby.jpg",           caption: "My baby" },
    { img: "picture/cute lagi daw sya.jpg", caption: "Cute lagi daw sya" },
    { img: "picture/my teletubbies.jpg",    caption: "My teletubbies" },
    { img: "picture/movie together.jpg",    caption: "Movie together daw pero natug siya HAHAAHA" },
    { img: "picture/first picture.jpg",     caption: "First picture" },
  ],

  scrabble: {
    nameLeft: "Channy",
    scoreLeft: 4,
    nameRight: "Andeng",
    scoreRight: 3,
    note: "Nice game baby :P",
    photos: [
      { img: "picture/game 1.jpg", caption: "" },
      { img: "picture/game 2.jpg", caption: "" },
      { img: "picture/game 3.jpg", caption: "" },
      { img: "picture/game 4.jpg", caption: "" },
    ],
  },

  fromTo: {
    from: { img: "picture/sleeping channy.jpg", caption: "Nakatug kay busy kay akong baby" },
    to:   { img: "picture/wanna be.jpg",       caption: "Nagpa wanna be teacher si channy" },
  },

  artAndArtist: {
    top:    { img: "picture/the art.jpg",    caption: "The art" },
    bottom: { img: "picture/the artist.jpg", caption: "Cute nga artist" },
  },

  // "My favorites" -> "Your clingy sides baby" -> 5 pictures.
  // Put your 5 pictures in the picture/ folder with these names (or change them).
  favorites: {
    title: "Your clingy sides baby",
    photos: [
      { img: "picture/clingy1.jpg", caption: "" },
      { img: "picture/clingy2.jpg", caption: "" },
      { img: "picture/clingy3.jpg", caption: "" },
      { img: "picture/clingy4.jpg", caption: "" },
      { img: "picture/clingy5.jpg", caption: "" },
    ],
  },

  // "Fav memories" -> one big picture. Drop your photo in picture/ with this name.
  favMemory: {
    title: "Fav memories",
    img: "picture/fav_memories.jpg",
    caption: "",
    selfieCaption: "All our quality time together makes up my fav memories",   // shown under the photo she takes
  },

  // The letter shown when she taps "My Letter to you".
  // Each line in paragraphs[] is one paragraph.
  letter: {
    paragraphs: [
      "Dear Baby,",
      "Happy happy Teacher's Day, baby! Always remember ha nga I'm very much proud and amazed sa imo. You're the kind of teacher nga full packages, e with S nato para nice hahahaha. All around, you are eager to learn in everything jd, bisag no knowledge ka sa isa ka butang but willing to learn jud ka.",
      "And also, mo congrats lng ko balik sa imong math skills \"Eyy\". Congrats baby, top 1! Grabi makaproud kaayu oy.",
      "And last, if you need anything, one call away rko ha. See you soonest po. IMY :<",
    ],
    sign: "Channy cute",
  },

  // What the QR code opens. Leave empty to use this page's own address.
  qrUrl: "",
};

/* ---------- Helpers ---------- */
const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Background hearts ---------- */
function buildHearts() {
  const box = $("#hearts");
  for (let i = 0; i < 14; i++) {
    const h = document.createElement("span");
    h.className = "heart";
    h.textContent = "♥";
    h.style.left = Math.random() * 100 + "%";
    h.style.fontSize = 14 + Math.random() * 26 + "px";
    h.style.setProperty("--dur", 12 + Math.random() * 12 + "s");
    h.style.setProperty("--delay", -Math.random() * 20 + "s");
    box.appendChild(h);
  }
}

/* ---------- Screens ---------- */
function showScreen(id) {
  $$(".screen").forEach(s => s.classList.toggle("active", s.id === id));
  if (id === "screen-bubbles") startBubbles(); else stopBubbles();
  if (id === "screen-home") startHomeBubbles(); else stopHomeBubbles();
  if (id !== "screen-video") pauseVideo();
  if (loveOn) {                                   // love song pauses during the goodnight video
    if (id === "screen-video") loveSong.pause();
    else loveSong.play().catch(() => {});
  }
  window.scrollTo({ top: 0, behavior: "auto" });
}

// Hides every screen (used while the reminder is showing, so nothing is spoiled)
function hideAllScreens() {
  $$(".screen").forEach(s => s.classList.remove("active"));
  stopBubbles();
  stopHomeBubbles();
}

/* ---------- Photo placeholder handling ---------- */
function watchPhoto(img) {
  const wrap = img.closest(".photo");
  img.addEventListener("error", () => wrap.classList.add("empty"));
  img.addEventListener("load", () => wrap.classList.remove("empty"));
  if (img.complete && img.naturalWidth === 0 && img.getAttribute("src")) wrap.classList.add("empty");
}

/* ---------- Screen 1 · QR code ---------- */
function buildQR() {
  const box = $("#qrBox");
  const base = CONFIG.qrUrl.trim() || (location.origin + location.pathname);
  const url = base + (base.includes("?") ? "&" : "?") + "scan=1";

  if (window.QRCode) {
    new QRCode(box, {
      text: url,
      width: 200,
      height: 200,
      colorDark: "#740001",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.M,
    });
  } else {
    box.textContent = "♥";
  }
}

/* ---------- Envelopes ---------- */
function setupEnvelope(el, onOpened) {
  let opened = false;
  const open = () => {
    if (opened) return;
    opened = true;
    el.setAttribute("aria-label", "Envelope opened");
    onOpened();                      // straight to the pictures (no letter animation)
  };
  el.addEventListener("click", open);
  el.addEventListener("keydown", e => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); }
  });
  return {
    reset() { opened = false; el.classList.remove("open"); el.setAttribute("aria-label", "Open the envelope"); },
  };
}

/* ---------- Ribbon envelope ("THIS IS MY HOME" slide) ---------- */
// The envelope is tied with a ribbon. It only opens after the ribbon is removed:
// scroll the mouse wheel over it, or "scratch" it (drag the mouse / a finger
// over it). Enter / Space also work for keyboard users.
function injectRibbonStyles() {
  if (document.getElementById("ribbonStyles")) return;
  const st = document.createElement("style");
  st.id = "ribbonStyles";
  st.textContent = `
.has-ribbon { cursor: grab; touch-action: none; user-select: none; -webkit-user-select: none; }
.has-ribbon:active { cursor: grabbing; }
.has-ribbon .seal { display: none; }

.ribbon { position: absolute; inset: 0; z-index: 8; pointer-events: none; --p: 0; }
.rb { position: absolute; transition: transform .18s ease-out, opacity .18s ease-out; }
.rb-v {
  left: 50%; top: 0; bottom: 0; width: 11%;
  transform: translate(-50%, calc(var(--p) * -60%));
  opacity: calc(1 - var(--p) * .9);
  background: linear-gradient(90deg, #6f0a0e, #c0262b 50%, #6f0a0e);
  box-shadow: inset 3px 0 0 #d4a537, inset -3px 0 0 #d4a537, 0 0 10px rgba(0,0,0,.25);
}
.rb-h {
  left: 0; right: 0; top: 50%; height: 17%;
  transform: translate(calc(var(--p) * -70%), -50%);
  opacity: calc(1 - var(--p) * .9);
  background: linear-gradient(180deg, #6f0a0e, #c0262b 50%, #6f0a0e);
  box-shadow: inset 0 3px 0 #d4a537, inset 0 -3px 0 #d4a537, 0 0 10px rgba(0,0,0,.25);
}
.bow {
  position: absolute; left: 50%; top: 50%; width: 26%; aspect-ratio: 1.5;
  transform: translate(-50%, -50%) translateY(calc(var(--p) * -120%)) rotate(calc(var(--p) * 40deg)) scale(calc(1 - var(--p) * .5));
  opacity: calc(1 - var(--p));
  transition: transform .18s ease-out, opacity .18s ease-out;
  filter: drop-shadow(0 4px 5px rgba(0,0,0,.35));
}
.bow i { position: absolute; display: block; }
.bow .loop { top: 4%; width: 47%; height: 64%; border-radius: 50%; background: radial-gradient(circle at 35% 30%, #d9302f, #7a0b10); border: 3px solid #d4a537; }
.bow .l { left: 0;  transform: rotate(-25deg); }
.bow .r { right: 0; transform: rotate(25deg); }
.bow .tail { top: 50%; width: 22%; height: 72%; background: linear-gradient(90deg, #6f0a0e, #c0262b 50%, #6f0a0e); clip-path: polygon(0 0, 100% 0, 100% 100%, 50% 84%, 0 100%); }
.bow .tl { left: 24%; transform-origin: top center; transform: rotate(16deg); }
.bow .tr { right: 24%; transform-origin: top center; transform: rotate(-16deg); }
.bow .knot { left: 50%; top: 30%; width: 25%; aspect-ratio: 1; border-radius: 50%; transform: translateX(-50%); z-index: 2; background: radial-gradient(circle at 35% 30%, #e0383a, #6f0a0e); border: 3px solid #d4a537; }

.ribbon.gone { animation: ribbonFall .6s ease-in forwards; }
@keyframes ribbonFall { to { transform: translateY(50px) rotate(6deg); opacity: 0; } }

.rb-spark {
  position: fixed; z-index: 85; width: 9px; height: 9px; border-radius: 50%;
  background: radial-gradient(circle, #fff 0 30%, #e6b84d 70%);
  pointer-events: none;
  animation: rbSpark .7s ease-out forwards;
}
@keyframes rbSpark {
  from { transform: translate(-50%, -50%) scale(1); opacity: 1; }
  to   { transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(.2); opacity: 0; }
}`;
  document.head.appendChild(st);
}

// Adds the ribbon to the envelope on the "THIS IS MY HOME" slide
function upgradeHomeEnvelope() {
  const env = $("#envelope2");
  if (!env || $(".ribbon", env)) return;
  env.classList.add("has-ribbon");
  env.setAttribute("aria-label", "Remove the ribbon to open the envelope");
  const rb = document.createElement("div");
  rb.className = "ribbon";
  rb.setAttribute("aria-hidden", "true");
  rb.innerHTML =
    '<span class="rb rb-v"></span><span class="rb rb-h"></span>' +
    '<span class="bow"><i class="tail tl"></i><i class="tail tr"></i><i class="loop l"></i><i class="loop r"></i><i class="knot"></i></span>';
  env.appendChild(rb);
  const hint = $("#envWrap .hint");
  if (hint) hint.textContent = "Scroll your mouse or scratch the ribbon to open it";
}

function setupRibbonEnvelope(el, onOpened) {
  const ribbon = $(".ribbon", el);
  let p = 0, opened = false, pressed = false, lx = 0, ly = 0, sparkAt = 0;

  const show = () => ribbon.style.setProperty("--p", Math.min(1, p).toFixed(3));
  const sparkle = (x, y) => {
    if (reduceMotion) return;
    const now = performance.now();
    if (now - sparkAt < 60) return;
    sparkAt = now;
    for (let i = 0; i < 2; i++) {
      const sp = document.createElement("span");
      sp.className = "rb-spark";
      sp.style.left = x + "px";
      sp.style.top = y + "px";
      sp.style.setProperty("--dx", (Math.random() - 0.5) * 70 + "px");
      sp.style.setProperty("--dy", (Math.random() - 0.2) * 70 + "px");
      document.body.appendChild(sp);
      setTimeout(() => sp.remove(), 750);
    }
  };
  const add = (amount, x, y) => {
    if (opened) return;
    p += amount;
    show();
    if (x != null) sparkle(x, y);
    if (p >= 1) {
      opened = true;
      p = 1;
      show();
      ribbon.classList.add("gone");                         // the ribbon falls away ...
      setTimeout(onOpened, reduceMotion ? 50 : 650);        // ... then the envelope opens
    }
  };

  // mouse wheel / trackpad scroll over the envelope
  el.addEventListener("wheel", e => {
    e.preventDefault();                                     // don't scroll the page
    add(Math.abs(e.deltaY) / 450, e.clientX, e.clientY);
  }, { passive: false });

  // scratch: press and drag the mouse / a finger over the envelope
  el.addEventListener("pointerdown", e => {
    pressed = true;
    lx = e.clientX; ly = e.clientY;
    try { el.setPointerCapture(e.pointerId); } catch (err) {}
  });
  el.addEventListener("pointermove", e => {
    if (!pressed) return;
    const d = Math.hypot(e.clientX - lx, e.clientY - ly);
    lx = e.clientX; ly = e.clientY;
    add(d / (el.offsetWidth * 1.4), e.clientX, e.clientY);
  });
  const release = () => { pressed = false; };
  el.addEventListener("pointerup", release);
  el.addEventListener("pointercancel", release);

  // keyboard
  el.addEventListener("keydown", e => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); add(0.25); }
  });

  return {
    reset() {
      p = 0; opened = false; pressed = false;
      ribbon.classList.remove("gone");
      show();
    },
  };
}

/* ---------- Bubbles ---------- */
function fillBubbles(field, photos, count, opts = {}) {
  const { minDur = 10, maxDur = 19, minSize, maxSize, shape } = opts;
  if (field.childElementCount) return;

  const list = photos.length ? photos : [""];
  const w = window.innerWidth;

  for (let i = 0; i < count; i++) {
    const lo = minSize || (w < 640 ? 80 : 100);
    const hi = maxSize || (w < 640 ? 170 : 230);
    const size = lo + Math.random() * (hi - lo);
    const b = document.createElement("div");
    b.className = "bubble" + (shape === "box" ? " box" : "");
    b.style.setProperty("--size", size + "px");
    // boxes are spread over 82% of the width so none are cut off at the right edge
    const slot = (i / count) * (shape === "box" ? 82 : 100);
    b.style.setProperty("--x", `calc(${slot}% - ${size / 2}px + ${(Math.random() * 40 - 20) / 10}%)`);
    b.style.setProperty("--sway", (Math.random() * 40 - 20) + "px");
    b.style.setProperty("--dur", minDur + Math.random() * (maxDur - minDur) + "s");
    b.style.setProperty("--delay", -Math.random() * maxDur + "s");

    const photo = document.createElement("div");
    photo.className = "photo";
    photo.dataset.label = "Photo";
    const img = document.createElement("img");
    img.alt = "";
    img.src = list[i % list.length];
    photo.appendChild(img);
    b.appendChild(photo);
    field.appendChild(b);
    watchPhoto(img);
  }
}

let bubblesLoading = false;
async function startBubbles() {
  const field = $("#bubbleField");
  if (field.childElementCount || bubblesLoading) return;

  // find which pictures really exist (also accepts "pic 18.jpg", .png, .jpeg ...)
  bubblesLoading = true;
  const found = (await Promise.all(CONFIG.bubblePhotos.map(resolvePhoto))).filter(Boolean);
  bubblesLoading = false;

  if (!$("#screen-bubbles").classList.contains("active") || field.childElementCount) return;

  const photos = found.length ? found : CONFIG.bubblePhotos;
  const mobile = window.innerWidth < 640;
  const crowded = photos.length > 14;          // many pictures -> slightly smaller bubbles
  fillBubbles(field, photos, photos.length, {  // one bubble for every picture
    minDur: 26,
    maxDur: 42,
    minSize: mobile ? (crowded ? 76 : 100) : (crowded ? 100 : 130),
    maxSize: mobile ? (crowded ? 130 : 180) : (crowded ? 175 : 240),
  });
  startBouncing(field, 14, 16);                // slow drift, bounces off every edge
}
function stopBubbles() {
  stopBouncing($("#bubbleField"));
  $("#bubbleField").replaceChildren();
}

/* ---------- Forgiving photo loader ---------- */
function photoCandidates(src) {
  const m = src.match(/^(.*?)(\.[A-Za-z0-9]+)$/);
  const base = m ? m[1] : src;
  const ext  = m ? m[2] : "";
  const names = new Set();
  [base, base.replace(/_/g, " "), base.replace(/ /g, "_")].forEach(n => {
    names.add(n);
    names.add(n.replace(/(\D)(\d+)$/, "$1 $2"));
  });
  const exts = [...new Set([ext, ".jpg", ".jpeg", ".png", ".webp", ".JPG", ".PNG"])];
  const out = [];
  names.forEach(n => exts.forEach(e => out.push(n + e)));
  return out;
}

function resolvePhoto(src) {
  const list = photoCandidates(src);
  return new Promise(resolve => {
    let i = 0;
    const next = () => {
      if (i >= list.length) { console.warn("Picture not found:", src); resolve(null); return; }
      const probe = new Image();
      const url = list[i++];
      probe.onload = () => resolve(url);
      probe.onerror = next;
      probe.src = url;
    };
    next();
  });
}

async function setPhoto(img, src) {
  const found = await resolvePhoto(src);
  img.src = found || src;
}

/* ---------- Bouncing picture boxes ("THIS IS MY HOME" slide) ---------- */
// Each box drifts in a random direction and bounces off every edge of the
// screen, so it travels up, down, left and right.

function startBouncing(field, minSpeed = 18, range = 18) {
  stopBouncing(field);
  const W = () => window.innerWidth;
  const H = () => window.innerHeight;

  const items = [...field.children].map(el => {
    const sign = () => (Math.random() < 0.5 ? -1 : 1);
    return {
      el,
      x: Math.random() * Math.max(1, W() - 200),
      y: Math.random() * Math.max(1, H() - 200),
      vx: sign() * (minSpeed + Math.random() * range),   // pixels per second
      vy: sign() * (minSpeed + Math.random() * range),
    };
  });

  const place = it => { it.el.style.transform = `translate(${it.x}px, ${it.y}px)`; };
  items.forEach(place);
  if (reduceMotion) return;

  let last = performance.now();
  const tick = now => {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    const w = W(), h = H();

    items.forEach(it => {
      const bw = it.el.offsetWidth, bh = it.el.offsetHeight;
      it.x += it.vx * dt;
      it.y += it.vy * dt;

      if (it.x <= 0)            { it.x = 0;       it.vx =  Math.abs(it.vx); }
      if (it.x + bw >= w)       { it.x = Math.max(0, w - bw); it.vx = -Math.abs(it.vx); }
      if (it.y <= 0)            { it.y = 0;       it.vy =  Math.abs(it.vy); }
      if (it.y + bh >= h)       { it.y = Math.max(0, h - bh); it.vy = -Math.abs(it.vy); }

      place(it);
    });
    field._raf = requestAnimationFrame(tick);
  };
  field._raf = requestAnimationFrame(tick);
}

function stopBouncing(field) {
  if (field && field._raf) cancelAnimationFrame(field._raf);
  if (field) field._raf = null;
}

// The floating call pictures stay hidden until she taps the envelope on "THIS IS MY HOME"
let homeBgOn = false;
let homeBubblesLoading = false;
async function startHomeBubbles() {
  if (!homeBgOn) return;                       // envelope not tapped yet -> no background pictures
  const field = $("#homeBubbles");
  if (field.childElementCount || homeBubblesLoading) return;

  homeBubblesLoading = true;
  const found = (await Promise.all(CONFIG.homeBubblePhotos.map(resolvePhoto))).filter(Boolean);
  homeBubblesLoading = false;

  if (!homeBgOn || !$("#screen-home").classList.contains("active") || field.childElementCount) return;

  const mobile = window.innerWidth < 640;
  fillBubbles(field, found.length ? found : CONFIG.homeBubblePhotos, mobile ? 5 : 7, {
    shape: "box",      // plain picture boxes (no circles), whole picture visible
    minDur: 20,
    maxDur: 32,
    minSize: mobile ? 130 : 200,
    maxSize: mobile ? 190 : 300,
  });
  startBouncing(field);
}
function stopHomeBubbles() {
  stopBouncing($("#homeBubbles"));
  $("#homeBubbles").replaceChildren();
}

/* ---------- Reminder pop-ups (shown one after another) ---------- */
// After the QR code is tapped: 4 reminders, then the bubbles + song start.
const REMINDERS = [
  { emoji: "💻", title: "Reminder",
    text: "Can you please use your lappy while exploring the website?",
    button: "Okay, noted" },
  { emoji: "🎥", title: "Reminder",
    text: "Can you make a video of yourself while exploring the website, please?",
    button: "Okay, noted" },
  { emoji: "📩", title: "Reminder",
    text: "Then send it to me, please. Wanna see your reaction while exploring the cringe website HAHAAHA",
    button: "Okay, will do" },
  { emoji: "🥹", title: "Reminder",
    text: "But promise me you won't cry ha",
    button: "I promise" },
];

// After she taps the envelope on "THIS IS MY HOME": 3 reminders, then the pictures open.
const CRY_REMINDERS = [
  { emoji: "🥺", title: "Reminder",
    text: "Don't cry ha",
    button: "Okay, I won't" },
  { emoji: "🥹", title: "Reminder",
    text: "You promise not to cry, ha?",
    button: "I promise" },
  { emoji: "🎥", title: "Reminder",
    text: "Please video your face, wanna see your face in the video. I'll check it later after you send it to me.",
    button: "Okay, will do" },
];

// Shown on the "A person / A place" question, before she answers.
const VOLUME_REMINDER = [
  { emoji: "🔊", title: "Reminder",
    text: "Make the volume up please.",
    button: "Okay" },
];

// Shown at the very end, once she has opened all 3 gifts and is back on the gift page:
// a question first, then the reason why the website was made.
const ENDING_REMINDER = [
  { emoji: "🤔", title: "Reminder",
    text: "For sure you were wondering why I made this website, nu? HAHA 😅",
    button: "Yes, why?" },
  { emoji: "💌", title: "Reminder",
    text: "Actually, deng, the reason why I made this website is because I just wanna make you happy lng. Mao ni akong way sa pag greet nmo. All I want rmn is to make your day extra special gae, kay sad or problematic raba ka lately, if I'm not mistaken. So hoping it helps and made you smile, deng. Kahit smile mn lng, slight? HAHAHHAHAHA",
    button: "Aww, continue" },
  { emoji: "😎", title: "Reminder",
    text: "And also, ikaduha nga rason why I made this is because wla lng, sa pag coding raba ka na interested nko, so yeah, I just wanna flex lng po :>\n\nHAPPY TEACHER'S DAY DENG <3",
    button: "Okay, baby" },
  { emoji: "👇", title: "Reminder",
    text: "Can you scroll down the screen, please?",
    button: "Okay, scrolling" },
];

// Shown when she taps the shaking "P.S." box at the very bottom of the last slide.
const PS_REMINDER = [
  { emoji: "💌", title: "Reminder",
    text: "Nangluod pko nmo but don't mind it po, just enjoy your day",
    button: "Okay po" },
];
let giftSeen = { letter: false, fav: false, mem: false };
let endingShown = false;
function maybeShowEnding() {
  if (endingShown) return;
  if (!(giftSeen.letter && giftSeen.fav && giftSeen.mem)) return;
  endingShown = true;
  setTimeout(() => openReminder(ENDING_REMINDER, "end"), 400);
}

let reminderList = REMINDERS;
let reminderMode = "intro";      // "intro" = the reminders after the QR, "cry" = the ones before the pictures
let reminderStep = 0;

function renderReminder() {
  const r = reminderList[reminderStep];
  const card = $("#reminder .modal-card");
  $("#reminder .modal-emoji").textContent = r.emoji;
  $("#reminderTitle").textContent = r.title;
  const msgEl = $("#reminder .modal-card p:not(.modal-emoji)");
  msgEl.textContent = r.text;
  msgEl.style.whiteSpace = "pre-line";     // lets the text have line breaks
  $("#reminderOk").textContent = r.button;
  card.classList.toggle("long", r.text.length > 200);   // long message -> wider card
  card.style.animation = "none";           // replay the pop-in for the new reminder
  void card.offsetWidth;
  card.style.animation = "";
}

function openReminder(list = REMINDERS, mode = "intro") {
  reminderList = list;
  reminderMode = mode;
  reminderStep = 0;
  renderReminder();
  $("#reminder").hidden = false;
  document.body.style.overflow = "hidden";
  $("#reminderOk").focus();
}
function closeReminder() {
  $("#reminder").hidden = true;
  document.body.style.overflow = "";
}

/* ---------- Gallery ---------- */
let galIndex = 0;

function renderGallery(animate = true) {
  const item = CONFIG.memories[galIndex];
  const photo = $("#galPhoto");
  const img = $("#galImg");

  photo.classList.remove("empty");
  photo.dataset.label = `Add photo ${galIndex + 1}`;
  img.alt = item.caption;
  img.src = item.img;
  $("#galCaption").textContent = item.caption;

  $("#galPrev").disabled = galIndex === 0;
  $("#galNext").textContent = "Next";

  $$("#galDots i").forEach((d, i) => d.classList.toggle("on", i === galIndex));

  if (animate) {
    const p = $(".polaroid");
    p.classList.remove("swap");
    void p.offsetWidth;
    p.classList.add("swap");
  }
}

function buildDots() {
  const dots = $("#galDots");
  dots.replaceChildren(...CONFIG.memories.map(() => document.createElement("i")));
}

/* ---------- All 5 pictures together ---------- */
function buildCollage() {
  const grid = $("#collageGrid");
  grid.replaceChildren();
  CONFIG.memories.forEach((m, i) => {
    const fig = document.createElement("figure");
    fig.className = "collage-item";
    const photo = document.createElement("div");
    photo.className = "photo";
    photo.dataset.label = `Add photo ${i + 1}`;
    const img = document.createElement("img");
    img.alt = m.caption;
    img.src = m.img;
    photo.appendChild(img);
    const cap = document.createElement("figcaption");
    cap.textContent = m.caption;
    fig.append(photo, cap);
    grid.appendChild(fig);
    watchPhoto(img);
  });
}
function showCollage() {
  stopHomeBubbles();                       // no background pictures behind the 5 pictures
  $("#screen-home").classList.add("wide"); // bigger pictures
  $("#homeTitle").hidden = false;          // "THIS IS MY HOME <3" is shown here, on the 5-picture slide
  $("#gallery").hidden = true;
  $("#collage").hidden = false;
  window.scrollTo({ top: 0, behavior: "auto" });
}
function hideCollage() {
  $("#collage").hidden = true;
  $("#screen-home").classList.remove("wide");
}

// "THIS IS MY HOME" booms (with a burst of hearts), then the next slide opens
let booming = false;
function boomThenNext() {
  if (booming) return;
  booming = true;
  const title = $("#homeTitle");
  const ref = title.hidden ? $("#collage") : title;       // title is hidden while only pictures show
  const r = ref.getBoundingClientRect();
  const cx = r.left + r.width / 2, cy = r.top + r.height / 2;

  title.classList.add("boom");
  $$("#collageGrid .collage-item").forEach((el, i) => {   // each picture pops away
    el.style.setProperty("--i", i);
    el.classList.add("burst");
  });

  if (!reduceMotion) {
    for (let i = 0; i < 20; i++) {
      const hs = document.createElement("span");
      hs.className = "boom-heart";
      hs.textContent = "♥";
      const ang = (i / 20) * Math.PI * 2 + Math.random() * 0.4;
      const dist = 140 + Math.random() * 220;
      hs.style.setProperty("--cx", cx + "px");
      hs.style.setProperty("--cy", cy + "px");
      hs.style.setProperty("--dx", Math.cos(ang) * dist + "px");
      hs.style.setProperty("--dy", Math.sin(ang) * dist + "px");
      document.body.appendChild(hs);
      setTimeout(() => hs.remove(), 1100);
    }
  }

  setTimeout(() => {
    title.classList.remove("boom");
    $$("#collageGrid .collage-item").forEach(el => el.classList.remove("burst"));
    booming = false;
    hideCollage();
    showVideo();                       // next: the goodnight video
  }, reduceMotion ? 50 : 1300);
}

/* ---------- Bigger pictures on "THIS IS MY HOME" + works on phone, tablet, laptop, PC ---------- */
function injectResponsiveStyles() {
  if (document.getElementById("responsiveStyles")) return;
  const st = document.createElement("style");
  st.id = "responsiveStyles";
  st.textContent = `
/* ----- THIS IS MY HOME: bigger pictures ----- */
#screen-home { max-width: 640px; }
#screen-home .polaroid {
  max-width: none;
  width: min(100%, 520px, max(260px, calc((100vh - 340px) * .75)));
  width: min(100%, 520px, max(260px, calc((100dvh - 340px) * .75)));
}
#screen-home .polaroid figcaption { font-size: 24px; }
#screen-home.wide { max-width: 1040px; }
@media (min-width: 601px) { #screen-home.wide .collage-item figcaption { font-size: 18px; } }

/* ----- every device: phone, tablet, laptop, PC ----- */
html { -webkit-text-size-adjust: 100%; text-size-adjust: 100%; }
img, video { max-width: 100%; }
button, .envelope { touch-action: manipulation; }
.stage {
  min-height: 100vh;
  min-height: 100dvh;                                   /* phones: ignores the moving address bar */
  padding-left: max(16px, env(safe-area-inset-left, 0px));
  padding-right: max(16px, env(safe-area-inset-right, 0px));
}
.bubble-title { font-size: clamp(32px, min(11.5vw, 15vh), 104px); }   /* never taller than the screen */
.letter-card { max-height: 88vh; max-height: 88dvh; }
.qr-box { width: min(216px, 100%); height: auto; aspect-ratio: 1; }

/* touch screens have no hover: stop buttons from staying "lifted" after a tap */
@media (hover: none) {
  .next-btn:hover, .qr-frame:hover, .gift-card:hover { transform: none; box-shadow: inherit; }
}

/* small phones */
@media (max-width: 360px) {
  .card { padding: 22px 14px 24px; }
  .script-title { font-size: 24px; }
  .scoreboard { gap: 6px; }
  .sb-side { gap: 5px; }
  .tile { width: 44px; height: 44px; font-size: 24px; }
  .tile-name { font-size: 12px; }
  .gift-card { min-height: 170px; }
  .next-btn { padding: 12px 30px; font-size: 16px; }
}

/* phones held sideways (short screens) */
@media (max-height: 520px) and (orientation: landscape) {
  .stage { align-items: flex-start; padding-top: 12px; padding-bottom: 12px; }
  .bubble-actions { bottom: 12px; }
  .auto-note { bottom: 66px; font-size: 13px; padding: 7px 14px; }
  .qr-box { width: 170px; }
  .modal-card { max-height: 92vh; overflow-y: auto; }
}`;
  document.head.appendChild(st);
}

/* ---------- Bigger pictures: "Our Scrabble Game" + "From this ... to this" ---------- */
function injectBigPhotoStyles() {
  if (document.getElementById("bigPhotoStyles")) return;
  const st = document.createElement("style");
  st.id = "bigPhotoStyles";
  st.textContent = `
/* wider slides = bigger pictures (on phones the card simply uses the full width) */
#screen-scrabble { max-width: 680px; }
#screen-fromto   { max-width: 760px; }
#screen-scrabble .card, #screen-fromto .card { padding-left: 14px; padding-right: 14px; }

/* Our Scrabble Game */
.scrabble-grid { gap: 16px; }
.scrabble-grid figure { padding: 7px 7px 9px; }
.scrabble-grid .photo { aspect-ratio: 4 / 5; }
.scrabble-grid figcaption { font-size: 15px; }

/* From this ... to this */
.fromto-grid { gap: 4px; }
.ft-item { padding: 7px 7px 11px; }
.ft-item .photo { aspect-ratio: 3 / 4; }
.ft-label { font-size: 18px; }
.ft-item figcaption { font-size: 16px; }
.ft-arrow { font-size: 18px; }`;
  document.head.appendChild(st);
}

/* ---------- Goodnight video ---------- */
function injectVideoStyles() {
  if (document.getElementById("videoStyles")) return;
  const st = document.createElement("style");
  st.id = "videoStyles";
  st.textContent = `
#screen-video { max-width: 1100px; }
.video-card { padding: 20px 16px 24px; }
.video-card .script-title { margin-bottom: 16px; }
.video-wrap { margin: 0 auto 20px; background: #000; border-radius: 16px; overflow: hidden; box-shadow: 0 0 0 4px var(--blush), 0 14px 30px rgba(116, 0, 1, .35); }
.video-wrap video { display: block; width: 100%; max-height: calc(100vh - 240px); max-height: calc(100dvh - 240px); background: #000; object-fit: contain; }
.collage-item.burst { animation: itemBurst .8s ease-in forwards; animation-delay: calc(var(--i, 0) * .1s); }
@keyframes itemBurst {
  0%   { scale: 1;    opacity: 1; }
  30%  { scale: 1.15; opacity: 1; }
  100% { scale: .2;   opacity: 0; filter: blur(5px); }
}`;
  document.head.appendChild(st);
}

function pauseVideo() {
  const v = $("#goodnightVideo");
  if (v && !v.paused) v.pause();
}

function showVideo() {
  showScreen("screen-video");
  const v = $("#goodnightVideo");
  v.currentTime = 0;
  v.play().catch(() => {});            // if the browser blocks autoplay, she taps play
}

/* ---------- Scrabble game ---------- */
function buildScrabble() {
  const sc = CONFIG.scrabble;
  $("#sbNameL").textContent = sc.nameLeft;
  $("#sbScoreL").textContent = sc.scoreLeft;
  $("#sbNameR").textContent = sc.nameRight;
  $("#sbScoreR").textContent = sc.scoreRight;
  $("#sbNote").textContent = sc.note;

  const grid = $("#scrabbleGrid");
  grid.replaceChildren();
  sc.photos.forEach((p, i) => {
    const fig = document.createElement("figure");
    const photo = document.createElement("div");
    photo.className = "photo";
    photo.dataset.label = `Add photo ${i + 1}`;
    const img = document.createElement("img");
    img.alt = p.caption || "Scrabble game";
    img.src = p.img;
    photo.appendChild(img);
    fig.append(photo);
    if (p.caption) {                 // only add a caption line if there is text
      const cap = document.createElement("figcaption");
      cap.textContent = p.caption;
      fig.append(cap);
    }
    grid.appendChild(fig);
    watchPhoto(img);
  });
}

/* ---------- From this -> to this ---------- */
function buildFromTo() {
  [["From", CONFIG.fromTo.from], ["To", CONFIG.fromTo.to]].forEach(([key, item]) => {
    const photo = $(`#ft${key}Photo`);
    const img = $(`#ft${key}Img`);
    photo.dataset.label = `Add "${key.toLowerCase()} this" photo`;
    img.alt = item.caption;
    setPhoto(img, item.img);
    $(`#ft${key}Caption`).textContent = item.caption;
    watchPhoto(img);
  });
}

/* ---------- The art and the artist ---------- */
function buildArtAndArtist() {
  [["Top", CONFIG.artAndArtist.top], ["Bottom", CONFIG.artAndArtist.bottom]].forEach(([key, item]) => {
    const img = $(`#aa${key}Img`);
    img.alt = item.caption;
    setPhoto(img, item.img);
    $(`#aa${key}Caption`).textContent = item.caption;
    watchPhoto(img);
  });
}

/* ---------- Music + gift hub ---------- */
const bgm = $("#bgm");
let voice = $("#voice");   // set up in ensureVoiceUI()

// Love song: starts after "A person / A place" and keeps looping until Replay
let loveOn = false;
const loveSong = document.createElement("audio");
loveSong.src = "picture/lovesong.m4a";
loveSong.loop = true;                 // keeps repeating
loveSong.preload = "auto";
loveSong.volume = 0.7;
document.body.appendChild(loveSong);

function startLoveSong() {
  loveOn = true;
  loveSong.play().catch(() => toast("The love song couldn't be played. Check the file name."));
}

let toastTimer;

function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 3200);
}

/* ---------- Intro flow ---------- */
// QR tap -> reminder pop-ups -> song plays while she looks at the pictures
// -> after 10s a note appears -> when the song ends the bubbles pop like
// balloons, then the Play + Next buttons show and she taps Next to continue
// (nothing moves on by itself).
let introActive = false;
let noteTimer = null;
let autoTimer = null;

function endIntro() {
  introActive = false;
  clearTimeout(noteTimer);
  noteTimer = null;
  $("#autoNote").hidden = true;
}

/* ---------- Show the whole screenshot (no cropping) in favorites + fav memories ---------- */
function injectFavStyles() {
  if (document.getElementById("favStyles")) return;
  const st = document.createElement("style");
  st.id = "favStyles";
  st.textContent = `
.fav-grid { align-items: start; }
.fav-item .photo, .fav-item:first-child .photo, .single-pic .photo { aspect-ratio: auto; background: #fff; }
.fav-item .photo img, .single-pic .photo img { position: static; width: 100%; height: auto; object-fit: contain; display: block; }
.fav-item .photo.empty, .single-pic .photo.empty { min-height: 140px; background: linear-gradient(135deg, #ecdcae, #d9bd7c); }
.fav-item .photo.empty img, .single-pic .photo.empty img { display: none; }`;
  document.head.appendChild(st);
}

/* ---------- Voice clip (play button next to "Next") ---------- */
// Builds the voice <audio>, the Play button and the layout by itself if the
// HTML / CSS don't have them yet, so the old song (#bgm) is never touched.
function ensureVoiceUI() {
  if (!$("#voice")) {
    const a = document.createElement("audio");
    a.id = "voice";
    a.src = "picture/channy greet.m4a";
    a.preload = "auto";
    document.body.appendChild(a);
  }
  voice = $("#voice");

  const next = $("#bubblesNext");
  let wrap = next.parentElement;
  if (!wrap.classList.contains("bubble-actions")) {
    wrap = document.createElement("div");
    wrap.className = "bubble-actions";
    next.parentElement.insertBefore(wrap, next);
    wrap.appendChild(next);
  }

  if (!$("#voiceBtn")) {
    const b = document.createElement("button");
    b.id = "voiceBtn";
    b.type = "button";
    b.className = "ghost-btn voice-btn";
    b.hidden = true;
    b.setAttribute("aria-label", "Play voice message");
    b.textContent = "▶ Play";
    wrap.insertBefore(b, next);
  }

  if (!document.getElementById("voiceStyles")) {
    const st = document.createElement("style");
    st.id = "voiceStyles";
    st.textContent = `
.bubble-actions { position: absolute; left: 0; right: 0; bottom: calc(26px + env(safe-area-inset-bottom, 0px)); z-index: 4; display: flex; justify-content: center; align-items: center; gap: 12px; pointer-events: none; }
.bubble-actions button { pointer-events: auto; }
.bubble-actions #bubblesNext { position: static; transform: none; }
.bubble-actions #bubblesNext:hover { transform: translateY(-2px); }
.bubble-actions #bubblesNext:active { transform: scale(.97); }
.voice-btn { padding: 13px 26px; font-size: 17px; box-shadow: 0 8px 18px rgba(116, 0, 1, .25); }
#voiceBtn.pop-in { animation: nextPop .6s cubic-bezier(.2, 1.4, .3, 1) both; }`;
    document.head.appendChild(st);
  }
}

function setVoiceLabel(playing) {
  $("#voiceBtn").textContent = playing ? "■ Stop" : "▶ Play";
}
function stopVoice() {
  voice.pause();
  voice.currentTime = 0;
  setVoiceLabel(false);
}

function goToQuestion() {
  stopVoice();
  clearTimeout(autoTimer);
  autoTimer = null;
  endIntro();
  resetQuestion();
  showScreen("screen-question");
  openReminder(VOLUME_REMINDER, "volume");   // "turn your volume up" before she answers
}

// Bubbles pop one after another like balloons, then done() is called
function popBubbles(done) {
  const field = $("#bubbleField");
  stopBouncing(field);                       // freeze them where they are
  const bubbles = [...field.children];
  if (!bubbles.length) { done(); return; }

  const gap = 150;                           // ms between each pop
  bubbles.forEach((b, i) => {
    const delay = reduceMotion ? 0 : i * gap + Math.random() * 100;
    setTimeout(() => {
      const r = b.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      b.classList.add("pop");

      if (reduceMotion) return;
      for (let k = 0; k < 10; k++) {         // little burst of bits
        const bit = document.createElement("span");
        bit.className = "pop-bit";
        const ang = (k / 10) * Math.PI * 2 + Math.random() * 0.5;
        const dist = r.width * 0.5 + Math.random() * 50;
        bit.style.left = cx + "px";
        bit.style.top = cy + "px";
        bit.style.setProperty("--dx", Math.cos(ang) * dist + "px");
        bit.style.setProperty("--dy", Math.sin(ang) * dist + "px");
        field.appendChild(bit);
        setTimeout(() => bit.remove(), 800);
      }
    }, delay);
  });

  const total = reduceMotion ? 60 : bubbles.length * gap + 100 + 550;
  setTimeout(() => { field.replaceChildren(); done(); }, total);
}

function finishIntro() {
  endIntro();
  popBubbles(() => {
    if (!$("#screen-bubbles").classList.contains("active")) return;  // she left already
    const btn = $("#bubblesNext");
    btn.hidden = false;
    btn.classList.remove("pop-in");
    void btn.offsetWidth;
    btn.classList.add("pop-in");             // Next button pops in after the bubbles

    const vb = $("#voiceBtn");               // play button pops in next to it
    setVoiceLabel(false);
    vb.hidden = false;
    vb.classList.remove("pop-in");
    void vb.offsetWidth;
    vb.classList.add("pop-in");
  });
}

function startIntro() {
  endIntro();
  clearTimeout(autoTimer);
  introActive = true;
  $("#bubblesNext").hidden = true;
  $("#voiceBtn").hidden = true;
  bgm.currentTime = 0;
  bgm.play().catch(() => {
    // song file missing / blocked: don't leave her stuck
    toast("The song couldn't be played. Check the file name.");
    setTimeout(() => { if (introActive) finishIntro(); }, 15000);
  });
}

bgm.addEventListener("play", () => {
  if (introActive && !noteTimer) {
    noteTimer = setTimeout(() => { if (introActive) $("#autoNote").hidden = false; }, 10000);
  }
});
bgm.addEventListener("ended", () => {
  if (introActive) finishIntro();
});

function openLetter() {
  giftSeen.letter = true;
  const body = $("#letterBody");
  body.replaceChildren();
  CONFIG.letter.paragraphs.forEach(text => {
    const p = document.createElement("p");
    p.textContent = text;
    body.appendChild(p);
  });
  const sign = document.createElement("p");
  sign.className = "sign";
  sign.textContent = CONFIG.letter.sign;
  body.appendChild(sign);

  $("#letterModal").hidden = false;
  document.body.style.overflow = "hidden";
  $("#closeLetter").focus();
}
function closeLetter() {
  $("#letterModal").hidden = true;
  document.body.style.overflow = "";
  resetGiftIcons();                      // envelope closes again
  maybeShowEnding();
}

/* ---------- Gift hub: envelope opens, heart pops, camera flashes ---------- */
function injectGiftStyles() {
  if (document.getElementById("giftStyles")) return;
  const st = document.createElement("style");
  st.id = "giftStyles";
  st.textContent = `
/* Letter: a small envelope (replaces the stamp) */
.mini-env { display: block; width: min(190px, 70%); margin: 16px auto 8px; }
.mini-env .env-letter { font-size: 12px; padding-top: 10%; }
.mini-env .seal { font-size: 16px; }

/* Heart: gentle heartbeat, then it pops */
.fav-heart { transform-origin: 50% 60%; animation: heartBeat 1.8s ease-in-out infinite; }
@keyframes heartBeat {
  0%, 56%, 100% { transform: scale(1); }
  14% { transform: scale(1.1); }
  28% { transform: scale(1); }
  42% { transform: scale(1.07); }
}
.fav-heart.pop { animation: heartPop .6s ease-out forwards; }
@keyframes heartPop {
  0%   { transform: scale(1);    opacity: 1; }
  35%  { transform: scale(1.4);  opacity: 1; }
  60%  { transform: scale(.85);  opacity: 1; }
  100% { transform: scale(1.9);  opacity: 0; }
}

/* Camera: shutter shake + white flash */
.camera { transform-origin: 50% 60%; }
.camera.snap { animation: camSnap .45s ease-out; }
@keyframes camSnap {
  0%   { transform: scale(1); }
  25%  { transform: scale(.88) rotate(-3deg); }
  55%  { transform: scale(1.06) rotate(2deg); }
  100% { transform: scale(1); }
}
.cam-flash {
  position: fixed; inset: 0; z-index: 90;
  background: #fff;
  pointer-events: none;
  opacity: 0;
  animation: camFlash .9s ease-out forwards;
}
@keyframes camFlash {
  0%   { opacity: 0; }
  10%  { opacity: 1; }
  35%  { opacity: 1; }
  100% { opacity: 0; }
}`;
  document.head.appendChild(st);
}

// Swaps the old stamp for a small envelope that can open
function upgradeGiftHub() {
  const card = $("#giftLetter");
  const stamp = $(".stamp", card);
  if (!stamp || $(".mini-env", card)) return;
  const env = document.createElement("span");
  env.className = "envelope mini-env";
  env.setAttribute("aria-hidden", "true");
  env.innerHTML =
    '<span class="env-letter"><span>For you ♥</span></span>' +
    '<span class="env-pocket env-left"></span>' +
    '<span class="env-pocket env-right"></span>' +
    '<span class="env-pocket env-bottom"></span>' +
    '<span class="env-flap"></span>' +
    '<span class="seal">♥</span>';
  stamp.replaceWith(env);
}

function resetGiftIcons() {
  const env = $(".mini-env");
  if (env) env.classList.remove("open");
  const heart = $("#giftFavorites .fav-heart");
  if (heart) heart.classList.remove("pop");
  const cam = $("#giftMemories .camera");
  if (cam) cam.classList.remove("snap");
  $$(".cam-flash").forEach(el => el.remove());
  giftBusy = false;
}

let giftBusy = false;

// 1) Letter: the envelope opens, then the letter shows
function openLetterAnimated() {
  if (giftBusy) return;
  giftBusy = true;
  const env = $(".mini-env");
  if (env) env.classList.add("open");
  setTimeout(() => {
    giftBusy = false;
    openLetter();
  }, reduceMotion || !env ? 50 : 1100);
}

// 2) Heart: pops with a burst of little hearts, then My favorites opens
function popHeartThenFavorites() {
  if (giftBusy) return;
  giftBusy = true;
  const heart = $("#giftFavorites .fav-heart");
  if (heart) {
    heart.classList.add("pop");
    if (!reduceMotion) {
      const r = heart.getBoundingClientRect();
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      for (let i = 0; i < 14; i++) {
        const h = document.createElement("span");
        h.className = "boom-heart";
        h.textContent = "♥";
        const ang = (i / 14) * Math.PI * 2 + Math.random() * 0.4;
        const dist = 80 + Math.random() * 100;
        h.style.setProperty("--cx", cx + "px");
        h.style.setProperty("--cy", cy + "px");
        h.style.setProperty("--dx", Math.cos(ang) * dist + "px");
        h.style.setProperty("--dy", Math.sin(ang) * dist + "px");
        document.body.appendChild(h);
        setTimeout(() => h.remove(), 1100);
      }
    }
  }
  setTimeout(() => {
    showFavorites();
    resetGiftIcons();
  }, reduceMotion || !heart ? 50 : 700);
}

/* ---------- P.S. box (very bottom of the last slide) ---------- */
// A shaking box so she notices it. "Replay from the start" stays locked
// until she has pressed it.
let psBusy = false;

function injectEndingStyles() {
  if (document.getElementById("endingStyles")) return;
  const st = document.createElement("style");
  st.id = "endingStyles";
  st.textContent = `
#reminder .modal-card { max-height: 92vh; max-height: 92dvh; overflow-y: auto; }
#reminder .modal-card.long { max-width: 440px; }

.ps-wrap { margin-top: 22px; text-align: center; animation: screenIn .7s ease both; }
.ps-box {
  display: inline-flex; flex-direction: column; align-items: center; gap: 4px;
  padding: 14px 28px;
  background: #fff;
  border: 4px solid var(--blush);
  border-radius: 16px;
  box-shadow: 0 8px 18px rgba(116, 0, 1, .25);
  transform-origin: 50% 90%;
  animation: psShake 2.2s ease-in-out infinite;
}
.ps-box .ps-icon  { font-size: 38px; line-height: 1; }
.ps-box .ps-title { font-weight: 700; font-size: 20px; color: var(--rose-deep); }
.ps-box .ps-sub   { font-size: 13px; font-weight: 700; color: var(--rose-deep); }
.ps-box.pressed   { animation: none; }
@keyframes psShake {
  0%, 52%, 100% { transform: rotate(0) translateX(0); }
  56% { transform: rotate(-7deg) translateX(-3px); }
  61% { transform: rotate(7deg)  translateX(3px); }
  66% { transform: rotate(-6deg) translateX(-3px); }
  71% { transform: rotate(6deg)  translateX(3px); }
  76% { transform: rotate(-3deg) translateX(-2px); }
  81% { transform: rotate(3deg)  translateX(2px); }
  86% { transform: rotate(0) translateX(0); }
}

/* locked button */
.ghost-btn:disabled, .ghost-btn:disabled:hover { opacity: .4; cursor: not-allowed; background: #fff; }`;
  document.head.appendChild(st);
}

function lockReplay(locked) {
  const r = $("#replay");
  if (r) r.disabled = locked;
}

function buildPS() {
  if ($("#psWrap")) return;
  const wrap = document.createElement("div");
  wrap.className = "ps-wrap";
  wrap.id = "psWrap";
  wrap.hidden = true;
  wrap.innerHTML =
    '<button class="ps-box" id="psBtn" type="button" aria-label="P.S. one more thing, tap to open">' +
      '<span class="ps-icon" aria-hidden="true">🎁</span>' +
      '<span class="ps-title">P.S.</span>' +
      '<span class="ps-sub">One more thing&hellip;</span>' +
    '</button>';
  $("#screen-gift .card").appendChild(wrap);                 // very bottom of the last slide
  $("#psBtn").addEventListener("click", openPS);
}
function showPS() { const w = $("#psWrap"); if (w) w.hidden = false; }
function hidePS() {
  const w = $("#psWrap"); if (w) w.hidden = true;
  const b = $("#psBtn"); if (b) b.classList.remove("pressed");
  psBusy = false;
}
function openPS() {
  if (psBusy) return;
  psBusy = true;
  const b = $("#psBtn");
  if (b) b.classList.add("pressed");                         // stops shaking
  lockReplay(false);                                         // "Replay from the start" unlocks now
  setTimeout(() => openReminder(PS_REMINDER, "ps"), reduceMotion ? 50 : 250);
}

/* ---------- Camera: she takes a photo of herself (never saved) ---------- */
// Tap the camera -> "Take a photo of yourself" -> flash -> Fav memories shows the
// original picture with her photo next to it. The photo only lives in memory
// (nothing is stored or uploaded) and disappears when the page is closed/replayed.
let camStream = null;
let selfieData = "";

function injectCameraStyles() {
  if (document.getElementById("cameraStyles")) return;
  const st = document.createElement("style");
  st.id = "cameraStyles";
  st.textContent = `
.cam-card { max-width: 420px; max-height: 94vh; max-height: 94dvh; overflow-y: auto; }
.cam-card .cam-sub { margin: 0 0 14px; font-size: 15px; }
.cam-view { position: relative; margin: 0 auto 16px; width: 100%; aspect-ratio: 3 / 4; max-height: 52vh; border-radius: 14px; overflow: hidden; background: #2a1a1e; }
.cam-view video { display: block; width: 100%; height: 100%; object-fit: cover; transform: scaleX(-1); }
.cam-msg { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; padding: 16px; color: #fff; font-weight: 700; font-size: 15px; line-height: 1.4; text-align: center; }
.cam-actions { display: flex; justify-content: center; align-items: center; gap: 12px; flex-wrap: wrap; }
.cam-actions .next-btn:disabled { opacity: .5; cursor: default; }

/* Fav memories: the original picture + her photo side by side */
#screen-favmem { max-width: 860px; }
.fm-row { display: flex; flex-wrap: wrap; justify-content: center; align-items: flex-start; gap: 22px; margin-bottom: 22px; }
.fm-row .single-pic { flex: 1 1 250px; max-width: 340px; margin: 0; }
.fm-row .selfie-pic { transform: rotate(1.5deg); }`;
  document.head.appendChild(st);
}

function buildCameraUI() {
  if ($("#camModal")) return;
  const m = document.createElement("div");
  m.className = "modal";
  m.id = "camModal";
  m.hidden = true;
  m.setAttribute("role", "dialog");
  m.setAttribute("aria-modal", "true");
  m.setAttribute("aria-labelledby", "camTitle");
  m.innerHTML = `
    <div class="modal-card cam-card">
      <p class="modal-emoji" aria-hidden="true">📸</p>
      <h3 id="camTitle">Take a photo of yourself</h3>
      <p class="cam-sub">Smile, baby :&gt; It isn't saved or sent anywhere, it only shows on the next page.</p>
      <div class="cam-view" id="camView">
        <video id="camVideo" autoplay playsinline muted></video>
        <div class="cam-msg" id="camMsg" hidden></div>
      </div>
      <div class="cam-actions">
        <button class="ghost-btn" id="camRetry" type="button" hidden>Try again</button>
        <button class="ghost-btn" id="camFallback" type="button" hidden>Use phone camera</button>
        <button class="next-btn inline" id="camSnap" type="button">Take photo</button>
      </div>
    </div>`;
  document.body.appendChild(m);

  const f = document.createElement("input");
  f.type = "file";
  f.accept = "image/*";
  f.setAttribute("capture", "user");
  f.id = "camFile";
  f.hidden = true;
  document.body.appendChild(f);
}

// Puts the original picture and her photo in one row
function upgradeFavMemory() {
  const pic = $("#screen-favmem .single-pic");
  if (!pic || $(".fm-row")) return;
  const row = document.createElement("div");
  row.className = "fm-row";
  pic.parentElement.insertBefore(row, pic);
  row.appendChild(pic);

  const fig = document.createElement("figure");
  fig.className = "single-pic selfie-pic";
  fig.id = "selfiePic";
  fig.hidden = true;
  fig.innerHTML = '<div class="photo"><img id="selfieImg" alt="Your photo"></div><figcaption id="selfieCaption"></figcaption>';
  row.appendChild(fig);
  $("#selfieCaption").textContent = CONFIG.favMemory.selfieCaption || "";
}

function stopCamera() {
  if (camStream) { camStream.getTracks().forEach(t => t.stop()); camStream = null; }
  const v = $("#camVideo");
  if (v) v.srcObject = null;
}

function cameraUnavailable() {
  const msg = $("#camMsg");
  msg.textContent = "I can't open the camera. Please allow camera access and tap \"Try again\", or tap \"Use phone camera\".";
  msg.hidden = false;
  $("#camSnap").disabled = true;
  $("#camRetry").hidden = false;
  $("#camFallback").hidden = false;
}

async function startCamera() {
  const video = $("#camVideo");
  $("#camMsg").hidden = true;
  $("#camRetry").hidden = true;
  $("#camFallback").hidden = true;
  $("#camSnap").disabled = false;
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) { cameraUnavailable(); return; }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
    if ($("#camModal").hidden) { stream.getTracks().forEach(t => t.stop()); return; }   // closed while asking permission
    camStream = stream;
    video.onloadedmetadata = () => {             // make the preview match exactly what gets captured
      const ratio = video.videoWidth / video.videoHeight || 0.75;
      const view = $("#camView");
      view.style.aspectRatio = String(ratio);
      view.style.width = `min(100%, ${(52 * ratio).toFixed(1)}vh)`;
      view.style.maxHeight = "none";
    };
    video.srcObject = stream;
    await video.play().catch(() => {});
  } catch (err) {
    cameraUnavailable();
  }
}

function openCamera() {
  if (giftBusy) return;
  giftBusy = true;
  const cam = $("#giftMemories .camera");
  if (cam) {
    cam.classList.add("snap");
    setTimeout(() => cam.classList.remove("snap"), 450);
  }
  $("#camModal").hidden = false;
  document.body.style.overflow = "hidden";
  startCamera();
}

function closeCamera() {
  stopCamera();
  $("#camModal").hidden = true;
  document.body.style.overflow = "";
  giftBusy = false;
}

// Draws a video frame / image onto a canvas and returns it as a picture in memory
function frameToData(src, w, h, mirror) {
  const scale = Math.min(1, 900 / Math.max(w, h));
  const c = document.createElement("canvas");
  c.width = Math.round(w * scale);
  c.height = Math.round(h * scale);
  const ctx = c.getContext("2d");
  if (mirror) { ctx.translate(c.width, 0); ctx.scale(-1, 1); }   // same as the mirrored preview
  ctx.drawImage(src, 0, 0, c.width, c.height);
  return c.toDataURL("image/jpeg", 0.9);
}

// Flash, then show Fav memories with her photo next to the original one
function finishSelfie(data) {
  selfieData = data;
  const go = () => {
    closeCamera();
    $("#selfieImg").src = selfieData;
    $("#selfiePic").hidden = false;
    showMemories();
  };
  if (reduceMotion) { go(); return; }
  const flash = document.createElement("div");
  flash.className = "cam-flash";
  document.body.appendChild(flash);
  setTimeout(go, 280);                         // switch while the screen is fully white
  setTimeout(() => flash.remove(), 950);
}

function takePhoto() {
  const v = $("#camVideo");
  if (!v.videoWidth) return;                   // camera not ready yet
  finishSelfie(frameToData(v, v.videoWidth, v.videoHeight, true));
}

function clearSelfie() {
  selfieData = "";
  const pic = $("#selfiePic");
  if (pic) pic.hidden = true;
  const img = $("#selfieImg");
  if (img) img.removeAttribute("src");
}

/* ---------- Fav memories (one picture) ---------- */
function buildFavMemory() {
  const m = CONFIG.favMemory;
  $("#fmTitle").textContent = m.title;
  const img = $("#fmImg");
  img.alt = m.caption || "Fav memory";
  setPhoto(img, m.img);
  $("#fmCaption").textContent = m.caption;
  watchPhoto(img);
}

function showMemories() {
  giftSeen.mem = true;
  showScreen("screen-favmem");
}

/* ---------- My favorites ---------- */
let favTimer = null;

function buildFavorites() {
  const f = CONFIG.favorites;
  $("#favTitle").textContent = f.title;
  const grid = $("#favGrid");
  grid.replaceChildren();
  f.photos.forEach((p, i) => {
    const fig = document.createElement("figure");
    fig.className = "fav-item";
    fig.style.setProperty("--i", i);
    const photo = document.createElement("div");
    photo.className = "photo";
    photo.dataset.label = `Add photo ${i + 1}`;
    const img = document.createElement("img");
    img.alt = p.caption || `Favorite ${i + 1}`;
    setPhoto(img, p.img);
    photo.appendChild(img);
    fig.append(photo);
    if (p.caption) {
      const cap = document.createElement("figcaption");
      cap.textContent = p.caption;
      fig.append(cap);
    }
    grid.appendChild(fig);
    watchPhoto(img);
  });
}

// The title shows first, then the pictures appear one after another
function showFavorites() {
  giftSeen.fav = true;
  clearTimeout(favTimer);
  $("#favGrid").hidden = true;
  $("#favActions").hidden = true;
  showScreen("screen-favorites");
  favTimer = setTimeout(() => {
    $("#favGrid").hidden = false;
    $("#favActions").hidden = false;
  }, reduceMotion ? 0 : 2200);
}
function leaveFavorites() {
  clearTimeout(favTimer);
  $("#favGrid").hidden = true;
  $("#favActions").hidden = true;
  showScreen("screen-gift");
  maybeShowEnding();
}

/* ---------- Home question ---------- */
function resetQuestion() {
  $("#qOptions").hidden = false;
  $("#qReply").hidden = true;
}
function answerQuestion(yes) {
  startLoveSong();      // love song starts and keeps looping
  $("#qReplyText").textContent = yes ? CONFIG.homeQuestion.replyYes : CONFIG.homeQuestion.replyNo;
  $("#qOptions").hidden = true;
  $("#qReply").hidden = false;
}

function resetAll() {
  clearTimeout(favTimer);
  $("#favGrid").hidden = true;
  $("#favActions").hidden = true;
  resetQuestion();
  endIntro();
  clearTimeout(autoTimer);
  $("#bubblesNext").hidden = true;
  $("#voiceBtn").hidden = true;
  stopVoice();
  pauseVideo();
  resetGiftIcons();
  closeCamera();
  clearSelfie();
  giftSeen = { letter: false, fav: false, mem: false };
  endingShown = false;
  hidePS();
  lockReplay(true);
  closeReminder();
  bgm.pause();
  bgm.currentTime = 0;
  loveOn = false;
  loveSong.pause();
  loveSong.currentTime = 0;
  galIndex = 0;
  homeBgOn = false;                    // background pictures hidden again until the envelope is tapped
  $("#homeTitle").hidden = true;       // title only shows on the 5-picture slide
  $("#gallery").hidden = true;
  hideCollage();
  $("#envWrap").hidden = false;
  $("#envWrap").classList.remove("leaving");
  env2.reset();
  showScreen("screen-qr");
}

/* ---------- Wire everything up ---------- */
let env2;

document.addEventListener("DOMContentLoaded", () => {
  injectResponsiveStyles();
  injectRibbonStyles();
  upgradeHomeEnvelope();
  injectEndingStyles();
  buildPS();
  lockReplay(true);                      // "Replay from the start" is locked until the P.S. box is pressed
  ensureVoiceUI();
  injectFavStyles();
  injectVideoStyles();
  injectBigPhotoStyles();
  injectGiftStyles();
  upgradeGiftHub();
  injectCameraStyles();
  buildCameraUI();
  upgradeFavMemory();
  buildHearts();
  buildQR();
  buildDots();
  buildCollage();
  buildFavorites();
  buildFavMemory();
  buildScrabble();
  buildFromTo();
  buildArtAndArtist();
  watchPhoto($("#galImg"));

  // 1 -> 2 : tap the QR code -> reminders appear
  $("#qrBtn").addEventListener("click", () => {
    hideAllScreens();             // nothing visible behind the reminder
    openReminder();               // reminders first; the bubbles + song start after the last one
  });

  // reminders: each button shows the next one, the last one continues the flow
  $("#reminderOk").addEventListener("click", () => {
    if (reminderStep < reminderList.length - 1) {   // next reminder in the list
      reminderStep++;
      renderReminder();
      $("#reminderOk").focus();
      return;
    }
    closeReminder();
    if (reminderMode === "end") { showPS(); return; }                     // ending done -> the P.S. envelope shows at the bottom
    if (reminderMode === "ps") { psBusy = false; return; }
    if (reminderMode === "volume") return;                                // just close it
    if (reminderMode === "cry") {                   // envelope reminders done -> the pictures open
      $("#envWrap").hidden = true;
      $("#homeTitle").hidden = true;                // pictures only: no "THIS IS MY HOME" title
      $("#gallery").hidden = false;
      galIndex = 0;
      renderGallery();
      return;
    }
    showScreen("screen-bubbles");                   // last intro reminder done -> bubbles + song
    startIntro();
  });
  $("#bubblesNext").addEventListener("click", goToQuestion);

  // voice clip: tap to play, tap again to stop
  $("#voiceBtn").addEventListener("click", () => {
    if (!voice.paused) { stopVoice(); return; }
    voice.currentTime = 0;
    voice.play()
      .then(() => setVoiceLabel(true))
      .catch(() => toast("The voice clip couldn't be played. Check the file name."));
  });
  voice.addEventListener("ended", () => setVoiceLabel(false));

  // question -> home (the slide starts with a clean background: no floating pictures yet)
  $("#qYes").addEventListener("click", () => answerQuestion(true));
  $("#qNo").addEventListener("click", () => answerQuestion(false));
  $("#qNext").addEventListener("click", () => { homeBgOn = false; $("#homeTitle").hidden = true; showScreen("screen-home"); });

  // ribbon first (scroll / scratch) -> background pictures appear -> reminders -> the pictures
  env2 = setupRibbonEnvelope($("#envelope2"), () => {
    homeBgOn = true;                     // the floating pictures show up now that the envelope is tapped
    startHomeBubbles();
    openReminder(CRY_REMINDERS, "cry");  // 3 reminders in a row, then the pictures
  });

  $("#galNext").addEventListener("click", () => {
    if (galIndex === CONFIG.memories.length - 1) { showCollage(); return; }
    galIndex++;
    renderGallery();
  });
  $("#galPrev").addEventListener("click", () => {
    if (galIndex > 0) { galIndex--; renderGallery(); }
  });

  // all 5 pictures together -> goodnight video (or back to the 5th picture)
  $("#collageNext").addEventListener("click", boomThenNext);
  $("#collageBack").addEventListener("click", () => {
    hideCollage();
    $("#homeTitle").hidden = true;       // back to the single pictures: title hidden again
    $("#gallery").hidden = false;
    galIndex = CONFIG.memories.length - 1;
    renderGallery();
    startHomeBubbles();                  // bring the background pictures back
  });

  // goodnight video -> scrabble
  $("#videoNext").addEventListener("click", () => { pauseVideo(); showScreen("screen-scrabble"); });
  $("#goodnightVideo").addEventListener("error", () => toast("Add your video as picture/goodnight.mp4"));

  // scrabble -> from/to -> art -> gift hub
  $("#scrabbleNext").addEventListener("click", () => showScreen("screen-fromto"));
  $("#fromtoNext").addEventListener("click", () => showScreen("screen-artist"));
  $("#artistNext").addEventListener("click", () => showScreen("screen-gift"));

  // gift hub
  $("#giftLetter").addEventListener("click", openLetterAnimated);
  $("#giftFavorites").addEventListener("click", popHeartThenFavorites);
  $("#favBack").addEventListener("click", leaveFavorites);
  $("#giftMemories").addEventListener("click", openCamera);

  // camera pop-up
  $("#camSnap").addEventListener("click", takePhoto);
  $("#camRetry").addEventListener("click", startCamera);
  $("#camFallback").addEventListener("click", () => $("#camFile").click());
  $("#camFile").addEventListener("change", e => {
    const f = e.target.files && e.target.files[0];
    e.target.value = "";
    if (!f) return;
    const url = URL.createObjectURL(f);
    const img = new Image();
    img.onload = () => {
      const data = frameToData(img, img.naturalWidth, img.naturalHeight, false);
      URL.revokeObjectURL(url);
      finishSelfie(data);
    };
    img.onerror = () => { URL.revokeObjectURL(url); toast("Couldn't read that photo, please try again."); };
    img.src = url;
  });
  $("#fmBack").addEventListener("click", () => { showScreen("screen-gift"); maybeShowEnding(); });
  $("#replay").addEventListener("click", resetAll);
  $("#closeLetter").addEventListener("click", closeLetter);
  $("#letterModal").addEventListener("click", e => { if (e.target.id === "letterModal") closeLetter(); });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && !$("#letterModal").hidden) closeLetter();
  });

  // Someone scanned the QR code -> go straight to the reminders + bubbles
  if (new URLSearchParams(location.search).get("scan") === "1") {
    hideAllScreens();
    openReminder();
  }
});