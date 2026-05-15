import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { useJourneyStore } from "@/lib/state/useJourneyStore";
import { CreateJourney } from "@/pages/CreateJourney";
import { Dashboard } from "@/pages/Dashboard";
import NotFound from "@/pages/not-found";
import "@/styles/globals.css";

function EmberRouter() {
  const [, navigate] = useLocation();
  const { activeJourneyId } = useJourneyStore();

  if (!activeJourneyId) {
    return <CreateJourney onCreated={() => navigate("/dashboard")} />;
  }

  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/dashboard" component={Dashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <div className="mobile-container">
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <EmberRouter />
      </WouterRouter>
    </div>
  );
}

export default App;
