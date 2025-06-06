// resources/js/Pages/Welcome.jsx

import React from "react";
import { Head, Link } from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout";
import { LineShadowText } from "@/components/magicui/line-shadow-text";
import { motion } from "framer-motion";
import {
    ArrowRightIcon,
    SparklesIcon,
    UserGroupIcon,
    ChartBarIcon,
    BookOpenIcon,
    UserPlusIcon, // For How it Works
    DocumentChartBarIcon, // For How it Works
    LightBulbIcon, // For How it Works
    ChatBubbleLeftRightIcon, // For How it Works / Testimonials
    StarIcon, // For Testimonials rating
    ShieldCheckIcon, // Example for trust/security if needed
} from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/20/solid"; // For filled stars
import clsx from "clsx";

// --- Animation Variants (Kept from original) ---

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

const cardVariants = {
    // General card animation
    initial: { opacity: 0, y: 50, scale: 0.95 },
    whileInView: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.6, ease: "easeOut" },
    },
};

const featureCardVariants = {
    ...cardVariants, // Inherit base card animation
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

// --- Reusable Components (Kept and Translated for props) ---
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

// New component for Section Title
const SectionTitle = ({ children, subTitle, delay = 0 }) => (
    <motion.div
        className="max-w-3xl mx-auto mb-16 text-center lg:mb-20"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer(0.1, delay)}
    >
        <motion.h2
            variants={fadeInUp()}
            className="text-4xl font-bold tracking-tight md:text-5xl text-slate-800 dark:text-white"
        >
            {children}
        </motion.h2>
        {subTitle && (
            <motion.p
                variants={fadeInUp(0.1)}
                className="max-w-2xl mx-auto mt-5 text-lg text-slate-600 dark:text-slate-300"
            >
                {subTitle}
            </motion.p>
        )}
    </motion.div>
);

export default function Welcome({ auth, canLogin, canRegister }) {
    const isLoggedIn = auth && auth.user;

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
        : "rgba(8, 145, 178, 0.2)";

    const featureItems = [
        {
            title: "Suivi Personnalisé des Progrès",
            icon: ChartBarIcon,
            description:
                "Visualisez votre parcours avec des graphiques et des informations intuitifs. Comprenez vos tendances, célébrez vos étapes et restez motivé.",
        },
        {
            title: "Ressources d'Experts Sélectionnées",
            icon: BookOpenIcon,
            description:
                "Accédez à une bibliothèque d'articles basés sur des preuves, de délicieuses recettes et des conseils pratiques sélectionnés par des spécialistes du diabète.",
        },
        {
            title: "Communauté de Soutien Active",
            icon: UserGroupIcon,
            description:
                "Connectez-vous avec d'autres personnes sur un chemin similaire. Partagez vos expériences, trouvez des encouragements et construisez des réseaux de soutien durables dans un espace sûr.",
        },
    ];

    const howItWorksSteps = [
        {
            title: "Inscrivez-vous Facilement",
            icon: UserPlusIcon,
            description:
                "Créez votre compte en quelques minutes et personnalisez votre profil.",
            delay: 0,
        },
        {
            title: "Suivez Vos Données Quotidiennes",
            icon: DocumentChartBarIcon,
            description:
                "Enregistrez glycémie, repas, activité physique et plus encore, sans effort.",
            delay: 0.15,
        },
        {
            title: "Recevez des Analyses Éclairées",
            icon: LightBulbIcon,
            description:
                "Diabby analyse vos données pour vous offrir des tendances claires et des conseils personnalisés.",
            delay: 0.3,
        },
        {
            title: "Rejoignez la Communauté",
            icon: ChatBubbleLeftRightIcon,
            description:
                "Échangez avec d'autres membres, partagez vos défis et célébrez vos succès ensemble.",
            delay: 0.45,
        },
    ];

    const testimonials = [
        {
            quote: "Diabby a transformé ma manière de gérer mon diabète. Les graphiques sont clairs et la communauté est incroyablement motivante.",
            name: "Sophie L.",
            details: "Utilisatrice depuis 1 an",
            rating: 5,
        },
        {
            quote: "Enfin une application qui comprend vraiment les défis quotidiens. Les ressources et recettes sont un vrai plus !",
            name: "Marc D.",
            details: "Diagnostiqué récemment",
            rating: 5,
        },
        {
            quote: "Je me sens moins seul et plus en contrôle. Merci Diabby pour cet outil exceptionnel et facile à utiliser !",
            name: "Aisha K.",
            details: "Active dans la communauté",
            rating: 4,
        },
    ];

    return (
        <>
            <Head title="Bienvenue sur Diabby - Votre Partenaire pour la Gestion du Diabète" />

            {/* --- Enhanced Hero Section --- */}
            <motion.section
                initial="initial"
                animate="animate"
                className="relative flex items-center justify-center w-full min-h-screen py-16 overflow-hidden bg-gradient-to-br from-sky-50 via-cyan-50 to-teal-100 dark:from-slate-900 dark:via-slate-800/50 dark:to-cyan-900/30 md:py-20"
            >
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
                        className="grid items-center grid-cols-1 gap-12 lg:grid-cols-12 xl:gap-16"
                        variants={staggerContainer(0.2)}
                    >
                        {/* Content Section - Left Side */}
                        <motion.div
                            className="text-center lg:col-span-5 xl:col-span-4 lg:text-left"
                            variants={staggerContainer(0.15)}
                        >
                            <motion.span
                                variants={fadeInUp(0)}
                                className="inline-block px-6 py-3 mb-8 text-sm font-bold tracking-wider text-white uppercase rounded-full shadow-lg bg-gradient-to-r from-cyan-500 to-sky-600 dark:from-cyan-400 dark:to-sky-500 dark:text-cyan-900 shadow-cyan-500/40"
                            >
                                Prenez le Contrôle, Vivez Pleinement
                            </motion.span>

                            <motion.h1
                                variants={fadeInUp(0.1)}
                                className="mb-8 text-4xl font-extrabold leading-tight tracking-tighter sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl text-slate-800 dark:text-white"
                            >
                                Votre allié pour{" "}
                                <LineShadowText
                                    className="italic !pb-1 text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-teal-600 dark:from-cyan-300 dark:to-teal-400"
                                    shadowColor={lineShadowColor}
                                    strokeWidth="1.5px"
                                    shadowBlur="6px"
                                >
                                    gérer
                                </LineShadowText>{" "}
                                le diabète avec confiance.
                            </motion.h1>

                            <motion.p
                                variants={fadeInUp(0.2)}
                                className="max-w-lg mb-10 text-lg leading-relaxed md:text-xl text-slate-600 dark:text-slate-300 lg:max-w-none"
                            >
                                Diabby vous donne les moyens grâce à des
                                informations personnalisées, des conseils
                                d'experts et une communauté de soutien.
                                Transformez votre parcours avec le diabète, un
                                jour à la fois.
                            </motion.p>

                            <motion.div
                                variants={fadeInUp(0.3)}
                                className="flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start"
                            >
                                {isLoggedIn ? (
                                    <ShinyButton href={route("dashboard")}>
                                        Tableau de Bord{" "}
                                        <ArrowRightIcon className="w-5 h-5" />
                                    </ShinyButton>
                                ) : (
                                    <>
                                        {canRegister && (
                                            <ShinyButton
                                                href={route("register")}
                                            >
                                                Commencer Gratuitement{" "}
                                                <SparklesIcon className="w-5 h-5" />
                                            </ShinyButton>
                                        )}
                                        <OutlineButton href={route("about")}>
                                            En Savoir Plus
                                        </OutlineButton>
                                    </>
                                )}
                            </motion.div>
                        </motion.div>

                        {/* Image Section - Right Side */}
                        <motion.div
                            variants={heroImageVariants}
                            className="flex justify-center lg:col-span-7 xl:col-span-8 lg:justify-end"
                        >
                            <div className="relative w-full max-w-2xl lg:max-w-4xl group">
                                {/* Background Glow Effects */}
                                <motion.div
                                    className="absolute transition-all duration-700 -inset-8 bg-gradient-to-br from-teal-300/40 via-cyan-400/40 to-sky-500/40 dark:from-teal-600/30 dark:via-cyan-600/30 dark:to-sky-700/30 rounded-3xl blur-3xl opacity-60 dark:opacity-40 group-hover:opacity-80 group-hover:blur-2xl"
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{
                                        scale: 1,
                                        opacity: 1,
                                        transition: {
                                            duration: 1,
                                            delay: 0.6,
                                            ease: "easeOut",
                                        },
                                    }}
                                />

                                <motion.div
                                    className="absolute transition-all duration-500 opacity-50 -inset-4 bg-gradient-to-br from-cyan-200/60 via-sky-200/60 to-teal-200/60 dark:from-cyan-700/20 dark:via-sky-700/20 dark:to-teal-700/20 rounded-2xl blur-xl group-hover:opacity-70"
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
                                />

                                {/* Main Image Container */}
                                <motion.div
                                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                                    animate={{
                                        opacity: 1,
                                        y: 0,
                                        scale: 1,
                                        transition: {
                                            duration: 0.8,
                                            ease: "easeOut",
                                            delay: 0.4,
                                        },
                                    }}
                                    className="relative overflow-hidden transition-all duration-500 border shadow-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-2xl border-white/30 dark:border-slate-700/50 group-hover:shadow-3xl"
                                >
                                    {/* Image */}
                                    <div className="relative aspect-[16/10] lg:aspect-[4/3] xl:aspect-[16/10]">
                                        <img
                                            src="https://images.unsplash.com/photo-1556911073-a517e752729c?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                            alt="Interface de l'application Diabby montrant des outils de gestion du diabète"
                                            className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-105"
                                        />

                                        {/* Overlay Gradient */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-transparent" />

                                        {/* Floating UI Elements */}
                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{
                                                opacity: 1,
                                                x: 0,
                                                transition: {
                                                    delay: 1.2,
                                                    duration: 0.6,
                                                },
                                            }}
                                            className="absolute p-4 border shadow-lg top-6 left-6 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md rounded-xl border-white/20 dark:border-slate-700/50"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                                                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                                                    Glycémie: 85 mg/dL
                                                </span>
                                            </div>
                                        </motion.div>

                                        <motion.div
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{
                                                opacity: 1,
                                                x: 0,
                                                transition: {
                                                    delay: 1.4,
                                                    duration: 0.6,
                                                },
                                            }}
                                            className="absolute p-4 border shadow-lg top-6 right-6 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md rounded-xl border-white/20 dark:border-slate-700/50"
                                        >
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-2 rounded-full bg-gradient-to-r from-cyan-400 to-sky-500" />
                                                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                                                    85%
                                                </span>
                                            </div>
                                        </motion.div>

                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{
                                                opacity: 1,
                                                y: 0,
                                                transition: {
                                                    delay: 1.6,
                                                    duration: 0.6,
                                                },
                                            }}
                                            className="absolute p-4 border shadow-lg bottom-6 left-6 right-6 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md rounded-xl border-white/20 dark:border-slate-700/50"
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                                                    Prochain rappel
                                                </span>
                                                <span className="text-sm font-bold text-cyan-600 dark:text-cyan-400">
                                                    14:30
                                                </span>
                                            </div>
                                        </motion.div>
                                    </div>

                                    {/* Inner Border */}
                                    <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-slate-900/5 dark:ring-white/10" />
                                </motion.div>

                                {/* Decorative Elements */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{
                                        opacity: 1,
                                        scale: 1,
                                        transition: {
                                            delay: 1.8,
                                            duration: 0.5,
                                        },
                                    }}
                                    className="absolute w-8 h-8 rounded-full shadow-lg -top-4 -right-4 bg-gradient-to-br from-yellow-400 to-orange-500"
                                />

                                <motion.div
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{
                                        opacity: 1,
                                        scale: 1,
                                        transition: { delay: 2, duration: 0.5 },
                                    }}
                                    className="absolute w-12 h-12 rounded-full shadow-lg -bottom-6 -left-6 bg-gradient-to-br from-pink-400 to-rose-500 opacity-80"
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.section>

            {/* --- Feature Section --- */}
            <section className="py-20 bg-white border-t lg:py-28 dark:bg-slate-900/95 border-slate-200 dark:border-slate-700/50">
                <div className="container px-6 mx-auto">
                    <SectionTitle subTitle="Diabby n'est pas seulement une application ; c'est votre partenaire dévoué, conçu pour simplifier et enrichir votre vie avec le diabète grâce à des outils innovants et un soutien compatissant.">
                        Tout ce dont Vous Avez Besoin,{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-teal-500 dark:from-cyan-300 dark:to-teal-300">
                            Au Même Endroit
                        </span>
                    </SectionTitle>
                    <motion.div
                        className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
                        variants={staggerContainer(0.15)}
                        initial="initial"
                        whileInView="whileInView"
                        viewport={{ once: true, amount: 0.1 }}
                    >
                        {featureItems.map((feature, index) => (
                            <motion.div
                                key={index}
                                className="relative p-8 overflow-hidden transition-all duration-300 border shadow-xl cursor-pointer bg-gradient-to-br from-sky-50 via-white to-teal-50 dark:from-slate-800/70 dark:via-slate-800 dark:to-cyan-900/30 rounded-xl hover:shadow-2xl border-slate-200/70 dark:border-slate-700/70 group"
                                variants={featureCardVariants}
                                whileHover="hover"
                            >
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

            {/* --- How It Works Section --- */}
            <section className="py-20 lg:py-28 bg-gradient-to-b from-slate-50 to-sky-100 dark:from-slate-900 dark:to-slate-800/60 border-y dark:border-slate-700/50">
                <div className="container px-6 mx-auto">
                    <SectionTitle subTitle="Découvrez comment Diabby vous accompagne au quotidien, simplement et efficacement.">
                        Comment{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-cyan-600 dark:from-sky-300 dark:to-cyan-400">
                            ça Marche ?
                        </span>
                    </SectionTitle>
                    <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-4">
                        {howItWorksSteps.map((step, index) => (
                            <motion.div
                                key={index}
                                className="flex flex-col items-center text-center"
                                variants={cardVariants}
                                initial="initial"
                                whileInView="whileInView"
                                viewport={{ once: true, amount: 0.3 }}
                            >
                                <div className="flex items-center justify-center w-20 h-20 mb-6 bg-white border-2 rounded-full shadow-lg dark:bg-slate-700/50 border-cyan-300 dark:border-cyan-600 text-cyan-600 dark:text-cyan-400">
                                    <step.icon className="w-10 h-10" />
                                </div>
                                <h3 className="mb-2 text-xl font-semibold text-slate-800 dark:text-white">
                                    {step.title}
                                </h3>
                                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                                    {step.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- Testimonials Section --- */}
            <section className="py-20 bg-white border-b lg:py-28 dark:bg-slate-900/95 dark:border-slate-200 dark:border-slate-700/50">
                <div className="container px-6 mx-auto">
                    <SectionTitle subTitle="Des histoires vraies, des résultats concrets. Découvrez l'impact de Diabby.">
                        Ce que Nos{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-cyan-500 dark:from-teal-300 dark:to-cyan-300">
                            Utilisateurs Disent
                        </span>
                    </SectionTitle>
                    <motion.div
                        className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
                        variants={staggerContainer(0.2)}
                        initial="initial"
                        whileInView="whileInView"
                        viewport={{ once: true, amount: 0.1 }}
                    >
                        {testimonials.map((testimonial, index) => (
                            <motion.div
                                key={index}
                                className="flex flex-col p-8 transition-all duration-300 border shadow-lg bg-slate-50 dark:bg-slate-800/80 rounded-xl hover:shadow-2xl hover:border-cyan-400 dark:hover:border-cyan-500 border-slate-200 dark:border-slate-700"
                                variants={cardVariants}
                            >
                                <ChatBubbleLeftRightIcon className="w-10 h-10 mb-4 text-cyan-500 dark:text-cyan-400" />
                                <blockquote className="flex-grow mb-6 text-lg italic leading-relaxed text-slate-700 dark:text-slate-200">
                                    "{testimonial.quote}"
                                </blockquote>
                                <div className="flex items-center justify-between mt-auto">
                                    <div>
                                        <p className="font-semibold text-slate-800 dark:text-white">
                                            {testimonial.name}
                                        </p>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">
                                            {testimonial.details}
                                        </p>
                                    </div>
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <StarIconSolid
                                                key={i}
                                                className={clsx(
                                                    "w-5 h-5",
                                                    i < testimonial.rating
                                                        ? "text-amber-400"
                                                        : "text-slate-300 dark:text-slate-600"
                                                )}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* --- Final Call to Action --- */}
            <section className="py-20 text-white lg:py-32 bg-gradient-to-tr from-cyan-600 via-sky-600 to-teal-700 dark:from-cyan-700 dark:via-sky-700 dark:to-teal-800">
                <div className="container px-6 mx-auto text-center">
                    <motion.div
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true, amount: 0.5 }}
                        variants={staggerContainer(0.15)}
                    >
                        <motion.h2
                            variants={fadeInUp()}
                            className="text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl"
                        >
                            Prêt à Transformer Votre Parcours avec le Diabète ?
                        </motion.h2>
                        <motion.p
                            variants={fadeInUp(0.1)}
                            className="max-w-2xl mx-auto mt-6 text-lg leading-relaxed md:text-xl text-sky-100 dark:text-sky-200"
                        >
                            Rejoignez Diabby aujourd'hui et découvrez une
                            nouvelle approche pour vivre mieux avec le diabète.
                            Support, outils et communauté vous attendent.
                        </motion.p>
                        <motion.div
                            variants={fadeInUp(0.2)}
                            className="flex flex-col items-center justify-center gap-4 mt-12 sm:flex-row"
                        >
                            {isLoggedIn ? (
                                <ShinyButton
                                    href={route("dashboard")}
                                    className="!bg-white !text-sky-700 hover:!bg-sky-50 dark:!bg-sky-100 dark:!text-sky-800 dark:hover:!bg-sky-200"
                                >
                                    Accéder à mon Tableau de Bord{" "}
                                    <ArrowRightIcon className="w-5 h-5" />
                                </ShinyButton>
                            ) : (
                                <>
                                    {canRegister && (
                                        <ShinyButton
                                            href={route("register")}
                                            className="!bg-white !text-sky-700 hover:!bg-sky-50 dark:!bg-sky-100 dark:!text-sky-800 dark:hover:!bg-sky-200"
                                        >
                                            Commencer Gratuitement{" "}
                                            <SparklesIcon className="w-5 h-5" />
                                        </ShinyButton>
                                    )}
                                    <OutlineButton
                                        href={route("about")}
                                        className="!text-white !border-sky-200/70 hover:!bg-white/10 dark:!text-sky-100 dark:!border-sky-300/50 dark:hover:!bg-white/20"
                                    >
                                        En Savoir Plus
                                    </OutlineButton>
                                </>
                            )}
                        </motion.div>
                    </motion.div>
                </div>
            </section>
        </>
    );
}

Welcome.layout = (page) => (
    <MainLayout
        auth={page.props.auth}
        title={page.props.title || "Bienvenue"} // Translated fallback title
        children={page}
    />
);
