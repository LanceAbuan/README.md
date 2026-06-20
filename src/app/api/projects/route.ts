import { NextResponse } from "next/server";
import { fetchGitHubRepos } from "@/lib/github";

export async function GET() {
  const projects = await fetchGitHubRepos();
  return NextResponse.json(projects);
}
