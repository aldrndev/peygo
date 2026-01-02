"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex w-full items-center gap-2 p-1.5",
      "bg-slate-100 dark:bg-slate-800",
      "rounded-xl border border-slate-200 dark:border-slate-700",
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      // Base
      "inline-flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-lg",
      "px-4 py-2.5 text-sm font-medium",
      "transition-all duration-200 ease-out",
      "focus-visible:outline-none",
      "disabled:pointer-events-none disabled:opacity-50",

      // ICON — wajib supaya icon selalu kelihatan
      "[&>svg]:h-4 [&>svg]:w-4 [&>svg]:shrink-0",

      // Inactive
      "text-slate-600 dark:text-slate-400",
      "hover:text-slate-900 dark:hover:text-slate-100",
      "hover:bg-slate-200/50 dark:hover:bg-slate-700/50",

      // Active
      "data-[state=active]:!bg-orange-600",
      "data-[state=active]:!text-white",
      "data-[state=active]:!font-semibold",

      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-3 ring-offset-background focus-visible:outline-none",
      "data-[state=inactive]:hidden",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
