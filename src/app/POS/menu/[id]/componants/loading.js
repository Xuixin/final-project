import { motion } from "framer-motion";

export function Loader() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
            {Array.from({ length: 8 }).map((_, index) => (
                <motion.div
                    key={index}
                    className="bg-white p-4 rounded-lg shadow-lg border"
                    initial={{ opacity: 0.3 }}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                    <motion.div className="h-4 bg-purple-200 rounded mb-4" />
                    <motion.div className="h-4 bg-purple-200 rounded mb-4 w-3/4" />
                    <motion.div className="h-4 bg-purple-200 rounded w-1/2" />
                </motion.div>
            ))}
        </div>
    );
}
