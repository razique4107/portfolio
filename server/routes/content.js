import express from 'express';
import prisma from '../db.js';

const router = express.Router();

// Get all landmarks with sources
router.get('/landmarks', async (req, res) => {
  try {
    const landmarks = await prisma.landmark.findMany({
      include: {
        sources: {
          include: {
            source: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    res.json(landmarks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch landmarks' });
  }
});

// Get landmark by slug
router.get('/landmarks/:slug', async (req, res) => {
  try {
    const landmark = await prisma.landmark.findUnique({
      where: { slug: req.params.slug },
      include: {
        sources: {
          include: {
            source: true,
          },
        },
      },
    });

    if (!landmark) {
      return res.status(404).json({ error: 'Landmark not found' });
    }

    res.json(landmark);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch landmark' });
  }
});

// Get all sources
router.get('/sources', async (req, res) => {
  try {
    const sources = await prisma.source.findMany({
      include: {
        landmarks: {
          include: {
            landmark: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    res.json(sources);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sources' });
  }
});

export default router;
