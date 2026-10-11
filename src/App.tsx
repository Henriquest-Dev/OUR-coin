import { useState } from "react";
import { MotionConfig } from "motion/react";
import { Preloader } from "./components/Preloader";
import { Nav } from "./components/Nav";
import { Hero } from "./sections/Hero";
import { MeetDamian } from "./sections/MeetDamian";
import { Mission } from "./sections/Mission";
import { GivingFlow } from "./sections/GivingFlow";
import { Impact } from "./sections/Impact";
import { HowToBuy } from "./sections/HowToBuy";
import { TokenInfo } from "./sections/TokenInfo";
import { Community } from "./sections/Community";
import { Faq } from "./sections/Faq";
import { Footer } from "./sections/Footer";

export default function App() {
  const [ready, setReady] = useState(false);
  return (
    <MotionConfig reducedMotion="user">
      {!ready && <Preloader onDone={() => setReady(true)} />}
      <div className="grain" aria-hidden />
      <Nav />
      <main id="main" aria-hidden={!ready || undefined}>
        <Hero ready={ready} />
        <MeetDamian />
        <Mission />
        <GivingFlow />
        <Impact />
        <HowToBuy />
        <TokenInfo />
        <Community />
        <Faq />
      </main>
      <Footer />
    </MotionConfig>
  );
}
