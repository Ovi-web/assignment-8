"use client";

import * as React from "react";
import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import { cn } from "cn";

function DropdownMenu({ children, ...props }) {
  return <MenuPrimitive.Root {...props}>{children}</MenuPrimitive.Root>;
}

function DropdownMenuTrigger({ className, children, ...props }) {
  return (
    <MenuPrimitive.Trigger
      data-slot="dropdown-menu-trigger"
      className={cn("outline-none", className)}
      {...props}
    >
      {children}
    </MenuPrimitive.Trigger>
  );
}

function DropdownMenuPortal({ children, ...props }) {
  return <MenuPrimitive.Portal {...props}>{children}</MenuPrimitive.Portal>;
}

function DropdownMenuContent({ className, children, ...props }) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Positioner
        data-slot="dropdown-menu-positioner"
        className="z-50"
        {...props}
      >
        <MenuPrimitive.Popup
          data-slot="dropdown-menu-content"
          className={cn(
            "z-50 min-w-52 origin-(--transform-origin) rounded-md border border-[#d7c8b7] bg-[#fffdf9] p-1 text-sm text-[#102a3f] shadow-lg shadow-[#102a3f]/10 outline-none data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
            className,
          )}
        >
          {children}
        </MenuPrimitive.Popup>
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  );
}

function DropdownMenuLabel({ className, children, ...props }) {
  return (
    <div
      data-slot="dropdown-menu-label"
      className={cn("px-2.5 py-2 text-sm font-medium text-[#102a3f]", className)}
      {...props}
    >
      {children}
    </div>
  );
}

function DropdownMenuSeparator({ className, ...props }) {
  return (
    <div
      data-slot="dropdown-menu-separator"
      className={cn("my-1 h-px bg-[#d7c8b7]", className)}
      {...props}
    />
  );
}

function DropdownMenuItem({ className, children, ...props }) {
  const isButton = typeof props.onClick === "function";

  return (
    <MenuPrimitive.Item
      data-slot="dropdown-menu-item"
      className={cn(
        "flex cursor-pointer items-center gap-2 rounded-sm px-2.5 py-2 text-sm text-[#53657b] outline-none transition-colors focus:bg-[#ebe3d8] focus:text-[#102a3f] data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
        className,
      )}
      {...props}
    >
      {isButton ? children : React.Children.map(children, (child) => child)}
    </MenuPrimitive.Item>
  );
}

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuPortal,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
};
