"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getProjects() {
  try {
    const projects = await prisma.project.findMany({
      include: {
        opportunity: {
          include: {
            lead: {
              include: {
                customer: true,
                assignee: true,
              }
            }
          }
        }
      },
      orderBy: {
        updatedAt: "desc"
      }
    });
    
    return { success: true, data: projects };
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return { success: false, error: "Failed to fetch projects" };
  }
}

export async function updateProjectProgress(id: string, progress: number, status?: string) {
  try {
    const data: any = { progress };
    if (status) {
      data.status = status;
    }

    const project = await prisma.project.update({
      where: { id },
      data
    });

    revalidatePath("/dashboard/projects");
    return { success: true, data: project };
  } catch (error) {
    console.error("Failed to update project:", error);
    return { success: false, error: "Failed to update project" };
  }
}

export async function getProjectById(id: string) {
  try {
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        tasks: {
          orderBy: { createdAt: "desc" }
        },
        issues: {
          orderBy: { createdAt: "desc" }
        },
        opportunity: {
          include: {
            lead: {
              include: {
                customer: true,
                assignee: true,
              }
            }
          }
        }
      }
    });
    
    if (!project) return { success: false, error: "Project not found" };
    
    return { success: true, data: project };
  } catch (error) {
    console.error("Failed to fetch project:", error);
    return { success: false, error: "Failed to fetch project" };
  }
}

export async function getAllTasks() {
  try {
    const tasks = await prisma.projectTask.findMany({
      include: {
        project: {
          include: {
            opportunity: {
              include: {
                lead: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });
    return { success: true, data: tasks };
  } catch (error) {
    console.error("Failed to fetch tasks:", error);
    return { success: false, error: "Failed to fetch tasks" };
  }
}

export async function getAllIssues() {
  try {
    const issues = await prisma.projectIssue.findMany({
      include: {
        project: {
          include: {
            opportunity: {
              include: {
                lead: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });
    return { success: true, data: issues };
  } catch (error) {
    console.error("Failed to fetch issues:", error);
    return { success: false, error: "Failed to fetch issues" };
  }
}

export async function seedTasksAndIssuesIfNeeded() {
  try {
    const count = await prisma.projectTask.count();
    if (count === 0) {
      const projects = await prisma.project.findMany();
      if (projects.length > 0) {
        const pId = projects[0].id;
        await prisma.projectTask.createMany({
          data: [
            { projectId: pId, title: "Survey Lokasi Atap (Detailed)", status: "DONE", priority: "HIGH", dueDate: new Date() },
            { projectId: pId, title: "Pengurusan Izin PLN (SLO)", status: "IN_PROGRESS", priority: "HIGH", dueDate: new Date(Date.now() + 86400000*3) },
            { projectId: pId, title: "Pemesanan Panel Surya Tier 1", status: "TODO", priority: "MEDIUM", dueDate: new Date(Date.now() + 86400000*7) },
            { projectId: pId, title: "Instalasi Mounting Structure", status: "TODO", priority: "HIGH", dueDate: new Date(Date.now() + 86400000*14) }
          ]
        });
        await prisma.projectIssue.createMany({
          data: [
            { projectId: pId, title: "Akses Atap Terkendala", description: "Butuh scaffolding tambahan karena atap gudang terlalu tinggi.", status: "OPEN", severity: "MAJOR" },
            { projectId: pId, title: "Keterlambatan Pengiriman Inverter", description: "Stok gudang pusat kosong, menunggu restock 2 hari.", status: "RESOLVED", severity: "MINOR" },
            { projectId: pId, title: "Dokumen SLD Belum Disetujui", description: "Perlu revisi minor pada Single Line Diagram.", status: "IN_PROGRESS", severity: "MEDIUM" }
          ]
        });
      }
    }
  } catch (e) {
    console.error("Seed failed:", e);
  }
}
