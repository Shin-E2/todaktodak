import { useRouter, usePathname } from "next/navigation";
import { Calendar, BarChart2, User, BookOpen, BookHeart } from "lucide-react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import UserProfileSection from "./components/sideBar/UserProfileSection";

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
}

const NAV_ITEMS: NavItem[] = [
  { icon: BookHeart, label: "나의 일기", path: "/diary" },
  { icon: Calendar, label: "감정 캘린더", path: "/calendar" },
  { icon: BarChart2, label: "감정 통계", path: "/statistics" },
  { icon: BookOpen, label: "공개 일기", path: "/community" },
  { icon: User, label: "상담사 찾기", path: "/counselors" },
];

export default function SideBar() {
  const router = useRouter();
  const pathname = usePathname();

  // 로그인한 사용자 정보
  const { data: session } = useSession();

  return (
    <aside className="fixed top-0 left-0 w-64 h-full bg-white border-r border-gray-200">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="px-4 py-6 flex justify-center ">
          <Image
            src="/images/todak_logo.png"
            width={170}
            height={100}
            alt="logo"
            onClick={() => router.push("/home")}
          />
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-2">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={`flex items-center w-full px-4 py-3 text-left rounded-lg hover:bg-indigo-50 group ${
                pathname === item.path ? "bg-indigo-100" : ""
              }`}
            >
              <item.icon
                className={`w-5 h-5 mr-3 ${
                  pathname === item.path
                    ? "text-indigo-600"
                    : "text-gray-500 group-hover:text-indigo-600"
                }`}
              />
              <span
                className={
                  pathname === item.path
                    ? "text-indigo-600"
                    : "text-gray-700 group-hover:text-indigo-600"
                }
              >
                {item.label}
              </span>
            </button>
          ))}
        </nav>

        {/* User Profile */}
        <UserProfileSection session={session} />
      </div>
    </aside>
  );
}
