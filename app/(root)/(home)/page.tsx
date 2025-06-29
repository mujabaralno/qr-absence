import About from "@/components/landingpage/About";
import FrequentlyAskedQuestions from "@/components/landingpage/FrequentlyAskedQuestions";
import Features from "@/components/landingpage/Features";
import Hero from "@/components/landingpage/Hero";
import WhatYouGet from "@/components/landingpage/WhatYouGet";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";


export default async function Home() {

  const {  sessionClaims } = await auth()

  const role = sessionClaims?.metadata.role

  if (role === "superadmin") redirect('/superadmin')

  if(role === "admin") redirect('/admin')

  if(role === "moderator") redirect ('/')


  return (
    
    <div className="w-full overflow-x-hidden">
      <Hero />
      <About />
      <Features />
      <WhatYouGet />
      <FrequentlyAskedQuestions />
    </div>
  );
}
