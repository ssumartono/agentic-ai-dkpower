export default function DocumentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-100 print:bg-white flex justify-center py-8 print:py-0">
      {children}
    </div>
  );
}
