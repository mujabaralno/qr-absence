import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, context: { params: { id: string } }) {
  const { params } = context;
  const organizationId = params.id; // Ambil organizationId dari URL params

  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const url = "https://api.clerk.com/v1/invitations";
  const apiKey = process.env.CLERK_SECRET_KEY;

  const data = {
    email_address: email,
    public_metadata: {
      role: "admin",
      approved: true,
      organizationId: organizationId,
    },
    private_metadata: {
      notes: "Some private notes",
    },
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      return NextResponse.json({ message: "Undangan berhasil dikirim!" }, { status: 200 });
    } else {
      const errorData = await response.json();
      console.error('Error response from Clerk API:', errorData);
      return NextResponse.json({ error: errorData.error ?? "Terjadi kesalahan" }, { status: 400 });
    }
  } catch (err) {
    console.error('Error caught during fetch:', err);
    return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 });
  }
}

