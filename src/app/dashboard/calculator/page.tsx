import { SolarCalculator } from "@/components/calculator/SolarCalculator";

export default async function CalculatorPage() {
  return (
    <div className="w-full flex flex-col space-y-6">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold text-emerald-600 tracking-tight">3. Solar Estimator & Design</h1>
      </div>
      
      <SolarCalculator />
    </div>
  );
}
