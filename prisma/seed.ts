import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const sampleSponsorships = [
  {
    title: "Integración de Producto Tech",
    brandName: "TechCorp",
    contactPerson: "Ana García",
    contactEmail: "ana@techcorp.com",
    type: "integration",
    category: "tecnología",
    description: "Demostración del nuevo gadget tech en video principal",
    monetaryValue: 1500,
    currency: "EUR",
    status: "prospect",
    priority: "high",
    deliveryDate: new Date("2024-12-15"),
    startDate: new Date("2024-11-01"),
    publishDate: new Date("2024-12-20"),
    paymentMethod: "bank_transfer",
    progressPercentage: 0,
    notes: "Cliente potencial muy interesado",
    lastActivity: new Date("2024-11-10")
  },
  {
    title: "Review Gaming Headset",
    brandName: "SoundMax",
    contactPerson: "Carlos Ruiz",
    contactEmail: "carlos@soundmax.com",
    type: "video",
    category: "gaming",
    description: "Review completo de los nuevos auriculares gaming",
    monetaryValue: 800,
    currency: "EUR",
    status: "negotiation",
    priority: "medium",
    deliveryDate: new Date("2024-11-25"),
    publishDate: new Date("2024-12-01"),
    paymentMethod: "paypal",
    progressPercentage: 25,
    notes: "Negociando términos del contrato",
    lastActivity: new Date("2024-11-12")
  },
  {
    title: "Colaboración Fitness App",
    brandName: "FitLife",
    contactPerson: "María López",
    contactEmail: "maria@fitlife.com",
    type: "video",
    category: "fitness",
    description: "Tutorial de rutina fitness usando la app",
    monetaryValue: 1200,
    currency: "EUR",
    status: "contract_signed",
    priority: "high",
    deliveryDate: new Date("2024-11-20"),
    startDate: new Date("2024-11-15"),
    publishDate: new Date("2024-11-25"),
    paymentMethod: "bank_transfer",
    progressPercentage: 60,
    notes: "Contrato firmado, iniciando producción",
    lastActivity: new Date("2024-11-14")
  },
  {
    title: "Showcase Software Design",
    brandName: "DesignPro",
    contactPerson: "Pablo Martín",
    contactEmail: "pablo@designpro.com",
    type: "video",
    category: "diseño",
    description: "Demostración de herramientas de diseño professional",
    monetaryValue: 2000,
    currency: "EUR",
    status: "content_production",
    priority: "urgent",
    deliveryDate: new Date("2024-11-18"),
    startDate: new Date("2024-11-10"),
    publishDate: new Date("2024-11-22"),
    paymentMethod: "bank_transfer",
    progressPercentage: 80,
    notes: "En post-producción, entrega pronto",
    lastActivity: new Date("2024-11-16")
  },
  {
    title: "Unboxing Smartphone",
    brandName: "TechMobile",
    contactPerson: "Laura Fernández",
    contactEmail: "laura@techmobile.com",
    type: "video",
    category: "tecnología",
    description: "Unboxing y primera impresión del nuevo smartphone",
    monetaryValue: 900,
    currency: "EUR",
    status: "published",
    priority: "medium",
    deliveryDate: new Date("2024-11-05"),
    publishDate: new Date("2024-11-08"),
    paymentMethod: "paypal",
    progressPercentage: 100,
    notes: "Contenido publicado exitosamente",
    lastActivity: new Date("2024-11-08")
  }
]

async function main() {
  console.log('Starting seed...')
  
  // Clear existing data
  await prisma.sponsorship.deleteMany()
  
  // Create sample sponsorships
  for (const sponsorship of sampleSponsorships) {
    await prisma.sponsorship.create({
      data: {
        ...sponsorship,
        attachments: '[]'
      }
    })
  }
  
  console.log('Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })