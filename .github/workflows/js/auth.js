// js/auth.js
function login(event) {
  event.preventDefault();

  const usuario = document.getElementById("usuario").value.trim();
  const senha = document.getElementById("senha").value.trim();

  // Login padrão offline
  if (usuario === "admin" && senha === "123") {
    localStorage.setItem("usuarioLogado", usuario);
    window.location.href = "dashboard.html";
  } else {
    alert("Usuário ou senha incorretos!");
  }
}

function verificarLogin() {
  const usuarioLogado = localStorage.getItem("usuarioLogado");
  if (!usuarioLogado && !window.location.href.includes("index.html")) {
    window.location.href = "index.html";
  }
}

function logout() {
  localStorage.removeItem("usuarioLogado");
  window.location.href = "index.html";
}

// Vincula o evento de login ao formulário
document.getElementById("loginForm")?.addEventListener("submit", login);
