import Transaction from "@/components/Transaction";
import { withAuth } from "@/hoc/withAuth";
const TransactionsPage = () => {
  return <Transaction />;
};
export default withAuth(TransactionsPage);
