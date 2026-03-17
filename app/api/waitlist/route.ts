import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { generateReferralCode, buildReferralLink } from '@/lib/referral'

const waitlistSchema = z.object({
  first_name: z.string().min(1, 'Name is required'),
  last_name: z.string().optional(),
  email: z.string().email('Invalid email address'),
  role: z.enum(['student', 'teacher', 'institution']),
  avatarUrl: z.string().optional().nullable(),
  referralCode: z.string().optional().nullable(),
})

// Flag to enable/disable API calls - set to false to skip DB calls (for testing)
const ENABLE_API_CALLS = process.env.NEXT_PUBLIC_ENABLE_WAITLIST_API === 'true'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const validationResult = waitlistSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationResult.error.issues },
        { status: 400 }
      )
    }

    const { first_name, last_name, email, role, avatarUrl, referralCode } = validationResult.data

    // Skip DB call if flag is false (for testing/demo purposes)
    if (!ENABLE_API_CALLS) {
      console.log('API call disabled - skipping database write')
      const demoReferralCode = generateReferralCode()
      return NextResponse.json(
        {
          success: true,
          data: {
            id: 'demo-id',
            email,
            name: first_name,
            role,
            referral_code: demoReferralCode,
            referral_link: buildReferralLink(demoReferralCode, 'https://vedai.com')
          },
          mock: true
        },
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
      .select('email, id')
      .eq('email', email)
      .single()

    if (existingUser) {
      return NextResponse.json(
        { error: 'This email is already on the waitlist' },
        { status: 409 }
      )
    }

    // Handle referral - look up referrer by code
    let referredById: string | null = null
    if (referralCode) {
      const { data: referrer } = await supabase
        .from('waitlist')
        .select('id')
        .eq('referral_code', referralCode)
        .single()

      if (referrer) {
        referredById = referrer.id

        // Increment referrer's referral count atomically
        await supabase.rpc('increment_referral_count', { row_id: referrer.id })
      }
    }

    // Generate unique referral code for new user
    let newReferralCode = generateReferralCode()
    let codeExists = true

    // Ensure uniqueness
    while (codeExists) {
      const { data: existing } = await supabase
        .from('waitlist')
        .select('id')
        .eq('referral_code', newReferralCode)
        .single()

      if (!existing) {
        codeExists = false
      } else {
        newReferralCode = generateReferralCode()
      }
    }

    // Insert new waitlist entry
    const { data, error } = await supabase
      .from('waitlist')
      .insert({
        name: first_name,
        email,
        role: role,
        avatar_url: avatarUrl || null,
        status: 'CONFIRMED',
        referral_code: newReferralCode,
        referred_by: referredById,
        referral_count: 0,
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

    // Build referral link for the new user
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://vedai.com'
    const referralLink = buildReferralLink(newReferralCode, baseUrl)

    return NextResponse.json(
      {
        success: true,
        data,
        referral_code: newReferralCode,
        referral_link: referralLink
      },
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
