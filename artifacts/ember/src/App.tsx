import { useEffect } from "react";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { SignedIn, SignedOut, useAuth } from "@clerk/clerk-react";
import { setAuthTokenGetter } from "@workspace/api-client-react";
import { useJourneyStore } from "@/lib/state/useJourneyStore";
import { CreateJourney } from "@/pages/CreateJourney";
import { Dashboard } from "@/pages/Dashboard";
import { SignInScreen } from "@/pages/SignInScreen";
import { LoadingScreen } from "@/pages/LoadingScreen";
import NotFound from "@/pages/not-found";

function EmberRouter() {
  const [, navigate] = useLocation();
  const activeJourneyId = useJourneyStore((s) => s.activeJourneyId);

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

// Rendered only when signed in: attach the Clerk session token to API calls and
// load the user's journeys once before showing the app.
function AuthedApp() {
  const { getToken } = useAuth();
  const status = useJourneyStore((s) => s.status);
  const loadJourneys = useJourneyStore((s) => s.loadJourneys);

  useEffect(() => {
    setAuthTokenGetter(() => getToken());
  }, [getToken]);

  useEffect(() => {
    loadJourneys();
  }, [loadJourneys]);

  if (status === "loading") return <LoadingScreen />;

  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <EmberRouter />
    </WouterRouter>
  );
}

function App() {
  return (
    <div className="mobile-container">
      <SignedOut>
        <SignInScreen />
      </SignedOut>
      <SignedIn>
        <AuthedApp />
      </SignedIn>
    </div>
  );
}

export default App;
