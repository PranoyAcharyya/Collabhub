"use client";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { TextAnimate } from "@/components/ui/text-animate";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShineBorder } from "@/components/ui/shine-border";


import {
  Users,
  FileText,
  FolderKanban,
  CheckSquare,
  Cloud,
  Zap,
} from "lucide-react";

import { ScrollVelocityRow,ScrollVelocityContainer } from "@/components/ui/scroll-based-velocity";
import { Marquee } from "@/components/ui/marquee";
import ReviewCard from "@/components/ReviewCard";

export default function Home() {
  const features = [
    {
      title: "Real-Time Collaboration",
      description:
        "Work together seamlessly with live updates, instant syncing, and shared editing across teams.",
      icon: Users,
    },
    {
      title: "Smart Document Editor",
      description:
        "Create rich, flexible documents with blocks, embeds, checklists, and powerful formatting tools.",
      icon: FileText,
    },
    {
      title: "Organized Workspaces",
      description:
        "Structure projects with pages, nested folders, and intuitive navigation for better clarity.",
      icon: FolderKanban,
    },
    {
      title: "Task & Project Management",
      description:
        "Track tasks, assign responsibilities, and monitor progress with boards and lists.",
      icon: CheckSquare,
    },
    {
      title: "Secure Cloud Storage",
      description:
        "All your data is securely stored and accessible anytime, anywhere.",
      icon: Cloud,
    },
    {
      title: "Fast & Responsive",
      description:
        "Built for speed with a smooth experience across desktop, tablet, and mobile.",
      icon: Zap,
    },
  ];

  const IMAGES_ROW_A = [
  "https://images.unsplash.com/photo-1749738456487-2af715ab65ea?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1720139288219-e20aa9c8895b?q=80&w=1810&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
]
const IMAGES_ROW_B = [
  "https://images.unsplash.com/photo-1749738456487-2af715ab65ea?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1720139288219-e20aa9c8895b?q=80&w=1810&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
]

  const reviews = [
  {
    name: "Jack",
    username: "@jack",
    body: "I've never seen anything like this before. It's amazing. I love it.",
    img: "https://avatar.vercel.sh/jack",
  },
  {
    name: "Jill",
    username: "@jill",
    body: "I don't know what to say. I'm speechless. This is amazing.",
    img: "https://avatar.vercel.sh/jill",
  },
  {
    name: "John",
    username: "@john",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://avatar.vercel.sh/john",
  },
  {
    name: "Jane",
    username: "@jane",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://avatar.vercel.sh/jane",
  },
  {
    name: "Jenny",
    username: "@jenny",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://avatar.vercel.sh/jenny",
  },
  {
    name: "James",
    username: "@james",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://avatar.vercel.sh/james",
  },
]


const firstRow = reviews.slice(0, reviews.length / 2)
const secondRow = reviews.slice(reviews.length / 2)

  return (
    <>
     <section className="min-h-screen px-5 flex flex-col justify-center items-center gap-5 relative overflow-hidden">




  {/* Content */}
  <div className="relative flex flex-col items-center gap-5">

    <div
      className={cn(
        "group rounded-full border border-black/5 bg-neutral-100 text-base transition-all hover:bg-neutral-200"
      )}
    >
      <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1">
        <span className="capitalize text-black">✨ your own workplace</span>
      </AnimatedShinyText>
    </div>

    <TextAnimate
      as="h1"
      animation="blurInUp"
      by="word"
      once
      className="text-2xl md:text-5xl lg:text-[75px] text-center font-bold max-w-[80%]"
    >
      All in one collaboration and productivity platform
    </TextAnimate>

    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Button className="px-14 py-7 text-xl mt-4">
        Try free
      </Button>
    </motion.div>

  </div>
</section>

      <section className="min-h-screen px-5 py-16 container max-w-7xl mx-auto flex flex-col">
        <img
          src="/images/logo.png"
          className="self-center w-12 mb-3 sitelogo"
          alt="CollabHub Logo"
        />

        <h2 className="text-3xl md:text-4xl text-center font-bold capitalize mb-10">
          Innovating with Purpose and Vision
        </h2>

        <div className="flex flex-col lg:flex-row gap-10 items-center">
          {/* LEFT SIDE */}
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <p className="text-base md:text-lg leading-relaxed">
                Built on the understanding that great work begins with the right
                surroundings, we set out to create more than a workplace—we
                designed an ecosystem where ideas grow and ambition thrives.
                What started as a vision for flexible, thoughtfully crafted, and
                tech-enabled workspaces has evolved into a dynamic community of
                innovators...
              </p>
            </motion.div>

            <motion.div
              initial={{ x: -100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <Button className="px-8 md:px-14 py-4 md:py-6 text-base md:text-xl mt-6">
                Let's Start
              </Button>
            </motion.div>
          </div>

          {/* RIGHT SIDE */}
          <div className="w-full lg:w-1/2">
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              viewport={{ once: true }}
            >
              <img
                src="/images/ab1.jpg"
                alt="Workspace collaboration"
                className="w-full h-[250px] sm:h-[300px] md:h-[400px] object-cover rounded-xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="min-h-screen px-5 py-[60px] container max-w-7xl mx-auto flex flex-col">
        <h2 className="text-4xl text-center font-bold capitalize mb-10">
          Manage your Projects
        </h2>
        <p className="text-center">
          Access your latest workspaces, tools, and collaborative assets
          effortlessly.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 overflow-hidden">
          {features.map((f, index) => {
            const Icon = f.icon;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.2, // 👈 stagger effect
                  ease: "easeOut",
                }}
                viewport={{ once: true }}
              >
                <Card key={index} className="p-6 relative min-h-[212px]">
                  <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} />
                  <CardHeader className="flex flex-col items-start gap-4">
                    <Icon className="w-8 h-8 text-primary" />
                    <CardTitle>{f.title}</CardTitle>
                  </CardHeader>

                  <CardContent>
                    <p className="text-muted-foreground">{f.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="text-4xl text-center font-bold capitalize mb-10">Brand We work with</h2>
         <div className="relative flex w-full flex-col items-center justify-center overflow-hidden py-8">
      <ScrollVelocityContainer className="w-full">
        <ScrollVelocityRow baseVelocity={6} direction={1} className="py-4">
          {IMAGES_ROW_A.map((src, idx) => (
            <img
              key={idx}
              src={`${src}&ixlib=rb-4.0.3`}
              alt="Unsplash sample"
              width={240}
              height={160}
              loading="lazy"
              decoding="async"
              className="mx-4 inline-block h-40 w-60 rounded-lg object-cover shadow-sm"
            />
          ))}
        </ScrollVelocityRow>
        <ScrollVelocityRow baseVelocity={6} direction={-1} className="py-4">
          {IMAGES_ROW_B.map((src, idx) => (
            <img
              key={idx}
              src={`${src}&ixlib=rb-4.0.3`}
              alt="Unsplash sample"
              width={240}
              height={160}
              loading="lazy"
              decoding="async"
              className="mx-4 inline-block h-40 w-60 rounded-lg object-cover shadow-sm"
            />
          ))}
        </ScrollVelocityRow>
      </ScrollVelocityContainer>
      <div className="from-background pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r"></div>
      <div className="from-background pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l"></div>
    </div>
      </section>
      <section>
        <h2 className="text-4xl text-center font-bold capitalize mb-10">What people are saying</h2>
          <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
      <Marquee pauseOnHover className="[--duration:20s]">
        {firstRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover className="[--duration:20s]">
        {secondRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      <div className="from-background pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r"></div>
      <div className="from-background pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l"></div>
    </div>
      </section>
    </>
  );
}
