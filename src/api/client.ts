import {
  PublicClientApplication,
  InteractionRequiredAuthError,
} from "@azure/msal-browser";

const clientId = import.meta.env.VITE_ENTRA_CLIENT_ID;
const tenant = import.meta.env.VITE_ENTRA_TENANT_ID;
const scope = import.meta.env.VITE_ENTRA_API_SCOPE;

const configured = Boolean(clientId && tenant && scope);
const redirectUri = `${window.location.origin}/redirect.html`;
const auth = configured
  ? new PublicClientApplication({
      auth: {
        clientId,
        // A specific tenant never accepts personal Microsoft accounts or users
        // from another directory. Entra app registration must be single-tenant.
        authority: `https://login.microsoftonline.com/${tenant}`,
        redirectUri,
      },
      cache: { cacheLocation: "sessionStorage" },
    })
  : null;

let authReady: Promise<void> | null = null;

/** Auto-detect the user's Eriez session before mounting any app content. */
export function initializeAuth(): Promise<void> {
  if (!authReady) {
    authReady = (async () => {
      if (!auth) {
        // Production must never silently become an unauthenticated SPA.
        if (import.meta.env.PROD) {
          throw new Error("Microsoft Entra authentication is not configured for this deployment.");
        }
        return;
      }
      await auth.initialize();
      const redirected = await auth.handleRedirectPromise();
      if (redirected?.account) auth.setActiveAccount(redirected.account);

      const account = auth.getActiveAccount() ?? auth.getAllAccounts()[0];
      if (account) {
        auth.setActiveAccount(account);
        return;
      }

      try {
        const response = await auth.ssoSilent({ scopes: [scope] });
        auth.setActiveAccount(response.account);
      } catch (error) {
        // Silent SSO can also fail on third-party-cookie/iframe restrictions.
        // A top-level redirect lets Entra reuse the company session even then.
        console.info("Silent Microsoft SSO unavailable; switching to Entra redirect.", error);
        // No app login page/button. Entra will reuse existing corporate SSO
        // when available, or enforce company MFA/Conditional Access as needed.
        await auth.loginRedirect({ scopes: [scope] });
        await new Promise<never>(() => {}); // Browser is navigating away.
      }
    })();
  }
  return authReady;
}

async function accessToken(): Promise<string | null> {
  await initializeAuth();
  if (!auth) return null; // Loopback development without Entra configuration.
  const account = auth.getActiveAccount();
  if (!account) throw new Error("Your Eriez Microsoft session is unavailable.");
  try {
    const response = await auth.acquireTokenSilent({ scopes: [scope], account });
    return response.accessToken;
  } catch (error) {
    if (!(error instanceof InteractionRequiredAuthError)) throw error;
    await auth.acquireTokenRedirect({ scopes: [scope], account });
    await new Promise<never>(() => {});
  }
  return null;
}

export async function api<T>(path: string, body?: unknown): Promise<T> {
  const token = await accessToken();
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`/api/${path}`, {
    method: body === undefined ? "GET" : "POST",
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
    signal: AbortSignal.timeout(120000),
  });
  const data = await response.json().catch(() => {
    throw new Error("The calculation service is unavailable. Please try again or contact your support team.");
  });
  if (!response.ok) throw new Error(data.error ?? "Request failed");
  return data as T;
}

export type Dataset = {
  id: string | number;
  range: string;
  model: string;
  temperature: string;
  file: string;
};

export type Profile = {
  name: string;
  distance: number[];
  gauss: number[];
  force: (number | null)[];
  lift: Record<string, number | null>;
  inputDistance?: number[];
  inputGauss?: number[];
  maxInput?: number;
};

export type Material = {
  material: string;
  density: number;
  densityImperial: number;
  surcharge: number;
  maxSlope: number;
};

export type Contour = {
  x: number[];
  y: number[];
  gauss: number[][];
  force: number[][];
  levels: Record<string, number>;
};