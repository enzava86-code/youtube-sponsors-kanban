import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const sponsorship = await prisma.sponsorship.findUnique({
      where: { id }
    })
    
    if (!sponsorship) {
      return NextResponse.json(
        { error: 'Sponsorship not found' },
        { status: 404 }
      )
    }
    
    const formattedSponsorship = {
      ...sponsorship,
      attachments: sponsorship.attachments ? JSON.parse(sponsorship.attachments) : []
    }
    
    return NextResponse.json(formattedSponsorship)
  } catch (error) {
    console.error('Error fetching sponsorship:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sponsorship' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const data = await request.json()
    
    const sponsorship = await prisma.sponsorship.update({
      where: { id },
      data: {
        ...data,
        attachments: data.attachments ? JSON.stringify(data.attachments) : undefined,
        lastActivity: new Date(),
        updatedAt: new Date(),
      }
    })
    
    const formattedSponsorship = {
      ...sponsorship,
      attachments: sponsorship.attachments ? JSON.parse(sponsorship.attachments) : []
    }
    
    return NextResponse.json(formattedSponsorship)
  } catch (error) {
    console.error('Error updating sponsorship:', error)
    return NextResponse.json(
      { error: 'Failed to update sponsorship' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    await prisma.sponsorship.delete({
      where: { id }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting sponsorship:', error)
    return NextResponse.json(
      { error: 'Failed to delete sponsorship' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { status } = await request.json()
    
    const sponsorship = await prisma.sponsorship.update({
      where: { id },
      data: {
        status,
        lastActivity: new Date(),
        updatedAt: new Date(),
      }
    })
    
    const formattedSponsorship = {
      ...sponsorship,
      attachments: sponsorship.attachments ? JSON.parse(sponsorship.attachments) : []
    }
    
    return NextResponse.json(formattedSponsorship)
  } catch (error) {
    console.error('Error updating sponsorship status:', error)
    return NextResponse.json(
      { error: 'Failed to update sponsorship status' },
      { status: 500 }
    )
  }
}