// src/http/lib/ftp-client.js
import ftp from "basic-ftp";

export async function getFtpClient() {
  const client = new ftp.Client();
  client.ftp.verbose = false;

  await client.access({
    host: process.env.FTP_HOST,
    user: process.env.FTP_USER,
    password: process.env.FTP_PASSWORD,
    secure: false,
  });

  return client;
}
