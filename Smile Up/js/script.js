// =======================================================
// LÓGICA DE LOGIN/LOGOUT
// =======================================================
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const logoutBtn = document.getElementById("logoutBtn");

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const user = document.getElementById("usuario").value.trim();
      const pass = document.getElementById("senha").value.trim();
      const error = document.getElementById("loginError");

      // login fixo só pra simular
      if (user === "admin" && pass === "123") {
        localStorage.setItem("smileupUser", user);
        window.location.href = "dashboard.html";
      } else {
        error.style.display = "block";
      }
    });
  }

  // Exibir usuário logado no dashboard
  const userDisplay = document.getElementById("userDisplay");
  if (userDisplay) {
    const loggedUser = localStorage.getItem("smileupUser");
    if (!loggedUser) {
      window.location.href = "index.html"; // Protege a página
    } else {
      userDisplay.textContent = "Usuário: " + loggedUser;
    }
  }

  // Logout
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("smileupUser");
      window.location.href = "index.html";
    });
  }
});


// =======================================================
// LÓGICA DA PÁGINA DE PACIENTES (FILTRO CORRIGIDO)
// =======================================================
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("pacienteForm");
  const tabela = document.getElementById("tabelaPacientes");
  
  // Elementos dos Modais
  const editModalElement = document.getElementById('editPacienteModal');
  const atestadoModalElement = document.getElementById('atestadoModal');
  const prontuarioModalElement = document.getElementById('prontuarioModal');
  const filtroPacientesEl = document.getElementById('filtroPacientes'); // Apenas declara

  // VERIFICAÇÃO FINAL: Só executa se TODOS os elementos da página de pacientes existirem
  if (form && tabela && editModalElement && atestadoModalElement && prontuarioModalElement && filtroPacientesEl) {
    
    // =================================
    // APLICANDO MÁSCARAS
    // =================================
    const cpfMask = IMask(document.getElementById('cpf'), {
      mask: '000.000.000-00'
    });
    const telefoneMask = IMask(document.getElementById('telefone'), {
      mask: '(00) 0000[0]-0000'
    });
    const cepMask = IMask(document.getElementById('cep'), {
      mask: '00000-000'
    });
    const estadoMask = IMask(document.getElementById('estado'), {
      mask: 'aa',
      prepare: str => str.toUpperCase()
    });
    
    // MÁSCARAS DO MODAL DE EDIÇÃO
    const editCpfMask = IMask(document.getElementById('editCpf'), {
      mask: '000.000.000-00'
    });
    const editTelefoneMask = IMask(document.getElementById('editTelefone'), {
      mask: '(00) 0000[0]-0000'
    });
    const editCepMask = IMask(document.getElementById('editCep'), {
      mask: '00000-000'
    });
    const editEstadoMask = IMask(document.getElementById('editEstado'), {
      mask: 'aa',
      prepare: str => str.toUpperCase()
    });

    // =================================
    // VARIÁVEIS PRINCIPAIS
    // =================================
    let pacientes = JSON.parse(localStorage.getItem("pacientes")) || [];

    // =================================
    // ATUALIZAR A TABELA
    // =================================
    const atualizarTabela = () => {
      const tbody = tabela.querySelector("tbody");
      tbody.innerHTML = "";

      const termoBusca = filtroPacientesEl.value.toLowerCase().trim();

      const pacientesFiltrados = pacientes.filter(p => {
        const nome = p.nome.toLowerCase();
        const cpf = p.cpf; 

        return nome.includes(termoBusca) || cpf.includes(termoBusca);
      });

      pacientesFiltrados.forEach((p) => {
        const i_original = pacientes.findIndex(pacienteOriginal => pacienteOriginal.cpf === p.cpf);
      
        const dataNascFormatada = p.nascimento 
          ? new Date(p.nascimento).toLocaleDateString("pt-BR", { timeZone: 'UTC' }) 
          : "-";

        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${p.nome}</td>
          <td>${p.cpf}</td>
          <td>${p.telefone}</td>
          <td>${p.email}</td>
          <td>${dataNascFormatada}</td>
          <td>
          <button class="btn btn-primary btn-sm me-1 btn-editar" data-index="${i_original}">Editar</button>
          <button class="btn btn-danger btn-sm me-1 btn-excluir" data-index="${i_original}">Excluir</button>
          <button class="btn btn-success btn-sm me-1 btn-prontuario" data-index="${i_original}">Ver Prontuário</button>
          <button class="btn btn-warning btn-sm btn-atestado" data-index="${i_original}">Atestado</button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    };

    // =================================
    // LISTENER DO FORMULÁRIO (AGORA SÓ ADIÇÃO)
    // =================================
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const novoPaciente = {
        nome: form.nome.value.trim(),
        cpf: form.cpf.value.trim(),
        telefone: form.telefone.value.trim(),
        email: form.email.value.trim(),
        nascimento: form.nascimento.value,
        cep: form.cep.value.trim(),
        logradouro: form.logradouro.value.trim(),
        numero: form.numero.value.trim(),
        bairro: form.bairro.value.trim(),
        cidade: form.cidade.value.trim(),
        estado: form.estado.value.trim(),
        anamnese: form.anamnese.value.trim()
      };

      pacientes.push(novoPaciente); 
      localStorage.setItem("pacientes", JSON.stringify(pacientes));
      form.reset();
      atualizarTabela();
    });

    // =================================
    // LÓGICA DO MODAL DE EDIÇÃO
    // =================================
    const editForm = document.getElementById('editPacienteForm');

    function abrirModalEdicao(index) {
      const paciente = pacientes[index];
      if (!paciente) return;

      document.getElementById('editNome').value = paciente.nome;
      document.getElementById('editCpf').value = paciente.cpf;
      document.getElementById('editTelefone').value = paciente.telefone;
      document.getElementById('editEmail').value = paciente.email;
      document.getElementById('editNascimento').value = paciente.nascimento;
      document.getElementById('editCep').value = paciente.cep;
      document.getElementById('editLogradouro').value = paciente.logradouro;
      document.getElementById('editNumero').value = paciente.numero;
      document.getElementById('editBairro').value = paciente.bairro;
      document.getElementById('editCidade').value = paciente.cidade;
      document.getElementById('editEstado').value = paciente.estado;
      document.getElementById('editAnamnese').value = paciente.anamnese;
      document.getElementById('editIndex').value = index;
      
      const editPacienteModal = new bootstrap.Modal(editModalElement);
      editPacienteModal.show();
    }

    if (editForm) {
      editForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const index = document.getElementById('editIndex').value;

        const pacienteAtualizado = {
          nome: document.getElementById('editNome').value.trim(),
          cpf: document.getElementById('editCpf').value.trim(),
          telefone: document.getElementById('editTelefone').value.trim(),
          email: document.getElementById('editEmail').value.trim(),
          nascimento: document.getElementById('editNascimento').value,
          cep: document.getElementById('editCep').value.trim(),
          logradouro: document.getElementById('editLogradouro').value.trim(),
          numero: document.getElementById('editNumero').value.trim(),
          bairro: document.getElementById('editBairro').value.trim(),
          cidade: document.getElementById('editCidade').value.trim(),
          estado: document.getElementById('editEstado').value.trim(),
          anamnese: document.getElementById('editAnamnese').value.trim()
        };

        pacientes[index] = pacienteAtualizado;
        localStorage.setItem("pacientes", JSON.stringify(pacientes));
        atualizarTabela();
        
        const editPacienteModal = bootstrap.Modal.getInstance(editModalElement);
        if (editPacienteModal) {
          editPacienteModal.hide();
        }
      });
    }

    // =================================
    // LÓGICA DO MODAL DE ATESTADO
    // =================================
    const atestadoForm = document.getElementById('atestadoForm');

    function gerarImpressaoAtestado(pacienteNome, motivo, dias, horaInicio, horaFim) {
      const hoje = new Date();
      const dataLocal = hoje.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
      const cid = "N/A"; 
      
      let textoAtestado = "";
      const diasNum = parseInt(dias) || 0;

      if (diasNum > 0) {
        textoAtestado = `
          <p>Atesto para os devidos fins que o(a) Sr(a) <strong>${pacienteNome}</strong>, esteve sob meus cuidados profissionais na data de hoje, devendo afastar-se de suas atividades por <strong>${diasNum} dia(s)</strong> a partir desta data.</p>
          <p>Motivo: ${motivo}</p>
          <p>CID: ${cid}</p>
        `;
      } else if (horaInicio && horaFim) {
        textoAtestado = `
          <p>Atesto para os devidos fins que o(a) Sr(a) <strong>${pacienteNome}</strong>, esteve sob meus cuidados profissionais na data de hoje, no período das <strong>${horaInicio}</strong> às <strong>${horaFim}</strong>.</p>
          <p>Motivo: ${motivo}</p>
        `;
      } else {
        textoAtestado = `
          <p>Atesto para os devidos fins que o(a) Sr(a) <strong>${pacienteNome}</strong>, esteve sob meus cuidados profissionais na data de hoje.</p>
          <p>Motivo: ${motivo}</p>
        `;
      }

      const htmlConteudo = `
        <html><head><title>Atestado - ${pacienteNome}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 50px; }
          .container { width: 80%; margin: 0 auto; border: 1px solid #000; padding: 30px; }
          .header { text-align: center; }
          .header img { width: 150px; }
          h2 { text-align: center; margin-top: 30px; }
          .content { margin-top: 40px; font-size: 1.2em; line-height: 1.6; }
          .data { text-align: right; margin-top: 50px; }
          .assinatura { text-align: center; margin-top: 80px; }
          .assinatura p { margin: 0; }
        </style>
        </head><body>
          <div class="container">
            <div class="header">
              <img src="logo/smile.png" alt="Logo Smile Up">
              <p>Dr. Jadir / Dra. Beatriz / Dr. Luis Fernando</p>
              <p>Clínicos Gerais e Especialistas</p>
            </div>
            <h2>ATESTADO MÉDICO</h2>
            <div class="content">
              ${textoAtestado}
            </div>
            <div class="data">
              <p>São Paulo, ${dataLocal}.</p>
            </div>
            <div class="assinatura">
              <p>___________________________________</p>
              <p>Assinatura do Profissional</p>
            </div>
          </div>
        </body></html>
      `;

      const printWindow = window.open('', '', 'height=600,width=800');
      printWindow.document.write(htmlConteudo);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    }

    function abrirModalAtestado(index) {
      const paciente = pacientes[index];
      if (!paciente) return;

      document.getElementById('atestadoPacienteNome').value = paciente.nome;
      document.getElementById('atestadoData').value = new Date().toLocaleDateString('pt-BR');
      document.getElementById('atestadoMotivo').value = "Compareceu a esta consulta odontológica.";
      document.getElementById('atestadoDias').value = 0;
      document.getElementById('atestadoHoraInicio').value = ""; 
      document.getElementById('atestadoHoraFim').value = "";   

      const atestadoModal = new bootstrap.Modal(atestadoModalElement);
      atestadoModal.show();
    }

    if (atestadoForm) {
      atestadoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const pacienteNome = document.getElementById('atestadoPacienteNome').value;
        const motivo = document.getElementById('atestadoMotivo').value;
        const dias = document.getElementById('atestadoDias').value;
        const horaInicio = document.getElementById('atestadoHoraInicio').value; 
        const horaFim = document.getElementById('atestadoHoraFim').value;     

        gerarImpressaoAtestado(pacienteNome, motivo, dias, horaInicio, horaFim); 

        const modalInstance = bootstrap.Modal.getInstance(atestadoModalElement);
        if (modalInstance) {
          modalInstance.hide();
        }
      });
    }

    // (Substitua esta função na Lógica de Pacientes)

    function abrirModalProntuario(index) {
      const paciente = pacientes[index];
      if (!paciente) return;
      
      const pacienteNome = paciente.nome;
      
      document.getElementById('prontuarioPacienteNomeAtivo').value = pacienteNome;

      // 1. Carrega todos os dados do localStorage
      const agendamentos = JSON.parse(localStorage.getItem("agendamentos")) || [];
      const orcamentos = JSON.parse(localStorage.getItem("orcamentos")) || [];
      const financeiro = JSON.parse(localStorage.getItem("financeiro")) || [];
      const formatarMoeda = (valor) => (valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

      // 2. Preenche os dados pessoais e anamnese
      document.getElementById('pront-nome').textContent = paciente.nome;
      document.getElementById('pront-cpf').textContent = paciente.cpf;
      document.getElementById('pront-telefone').textContent = paciente.telefone;
      document.getElementById('pront-anamnese-texto').textContent = paciente.anamnese || 'Nenhuma anamnese cadastrada.';

      // 3. Filtra e constrói a tabela de Agendamentos
      const tbodyAgendamentos = document.getElementById('pront-tabela-agendamentos');
      tbodyAgendamentos.innerHTML = "";
      const agendamentosPaciente = agendamentos.filter(a => a.paciente === pacienteNome);
      if(agendamentosPaciente.length === 0) {
        tbodyAgendamentos.innerHTML = '<tr><td colspan="5" class="text-center">Nenhum agendamento encontrado.</td></tr>';
      } else {
        agendamentosPaciente
          .sort((a, b) => new Date(b.data) - new Date(a.data)) // Mais recentes primeiro
          .forEach(ag => {
            const data = ag.data ? new Date(ag.data).toLocaleDateString("pt-BR", { timeZone: 'UTC' }) : "-";
            tbodyAgendamentos.innerHTML += `
              <tr>
                <td>${data}</td>
                <td>${ag.hora || "-"}</td>
                <td>${ag.dentista || "-"}</td>
                <td>${ag.tipoConsulta || "-"}</td>
                <td>${ag.status || "-"}</td>
              </tr>
            `;
        });
      }

      // 4. Filtra e constrói a tabela de Orçamentos (ATUALIZADO)
      const tbodyOrcamentos = document.getElementById('pront-tabela-orcamentos');
      // Atualiza o cabeçalho
      tbodyOrcamentos.closest('table').querySelector('thead tr').innerHTML = 
        `<th>Data</th><th>Dentista</th><th>Valor</th><th>Status</th><th>Serviços</th>`;
        
      tbodyOrcamentos.innerHTML = "";
      const orcamentosPaciente = orcamentos.filter(o => o.paciente === pacienteNome);
       if(orcamentosPaciente.length === 0) {
        tbodyOrcamentos.innerHTML = '<tr><td colspan="5" class="text-center">Nenhum orçamento encontrado.</td></tr>';
      } else {
        orcamentosPaciente
          .sort((a, b) => new Date(b.data) - new Date(a.data))
          .forEach(orc => {
            const data = orc.data ? new Date(orc.data).toLocaleDateString("pt-BR", { timeZone: 'UTC' }) : "-";
            const servicosTexto = orc.itens && orc.itens.length > 0
              ? `${orc.itens[0].qtd}x ${orc.itens[0].nome}${orc.itens.length > 1 ? '...' : ''}`
              : "-";
              
            tbodyOrcamentos.innerHTML += `
              <tr>
                <td>${data}</td>
                <td>${orc.dentista || "-"}</td> <td>${formatarMoeda(orc.valorTotal)}</td>
                <td>${orc.status || "-"}</td>
                <td>${servicosTexto}</td>
              </tr>
            `;
        });
      }
      
      // 5. Filtra e constrói a tabela Financeira
      const tbodyFinanceiro = document.getElementById('pront-tabela-financeiro');
      tbodyFinanceiro.innerHTML = "";
      const financeiroPaciente = financeiro.filter(f => f.paciente === pacienteNome);
       if(financeiroPaciente.length === 0) {
        tbodyFinanceiro.innerHTML = '<tr><td colspan="4" class="text-center">Nenhum lançamento encontrado.</td></tr>';
      } else {
        financeiroPaciente
          .sort((a, b) => new Date(b.data) - new Date(a.data))
          .forEach(f => {
            const data = f.data ? new Date(f.data).toLocaleDateString("pt-BR", { timeZone: 'UTC' }) : "-";
            const tipoClasse = f.tipo === 'entrada' ? 'text-success' : 'text-danger';
            tbodyFinanceiro.innerHTML += `
              <tr>
                <td>${data}</td>
                <td>${f.descricao || "-"}</td>
                <td class="${tipoClasse} fw-bold">${f.tipo}</td>
                <td>${formatarMoeda(f.valor)}</td>
              </tr>
            `;
        });
      }

      // (Aba de Exames continua funcionando como antes)

      // 6. Abre o modal
      const prontuarioModal = new bootstrap.Modal(prontuarioModalElement);
      prontuarioModal.show();
    }

    // =================================
    // LISTENER DE CLIQUES NA TABELA (DELEGAÇÃO DE EVENTOS)
    // =================================
    tabela.addEventListener('click', function(e) {
      
      // Botão EDITAR
      if (e.target.classList.contains('btn-editar')) {
        const index = e.target.getAttribute('data-index');
        abrirModalEdicao(index);
      }
      
      // Botão EXCLUIR
      if (e.target.classList.contains('btn-excluir')) {
        const index = e.target.getAttribute('data-index');
        if (confirm("Deseja realmente excluir este paciente?")) {
          pacientes.splice(index, 1);
          localStorage.setItem("pacientes", JSON.stringify(pacientes));
          atualizarTabela();
        }
      }

      // Botão VER PRONTUÁRIO (NOVO)
      if (e.target.classList.contains('btn-prontuario')) {
        const index = e.target.getAttribute('data-index');
        abrirModalProntuario(index);
      }

      // Botão ATESTADO
      if (e.target.classList.contains('btn-atestado')) {
        const index = e.target.getAttribute('data-index');
        abrirModalAtestado(index);
      }
    });
    
    // =================================
    // INICIALIZAÇÃO (LOCAL CORRIGIDO)
    // =================================
    filtroPacientesEl.addEventListener('keyup', atualizarTabela); 
    atualizarTabela(); // Chama a tabela pela primeira vez

  } // <-- Fim do 'if (form && tabela && ...)'
}); // <-- Fim do 'DOMContentLoaded' para Pacientes


// =======================================================
// LÓGICA DA PÁGINA DE AGENDAMENTOS (COM FILTRO DE STATUS)
// =======================================================
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("agendamentoForm");
  const tabela = document.getElementById("tabelaAgendamentos");
  const selectPacientesForm = document.getElementById("pacienteSelect");
  const selectDentistaForm = document.getElementById("dentistaSelect");

  // Campos do formulário
  const dataForm = document.getElementById("data");
  const horaForm = document.getElementById("hora");

  // Filtros
  const filtroDataEl = document.getElementById("filtroData");
  const filtroDentistaEl = document.getElementById("filtroDentista");
  const filtroStatusEl = document.getElementById("filtroStatus"); // <-- NOVO
  
  // Elementos do Modal de Edição
  const editModalElement = document.getElementById('editAgendamentoModal');
  const editForm = document.getElementById('editAgendamentoForm');
  const editPacienteSelect = document.getElementById('editAgPacienteSelect');
  const editDentistaSelect = document.getElementById('editAgDentistaSelect');
  const editDataForm = document.getElementById('editAgData');
  const editHoraForm = document.getElementById('editAgHora');

  // Lista Mestre de Horários
  const TODOS_OS_HORARIOS = [
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"
  ];

  // Só executa se estiver na página de agendamentos
  if (form && tabela && selectPacientesForm && filtroDataEl && editModalElement && filtroStatusEl) {
    
    // =================================
    // INICIALIZAÇÃO E CARGA DE DADOS
    // =================================
    const pacientes = JSON.parse(localStorage.getItem("pacientes")) || [];
    const dentistas = JSON.parse(localStorage.getItem("dentistas")) || []; 
    let agendamentos = JSON.parse(localStorage.getItem("agendamentos")) || []; 

    // 1. Carregar Pacientes nos Dropdowns
    selectPacientesForm.appendChild(new Option("Selecione um paciente...", ""));
    pacientes.forEach(p => {
      const option = new Option(p.nome, p.nome);
      selectPacientesForm.appendChild(option.cloneNode(true));
      editPacienteSelect.appendChild(option.cloneNode(true));
    });

    // 2. Carregar Dentistas nos Dropdowns (Form, Modal e Filtro)
    filtroDentistaEl.appendChild(new Option("Todos os Dentistas", ""));
    selectDentistaForm.appendChild(new Option("Selecione um dentista...", ""));

    dentistas.forEach(d => {
      const option = new Option(d.nome, d.nome); 
      selectDentistaForm.appendChild(option.cloneNode(true));
      editDentistaSelect.appendChild(option.cloneNode(true));
      filtroDentistaEl.appendChild(option.cloneNode(true));
    });

    // =================================
    // ATUALIZAR HORÁRIOS DISPONÍVEIS
    // =================================
    const atualizarHorariosDisponiveis = (dataSelecionada, dentistaSelecionado, selectHoraElemento, horarioAtual = null) => {
      selectHoraElemento.innerHTML = ""; // Limpa opções antigas
      selectHoraElemento.appendChild(new Option("--:--", ""));
      selectHoraElemento.disabled = true;

      if (!dataSelecionada || !dentistaSelecionado) {
        return; // Precisa de data E dentista
      }

      // 1. Acha todos os horários ocupados para este dentista nesta data
      const horariosOcupados = agendamentos
        .filter(ag => ag.data === dataSelecionada && ag.dentista === dentistaSelecionado)
        .map(ag => ag.hora);

      // 2. Filtra a lista mestre
      const horariosDisponiveis = TODOS_OS_HORARIOS.filter(hora => {
        if (!horariosOcupados.includes(hora)) {
          return true;
        }
        if (hora === horarioAtual) {
          return true;
        }
        return false;
      });

      // 3. Preenche o select
      horariosDisponiveis.forEach(hora => {
        selectHoraElemento.appendChild(new Option(hora, hora));
      });
      selectHoraElemento.disabled = false;
    };

    // =================================
    // ATUALIZAR TABELA (COM FILTRO DE STATUS)
    // =================================
    const atualizarTabelaAgendamentos = () => {
      const tbody = tabela.querySelector("tbody");
      tbody.innerHTML = "";

      const dataFiltro = filtroDataEl.value;
      const dentistaFiltro = filtroDentistaEl.value;
      const statusFiltro = filtroStatusEl.value; // <-- LÊ O VALOR DO NOVO FILTRO

      // Mapeia para incluir o índice original antes de filtrar
      const agendamentosMapeados = agendamentos.map((ag, index) => ({
          ...ag,
          originalIndex: index 
      }));

      // Filtra os agendamentos
      const agendamentosFiltrados = agendamentosMapeados.filter(ag => {
        let passouData = true;
        let passouDentista = true;
        let passouStatus = true; // <-- NOVA VERIFICAÇÃO

        if (dataFiltro && ag.data !== dataFiltro) {
          passouData = false;
        }
        if (dentistaFiltro && ag.dentista !== dentistaFiltro) {
          passouDentista = false;
        }
        // ▼▼ LÓGICA DO NOVO FILTRO ▼▼
        if (statusFiltro && (ag.status || "Agendado") !== statusFiltro) {
          passouStatus = false;
        }
        return passouData && passouDentista && passouStatus;
      });
      
      agendamentosFiltrados.sort((a, b) => (a.hora || "00:00").localeCompare(b.hora || "00:00"));

      agendamentosFiltrados.forEach((ag) => {
        const dataFormatada = (ag.data) 
          ? new Date(ag.data).toLocaleDateString("pt-BR", { timeZone: 'UTC' })
          : "-";
        
        const statusTexto = ag.status || "Agendado"; 
        const tipoTexto = ag.tipoConsulta || "-";
        const horaTexto = ag.hora || "-";

        let statusClasse = "text-muted";
        switch (statusTexto) {
            case "Confirmado": statusClasse = "text-success fw-bold"; break;
            case "Cancelado": statusClasse = "text-danger fw-bold"; break;
            case "Não Compareceu": statusClasse = "text-danger fw-bold"; break;
            case "Finalizado": statusClasse = "text-primary fw-bold"; break;
        }

        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${ag.paciente}</td>
          <td>${dataFormatada}</td>
          <td>${horaTexto}</td>
          <td>${ag.dentista}</td>
          <td class="${statusClasse}">${statusTexto}</td>
          <td>${tipoTexto}</td>
          <td>
            <button class="btn btn-sm btn-info me-1 btn-editar-ag" data-index="${ag.originalIndex}">Editar</button>
            <button class="btn btn-sm btn-danger btn-excluir-ag" data-index="${ag.originalIndex}">Excluir</button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    };

    // =================================
    // FORMULÁRIO PRINCIPAL (SÓ ADICIONAR)
    // =================================
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const novoAgendamento = {
        paciente: form.pacienteSelect.value,
        dentista: form.dentistaSelect.value,
        data: form.data.value,
        hora: form.hora.value,
        tipoConsulta: form.tipoConsulta.value.trim(),
        status: form.status.value,
        observacoes: form.observacoes.value.trim()
      };
      agendamentos.push(novoAgendamento);
      localStorage.setItem("agendamentos", JSON.stringify(agendamentos));
      form.reset();
      form.pacienteSelect.value = ""; 
      form.hora.value = "";
      form.dentistaSelect.value = "";
      horaForm.disabled = true; 
      atualizarTabelaAgendamentos();
    });

    // =================================
    // LÓGICA DO MODAL DE EDIÇÃO (COM SIMULAÇÃO DE REMARCAÇÃO)
    // =================================

    // Função para ABRIR o modal com os dados
    function abrirModalEdicaoAgendamento(index) {
      const ag = agendamentos[index];
      if (!ag) return;

      // Preenche o formulário do modal
      editPacienteSelect.value = ag.paciente;
      editDentistaSelect.value = ag.dentista;
      editDataForm.value = ag.data;
      editHoraForm.value = ag.hora || "";
      document.getElementById('editAgTipoConsulta').value = ag.tipoConsulta || "";
      document.getElementById('editAgStatus').value = ag.status || "Agendado";
      document.getElementById('editAgObservacoes').value = ag.observacoes || "";
      document.getElementById('editAgendamentoIndex').value = index;
      
      atualizarHorariosDisponiveis(ag.data, ag.dentista, editHoraForm, ag.hora);
      editHoraForm.value = ag.hora; 
      
      const editAgendamentoModal = new bootstrap.Modal(editModalElement);
      editAgendamentoModal.show();
    }

    // Listener para SALVAR o modal de edição
    editForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const index = document.getElementById('editAgendamentoIndex').value;
      if (index === null || index === undefined) return;
      
      const agendamentoOriginal = agendamentos[index];

      // Monta o objeto atualizado
      const agendamentoAtualizado = {
        paciente: document.getElementById('editAgPacienteSelect').value,
        dentista: document.getElementById('editAgDentistaSelect').value,
        data: document.getElementById('editAgData').value,
        hora: document.getElementById('editAgHora').value,
        tipoConsulta: document.getElementById('editAgTipoConsulta').value.trim(),
        status: document.getElementById('editAgStatus').value,
        observacoes: document.getElementById('editAgObservacoes').value.trim()
      };
      
      // Simulação de REMARCAÇÃO
      if (agendamentoOriginal.data !== agendamentoAtualizado.data || agendamentoOriginal.hora !== agendamentoAtualizado.hora) {
        alert(`Simulação: Notificação de REMARCAÇÃO enviada para ${agendamentoAtualizado.paciente}.`);
      }
      // Simulação de CANCELAMENTO (se o status mudou para 'Cancelado')
      if (agendamentoOriginal.status !== "Cancelado" && agendamentoAtualizado.status === "Cancelado") {
        alert(`Simulação: Notificação de CANCELAMENTO enviada para ${agendamentoAtualizado.paciente}.`);
      }

      agendamentos[index] = agendamentoAtualizado;

      localStorage.setItem("agendamentos", JSON.stringify(agendamentos));
      atualizarTabelaAgendamentos();
      
      const modalInstance = bootstrap.Modal.getInstance(editModalElement);
      if (modalInstance) {
          modalInstance.hide();
      }
    });

    // =================================
    // LISTENER DE CLIQUES NA TABELA (COM SIMULAÇÃO DE CANCELAMENTO)
    // =================================
    tabela.addEventListener('click', function(e) {
      const target = e.target;

      // Botão EDITAR
      if (target.classList.contains('btn-editar-ag')) {
        const index = target.getAttribute('data-index');
        abrirModalEdicaoAgendamento(index);
      }
      
      // Botão EXCLUIR
      if (target.classList.contains('btn-excluir-ag')) {
        const index = target.getAttribute('data-index');
        const ag = agendamentos[index];
        
        if (confirm(`Deseja realmente excluir o agendamento de ${ag.paciente}?`)) {
            
            // Simulação de CANCELAMENTO
            alert(`Simulação: Notificação de CANCELAMENTO enviada para ${ag.paciente}.`);

            agendamentos.splice(index, 1);
            localStorage.setItem("agendamentos", JSON.stringify(agendamentos));
            atualizarTabelaAgendamentos();
        }
      }
    });
    
  // =================================
    // LÓGICA DO BOTÃO DE LEMBRETES
    // =================================
    const btnLembretes = document.getElementById("btnEnviarLembretes");
    
    if (btnLembretes) {
      btnLembretes.addEventListener('click', () => {
        
        let dataAlvo;
        const dataFiltro = filtroDataEl.value;

        if (dataFiltro) {
          // Se o usuário FILTROU um dia, o alvo é o dia do filtro.
          dataAlvo = dataFiltro;
        } else {
          // Se o filtro está VAZIO, o padrão é AMANHÃ.
          const hoje = new Date();
          const amanha = new Date(hoje);
          amanha.setDate(hoje.getDate() + 1); // Pega o dia de amanhã
          dataAlvo = amanha.toISOString().split('T')[0];
        }

        // Envia apenas para status "Agendado"
        const agendamentosParaLembrar = agendamentos.filter(ag => 
            ag.data === dataAlvo && 
            ag.status === "Agendado"
        );
        
        const dataFormatada = new Date(dataAlvo).toLocaleDateString("pt-BR", { timeZone: 'UTC' });

        if (agendamentosParaLembrar.length === 0) {
          alert(`Nenhum paciente com status 'Agendado' para lembrar no dia ${dataFormatada}.`);
          return;
        }

        alert(`Simulação:\n\nEnviando ${agendamentosParaLembrar.length} lembretes para os pacientes do dia ${dataFormatada}.`);
      });
    }

    // =================================
    // INICIALIZAÇÃO
    // =================================
    filtroDataEl.addEventListener('change', atualizarTabelaAgendamentos);
    filtroDentistaEl.addEventListener('change', atualizarTabelaAgendamentos);
    filtroStatusEl.addEventListener('change', atualizarTabelaAgendamentos); // <-- LISTENER NOVO
    
    // Listeners do formulário principal
    dataForm.addEventListener('change', () => {
      atualizarHorariosDisponiveis(dataForm.value, selectDentistaForm.value, horaForm);
    });
    selectDentistaForm.addEventListener('change', () => {
      atualizarHorariosDisponiveis(dataForm.value, selectDentistaForm.value, horaForm);
    });
    
    // Listeners do modal de edição
    editDataForm.addEventListener('change', () => {
      const agendamentoAtual = agendamentos[document.getElementById('editAgendamentoIndex').value];
      const horaOriginal = agendamentoAtual ? agendamentoAtual.hora : null;
      atualizarHorariosDisponiveis(editDataForm.value, editDentistaSelect.value, editHoraForm, horaOriginal);
    });
    editDentistaSelect.addEventListener('change', () => {
      const agendamentoAtual = agendamentos[document.getElementById('editAgendamentoIndex').value];
      const horaOriginal = agendamentoAtual ? agendamentoAtual.hora : null;
      atualizarHorariosDisponiveis(editDataForm.value, editDentistaSelect.value, editHoraForm, horaOriginal);
    });

    // Carga inicial
    atualizarTabelaAgendamentos(); 
    horaForm.disabled = true; 
  }
});


// =======================================================
// LÓGICA DA PÁGINA FINANCEIRO
// =======================================================
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("financeiroForm");
  const tabela = document.getElementById("tabelaFinanceiro");
  const selectPacientes = document.getElementById("pacienteSelect");

  // Cards de Resumo
  const totalEntradasEl = document.getElementById("totalEntradas");
  const totalSaidasEl = document.getElementById("totalSaidas");
  const saldoAtualEl = document.getElementById("saldoAtual");
  
  // Elementos do Modal de Edição
  const editModalElement = document.getElementById('editFinanceiroModal');
  const editForm = document.getElementById('editFinanceiroForm');
  const editPacienteSelect = document.getElementById('editPacienteSelectFin');
  
  // Elementos de Filtro
  const filtroDataEl = document.getElementById('filtroDataFin');
  const filtroTipoEl = document.getElementById('filtroTipoFin');
  const btnLimparFiltros = document.getElementById('btnLimparFiltrosFin');


  // Só executa se estiver na página financeira
  if (form && tabela && selectPacientes && editModalElement && filtroDataEl) {

    // =================================
    // APLICANDO MÁSCARA DE MOEDA (Formulário Principal)
    // =================================
    const valorMask = IMask(document.getElementById('valor'), {
      mask: 'R$ num',
      blocks: {
        num: { mask: Number, scale: 2, thousandsSeparator: '.', padFractionalZeros: true, radix: ',', mapToRadix: ['.'] }
      }
    });
    
    // =================================
    // APLICANDO MÁSCARA DE MOEDA (Modal de Edição)
    // =================================
    const editValorMask = IMask(document.getElementById('editValorFin'), {
      mask: 'R$ num',
      blocks: {
        num: { mask: Number, scale: 2, thousandsSeparator: '.', padFractionalZeros: true, radix: ',', mapToRadix: ['.'] }
      }
    });
    
    // =================================
    // CARREGAR DADOS
    // =================================
    const pacientes = JSON.parse(localStorage.getItem("pacientes")) || [];
    let transacoes = JSON.parse(localStorage.getItem("financeiro")) || [];
    const convenios = JSON.parse(localStorage.getItem("convenios")) || [];
    
    // 1. Carregar Pacientes nos Dropdowns (Formulário Principal E Modal)
    pacientes.forEach(p => {
      const option = new Option(p.nome, p.nome);
      selectPacientes.appendChild(option.cloneNode(true));
      editPacienteSelect.appendChild(option.cloneNode(true));
    });

    // 2. Carregar Convênios nos Dropdowns de Pagamento
    const formaPagamentoSelect = document.getElementById("formaPagamento");
    const editFormaPagamentoSelect = document.getElementById("editFormaPagamentoFin");

    convenios.forEach(c => {
      const option = new Option(c.nome, c.nome); // (Ex: "Bradesco Prime")
      formaPagamentoSelect.appendChild(option.cloneNode(true));
      editFormaPagamentoSelect.appendChild(option.cloneNode(true));
    });

    // Função para formatar moeda
    const formatarMoeda = (valor) => {
      return (valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    // =================================
    // ATUALIZAR TABELA E CARDS (AGORA COM FILTROS)
    // =================================
    const atualizarFinanceiro = () => {
      const tbody = tabela.querySelector("tbody");
      tbody.innerHTML = "";
      
      let totalEntradas = 0;
      let totalSaidas = 0;
      
      // Lógica de filtro
      const dataFiltro = filtroDataEl.value;
      const tipoFiltro = filtroTipoEl.value;

      const transacoesFiltradas = transacoes.filter(tr => {
        let passouData = true;
        let passouTipo = true;

        if (dataFiltro && tr.data !== dataFiltro) {
          passouData = false;
        }
        if (tipoFiltro && tr.tipo !== tipoFiltro) {
          passouTipo = false;
        }
        return passouData && passouTipo;
      });

      // Usa as transações filtradas para ordenar e exibir
      transacoesFiltradas.sort((a, b) => new Date(b.data) - new Date(a.data)); // Ordena por mais recente

      transacoesFiltradas.forEach((tr) => {
        // Encontra o índice original no array 'transacoes'
        const i_original = transacoes.findIndex(t => t === tr);
        
        const valor = parseFloat(tr.valor) || 0;
        let classeTipo = "";

        if (tr.tipo === "entrada") {
          totalEntradas += valor;
          classeTipo = "text-success fw-bold";
        } else {
          totalSaidas += valor;
          classeTipo = "text-danger fw-bold";
        }

        const dataFormatada = tr.data 
          ? new Date(tr.data).toLocaleDateString("pt-BR", { timeZone: 'UTC' })
          : "-";

        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${tr.paciente || "-"}</td>
          <td>${tr.descricao || "-"}</td>
          <td>${tr.formaPagamento || "-"}</td>
          <td class="${classeTipo}">${tr.tipo ? tr.tipo.charAt(0).toUpperCase() + tr.tipo.slice(1) : "-"}</td>
          <td>${formatarMoeda(valor)}</td>
          <td>${dataFormatada}</td>
          <td>
            <button class="btn btn-sm btn-info me-1 btn-editar-fin" data-index="${i_original}">Editar</button>
            <button class="btn btn-sm btn-danger btn-excluir-fin" data-index="${i_original}">Excluir</button>
          </td>
        `;
        tbody.appendChild(row);
      });

      // Atualiza os cards de resumo (agora baseados nos filtros)
      const saldoAtual = totalEntradas - totalSaidas;
      totalEntradasEl.textContent = formatarMoeda(totalEntradas);
      totalSaidasEl.textContent = formatarMoeda(totalSaidas);
      saldoAtualEl.textContent = formatarMoeda(saldoAtual);

      if (saldoAtual < 0) {
        saldoAtualEl.classList.remove("text-primary");
        saldoAtualEl.classList.add("text-danger");
      } else {
        saldoAtualEl.classList.add("text-primary");
        saldoAtualEl.classList.remove("text-danger");
      }
    };

    // =================================
    // FORMULÁRIO PRINCIPAL (SÓ ADICIONAR)
    // =================================
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      
      let data = form.data.value;
      if (!data) {
        data = new Date().toISOString().split('T')[0];
      }
      
      const valorLimpo = valorMask.unmaskedValue; // Pega só os números
      
      const novaTransacao = {
        paciente: form.pacienteSelect.value, 
        descricao: form.descricao.value.trim(),
        formaPagamento: form.formaPagamento.value, 
        tipo: form.tipo.value,
        valor: parseFloat(valorLimpo),
        data: data
      };

      transacoes.push(novaTransacao);
      localStorage.setItem("financeiro", JSON.stringify(transacoes));
      form.reset();
      valorMask.value = '';
      form.data.value = "";
      atualizarFinanceiro(); // Atualiza a tabela com os filtros
    });

    // =================================
    // LÓGICA DO MODAL DE EDIÇÃO (CONTEÚDO RESTAURADO)
    // =================================

    // Função para ABRIR o modal com os dados
    function abrirModalEdicaoFinanceiro(index) {
      const tr = transacoes[index];
      if (!tr) return;

      // Preenche o formulário do modal
      document.getElementById('editPacienteSelectFin').value = tr.paciente || "";
      document.getElementById('editDescricaoFin').value = tr.descricao || "";
      document.getElementById('editFormaPagamentoFin').value = tr.formaPagamento || "PIX";
      document.getElementById('editTipoFin').value = tr.tipo || "entrada";
      document.getElementById('editDataFin').value = tr.data || "";
      
      // Define o valor no iMask
      editValorMask.value = (tr.valor || 0).toString().replace('.', ',');

      // Guarda o índice
      document.getElementById('editFinanceiroIndex').value = index;
      
      // Abre o modal (INICIALIZA SÓ AGORA)
      const editFinanceiroModal = new bootstrap.Modal(editModalElement);
      editFinanceiroModal.show();
    }

    // Listener para SALVAR o modal de edição
    editForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const index = document.getElementById('editFinanceiroIndex').value;
      if (index === null || index === undefined) return;

      // Pega o valor limpo da máscara do modal
      const valorLimpoEdit = editValorMask.unmaskedValue;

      // Monta o objeto atualizado
      const transacaoAtualizada = {
        paciente: document.getElementById('editPacienteSelectFin').value,
        descricao: document.getElementById('editDescricaoFin').value.trim(),
        formaPagamento: document.getElementById('editFormaPagamentoFin').value,
        tipo: document.getElementById('editTipoFin').value,
        valor: parseFloat(valorLimpoEdit),
        data: document.getElementById('editDataFin').value
      };

      // Atualiza no array
      transacoes[index] = transacaoAtualizada;

      // Salva, atualiza a tabela e fecha
      localStorage.setItem("financeiro", JSON.stringify(transacoes));
      atualizarFinanceiro();
      
      // Pega a instância e fecha
      const modalInstance = bootstrap.Modal.getInstance(editModalElement);
      if (modalInstance) {
          modalInstance.hide();
      }
    });

    // =================================
    // LISTENER DE CLIQUES NA TABELA (EDITAR E EXCLUIR)
    // =================================
    tabela.addEventListener('click', function(e) {
      const target = e.target;

      // Botão EDITAR
      if (target.classList.contains('btn-editar-fin')) {
        const index = target.getAttribute('data-index');
        abrirModalEdicaoFinanceiro(index);
      }
      
      // Botão EXCLUIR
      if (target.classList.contains('btn-excluir-fin')) {
        const index = target.getAttribute('data-index');
        const tr = transacoes[index];
        
        if (confirm(`Deseja realmente excluir o lançamento: "${tr.descricao}"?`)) {
            transacoes.splice(index, 1);
            localStorage.setItem("financeiro", JSON.stringify(transacoes));
            atualizarFinanceiro();
        }
      }
    });
    
    // =================================
    // LISTENERS DOS FILTROS
    // =================================
    filtroDataEl.addEventListener('change', atualizarFinanceiro);
    filtroTipoEl.addEventListener('change', atualizarFinanceiro);
    
    btnLimparFiltros.addEventListener('click', () => {
        filtroDataEl.value = "";
        filtroTipoEl.value = "";
        atualizarFinanceiro();
    });

    // =================================
    // INICIALIZAÇÃO
    // =================================
    atualizarFinanceiro();
  }
});

// =======================================================
// LÓGICA DA PÁGINA ESTOQUE
// =======================================================
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("estoqueForm");
  const tabela = document.getElementById("tabelaEstoque");
  
  // Elementos do Modal de Edição
  const editModalElement = document.getElementById('editEstoqueModal');
  const editForm = document.getElementById('editEstoqueForm');

  // Só executa se estiver na página de estoque
  if (form && tabela && editModalElement) {
    
    let estoque = JSON.parse(localStorage.getItem("estoque")) || [];

    // =================================
    // ATUALIZAR TABELA
    // =================================
    const atualizarTabelaEstoque = () => {
      const tbody = tabela.querySelector("tbody");
      tbody.innerHTML = "";
      
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0); // Zera a hora para comparar só a data

      estoque.forEach((item, i) => {
        const tr = document.createElement("tr");

        let classeAlerta = "";
        
        // 1. Verifica Estoque Mínimo
        const qtd = parseInt(item.quantidade);
        const min = parseInt(item.estoqueMinimo);
        if (qtd <= min) {
          classeAlerta = "table-danger"; // Alerta de estoque baixo
        }

        // 2. Verifica Validade
        let dataValidadeFormatada = "-";
        if (item.validade) {
          const dataVal = new Date(item.validade);
          // Ajuste de fuso (adiciona 1 dia para datas UTC)
          const dataValAjustada = new Date(dataVal.getUTCFullYear(), dataVal.getUTCMonth(), dataVal.getUTCDate());
          
          if (dataValAjustada < hoje) {
            classeAlerta = "table-danger"; // Alerta de vencido
          }
          dataValidadeFormatada = dataValAjustada.toLocaleDateString("pt-BR");
        }
        
        if(classeAlerta) {
          tr.classList.add(classeAlerta);
        }

        tr.innerHTML = `
          <td>${item.nomeMaterial}</td>
          <td>${item.tipoMaterial || "-"}</td>
          <td>${qtd}</td>
          <td>${min}</td>
          <td>${item.fornecedor || "-"}</td>
          <td>${item.lote || "-"}</td>
          <td>${dataValidadeFormatada}</td>
          <td>
            <button class="btn btn-sm btn-info me-1 btn-editar-est" data-index="${i}">Editar</button>
            <button class="btn btn-sm btn-danger btn-excluir-est" data-index="${i}">Excluir</button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    };

    // =================================
    // FORMULÁRIO PRINCIPAL (SÓ ADICIONAR)
    // =================================
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const novoItem = {
        nomeMaterial: form.nomeMaterial.value.trim(),
        tipoMaterial: form.tipoMaterial.value.trim(),
        fornecedor: form.fornecedor.value.trim(),
        quantidade: parseInt(form.quantidade.value),
        estoqueMinimo: parseInt(form.estoqueMinimo.value),
        lote: form.lote.value.trim(),
        validade: form.validade.value
      };

      estoque.push(novoItem);
      localStorage.setItem("estoque", JSON.stringify(estoque));
      form.reset();
      atualizarTabelaEstoque();
    });
    
    // =================================
    // LÓGICA DO MODAL DE EDIÇÃO
    // =================================

    // Função para ABRIR o modal com os dados
    function abrirModalEdicaoEstoque(index) {
      const item = estoque[index];
      if (!item) return;

      // Preenche o formulário do modal
      document.getElementById('editNomeMaterial').value = item.nomeMaterial;
      document.getElementById('editTipoMaterial').value = item.tipoMaterial || "";
      document.getElementById('editFornecedor').value = item.fornecedor || "";
      document.getElementById('editQuantidade').value = item.quantidade;
      document.getElementById('editEstoqueMinimo').value = item.estoqueMinimo;
      document.getElementById('editLote').value = item.lote || "";
      document.getElementById('editValidade').value = item.validade || "";
      document.getElementById('editEstoqueIndex').value = index;
      
      // Abre o modal
      const editEstoqueModal = new bootstrap.Modal(editModalElement);
      editEstoqueModal.show();
    }

    // Listener para SALVAR o modal de edição
    editForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const index = document.getElementById('editEstoqueIndex').value;
      if (index === null || index === undefined) return;

      const itemAtualizado = {
        nomeMaterial: document.getElementById('editNomeMaterial').value.trim(),
        tipoMaterial: document.getElementById('editTipoMaterial').value.trim(),
        fornecedor: document.getElementById('editFornecedor').value.trim(),
        quantidade: parseInt(document.getElementById('editQuantidade').value),
        estoqueMinimo: parseInt(document.getElementById('editEstoqueMinimo').value),
        lote: document.getElementById('editLote').value.trim(),
        validade: document.getElementById('editValidade').value
      };

      // Atualiza no array
      estoque[index] = itemAtualizado;

      // Salva, atualiza a tabela e fecha
      localStorage.setItem("estoque", JSON.stringify(estoque));
      atualizarTabelaEstoque();
      
      const modalInstance = bootstrap.Modal.getInstance(editModalElement);
      if (modalInstance) {
          modalInstance.hide();
      }
    });

    // =================================
    // LISTENER DE CLIQUES NA TABELA (EDITAR E EXCLUIR)
    // =================================
    tabela.addEventListener('click', function(e) {
      const target = e.target;

      // Botão EDITAR
      if (target.classList.contains('btn-editar-est')) {
        const index = target.getAttribute('data-index');
        abrirModalEdicaoEstoque(index);
      }
      
      // Botão EXCLUIR
      if (target.classList.contains('btn-excluir-est')) {
        const index = target.getAttribute('data-index');
        const item = estoque[index];
        
        if (confirm(`Deseja realmente excluir o item: "${item.nomeMaterial}"?`)) {
            estoque.splice(index, 1);
            localStorage.setItem("estoque", JSON.stringify(estoque));
            atualizarTabelaEstoque();
        }
      }
    });

    // =================================
    // INICIALIZAÇÃO
    // =================================
    atualizarTabelaEstoque();
  }
});

// =======================================================
// LÓGICA DA PÁGINA ORÇAMENTOS (COM CONSTRUTOR DE ITENS)
// =======================================================
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("orcamentoForm");
  const tabela = document.getElementById("tabelaOrcamentos");
  const selectPacientes = document.getElementById("pacienteSelectOrc");
  const selectDentistaOrc = document.getElementById("dentistaSelectOrc"); 

  // Elementos do Formulário Principal
  const btnAddTratamento = document.getElementById('btnAddTratamento');
  const selectTratamento = document.getElementById('orcTratamentoSelect');
  const inputQtd = document.getElementById('orcTratamentoQtd');
  const tbodyItens = document.getElementById('orcItensLista');
  const inputValorTotal = document.getElementById('valorOrcamento');

  // Elementos do Modal de Edição
  const editModalElement = document.getElementById('editOrcamentoModal');
  const editForm = document.getElementById('editOrcamentoForm');
  const editPacienteSelect = document.getElementById('editPacienteSelectOrc');
  const editDentistaSelectOrc = document.getElementById('editDentistaSelectOrc'); 
  const editTbodyItens = document.getElementById('editOrcItensLista');
  const editInputValorTotal = document.getElementById('editValorOrcamento');


  // Só executa se estiver na página de orçamentos
  if (form && tabela && selectPacientes && editModalElement && selectDentistaOrc) {
    
    // =================================
    // APLICANDO MÁSCARA DE MOEDA (Nos totais)
    // =================================
    const formatarMoedaSimples = (valor) => {
        // Função auxiliar para evitar erro de máscara em campos readonly
        return (valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });
    };

    const valorOrcamentoMask = IMask(inputValorTotal, {
      mask: 'R$ num',
      blocks: {
        num: { mask: Number, scale: 2, thousandsSeparator: '.', padFractionalZeros: true, radix: ',', mapToRadix: ['.'] }
      }
    });
    const editValorOrcamentoMask = IMask(editInputValorTotal, {
      mask: 'R$ num',
      blocks: {
        num: { mask: Number, scale: 2, thousandsSeparator: '.', padFractionalZeros: true, radix: ',', mapToRadix: ['.'] }
      }
    });

    // =================================
    // CARREGAR DADOS
    // =================================
    const pacientes = JSON.parse(localStorage.getItem("pacientes")) || [];
    const dentistas = JSON.parse(localStorage.getItem("dentistas")) || []; 
    const tratamentos = JSON.parse(localStorage.getItem("tratamentos")) || [];
    let orcamentos = JSON.parse(localStorage.getItem("orcamentos")) || [];
    
    // Array temporário para o novo orçamento
    let itensOrcamentoAtual = [];

    // 1. Carregar Pacientes nos Dropdowns (Formulário Principal E Modal)
    selectPacientes.appendChild(new Option("Selecione um paciente...", ""));
    pacientes.forEach(p => {
      const option = new Option(p.nome, p.nome);
      selectPacientes.appendChild(option.cloneNode(true));
      editPacienteSelect.appendChild(option.cloneNode(true));
    });

    // 2. Carregar Dentistas nos Dropdowns (Formulário Principal E Modal) (NOVO)
    selectDentistaOrc.appendChild(new Option("Selecione um dentista...", ""));
    dentistas.forEach(d => {
      const option = new Option(d.nome, d.nome);
      selectDentistaOrc.appendChild(option.cloneNode(true));
      editDentistaSelectOrc.appendChild(option.cloneNode(true));
    });

    // 3. Carregar Tratamentos no Dropdown (AQUI ESTÁ A LÓGICA DE INTERESSE)
    tratamentos.forEach(t => {
      // O valor do item será o nome do tratamento
      const option = new Option(`${t.nome} (${formatarMoedaSimples(t.valor)})`, t.nome);
      selectTratamento.appendChild(option);
    });

    // Função para formatar moeda
    const formatarMoeda = (valor) => (valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    // =================================
    // FUNÇÕES DO CONSTRUTOR DE ORÇAMENTO
    // =================================
    const calcularTotal = (itens) => {
      return itens.reduce((acc, item) => acc + (item.qtd * item.valorUnit), 0);
    };

    const renderizarItens = (itensArray, tbodyElement, maskElement) => {
      tbodyElement.innerHTML = "";
      
      if(itensArray.length === 0) {
         maskElement.value = formatarMoedaSimples(0).toString().replace('.', ','); // Zera o total
         tbodyElement.innerHTML = `<tr><td colspan="5" class="text-center">Nenhum tratamento adicionado.</td></tr>`;
         return;
      }
      
      itensArray.forEach((item, index) => {
        const subtotal = item.qtd * item.valorUnit;
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${item.qtd}</td>
          <td>${item.nome}</td>
          <td>${formatarMoeda(item.valorUnit)}</td>
          <td>${formatarMoeda(subtotal)}</td>
          ${tbodyElement.id === 'orcItensLista' ? `<td><button type="button" class="btn btn-danger btn-sm btn-remover-item" data-index="${index}">X</button></td>` : ''}
        `;
        tbodyElement.appendChild(tr);
      });
      
     const valorTotalNum = calcularTotal(itensArray);
      
      // ▼▼ CORREÇÃO APLICADA AQUI ▼▼
      // 1. Converte o número para uma string no formato de moeda local (ex: "2200,00")
      // O 'toFixed(2)' garante que sempre teremos duas casas decimais.
      const valorStringCorrigido = valorTotalNum.toFixed(2).replace('.', ',');
      
      // 2. Alimenta a máscara com a string já formatada
      maskElement.value = valorStringCorrigido;
      // ▲▲ FIM DA CORREÇÃO ▲▲
    };
    
    // Botão de Adicionar Item
    btnAddTratamento.addEventListener('click', () => {
      const nomeTratamento = selectTratamento.value;
      const qtd = parseInt(inputQtd.value);
      const tratamentoSelecionado = tratamentos.find(t => t.nome === nomeTratamento);
      
      if (!tratamentoSelecionado || qtd < 1) {
        alert("Selecione um tratamento e uma quantidade válida.");
        return;
      }

      itensOrcamentoAtual.push({
        nome: tratamentoSelecionado.nome,
        qtd: qtd,
        valorUnit: tratamentoSelecionado.valor
      });
      
      renderizarItens(itensOrcamentoAtual, tbodyItens, valorOrcamentoMask);
      
      // Reseta os campos
      selectTratamento.value = "";
      inputQtd.value = 1;
    });
    
    // Botão de Remover Item (Delegação)
    tbodyItens.addEventListener('click', (e) => {
      if(e.target.classList.contains('btn-remover-item')) {
        const index = e.target.getAttribute('data-index');
        itensOrcamentoAtual.splice(index, 1); // Remove o item do array
        renderizarItens(itensOrcamentoAtual, tbodyItens, valorOrcamentoMask);
      }
    });

    // =================================
    // ATUALIZAR TABELA PRINCIPAL
    // =================================
    const atualizarTabelaOrcamentos = () => {
      const tbody = tabela.querySelector("tbody");
      tbody.innerHTML = "";
      
      orcamentos.sort((a, b) => new Date(a.data) - new Date(b.data));

      orcamentos.forEach((orc, i) => {
        const dataFormatada = orc.data 
          ? new Date(orc.data).toLocaleDateString("pt-BR", { timeZone: 'UTC' }) 
          : "-";
        
        // Pega o primeiro item da lista para exibir
        const servicosTexto = orc.itens && orc.itens.length > 0
          ? `${orc.itens[0].qtd}x ${orc.itens[0].nome}${orc.itens.length > 1 ? '...' : ''}`
          : "-";

        let statusClasse = "text-muted";
        if (orc.status === "Aprovado") statusClasse = "text-success fw-bold";
        if (orc.status === "Recusado") statusClasse = "text-danger fw-bold";
        if (orc.status === "Aguardando Aprovação") statusClasse = "text-warning fw-bold";

        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${orc.paciente || "-"}</td>
          <td>${dataFormatada}</td>
          <td>${orc.dentista || "-"}</td> <td>${formatarMoeda(orc.valorTotal)}</td>
          <td class="${statusClasse}">${orc.status}</td>
          <td>${servicosTexto}</td>
          <td>
            <button class="btn btn-sm btn-info me-1 btn-editar-orc" data-index="${i}">Ver/Editar</button>
            <button class="btn btn-sm btn-secondary me-1 btn-imprimir-orc" data-index="${i}">Imprimir</button>
            <button class="btn btn-sm btn-danger btn-excluir-orc" data-index="${i}">Excluir</button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    };

    // =================================
    // FORMULÁRIO PRINCIPAL (SALVAR ORÇAMENTO)
    // =================================
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      
      if(itensOrcamentoAtual.length === 0) {
        alert("Adicione pelo menos um tratamento ao orçamento.");
        return;
      }
      
      let data = form.dataOrcamento.value;
      if (!data) {
        data = new Date().toISOString().split('T')[0];
      }
      
      const novoOrcamento = {
        paciente: form.pacienteSelectOrc.value,
        dentista: document.getElementById('dentistaSelectOrc').value, // <-- CAMPO ADICIONADO
        data: data,
        status: form.statusOrcamento.value,
        itens: itensOrcamentoAtual, // Salva o array de itens
        valorTotal: calcularTotal(itensOrcamentoAtual) // Salva o total
      };
      
      orcamentos.push(novoOrcamento);
      localStorage.setItem("orcamentos", JSON.stringify(orcamentos));
      
      // Limpa tudo
      form.reset();
      itensOrcamentoAtual = []; // Limpa o array de itens
      renderizarItens(itensOrcamentoAtual, tbodyItens, valorOrcamentoMask);
      selectPacientes.value = "";
      selectDentistaOrc.value = ""; // <-- LIMPA O CAMPO
      
      atualizarTabelaOrcamentos();
    });

    // =================================
    // LÓGICA DO MODAL DE EDIÇÃO
    // =================================

    // Função para ABRIR o modal com os dados
    function abrirModalEdicaoOrcamento(index) {
      const orc = orcamentos[index];
      if (!orc) return;

      // Preenche o formulário do modal
      editPacienteSelect.value = orc.paciente;
      document.getElementById('editDentistaSelectOrc').value = orc.dentista; // <-- CAMPO ADICIONADO
      document.getElementById('editDataOrcamento').value = orc.data;
      document.getElementById('editStatusOrcamento').value = orc.status || "Aguardando Aprovação";
      
      // Renderiza os itens e o valor total (sem máscara)
      renderizarItens(orc.itens || [], editTbodyItens, editValorOrcamentoMask);
      
      document.getElementById('editOrcamentoIndex').value = index;
      
      const editOrcamentoModal = new bootstrap.Modal(editModalElement);
      editOrcamentoModal.show();
    }

    // Listener para SALVAR o modal de edição
    editForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const index = document.getElementById('editOrcamentoIndex').value;
      if (index === null) return;
      
      // Pega o orçamento existente
      const orcamentoAtualizado = orcamentos[index];
      
      // Atualiza apenas os campos permitidos
      orcamentoAtualizado.paciente = document.getElementById('editPacienteSelectOrc').value;
      orcamentoAtualizado.dentista = document.getElementById('editDentistaSelectOrc').value; // <-- CAMPO ADICIONADO
      orcamentoAtualizado.data = document.getElementById('editDataOrcamento').value;
      orcamentoAtualizado.status = document.getElementById('editStatusOrcamento').value;

      orcamentos[index] = orcamentoAtualizado;
      localStorage.setItem("orcamentos", JSON.stringify(orcamentos));
      atualizarTabelaOrcamentos();
      
      const modalInstance = bootstrap.Modal.getInstance(editModalElement);
      if (modalInstance) {
          modalInstance.hide();
      }
    });

    // =================================
    // LÓGICA DE IMPRESSÃO DE ORÇAMENTO
    // =================================
    function gerarImpressaoOrcamento(orc) {
      const dataFormatada = new Date(orc.data).toLocaleDateString("pt-BR", { timeZone: 'UTC' });
      
      // Gera as linhas da tabela de itens
      let itensHtml = "";
      (orc.itens || []).forEach(item => {
        itensHtml += `
          <tr>
            <td>${item.qtd}</td>
            <td>${item.nome}</td>
            <td>${formatarMoeda(item.valorUnit)}</td>
            <td>${formatarMoeda(item.qtd * item.valorUnit)}</td>
          </tr>
        `;
      });

      const htmlConteudo = `
        <html>
          <head>
            <title>Orçamento - ${orc.paciente}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 40px; }
              .header { text-align: center; }
              .header img { width: 150px; }
              .header h2 { margin: 0; }
              .content { margin-top: 30px; }
              .info-paciente { border-bottom: 1px solid #ccc; padding-bottom: 15px; }
              .info-paciente p { margin: 5px 0; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
              .total { text-align: right; margin-top: 20px; font-size: 1.2em; font-weight: bold; }
              .footer { text-align: center; margin-top: 50px; font-size: 0.9em; color: #777; }
            </style>
          </head>
          <body>
            <div class="header">
              <img src="logo/smile.png" alt="Logo Smile Up">
              <h2>Plano de Tratamento e Orçamento</h2>
            </div>
            <div class="content">
              <div class="info-paciente">
                <p><strong>Paciente:</strong> ${orc.paciente}</p>
                <p><strong>Dentista:</strong> ${orc.dentista}</p> <p><strong>Data:</strong> ${dataFormatada}</p>
                <p><strong>Status:</strong> ${orc.status}</p>
              </div>
              <h3>Serviços / Procedimentos</h3>
              <table>
                <thead>
                  <tr><th>Qtd.</th><th>Tratamento</th><th>Valor Unit.</th><th>Subtotal</th></tr>
                </thead>
                <tbody>${itensHtml}</tbody>
              </table>
              <div class="total">
                <p>Valor Total: ${formatarMoeda(orc.valorTotal)}</p>
              </div>
            </div>
            <div class="footer">
              <p>Este orçamento é válido por 30 dias.</p>
              <p>Smile Up - Sistema de Gestão Odontológica</p>
            </div>
          </body>
        </html>
      `;

      // Abre uma nova janela, escreve o HTML e manda imprimir
      const printWindow = window.open('', '', 'height=600,width=800');
      printWindow.document.write(htmlConteudo);
      printWindow.document.close();
      printWindow.focus(); 
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500); 
    }

    // =================================
    // LISTENER DE CLIQUES NA TABELA (EDITAR, IMPRIMIR E EXCLUIR)
    // =================================
    tabela.addEventListener('click', function(e) {
      const target = e.target;
      if (target.classList.contains('btn-editar-orc')) {
        const index = target.getAttribute('data-index');
        abrirModalEdicaoOrcamento(index);
      }
      if (target.classList.contains('btn-imprimir-orc')) {
        const index = target.getAttribute('data-index');
        const orc = orcamentos[index];
        gerarImpressaoOrcamento(orc);
      }
      if (target.classList.contains('btn-excluir-orc')) {
        const index = target.getAttribute('data-index');
        const orc = orcamentos[index];
        if (confirm(`Deseja realmente excluir o orçamento de ${orc.paciente}?`)) {
            orcamentos.splice(index, 1);
            localStorage.setItem("orcamentos", JSON.stringify(orcamentos));
            atualizarTabelaOrcamentos();
        }
      }
    });
    
    // =================================
    // INICIALIZAÇÃO
    // =================================
    atualizarTabelaOrcamentos();
    renderizarItens(itensOrcamentoAtual, tbodyItens, valorOrcamentoMask); // Limpa a tabela de itens
  }
});


// =======================================================
// LÓGICA DA PÁGINA DE CONVÊNIOS
// =======================================================
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("convenioForm");
  const tabela = document.getElementById("tabelaConvenios");
  const editModalElement = document.getElementById('editConvenioModal');
  const editForm = document.getElementById('editConvenioForm');

  // Só executa se estiver na página de convênios
  if (form && tabela && editModalElement) {
    
    // =================================
    // APLICANDO MÁSCARAS (MOVIDO PARA DENTRO DO IF)
    // =================================
    const cnpjMask = IMask(document.getElementById('cnpjConvenio'), {
      mask: '00.000.000/0000-00'
    });
    const telefoneMask = IMask(document.getElementById('telefoneConvenio'), {
      mask: '(00) 0000[0]-0000'
    });
    const editCnpjMask = IMask(document.getElementById('editCnpjConvenio'), {
      mask: '00.000.000/0000-00'
    });
    const editTelefoneMask = IMask(document.getElementById('editTelefoneConvenio'), {
      mask: '(00) 0000[0]-0000'
    });

    // =================================
    // VARIÁVEIS PRINCIPAIS
    // =================================
    let convenios = JSON.parse(localStorage.getItem("convenios")) || [];

    // =================================
    // ATUALIZAR A TABELA
    // =================================
    const atualizarTabelaConvenios = () => {
      const tbody = tabela.querySelector("tbody");
      tbody.innerHTML = "";
      
      convenios.forEach((conv, i) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${conv.nome}</td>
          <td>${conv.cnpj || "-"}</td>
          <td>${conv.telefone || "-"}</td>
          <td>${(conv.observacoes || "-").substring(0, 30)}...</td>
          <td>
            <button class="btn btn-sm btn-info me-1 btn-editar-conv" data-index="${i}">Editar</button>
            <button class="btn btn-sm btn-danger btn-excluir-conv" data-index="${i}">Excluir</button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    };

    // =================================
    // FORMULÁRIO PRINCIPAL (SÓ ADICIONAR)
    // =================================
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const novoConvenio = {
        nome: document.getElementById('nomeConvenio').value.trim(),
        cnpj: document.getElementById('cnpjConvenio').value.trim(),
        telefone: document.getElementById('telefoneConvenio').value.trim(),
        observacoes: document.getElementById('observacoesConvenio').value.trim()
      };

      convenios.push(novoConvenio);
      localStorage.setItem("convenios", JSON.stringify(convenios));
      form.reset();
      atualizarTabelaConvenios();
    });

    // =================================
    // LÓGICA DO MODAL DE EDIÇÃO
    // =================================

    // Função para ABRIR o modal com os dados
    function abrirModalEdicaoConvenio(index) {
      const conv = convenios[index];
      if (!conv) return;

      // Preenche o formulário do modal
      document.getElementById('editNomeConvenio').value = conv.nome;
      document.getElementById('editCnpjConvenio').value = conv.cnpj || "";
      document.getElementById('editTelefoneConvenio').value = conv.telefone || "";
      document.getElementById('editObservacoesConvenio').value = conv.observacoes || "";
      document.getElementById('editConvenioIndex').value = index;
      
      // Abre o modal
      const editConvenioModal = new bootstrap.Modal(editModalElement);
      editConvenioModal.show();
    }

    // Listener para SALVAR o modal de edição
    editForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const index = document.getElementById('editConvenioIndex').value;
      if (index === null || index === undefined) return;

      const convenioAtualizado = {
        nome: document.getElementById('editNomeConvenio').value.trim(),
        cnpj: document.getElementById('editCnpjConvenio').value.trim(),
        telefone: document.getElementById('editTelefoneConvenio').value.trim(),
        observacoes: document.getElementById('editObservacoesConvenio').value.trim()
      };

      // Atualiza no array
      convenios[index] = convenioAtualizado;

      // Salva, atualiza a tabela e fecha
      localStorage.setItem("convenios", JSON.stringify(convenios));
      atualizarTabelaConvenios();
      
      const modalInstance = bootstrap.Modal.getInstance(editModalElement);
      if (modalInstance) {
          modalInstance.hide();
      }
    });

    // =================================
    // LISTENER DE CLIQUES NA TABELA (EDITAR E EXCLUIR)
    // =================================
    tabela.addEventListener('click', function(e) {
      const target = e.target;

      // Botão EDITAR
      if (target.classList.contains('btn-editar-conv')) {
        const index = target.getAttribute('data-index');
        abrirModalEdicaoConvenio(index);
      }
      
      // Botão EXCLUIR
      if (target.classList.contains('btn-excluir-conv')) {
        const index = target.getAttribute('data-index');
        const conv = convenios[index];
        
        if (confirm(`Deseja realmente excluir o convênio: "${conv.nome}"?`)) {
            convenios.splice(index, 1);
            localStorage.setItem("convenios", JSON.stringify(convenios));
            atualizarTabelaConvenios();
        }
      }
    });
    
    // =================================
    // INICIALIZAÇÃO
    // =================================
    atualizarTabelaConvenios();
  }
});


// =======================================================
// LÓGICA DA PÁGINA DASHBOARD
// =======================================================
document.addEventListener("DOMContentLoaded", () => {
  // Ponto de verificação - Só roda se estivermos no dashboard
  const agendaEl = document.getElementById("dashAgendaHoje");
  if (!agendaEl) {
    return;
  }

  // --- 1. CARREGAR TODOS OS DADOS ---
  const pacientes = JSON.parse(localStorage.getItem("pacientes")) || [];
  const agendamentos = JSON.parse(localStorage.getItem("agendamentos")) || [];
  const orcamentos = JSON.parse(localStorage.getItem("orcamentos")) || [];
  const financeiro = JSON.parse(localStorage.getItem("financeiro")) || [];
  const estoque = JSON.parse(localStorage.getItem("estoque")) || [];

  // Função helper para formatar moeda
  const formatarMoeda = (valor) => {
    return (valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  // --- 2. ATUALIZAR OS CARDS ---

  // Card Pacientes
  const totalPacientesEl = document.getElementById("dashTotalPacientes");
  if(totalPacientesEl) totalPacientesEl.textContent = pacientes.length;

  // Card Orçamentos
  const totalOrcamentosEl = document.getElementById("dashOrcamentosAguardando");
  if(totalOrcamentosEl) {
    const aguardando = orcamentos.filter(o => o.status === "Aguardando Aprovação").length;
    totalOrcamentosEl.textContent = aguardando;
  }

  // Card Estoque (LÓGICA CORRIGIDA PARA INCLUIR VALIDADE)
  const estoqueBaixoEl = document.getElementById("dashEstoqueBaixo");
  if(estoqueBaixoEl) {
    
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0); // Zera a hora para comparar só a data

    const itensBaixos = estoque.filter(item => {
      const qtd = parseInt(item.quantidade);
      const min = parseInt(item.estoqueMinimo);
      
      // 1. Checa a quantidade
      if (qtd <= min) return true;

      // 2. Checa a validade
      if (item.validade) {
        const dataVal = new Date(item.validade);
        // Ajuste de fuso (adiciona 1 dia para datas UTC)
        const dataValAjustada = new Date(dataVal.getUTCFullYear(), dataVal.getUTCMonth(), dataVal.getUTCDate());
        
        if (dataValAjustada < hoje) {
          return true; // Está vencido
        }
      }
      return false; // Item está OK
    }).length;

    estoqueBaixoEl.textContent = itensBaixos;
    if (itensBaixos > 0) {
      estoqueBaixoEl.closest('.card').classList.add('border-danger', 'border-3');
    }
  }

  // Card Financeiro (Recebido no Mês)
  const financeiroMesEl = document.getElementById("dashFinanceiroMes");
  if(financeiroMesEl) {
    const hoje = new Date();
    const mesAtual = hoje.getMonth();
    const anoAtual = hoje.getFullYear();

    const recebidoMes = financeiro
      .filter(t => {
        const dataTransacao = new Date(t.data);
        return t.tipo === 'entrada' &&
               dataTransacao.getUTCMonth() === mesAtual &&
               dataTransacao.getUTCFullYear() === anoAtual;
      })
      .reduce((acc, t) => acc + (parseFloat(t.valor) || 0), 0);
      
    financeiroMesEl.textContent = formatarMoeda(recebidoMes);
  }

  // --- 3. ATUALIZAR A AGENDA DO DIA ---
  const hojeString = new Date().toISOString().split('T')[0];
  const agendaHoje = agendamentos
    .filter(a => a.data === hojeString && a.status !== 'Cancelado' && a.status !== 'Não Compareceu')
    .sort((a, b) => (a.hora || "00:00").localeCompare(b.hora || "00:00"));

  if (agendaHoje.length === 0) {
    document.getElementById("dashAgendaHojeVazio").style.display = "block";
  } else {
    agendaHoje.forEach(ag => {
      const statusTexto = ag.status || "Agendado";
      let statusClasse = "text-muted";
      if (statusTexto === "Confirmado") statusClasse = "text-success fw-bold";
      
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${ag.hora}</td>
        <td>${ag.paciente}</td>
        <td>${ag.dentista}</td>
        <td class="${statusClasse}">${statusTexto}</td>
      `;
      agendaEl.appendChild(tr);
    });
  }

  // --- 4. ATUALIZAR O GRÁFICO DE RECEITA ---
  const chartEl = document.getElementById("dashReceitaChart");
  if (chartEl && typeof Chart !== 'undefined') { // Verifica se Chart.js carregou
    const labels = [];
    const dataValores = [];
    
    // Calcula os últimos 7 dias
    for (let i = 6; i >= 0; i--) {
      const data = new Date();
      data.setDate(data.getDate() - i);
      
      const diaString = data.toISOString().split('T')[0];
      const diaLabel = data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
      labels.push(diaLabel);

      // Soma o valor para aquele dia
      const valorDia = financeiro
        .filter(t => t.tipo === 'entrada' && t.data === diaString)
        .reduce((acc, t) => acc + (parseFloat(t.valor) || 0), 0);
      
      dataValores.push(valorDia);
    }

    // Cria o gráfico
    new Chart(chartEl, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Receita Diária',
          data: dataValores,
          backgroundColor: 'rgba(25, 135, 84, 0.6)',
          borderColor: 'rgba(25, 135, 84, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function(context) {
                return formatarMoeda(context.raw);
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return formatarMoeda(value);
              }
            }
          }
        }
      }
    });
  }
});

// =======================================================
// LÓGICA DA PÁGINA DE DENTISTAS (VERSÃO FINAL COM ENDEREÇO)
// =======================================================
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("dentistaForm");
  const tabela = document.getElementById("tabelaDentistas");
  const editModalElement = document.getElementById('editDentistaModal');
  const editForm = document.getElementById('editDentistaForm');

  // Só executa se estiver na página de dentistas
  if (form && tabela && editModalElement) {
    
    // =================================
    // APLICANDO MÁSCARAS
    // =================================
    // Form Principal
    IMask(document.getElementById('croDentista'), { mask: 'aa-00000', prepare: str => str.toUpperCase() });
    IMask(document.getElementById('telefoneDentista'), { mask: '(00) 0000[0]-0000' });
    IMask(document.getElementById('cepDentista'), { mask: '00000-000' });
    IMask(document.getElementById('estadoDentista'), { mask: 'aa', prepare: str => str.toUpperCase() });

    // Modal de Edição
    IMask(document.getElementById('editCroDentista'), { mask: 'aa-00000', prepare: str => str.toUpperCase() });
    IMask(document.getElementById('editTelefoneDentista'), { mask: '(00) 0000[0]-0000' });
    IMask(document.getElementById('editCepDentista'), { mask: '00000-000' });
    IMask(document.getElementById('editEstadoDentista'), { mask: 'aa', prepare: str => str.toUpperCase() });

    // =================================
    // VARIÁVEIS PRINCIPAIS
    // =================================
    let dentistas = JSON.parse(localStorage.getItem("dentistas")) || [];

    // =================================
    // ATUALIZAR A TABELA
    // =================================
    const atualizarTabelaDentistas = () => {
      const tbody = tabela.querySelector("tbody");
      tbody.innerHTML = "";
      
      dentistas.forEach((d, i) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${d.nome}</td>
          <td>${d.especialidade || "-"}</td>
          <td>${d.cro || "-"}</td>
          <td>${d.telefone || "-"}</td>
          <td>
            <button class="btn btn-sm btn-info me-1 btn-editar-dent" data-index="${i}">Editar</button>
            <button class="btn btn-sm btn-danger btn-excluir-dent" data-index="${i}">Excluir</button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    };

    // =================================
    // FORMULÁRIO PRINCIPAL (SÓ ADICIONAR)
    // =================================
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const novoDentista = {
        nome: document.getElementById('nomeDentista').value.trim(),
        especialidade: document.getElementById('especialidade').value.trim(),
        cro: document.getElementById('croDentista').value.trim(),
        telefone: document.getElementById('telefoneDentista').value.trim(),
        cep: document.getElementById('cepDentista').value.trim(),
        logradouro: document.getElementById('logradouroDentista').value.trim(),
        numero: document.getElementById('numeroDentista').value.trim(),
        bairro: document.getElementById('bairroDentista').value.trim(),
        cidade: document.getElementById('cidadeDentista').value.trim(),
        estado: document.getElementById('estadoDentista').value.trim()
      };

      dentistas.push(novoDentista);
      localStorage.setItem("dentistas", JSON.stringify(dentistas));
      form.reset();
      atualizarTabelaDentistas();
    });

    // =================================
    // LÓGICA DO MODAL DE EDIÇÃO
    // =================================

    // Função para ABRIR o modal com os dados
    function abrirModalEdicaoDentista(index) {
      const d = dentistas[index];
      if (!d) return;

      // Preenche o formulário do modal
      // Aba 1
      document.getElementById('editNomeDentista').value = d.nome;
      document.getElementById('editEspecialidade').value = d.especialidade || "";
      document.getElementById('editCroDentista').value = d.cro || "";
      document.getElementById('editTelefoneDentista').value = d.telefone || "";
      // Aba 2
      document.getElementById('editCepDentista').value = d.cep || "";
      document.getElementById('editLogradouroDentista').value = d.logradouro || "";
      document.getElementById('editNumeroDentista').value = d.numero || "";
      document.getElementById('editBairroDentista').value = d.bairro || "";
      document.getElementById('editCidadeDentista').value = d.cidade || "";
      document.getElementById('editEstadoDentista').value = d.estado || "";
      
      document.getElementById('editDentistaIndex').value = index;
      
      // Abre o modal
      const editDentistaModal = new bootstrap.Modal(editModalElement);
      editDentistaModal.show();
    }

    // Listener para SALVAR o modal de edição
    editForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const index = document.getElementById('editDentistaIndex').value;
      if (index === null || index === undefined) return;

      const dentistaAtualizado = {
        nome: document.getElementById('editNomeDentista').value.trim(),
        especialidade: document.getElementById('editEspecialidade').value.trim(),
        cro: document.getElementById('editCroDentista').value.trim(),
        telefone: document.getElementById('editTelefoneDentista').value.trim(),
        cep: document.getElementById('editCepDentista').value.trim(),
        logradouro: document.getElementById('editLogradouroDentista').value.trim(),
        numero: document.getElementById('editNumeroDentista').value.trim(),
        bairro: document.getElementById('editBairroDentista').value.trim(),
        cidade: document.getElementById('editCidadeDentista').value.trim(),
        estado: document.getElementById('editEstadoDentista').value.trim()
      };

      // Atualiza no array
      dentistas[index] = dentistaAtualizado;

      // Salva, atualiza a tabela e fecha
      localStorage.setItem("dentistas", JSON.stringify(dentistas));
      atualizarTabelaDentistas();
      
      const modalInstance = bootstrap.Modal.getInstance(editModalElement);
      if (modalInstance) {
          modalInstance.hide();
      }
    });

    // =================================
    // LISTENER DE CLIQUES NA TABELA (EDITAR E EXCLUIR)
    // =================================
    tabela.addEventListener('click', function(e) {
      const target = e.target;

      // Botão EDITAR
      if (target.classList.contains('btn-editar-dent')) {
        const index = target.getAttribute('data-index');
        abrirModalEdicaoDentista(index);
      }
      
      // Botão EXCLUIR
      if (target.classList.contains('btn-excluir-dent')) {
        const index = target.getAttribute('data-index');
        const d = dentistas[index];
        
        if (confirm(`Deseja realmente excluir o dentista: "${d.nome}"?`)) {
            dentistas.splice(index, 1);
            localStorage.setItem("dentistas", JSON.stringify(dentistas));
            atualizarTabelaDentistas();
        }
      }
    });
    
    // =================================
    // INICIALIZAÇÃO
    // =================================
    atualizarTabelaDentistas();
  }
});

// =======================================================
// LÓGICA DA PÁGINA DE TRATAMENTOS
// =======================================================
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("tratamentoForm");
  const tabela = document.getElementById("tabelaTratamentos");
  const editModalElement = document.getElementById('editTratamentoModal');
  const editForm = document.getElementById('editTratamentoForm');

  // Só executa se estiver na página de tratamentos
  if (form && tabela && editModalElement) {
    
    const formatarMoeda = (valor) => (valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    // =================================
    // APLICANDO MÁSCARAS
    // =================================
    const valorMask = IMask(document.getElementById('valorTratamento'), {
      mask: 'R$ num',
      blocks: {
        num: { mask: Number, scale: 2, thousandsSeparator: '.', padFractionalZeros: true, radix: ',', mapToRadix: ['.'] }
      }
    });
    const editValorMask = IMask(document.getElementById('editValorTratamento'), {
      mask: 'R$ num',
      blocks: {
        num: { mask: Number, scale: 2, thousandsSeparator: '.', padFractionalZeros: true, radix: ',', mapToRadix: ['.'] }
      }
    });

    // =================================
    // VARIÁVEIS PRINCIPAIS
    // =================================
    let tratamentos = JSON.parse(localStorage.getItem("tratamentos")) || [];

    // =================================
    // ATUALIZAR A TABELA
    // =================================
    const atualizarTabelaTratamentos = () => {
      const tbody = tabela.querySelector("tbody");
      tbody.innerHTML = "";
      
      tratamentos.forEach((t, i) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${t.nome}</td>
          <td>${t.descricao || "-"}</td>
          <td>${formatarMoeda(t.valor)}</td>
          <td>
            <button class="btn btn-sm btn-info me-1 btn-editar-trat" data-index="${i}">Editar</button>
            <button class="btn btn-sm btn-danger btn-excluir-trat" data-index="${i}">Excluir</button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    };

    // =================================
    // FORMULÁRIO PRINCIPAL (SÓ ADICIONAR)
    // =================================
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const novoTratamento = {
        nome: document.getElementById('nomeTratamento').value.trim(),
        descricao: document.getElementById('descricaoTratamento').value.trim(),
        valor: parseFloat(valorMask.unmaskedValue)
      };

      tratamentos.push(novoTratamento);
      localStorage.setItem("tratamentos", JSON.stringify(tratamentos));
      form.reset();
      valorMask.value = "";
      atualizarTabelaTratamentos();
    });

    // =================================
    // LÓGICA DO MODAL DE EDIÇÃO
    // =================================

    // Função para ABRIR o modal com os dados
    function abrirModalEdicaoTratamento(index) {
      const t = tratamentos[index];
      if (!t) return;

      document.getElementById('editNomeTratamento').value = t.nome;
      document.getElementById('editDescricaoTratamento').value = t.descricao || "";
      editValorMask.value = (t.valor || 0).toString().replace('.', ',');
      document.getElementById('editTratamentoIndex').value = index;
      
      const editTratamentoModal = new bootstrap.Modal(editModalElement);
      editTratamentoModal.show();
    }

    // Listener para SALVAR o modal de edição
    editForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const index = document.getElementById('editTratamentoIndex').value;
      if (index === null) return;

      const tratamentoAtualizado = {
        nome: document.getElementById('editNomeTratamento').value.trim(),
        descricao: document.getElementById('editDescricaoTratamento').value.trim(),
        valor: parseFloat(editValorMask.unmaskedValue)
      };

      tratamentos[index] = tratamentoAtualizado;
      localStorage.setItem("tratamentos", JSON.stringify(tratamentos));
      atualizarTabelaTratamentos();
      
      const modalInstance = bootstrap.Modal.getInstance(editModalElement);
      if (modalInstance) {
          modalInstance.hide();
      }
    });

    // =================================
    // LISTENER DE CLIQUES NA TABELA (EDITAR E EXCLUIR)
    // =================================
    tabela.addEventListener('click', function(e) {
      const target = e.target;
      // Botão EDITAR
      if (target.classList.contains('btn-editar-trat')) {
        const index = target.getAttribute('data-index');
        abrirModalEdicaoTratamento(index);
      }
      // Botão EXCLUIR
      if (target.classList.contains('btn-excluir-trat')) {
        const index = target.getAttribute('data-index');
        const t = tratamentos[index];
        if (confirm(`Deseja realmente excluir o tratamento: "${t.nome}"?`)) {
            tratamentos.splice(index, 1);
            localStorage.setItem("tratamentos", JSON.stringify(tratamentos));
            atualizarTabelaTratamentos();
        }
      }
    });
    
    // =================================
    // INICIALIZAÇÃO
    // =================================
    atualizarTabelaTratamentos();
  }
});