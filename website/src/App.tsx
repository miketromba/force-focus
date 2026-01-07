import "./index.css";
import { Router, Route } from "./components/Router";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { Privacy } from "./pages/Privacy";
import { Terms } from "./pages/Terms";
import { Support } from "./pages/Support";

export function App() {
  return (
    <Router>
      <Layout>
        <Route path="/" component={Home} />
        <Route path="/privacy" component={Privacy} />
        <Route path="/terms" component={Terms} />
        <Route path="/support" component={Support} />
      </Layout>
    </Router>
  );
}

export default App;
