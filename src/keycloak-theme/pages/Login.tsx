import { useState, type FormEventHandler } from "react";
import { clsx } from "keycloakify/lib/tools/clsx";
import { useConstCallback } from "keycloakify/lib/tools/useConstCallback";
import type { PageProps } from "keycloakify/lib/KcProps";
import type { KcContext } from "../kcContext";
import type { I18n } from "../i18n";
import {
  Checkbox, Box, Button,
  Link, TextField, Typography,
  FormControlLabel
} from "@mui/material";
import PasswordTextField from "keycloak-theme/shared-components/password-text-field";

export default function Login(props: PageProps<Extract<KcContext, { pageId: "login.ftl"; }>, I18n>) {
  const { kcContext, i18n, doFetchDefaultThemeResources = true, Template, ...kcProps } = props;

  const { social, realm, url,
    usernameEditDisabled, login,
    auth, registrationDisabled
  } = kcContext;

  const { msg, msgStr } = i18n;

  const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false);

  const onSubmit = useConstCallback<FormEventHandler<HTMLFormElement>>(e => {
    e.preventDefault();

    setIsLoginButtonDisabled(true);

    const formElement = e.target as HTMLFormElement;

    //NOTE: Even if we login with email Keycloak expect username and password in
    //the POST request.
    formElement.querySelector("input[name='email']")?.setAttribute("name", "username");

    formElement.submit();
  });

  return (
    <Template
      {...{ kcContext, i18n, doFetchDefaultThemeResources, ...kcProps }}
      displayInfo={social.displayInfo}
      displayWide={realm.password && social.providers !== undefined}
      headerNode={
        <Typography sx={{ color: '#636466' }} variant="h2" component="span">
          {msg("doLogIn")}
        </Typography>
      }
      formNode={
        <div id="kc-form" className={clsx(realm.password && social.providers !== undefined && kcProps.kcContentWrapperClass)}>
          <div
            id="kc-form-wrapper"
            className={clsx(
              realm.password && social.providers && [kcProps.kcFormSocialAccountContentClass, kcProps.kcFormSocialAccountClass]
            )}
          >
            {realm.password && (
              <form id="kc-form-login" onSubmit={onSubmit} action={url.loginAction} method="post">
                <div className={clsx(kcProps.kcFormGroupClass)}>
                  {(() => {
                    const label = !realm.loginWithEmailAllowed
                      ? "username"
                      : realm.registrationEmailAsUsername
                        ? "email"
                        : "usernameOrEmail";

                    const autoCompleteHelper: typeof label = label === "usernameOrEmail" ? "username" : label;

                    return (
                      <>
                        <TextField
                          tabIndex={1}
                          id={autoCompleteHelper}
                          label={msg(label)}
                          sx={{ mb: 2 }}
                          InputLabelProps={{
                            sx: { fontSize: '16px' },
                          }}
                          InputProps={{
                            sx: { fontSize: '16px', borderRadius: '8px' },
                          }}
                          //NOTE: This is used by Google Chrome auto fill so we use it to tell
                          //the browser how to pre fill the form but before submit we put it back
                          //to username because it is what keycloak expects.
                          name={autoCompleteHelper}
                          defaultValue={login.username ?? ""}
                          type="text"
                          fullWidth
                          {...(usernameEditDisabled
                            ? { "disabled": true }
                            : {
                              "autoFocus": true,
                              "autoComplete": "off"
                            })}
                        />
                      </>
                    );
                  })()}
                </div>
                <PasswordTextField
                  tabIndex={2}
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  label={msg("password")}
                  autoComplete="off"
                  fullWidth
                />
                <div className={clsx(kcProps.kcFormGroupClass, kcProps.kcFormSettingClass)}>
                  <div id="kc-form-options">
                    {realm.rememberMe && !usernameEditDisabled && (
                      <FormControlLabel
                        sx={{display: 'flex', mt: 2.5 }}
                        label={<Typography fontSize="16px">{msg('rememberMe')}</Typography>}
                        control={(
                          <Checkbox
                            size="medium"
                            sx={{
                              fontSize: "16px",
                              svg:{
                                width: '2rem',
                                height: '2rem',
                              }
                            }}
                            tabIndex={-3}
                            id="rememberMe"
                            name="rememberMe"
                            {...(login.rememberMe ? { checked: true } : {})}
                          />
                        )}
                      />
                    )}
                  </div>
                  {realm.resetPasswordAllowed && (
                    <Typography
                      tabIndex={5}
                      href={url.loginResetCredentialsUrl}
                      gutterBottom
                      component={Link}
                      sx={{
                        mt: 3,
                        cursor: 'pointer',
                        color: '#72767b',
                        textDecorationColor: '#72767b',
                        fontSize: '16px',
                      }}
                    >
                      {msg("doForgotPassword")}
                    </Typography>
                  )}
                </div>
                <div id="kc-form-buttons" className={clsx(kcProps.kcFormGroupClass)}>
                  <input
                    type="hidden"
                    id="id-hidden-input"
                    name="credentialId"
                    {...(auth?.selectedCredential !== undefined
                      ? {
                        "value": auth.selectedCredential
                      }
                      : {})}
                  />
                  <Button
                    sx={{
                      borderRadius: '6px',
                      backgroundColor: '#005595',
                      color: 'white',
                      fontSize: 16,
                    }}
									  tabIndex={4}
                    variant="contained"
                    fullWidth
                    name="login"
                    id="kc-login"
                    type="submit"
                    value={msgStr("doLogIn")}
                    disabled={isLoginButtonDisabled}
                  >Sign In</Button>
                </div>
              </form>
            )}
          </div>
          {realm.password && social.providers !== undefined && (
            <div id="kc-social-providers" className={clsx(kcProps.kcFormSocialAccountContentClass, kcProps.kcFormSocialAccountClass)}>
              <ul
                className={clsx(
                  kcProps.kcFormSocialAccountListClass,
                  social.providers.length > 4 && kcProps.kcFormSocialAccountDoubleListClass
                )}
              >
                {social.providers.map(p => (
                  <li key={p.providerId} className={clsx(kcProps.kcFormSocialAccountListLinkClass)}>
                    <a href={p.loginUrl} id={`zocial-${p.alias}`} className={clsx("zocial", p.providerId)}>
                      <span>{p.displayName}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      }
      infoNode={
        realm.password
        && realm.registrationAllowed
        && !registrationDisabled && (
          <Box
            component="div"
            id="kc-registration"
            display="inline-flex"
            justifyContent="space-between"
            width="100%"
          >
            <Typography fontSize="16px">{msg('noAccount')}</Typography>
            <Typography
              component="a"
              fontSize="16px"
              tabIndex={6}
              href={url.registrationUrl}
              sx={{
                cursor: 'pointer',
                fontSize: '16px',
                color: 'rgb(17, 17, 17)',
              }}
            >
              {msg('doRegister')}
            </Typography>
          </Box>
        )
      }
    />
  );
}
