import Expense from "@/components/Expense";
import { withAuth } from "@/hoc/withAuth";
const Expensepage =()=>{
    return <Expense/>
}
export default withAuth(Expensepage);