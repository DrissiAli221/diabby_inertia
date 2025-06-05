// resources/js/Pages/Welcome.jsx

import React from "react";
import { Head, Link } from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout";
import { LineShadowText } from "@/components/magicui/line-shadow-text";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowRightIcon,
    SparklesIcon, // Example for a shiny effect later
    UserGroupIcon,
    ChartBarIcon,
    BookOpenIcon,
} from "@heroicons/react/24/outline"; // Using Heroicons
import clsx from "clsx";

// --- Animation Variants ---

const backdropVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 1, delay: 0.2 } },
};

const fadeInUp = (delay = 0) => ({
    initial: { opacity: 0, y: 40, skewY: 2 },
    animate: {
        opacity: 1,
        y: 0,
        skewY: 0,
        transition: { duration: 0.7, ease: "easeOut", delay },
    },
});

const staggerContainer = (staggerChildren = 0.1, delayChildren = 0) => ({
    initial: {},
    animate: {
        transition: {
            staggerChildren,
            delayChildren,
        },
    },
});

const heroImageVariants = {
    initial: { opacity: 0, scale: 0.85, rotate: -5, x: 50 },
    animate: {
        opacity: 1,
        scale: 1,
        rotate: 0,
        x: 0,
        transition: {
            duration: 0.9,
            ease: [0.16, 1, 0.3, 1], // Quintic Out
            delay: 0.5,
        },
    },
};

const featureCardVariants = {
    initial: { opacity: 0, y: 50, scale: 0.9 },
    whileInView: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.6, ease: "easeOut" },
    },
    hover: {
        y: -10,
        scale: 1.03,
        boxShadow: "0px 20px 30px rgba(0, 191, 255, 0.25)", // Cyan glow
        transition: {
            duration: 0.3,
            type: "spring",
            stiffness: 300,
            damping: 20,
        },
    },
};

const buttonHoverVariants = {
    hover: {
        scale: 1.05,
        y: -2,
        boxShadow: "0px 8px 15px rgba(0,0,0,0.1)",
        transition: { type: "spring", stiffness: 400, damping: 15 },
    },
    tap: { scale: 0.95 },
};

// --- Reusable Components (Optional, but good for organization) ---
const ShinyButton = ({ href, children, className, ...props }) => (
    <motion.div
        whileHover="hover"
        whileTap="tap"
        variants={buttonHoverVariants}
    >
        <Link
            href={href}
            className={clsx(
                `relative inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-white
                bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-600 hover:to-sky-700
                dark:from-cyan-400 dark:to-sky-500 dark:hover:from-cyan-500 dark:hover:to-sky-600
                border border-transparent rounded-xl shadow-lg
                overflow-hidden group transition-all duration-300 ease-in-out transform`,
                className
            )}
            {...props}
        >
            <span className="absolute inset-0 w-full h-full transition-transform duration-1000 ease-out transform -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer group-hover:translate-x-full"></span>
            <span className="relative z-10 flex items-center gap-2">
                {children}
            </span>
        </Link>
    </motion.div>
);

const OutlineButton = ({ href, children, className, ...props }) => (
    <motion.div
        whileHover="hover"
        whileTap="tap"
        variants={buttonHoverVariants}
    >
        <Link
            href={href}
            className={clsx(
                `inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold
                text-cyan-700 dark:text-cyan-300
                bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm
                border border-cyan-300 dark:border-cyan-600
                hover:bg-cyan-50 dark:hover:bg-slate-700/90
                hover:border-cyan-500 dark:hover:border-cyan-400
                rounded-xl shadow-sm hover:shadow-lg hover:shadow-cyan-500/20
                transition-all duration-300 ease-in-out`,
                className
            )}
            {...props}
        >
            <span className="flex items-center gap-2">{children}</span>
        </Link>
    </motion.div>
);

export default function Welcome({ auth, canLogin, canRegister }) {
    const isLoggedIn = auth && auth.user;

    // For LineShadowText, make shadow color dependent on theme
    const [isDarkMode, setIsDarkMode] = React.useState(false);
    React.useEffect(() => {
        setIsDarkMode(document.documentElement.classList.contains("dark"));
        const observer = new MutationObserver(() => {
            setIsDarkMode(document.documentElement.classList.contains("dark"));
        });
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });
        return () => observer.disconnect();
    }, []);

    const lineShadowColor = isDarkMode
        ? "rgba(103, 232, 249, 0.4)"
        : "rgba(8, 145, 178, 0.2)"; // cyan-300/40 vs cyan-600/20

    const featureItems = [
        {
            title: "Personalized Progress Tracking",
            icon: ChartBarIcon,
            description:
                "Visualize your journey with intuitive charts and insights. Understand your patterns, celebrate milestones, and stay motivated.",
        },
        {
            title: "Curated Expert Resources",
            icon: BookOpenIcon,
            description:
                "Access a library of evidence-based articles, delicious recipes, and practical tips curated by diabetes specialists.",
        },
        {
            title: "Supportive Community Hub",
            icon: UserGroupIcon,
            description:
                "Connect with others on a similar path. Share experiences, find encouragement, and build lasting support networks in a safe space.",
        },
    ];

    return (
        <>
            <Head title="Welcome to Diabby - Your Partner in Diabetes Care" />

            {/* --- Hero Section --- */}
            <motion.section
                initial="initial"
                animate="animate"
                className="relative w-full flex items-center justify-center overflow-hidden
                           bg-gradient-to-br from-sky-100 via-cyan-50 to-teal-50
                           dark:from-slate-900 dark:via-slate-800/50 dark:to-cyan-900/30
                           min-h-[calc(100vh-5rem)] md:min-h-[800px]
                           py-24 md:py-32"
            >
                {/* Spicy Animated Aurora Background */}
                <motion.div
                    variants={backdropVariants}
                    className="absolute inset-0 z-0 overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-full">
                        <div className="aurora-outer">
                            <div className="aurora-inner" />
                        </div>
                    </div>
                </motion.div>

                <div className="container relative z-10 px-6 mx-auto">
                    <motion.div
                        className="grid items-center grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-24"
                        variants={staggerContainer(0.2)}
                    >
                        {/* Text Content Area */}
                        <motion.div
                            className="text-center lg:text-left"
                            variants={staggerContainer(0.15)}
                        >
                            <motion.span
                                variants={fadeInUp(0)}
                                className="inline-block px-5 py-2 mb-6 text-sm font-bold tracking-wider text-white uppercase rounded-full shadow-md bg-gradient-to-r from-cyan-400 to-sky-500 dark:from-cyan-300 dark:to-sky-400 dark:text-cyan-900 shadow-cyan-500/30"
                            >
                                Take Control, Live Vibrantly
                            </motion.span>
                            <motion.h1
                                variants={fadeInUp(0.1)}
                                className="mb-6 text-5xl font-extrabold leading-tight tracking-tighter sm:text-6xl md:text-7xl text-slate-800 dark:text-white"
                            >
                                Your ally in{" "}
                                <LineShadowText
                                    className="italic !pb-1 text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-teal-600 dark:from-cyan-300 dark:to-teal-400"
                                    shadowColor={lineShadowColor}
                                    strokeWidth="1.5px"
                                    shadowBlur="6px"
                                >
                                    managing
                                </LineShadowText>{" "}
                                diabetes with confidence.
                            </motion.h1>
                            <motion.p
                                variants={fadeInUp(0.2)}
                                className="max-w-xl mx-auto mb-10 text-lg leading-relaxed md:text-xl text-slate-600 dark:text-slate-300 lg:mx-0"
                            >
                                Diabby empowers you with personalized insights,
                                expert guidance, and a supportive community.
                                Transform your diabetes journey, one day at a
                                time.
                            </motion.p>

                            {/* Call-to-Action Buttons */}
                            <motion.div
                                variants={fadeInUp(0.3)}
                                className="flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start"
                            >
                                {isLoggedIn ? (
                                    <ShinyButton href={route("dashboard")}>
                                        Go to Dashboard{" "}
                                        <ArrowRightIcon className="w-5 h-5" />
                                    </ShinyButton>
                                ) : (
                                    <>
                                        {canRegister && (
                                            <ShinyButton
                                                href={route("register")}
                                            >
                                                Get Started Free{" "}
                                                <SparklesIcon className="w-5 h-5" />
                                            </ShinyButton>
                                        )}
                                        <OutlineButton href={route("about")}>
                                            Learn More
                                        </OutlineButton>
                                    </>
                                )}
                            </motion.div>
                        </motion.div>

                        {/* Visual Area */}
                        <motion.div
                            variants={heroImageVariants}
                            className="flex justify-center lg:justify-end group" // Added group for potential hover effects on children
                        >
                            <div className="relative w-full max-w-md p-2 lg:max-w-lg">
                                {/* Enhanced BG Glow Effect */}
                                <motion.div
                                    className="absolute transition-all duration-500 transform -inset-4 -z-10 bg-gradient-to-br from-teal-300/70 via-cyan-400/70 to-sky-500/70 dark:from-teal-600/50 dark:via-cyan-600/50 dark:to-sky-700/50 rounded-2xl blur-2xl opacity-70 dark:opacity-50 group-hover:opacity-100 group-hover:blur-xl"
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{
                                        scale: 1,
                                        opacity: 1,
                                        transition: {
                                            duration: 0.8,
                                            delay: 0.8,
                                            ease: "easeOut",
                                        },
                                    }}
                                ></motion.div>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{
                                        opacity: 1,
                                        y: 0,
                                        transition: {
                                            duration: 0.7,
                                            ease: "easeOut",
                                            delay: 1,
                                        },
                                    }}
                                    className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-xl shadow-2xl
                                               p-6 aspect-[4/3] flex items-center justify-center overflow-hidden
                                               border border-white/20 dark:border-slate-700/50"
                                >
                                    <img
                                        src="https://placehold.co/600x450/E0F2F7/0E7490?text=Diabby+App+UI&font=raleway&font-size=40"
                                        alt="Diabby app interface showing supportive diabetes care tools"
                                        className="object-contain w-full h-full rounded-lg shadow-lg"
                                    />
                                    {/* Optional: Subtle inner glow or pattern */}
                                    <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-slate-900/5 dark:ring-white/10"></div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.section>

            {/* --- Feature Section --- */}
            <section className="py-20 bg-white border-t lg:py-28 dark:bg-slate-900/95 border-slate-200 dark:border-slate-700/50">
                <div className="container px-6 mx-auto">
                    <motion.div
                        className="max-w-3xl mx-auto mb-16 text-center lg:mb-20"
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true, amount: 0.3 }}
                        variants={staggerContainer(0.1, 0)}
                    >
                        <motion.h2
                            variants={fadeInUp()}
                            className="text-4xl font-bold tracking-tight md:text-5xl text-slate-800 dark:text-white"
                        >
                            Everything You Need,{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-teal-500 dark:from-cyan-300 dark:to-teal-300">
                                All In One Place
                            </span>
                        </motion.h2>
                        <motion.p
                            variants={fadeInUp(0.1)}
                            className="max-w-2xl mx-auto mt-5 text-lg text-slate-600 dark:text-slate-300"
                        >
                            Diabby isn't just an app; it's your dedicated
                            partner, designed to simplify and enrich your life
                            with diabetes through innovative tools and
                            compassionate support.
                        </motion.p>
                    </motion.div>

                    <motion.div
                        className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
                        variants={staggerContainer(0.15)}
                        initial="initial"
                        whileInView="whileInView" // Use whileInView for the parent
                        viewport={{ once: true, amount: 0.1 }}
                    >
                        {featureItems.map((feature, index) => (
                            <motion.div
                                key={index}
                                className="relative p-8 overflow-hidden transition-all duration-300 border shadow-xl cursor-pointer bg-gradient-to-br from-sky-50 via-white to-teal-50 dark:from-slate-800/70 dark:via-slate-800 dark:to-cyan-900/30 rounded-xl hover:shadow-2xl border-slate-200/70 dark:border-slate-700/70 group" // Added group
                                variants={featureCardVariants} // Let Framer handle staggering based on parent
                                // Removed whileInView and initial from child as parent handles it for staggering
                                whileHover="hover" // Apply hover variant directly
                            >
                                {/* Subtle animated gradient border on hover */}
                                <div className="absolute transition-opacity duration-300 opacity-0 -inset-px rounded-xl group-hover:opacity-100">
                                    <div className="absolute inset-0 rounded-xl animate-feature-border-glow" />
                                </div>

                                <div className="relative z-10">
                                    <div className="flex items-center justify-center w-16 h-16 mb-6 text-white rounded-full shadow-lg bg-gradient-to-br from-cyan-400 to-sky-500 dark:from-cyan-300 dark:to-sky-400 dark:text-cyan-900 shadow-cyan-500/30">
                                        <feature.icon
                                            className="w-8 h-8"
                                            aria-hidden="true"
                                        />
                                    </div>
                                    <h3 className="mb-3 text-2xl font-semibold tracking-tight text-slate-800 dark:text-white">
                                        {feature.title}
                                    </h3>
                                    <p className="leading-relaxed text-slate-600 dark:text-slate-300">
                                        {feature.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>
            {/* --- Any other sections e.g., Testimonials, Call To Action --- */}
        </>
    );
}

Welcome.layout = (page) => (
    <MainLayout
        auth={page.props.auth}
        title={page.props.title || "Welcome"} // Ensure title prop is passed from Head
        children={page}
    />
);
