import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getAuth, signInWithPopup, GithubAuthProvider } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";

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

const provider = new GithubAuthProvider();

document.getElementById("loginBtn").onclick = async function() {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        console.log("登入成功:", user);

        // 登入成功後跳轉到願望清單頁面
        window.location.href = "wishlist.html";
    } catch (error) {
        console.error("登入失敗:", error);
    }
};
