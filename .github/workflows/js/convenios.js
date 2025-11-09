
// convenios.js - CRUD convênios
let convenios = JSON.parse(localStorage.getItem('convenios') || '[]');
const formConv = document.getElementById('formConvenio');
const listaConv = document.getElementById('listaConvenios');

function carregarConvenios(){
  convenios = JSON.parse(localStorage.getItem('convenios') || '[]');
  if(!listaConv) return;
  listaConv.innerHTML = '';
  convenios.forEach((c,i)=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${c.nome}</td><td>${c.codigo||''}</td><td><button onclick="removerConvenio(${i})">🗑️</button></td>`;
    listaConv.appendChild(tr);
  });
}

if(formConv){
  formConv.addEventListener('submit', e=>{
    e.preventDefault();
    const nome = document.getElementById('nomeConv').value.trim();
    const codigo = document.getElementById('codigoConv').value.trim();
    if(!nome) return alert('Nome do convênio é obrigatório');
    convenios.push({id:Date.now(), nome, codigo});
    localStorage.setItem('convenios', JSON.stringify(convenios));
    formConv.reset();
    carregarConvenios();
    alert('Convênio salvo.');
  });
}

function removerConvenio(i){
  if(!confirm('Remover convênio?')) return;
  convenios.splice(i,1);
  localStorage.setItem('convenios', JSON.stringify(convenios));
  carregarConvenios();
}

window.carregarConvenios = carregarConvenios;
