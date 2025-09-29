"use client";

import { Link, useLocation } from "react-router-dom";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "../context/AuthContext";

export function NavMain({ mainButtons }) {
  const { user } = useAuth();
  const { open, isMobile, toggleSidebar } = useSidebar();
  const location = useLocation();

  return (
    <>
      {mainButtons.map((item) => {
        const filteredButtons = item.buttons.filter((btn) => {
          if (!btn?.userTypes) return true;

          return user?.userType?.some((type) => btn?.userTypes.includes(type));
        });

        if (filteredButtons.length === 0) return null;

        return (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel className="uppercase text-muted-foreground/60">
              {item.title}
            </SidebarGroupLabel>
            <SidebarGroupContent className={open ? "px-2" : ""}>
              <SidebarMenu>
                {filteredButtons.map((main) => {
                  const isActive = location.pathname === main.path;

                  return (
                    <SidebarMenuItem key={main.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={{ children: main.title, hidden: open }}
                        className="group/menu-button gap-3 h-9 rounded-md 
                          bg-gradient-to-r hover:bg-transparent hover:from-sidebar-accent 
                          hover:to-sidebar-accent/40 data-[active=true]:from-primary/20 
                          data-[active=true]:to-primary/5 [&>svg]:size-auto"
                      >
                        <Link
                          to={main.path}
                          onClick={() => {
                            if (isMobile) toggleSidebar();
                          }}
                          className="cursor-default"
                        >
                          {main.icon && (
                            <main.icon
                              size={20}
                              aria-hidden="true"
                              className="text-muted-foreground/60 group-data-[active=true]/menu-button:text-emerald-500"
                            />
                          )}
                          <span>{main.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        );
      })}
    </>
  );
}
