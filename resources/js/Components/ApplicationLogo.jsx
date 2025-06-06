export default function ApplicationLogo(props) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-20 h-20 transition-transform stroke-current text-cyan-600 dark:text-cyan-400 group-hover:scale-105"
        >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 16c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"></path>
            <path d="M12 12l-2-2m4 0l-2 2"></path>
        </svg>
    );
}
