import { NextResponse } from "next/server";
import { getUserWorkspaceRole } from "@/lib/workspace-role";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id: workspaceId } = await context.params;

  const role = await getUserWorkspaceRole(workspaceId);

  if (!role) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ role });
}