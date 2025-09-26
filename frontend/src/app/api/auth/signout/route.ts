// This is the API route for user signout using Supabase authentication.

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { AuthError } from '@/types/auth'

export async function POST(request: NextRequest): Promise<NextResponse<{ message: string } | AuthError>> {
  try {
    const { supabase, response } = createClient(request)

    // Sign out the user
    const { error } = await supabase.auth.signOut()

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json({
      message: 'Signed out successfully'
    }, { status: 200 })

  } catch (error) {
    console.error('Signout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}