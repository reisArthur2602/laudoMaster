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


export const getPatientData = async (idregistro: string) => {
  const { data } = await axios.post<Response[]>(
    "https://servidorprincipal.no-ip.info:8096/api/registro/idregistro",
    { idregistro: [idregistro] }
  );

  return data[0] ?? null;
};
