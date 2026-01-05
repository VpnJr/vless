import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// 🔴 Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDyHRXgmRKT2Pm4P4T5PaGERY1aq6l5yr4",
  authDomain: "vless-panel.firebaseapp.com",
  projectId: "vless-panel",
  storageBucket: "vless-panel.firebasestorage.app",
  messagingSenderId: "49665298978",
  appId: "1:49665298978:web:4f5d9de2f269a19a10307b"
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Anonymous auth
const auth = getAuth();
signInAnonymously(auth).catch(console.error);

// ================= VPN KEYS =================

const vpnList = document.getElementById("vpn-list");

async function loadKeys() {
  vpnList.innerHTML = "";

  const q = query(collection(db, "vpn_keys"), orderBy("createdAt", "asc"));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    vpnList.textContent = "Ключей пока нет";
    return;
  }

  snapshot.forEach(doc => {
    const data = doc.data();

    const card = document.createElement("div");
    card.className = "card";

    const btn = document.createElement("button");
    btn.className = "copy-btn";
    btn.textContent = "📋";

    btn.onclick = async () => {
      await navigator.clipboard.writeText(data.key);
      btn.textContent = "✓";
      setTimeout(() => btn.textContent = "📋", 1200);
    };

    const info = document.createElement("div");
    info.className = "card-info";
    info.innerHTML = `
      <h3>${data.name}</h3>
      <div class="date">Добавлено: ${data.createdAt}</div>
    `;

    card.appendChild(btn);
    card.appendChild(info);
    vpnList.appendChild(card);
  });
}

// ================= APPS =================

const appsList = document.getElementById("apps-list");

async function loadApps() {
  appsList.innerHTML = "";

  const q = query(collection(db, "apps"), orderBy("order", "asc"));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    appsList.textContent = "Приложения не найдены";
    return;
  }

  snapshot.forEach(doc => {
    const app = doc.data();

    const card = document.createElement("div");
    card.className = "app-card";

    const icon = document.createElement("div");
    icon.className = "app-icon";
    icon.innerHTML = app.icon
      ? `<img src="${app.icon}" alt="${app.name}">`
      : "📦";

    const info = document.createElement("div");
    info.className = "app-info";
    info.innerHTML = `
      <div class="app-name">${app.name}</div>
      <div class="app-platform">${app.platform}</div>
    `;

    const btn = document.createElement("button");
    btn.className = "download-btn";
    btn.textContent = "Скачать";
    btn.onclick = () => window.open(app.url, "_blank");

    card.appendChild(icon);
    card.appendChild(info);
    card.appendChild(btn);

    appsList.appendChild(card);
  });
}

// Load all
loadKeys();
loadApps();
