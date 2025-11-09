
// config.js - user profile
function carregarPerfil(){
  const perfil = JSON.parse(localStorage.getItem('perfil')||'{}');
  document.getElementById('perfilNome').value = perfil.nome || '';
  document.getElementById('perfilEmail').value = perfil.email || '';
}

function salvarPerfil(){
  const nome = document.getElementById('perfilNome').value;
  const email = document.getElementById('perfilEmail').value;
  localStorage.setItem('perfil', JSON.stringify({nome,email}));
  alert('Perfil salvo.');
}
