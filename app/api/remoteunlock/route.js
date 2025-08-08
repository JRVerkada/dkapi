// app/api/remoteunlock/route.js
import { NextResponse } from 'next/server';

// --- In-memory cache for the Verkada Bearer Token ---
// This simple cache stores the token to avoid fetching a new one on every request.
// For production, consider a more robust caching solution like Redis.
let cachedToken = {
  value: null,
  expires: 0, // Expiry time stored in milliseconds since epoch
};

/**
 * Fetches a new Verkada bearer token or returns a cached one if still valid.
 * @returns {Promise<string>} The bearer token.
 * @throws {Error} If the API key is not set or if token fetching fails.
 */
async function getVerkadaToken() {
  const now = Date.now();

  // 1. Check if we have a valid, non-expired token in our cache
  if (cachedToken.value && now < cachedToken.expires) {
    console.log('Using cached Verkada token.');
    return cachedToken.value;
  }

  // 2. If the token is missing or expired, fetch a new one
  console.log('Fetching new Verkada token...');
  const apiKey = process.env.VERKADA_API_KEY;
  if (!apiKey) {
    throw new Error('VERKADA_API_KEY is not set in environment variables.');
  }

  const tokenUrl = 'https://api.verkada.com/token';
  const options = {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'x-api-key': apiKey,
    },
  };

  const response = await fetch(tokenUrl, options);
  
  if (!response.ok) {
    const errorData = await response.json();
    console.error('Failed to fetch Verkada token:', errorData);
    throw new Error('Could not authenticate with Verkada API.');
  }
  
  const tokenData = await response.json();

  // 3. Cache the new token and set its expiry time (29 minutes from now)
  // Verkada tokens are valid for 30 minutes. We cache for 29 to be safe.
  cachedToken = {
    value: tokenData.token,
    expires: now + 29 * 60 * 1000, // 29 minutes in milliseconds
  };
  
  console.log('Successfully fetched and cached new Verkada token.');
  return cachedToken.value;
}

/**
 * @swagger
 * /api/remoteunlock:
 * get:
 * summary: (TESTING ONLY) Unlocks a door with hardcoded values.
 * description: Triggers the Verkada remote unlock API with a hardcoded user_id and door_id for testing purposes.
 */
export async function GET(request) {
  try {
    // --- 1. Get Bearer Token ---
    const bearerToken = await getVerkadaToken();
    console.log(bearerToken)

    // --- 2. Use Hardcoded Values for Testing ---
    const user_id = '0c31511e-1259-4e29-bd28-5ef0c9de31aa';
    const door_id = 'b42cad91-3c5e-419a-92b6-c04caac9e067';

    // --- 3. Prepare and Send Request to Verkada API ---
    const verkadaUrl = 'https://api.verkada.com/access/v1/door/user_unlock';
    const options = {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'x-verkada-auth': bearerToken, // Use the bearer token for auth
      },
      body: JSON.stringify({ user_id, door_id }),
    };

    const verkadaResponse = await fetch(verkadaUrl, options);

    // --- 4. Handle Verkada's Response ---
    const responseData = await verkadaResponse.json();
    if (!verkadaResponse.ok) {
      console.error('Error from Verkada API (GET test):', responseData);
      return NextResponse.json(
        { error: 'Failed to unlock door during test.', details: responseData },
        { status: verkadaResponse.status }
      );
    }

    // --- 5. Return Success Response to Client ---
    return NextResponse.json(responseData, { status: 200 });

  } catch (err) {
    console.error('Error in GET /api/remoteunlock:', err.message);
    return NextResponse.json({ error: 'An internal server error occurred during the test.' }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/remoteunlock:
 * post:
 * summary: Unlocks a specific door using the Verkada API.
 * description: Receives a user_id and door_id, then sends a request to the Verkada remote unlock API endpoint.
 */
export async function POST(request) {
  try {
    // --- 1. Get Bearer Token ---
    const bearerToken = await getVerkadaToken();

    // --- 2. Parse Incoming Request Body ---
    const body = await request.json();
    const { user_id, door_id } = body;

    if (!user_id || !door_id) {
      return NextResponse.json({ error: 'Missing user_id or door_id in request body' }, { status: 400 });
    }

    // --- 3. Prepare and Send Request to Verkada API ---
    const verkadaUrl = 'https://api.verkada.com/access/v1/door/user_unlock';
    const options = {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'authorization': `Bearer ${bearerToken}`, // Use the bearer token for auth
      },
      body: JSON.stringify({ user_id, door_id }),
    };

    const verkadaResponse = await fetch(verkadaUrl, options);

    // --- 4. Handle Verkada's Response ---
    const responseData = await verkadaResponse.json();
    if (!verkadaResponse.ok) {
      console.error('Error from Verkada API:', responseData);
      return NextResponse.json(
        { error: 'Failed to unlock door.', details: responseData },
        { status: verkadaResponse.status }
      );
    }

    // --- 5. Return Success Response to Client ---
    return NextResponse.json(responseData, { status: 200 });

  } catch (err) {
    console.error('Error in POST /api/remoteunlock:', err.message);
    return NextResponse.json({ error: 'An internal server error occurred.' }, { status: 500 });
  }
}
