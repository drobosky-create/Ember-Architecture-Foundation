import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { useJourneyStore } from "@/lib/state/useJourneyStore";
import { CreateJourney } from "@/pages/CreateJourney";
import { Dashboard } from "@/pages/Dashboard";
import { SignInScreen } from "@/pages/SignInScreen";
import NotFound from "@/pages/not-found";

function EmberRouter() {
  const [, navigate] = useLocation();
  const { activeJourneyId } = useJourneyStore();

  if (!activeJourneyId) {
    return <CreateJourney onCreated={() => navigate("/")} />;
  }

  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <div className="mobile-container">
      <SignedOut>
        <SignInScreen />
      </SignedOut>
      <SignedIn>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <EmberRouter />
        </WouterRouter>
      </SignedIn>
    </div>
  );
}

export default App;
