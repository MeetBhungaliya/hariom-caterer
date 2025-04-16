import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Eye } from "lucide-react"

function Sidebar({ props }) {

  const navLinks = [
    {
      title: "Project Structure",
      url: "#",
      icon: Eye
    },
    {
      title: "Routing",
      url: "#",
      icon: Eye
    },
    {
      title: "Data Fetching",
      url: "#",
      icon: Eye
    },
    {
      title: "Rendering",
      url: "#",
      icon: Eye
    }
  ]

  return (
    <SidebarComponent {...props} collapsible="icon">
      <SidebarHeader>
        {/* <VersionSwitcher
          versions={data.versions}
          defaultVersion={data.versions[0]}
        />
        <SearchForm /> */}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navLinks.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon className="min-w-6 min-h-6"/>
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </SidebarComponent>
  )
}

export { Sidebar }
