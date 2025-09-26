// This is the API route to get the current authenticated user's information using Supabase authentication.

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { AuthUser, AuthError } from '@/types/auth'

export async function GET(request: NextRequest): Promise<NextResponse<{ user: AuthUser } | AuthError>> {
  try {
    const { supabase } = createClient(request)

    // Get the current user
    // Note: supabase.auth.getUser() retrieves the user based on the access token in the request cookies
    // If the token is missing or invalid, it will return an error
    // This is the method to get an authenticated user's details
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    if (!user) {
      return NextResponse.json(
        { error: 'No user found' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email!,
        fullName: user.user_metadata?.full_name || null,
        createdAt: user.created_at,
        emailConfirmed: user.email_confirmed_at !== null
      }
    }, { status: 200 })

  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}