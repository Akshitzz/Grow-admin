import React, { useState, useEffect } from "react";
import PageTitle from "../components/Typography/PageTitle";
import SectionTitle from "../components/Typography/SectionTitle";
import axios from "axios";
import { Card, CardBody, Button, Textarea } from "@windmill/react-ui";
import { EditIcon } from "../icons";

function TermsAndConditions() {
  const [isEditing, setIsEditing] = useState(false);
  const [termsContent, setTermsContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const api = axios.create({
    // baseURL: "http://localhost:3000/api",
    baseURL: "https://growupp.onrender.com/api",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const { data } = await api.get("/policies/terms-conditions");
        setTermsContent(data.data || "");
        setError(null);
      } catch (error) {
        console.error("Error fetching terms:", error);
        setError("Failed to load terms and conditions");
      } finally {
        setLoading(false);
      }
    };
    fetchTerms();
  }, []);

  const handleSave = async () => {
    try {
      const { data } = await api.put("/policies/terms-conditions", {
        content: termsContent,
      });
      if (data.success) {
        setIsEditing(false);
        setError(null);
      }
    } catch (error) {
      console.error("Error saving terms:", error);
      setError("Failed to save changes");
    }
  };

  return (
    <>
      <PageTitle>Terms and Conditions</PageTitle>

      <Card className="mb-8 shadow-md">
        <CardBody>
          <div className="flex justify-between items-center mb-6">
            <SectionTitle>Terms Content</SectionTitle>
            {!isEditing && (
              <Button icon={EditIcon} onClick={() => setIsEditing(true)}>
                Edit Terms
              </Button>
            )}
          </div>

          {loading ? (
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          ) : (
            <>
              {error && <div className="text-red-500 mb-4">{error}</div>}
              {isEditing ? (
                <div>
                  <Textarea
                    className="mb-4"
                    rows="10"
                    value={termsContent}
                    onChange={(e) => setTermsContent(e.target.value)}
                  />
                  <div className="flex justify-end space-x-4">
                    <Button
                      layout="outline"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleSave}>Save Changes</Button>
                  </div>
                </div>
              ) : (
                <div className="prose dark:prose-dark max-w-none">
                  <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                    1. Acceptance of Terms
                  </h2>
                  <p className="mb-4 text-gray-600 dark:text-gray-400">
                    By accessing and using this platform, you accept and agree
                    to be bound by the terms and provision of this agreement.
                  </p>

                  <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                    2. User Responsibilities
                  </h2>
                  <p className="mb-4 text-gray-600 dark:text-gray-400">
                    Users must provide accurate information and maintain the
                    security of their account credentials.
                  </p>

                  <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                    3. Platform Rules
                  </h2>
                  <ul className="list-disc list-inside mb-4 text-gray-600 dark:text-gray-400">
                    <li className="mb-2">Follow fair play guidelines</li>
                    <li className="mb-2">Respect other users</li>
                    <li className="mb-2">Maintain account security</li>
                  </ul>

                  <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                    4. Prohibited Activities
                  </h2>
                  <p className="mb-4 text-gray-600 dark:text-gray-400">
                    Users shall not engage in any fraudulent activities or
                    violate platform rules.
                  </p>
                </div>
              )}
            </>
          )}

          <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
            Last updated: {new Date().toLocaleDateString()}
          </div>
        </CardBody>
      </Card>
    </>
  );
}

export default TermsAndConditions;
