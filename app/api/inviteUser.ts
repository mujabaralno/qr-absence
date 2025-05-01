// pages/api/inviteUser.ts

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const url = 'https://api.clerk.com/v1/invitations';
  const apiKey = process.env.CLERK_SECRET_KEY; // Secret Key hanya diakses di server

  const data = {
    email_address: email,
    public_metadata: {
      role: 'admin',
      approved: true,
      userId: String,
      organizationId: "680f080a55152d293170134f",
      organizationName: "hima apalah"
    },
    private_metadata: {
      notes: 'Some private notes'
    }
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      return res.status(200).json({ message: 'Undangan berhasil dikirim!' });
    } else {
      const errorData = await response.json();
      return res.status(400).json({ error: errorData.error ?? 'Terjadi kesalahan' });
    }
  } catch (err) {
    return console.log(err)
  }
}
