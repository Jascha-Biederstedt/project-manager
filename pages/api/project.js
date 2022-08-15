import { getSession } from 'next-auth/react';

import prisma from 'lib/prisma';

const handler = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(501).end();
  }

  const session = await getSession({ req });
  if (!session) return res.status(401).json({ message: 'Not logged in' });

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  if (!user) return res.status(401).json({ message: 'User not found' });

  await prisma.project.create({
    data: {
      name: req.body.name,
      owner: {
        connect: { id: user.id },
      },
    },
  });

  res.end();
};

export default handler;
