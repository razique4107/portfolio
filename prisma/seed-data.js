const KARACHI_LANDMARKS = [
  {
    slug: 'mazar-e-quaid',
    title: 'Mazar-e-Quaid',
    kicker: 'National Landmark',
    description: 'Karachi\'s iconic white-marble mausoleum and one of the city\'s defining landmarks.',
    imageKey: 'mazarHero',
    sectionId: 'mazar',
  },
  {
    slug: 'mohatta-palace',
    title: 'Mohatta Palace',
    kicker: 'Clifton Heritage',
    description: 'An ornate Clifton landmark associated with Karachi\'s architectural and cultural heritage.',
    imageKey: 'mohattaPalace',
    sectionId: 'heritage',
  },
  {
    slug: 'empress-market',
    title: 'Empress Market',
    kicker: 'Historic Karachi',
    description: 'A historic Saddar landmark with a distinctive market-hall facade and clock tower.',
    imageKey: 'empressMarket',
    sectionId: 'heritage',
  },
  {
    slug: 'frere-hall',
    title: 'Frere Hall',
    kicker: 'Colonial Heritage',
    description: 'An iconic historic building surrounded by gardens in central Karachi.',
    imageKey: 'frereHall',
    sectionId: 'heritage',
  },
  {
    slug: 'clifton-beach',
    title: 'Clifton Beach',
    kicker: 'Arabian Sea',
    description: 'A familiar Karachi coastline where the city meets the Arabian Sea.',
    imageKey: 'cliftonBeach',
    sectionId: 'coast',
  },
];

const KARACHI_SOURCES = [
  {
    url: 'https://commons.wikimedia.org/wiki/File:Mazar-e-Quaid_Karachi.jpg',
    title: 'Mazar-e-Quaid Photograph',
    publisher: 'Wikimedia Commons',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    attributionRequired: true,
  },
  {
    url: 'https://commons.wikimedia.org/wiki/File:Mohatta_Palace_as_viewed_from_the_front_with_the_inclusion_of_the_fountain.jpg',
    title: 'Mohatta Palace Photograph',
    publisher: 'Wikimedia Commons',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    attributionRequired: true,
  },
  {
    url: 'https://commons.wikimedia.org/wiki/File:Beautiful_view_of_Frere_Hall,_Karachi,_Pakistan.jpg',
    title: 'Frere Hall Photograph',
    publisher: 'Wikimedia Commons',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    attributionRequired: true,
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/PK_Karachi_asv2020-02_img36_Empress_Market.jpg/3840px-PK_Karachi_asv2020-02_img36_Empress_Market.jpg',
    title: 'Empress Market Photograph',
    publisher: 'Wikimedia Commons',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
    attributionRequired: true,
  },
  {
    url: 'https://commons.wikimedia.org/wiki/File:Clifton_Beach,_Karachi_-_Pakistan.jpg',
    title: 'Clifton Beach Photograph',
    publisher: 'Wikimedia Commons',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    attributionRequired: true,
  },
];

export async function seedDatabase(prisma, adminEmail, adminPassword) {
  // Import hash function
  const { hashPassword } = await import('../server/utils/crypto.js');

  console.log('Seeding database...');

  try {
    // Clean up existing data
    await prisma.landmark.deleteMany({});
    await prisma.source.deleteMany({});
    await prisma.user.deleteMany({});

    // Create admin user
    const passwordHash = await hashPassword(adminPassword);
    const adminUser = await prisma.user.create({
      data: {
        email: adminEmail,
        displayName: 'Administrator',
        passwordHash,
        role: 'ADMIN',
        emailVerifiedAt: new Date(),
      },
    });

    console.log('✓ Admin user created:', adminUser.email);

    // Create sources
    const sources = await Promise.all(
      KARACHI_SOURCES.map(source =>
        prisma.source.create({ data: source })
      )
    );

    console.log(`✓ Created ${sources.length} sources`);

    // Create landmarks
    const landmarks = await Promise.all(
      KARACHI_LANDMARKS.map(landmark =>
        prisma.landmark.create({ data: landmark })
      )
    );

    console.log(`✓ Created ${landmarks.length} landmarks`);

    // Link landmarks to sources
    for (const landmark of landmarks) {
      for (const source of sources) {
        if (shouldLinkLandmarkToSource(landmark.slug, source.url)) {
          await prisma.landmarkSource.create({
            data: {
              landmarkId: landmark.id,
              sourceId: source.id,
            },
          });
        }
      }
    }

    console.log('✓ Linked landmarks to sources');
    console.log('\n✨ Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

function shouldLinkLandmarkToSource(landmarkSlug, sourceUrl) {
  // Link landmark to corresponding image source
  if (landmarkSlug === 'mazar-e-quaid' && sourceUrl.includes('Mazar-e-Quaid')) {
    return true;
  }
  if (landmarkSlug === 'mohatta-palace' && sourceUrl.includes('Mohatta')) {
    return true;
  }
  if (landmarkSlug === 'frere-hall' && sourceUrl.includes('Frere')) {
    return true;
  }
  if (landmarkSlug === 'empress-market' && sourceUrl.includes('Empress')) {
    return true;
  }
  if (landmarkSlug === 'clifton-beach' && sourceUrl.includes('Clifton')) {
    return true;
  }
  return false;
}
