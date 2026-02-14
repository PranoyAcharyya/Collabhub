import React from 'react'

const Footer = () => {
  return (
    <footer className="border-t mt-20">
  <div className="max-w-7xl mx-auto px-6 py-12">

    {/* Top Section */}
    <div className="flex flex-col md:flex-row justify-between gap-10">

      {/* Brand */}
      <div>
        <h3 className="text-xl font-semibold">CollabHub</h3>
        <p className="text-sm text-muted-foreground mt-3 max-w-xs">
          Build, collaborate, and grow together in one unified workspace.
        </p>
      </div>

      {/* Links */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-sm">

        <div className="flex flex-col gap-3">
          <h4 className="font-medium">Product</h4>
          <a href="#" className="text-muted-foreground hover:text-foreground transition">Features</a>
          <a href="#" className="text-muted-foreground hover:text-foreground transition">Pricing</a>
          <a href="#" className="text-muted-foreground hover:text-foreground transition">Updates</a>
        </div>

        <div className="flex flex-col gap-3">
          <h4 className="font-medium">Company</h4>
          <a href="#" className="text-muted-foreground hover:text-foreground transition">About</a>
          <a href="#" className="text-muted-foreground hover:text-foreground transition">Blog</a>
          <a href="#" className="text-muted-foreground hover:text-foreground transition">Careers</a>
        </div>

        <div className="flex flex-col gap-3">
          <h4 className="font-medium">Legal</h4>
          <a href="#" className="text-muted-foreground hover:text-foreground transition">Privacy</a>
          <a href="#" className="text-muted-foreground hover:text-foreground transition">Terms</a>
        </div>

      </div>
    </div>

    {/* Bottom Section */}
    <div className="border-t mt-12 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
      <p>© {new Date().getFullYear()} CollabHub. All rights reserved.</p>
      <div className="flex gap-6 mt-4 md:mt-0">
        <a href="#" className="hover:text-foreground transition">Twitter</a>
        <a href="#" className="hover:text-foreground transition">GitHub</a>
        <a href="#" className="hover:text-foreground transition">LinkedIn</a>
      </div>
    </div>

  </div>
</footer>

  )
}

export default Footer