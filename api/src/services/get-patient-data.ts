import axios from "axios";
import https from "https";


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
const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

export const getPatientData = async (idregistro: string) => {
  const { data } = await axios.post<Response[]>(
    "https://200.100.100.14:8096/api/registro/idregistro",
    { idregistro: [idregistro] },
    { httpsAgent }
  );

  return data[0] ?? null;
};
