import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBj5o-9PdSbKzP5rWPGHrjw_56BytEYe_k",
    authDomain: "wish-list-fb18e.firebaseapp.com",
    projectId: "wish-list-fb18e",
    storageBucket: "wish-list-fb18e.appspot.com",
    messagingSenderId: "1059824010359",
    appId: "1:1059824010359:web:f3f21c6f0511a42d067272"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

const wishListContainer = document.getElementById('wishList');
const wishActions = document.getElementById('wishActions');
const newWishInput = document.getElementById('newWishInput');
const addWishBtn = document.getElementById('addWishBtn');
const logoutBtn = document.getElementById('logoutBtn');

let user;

// 允许的邮箱列表
const allowedEmails = ["oinktech2024@gmail.com", "piggaga.company@gmail.com"];

// 檢查用戶登入狀態
onAuthStateChanged(auth, async (currentUser) => {
    if (currentUser) {
        user = currentUser;
        console.log("用戶登入:", user);

        // 僅限特定用戶操作
        if (allowedEmails.includes(user.email)) {
            wishActions.style.display = 'block';
            await loadWishes();
        } else {
            wishActions.style.display = 'none';
            await loadWishes();
        }
    } else {
        console.log("用戶未登入");
        window.location.href = "index.html";
    }
});

// 加載願望清單
async function loadWishes() {
    const querySnapshot = await getDocs(collection(firestore, 'wishes'));

    wishListContainer.innerHTML = ''; // 清空現有的願望項目

    if (querySnapshot.empty) {
        const noWishes = document.createElement('li');
        noWishes.textContent = '無願望';
        noWishes.className = 'no-wishes';
        wishListContainer.appendChild(noWishes);
    } else {
        querySnapshot.forEach((doc) => {
            const wishData = doc.data();
            const li = document.createElement('li');
            li.textContent = wishData.text;
            if (allowedEmails.includes(user.email)) {
                const editBtn = document.createElement('button');
                editBtn.textContent = '編輯';
                editBtn.addEventListener('click', () => editWish(doc.id));
                li.appendChild(editBtn);

                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = '刪除';
                deleteBtn.addEventListener('click', () => deleteWish(doc.id));
                li.appendChild(deleteBtn);
            }
            wishListContainer.appendChild(li);
        });
    }
}

// 添加新願望
addWishBtn.addEventListener('click', async () => {
    const wishText = newWishInput.value.trim();
    if (wishText) {
        await addDoc(collection(firestore, 'wishes'), { text: wishText, completed: false });
        newWishInput.value = '';
        await loadWishes();
    }
});

// 編輯願望
async function editWish(id) {
    const newText = prompt("請輸入新的願望內容：");
    if (newText) {
        await updateDoc(doc(firestore, 'wishes', id), { text: newText });
        await loadWishes();
    }
}

// 刪除願望
async function deleteWish(id) {
    await deleteDoc(doc(firestore, 'wishes', id));
    await loadWishes();
}

// 登出功能
logoutBtn.addEventListener('click', async () => {
    await signOut(auth);
    window.location.href = "index.html";
});

// 自動登出用戶
let logoutTimer;
const startLogoutTimer = () => {
    clearTimeout(logoutTimer);
    logoutTimer = setTimeout(async () => {
        await signOut(auth);
        window.location.href = "index.html";
    }, 5 * 60 * 1000); // 5分鐘
};
document.addEventListener('mousemove', startLogoutTimer);
document.addEventListener('keydown', startLogoutTimer);
