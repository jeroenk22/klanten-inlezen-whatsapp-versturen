import axios from "axios";

const API_URL = "http://api.textmebot.com/send.php";
const API_KEY = process.env.REACT_APP_TEXTME_API_KEY;

export async function sendMessage(message, recipient) {
  try {
    const encodedMessage = encodeURIComponent(message);
    const response = await axios.get(
      `${API_URL}?recipient=${recipient}&apikey=${API_KEY}&text=${encodedMessage}`
    );

    console.log(`Bericht verzonden naar ${recipient}:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Fout bij verzenden naar ${recipient}:`, error);
    throw error;
  }
}
