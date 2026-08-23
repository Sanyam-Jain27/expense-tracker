import Dashboard from "@/components/Dashboard";
import { withAuth } from "@/hoc/withAuth";

const App = () => {
  return <Dashboard />;
};

export default withAuth(App);
