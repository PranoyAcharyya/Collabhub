"use client";
import React from "react";
import Link from "next/link";
import { NavigationMenuDemo } from "../NavLinks";
import { Button } from "../ui/button";
import { ModeToggle } from "../themetoggle";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, SquareMenu } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="container z-10 flex items-center justify-between mx-auto px-5 py-3 bg-white-300 backdrop-blur-2xl fixed top-0 left-0">
      <img src="/images/collabhub-bw.png" className="sitelogo"/>
      <div className="hidden md:flex">
        <NavigationMenuDemo />
      </div>
      <div className="flex items-center gap-2 ">
        <Button variant="outline" className="hidden md:block">
          Login
        </Button>
        <ModeToggle />
        <div className="block md:hidden">
          <Sheet>
          <SheetTrigger>
            <Menu />
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Quick Links</SheetTitle>
              <SheetDescription>
                <Button variant="outline">Login</Button>
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
