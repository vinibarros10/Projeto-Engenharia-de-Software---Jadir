
// main.js - dashboard helpers
function carregarResumo(){
  const pacientes = JSON.parse(localStorage.getItem('pacientes')||'[]');
  const consultas = JSON.parse(localStorage.getItem('consultas')||'[]');
  const pagamentos = JSON.parse(localStorage.getItem('pagamentos')||'[]');

  document.getElementById('totalPacientes').textContent = pacientes.length;
  document.getElementById('totalConsultas').textContent = consultas.length;
  const total = pagamentos.reduce((s,p)=> s + parseFloat(p.valor||0), 0);
  document.getElementById('totalReceita').textContent = 'R$ ' + total.toFixed(2).replace('.',',');

  const tbody = document.querySelector('#proxConsultas tbody');
  tbody.innerHTML = '';
  const now = new Date();
  const in7 = new Date(); in7.setDate(now.getDate()+7);
  consultas.sort((a,b)=> new Date(a.dataHora) - new Date(b.dataHora));
  consultas.forEach(c=>{
    const d = new Date(c.dataHora);
    if(d>=now && d<=in7){
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${c.paciente}</td><td>${c.dentista}</td><td>${c.dataHora}</td><td>${c.status}</td>`;
      tbody.appendChild(tr);
    }
  });
}
