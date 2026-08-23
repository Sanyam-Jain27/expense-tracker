import axios from "axios";
import { APP_API_URL } from "@/utils/constants";

const fetchAllTransactions = async (token: string) => {
  try {
    const response = await axios.get(`${APP_API_URL}/transaction/get-alltransaction`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    console.log(response)
    return response?.data?.transaction || [];
  } catch (error) {
    console.error("ye here is problem:", error);
    throw error;
  }
};
export {fetchAllTransactions}
