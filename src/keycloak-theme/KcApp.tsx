import "./KcApp.css";
import { lazy, Suspense } from "react";
import type { KcContext } from "./kcContext";
import { useI18n } from "./i18n";
import Fallback, { defaultKcProps, type KcProps, type PageProps } from "keycloakify";
import Template from "./Template";
import DefaultTemplate from "keycloakify/lib/Template";

const Login = lazy(()=> import("./pages/Login"));
// If you can, favor register-user-profile.ftl over register.ftl, see: https://docs.keycloakify.dev/realtime-input-validation
const Register = lazy(() => import("./pages/Register"));
const Terms = lazy(() => import("./pages/Terms"));
const Info = lazy(()=> import("keycloakify/lib/pages/Info"));

// This is like editing the theme.properties 
// https://github.com/keycloak/keycloak/blob/11.0.3/themes/src/main/resources/theme/keycloak/login/theme.properties
const kcProps: KcProps = {
  ...defaultKcProps,
  // NOTE: The classes are defined in ./KcApp.css
  // You can add your classes alongside thoses that are present in the default Keycloak theme...
  "kcHtmlClass": [...defaultKcProps.kcHtmlClass, "root-class"],
};

export default function App(props: { kcContext: KcContext; }) {

  const { kcContext } = props;

  const i18n = useI18n({ kcContext });

  //NOTE: Locales not yet downloaded
  if (i18n === null) {
    return null;
  }

  const pageProps: Omit<PageProps<any, typeof i18n>, "kcContext"> = {
    i18n,
    // Here we have overloaded the default template, however you could use the default one with:  
    //Template: DefaultTemplate,
    Template,
    // Wether or not we should download the CSS and JS resources that comes with the default Keycloak theme.  
    doFetchDefaultThemeResources: true,
    ...kcProps,
  };

  return (
    <Suspense>
      {(() => {
        switch (kcContext.pageId) {
        case "login.ftl": return <Login {...{ kcContext, ...pageProps }} />;
        case "register.ftl": return <Register {...{ kcContext, ...pageProps }} />;
        case "terms.ftl": return <Terms {...{ kcContext, ...pageProps }} />;
        case "info.ftl": return <Info {...{ kcContext, ...pageProps}} Template={DefaultTemplate} doFetchDefaultThemeResources={true} />;
        default: return <Fallback {...{ kcContext, ...pageProps }} />;
        }
      })()}
    </Suspense>
  );

}
