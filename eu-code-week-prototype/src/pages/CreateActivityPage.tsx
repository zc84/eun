import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { addressSuggestions } from '../data/addressSuggestions'
import { countries } from '../data/countries'
import { activityTypeOptions, ageGroupOptions, languageOptions, topicOptions } from '../data/filters'
import { useAppStore } from '../store/appStore'
import type { ActivityMode } from '../types/activity'

interface FormState {
  title: string
  summary: string
  description: string
  activityType: string
  topics: string[]
  primaryLanguage: string
  additionalLanguages: string[]
  startDate: string
  endDate: string
  mode: ActivityMode
  countryCode: string
  city: string
  address: string
  latitude: number
  longitude: number
  ageGroups: string[]
  capacity: string
  registrationUrl: string
}

const initialForm: FormState = {
  title: '',
  summary: '',
  description: '',
  activityType: activityTypeOptions[0],
  topics: [],
  primaryLanguage: 'English',
  additionalLanguages: [],
  startDate: '',
  endDate: '',
  mode: 'onsite',
  countryCode: 'BE',
  city: '',
  address: '',
  latitude: 50.8503,
  longitude: 4.3517,
  ageGroups: [],
  capacity: '',
  registrationUrl: '',
}

function toggle(values: string[], value: string) {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value]
}

export function CreateActivityPage() {
  const navigate = useNavigate()
  const { createActivity, setRole } = useAppStore()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<FormState>(initialForm)
  const [confirm, setConfirm] = useState(false)
  const [errors, setErrors] = useState<string[]>([])

  const suggestions = useMemo(
    () =>
      form.address.trim().length < 2
        ? []
        : addressSuggestions.filter((item) =>
            item.label.toLowerCase().includes(form.address.trim().toLowerCase()),
          ),
    [form.address],
  )

  function validateCurrentStep() {
    const nextErrors: string[] = []

    if (step === 1) {
      if (!form.title.trim()) nextErrors.push('Title is required.')
      if (!form.summary.trim()) nextErrors.push('Short summary is required.')
      if (!form.description.trim()) nextErrors.push('Full description is required.')
    }

    if (step === 2) {
      if (!form.startDate) nextErrors.push('Start date and time are required.')
      if (!form.endDate) nextErrors.push('End date and time are required.')
      if (!form.city.trim()) nextErrors.push('City is required.')
      if (!form.countryCode.trim()) nextErrors.push('Country is required.')
    }

    if (step === 3) {
      if (form.ageGroups.length === 0) nextErrors.push('Select at least one age group.')
    }

    if (step === 4 && !confirm) {
      nextErrors.push('Please confirm demo submission before sending.')
    }

    setErrors(nextErrors)
    return nextErrors.length === 0
  }

  function nextStep() {
    if (validateCurrentStep()) {
      setStep((value) => Math.min(4, value + 1))
    }
  }

  function previousStep() {
    setStep((value) => Math.max(1, value - 1))
  }

  function applySuggestion(id: string) {
    const selected = addressSuggestions.find((item) => item.id === id)
    if (!selected) return

    setForm((prev) => ({
      ...prev,
      countryCode: selected.countryCode,
      city: selected.city,
      address: selected.addressLine,
      latitude: selected.latitude,
      longitude: selected.longitude,
    }))
  }

  function submit() {
    if (!validateCurrentStep()) {
      return
    }

    const countryName = countries.find((item) => item.code === form.countryCode)?.name ?? form.countryCode
    const created = createActivity({
      title: form.title,
      summary: form.summary,
      description: form.description,
      countryCode: form.countryCode,
      countryName,
      city: form.city,
      address: form.address,
      latitude: form.latitude,
      longitude: form.longitude,
      startDate: new Date(form.startDate).toISOString(),
      endDate: new Date(form.endDate).toISOString(),
      mode: form.mode,
      activityType: form.activityType,
      ageGroups: form.ageGroups,
      languages: [form.primaryLanguage, ...form.additionalLanguages],
      topics: form.topics,
      registrationUrl: form.registrationUrl || undefined,
      capacity: form.capacity ? Number(form.capacity) : undefined,
    })

    setRole('organiser')
    navigate(`/activities/submitted?activityId=${created.id}`)
  }

  return (
    <section className="container details-page">
      <h1>Create a new activity</h1>
      <p>Step {step} of 4</p>

      {errors.length > 0 ? (
        <div className="panel" role="alert" aria-live="assertive">
          <h2>Please review the required fields</h2>
          <ul>
            {errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="panel">
        {step === 1 ? (
          <div className="form-grid">
            <label>
              Title
              <input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
            </label>
            <label>
              Short summary
              <input value={form.summary} onChange={(event) => setForm({ ...form, summary: event.target.value })} />
            </label>
            <label>
              Full description
              <textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
            </label>
            <label>
              Activity type
              <select value={form.activityType} onChange={(event) => setForm({ ...form, activityType: event.target.value })}>
                {activityTypeOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </label>
            <fieldset>
              <legend>Topics</legend>
              {topicOptions.map((topic) => (
                <label key={topic}>
                  <input
                    type="checkbox"
                    checked={form.topics.includes(topic)}
                    onChange={() => setForm({ ...form, topics: toggle(form.topics, topic) })}
                  />
                  {topic}
                </label>
              ))}
            </fieldset>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="form-grid">
            <label>
              Start date and time
              <input type="datetime-local" value={form.startDate} onChange={(event) => setForm({ ...form, startDate: event.target.value })} />
            </label>
            <label>
              End date and time
              <input type="datetime-local" value={form.endDate} onChange={(event) => setForm({ ...form, endDate: event.target.value })} />
            </label>
            <label>
              Mode
              <select value={form.mode} onChange={(event) => setForm({ ...form, mode: event.target.value as ActivityMode })}>
                <option value="onsite">Onsite</option>
                <option value="online">Online</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </label>
            <label>
              Country
              <select value={form.countryCode} onChange={(event) => setForm({ ...form, countryCode: event.target.value })}>
                {countries.map((country) => (
                  <option key={country.code} value={country.code}>{country.name}</option>
                ))}
              </select>
            </label>
            <label>
              City
              <input value={form.city} onChange={(event) => setForm({ ...form, city: event.target.value })} />
            </label>
            <label>
              Address
              <input value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} />
            </label>
            {suggestions.length > 0 ? (
              <div>
                <p>Address suggestions</p>
                <div className="chips-row">
                  {suggestions.map((item) => (
                    <button type="button" key={item.id} className="ghost-button" onClick={() => applySuggestion(item.id)}>
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
            <p>Coordinates preview: {form.latitude.toFixed(4)}, {form.longitude.toFixed(4)}</p>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="form-grid">
            <fieldset>
              <legend>Age groups</legend>
              {ageGroupOptions.map((age) => (
                <label key={age}>
                  <input
                    type="checkbox"
                    checked={form.ageGroups.includes(age)}
                    onChange={() => setForm({ ...form, ageGroups: toggle(form.ageGroups, age) })}
                  />
                  {age}
                </label>
              ))}
            </fieldset>
            <label>
              Primary language
              <select value={form.primaryLanguage} onChange={(event) => setForm({ ...form, primaryLanguage: event.target.value })}>
                {languageOptions.map((language) => (
                  <option key={language} value={language}>{language}</option>
                ))}
              </select>
            </label>
            <fieldset>
              <legend>Additional languages</legend>
              {languageOptions.map((language) => (
                <label key={language}>
                  <input
                    type="checkbox"
                    checked={form.additionalLanguages.includes(language)}
                    onChange={() => setForm({ ...form, additionalLanguages: toggle(form.additionalLanguages, language) })}
                  />
                  {language}
                </label>
              ))}
            </fieldset>
            <label>
              Participant capacity
              <input type="number" min={1} value={form.capacity} onChange={(event) => setForm({ ...form, capacity: event.target.value })} />
            </label>
            <label>
              Registration URL
              <input type="url" value={form.registrationUrl} onChange={(event) => setForm({ ...form, registrationUrl: event.target.value })} />
            </label>
          </div>
        ) : null}

        {step === 4 ? (
          <div className="form-grid">
            <h2>Review and submit</h2>
            <p>Title: {form.title || '—'}</p>
            <p>Summary: {form.summary || '—'}</p>
            <p>Country/City: {form.countryCode} / {form.city || '—'}</p>
            <p>Mode: {form.mode}</p>
            <p>Ages: {form.ageGroups.join(', ') || '—'}</p>
            <p>Languages: {[form.primaryLanguage, ...form.additionalLanguages].join(', ')}</p>
            <label>
              <input type="checkbox" checked={confirm} onChange={(event) => setConfirm(event.target.checked)} />
              I confirm this is a demonstration submission.
            </label>
          </div>
        ) : null}

        <div className="hero-actions">
          <button type="button" className="ghost-button" onClick={previousStep} disabled={step === 1}>Back</button>
          {step < 4 ? (
            <button type="button" className="primary-button" onClick={nextStep}>Continue</button>
          ) : (
            <button type="button" className="primary-button" onClick={submit}>Submit for moderation</button>
          )}
        </div>
      </div>
    </section>
  )
}

