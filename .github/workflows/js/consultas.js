
// consultas.js - agenda
let consultas = JSON.parse(localStorage.getItem('consultas') || '[]');
const formC = document.getElementById('formConsulta');
const listaC = document.getElementById('listaConsultas');

function carregarPacientesOptions(){
  const sel = document.getElementById('pacienteSelect');
  if(!sel) return;
  sel.innerHTML = '<option value="">-- selecionar paciente --</option>';
  const list = JSON.parse(localStorage.getItem('pacientes') || '[]');
  list.forEach(p=>{ const o = document.createElement('option'); o.value = p.nome; o.textContent = p.nome; sel.appendChild(o); });
  const selP = document.getElementById('pacientePag');
  if(selP){ selP.innerHTML = '<option value="">-- selecionar paciente --</option>'; list.forEach(p=>{ const o = document.createElement('option'); o.value = p.nome; o.textContent = p.nome; selP.appendChild(o); }); }
}

function carregarDentistasOptions(){
  const sel = document.getElementById('dentistaSelect');
  if(!sel) return;
  sel.innerHTML = '<option value="">-- selecionar dentista --</option>';
  const list = JSON.parse(localStorage.getItem('dentistas') || '[]');
  list.forEach(d=>{ const o = document.createElement('option'); o.value = d.nome; o.textContent = d.nome; sel.appendChild(o); });
}

if(formC){
  formC.addEventListener('submit', e=>{
    e.preventDefault();
    const paciente = document.getElementById('pacienteSelect').value;
    const dentista = document.getElementById('dentistaSelect').value;
    const data = document.getElementById('data').value;
    const hora = document.getElementById('hora').value;
    const status = document.getElementById('statusSelect').value || 'Agendada';
    if(!paciente || !dentista || !data || !hora) return alert('Preencha todos os campos');
    consultas.push({id:Date.now(), paciente, dentista, dataHora: data + ' ' + hora, status});
    localStorage.setItem('consultas', JSON.stringify(consultas));
    formC.reset();
    listarConsultas();
    alert('Consulta agendada.');
  });
}

function listarConsultas(){
  consultas = JSON.parse(localStorage.getItem('consultas') || '[]');
  if(!listaC) return;
  const filtro = (document.getElementById('filtroConsulta')||{}).value || '';
  listaC.innerHTML = '';
  consultas.forEach((c,i)=>{
    if(filtro && !(c.paciente.toLowerCase().includes(filtro.toLowerCase()) || c.dentista.toLowerCase().includes(filtro.toLowerCase()))) return;
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${c.paciente}</td><td>${c.dentista}</td><td>${c.dataHora}</td><td>${c.status}</td>
      <td><button onclick="alterarStatus(${i},'Realizada')">✅</button> <button onclick="alterarStatus(${i},'Cancelada')">❌</button> <button onclick="registrarAtendimento(${i})">📌</button></td>`;
    listaC.appendChild(tr);
  });
}

function alterarStatus(i, novo){
  consultas[i].status = novo;
  localStorage.setItem('consultas', JSON.stringify(consultas));
  listarConsultas();
}

function registrarAtendimento(i){
  if(!confirm('Registrar atendimento e adicionar ao prontuário?')) return;
  const c = consultas[i];
  const pacientes = JSON.parse(localStorage.getItem('pacientes') || '[]');
  const idx = pacientes.findIndex(p=>p.nome === c.paciente);
  if(idx===-1) return alert('Paciente não encontrado');
  pacientes[idx].historico = pacientes[idx].historico || [];
  pacientes[idx].historico.push({data: c.dataHora.split(' ')[0], procedimento: 'Consulta', dentista: c.dentista});
  localStorage.setItem('pacientes', JSON.stringify(pacientes));
  alterarStatus(i,'Realizada');
  alert('Atendimento registrado no prontuário.');
}

window.listarConsultas = listarConsultas;
window.carregarPacientesOptions = carregarPacientesOptions;
window.carregarDentistasOptions = carregarDentistasOptions;
