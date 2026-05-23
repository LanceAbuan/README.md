import { NextResponse } from "next/server";
import { getAllBlogMetas } from "@/lib/blog";

export async function GET() {
  return NextResponse.json(getAllBlogMetas());
}
