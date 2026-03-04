import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

export default function PricingSection() {
  return (
    <section className="py-40 px-6 max-w-6xl mx-auto">
      
      {/* Heading */}
      <div className="text-center mb-16">
        <p className="text-sm tracking-widest text-muted-foreground mb-4">
          PRICING PLANS
        </p>

        <h1 className="text-5xl font-bold tracking-tight leading-tight">
          SIMPLE. TRANSPARENT. <br /> POWERFUL.
        </h1>

        <p className="mt-6 text-muted-foreground">
          Choose a plan that scales with your workflow. <br />
          No hidden fees. Cancel anytime.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        
        {/* Free Plan */}
        <Card className="border">
          <CardHeader>
            <CardTitle className="text-xl">Free</CardTitle>
            <div className="text-4xl font-bold mt-2">
              $0<span className="text-sm text-muted-foreground"> /month</span>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <Feature text="1 Workspace" />
            <Feature text="Basic Analytics" />
            <Feature text="Up to 5 Documents" />

            <Button className="w-full mt-6">
              Get Started
            </Button>
          </CardContent>
        </Card>

        {/* Pro Plan */}
        <Card className="border bg-black dark:bg-red-500 text-white">
          <CardHeader>
            <CardTitle className="text-xl">Pro</CardTitle>

            <div className="text-4xl font-bold mt-2">
              $29<span className="text-sm opacity-70"> /month</span>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <Feature text="Unlimited Documents" dark />
            <Feature text="Unlimited Workspaces" dark />
            <Feature text="Priority Support" dark />

            <Button
              variant="secondary"
              className="w-full mt-6"
            >
              Upgrade to Pro
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

function Feature({ text, dark }: { text: string; dark?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <Check
        size={18}
        className={dark ? "text-white" : "text-black"}
      />
      <span className={dark ? "text-white" : "text-muted-foreground"}>
        {text}
      </span>
    </div>
  )
}