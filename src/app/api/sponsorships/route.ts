import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { CreateSponsorshipData } from '@/types/sponsorship'

export async function GET() {
  try {
    const sponsorships = await prisma.sponsorship.findMany({
      orderBy: {
        updatedAt: 'desc'
      }
    })
    
    // Convert dates to proper format for frontend
    const formattedSponsorships = sponsorships.map(sponsorship => ({
      ...sponsorship,
      attachments: sponsorship.attachments ? JSON.parse(sponsorship.attachments) : []
    }))
    
    return NextResponse.json(formattedSponsorships)
  } catch (error) {
    console.error('Error fetching sponsorships:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sponsorships' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data: CreateSponsorshipData = await request.json()
    
    const sponsorship = await prisma.sponsorship.create({
      data: {
        title: data.title,
        brandName: data.brandName,
        contactPerson: data.contactPerson,
        contactEmail: data.contactEmail,
        type: data.type,
        description: data.description,
        category: data.category,
        monetaryValue: data.monetaryValue,
        currency: data.currency,
        paymentMethod: data.paymentMethod,
        startDate: data.startDate,
        deliveryDate: data.deliveryDate,
        publishDate: data.publishDate,
        isFlexiblePublishDate: data.isFlexiblePublishDate,
        status: data.initialStatus,
        priority: data.priority,
        notes: data.notes,
        attachments: '[]', // Empty array as JSON string
        lastActivity: new Date(),
      }
    })
    
    const formattedSponsorship = {
      ...sponsorship,
      attachments: []
    }
    
    return NextResponse.json(formattedSponsorship, { status: 201 })
  } catch (error) {
    console.error('Error creating sponsorship:', error)
    return NextResponse.json(
      { error: 'Failed to create sponsorship' },
      { status: 500 }
    )
  }
}