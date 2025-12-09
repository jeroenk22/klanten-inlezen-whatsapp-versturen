import axios from "axios";
import { API_TOKEN, API_URL } from "./constants";

export async function sendMessage(message, recipient) {
  try {
    const response = await axios.get(API_URL, {
      params: { recipient, message, token: API_TOKEN },
    });

    console.log(`Bericht verzonden naar ${recipient}:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Fout bij verzenden naar ${recipient}:`, error);
    throw error;
  }
}
