const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding dummy pipeline data...');

  // 1. Create a dummy user as assignee
  let user = await prisma.user.findFirst();
  if (!user) {
    user = await prisma.user.create({
      data: {
        name: 'Rudi Hermawan',
        email: 'rudi@dkpower.id',
        role: 'SALES',
      }
    });
  }

  const dummyData = [
    { customer: 'PT Berkah Energi', type: 'B2B', address: 'Kawasan Industri Cikarang', title: 'PLTS Atap Pabrik 100kWp', value: 1200000000, stage: 'QUALIFICATION', probability: 30 },
    { customer: 'Bapak Budi Santoso', type: 'RESIDENTIAL', address: 'Pondok Indah, Jakarta', title: 'Solar Home System 10kWp', value: 150000000, stage: 'PROPOSAL', probability: 60 },
    { customer: 'PT Maju Terus', type: 'B2B', address: 'Surabaya Industrial Estate', title: 'PLTS Hybrid 50kWp', value: 750000000, stage: 'NEGOTIATION', probability: 80 },
    { customer: 'Ibu Ratna', type: 'RESIDENTIAL', address: 'BSD City', title: 'PLTS 5kWp', value: 85000000, stage: 'QUALIFICATION', probability: 20 },
    { customer: 'Hotel Grand Jaya', type: 'B2B', address: 'Bali', title: 'PLTS Atap Hotel 200kWp', value: 2500000000, stage: 'WON', probability: 100 },
  ];

  for (const item of dummyData) {
    // Upsert customer
    const customer = await prisma.customer.create({
      data: {
        name: item.customer,
        type: item.type,
        address: item.address,
      }
    });

    // Create lead
    const lead = await prisma.lead.create({
      data: {
        title: item.title,
        customerId: customer.id,
        status: item.stage === 'WON' ? 'WON' : 'QUALIFIED',
        assigneeId: user.id,
      }
    });

    // Create opportunity
    await prisma.opportunity.create({
      data: {
        leadId: lead.id,
        value: item.value,
        stage: item.stage,
        probability: item.probability,
        expectedClose: new Date(new Date().setMonth(new Date().getMonth() + 1)), // next month
      }
    });
  }

  console.log('Dummy pipeline data seeded successfully!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
