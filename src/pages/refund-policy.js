import React, { useState, useEffect } from 'react'
import axios from 'axios'
import PageTitle from '../components/Typography/PageTitle'
import SectionTitle from '../components/Typography/SectionTitle'
import {
  Card,
  CardBody,
  Button,
  Textarea,
} from '@windmill/react-ui'
import { EditIcon } from '../icons'

function RefundPolicy() {
  const [isEditing, setIsEditing] = useState(false)
  const [policyContent, setPolicyContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Configure axios instance
  const api = axios.create({
    baseURL: 'http://localhost:3000/api',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  })

  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        const { data } = await api.get('/policies/refund-policy')
        setPolicyContent(data.data || '')
        setError(null)
      } catch (error) {
        console.error('Error fetching refund policy:', error)
        setError('Failed to load refund policy')
      } finally {
        setLoading(false)
      }
    }
    fetchPolicy()
  }, [])

  const handleSave = async () => {
    try {
      const { data } = await api.put('/policies/refund-policy', {
        content: policyContent
      })
      if (data.success) {
        setIsEditing(false)
        setError(null)
      }
    } catch (error) {
      console.error('Error saving refund policy:', error)
      setError('Failed to save changes')
    }
  }

  return (
    <>
      <PageTitle>Refund Policy</PageTitle>

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
                    <Button layout="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSave}>
                      Save Changes
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="prose dark:prose-dark max-w-none">
                  {policyContent ? (
                    <div dangerouslySetInnerHTML={{ __html: policyContent }} />
                  ) : (
                    <div className="text-gray-600 dark:text-gray-400">
                      <h2 className="mb-4 text-lg font-semibold text-gray-700 dark:text-gray-300">
                        1. Refund Eligibility
                      </h2>
                      <p className="mb-4">
                        We issue refunds for digital products within 30 days of the original purchase of the product.
                      </p>

                      <h2 className="mb-4 text-lg font-semibold text-gray-700 dark:text-gray-300">
                        2. Refund Process
                      </h2>
                      <p className="mb-4">
                        To request a refund, please contact our support team with your order details. We aim to process all refund requests within 5-7 business days.
                      </p>

                      <h2 className="mb-4 text-lg font-semibold text-gray-700 dark:text-gray-300">
                        3. Non-refundable Items
                      </h2>
                      <ul className="mb-4 list-disc list-inside">
                        <li className="mb-2">Used or partially used services</li>
                        <li className="mb-2">Custom or personalized services</li>
                        <li className="mb-2">Downloadable software or digital content that has been accessed</li>
                      </ul>

                      <h2 className="mb-4 text-lg font-semibold text-gray-700 dark:text-gray-300">
                        4. Payment Method
                      </h2>
                      <p className="mb-4">
                        Refunds will be issued using the same payment method used for the original purchase.
                      </p>

                      <h2 className="mb-4 text-lg font-semibold text-gray-700 dark:text-gray-300">
                        5. Contact Information
                      </h2>
                      <p className="mb-4">
                        If you have any questions about our refund policy, please contact us:
                        <br />
                        Email: support@growupp.com
                        <br />
                        Phone: 1-800-GROWUPP
                      </p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {error && (
            <div className="mt-4 text-red-500 dark:text-red-400">
              {error}
            </div>
          )}

          <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
            Last updated: {new Date().toLocaleDateString()}
          </div>
        </CardBody>
      </Card>
    </>
  )
}

export default RefundPolicy