"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { prisma } from "@/lib/prisma";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.warn("GEMINI_API_KEY is not set in environment variables");
}
const genAI = new GoogleGenerativeAI(apiKey || "");

export async function generateSolarEstimate(data: {
  location: string;
  tariffType: string;
  consumption: number;
  peakLoad: number;
  roofArea: number;
  roofDirection: string;
  roofTilt: string;
}) {
  const startTime = Date.now();
  try {
    if (!apiKey) {
      throw new Error("API Key not configured");
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
Anda adalah seorang Konsultan Energi AI untuk DK Power, perusahaan penyedia panel surya dan penyimpanan energi.
Berdasarkan data pelanggan berikut, hasilkan rekomendasi sistem panel surya awal yang realistis dan konservatif untuk pangsa pasar Indonesia. 
Pastikan output yang dihasilkan berbentuk JSON murni tanpa pembungkus markdown atau backticks.

Data Pelanggan:
- Lokasi: ${data.location}
- Tipe Tarif Listrik: ${data.tariffType}
- Konsumsi Bulanan: ${data.consumption} kWh
- Beban Puncak (Peak Load): ${data.peakLoad} kW
- Luas Atap: ${data.roofArea} m2
- Arah Atap: ${data.roofDirection}
- Kemiringan Atap: ${data.roofTilt} derajat

Persyaratan Output:
Kembalikan sebuah objek JSON dengan EXACT key sebagai berikut:
{
  "recommendedKwp": number (estimasi kapasitas surya dalam kWp, tidak boleh melebihi luas atap / 6, dan usahakan menyesuaikan 80% dari konsumsi / 105),
  "panelsCount": number (jumlah panel surya, asumsikan 540W per panel),
  "monthlyProduction": number (estimasi produksi bulanan dalam kWh, *yield* standar 3.5 jam/hari * 30 hari * kWp),
  "monthlySavings": number (estimasi penghematan bulanan dalam IDR, asumsi tarif standar Rp 1.500/kWh),
  "estimatedCost": number (estimasi biaya instalasi dalam IDR, harga pasar Rp 13.000.000 per kWp),
  "paybackPeriod": number (estimasi waktu balik modal dalam tahun),
  "irr": number (estimasi tingkat pengembalian internal/IRR dalam persentase),
  "confidenceScore": number (angka desimal antara 0.80 sampai 0.99 yang menunjukkan tingkat kepercayaan estimasi berdasarkan kelengkapan input)
}
Jangan masukkan teks apapun di luar objek JSON.
`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Remove markdown formatting
    const jsonStr = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsedData = JSON.parse(jsonStr);

    const processingTime = Date.now() - startTime;

    // Log to DB
    await prisma.aILog.create({
      data: {
        actionType: "SOLAR_ESTIMATE",
        inputPayload: JSON.stringify(data),
        outputPayload: JSON.stringify(parsedData),
        confidenceScore: parsedData.confidenceScore || 0.85,
        processingTime,
        isError: false
      }
    });

    return { success: true, data: parsedData };
  } catch (error) {
    const processingTime = Date.now() - startTime;
    try {
      await prisma.aILog.create({
        data: {
          actionType: "SOLAR_ESTIMATE",
          inputPayload: JSON.stringify(data),
          outputPayload: error instanceof Error ? error.message : "Unknown error",
          processingTime,
          isError: true
        }
      });
    } catch (dbError) {
      console.error("Failed to log error to DB:", dbError);
    }
    
    console.error("AI Estimate Generation Error:", error);
    return { success: false, error: "Failed to generate AI estimate." };
  }
}
