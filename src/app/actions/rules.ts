"use server"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function toggleRule(id: string, currentStatus: boolean) {
  try {
    await prisma.aIGovernanceRule.update({
      where: { id },
      data: { isActive: !currentStatus }
    })
    revalidatePath("/dashboard/insights")
    return { success: true }
  } catch(error) {
    return { success: false, error: "Failed to toggle rule" }
  }
}
