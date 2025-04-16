import AdminSideBar from "@/components/layouts/AdminSidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

    <AdminSideBar>
        {children}
    </AdminSideBar>
 
  );
}
