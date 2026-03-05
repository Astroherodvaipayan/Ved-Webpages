import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const waitlistSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().optional(),
  email: z.string().email('Invalid email address'),
  role: z.enum(['student', 'teacher', 'institution']),
  avatarUrl: z.string().optional().nullable(),
})

// Flag to enable/disable API calls - set to false to skip DB calls (for testing)
const ENABLE_API_CALLS = process.env.NEXT_PUBLIC_ENABLE_WAITLIST_API === 'true'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const validationResult = waitlistSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationResult.error.errors },
        { status: 400 }
      )
    }

    const { firstName, lastName, email, role, avatarUrl } = validationResult.data

    // Skip DB call if flag is false (for testing/demo purposes)
    if (!ENABLE_API_CALLS) {
      console.log('API call disabled - skipping database write')
      return NextResponse.json(
        { success: true, data: { id: 'demo-id', email, firstName, role }, mock: true },
        { status: 201 }
      )
    }

    // Dynamic import of supabase to avoid initialization error
    const { supabase } = await import('@/lib/supabase')

    if (!supabase) {
      return NextResponse.json(
        { error: 'Supabase not configured' },
        { status: 500 }
      )
    }

    // Check if email already exists
    const { data: existingUser } = await supabase
      .from('waitlist')
      .select('email')
      .eq('email', email)
      .single()

    if (existingUser) {
      return NextResponse.json(
        { error: 'This email is already on the waitlist' },
        { status: 409 }
      )
    }

    // Insert new waitlist entry
    const { data, error } = await supabase
      .from('waitlist')
      .insert({
        first_name: firstName,
        last_name: lastName || null,
        email,
        role: role.toUpperCase(),
        avatar_url: avatarUrl || null,
        status: 'CONFIRMED',
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to save to database' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: true, data },
      { status: 201 }
    )
  } catch (error) {
    console.error('Waitlist API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // Skip DB call if flag is false
    if (!ENABLE_API_CALLS) {
      return NextResponse.json({ success: true, data: [], mock: true })
    }

    const { supabase } = await import('@/lib/supabase')

    if (!supabase) {
      return NextResponse.json(
        { error: 'Supabase not configured' },
        { status: 500 }
      )
    }

    const { data, error } = await supabase
      .from('waitlist')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100)

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch data' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Waitlist API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
