export const formatStudyStatus = (status: string): string => {
  switch (status) {
    case "PENDING":
      return "Aguardando Laudo";
    case "REPORTING":
      return "Em Análise";
    case "REPORTED":
      return "Aguardando Retirada";
    case "DELIVERED":
      return "Entregue ao Paciente";
    default:
      return "Desconhecido";
  }
};
