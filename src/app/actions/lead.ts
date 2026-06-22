"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getLeads() {
  try {
    const leads = await prisma.lead.findMany({
      include: {
        customer: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return { success: true, data: leads };
  } catch (error) {
    console.error("Failed to fetch leads:", error);
    return { success: false, error: "Failed to fetch leads" };
  }
}

export async function getLeadById(id: string) {
  try {
    const lead = await prisma.lead.findUnique({
      where: { id },
      include: {
        customer: true,
        assignee: true,
        opportunity: true,
        activities: {
          orderBy: { createdAt: "desc" }
        },
        documents: {
          orderBy: { createdAt: "desc" }
        }
      },
    });
    if (!lead) return { success: false, error: "Lead not found" };
    return { success: true, data: lead };
  } catch (error) {
    console.error("Failed to fetch lead:", error);
    return { success: false, error: "Failed to fetch lead" };
  }
}

export async function createLead(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const customerName = formData.get("customerName") as string;
    const customerEmail = formData.get("customerEmail") as string;
    const customerPhone = formData.get("customerPhone") as string;
    const customerCompany = formData.get("customerCompany") as string;
    const customerAddress = formData.get("customerAddress") as string;

    if (!title || !customerName) {
      return { success: false, error: "Title and Customer Name are required" };
    }

    // Upsert or create customer
    let customer = await prisma.customer.findFirst({
      where: { name: customerName },
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          name: customerName,
          email: customerEmail,
          phone: customerPhone,
          company: customerCompany,
          address: customerAddress,
        },
      });
    }

    const lead = await prisma.lead.create({
      data: {
        title,
        customerId: customer.id,
        status: "NEW",
      },
    });

    revalidatePath("/dashboard/leads");
    return { success: true, data: lead };
  } catch (error) {
    console.error("Failed to create lead:", error);
    return { success: false, error: "Failed to create lead" };
  }
}

export async function updateLeadStatus(id: string, status: string) {
  try {
    const lead = await prisma.lead.update({
      where: { id },
      data: { status },
    });
    revalidatePath("/dashboard/leads");
    revalidatePath(`/dashboard/leads/${id}`);
    return { success: true, data: lead };
  } catch (error) {
    console.error("Failed to update lead status:", error);
    return { success: false, error: "Failed to update lead status" };
  }
}

export async function addNoteToLead(id: string, noteText: string) {
  try {
    const lead = await prisma.lead.findUnique({
      where: { id }
    });
    if (!lead) return { success: false, error: "Lead not found" };

    const currentNotes = lead.notes || "";
    const newNotes = currentNotes 
      ? `${currentNotes}\n\n--- ${new Date().toLocaleString()} ---\n${noteText}`
      : `--- ${new Date().toLocaleString()} ---\n${noteText}`;

    await prisma.lead.update({
      where: { id },
      data: { notes: newNotes }
    });

    revalidatePath(`/dashboard/leads/${id}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to add note to lead:", error);
    return { success: false, error: "Failed to add note to lead" };
  }
}

export async function addLeadActivity(
  leadId: string, 
  data: { type: string; subject: string; description?: string; date?: Date }
) {
  try {
    const activity = await prisma.leadActivity.create({
      data: {
        leadId,
        type: data.type,
        subject: data.subject,
        description: data.description,
        date: data.date || new Date(),
      }
    });
    revalidatePath(`/dashboard/leads/${leadId}`);
    return { success: true, data: activity };
  } catch (error) {
    console.error("Failed to add activity:", error);
    return { success: false, error: "Failed to add activity" };
  }
}

export async function addLeadDocument(
  leadId: string,
  data: { name: string; url: string; type: string }
) {
  try {
    const doc = await prisma.leadDocument.create({
      data: {
        leadId,
        name: data.name,
        url: data.url,
        type: data.type,
      }
    });
    revalidatePath(`/dashboard/leads/${leadId}`);
    return { success: true, data: doc };
  } catch (error) {
    console.error("Failed to add document:", error);
    return { success: false, error: "Failed to add document" };
  }
}

export async function convertLeadToOpportunity(
  leadId: string, 
  data: { value: number; expectedClose: Date; probability: number }
) {
  try {
    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      include: { opportunity: true }
    });

    if (!lead) return { success: false, error: "Lead not found" };
    if (lead.opportunity) return { success: false, error: "Lead already converted to opportunity" };

    const opportunity = await prisma.opportunity.create({
      data: {
        leadId,
        value: data.value,
        expectedClose: data.expectedClose,
        probability: data.probability,
        stage: "QUALIFICATION",
      }
    });

    // Update status lead menjadi QUALIFIED karena sudah convert
    await prisma.lead.update({
      where: { id: leadId },
      data: { status: "QUALIFIED" }
    });

    revalidatePath("/dashboard/leads");
    revalidatePath(`/dashboard/leads/${leadId}`);
    
    return { success: true, data: opportunity };
  } catch (error) {
    console.error("Failed to convert lead to opportunity:", error);
    return { success: false, error: "Failed to convert lead to opportunity" };
  }
}

export async function updateLead(leadId: string, customerId: string, formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const customerName = formData.get("customerName") as string;
    const customerEmail = formData.get("customerEmail") as string;
    const customerPhone = formData.get("customerPhone") as string;
    const customerCompany = formData.get("customerCompany") as string;
    const customerAddress = formData.get("customerAddress") as string;

    if (!title || !customerName) {
      return { success: false, error: "Title and Customer Name are required" };
    }

    await prisma.customer.update({
      where: { id: customerId },
      data: {
        name: customerName,
        email: customerEmail,
        phone: customerPhone,
        company: customerCompany,
        address: customerAddress,
      }
    });

    const lead = await prisma.lead.update({
      where: { id: leadId },
      data: { title }
    });

    revalidatePath("/dashboard/leads");
    revalidatePath(`/dashboard/leads/${leadId}`);
    return { success: true, data: lead };
  } catch (error) {
    console.error("Failed to update lead:", error);
    return { success: false, error: "Failed to update lead" };
  }
}

export async function deleteLead(leadId: string) {
  try {
    await prisma.lead.delete({
      where: { id: leadId }
    });
    
    revalidatePath("/dashboard/leads");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete lead:", error);
    return { success: false, error: "Failed to delete lead" };
  }
}

import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function generateLeadAssessmentAI(leadId: string) {
  try {
    if (!genAI) {
      throw new Error("API Key not configured");
    }

    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      include: { customer: true }
    });

    if (!lead) return { success: false, error: "Lead not found" };

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
Anda adalah seorang Konsultan Energi AI untuk DK Power.
Lakukan asesmen terhadap prospek (lead) berikut dan hasilkan sebuah proposal sistem tenaga surya yang realistis.
Pastikan output yang dihasilkan BUKAN teks biasa, melainkan format JSON murni tanpa pembungkus markdown atau backticks.
Gunakan Bahasa Indonesia yang profesional dan persuasif pada field deskriptif (misalnya di "analysis" dan "nextActions").

Informasi Prospek:
- Judul: ${lead.title}
- Nama Pelanggan: ${lead.customer.name}
- Industri/Tipe: ${lead.customer.type}
- Lokasi Pelanggan: ${lead.customer.address || "Tidak diketahui"}
- Catatan Sebelumnya: ${lead.notes || "Tidak ada catatan"}

Persyaratan Output (Harus berformat JSON dengan struktur ini secara persis):
{
  "systemSize": "string (misal: 50 kWp On-Grid)",
  "investment": "string (misal: Rp 650.000.000)",
  "saving": "string (misal: Rp 17.500.000 / bulan)",
  "payback": "string (misal: 5.2 Tahun)",
  "roi": "string (misal: 18.7%)",
  "probability": number (angka bulat 0-100 yang menunjukkan probabilitas keberhasilan proyek berdasarkan kelengkapan data),
  "analysis": "string (satu paragraf deskriptif dalam Bahasa Indonesia yang menjelaskan alasan di balik asesmen ini secara meyakinkan)",
  "nextActions": [
    {"label": "string (dalam Bahasa Indonesia)", "iconType": "string (pilih dari: Calendar, FileText, MessageCircle, Lock)"}
  ]
}
`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const jsonStr = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsedData = JSON.parse(jsonStr);

    const updatedLead = await prisma.lead.update({
      where: { id: leadId },
      data: {
        aiAssessment: JSON.stringify(parsedData)
      }
    });

    revalidatePath(`/dashboard/leads/${leadId}`);
    return { success: true, data: updatedLead };
  } catch (error) {
    console.error("AI Lead Assessment Error:", error);
    return { success: false, error: "Failed to generate AI assessment." };
  }
}

export async function createLeadFromCalculator(data: {
  customerName: string;
  customerCompany: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  calculatorResults: any;
}) {
  try {
    let customer = await prisma.customer.findFirst({
      where: { name: data.customerName },
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          name: data.customerName,
          email: data.customerEmail,
          phone: data.customerPhone,
          company: data.customerCompany,
          address: data.customerAddress,
        },
      });
    }

    const formatCurrency = (val: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(val);

    const res = data.calculatorResults;
    const calculatorInfo = `[SIMULATOR AWAL] Pelanggan telah mencoba Solar Calculator.
Kapasitas Rekomendasi: ${res.recommendedKwp.toFixed(0)} kWp
Estimasi Biaya: ${formatCurrency(res.estimatedCost)}
Estimasi Penghematan: ${formatCurrency(res.monthlySavings)} / bulan
Payback Period: ${res.paybackPeriod.toFixed(1)} Tahun
IRR: ${res.irr.toFixed(1)}%`;

    const lead = await prisma.lead.create({
      data: {
        title: `Prospek Panel Surya ${res.recommendedKwp.toFixed(0)} kWp`,
        customerId: customer.id,
        status: "NEW",
        notes: calculatorInfo
      },
    });

    await prisma.leadActivity.create({
      data: {
        leadId: lead.id,
        type: "SYSTEM_LOG",
        subject: "Lead Dibuat dari Kalkulator Surya",
        description: `Menyimpan data awal sebesar ${res.recommendedKwp.toFixed(0)} kWp. Perlu validasi Sales dan AI Assessment.`
      }
    });

    revalidatePath("/dashboard/leads");
    return { success: true, data: lead };
  } catch (error) {
    console.error("Failed to create lead from calculator:", error);
    return { success: false, error: "Failed to create lead" };
  }
}

