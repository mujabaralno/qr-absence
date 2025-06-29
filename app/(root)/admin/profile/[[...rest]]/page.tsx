import { UserProfile } from "@clerk/nextjs";

export default function Home() {
    return (
       <div className="w-full">
         <UserProfile />
       </div>
    );
}