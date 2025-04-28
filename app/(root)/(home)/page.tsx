import { UserButton } from "@clerk/nextjs";


export default function Home() {
  return (
    <div className="w-full min-h-screen flex justify-center items-center">
      <h1>Welcome</h1>
      <UserButton />
    </div>
  );
}
