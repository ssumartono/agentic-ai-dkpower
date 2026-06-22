"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "");

export async function createTask(data: { projectId: string; title: string; description?: string; priority?: string; status?: string; dueDate?: Date }) {
  try {
    const task = await prisma.projectTask.create({ data });
    revalidatePath(`/dashboard/projects/${data.projectId}`);
    return { success: true, data: task };
  } catch (error: any) {
    console.error("Failed to create task:", error);
    return { success: false, error: error.message || "Failed to create task" };
  }
}

export async function updateTask(id: string, projectId: string, data: Partial<{ title: string; description: string; priority: string; status: string; dueDate: Date }>) {
  try {
    const task = await prisma.projectTask.update({
      where: { id },
      data
    });
    revalidatePath(`/dashboard/projects/${projectId}`);
    return { success: true, data: task };
  } catch (error: any) {
    console.error("Failed to update task:", error);
    return { success: false, error: error.message || "Failed to update task" };
  }
}

export async function deleteTask(id: string, projectId: string) {
  try {
    await prisma.projectTask.delete({ where: { id } });
    revalidatePath(`/dashboard/projects/${projectId}`);
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete task:", error);
    return { success: false, error: error.message || "Failed to delete task" };
  }
}

export async function generateProjectTasksAI(projectId: string, projectContext: string) {
  try {
    if (!apiKey) throw new Error("GEMINI_API_KEY is not set. Please configure it in .env");

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
Anda adalah seorang Manajer Proyek ahli untuk perusahaan instalasi Panel Surya (PLTS).
Berdasarkan konteks proyek berikut, hasilkan sebuah daftar berisi 4 hingga 6 tugas (*tasks*) logis yang perlu segera dilakukan (tindakan selanjutnya).
Berikan judul tugas yang realistis, deskripsi singkat, dan tingkat prioritas dalam Bahasa Indonesia (meskipun value prioritas tetap bahasa Inggris).
Pastikan output HANYA sebuah array JSON, tanpa teks tambahan atau pembungkus markdown (tanpa backticks).

Konteks Proyek:
${projectContext}

Skema JSON untuk setiap item pada array:
{
  "title": "string (Judul Tugas dalam Bahasa Indonesia)",
  "description": "string (Deskripsi Tugas dalam Bahasa Indonesia)",
  "priority": "string (pilih salah satu: LOW, MEDIUM, HIGH)"
}
`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Clean markdown if AI mistakenly wraps in markdown
    const jsonStr = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const tasksData = JSON.parse(jsonStr);

    if (!Array.isArray(tasksData)) {
      throw new Error("AI did not return an array of tasks");
    }

    // Assign default dueDate and status, and map to bulk insert
    const insertData = tasksData.map((t: any, index: number) => ({
      projectId,
      title: t.title,
      description: t.description || "",
      priority: t.priority === "LOW" || t.priority === "MEDIUM" || t.priority === "HIGH" ? t.priority : "MEDIUM",
      status: "TODO",
      dueDate: new Date(Date.now() + 86400000 * (index + 2)) // cascade due dates +2 days
    }));

    await prisma.projectTask.createMany({ data: insertData });
    revalidatePath(`/dashboard/projects/${projectId}`);

    return { success: true, count: insertData.length };
  } catch (error: any) {
    console.error("AI Task Gen Error:", error);
    return { success: false, error: error.message || "Failed to generate tasks" };
  }
}
