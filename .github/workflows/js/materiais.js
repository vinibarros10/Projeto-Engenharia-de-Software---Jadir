
// materiais.js - controle de estoque
let materiais = JSON.parse(localStorage.getItem('materiais') || '[]');
const formM = document.getElementById('formMaterial');
const listaM = document.getElementById('listaMateriais');

function carregarMateriais(){
  materiais = JSON.parse(localStorage.getItem('materiais') || '[]');
  if(!listaM) return;
  listaM.innerHTML = '';
  materiais.forEach((m,i)=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${m.nome}</td><td>${m.qtd}</td><td>${m.validade||''}</td><td><button onclick="removerMaterial(${i})">🗑️</button></td>`;
    listaM.appendChild(tr);
  });
  verificarValidades();
}

if(formM){
  formM.addEventListener('submit', e=>{
    e.preventDefault();
    const nome = document.getElementById('nomeMat').value.trim();
    const qtd = parseInt(document.getElementById('qtdMat').value || 0);
    const validade = document.getElementById('validadeMat').value;
    if(!nome || !qtd) return alert('Preencha nome e quantidade');
    materiais.push({id:Date.now(), nome, qtd, validade});
    localStorage.setItem('materiais', JSON.stringify(materiais));
    formM.reset();
    carregarMateriais();
    alert('Material adicionado.');
  });
}

function removerMaterial(i){
  if(!confirm('Remover material?')) return;
  materiais.splice(i,1);
  localStorage.setItem('materiais', JSON.stringify(materiais));
  carregarMateriais();
}

function verificarValidades(){
  const hoje = new Date();
  materiais.forEach(m=>{
    if(!m.validade) return;
    const v = new Date(m.validade);
    const diff = Math.ceil((v - hoje)/(1000*60*60*24));
    if(diff <= 10) alert('⚠️ Material "'+m.nome+'" vence em ' + diff + ' dias.');
  });
}

window.carregarMateriais = carregarMateriais;

const tipo = document.getElementById('tipoMat').value;
const lote = document.getElementById('loteMat').value;
const fornecedor = document.getElementById('fornecedorMat').value;
materiais.push({ id: Date.now(), nome, tipo, qtd, lote, validade, fornecedor });
