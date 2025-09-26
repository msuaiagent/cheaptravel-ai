// Helper functions for Supabase authentication
// If you need to get the authenticated user, use these

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function getAuthenticatedUser(request: NextRequest) {
  try {
    const { supabase } = createClient(request)
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      return { user: null, error: 'Unauthorized' }
    }
    
    return { user, error: null }
  } catch (error) {
    return { user: null, error: 'Authentication failed' }
  }
}

export function createUnauthorizedResponse() {
  return NextResponse.json(
    { error: 'Unauthorized - please log in' },
    { status: 401 }
  )
}