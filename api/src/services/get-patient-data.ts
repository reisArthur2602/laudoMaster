import axios from "axios";

type Response = {
  idregistro: number;
  nomepaciente: string;
  telefone: string;
  nascimento: string;
  nomemedico: string;
  descricaoservico: string;
  cpf: string;
  telefone2: string;
  especialidade: string;
  idmedico: number;
};

const EXTERNAL_API_URL = process.env.EXTERNAL_API_URL!;

export const getPatientData = async (idregistro: string) => {
  const { data } = await axios.post<Response[]>(
    `${EXTERNAL_API_URL}/registro/idregistro`,
    { idregistro: [idregistro] }
  );

  return data[0] ?? null;
};
