const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1").replace(/\/$/, "");

function buildApiUrl(path: string) {
  return `${API_BASE_URL}${path}`;
}

export async function exchangeCodeForToken(code: string): Promise<string | null> {
  try {
    const response = await fetch(buildApiUrl('/auth/token'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    })

    if (!response.ok) {
      throw new Error('Failed to exchange authorization code')
    }

    const data = await response.json()

    // Expecting accessToken in response
    return data.accessToken ?? data.token ?? null
  } catch (error) {
    console.error('exchangeCodeForToken error:', error)
    return null
  }
}

export async function fetchUserProfile(token: string) {
  try {
    const response = await fetch(buildApiUrl('/auth/me'), {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch user profile')
    }

    return await response.json()
  } catch (error) {
    console.error('fetchUserProfile error:', error)
    throw error
  }
}

export async function getNewAccessToken() {
  // Example placeholder: retrieves token from localStorage or refresh using API
  try {
    const token = localStorage.getItem('accessToken')
    if (token) {
      return token
    }
    // Alternatively, implement refresh logic here if needed
    return null
  } catch (error) {
    console.error('getNewAccessToken error:', error)
    return null
  }
}

export async function loginUser(email: string, password: string) {
  try {
    const response = await fetch(buildApiUrl('/auth/login'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Failed to login');
    }

    return await response.json();
  } catch (error) {
    console.error('loginUser error:', error);
    throw error;
  }
}

export async function signupUser(email: string, password: string, name: string) {
  try {
    const response = await fetch(buildApiUrl('/auth/signup'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, name }),
    });

    if (!response.ok) {
      throw new Error('Failed to sign up');
    }

    return await response.json();
  } catch (error) {
    console.error('signupUser error:', error);
    throw error;
  }
}
