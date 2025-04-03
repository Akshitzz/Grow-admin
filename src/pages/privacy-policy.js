import React, { useState, useEffect } from "react";
import PageTitle from "../components/Typography/PageTitle";
import axios from "axios";
import { Card, CardBody, Button, Textarea } from "@windmill/react-ui";
import { EditIcon } from "../icons";
import SectionTitle from "../components/Typography/SectionTitle";

function PrivacyPolicy() {
  // Configure axios instance
  const api = axios.create({
    // baseURL: 'http://localhost:3000/api',
    baseURL: "https://growupp.onrender.com/api",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  const [isEditing, setIsEditing] = useState(false);
  const [policyContent, setPolicyContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        const { data } = await api.get("/policies/privacy-policy");
        setPolicyContent(data.data || "");
        setError(null);
      } catch (error) {
        console.error("Error fetching privacy policy:", error);
        setError("Failed to load privacy policy");
      } finally {
        setLoading(false);
      }
    };
    fetchPolicy();
  }, []);

  const handleSave = async () => {
    try {
      const { data } = await api.put("/policies/privacy-policy", {
        content: policyContent,
      });
      if (data.success) {
        setIsEditing(false);
        setError(null);
      }
    } catch (error) {
      console.error("Error saving privacy policy:", error);
      setError("Failed to save changes");
    }
  };

  return (
    <>
      <PageTitle>Privacy Policy</PageTitle>

      <Card className="mb-8 shadow-md">
        <CardBody>
          <div className="flex justify-between items-center mb-6">
            <SectionTitle>Policy Content</SectionTitle>
            {!isEditing && (
              <Button icon={EditIcon} onClick={() => setIsEditing(true)}>
                Edit Policy
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
              {isEditing ? (
                <div>
                  <Textarea
                    className="mb-4"
                    rows="10"
                    value={policyContent}
                    onChange={(e) => setPolicyContent(e.target.value)}
                  />
                  <div className="flex justify-end space-x-4">
                    <Button onClick={() => setIsEditing(false)}>Cancel</Button>
                    <Button onClick={handleSave}>Save Changes</Button>
                  </div>
                </div>
              ) : (
                <div className="prose dark:prose-dark max-w-none">
                  {policyContent ? (
                    <div dangerouslySetInnerHTML={{ __html: policyContent }} />
                  ) : (
                    <p className="text-gray-600 dark:text-gray-400">
                      No privacy policy content available.
                    </p>
                  )}
                </div>
              )}
            </>
          )}

          {error && (
            <div className="mt-4 text-sm text-red-500 dark:text-red-400">
              {error}
            </div>
          )}

          <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
            Last updated: {new Date().toLocaleDateString()}
          </div>
        </CardBody>
      </Card>
    </>
  );
}

export default PrivacyPolicy;
