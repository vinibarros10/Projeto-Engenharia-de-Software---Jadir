/* =======================================================
   SCRIPT DE DADOS DE DEMONSTRAÇÃO (SÓ RODA 1 VEZ)
   ======================================================= */
function rodarDemoData() {
  // Verifica se a página já foi "semeada"
  if (localStorage.getItem("pacientes")) {
    console.log("Sistema já populado. Demo-data não é necessário.");
    return;
  }
  console.log("PRIMEIRA VEZ! Populando sistema com dados de demonstração...");

  // --- 1. Pacientes ---
  const pacientes = [
    { nome: "João Silva", cpf: "111.222.333-44", telefone: "(11) 91234-5678", email: "joao.silva@email.com", nascimento: "1985-10-10", cep: "01000-000", logradouro: "Av. Principal", numero: "123", bairro: "Centro", cidade: "São Paulo", estado: "SP", anamnese: "Paciente relata alergia a penicilina. Nenhuma outra condição." },
    { nome: "Romário Farias", cpf: "222.333.444-55", telefone: "(21) 98765-4321", email: "romario@email.com", nascimento: "1990-03-15", cep: "20000-000", logradouro: "Rua da Praia", numero: "456", bairro: "Copacabana", cidade: "Rio de Janeiro", estado: "RJ", anamnese: "Paciente com histórico de pressão alta. Medicamento: Losartana." },
    { nome: "Ana Beatriz Costa", cpf: "333.444.555-66", telefone: "(31) 95555-1234", email: "ana.costa@email.com", nascimento: "2001-07-22", cep: "30000-000", logradouro: "Praça da Matriz", numero: "789", bairro: "Centro", cidade: "Belo Horizonte", estado: "MG", anamnese: "Nenhuma alergia relatada." }
  ];
  localStorage.setItem("pacientes", JSON.stringify(pacientes));

  // --- 2. Convênios ---
  const convenios = [
    { nome: "Bradesco Prime", cnpj: "11.222.333/0001-44", telefone: "(11) 2222-3333", observacoes: "Requer guia de autorização" },
    { nome: "Amil Dental", cnpj: "22.333.444/0001-55", telefone: "(11) 4444-5555", observacoes: "Cobrir procedimentos básicos" },
    { nome: "SulAmérica Odonto", cnpj: "33.444.555/0001-66", telefone: "(11) 6666-7777", observacoes: "" }
  ];
  localStorage.setItem("convenios", JSON.stringify(convenios));

  // --- 3. Estoque ---
  const estoque = [
    { nomeMaterial: "Luvas de Procedimento (Cx)", tipoMaterial: "Descartável", fornecedor: "DentalPlus", quantidade: 50, estoqueMinimo: 10, lote: "L1234", validade: "2026-10-31" },
    { nomeMaterial: "Resina Composta A2", tipoMaterial: "Restauração", fornecedor: "3M", quantidade: 8, estoqueMinimo: 5, lote: "R5566", validade: "2025-12-01" },
    { nomeMaterial: "Anestésico Lidocaína", tipoMaterial: "Insumo", fornecedor: "DentalPlus", quantidade: 15, estoqueMinimo: 20, lote: "A7788", validade: "2024-11-01" } // Item em estoque baixo
  ];
  localStorage.setItem("estoque", JSON.stringify(estoque));

  // --- 4. Orçamentos ---
  const orcamentos = [
    { paciente: "João Silva", data: "2025-11-01", servicos: "1x Limpeza\n2x Restauração Bloco A", valor: 550.00, status: "Aprovado" },
    { paciente: "Romário Farias", data: "2025-11-05", servicos: "1x Clareamento Dental", valor: 1200.00, status: "Aguardando Aprovação" },
    { paciente: "Ana Beatriz Costa", data: "2025-11-03", servicos: "Instalação de Aparelho Ortodôntico", valor: 2500.00, status: "Recusado" }
  ];
  localStorage.setItem("orcamentos", JSON.stringify(orcamentos));

  // --- 5. Financeiro (para o gráfico) ---
  const hoje = new Date();
  const diaString = (data) => data.toISOString().split('T')[0];
  
  const dataHoje = new Date();
  const dataMenos1 = new Date(hoje); dataMenos1.setDate(hoje.getDate() - 1);
  const dataMenos3 = new Date(hoje); dataMenos3.setDate(hoje.getDate() - 3);
  const dataMenos5 = new Date(hoje); dataMenos5.setDate(hoje.getDate() - 5);

  const financeiro = [
    // Entradas para o gráfico e cards
    { paciente: "João Silva", descricao: "Pagto. Limpeza (Ref. Orç #1)", formaPagamento: "PIX", tipo: "entrada", valor: 550, data: diaString(dataMenos5) },
    { paciente: "Romário Farias", descricao: "Sinal Clareamento", formaPagamento: "Dinheiro", tipo: "entrada", valor: 400, data: diaString(dataMenos3) },
    { paciente: "Ana Beatriz Costa", descricao: "Consulta de Avaliação", formaPagamento: "Cartão Débito/Crédito", tipo: "entrada", valor: 150, data: diaString(dataMenos1) },
    { paciente: "Amil Dental", descricao: "Repasse Mês 10/2025", formaPagamento: "Amil Dental", tipo: "entrada", valor: 850, data: diaString(dataMenos1) },
    // Saída
    { paciente: "", descricao: "Conta de Luz", formaPagamento: "PIX", tipo: "saida", valor: 320, data: diaString(dataMenos3) }
  ];
  localStorage.setItem("financeiro", JSON.stringify(financeiro));

  // --- 6. Agendamentos (Para o Dashboard de "Hoje") ---
  const agendamentos = [
    { paciente: "João Silva", dentista: "Dr. Carlos (Clínico Geral)", data: diaString(dataHoje), hora: "10:00", tipoConsulta: "Limpeza (retorno)", status: "Confirmado", observacoes: "Paciente com alergia a penicilina." },
    { paciente: "Romário Farias", dentista: "Dra. Beatriz (Ortodontista)", data: diaString(dataHoje), hora: "14:30", tipoConsulta: "Avaliação Clareamento", status: "Agendado", observacoes: "" },
    { paciente: "Ana Beatriz Costa", dentista: "Dr. Carlos (Clínico Geral)", data: diaString(dataMenos1), hora: "11:00", tipoConsulta: "Avaliação Inicial", status: "Finalizado", observacoes: "" }
  ];
  localStorage.setItem("agendamentos", JSON.stringify(agendamentos));
}

// Roda a função
rodarDemoData();