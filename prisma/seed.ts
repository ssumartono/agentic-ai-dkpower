import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding...')

  // 1. Create Users
  const user1 = await prisma.user.upsert({
    where: { email: 'admin@dkpower.id' },
    update: {},
    create: {
      email: 'admin@dkpower.id',
      name: 'Admin User',
      role: 'ADMIN',
    },
  })

  // 2. Create Customers
  const cust1 = await prisma.customer.create({
    data: {
      name: 'PT Maju Bersama',
      email: 'contact@majubersama.co.id',
      phone: '081234567890',
      company: 'PT Maju Bersama',
      type: 'COMMERCIAL',
    }
  })

  const cust2 = await prisma.customer.create({
    data: {
      name: 'Budi Santoso (Rumah Palembang)',
      email: 'budi@example.com',
      phone: '081298765432',
      type: 'RESIDENTIAL',
    }
  })

  const cust3 = await prisma.customer.create({
    data: {
      name: 'CV Sinar Abadi',
      email: 'info@sinarabadi.com',
      company: 'CV Sinar Abadi',
      type: 'COMMERCIAL',
    }
  })

  // 3. Create Leads & Opportunities
  const lead1 = await prisma.lead.create({
    data: {
      title: 'Instalasi Gudang 50 kWp',
      status: 'QUALIFIED',
      customerId: cust1.id,
      assigneeId: user1.id,
      opportunity: {
        create: {
          value: 450000000,
          stage: 'PROPOSAL',
          probability: 60,
          expectedClose: new Date(new Date().setMonth(new Date().getMonth() + 1)),
        }
      }
    }
  })

  const lead2 = await prisma.lead.create({
    data: {
      title: 'Rumah Tinggal 5 kWp Palembang',
      status: 'CONTACTED',
      customerId: cust2.id,
      opportunity: {
        create: {
          value: 75000000,
          stage: 'QUALIFICATION',
          probability: 30,
        }
      }
    }
  })

  const lead3 = await prisma.lead.create({
    data: {
      title: 'Pabrik Tekstil 200 kWp',
      status: 'NEW',
      customerId: cust3.id,
    }
  })

  const lead4 = await prisma.lead.create({
    data: {
      title: 'Kantor Cabang Sinar Abadi 20 kWp',
      status: 'QUALIFIED',
      customerId: cust3.id,
      opportunity: {
        create: {
          value: 200000000,
          stage: 'NEGOTIATION',
          probability: 80,
          expectedClose: new Date(new Date().setDate(new Date().getDate() + 15)),
        }
      }
    }
  })

  const lead5 = await prisma.lead.create({
    data: {
      title: 'Ruko Citra 6.6 kWp',
      status: 'QUALIFIED',
      customerId: cust2.id, // Reusing customer for simplicity
      opportunity: {
        create: {
          value: 85000000,
          stage: 'WON',
          probability: 100,
          expectedClose: new Date(),
          project: {
            create: {
              status: 'PLANNING',
              progress: 10,
              startDate: new Date(),
            }
          }
        }
      }
    }
  })

  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
