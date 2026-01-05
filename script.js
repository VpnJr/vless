import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 🔴 ВСТАВЬ СВОИ ДАННЫЕ
const firebaseConfig = {
  apiKey: "AIzaSyDyHRXgmRKT2Pm4P4T5PaGERY1aq6l5yr4",
  authDomain: "vless-panel.firebaseapp.com",
  projectId: "vless-panel",
  storageBucket: "vless-panel.firebasestorage.app",
  messagingSenderId: "49665298978",
  appId: "1:49665298978:web:4f5d9de2f269a19a10307b"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const vpnList = document.getElementById("vpn-list");

async function loadKeys() {
  vpnList.innerHTML = "";

  const querySnapshot = await getDocs(collection(db, "vpn_keys"));

  if (querySnapshot.empty) {
    vpnList.innerHTML = "Нет доступных ключей";
    return;
  }

  querySnapshot.forEach((doc) => {
    const data = doc.data();

    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <h3>${data.name}</h3>
      <div class="key">${data.key}</div>
      <div class="date">Добавлено: ${data.createdAt}</div>
    `;

    vpnList.appendChild(card);
  });
}

loadKeys();
