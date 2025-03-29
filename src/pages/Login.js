import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ImageLight from "../assets/img/login-office.jpeg";
import ImageDark from "../assets/img/login-office-dark.jpeg";
import { Label, Input, Button } from "@windmill/react-ui";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

function Login() {
  const history = useHistory();
  const { login } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1 for phone, 2 for OTP
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.sendOTP(phoneNumber);
      setStep(2);
    } catch (error) {
      setError(error.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.verifyOTP(phoneNumber, otp);
      console.log("Auth Response:", response); // Add this debug log

      if (!response.user) {
        throw new Error("Invalid response from server");
      }

      if (response.user.role !== "admin") {
        throw new Error(`Access denied. Role: ${response.user.role}`);
      }

      await login(response);
      history.push("/app");
    } catch (error) {
      console.error("Login error:", error); // Add this debug log
      setError(error.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
        <div className="flex flex-col overflow-y-auto md:flex-row">
          <div className="h-32 md:h-auto md:w-1/2">
            <img
              aria-hidden="true"
              className="object-cover w-full h-full dark:hidden"
              src={ImageLight}
              alt="Office"
            />
            <img
              aria-hidden="true"
              className="hidden object-cover w-full h-full dark:block"
              src={ImageDark}
              alt="Office"
            />
          </div>
          <main className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
            <div className="w-full">
              <h1 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
                Admin Login
              </h1>

              {error && (
                <div className="mb-4 text-sm font-medium text-red-600">
                  {error}
                </div>
              )}

              {step === 1 ? (
                <form onSubmit={handleSendOTP}>
                  <Label>
                    <span>Phone Number</span>
                    <Input
                      className="mt-1"
                      type="tel"
                      placeholder="Enter phone number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                    />
                  </Label>

                  <Button
                    className="mt-4"
                    block
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? "Sending..." : "Send OTP"}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOTP}>
                  <Label>
                    <span>Enter OTP</span>
                    <Input
                      className="mt-1"
                      type="text"
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                    />
                  </Label>

                  <Button
                    className="mt-4"
                    block
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? "Verifying..." : "Verify OTP"}
                  </Button>

                  <Button
                    className="mt-4"
                    block
                    layout="outline"
                    onClick={() => setStep(1)}
                  >
                    Back to Phone Number
                  </Button>
                </form>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default Login;
