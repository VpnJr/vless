import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js"; // Импортируйте getAuth и signInAnonymously

// 🔴 ВСТАВЬ СВОИ ДАННЫЕ FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyDyHRXgmRKT2Pm4P4T5PaGERY1aq6l5yr4",
  authDomain: "vless-panel.firebaseapp.com",
  projectId: "vless-panel",
  storageBucket: "vless-panel.firebasestorage.app",
  messagingSenderId: "49665298978",
  appId: "1:49665298978:web:4f5d9de2f269a19a10307b"
};

// Инициализация Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Инициализация анонимного входа
const auth = getAuth();
signInAnonymously(auth)
  .then(() => {
    console.log("Пользователь анонимно вошел в систему");
  })
  .catch((error) => {
    console.error("Ошибка входа:", error);
  });

const vpnList = document.getElementById("vpn-list");

// Функция для загрузки VPN ключей
async function loadKeys() {
  vpnList.innerHTML = "";

  const q = query(
    collection(db, "vpn_keys"),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    vpnList.innerHTML = "Ключей пока нет";
    return;
  }

  snapshot.forEach((doc) => {
    const data = doc.data();

    const card = document.createElement("div");
    card.className = "card";

    const btn = document.createElement("button");
    btn.className = "copy-btn";
    btn.textContent = "Скопировать";

    btn.onclick = async () => {
      await navigator.clipboard.writeText(data.key);
      btn.textContent = "Скопировано ✓";
      btn.classList.add("copied");

      setTimeout(() => {
        btn.textContent = "Скопировать";
        btn.classList.remove("copied");
      }, 1500);
    };

    card.innerHTML = `
      <div class="card-info">
        <h3>${data.name}</h3>
        <div class="date">Добавлено: ${data.createdAt}</div>
      </div>
    `;

   snapshot.forEach((doc) => {
  const data = doc.data();

  const card = document.createElement("div");
  card.className = "card";

  const btn = document.createElement("button");
  btn.className = "copy-btn";
  btn.textContent = "📋";

  btn.onclick = async () => {
    await navigator.clipboard.writeText(data.key);
    btn.textContent = "✓";

    setTimeout(() => {
      btn.textContent = "📋";
    }, 1200);
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

const appsList = document.getElementById("apps-list");

// Функция для загрузки приложений
async function loadApps() {
  const q = query(
    collection(db, "apps"),
    orderBy("order", "asc")
  );

  const snapshot = await getDocs(q);
  appsList.innerHTML = "";

  if (snapshot.empty) {
    appsList.innerHTML = "Приложения не найдены";
    return;
  }

  snapshot.forEach(doc => {
    const app = doc.data();
    console.log(app); // Логируем каждое приложение

    const card = document.createElement("div");
    card.className = "app-card";

    // Создаем кнопку "Скачать"
    const downloadBtn = document.createElement("button");
    downloadBtn.className = "download-btn";
    downloadBtn.textContent = "Скачать";

    // Когда пользователь нажимает на кнопку, открывается ссылка приложения
    downloadBtn.onclick = () => {
      window.open(app.url, "_blank"); // Открываем URL в новой вкладке
    };

    // Добавляем иконку приложения
    const appIcon = document.createElement("div");
    appIcon.className = "app-icon";
    if (app.icon) {
      appIcon.innerHTML = `<img src="${app.icon}" alt="${app.name}">`;
    } else {
      appIcon.textContent = "📦";
    }

    // Добавляем информацию о приложении
    const appInfo = document.createElement("div");
    appInfo.className = "app-info";
    appInfo.innerHTML = `
      <div class="app-name">${app.name}</div>
      <div class="app-platform">${app.platform}</div>
    `;

    // Добавляем все элементы на карточку
    card.appendChild(appIcon);
    card.appendChild(appInfo);
    card.appendChild(downloadBtn);

    // Добавляем карточку приложения в список
    appsList.appendChild(card);
  });
}

// Загружаем ключи и приложения
loadKeys();
loadApps();
