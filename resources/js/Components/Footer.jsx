// resources/js/Components/Footer.jsx

import React from "react";
import { Link } from "@inertiajs/react";
import { motion } from "framer-motion";
import {
    BrandGithub,
    BrandLinkedin,
    BrandFacebook,
    BrandTwitter,
} from "tabler-icons-react";

const FooterLink = ({ href, children }) => (
    <Link
        href={href}
        className="text-sm transition-colors duration-200 text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400"
    >
        {children}
    </Link>
);

const SocialLink = ({ href, icon: Icon, label }) => (
    <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="transition-colors duration-200 text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400"
        whileHover={{ y: -2, scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label={label}
    >
        <Icon size={22} strokeWidth={1.5} />
    </motion.a>
);

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const footerSections = [
        {
            title: "Diabby",
            links: [
                { label: "À Propos", href: route("about") }, // Replace with route('about') if you use Ziggy
                { label: "Fonctionnalités", href: "/features" },
                { label: "Témoignages", href: "#testimonials" }, // Example for internal link
                { label: "Blog", href: "/blog" },
            ],
        },
        {
            title: "Support",
            links: [
                { label: "FAQ", href: "/faq" },
                { label: "Contactez-nous", href: "/contact" },
                { label: "Centre d'Aide", href: "/help-center" },
            ],
        },
        {
            title: "Légal",
            links: [
                {
                    label: "Politique de Confidentialité",
                    href: "/privacy-policy",
                },
                { label: "Termes et Conditions", href: "/terms-of-service" },
                { label: "Politique des Cookies", href: "/cookie-policy" },
            ],
        },
    ];

    const socialLinks = [
        {
            href: "https://github.com/DrissiAli221",
            icon: BrandGithub,
            label: "GitHub",
        },
        {
            href: "https://x.com",
            icon: BrandTwitter,
            label: "X (Twitter)",
        },
        {
            href: "https://www.linkedin.com/in/ali-drissi-957090149/",
            icon: BrandLinkedin,
            label: "LinkedIn",
        },
        {
            href: "https://facebook.com",
            icon: BrandFacebook,
            label: "Facebook",
        },
    ];

    return (
        <motion.footer
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="border-t bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700/50"
        >
            <div className="container px-6 py-12 mx-auto lg:py-16">
                <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
                    {/* Brand/Logo Column */}
                    <div className="mb-8 md:col-span-2 lg:col-span-1 xl:col-span-2">
                        <Link
                            href="/"
                            className="flex items-center mb-4 space-x-2 group"
                        >
                            {/* Replace with your actual logo SVG or Image */}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="w-8 h-8 text-cyan-600 dark:text-cyan-400 group-hover:animate-pulse"
                            >
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 16c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"></path>
                                <path d="M12 12l-2-2m4 0l-2 2"></path>
                            </svg>
                            <span className="text-2xl font-bold transition-colors text-slate-800 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400">
                                Diabby
                            </span>
                        </Link>
                        <p className="max-w-sm text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                            Votre partenaire pour une gestion simplifiée et
                            éclairée du diabète. Prenez le contrôle, vivez
                            pleinement.
                        </p>
                        <div className="flex mt-6 space-x-5">
                            {socialLinks.map((social) => (
                                <SocialLink
                                    key={social.label}
                                    href={social.href}
                                    icon={social.icon}
                                    label={social.label}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Navigation Links Columns */}
                    {footerSections.map((section) => (
                        <div key={section.title} className="mb-8 lg:mb-0">
                            <h3 className="mb-4 text-base font-semibold tracking-wide uppercase text-slate-800 dark:text-slate-100">
                                {section.title}
                            </h3>
                            <ul className="space-y-3">
                                {section.links.map((link) => (
                                    <li key={link.label}>
                                        <FooterLink href={link.href}>
                                            {link.label}
                                        </FooterLink>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Copyright Section */}
                <div className="pt-8 mt-10 text-center border-t border-slate-200/70 dark:border-slate-700">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        © {currentYear} Diabby. Tous droits réservés.
                    </p>
                </div>
            </div>
        </motion.footer>
    );
}
