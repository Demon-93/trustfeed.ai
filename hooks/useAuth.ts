"use client"

import { useState, useEffect } from "react"
import { User, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut, getAuth } from "firebase/auth"

function getFirebaseAuth() {
  if (typeof window === "undefined") return null
  const { getApp } = require("firebase/app")
  const app = getApp()
  return getAuth(app)
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const auth = getFirebaseAuth()
    if (!auth) {
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signIn = async () => {
    const auth = getFirebaseAuth()
    if (!auth) throw new Error("Firebase not initialized")
    const provider = new GoogleAuthProvider()
    await signInWithPopup(auth, provider)
  }

  const logout = async () => {
    const auth = getFirebaseAuth()
    if (!auth) throw new Error("Firebase not initialized")
    await signOut(auth)
  }

  return { user, loading, signIn, logout }
}
