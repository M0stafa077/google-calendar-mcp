import { OAuth2Client } from 'google-auth-library';
import { OAuthCredentials } from './utils.js';

async function loadCredentialsWithFallback(): Promise<OAuthCredentials> {
  return {
    client_id: process.env.GOOGLE_CLIENT_ID || '',
    client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
    redirect_uris: [process.env.GOOGLE_REDIRECT_URI || '']
  }
}

export async function initializeOAuth2Client(): Promise<OAuth2Client> {
  // Always use real OAuth credentials - no mocking.
  // Unit tests should mock at the handler level, integration tests need real credentials.
  try {
    const credentials = await loadCredentialsWithFallback();
    
    // Use the first redirect URI as the default for the base client
    return new OAuth2Client({
      clientId: credentials.client_id,
      clientSecret: credentials.client_secret,
      redirectUri: credentials.redirect_uris[0],
      credentials: {
        access_token: process.env.GOOGLE_ACCESS_TOKEN || '',
        refresh_token: process.env.GOOGLE_REFRESH_TOKEN || '',
        id_token: process.env.GOOGLE_ID_TOKEN || '',
      }
    });
  } catch (error) {
    throw new Error(`Error loading OAuth keys: ${error instanceof Error ? error.message : error}`);
  }
}

export async function loadCredentials(): Promise<{ client_id: string; client_secret: string }> {
  return {
    client_id: process.env.GOOGLE_CLIENT_ID || '',
    client_secret: process.env.GOOGLE_CLIENT_SECRET || ''
  }
}