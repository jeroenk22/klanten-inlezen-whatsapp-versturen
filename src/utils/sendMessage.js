import axios from "axios";
import { API_URL } from "./constants";

export async function sendMessage(message, recipient) {
  try {
    const response = await axios.get(API_URL, {
      params: { recipient, message },
    });

    console.log(`Bericht verzonden naar ${recipient}:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Fout bij verzenden naar ${recipient}:`, error);
    throw error;
  }
}
