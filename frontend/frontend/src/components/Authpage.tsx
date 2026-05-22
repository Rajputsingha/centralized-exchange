import { Label } from "./label"
import { Button} from "./button"
import {  Card, CardContent, CardHeader, CardTitle  } from "./card";
import { Input } from "./input"
import { useState } from "react";
import  axios  from "axios";
import { useNavigate, Link } from "react-router-dom"

const API_URL = "http://localhost:8080"
interface AuthpageProps{
    type:"signup"| "signin";
}
export const Authpage = ({ type }: AuthpageProps) => { 
    // State
    const [username, setUsername] = useState("")
    const [email, setEmail]       = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading]   = useState(false)
    const [error, setError]       = useState("")

const navigate = useNavigate()

// Submit handler
const handleSubmit = async () => {
  setLoading(true)
  setError("")

  try {
    if (type === "signup") {
      // Call signup API
      await axios.post(`${API_URL}/api/auth/signup`, {
        username,
        email,
          passwordHash: password 
      })
      // After signup → go to signin
      navigate("/signin")

    } else {
      // Call signin API
      const response = await axios.post(`${API_URL}/api/auth/signin`, {
        email,
          passwordHash: password 
      })
      // Save token to localStorage only if present
      const token = response.data?.token;
      if (token) {
        localStorage.setItem("token", token);
        // After signin → go to trade page
        navigate("/trade")
      } else {
        setError("Authentication failed: no token received");
      }
    }

  } catch (err: any) {
    setError(
      err.response?.data?.message || "Something went wrong"
    )
  }

  setLoading(false)
}

return (
  <div className="flex items-center justify-center min-h-screen bg-gray-950">
    <Card className="w-full max-w-md bg-gray-900 border-gray-800">

      {/* Header */}
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-white">
          {type === "signup" ? "Create Account" : "Welcome Back"}
        </CardTitle>
        <p className="text-gray-400 text-sm">
          {type === "signup"
            ? "Sign up to start trading"
            : "Sign in to your account"}
        </p>
      </CardHeader>

      <CardContent className="space-y-4">

        {/* Username - only signup */}
        {type === "signup" && (
          <div className="space-y-2">
            <Label className="text-gray-300">Username</Label>
            <Input
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
            />
          </div>
        )}

        {/* Email */}
        <div className="space-y-2">
          <Label className="text-gray-300">Email</Label>
          <Input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
          />
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label className="text-gray-300">Password</Label>
          <Input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
          />
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-red-400 text-sm text-center">
            {error}
          </p>
        )}

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          {loading
            ? "Please wait..."
            : type === "signup" ? "Sign Up" : "Sign In"}
        </Button>

        {/* Switch Page Link */}
        <p className="text-center text-gray-400 text-sm">
          {type === "signup" ? (
            <>
              Already have account?{" "}
              <Link
                to="/signin"
                className="text-blue-400 hover:underline"
              >
                Sign In
              </Link>
            </>
          ) : (
            <>
              Don't have account?{" "}
              <Link
                to="/signup"
                className="text-blue-400 hover:underline"
              >
                Sign Up
              </Link>
            </>
          )}
        </p>

      </CardContent>
    </Card>
  </div>
)

}


