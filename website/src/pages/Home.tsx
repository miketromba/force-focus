import { Showcase } from "../components/Showcase";
import chromeIcon from "../assets/chrome.png";
import appIcon from "../assets/icon.png";
import step1Img from "../assets/step-1.png";
import step2Img from "../assets/step-2.png";
import step3Img from "../assets/step-3.png";
import { Target, ShieldBan, ListChecks, RotateCcw, EyeOff, Code, PenLine, Focus, SlidersHorizontal } from "lucide-react";

export function Home() {
  return (
    <>
      {/* Hero */}
      <section className="text-center mb-20">
        <div className="w-24 h-24 mx-auto mb-6 rounded-2xl overflow-hidden drop-shadow-2xl">
          <img src={appIcon} alt="Force Focus" className="w-full h-full" />
        </div>
        <h1 className="text-5xl font-bold mb-3 tracking-tight">Force Focus</h1>
        <p className="text-xl text-primary font-medium mb-4">Set a goal. Block distractions. Get it done.</p>
        <p className="text-base text-text-muted max-w-[560px] mx-auto mb-8">
          A browser extension that helps you stay focused by setting a daily goal and aggressively
          blocking non-whitelisted sites until you're done.
        </p>
        <div className="flex gap-4 justify-center flex-wrap items-center">
          <a
            href="https://chromewebstore.google.com/detail/force-focus/djpgkaodmkkepdljpnjojalgfoidlcja"
            className="group inline-flex items-center gap-3 px-6 py-3.5 rounded-xl text-base font-semibold bg-white text-gray-900 hover:no-underline transition-all duration-200 shadow-lg shadow-white/20 hover:shadow-xl hover:shadow-white/30 hover:scale-105"
            target="_blank"
            rel="noopener"
          >
            <img src={chromeIcon} alt="Chrome" className="w-6 h-6" />
            <span>Add to Chrome</span>
            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full group-hover:bg-gray-200 transition-colors">Free</span>
          </a>
          <a
            href="https://github.com/miketromba/force-focus"
            className="inline-block px-6 py-3 rounded-lg text-sm font-semibold bg-surface-elevated text-text-secondary border border-border-light hover:bg-border-light hover:no-underline transition-all"
            target="_blank"
            rel="noopener"
          >
            View Source
          </a>
        </div>
      </section>

      {/* Showcase */}
      <Showcase />

      {/* Features */}
      <section className="mb-20">
        <h2 className="text-2xl font-semibold mb-8">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Feature
            icon={<Target className="w-5 h-5" />}
            title="Goal-Based Accountability"
            description="Your browser stays locked until you set a specific daily focus goal. No vague intentions—write down exactly what you'll accomplish."
          />
          <Feature
            icon={<ShieldBan className="w-5 h-5" />}
            title="Aggressive Blocking"
            description="Non-whitelisted sites are blocked with an unbypassable overlay. No sneaky tabs, no background videos—just focus."
          />
          <Feature
            icon={<ListChecks className="w-5 h-5" />}
            title="Flexible Whitelist"
            description="Use glob patterns to allow exactly the sites you need. Allow all of GitHub, just Google Docs, or specific subdomains."
          />
          <Feature
            icon={<RotateCcw className="w-5 h-5" />}
            title="Daily Auto-Reset"
            description="Each day starts fresh. Your browser locks again at a configurable time, prompting you to set a new goal."
          />
          <Feature
            icon={<EyeOff className="w-5 h-5" />}
            title="Zero Data Collection"
            description="Everything stays on your device. No accounts, no tracking, no analytics. Your browsing habits are yours alone."
          />
          <Feature
            icon={<Code className="w-5 h-5" />}
            title="Open Source"
            description="Fully transparent and auditable. Inspect the code, contribute improvements, or fork it for your own needs."
          />
        </div>
      </section>

      {/* How It Works */}
      <section className="mb-20">
        <h2 className="text-2xl font-semibold mb-12 text-center">How It Works</h2>
        <div className="flex flex-col gap-16">
          <Step
            number={1}
            icon={<PenLine className="w-6 h-6" />}
            title="Set Your Goal"
            description="When you open your browser, you'll be prompted to write your focus goal for the day. Be specific—'Complete project proposal' beats 'do work.'"
            image={step1Img}
            align="right"
          />
          <Step
            number={2}
            icon={<Focus className="w-6 h-6" />}
            title="Work Uninterrupted"
            description="Whitelisted sites work normally. Everything else shows a full-screen reminder of your goal, keeping you accountable."
            image={step2Img}
            align="left"
          />
          <Step
            number={3}
            icon={<SlidersHorizontal className="w-6 h-6" />}
            title="Finish or Adjust"
            description="Need a blocked site? Add it to your whitelist on the fly. Done for the day? Complete your session and browse freely."
            image={step3Img}
            align="right"
          />
        </div>
      </section>

      {/* Final CTA */}
      <section className="text-center py-12 px-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl">
        <h2 className="text-2xl font-bold mb-3">Ready to Focus?</h2>
        <p className="text-text-muted mb-8 max-w-md mx-auto">
          Join thousands of users who have taken control of their browsing habits and boosted their productivity.
        </p>
        <div className="flex gap-4 justify-center flex-wrap items-center">
          <a
            href="https://chromewebstore.google.com/detail/force-focus/djpgkaodmkkepdljpnjojalgfoidlcja"
            className="group inline-flex items-center gap-3 px-6 py-3.5 rounded-xl text-base font-semibold bg-white text-gray-900 hover:no-underline transition-all duration-200 shadow-lg shadow-white/20 hover:shadow-xl hover:shadow-white/30 hover:scale-105"
            target="_blank"
            rel="noopener"
          >
            <img src={chromeIcon} alt="Chrome" className="w-6 h-6" />
            <span>Add to Chrome</span>
            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full group-hover:bg-gray-200 transition-colors">Free</span>
          </a>
          <a
            href="https://github.com/miketromba/force-focus"
            className="inline-block px-6 py-3 rounded-lg text-sm font-semibold bg-surface-elevated text-text-secondary border border-border-light hover:bg-border-light hover:no-underline transition-all"
            target="_blank"
            rel="noopener"
          >
            View Source
          </a>
        </div>
      </section>
    </>
  );
}

function Feature({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors">
      <div className="w-10 h-10 rounded-lg bg-primary/20 text-primary flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-base font-semibold mb-2 text-text">{title}</h3>
      <p className="text-sm text-text-muted">{description}</p>
    </div>
  );
}

function Step({ number, icon, title, description, image, align }: { number: number; icon: React.ReactNode; title: string; description: string; image: string; align: "left" | "right" }) {
  return (
    <div className={`flex flex-col ${align === "left" ? "md:flex-row-reverse" : "md:flex-row"} items-center gap-8`}>
      {/* Content */}
      <div className={`flex-1 ${align === "left" ? "md:text-right" : ""}`}>
        <div className={`flex items-center gap-3 mb-4 ${align === "left" ? "md:flex-row-reverse" : ""}`}>
          <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center text-lg font-bold shadow-lg shadow-primary/30">
            {number}
          </div>
          <h3 className="text-xl font-semibold text-text">{title}</h3>
        </div>
        <p className="text-text-muted leading-relaxed">{description}</p>
      </div>

      {/* Screenshot */}
      <div className="flex-1">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-3 shadow-xl">
          <img src={image} alt={title} className="w-full h-auto rounded-xl" />
        </div>
      </div>
    </div>
  );
}
