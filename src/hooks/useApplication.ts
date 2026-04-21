import { useState, useEffect } from 'react'
import { saveCommonApplication, getCommonApplication, applyToProgram as apiApplyToProgram, getMyApplications } from '../services/apiService'

interface ApplicationData {
  accountCreation?: any
  personalInfo?: any
  backgroundInfo?: any
  educationHistory?: any
  workExperience?: any
  activities?: any
  personalStatement?: any
  programSelection?: any
  supportingDocuments?: any
  recommendations?: any
  eligibilityQuestions?: any
  submission?: any
}

export function useApplication() {
  const [applicationData, setApplicationData] = useState<ApplicationData>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  useEffect(() => {
    loadApplicationData()
  }, [])

  const loadApplicationData = async () => {
    try {
      const data = await getCommonApplication()
      if (data && data.data) {
        setApplicationData(data.data)
      }
    } catch (error) {
      console.error('Failed to load application data:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateSection = (section: keyof ApplicationData, data: any) => {
    setApplicationData(prev => ({
      ...prev,
      [section]: data
    }))
  }

  const saveApplication = async () => {
    setSaving(true)
    try {
      await saveCommonApplication(applicationData)
      setLastSaved(new Date())
      return { success: true }
    } catch (error) {
      console.error('Failed to save application:', error)
      return { success: false, error: 'Failed to save application' }
    } finally {
      setSaving(false)
    }
  }

  const applyToProgram = async (programId: string) => {
    try {
      await apiApplyToProgram(programId, applicationData)
      return { success: true }
    } catch (error) {
      console.error('Failed to apply to program:', error)
      return { success: false, error: 'Failed to submit application' }
    }
  }

  const getApplications = async () => {
    try {
      const applications = await getMyApplications()
      return applications
    } catch (error) {
      console.error('Failed to get applications:', error)
      return []
    }
  }

  const getCompletionPercentage = () => {
    const sections = Object.keys(applicationData)
    const completedSections = sections.filter(section => 
      applicationData[section as keyof ApplicationData] && 
      Object.keys(applicationData[section as keyof ApplicationData]).length > 0
    )
    return Math.round((completedSections.length / sections.length) * 100)
  }

  return {
    applicationData,
    loading,
    saving,
    lastSaved,
    updateSection,
    saveApplication,
    applyToProgram,
    getApplications,
    getCompletionPercentage
  }
}
