import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../AuthContext";
import axios from "axios";
import { useState } from "react";
import {
  Button,
  Form,
  Container,
  Card,
  Alert,
  Spinner,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
const LoginScreen = () => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  // Handle manual login
  const handleManualLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_MANUAL_SIGNIN}`,
        {
          email,
          password,
        }
      );
      signIn(response.data);
    } catch (error) {
      setPassword("");
      setError("Check your email or password");
    } finally {
      setLoading(false);
    }
  };

  // Handle Google login
  const handleGoogleLogin = async (user) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_LOGIN_API}`,
        {
          email: user.email,
          name: user.name,
          picture: user.photo,
          token: user.id,
        }
      );
      signIn(response.data);
    } catch (error) {
      setError("Google login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Container
        fluid
        className="d-flex justify-content-center align-items-center vh-100 bg-light"
      >
        <Card
          className="text-center shadow-lg p-5"
          style={{ width: "500px", borderRadius: "20px" }}
        >
          <Card.Body>
            <Card.Title className="mb-4 fs-3 fw-bold text-dark">
              Welcome To Ticketing System
            </Card.Title>
            <Card.Text className="mb-4 text-muted">
              Sign in with Google or use your account credentials
            </Card.Text>

            {/* Google Login */}
            <div className="d-flex justify-content-center mb-4">
              <GoogleLogin
                onSuccess={(credentialsResponse) => {
                  if (credentialsResponse.credential) {
                    const decodedToken = jwtDecode(credentialsResponse.credential);
                    const user = {
                      id: decodedToken.sub,
                      name: decodedToken.name,
                      email: decodedToken.email,
                      photo: decodedToken.picture,
                    };
                    handleGoogleLogin(user);
                  }
                }}
                onError={() => console.log("Error during login")}
                theme="filled_blue"
                shape="pill"
                text="signin_with"
                size="large"
                width="350"
              />
            </div>
            <div className="my-3">
              <span className="text-muted">or</span>
            </div>
            {/* Error Message */}
            
            {/* Manual Login */}
            <Form onSubmit={handleManualLogin}>
              <Form.Group controlId="email" className="mb-3">
                <Form.Control
                  type="email"
                  className={`${error ? 'is-invalid' : ''}`}
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError("") }}
                  required
                  style={{ borderRadius: "12px", padding: "12px" }}
                />
                {error && (
                  <Form.Control.Feedback type="invalid">
                    {error}
                  </Form.Control.Feedback>
                )}
              </Form.Group>

              <Form.Group controlId="password" className="mb-3">
                <Form.Control
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ borderRadius: "12px", padding: "12px" }}
                />

              </Form.Group>

              <Button
                type="submit"
                variant="dark"
                className="w-100 mb-3 py-2 fs-5 rounded-pill"
                disabled={loading}
              >
                {loading ? (
                  <Spinner
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                ) : (
                  "Login"
                )}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </>

  );
};

export default LoginScreen;
