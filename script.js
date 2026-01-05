import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs, query, orderBy } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 🔴 ВСТАВЬ СВОИ ДАННЫЕ FIREBASE
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

    card.appendChild(btn);
    vpnList.appendChild(card);
  });
}

loadKeys();
