import { GoogleOAuthProvider, GoogleLogin, googleLogout } from '@react-oauth/google';
import { useState } from 'react';
import { jwtDecode } from 'jwt-decode';

function App() {
  const [user, setUser] = useState(null);

  return (
    <GoogleOAuthProvider clientId="403542997797-lep7mbkmmnlqbgk5c6acsh82nqrseqgn.apps.googleusercontent.com">
      <div style={{ padding: 20 }}>
        <h1>Google Login with Cloud Console</h1>
        {user ? (
          <div>
            <p>Welcome, {user.name}</p>
            <img src={user.picture} alt="User" width={50} />
            <br />
            <button
              onClick={() => {
                googleLogout();
                setUser(null);
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              const decoded = jwtDecode(credentialResponse.credential);
              setUser(decoded);
            }}
            onError={() => {
              console.log('Login Failed');
            }}
          />
        )}
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;
