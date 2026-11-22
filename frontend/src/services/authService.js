import { supabase } from './supabase'

export function getAuthErrorMessage(error) {
  const message = error?.message || ''
  if (/already registered|user already exists/i.test(message)) {
    return 'An account with this email already exists.'
  }
  if (/invalid login credentials/i.test(message)) {
    return 'The email or password is incorrect.'
  }
  if (/email not confirmed/i.test(message)) {
    return 'Please confirm your email address before signing in.'
  }
  if (/session.*expired|jwt.*expired/i.test(message)) {
    return 'Your session has expired. Please sign in again.'
  }
  return message || 'Authentication request failed.'
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession()
  if (error) throw error
  return data.session
}

export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser()
  if (error) return null
  return data.user
}

export async function loginUser(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  })
  if (error) throw new Error(getAuthErrorMessage(error))
  return data.user
}

export async function registerUser({ name, email, password }) {
  const { data, error } = await supabase.auth.signUp({
    email: email.trim().toLowerCase(),
    password,
    options: {
      data: {
        full_name: name.trim(),
      },
    },
  })
  if (error) throw new Error(getAuthErrorMessage(error))

  return {
    user: data.user,
    needsConfirmation: !data.session,
  }
}

export async function loginWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${window.location.origin}/app` },
  })
  if (error) throw new Error(getAuthErrorMessage(error))
}

export async function logoutUser() {
  const { error } = await supabase.auth.signOut({ scope: 'global' })
  if (error) throw error
}

export async function requestPasswordReset(email) {
  const redirectTo = `${window.location.origin}/forgot-password`
  const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
    redirectTo,
  })
  if (error) throw new Error(getAuthErrorMessage(error))
  return { sent: true }
}

export function onAuthStateChange(callback) {
  return supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user || null)
  })
}
