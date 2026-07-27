import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { assertAdmin } from "@/lib/adminAuth";

export async function GET(req: NextRequest) {
  if (!assertAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const client = await clientPromise;
    const db = client.db("intellex");
    const registrations = await db
      .collection("registrations")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    // Serialize _id to string so Next.js can JSON-encode it
    const data = registrations.map((r) => ({
      ...r,
      _id: r._id.toString(),
    }));

    return NextResponse.json(data);
  } catch (error) {
    console.error("Admin fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
