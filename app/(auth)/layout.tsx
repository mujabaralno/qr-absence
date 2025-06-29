
export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="bg-[#F8F8FF]">
      <div className="flex justify-center items-center">{children}</div>
    </section>
  );
}
