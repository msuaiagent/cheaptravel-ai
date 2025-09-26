// This is the API route for user signin using Supabase authentication.

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { SignInRequest, AuthResponse, AuthError } from '@/types/auth'

export async function POST(request: NextRequest): Promise<NextResponse<AuthResponse | AuthError>> {
  try {
    const { email, password }: SignInRequest = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const { supabase, response } = createClient(request)

    // Sign in the user
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      )
    }

    if (!data.user) {
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      message: 'Authentication successful',
      user: {
        id: data.user.id,
        email: data.user.email!,  // ! means we know it's not null here
        fullName: data.user.user_metadata?.full_name || null
      },
      session: {
        accessToken: data.session!.access_token,
        refreshToken: data.session!.refresh_token,
        expiresAt: data.session?.expires_at
      }
    }, { status: 200 })

  } catch (error) {
    console.error('Signin error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}