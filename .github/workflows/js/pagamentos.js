
// pagamentos.js
let pagamentos = JSON.parse(localStorage.getItem('pagamentos') || '[]');
const formP = document.getElementById('formPagamento');
const listaP = document.getElementById('listaPagamentos');
const selPac = document.getElementById('pacientePag');

function carregarPacientesOptionsForPayment(){
  const sel = document.getElementById('pacientePag');
  if(!sel) return;
  sel.innerHTML = '<option value="">-- selecionar paciente --</option>';
  const list = JSON.parse(localStorage.getItem('pacientes') || '[]');
  list.forEach(p=>{ const o = document.createElement('option'); o.value = p.nome; o.textContent = p.nome; sel.appendChild(o); });
}

if(formP){
  formP.addEventListener('submit', e=>{
    e.preventDefault();
    const paciente = document.getElementById('pacientePag').value;
    const valor = parseFloat(document.getElementById('valor').value || 0).toFixed(2);
    const forma = document.getElementById('forma').value;
    if(!paciente || !valor) return alert('Preencha os campos');
    pagamentos.push({id:Date.now(), paciente, valor, forma, data: new Date().toLocaleDateString('pt-BR')});
    localStorage.setItem('pagamentos', JSON.stringify(pagamentos));
    formP.reset();
    listarPagamentos();
    alert('Pagamento registrado.');
  });
}

function listarPagamentos(){
  pagamentos = JSON.parse(localStorage.getItem('pagamentos') || '[]');
  if(!listaP) return;
  listaP.innerHTML = '';
  pagamentos.forEach(p=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${p.paciente}</td><td>R$ ${parseFloat(p.valor).toFixed(2).replace('.',',')}</td><td>${p.forma}</td><td>${p.data}</td>`;
    listaP.appendChild(tr);
  });
}

window.listarPagamentos = listarPagamentos;
window.carregarPacientesOptionsForPagamento = carregarPacientesOptionsForPayment;

// ---- Gráfico Financeiro ----
function gerarGraficoFinanceiro() {
  const pagamentos = JSON.parse(localStorage.getItem('pagamentos') || '[]');
  if (!pagamentos.length) return;

  const selectAno = document.getElementById('filtroAno');
  const anos = [...new Set(pagamentos.map(p => p.data.split('/')[2]))];
  selectAno.innerHTML = '<option value="">Todos os anos</option>';
  anos.forEach(a => {
    const opt = document.createElement('option');
    opt.value = a;
    opt.textContent = a;
    selectAno.appendChild(opt);
  });

  const anoSelecionado = selectAno.value || null;

  const meses = [
    "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
    "Jul", "Ago", "Set", "Out", "Nov", "Dez"
  ];
  const valoresPorMes = new Array(12).fill(0);

  pagamentos.forEach(p => {
    const [dia, mes, ano] = p.data.split('/');
    if (anoSelecionado && ano !== anoSelecionado) return;
    const idx = parseInt(mes) - 1;
    valoresPorMes[idx] += parseFloat(p.valor || 0);
  });

  const ctx = document.getElementById('graficoFinanceiro').getContext('2d');
  if (window.graficoFinanceiroInstancia) {
    window.graficoFinanceiroInstancia.destroy();
  }

  window.graficoFinanceiroInstancia = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: meses,
      datasets: [{
        label: anoSelecionado ? `Receita de ${anoSelecionado}` : 'Receita Total',
        data: valoresPorMes,
        borderWidth: 1,
        backgroundColor: '#2f80ed90',
        borderColor: '#2f80ed'
      }]
    },
    options: {
      scales: {
        y: { beginAtZero: true, title: { display: true, text: 'Valor (R$)' } }
      },
      plugins: { legend: { display: true } }
    }
  });
}

// Atualiza o gráfico ao carregar a página
window.addEventListener('load', gerarGraficoFinanceiro);
