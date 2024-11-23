import RBACDashboard from "@/components/rbacDashboard";
import Image from "next/image";
import Link from "next/link";
export default function Home() {
  return (
    <div>
      <RBACDashboard/>
      <div className="p-10 max-w-6xl mx-auto">
        <div className="flex max-sm:flex-col gap-3 items-center justify-between">
          <Link href={"/thanks"} className="text-blue-500 hover:text-blue-700 underline underline-offset-4">Thank You</Link>
          <div className="flex items-center gap-2">
            <p className="text-sm">
              Designed and Developed By
            </p>
            <span className="flex items-center gap-2 w-fit p-1 rounded-lg hover:-translate-y-1 transition-all">
              <Image
                src="https://pbs.twimg.com/profile_images/1757030393558061056/GVDD2GeM_400x400.jpg" 
                alt="avatar" 
                className="h-5 w-5 rounded-full"
                width={20}
                height={20}
              />
              <Link href="https://him4nshu.vercel.app" target="_blank" className="text-blue-500 hover:text-blue-700 underline underline-offset-4 text-sm ">
                Himanshu
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
