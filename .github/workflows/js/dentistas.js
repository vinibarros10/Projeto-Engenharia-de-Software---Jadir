
// dentistas.js - CRUD dentistas
let dentistas = JSON.parse(localStorage.getItem('dentistas') || '[]');
const formD = document.getElementById('formDentista');
const listaD = document.getElementById('listaDentistas');

function carregarDentistas(){
  if(!verificarLogin()) return;
  dentistas = JSON.parse(localStorage.getItem('dentistas') || '[]');
  if(!listaD) return;
  listaD.innerHTML = '';
  dentistas.forEach((d,i)=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${d.nome}</td><td>${d.cro||''}</td><td>${d.especialidade||''}</td><td>${d.ativo==1?'Ativo':'Inativo'}</td>
      <td><button onclick="editarDentista(${i})">✏️</button> <button onclick="removerDentista(${i})">🗑️</button></td>`;
    listaD.appendChild(tr);
  });
}

if(formD){
  formD.addEventListener('submit', e=>{
    e.preventDefault();
    const nome = document.getElementById('nomeDent').value.trim();
    const cro = document.getElementById('cro').value.trim();
    const esp = document.getElementById('especialidade').value.trim();
    const ativo = document.getElementById('ativo').value;
    if(!nome) return alert('Nome é obrigatório');
    dentistas.push({id:Date.now(), nome, cro, especialidade:esp, ativo});
    localStorage.setItem('dentistas', JSON.stringify(dentistas));
    formD.reset();
    carregarDentistas();
    alert('Dentista salvo.');
  });
}

function removerDentista(i){
  if(!confirm('Remover dentista?')) return;
  dentistas.splice(i,1);
  localStorage.setItem('dentistas', JSON.stringify(dentistas));
  carregarDentistas();
}

function editarDentista(i){
  const d = dentistas[i];
  const nome = prompt('Nome', d.nome);
  if(nome){ d.nome = nome; localStorage.setItem('dentistas', JSON.stringify(dentistas)); carregarDentistas(); }
}

function carregarDentistasOptions(){
  const sel = document.getElementById('dentistaSelect');
  if(!sel) return;
  sel.innerHTML = '<option value="">-- selecionar dentista --</option>';
  const list = JSON.parse(localStorage.getItem('dentistas') || '[]');
  list.forEach(d => { const o = document.createElement('option'); o.value = d.nome; o.textContent = d.nome; sel.appendChild(o); });
}

window.carregarDentistas = carregarDentistas;
window.carregarDentistasOptions = carregarDentistasOptions;
