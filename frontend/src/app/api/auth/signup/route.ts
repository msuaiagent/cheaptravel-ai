// This is the API route for user signup using Supabase authentication.

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { SignUpRequest, AuthResponse, AuthError } from '@/types/auth'

export async function POST(request: NextRequest): Promise<NextResponse<AuthResponse | AuthError>> {
  try {
    const { email, password, fullName }: SignUpRequest = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Password strength check (example: minimum 6 characters)
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    const { supabase, response } = createClient(request)

    // Sign up the user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName || '',
        }
      }
    })

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    if (!data.user) {
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'User created successfully',
      user: {
        id: data.user.id,
        email: data.user.email!,  // ! tells TypeScript "I know this isn't null"
        emailConfirmed: data.user.email_confirmed_at !== null
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}