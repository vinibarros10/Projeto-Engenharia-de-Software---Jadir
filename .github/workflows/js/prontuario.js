// prontuario.js - registros clínicos
let prontuarios = JSON.parse(localStorage.getItem('prontuarios') || '[]');
const formP = document.getElementById('formProntuario');
const listaP = document.getElementById('listaProntuario');

if (formP) {
  formP.addEventListener('submit', e => {
    e.preventDefault();
    const paciente = document.getElementById('pacientePront').value;
    const descricao = document.getElementById('descricaoPront').value.trim();
    const file = document.getElementById('anexoPront').files[0];
    const data = new Date().toLocaleDateString('pt-BR');
    if (!paciente || !descricao) return alert('Preencha todos os campos.');
    if (file) {
      const reader = new FileReader();
      reader.onload = ev => salvarRegistro(paciente, descricao, data, ev.target.result);
      reader.readAsDataURL(file);
    } else {
      salvarRegistro(paciente, descricao, data, null);
    }
  });
}

function salvarRegistro(paciente, descricao, data, anexo) {
  prontuarios.push({ id: Date.now(), paciente, descricao, data, anexo });
  localStorage.setItem('prontuarios', JSON.stringify(prontuarios));
  listarRegistros();
  alert('Registro salvo no prontuário.');
  formP.reset();
}

function listarRegistros() {
  prontuarios = JSON.parse(localStorage.getItem('prontuarios') || '[]');
  if (!listaP) return;
  listaP.innerHTML = '';
  prontuarios.forEach(p => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${p.paciente}</td>
      <td>${p.data}</td>
      <td>${p.descricao}</td>
      <td>${p.anexo ? `<a href="${p.anexo}" target="_blank">🖼️ Ver</a>` : '--'}</td>`;
    listaP.appendChild(tr);
  });
}
