"use client";

import {
  IconBrain,
  IconBrandMedium,
  IconBrandX,
  IconBrandYoutube,
  IconCalendarEvent,
  IconGlassFull,
  IconMail,
  IconMapPin,
  IconMountain,
  IconMusic,
  IconPlane,
  IconUsersGroup,
} from "@tabler/icons-react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { useEffect, useMemo, useRef, useState, type ComponentType } from "react";
import { SiteChrome } from "@/components/SiteChrome";
import SpotlightCard from "@/components/SpotlightCard";

type IconType = ComponentType<{
  size?: number | string;
  stroke?: number | string;
  className?: string;
}>;

type InterestCard = {
  title: string;
  description: string;
  image: string;
  icon: IconType;
};

type WritingCard = {
  title: string;
  description: string;
  href: string;
  cta: string;
  icon: IconType;
};

type ThinkCard = {
  title: string;
  description: string;
};

const media = {
  line3Video: "/home/line3.mp4",
  line2Video: "/home/line2.mp4",
  heroVideo: "/home/nimaaksoy-hero-video_hyktho.mp4",
  travelImage: "/home/travel.png",
  wineImage: "/home/wine.png",
  turkeyImage: "/home/turkey.png",
  techImage: "/home/tech.png",
  sportImage: "/home/sport.png",
  musicImage: "/home/music.png",
  profileImage: "/home/nima.png",
} as const;

const interests: InterestCard[] = [
  {
    title: "Travel",
    description: "Some places get better when you return.",
    image: media.travelImage,
    icon: IconPlane,
  },
  {
    title: "Wine",
    description: "Less about quantity. More about the moment.",
    image: media.wineImage,
    icon: IconGlassFull,
  },
  {
    title: "Turkey",
    description: "Home, for now. For good reason.",
    image: media.turkeyImage,
    icon: IconMapPin,
  },
  {
    title: "Technology",
    description: "Where things actually get interesting.",
    image: media.techImage,
    icon: IconBrain,
  },
  {
    title: "Sport",
    description: "Less tennis and skiing. More time building.",
    image: media.sportImage,
    icon: IconMountain,
  },
  {
    title: "Music",
    description: "Rock, metal, alternative. Pink Floyd is enough.",
    image: media.musicImage,
    icon: IconMusic,
  },
];

const writingCards: WritingCard[] = [
  {
    title: "Medium",
    description:
      "Thinking out loud about products, traction, and what actually matters.",
    href: "https://medium.com/@nima.aksoy",
    cta: "Read on Medium →",
    icon: IconBrandMedium,
  },
  {
    title: "Substack",
    description: "Occasional notes from what I'm building.",
    href: "https://substack.com/@nimaaksoy",
    cta: "Open Substack →",
    icon: IconMail,
  },
  {
    title: "YouTube",
    description: "Videos around ideas, products, and experiments.",
    href: "https://www.youtube.com/@nimaaksoy",
    cta: "Watch on YouTube →",
    icon: IconBrandYoutube,
  },
  {
    title: "X",
    description:
      "Short thoughts, quick signals, and what catches my attention.",
    href: "https://x.com/Nima1980",
    cta: "Open X →",
    icon: IconBrandX,
  },
];

const thinkCards: ThinkCard[] = [
  {
    title: "Building",
    description:
      "I like products that create movement, open doors, or make better decisions easier.",
  },
  {
    title: "Exploring",
    description:
      "Some ideas turn into companies. Some stay as experiments. Both matter.",
  },
  {
    title: "Connecting",
    description:
      "The best opportunities usually start with the right conversation, not a formal introduction.",
  },
];

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      staggerChildren: 0.1,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
};

function HeroSeamlessVideo() {
  const videoARef = useRef<HTMLVideoElement | null>(null);
  const videoBRef = useRef<HTMLVideoElement | null>(null);
  const [activeVideo, setActiveVideo] = useState<0 | 1>(0);
  const activeRef = useRef<0 | 1>(0);
  const rafRef = useRef<number | null>(null);
  const swapTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isSwappingRef = useRef(false);

  const playMuted = async (video: HTMLVideoElement | null) => {
    if (!video) {
      return;
    }
    video.muted = true;
    try {
      await video.play();
    } catch {
      // Ignore autoplay rejections; user interaction can start playback later.
    }
  };

  useEffect(() => {
    const videoA = videoARef.current;
    const videoB = videoBRef.current;

    if (!videoA || !videoB) {
      return;
    }

    const initialize = async () => {
      videoA.currentTime = 0;
      videoB.currentTime = 0;

      await playMuted(videoA);

      // Prime the secondary decoder frame to reduce visible hitch during swap.
      await playMuted(videoB);
      videoB.pause();
      videoB.currentTime = 0;
    };

    const tick = () => {
      const currentIndex = activeRef.current;
      const nextIndex: 0 | 1 = currentIndex === 0 ? 1 : 0;
      const currentVideo = currentIndex === 0 ? videoARef.current : videoBRef.current;
      const nextVideo = nextIndex === 0 ? videoARef.current : videoBRef.current;

      if (
        currentVideo &&
        nextVideo &&
        Number.isFinite(currentVideo.duration) &&
        currentVideo.duration > 0 &&
        !isSwappingRef.current
      ) {
        const remaining = currentVideo.duration - currentVideo.currentTime;

        if (remaining <= 0.2) {
          isSwappingRef.current = true;
          nextVideo.currentTime = 0;
          void playMuted(nextVideo);

          activeRef.current = nextIndex;
          setActiveVideo(nextIndex);

          swapTimeoutRef.current = setTimeout(() => {
            currentVideo.pause();
            currentVideo.currentTime = 0;
            isSwappingRef.current = false;
          }, 260);
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    void initialize();
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
      if (swapTimeoutRef.current) {
        clearTimeout(swapTimeoutRef.current);
      }
      videoA.pause();
      videoB.pause();
    };
  }, []);

  return (
    <>
      <video
        ref={videoARef}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
          activeVideo === 0 ? "opacity-100" : "opacity-0"
        }`}
        src={media.heroVideo}
        autoPlay
        muted
        playsInline
        preload="auto"
      />
      <video
        ref={videoBRef}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
          activeVideo === 1 ? "opacity-100" : "opacity-0"
        }`}
        src={media.heroVideo}
        autoPlay
        muted
        playsInline
        preload="auto"
      />
    </>
  );
}

export default function Home() {
  const currentMonthYear = useMemo(
    () =>
      new Intl.DateTimeFormat("en-US", {
        month: "long",
        year: "numeric",
      }).format(new Date()),
    []
  );

  const aboutRef = useRef<HTMLElement | null>(null);
  const projectsRef = useRef<HTMLElement | null>(null);
  const writingRef = useRef<HTMLElement | null>(null);
  const connectRef = useRef<HTMLElement | null>(null);

  const aboutInView = useInView(aboutRef, { amount: 0.2, once: true });
  const projectsInView = useInView(projectsRef, { amount: 0.2, once: true });
  const writingInView = useInView(writingRef, { amount: 0.2, once: true });
  const connectInView = useInView(connectRef, { amount: 0.35, once: true });

  const scrollToSection = (id: string) => {
    const target = document.getElementById(id);
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <SiteChrome active="home">
      <AnimatePresence mode="wait">
        <motion.div
          key="home"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -18 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10"
        >
          <section
            id="hero"
            className="relative isolate min-h-screen overflow-hidden"
          >
            <HeroSeamlessVideo />

            <div className="relative z-10 mx-auto flex min-h-[88svh] w-full max-w-[1280px] items-center px-6 pb-12 pt-20 md:min-h-screen md:px-10 md:pb-16 md:pt-24">
              <div className="max-w-[760px]">
                <motion.h1
                  initial={{ opacity: 0, y: 45 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  className="font-monroe text-[clamp(42px,12vw,90px)] font-light leading-[1.05] text-[#EAEAEA]"
                >
                  Building quietly.
                  <br />
                  Connecting selectively.
                  <br />
                  Working on things
                  <br />
                  that <span className="text-[#2CFF05]">matter.</span>
                </motion.h1>

                <div className="mt-8 flex flex-wrap items-center gap-6 md:mt-10 md:gap-10">
                  <button
                    type="button"
                    onClick={() => scrollToSection("projects")}
                    className="inline-flex items-center gap-3 font-jetbrains text-[clamp(16px,4.6vw,30px)] text-[#EAEAEA] transition-colors hover:text-[#2CFF05]"
                  >
                    <span className="text-[#2CFF05]">→</span>
                    <span>What I&apos;m working on</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollToSection("connect")}
                    className="inline-flex items-center gap-3 font-jetbrains text-[clamp(16px,4.6vw,30px)] text-[#EAEAEA] transition-colors hover:text-[#2CFF05]"
                  >
                    <span className="text-[#2CFF05]">→</span>
                    <span>Connect</span>
                  </button>
                </div>

                <p className="mt-10 font-jetbrains text-[13px] text-[#9A9A9A] md:mt-12">
                  Last updated:{" "}
                  <span className="text-[#2CFF05]" suppressHydrationWarning>
                    {currentMonthYear}
                  </span>
                </p>
              </div>
            </div>
          </section>

          <motion.section
            id="about"
            ref={aboutRef}
            className="bg-[#111111] px-6 py-16 md:px-10 md:py-24"
            variants={sectionVariants}
            initial="hidden"
            animate={aboutInView ? "show" : "hidden"}
          >
            <div className="mx-auto max-w-[1180px]">
              <motion.h2
                variants={itemVariants}
                className="font-monroe text-[38px] font-light text-[#EAEAEA] md:text-[48px]"
              >
                A few things I&apos;m into
              </motion.h2>
              <motion.p
                variants={itemVariants}
                className="mt-2 font-jetbrains text-[11px] italic text-[#7F7F7F]"
              >
                beyond what I&apos;m building
              </motion.p>

              <motion.div
                variants={itemVariants}
                className="about-row mt-10 overflow-hidden"
              >
                <div className="about-track flex w-max gap-5">
                  {[...interests, ...interests].map((card, index) => {
                    const Icon = card.icon;

                    return (
                      <article
                        key={`${card.title}-${index}`}
                        className="group relative h-[330px] w-[280px] shrink-0 overflow-hidden rounded-2xl border border-[#1F1F1F] md:h-[380px] md:w-[340px]"
                      >
                        <img
                          src={card.image}
                          alt={`${card.title} background`}
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />

                        <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                          <div className="transition-transform duration-500 ease-out group-hover:-translate-y-4">
                            <div className="flex items-center gap-3">
                              <Icon size={22} className="text-[#EAEAEA]" stroke={1.8} />
                              <h3 className="whitespace-nowrap font-monroe text-[24px] font-light text-[#EAEAEA]">
                                {card.title}
                              </h3>
                            </div>
                            <p className="mt-3 min-h-[44px] max-w-[95%] font-jetbrains text-[13px] leading-[1.7] text-[#EAEAEA] [text-shadow:0_1px_8px_rgba(0,0,0,0.8)]">
                              {card.description}
                            </p>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          </motion.section>

          <motion.section
            id="projects"
            ref={projectsRef}
            className="bg-[#111111] px-6 py-16 md:px-10 md:py-24"
            variants={sectionVariants}
            initial="hidden"
            animate={projectsInView ? "show" : "hidden"}
          >
            <div className="mx-auto max-w-[1180px]">
              <div className="grid gap-10 md:gap-12 lg:grid-cols-[300px_1fr]">
                <motion.div variants={itemVariants} className="flex flex-col justify-between gap-10 lg:gap-0">
                  <div>
                    <p className="font-jetbrains text-[11px] uppercase tracking-[0.16em] text-[#7F7F7F]">
                      CURRENT FOCUS
                    </p>
                    <h2 className="mt-4 font-monroe text-[38px] font-light leading-[1.08] text-[#EAEAEA] md:text-[48px]">
                      What I&apos;m working on now
                    </h2>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-[#2CFF05]" />
                      <p className="font-jetbrains text-[11px] uppercase tracking-[0.16em] text-[#2CFF05]">
                        OPEN TO COLLABORATE
                      </p>
                    </div>
                    <p className="mt-3 max-w-[240px] font-jetbrains text-[13px] leading-[1.7] text-[#9A9A9A]">
                      I&apos;m always open to partnerships, investments, and new ideas.
                    </p>
                    <button
                      type="button"
                      onClick={() => scrollToSection("connect")}
                      className="signal-button mt-6 inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-jetbrains text-[12px] uppercase tracking-[0.12em]"
                    >
                      LET&apos;S CONNECT →
                    </button>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="border-b border-[#1F1F1F]">
                  {/* Vocaler.ai */}
                  <article className="border-t border-[#1F1F1F] py-9">
                    <div className="grid gap-8 md:grid-cols-2">
                      <div>
                        <p className="font-jetbrains text-[11px] tracking-[0.14em] text-[#7F7F7F]">
                          01 / 01
                        </p>
                        <h3 className="mt-3 font-monroe text-[32px] font-light leading-[1.1] text-[#EAEAEA]">
                          Vocaler.ai
                        </h3>
                        <p className="mt-2 max-w-xs font-monroe text-[16px] italic text-[#9A9A9A]">
                          Create, release, and grow music in one place.
                        </p>
                        <span className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#1F1F1F] px-3 py-1 font-jetbrains text-[10px] tracking-[0.14em] text-[#FF3B30]">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#FF3B30]" /> RAISING PRE-SEED
                        </span>
                      </div>

                      <div className="border-l border-[#1F1F1F] pl-6 md:pl-8">
                        <div className="flex items-center gap-2">
                          <IconUsersGroup size={18} stroke={1.8} className="text-[#FF3B30]" />
                          <p className="font-jetbrains text-[10px] uppercase tracking-[0.14em] text-[#FF3B30]">
                            BUILDING OUR OWN MUSIC MODEL
                          </p>
                        </div>
                        <p className="mt-3 font-monroe text-[16px] italic text-[#9A9A9A]">
                          We&apos;re looking for the right investor to help us take Vocaler from platform to proprietary AI.
                        </p>
                        <div className="mt-6 flex flex-wrap gap-3">
                          <a
                            href="https://vocaler.ai/"
                            target="_blank"
                            rel="noopener follow"
                            className="inline-flex items-center rounded-full border border-[#FF3B30] px-5 py-2.5 font-jetbrains text-[12px] uppercase tracking-[0.12em] text-[#FF3B30] transition hover:bg-[#FF3B30]/10"
                          >
                            VIEW PROJECT →
                          </a>
                        </div>
                      </div>
                    </div>
                  </article>
                </motion.div>
              </div>
            </div>
          </motion.section>

          <section className="bg-[#111111] px-6 py-16 md:px-10 md:py-24">
            <div className="mx-auto max-w-[1180px]">
              <h2 className="font-monroe text-[38px] font-light text-[#EAEAEA] md:text-[48px]">
                How I Think
              </h2>

              <div className="mt-10 grid gap-5 md:grid-cols-3">
                {thinkCards.map((card, index) => {
                  const videoSrc =
                    index === 0
                      ? media.line3Video
                      : index === 2
                        ? media.heroVideo
                        : media.line2Video;

                  const videoConfig =
                    index === 0
                      ? {
                          objectPosition: "18% 10%",
                          transform: "scale(1)",
                          startOffsetSeconds: 0.7,
                        }
                      : index === 1
                        ? {
                            objectPosition: "50% 50%",
                            transform: "scale(1)",
                            startOffsetSeconds: 4.3,
                          }
                        : {
                            objectPosition: "85% 90%",
                            transform: "scale(1)",
                            startOffsetSeconds: 8.1,
                          };

                  return (
                    <article
                      key={card.title}
                      className="relative min-h-[500px] overflow-hidden rounded-2xl border border-[#1F1F1F] bg-[#111111]"
                    >
                      <video
                        className="absolute inset-0 h-full w-full object-cover"
                        style={{
                          objectPosition: videoConfig.objectPosition,
                          transform: videoConfig.transform,
                          transformOrigin: "center center",
                        }}
                        src={videoSrc}
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="auto"
                        onLoadedData={(event) => {
                          const video = event.currentTarget;
                          if (!Number.isFinite(video.duration) || video.duration <= 0) {
                            return;
                          }
                          video.currentTime = videoConfig.startOffsetSeconds % video.duration;
                        }}
                      />

                      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[62%] bg-gradient-to-t from-black via-black/70 to-transparent" />

                      <div className="absolute inset-x-0 bottom-0 z-20 px-8 pb-6 pt-24">
                        <h3 className="whitespace-nowrap font-monroe text-[48px] font-light leading-[1.08] text-[#EAEAEA]">
                          {card.title}
                        </h3>
                        <p className="mt-4 min-h-[130px] max-w-[90%] font-jetbrains text-[15px] leading-[1.6] text-[#C8C8C8] md:min-h-[120px]">
                          {card.description}
                        </p>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>

          <motion.section
            className="bg-[#111111] px-6 py-16 md:px-10 md:py-24"
            variants={sectionVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
          >
            <div className="mx-auto max-w-[1180px]">
              <motion.div
                variants={itemVariants}
                className="grid gap-8 border-y border-[#1F1F1F] py-10 md:grid-cols-[1.05fr_1fr]"
              >
                <div>
                  <p className="font-jetbrains text-[11px] uppercase tracking-[0.16em] text-[#7F7F7F]">
                    A few advisory conversations each year.
                  </p>
                  <h2 className="mt-4 font-monroe text-[32px] font-light leading-[1.08] text-[#EAEAEA] md:text-[40px]">
                    Strategic AI integration
                  </h2>
                </div>

                <div className="max-w-[560px]">
                  <p className="font-monroe text-[18px] italic leading-[1.7] text-[#9A9A9A]">
                    I occasionally help established businesses understand where AI can actually improve operations, workflows, and decision making.
                  </p>
                  <p className="mt-5 font-jetbrains text-[13px] leading-[1.9] text-[#9A9A9A]">
                    Mostly around workflow automation, internal tools, decision systems, AI product strategy, and content and growth systems.
                  </p>
                  <p className="mt-5 font-jetbrains text-[13px] leading-[1.9] text-[#9A9A9A]">
                    If it feels relevant, feel free to connect. If I&apos;m not the right person, I&apos;ll say so honestly.
                  </p>
                  <button
                    type="button"
                    onClick={() => scrollToSection("connect")}
                    className="signal-button mt-7 inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-jetbrains text-[12px] uppercase tracking-[0.12em]"
                  >
                    → Connect
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.section>

          <motion.section
            id="writing"
            ref={writingRef}
            className="bg-[#111111] px-6 py-16 md:px-10 md:py-24"
            variants={sectionVariants}
            initial="hidden"
            animate={writingInView ? "show" : "hidden"}
          >
            <div className="mx-auto max-w-[1180px]">
              <motion.h2
                variants={itemVariants}
                className="font-monroe text-[38px] font-light text-[#EAEAEA] md:text-[48px]"
              >
                Writing and presence
              </motion.h2>

              <motion.div
                variants={itemVariants}
                className="mt-10 grid gap-5 md:grid-cols-2"
              >
                {writingCards.map((card) => {
                  const CardIcon = card.icon;

                  return (
                    <motion.a
                      key={card.title}
                      href={card.href}
                      target="_blank"
                      rel="noreferrer"
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.24 }}
                      className="block"
                    >
                      <SpotlightCard
                        className="card-surface h-full rounded-2xl p-7 backdrop-blur-[20px]"
                        spotlightColor="rgba(44, 255, 5, 0.14)"
                      >
                        <div className="flex items-center gap-3 text-[#EAEAEA]">
                          <CardIcon size={20} stroke={1.8} />
                          <h3 className="font-monroe text-[22px] font-normal text-[#EAEAEA]">
                            {card.title}
                          </h3>
                        </div>
                        <p className="mt-4 max-w-sm font-jetbrains text-[12px] leading-[1.8] text-[#9A9A9A]">
                          {card.description}
                        </p>
                        <p className="mt-6 font-jetbrains text-[12px] uppercase tracking-[0.14em] text-[#2CFF05]">
                          {card.cta}
                        </p>
                      </SpotlightCard>
                    </motion.a>
                  );
                })}
              </motion.div>
            </div>
          </motion.section>

          <motion.section
            id="connect"
            ref={connectRef}
            className="flex min-h-[78svh] items-center bg-[#111111] px-6 py-16 md:min-h-screen md:px-10 md:py-24"
            variants={sectionVariants}
            initial="hidden"
            animate={connectInView ? "show" : "hidden"}
          >
            <div className="mx-auto w-full max-w-2xl text-center">
              <motion.div variants={itemVariants} className="mx-auto mb-8 w-fit">
                <div className="h-24 w-24 overflow-hidden rounded-full border border-[#1F1F1F]">
                  <img
                    src={media.profileImage}
                    alt="Nima Aksoy"
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
              </motion.div>
              <motion.p
                variants={itemVariants}
                className="font-jetbrains text-[11px] uppercase tracking-[0.2em] text-[#7F7F7F]"
              >
                LET&apos;S CONNECT
              </motion.p>
              <motion.h2
                variants={itemVariants}
                className="mt-5 font-monroe text-[clamp(32px,9vw,56px)] font-light leading-[1.05] text-[#EAEAEA]"
              >
                I&apos;m always interested in thoughtful people building interesting things.
              </motion.h2>
              <motion.p
                variants={itemVariants}
                className="mt-6 font-monroe text-[18px] italic text-[#9A9A9A]"
              >
                Founders, investors, operators, and curious builders are all welcome here. If something overlaps, there&apos;s probably a conversation worth having.
              </motion.p>

              <motion.div
                variants={itemVariants}
                className="mx-auto mt-10 h-px w-full max-w-md bg-[#1F1F1F]"
              />

              <motion.div
                variants={itemVariants}
                className="mt-10 flex flex-wrap items-center justify-center gap-4"
              >
                <a
                  href="mailto:me@nimaaksoy.com"
                  className="signal-button inline-flex items-center gap-2 rounded-full px-6 py-3 font-jetbrains text-[12px] uppercase tracking-[0.12em]"
                >
                  <IconMail size={16} stroke={1.9} />
                  Send a message
                </a>
                <a
                  href="https://calendar.app.google/Q5a2wh1ZEELQph5eA"
                  target="_blank"
                  rel="noreferrer"
                  className="signal-button inline-flex items-center gap-2 rounded-full px-6 py-3 font-jetbrains text-[12px] uppercase tracking-[0.12em]"
                >
                  <IconCalendarEvent size={16} stroke={1.9} />
                  Schedule a call
                </a>
              </motion.div>

              <motion.p
                variants={itemVariants}
                className="mt-8 font-jetbrains text-[11px] italic text-[#7F7F7F]"
              >
                Open to good conversations, sharp ideas, and unexpected alignment.
              </motion.p>
            </div>
          </motion.section>
        </motion.div>
      </AnimatePresence>
    </SiteChrome>
  );
}
