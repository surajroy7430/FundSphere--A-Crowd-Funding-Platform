import { Link } from "react-router-dom";
import { useSidebar } from "@/components/ui/sidebar";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const logo = "https://i.ibb.co/fV4tvz2F/Fund-Sphere-small.webp";

export function DashboardLogo() {
  const { isMobile, toggleSidebar } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Link
          to="/dashboard"
          onClick={() => {
            if (isMobile) toggleSidebar();
          }}
        >
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <div className="bg-secondary p-0.5 flex aspect-square size-8 items-center justify-center rounded-lg">
              <img
                src={logo}
                alt="FS"
                className="h-full w-auto object-contain"
                loading="eager"
              />
            </div>
            <div className="flex-1 font-medium text-emerald-700">
              FundSphere
            </div>
          </SidebarMenuButton>
        </Link>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
