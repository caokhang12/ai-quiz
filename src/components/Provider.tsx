"use client";
import { SessionProvider } from "next-auth/react";
import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const Provider = ({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) => {
  return (
    <QueryClientProvider client={queryClient}>
      <NextThemesProvider {...props}>
        <SessionProvider>{children}</SessionProvider>
      </NextThemesProvider>
    </QueryClientProvider>
  );
};

export default Provider;
