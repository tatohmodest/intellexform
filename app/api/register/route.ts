import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      fullName,
      email,
      phone,
      city,
      ageRange,
      program,
      learningMode,
      startDate,
      experienceLevel,
      occupation,
      motivation,
      referralSource,
    } = body;

    // Basic validation
    if (!fullName || !email || !program) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("intellex");
    const collection = db.collection("registrations");

    const doc = {
      fullName,
      email,
      phone,
      city,
      ageRange,
      program,
      learningMode,
      startDate,
      experienceLevel,
      occupation,
      motivation,
      referralSource,
      createdAt: new Date(),
    };

    const result = await collection.insertOne(doc);

    return NextResponse.json({ success: true, id: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
