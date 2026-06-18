import { useEffect, useState } from "react";
import App from "./App";
import { AnnotationPrdPage } from "./pages/AnnotationPrdPage";
import { FirstOpenPage } from "./pages/FirstOpenPage";

const ANNOTATION_ROUTE = "/annotation-prd";
const FIRST_OPEN_ROUTE = "/first-open";

function getRouteFromHash(hash: string) {
  return hash.replace(/^#/, "") || "/";
}

export default function AppRouter() {
  const [route, setRoute] = useState(() => getRouteFromHash(window.location.hash));

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(getRouteFromHash(window.location.hash));
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  if (route === ANNOTATION_ROUTE) {
    return <AnnotationPrdPage />;
  }

  if (route === FIRST_OPEN_ROUTE) {
    return <FirstOpenPage />;
  }

  return <App />;
}
