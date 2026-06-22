"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getPipeline() {
  try {
    const opportunities = await prisma.opportunity.findMany({
      include: {
        lead: {
          include: {
            customer: true,
            assignee: true,
          }
        }
      },
      orderBy: {
        updatedAt: "desc"
      }
    });
    
    return { success: true, data: opportunities };
  } catch (error) {
    console.error("Failed to fetch pipeline:", error);
    return { success: false, error: "Failed to fetch pipeline" };
  }
}

export async function updateOpportunityStage(id: string, stage: string) {
  try {
    const opportunity = await prisma.opportunity.update({
      where: { id },
      data: { stage }
    });

    // We might also want to update the lead status if it's WON or LOST
    if (stage === "WON" || stage === "LOST") {
      await prisma.lead.update({
        where: { id: opportunity.leadId },
        data: { status: stage }
      });
      
      if (stage === "WON") {
        await prisma.project.upsert({
          where: { opportunityId: id },
          update: {},
          create: {
            opportunityId: id,
            status: "PLANNING",
            progress: 0,
          }
        });
      }
    }

    revalidatePath("/dashboard/pipeline");
    return { success: true, data: opportunity };
  } catch (error) {
    console.error("Failed to update opportunity stage:", error);
    return { success: false, error: "Failed to update opportunity stage" };
  }
}
