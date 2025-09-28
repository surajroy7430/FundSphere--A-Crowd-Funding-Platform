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

export function NavMain({ mainButtons }) {
  const { open, isMobile, toggleSidebar } = useSidebar();
  const location = useLocation();

  return (
    <>
      {mainButtons.map((item) => {
        return (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel className="uppercase text-muted-foreground/60">
              {item.title}
            </SidebarGroupLabel>
            <SidebarGroupContent className={open ? 'px-2' : ''}>
              <SidebarMenu>
                {item.buttons.map((main) => {
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
