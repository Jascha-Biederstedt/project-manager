import { getSession } from 'next-auth/react';

import prisma from 'lib/prisma';

const handler = async (req, res) => {
  if (req.method !== 'POST' && req.method !== 'DELETE') {
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

  if (req.method === 'POST') {
    await prisma.todo.create({
      data: {
        name: req.body.name,
        project: {
          connect: { id: req.body.project_id },
        },
      },
    });
  }

  if (req.method === 'DELETE') {
    await prisma.todo.deleteMany({
      where: {
        id: req.body.id,
        project: {
          owner: {
            id: user.id,
          },
        },
      },
    });
  }

  res.end();
};

export default handler;
