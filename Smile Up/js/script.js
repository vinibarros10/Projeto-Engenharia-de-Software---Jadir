// Simulação de login
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


// Lógica da Página de Pacientes (VERSÃO FINAL CORRIGIDA)
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("pacienteForm");
  const tabela = document.getElementById("tabelaPacientes");
  
  // Elementos dos Modais
  const editModalElement = document.getElementById('editPacienteModal');
  const atestadoModalElement = document.getElementById('atestadoModal');
  const anamneseModalElement = document.getElementById('anamneseModal');

  // VERIFICAÇÃO FINAL: Só executa se TODOS os elementos da página de pacientes existirem
  if (form && tabela && editModalElement && atestadoModalElement && anamneseModalElement) {
    
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
      mask: 'aa', // Corrigido de AA para aa
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
      mask: 'aa', // Corrigido de AA para aa
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
      pacientes.forEach((p, i) => {
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
          <button class="btn btn-primary btn-sm me-1 btn-editar" data-index="${i}">Editar</button>
          <button class="btn btn-danger btn-sm me-1 btn-excluir" data-index="${i}">Excluir</button>
          <button class="btn btn-success btn-sm me-1 btn-anamnese" data-index="${i}">Ver Anamnese</button>
          <button class="btn btn-warning btn-sm btn-atestado" data-index="${i}">Atestado</button>
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
      
      // Coleta os dados do formulário principal
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

      // Apenas adiciona o novo paciente
      pacientes.push(novoPaciente); 

      localStorage.setItem("pacientes", JSON.stringify(pacientes)); // Salva
      form.reset(); // Limpa o formulário
      atualizarTabela(); // Atualiza a tabela
    });

    // =================================
    // LÓGICA DO MODAL DE EDIÇÃO (CORRIGIDO)
    // =================================
    
    // Pega os elementos do novo modal
    const editForm = document.getElementById('editPacienteForm');

    // Função para ABRIR e PREENCHER o modal
    function abrirModalEdicao(index) {
      const paciente = pacientes[index];
      if (!paciente) return;

      // Preenche todos os campos do modal
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
      
      // Guarda o índice no campo escondido
      document.getElementById('editIndex').value = index;
      
      // Inicializa e mostra o modal SÓ AGORA
      const editPacienteModal = new bootstrap.Modal(editModalElement);
      editPacienteModal.show();
    }

    // Listener para SALVAR o formulário do modal
    if (editForm) {
      editForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Pega o índice que guardamos
        const index = document.getElementById('editIndex').value;

        // Pega os dados atualizados do modal
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

        // Atualiza o paciente no array
        pacientes[index] = pacienteAtualizado;

        // Salva, atualiza a tabela e fecha o modal
        localStorage.setItem("pacientes", JSON.stringify(pacientes));
        atualizarTabela();
        
        // Pega a instância do modal e fecha
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

    // Função para gerar o HTML da impressão
    function gerarImpressaoAtestado(pacienteNome, motivo, dias, horaInicio, horaFim) {
      const hoje = new Date();
      const dataLocal = hoje.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
      const cid = "N/A"; 
      
      let textoAtestado = "";
      const diasNum = parseInt(dias) || 0;

      if (diasNum > 0) {
        // 1. Atestado de DIA(S)
        textoAtestado = `
          <p>Atesto para os devidos fins que o(a) Sr(a) <strong>${pacienteNome}</strong>, esteve sob meus cuidados profissionais na data de hoje, devendo afastar-se de suas atividades por <strong>${diasNum} dia(s)</strong> a partir desta data.</p>
          <p>Motivo: ${motivo}</p>
          <p>CID: ${cid}</p>
        `;
      } else if (horaInicio && horaFim) {
        // 2. Atestado de COMPARECIMENTO (com intervalo)
        textoAtestado = `
          <p>Atesto para os devidos fins que o(a) Sr(a) <strong>${pacienteNome}</strong>, esteve sob meus cuidados profissionais na data de hoje, no período das <strong>${horaInicio}</strong> às <strong>${horaFim}</strong>.</p>
          <p>Motivo: ${motivo}</p>
        `;
      } else {
        // 3. Atestado de COMPARECIMENTO (simples)
        textoAtestado = `
          <p>Atesto para os devidos fins que o(a) Sr(a) <strong>${pacienteNome}</strong>, esteve sob meus cuidados profissionais na data de hoje.</p>
          <p>Motivo: ${motivo}</p>
        `;
      }

      // O HTML de impressão continua o mesmo
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
              <p>Dr. Carlos / Dra. Beatriz / Dr. Miguel</p>
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

      // Abre a janela de impressão
      const printWindow = window.open('', '', 'height=600,width=800');
      printWindow.document.write(htmlConteudo);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    }

    // Função para ABRIR o modal de atestado
    function abrirModalAtestado(index) {
      const paciente = pacientes[index];
      if (!paciente) return;

      document.getElementById('atestadoPacienteNome').value = paciente.nome;
      document.getElementById('atestadoData').value = new Date().toLocaleDateString('pt-BR');
      document.getElementById('atestadoMotivo').value = "Compareceu a esta consulta odontológica.";
      document.getElementById('atestadoDias').value = 0;
      document.getElementById('atestadoHoraInicio').value = ""; // Limpa o campo
      document.getElementById('atestadoHoraFim').value = "";   // Limpa o campo

      const atestadoModal = new bootstrap.Modal(atestadoModalElement);
      atestadoModal.show();
    }

    // Listener para GERAR o atestado
    if (atestadoForm) {
      atestadoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const pacienteNome = document.getElementById('atestadoPacienteNome').value;
        const motivo = document.getElementById('atestadoMotivo').value;
        const dias = document.getElementById('atestadoDias').value;
        const horaInicio = document.getElementById('atestadoHoraInicio').value; // Pega a Hora Início
        const horaFim = document.getElementById('atestadoHoraFim').value;     // Pega a Hora Fim

        gerarImpressaoAtestado(pacienteNome, motivo, dias, horaInicio, horaFim); // Passa os novos valores

        const modalInstance = bootstrap.Modal.getInstance(atestadoModalElement);
        if (modalInstance) {
          modalInstance.hide();
        }
      });
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

      // Botão VER ANAMNESE
      if (e.target.classList.contains('btn-anamnese')) {
        const index = e.target.getAttribute('data-index');
        const paciente = pacientes[index];
        
        const modalTitle = document.getElementById('anamneseModalLabel');
        const modalBody = document.getElementById('anamneseModalBody');
        
        modalTitle.textContent = "Anamnese de: " + paciente.nome;
        modalBody.textContent = paciente.anamnese || 'Nenhuma anamnese cadastrada.';
        
        const anamneseModal = new bootstrap.Modal(anamneseModalElement);
        anamneseModal.show();
      }

      // Botão ATESTADO
      if (e.target.classList.contains('btn-atestado')) {
        const index = e.target.getAttribute('data-index');
        abrirModalAtestado(index);
      }
    });
    
    // =================================
    // INICIALIZAÇÃO
    // =================================
    atualizarTabela();

  } // <-- Fim do 'if (form && tabela && ...)'
}); // <-- Fim do 'DOMContentLoaded' para Pacientes


// Lógica da Página de Agendamentos (COM ORDENAÇÃO CORRIGIDA)
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("agendamentoForm");
  const tabela = document.getElementById("tabelaAgendamentos");
  const selectPacientesForm = document.getElementById("pacienteSelect");
  const selectDentistaForm = document.getElementById("dentistaSelect");

  // Filtros
  const filtroDataEl = document.getElementById("filtroData");
  const filtroDentistaEl = document.getElementById("filtroDentista");
  
  // Elementos do Modal de Edição
  const editModalElement = document.getElementById('editAgendamentoModal');
  const editForm = document.getElementById('editAgendamentoForm');
  const editPacienteSelect = document.getElementById('editAgPacienteSelect');
  const editDentistaSelect = document.getElementById('editAgDentistaSelect');

  // Só executa se estiver na página de agendamentos
  if (form && tabela && selectPacientesForm && filtroDataEl && editModalElement) {
    
    // =================================
    // INICIALIZAÇÃO E CARGA DE DADOS
    // =================================
    const pacientes = JSON.parse(localStorage.getItem("pacientes")) || [];
    let agendamentos = JSON.parse(localStorage.getItem("agendamentos")) || []; // DATA IS LOADED HERE

    // 1. Carregar Pacientes nos Dropdowns
    pacientes.forEach(p => {
      const option = new Option(p.nome, p.nome);
      selectPacientesForm.appendChild(option.cloneNode(true));
      editPacienteSelect.appendChild(option.cloneNode(true));
    });

    // 2. Carregar Dentistas nos Dropdowns
    Array.from(selectDentistaForm.options).forEach(opt => {
      filtroDentistaEl.appendChild(opt.cloneNode(true));
      editDentistaSelect.appendChild(opt.cloneNode(true));
    });

    // =================================
    // ATUALIZAR TABELA
    // =================================
    const atualizarTabelaAgendamentos = () => {
      const tbody = tabela.querySelector("tbody");
      tbody.innerHTML = "";

      const dataFiltro = filtroDataEl.value;
      const dentistaFiltro = filtroDentistaEl.value;

      // Mapeia para incluir o índice original antes de filtrar
      const agendamentosMapeados = agendamentos.map((ag, index) => ({
          ...ag,
          originalIndex: index // Guarda o índice real do array
      }));

      // Filtra os agendamentos
      const agendamentosFiltrados = agendamentosMapeados.filter(ag => {
        let passouData = true;
        let passouDentista = true;

        if (dataFiltro) {
          passouData = (ag.data === dataFiltro);
        }
        if (dentistaFiltro) {
          passouDentista = (ag.dentista === dentistaFiltro);
        }
        return passouData && passouDentista;
      });
      
      // ▼▼ CORREÇÃO APLICADA AQUI ▼▼
      // Ordenação segura: Trata 'hora' como "00:00" se estiver faltando
      agendamentosFiltrados.sort((a, b) => (a.hora || "00:00").localeCompare(b.hora || "00:00"));

      agendamentosFiltrados.forEach((ag) => {
        const dataFormatada = (ag.data) 
          ? new Date(ag.data).toLocaleDateString("pt-BR", { timeZone: 'UTC' })
          : "-";
        
        // Corrige o bug "undefined" de agendamentos antigos
        const statusTexto = ag.status || "Agendado"; 
        const tipoTexto = ag.tipoConsulta || "-";
        const horaTexto = ag.hora || "-"; // <-- Garante que a hora apareça

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
      atualizarTabelaAgendamentos();
    });

    // =================================
    // LÓGICA DO MODAL DE EDIÇÃO
    // =================================

    // Função para ABRIR o modal com os dados
    function abrirModalEdicaoAgendamento(index) {
      const ag = agendamentos[index];
      if (!ag) return;

      // Preenche o formulário do modal
      document.getElementById('editAgPacienteSelect').value = ag.paciente;
      document.getElementById('editAgDentistaSelect').value = ag.dentista;
      document.getElementById('editAgData').value = ag.data;
      document.getElementById('editAgHora').value = ag.hora || "";
      document.getElementById('editAgTipoConsulta').value = ag.tipoConsulta || "";
      document.getElementById('editAgStatus').value = ag.status || "Agendado";
      document.getElementById('editAgObservacoes').value = ag.observacoes || "";
      
      // Guarda o índice
      document.getElementById('editAgendamentoIndex').value = index;
      
      // Abre o modal (INICIALIZA SÓ AGORA)
      const editAgendamentoModal = new bootstrap.Modal(editModalElement);
      editAgendamentoModal.show();
    }

    // Listener para SALVAR o modal de edição
    editForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const index = document.getElementById('editAgendamentoIndex').value;
      if (index === null || index === undefined) return;

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

      // Atualiza no array
      agendamentos[index] = agendamentoAtualizado;

      // Salva, atualiza a tabela e fecha
      localStorage.setItem("agendamentos", JSON.stringify(agendamentos));
      atualizarTabelaAgendamentos();
      
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
      if (target.classList.contains('btn-editar-ag')) {
        const index = target.getAttribute('data-index');
        abrirModalEdicaoAgendamento(index);
      }
      
      // Botão EXCLUIR
      if (target.classList.contains('btn-excluir-ag')) {
        const index = target.getAttribute('data-index');
        const ag = agendamentos[index];
        
        if (confirm(`Deseja realmente excluir o agendamento de ${ag.paciente}?`)) {
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
        // Pega a data do filtro (ou hoje, se estiver vazio)
        let dataFiltro = filtroDataEl.value;
        if (!dataFiltro) {
          dataFiltro = new Date().toISOString().split('T')[0];
        }

        // Filtra os agendamentos daquele dia
        const agendamentosDoDia = agendamentos.filter(ag => 
            ag.data === dataFiltro && 
            ag.status !== "Cancelado" && 
            ag.status !== "Confirmado"
        );

        if (agendamentosDoDia.length === 0) {
          alert("Nenhum paciente para lembrar no dia selecionado.");
          return;
        }

        // Simulação de envio
        alert(`Simulação:\n\nEnviando ${agendamentosDoDia.length} lembretes para os pacientes do dia ${new Date(dataFiltro).toLocaleDateString("pt-BR", { timeZone: 'UTC' })}.`);
        
        // (Opcional) Poderíamos mudar o status para "Confirmado" aqui
      });
    }

    // =================================
    // INICIALIZAÇÃO
    // =================================
    filtroDataEl.addEventListener('change', atualizarTabelaAgendamentos);
    filtroDentistaEl.addEventListener('change', atualizarTabelaAgendamentos);
    
    atualizarTabelaAgendamentos(); // Carrega a tabela inicial
  }
});


// Lógica da Página Financeiro (ATUALIZADA COM MODAL DE EDIÇÃO E CONVÊNIOS)
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


  // Só executa se estiver na página financeira
  if (form && tabela && selectPacientes && editModalElement) {

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
    // ATUALIZAR TABELA E CARDS
    // =================================
    const atualizarFinanceiro = () => {
      const tbody = tabela.querySelector("tbody");
      tbody.innerHTML = "";
      
      let totalEntradas = 0;
      let totalSaidas = 0;
      
      transacoes.sort((a, b) => new Date(a.data) - new Date(b.data));

      transacoes.forEach((tr, i) => {
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
            <button class="btn btn-sm btn-info me-1 btn-editar-fin" data-index="${i}">Editar</button>
            <button class="btn btn-sm btn-danger btn-excluir-fin" data-index="${i}">Excluir</button>
          </td>
        `;
        tbody.appendChild(row);
      });

      // Atualiza os cards de resumo
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
      atualizarFinanceiro();
    });

    // =================================
    // LÓGICA DO MODAL DE EDIÇÃO
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
    // INICIALIZAÇÃO
    // =================================
    atualizarFinanceiro();
  }
});

// Lógica da Página Estoque (ATUALIZADA COM MODAL DE EDIÇÃO)
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

// Lógica da Página Orçamentos (CORRIGIDO PARA NÃO QUEBRAR OUTRAS PÁGINAS)
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("orcamentoForm");
  const tabela = document.getElementById("tabelaOrcamentos");
  const selectPacientes = document.getElementById("pacienteSelectOrc");

  // Elementos do Modal de Edição
  const editModalElement = document.getElementById('editOrcamentoModal');
  const editForm = document.getElementById('editOrcamentoForm');
  const editPacienteSelect = document.getElementById('editPacienteSelectOrc');

  // Só executa se estiver na página de orçamentos
  if (form && tabela && selectPacientes && editModalElement) {
    
    // =================================
    // APLICANDO MÁSCARA DE MOEDA (Formulário Principal)
    // =================================
    const valorOrcamentoMask = IMask(document.getElementById('valorOrcamento'), {
      mask: 'R$ num',
      blocks: {
        num: { mask: Number, scale: 2, thousandsSeparator: '.', padFractionalZeros: true, radix: ',', mapToRadix: ['.'] }
      }
    });

    // =================================
    // APLICANDO MÁSCARA DE MOEDA (Modal de Edição)
    // =================================
    const editValorOrcamentoMask = IMask(document.getElementById('editValorOrcamento'), {
      mask: 'R$ num',
      blocks: {
        num: { mask: Number, scale: 2, thousandsSeparator: '.', padFractionalZeros: true, radix: ',', mapToRadix: ['.'] }
      }
    });

    // =================================
    // CARREGAR DADOS
    // =================================
    const pacientes = JSON.parse(localStorage.getItem("pacientes")) || [];
    let orcamentos = JSON.parse(localStorage.getItem("orcamentos")) || [];

    // 1. Carregar Pacientes nos Dropdowns (Formulário Principal E Modal)
    pacientes.forEach(p => {
      const option = new Option(p.nome, p.nome);
      selectPacientes.appendChild(option.cloneNode(true));
      editPacienteSelect.appendChild(option.cloneNode(true));
    });

    // Função para formatar moeda
    const formatarMoeda = (valor) => {
      return (valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    // =================================
    // ATUALIZAR TABELA
    // =================================
    const atualizarTabelaOrcamentos = () => {
      const tbody = tabela.querySelector("tbody");
      tbody.innerHTML = "";
      
      orcamentos.sort((a, b) => new Date(a.data) - new Date(b.data));

      orcamentos.forEach((orc, i) => {
        const dataFormatada = orc.data 
          ? new Date(orc.data).toLocaleDateString("pt-BR", { timeZone: 'UTC' }) 
          : "-";
        
        const valorFormatado = formatarMoeda(orc.valor);
        const statusTexto = orc.status || "Aguardando Aprovação";
        const servicosTexto = (orc.servicos || "-").substring(0, 30) + (orc.servicos && orc.servicos.length > 30 ? "..." : "");

        let statusClasse = "text-muted";
        if (statusTexto === "Aprovado") statusClasse = "text-success fw-bold";
        if (statusTexto === "Recusado") statusClasse = "text-danger fw-bold";
        if (statusTexto === "Aguardando Aprovação") statusClasse = "text-warning fw-bold";

        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${orc.paciente || "-"}</td>
          <td>${dataFormatada}</td>
          <td>${valorFormatado}</td>
          <td class="${statusClasse}">${statusTexto}</td>
          <td>${servicosTexto}</td>
          <td>
            <button class="btn btn-sm btn-info me-1 btn-editar-orc" data-index="${i}">Editar</button>
            <button class="btn btn-sm btn-secondary me-1 btn-imprimir-orc" data-index="${i}">Imprimir</button>
            <button class="btn btn-sm btn-danger btn-excluir-orc" data-index="${i}">Excluir</button>
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
      
      let data = form.dataOrcamento.value;
      if (!data) {
        data = new Date().toISOString().split('T')[0];
      }
      
      const valorLimpo = valorOrcamentoMask.unmaskedValue; // Pega só os números

      const novoOrcamento = {
        paciente: form.pacienteSelectOrc.value,
        data: data,
        servicos: form.servicosOrcamento.value.trim(),
        valor: parseFloat(valorLimpo),
        status: form.statusOrcamento.value
      };
      
      orcamentos.push(novoOrcamento);
      localStorage.setItem("orcamentos", JSON.stringify(orcamentos));
      form.reset();
      valorOrcamentoMask.value = '';
      form.pacienteSelectOrc.value = "";
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
      document.getElementById('editPacienteSelectOrc').value = orc.paciente;
      document.getElementById('editDataOrcamento').value = orc.data;
      document.getElementById('editServicosOrcamento').value = orc.servicos || "";
      document.getElementById('editStatusOrcamento').value = orc.status || "Aguardando Aprovação";
      
      // Define o valor no iMask
      editValorOrcamentoMask.value = (orc.valor || 0).toString().replace('.', ',');

      // Guarda o índice
      document.getElementById('editOrcamentoIndex').value = index;
      
      // Abre o modal (INICIALIZA SÓ AGORA)
      const editOrcamentoModal = new bootstrap.Modal(editModalElement);
      editOrcamentoModal.show();
    }

    // Listener para SALVAR o modal de edição
    editForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const index = document.getElementById('editOrcamentoIndex').value;
      if (index === null || index === undefined) return;

      // Pega o valor limpo da máscara do modal
      const valorLimpoEdit = editValorOrcamentoMask.unmaskedValue;

      // Monta o objeto atualizado
      const orcamentoAtualizado = {
        paciente: document.getElementById('editPacienteSelectOrc').value,
        data: document.getElementById('editDataOrcamento').value,
        servicos: document.getElementById('editServicosOrcamento').value.trim(),
        valor: parseFloat(valorLimpoEdit),
        status: document.getElementById('editStatusOrcamento').value
      };

      // Atualiza no array
      orcamentos[index] = orcamentoAtualizado;

      // Salva, atualiza a tabela e fecha
      localStorage.setItem("orcamentos", JSON.stringify(orcamentos));
      atualizarTabelaOrcamentos();
      
      // Pega a instância e fecha
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
      const valorFormatado = formatarMoeda(orc.valor);

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
              .servicos { margin-top: 20px; }
              .servicos h3 { border-bottom: 1px solid #ccc; padding-bottom: 5px; }
              .total { text-align: right; margin-top: 30px; font-size: 1.2em; font-weight: bold; }
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
                <p><strong>Data:</strong> ${dataFormatada}</p>
                <p><strong>Status:</strong> ${orc.status}</p>
              </div>

              <div class="servicos">
                <h3>Serviços / Procedimentos</h3>
                <pre style="white-space: pre-wrap; font-family: inherit;">${orc.servicos || "N/A"}</pre>
              </div>

              <div class="total">
                <p>Valor Total: ${valorFormatado}</p>
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
      
      // Espera um pouco para a imagem da logo carregar
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

      // Botão EDITAR
      if (target.classList.contains('btn-editar-orc')) {
        const index = target.getAttribute('data-index');
        abrirModalEdicaoOrcamento(index);
      }

      // Botão IMPRIMIR
      if (target.classList.contains('btn-imprimir-orc')) {
        const index = target.getAttribute('data-index');
        const orc = orcamentos[index];
        gerarImpressaoOrcamento(orc);
      }
      
      // Botão EXCLUIR
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
  }
});


// LÓGICA DA PÁGINA DE CONVÊNIOS (CORRIGIDO)
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