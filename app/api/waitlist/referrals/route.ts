import { NextRequest, NextResponse } from 'next/server'

// Flag to enable/disable API calls
const ENABLE_API_CALLS = process.env.NEXT_PUBLIC_ENABLE_WAITLIST_API === 'true'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Return mock data if API is disabled
    if (!ENABLE_API_CALLS) {
      return NextResponse.json({
        success: true,
        referralCode: 'demo12345678',
        referralCount: 0,
        referrals: [],
        mock: true
      })
    }

    const { supabase } = await import('@/lib/supabase')

    if (!supabase) {
      return NextResponse.json(
        { error: 'Supabase not configured' },
        { status: 500 }
      )
    }

    // Get user's referral data
    const { data: user, error: userError } = await supabase
      .from('waitlist')
      .select('id, referral_code, referral_count, name')
      .eq('email', email)
      .single()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Get list of people user referred
    const { data: referrals, error: referralsError } = await supabase
      .from('waitlist')
      .select('id, name, email, created_at')
      .eq('referred_by', user.id)
      .order('created_at', { ascending: false })

    if (referralsError) {
      console.error('Error fetching referrals:', referralsError)
      return NextResponse.json(
        { error: 'Failed to fetch referrals' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      referralCode: user.referral_code,
      referralCount: user.referral_count || 0,
      referrals: referrals || [],
      userName: user.name
    })
  } catch (error) {
    console.error('Referral stats API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
