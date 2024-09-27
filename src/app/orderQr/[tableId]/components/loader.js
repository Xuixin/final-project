import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export function Loader_orderQr() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6">

            <motion.div
                className="bg-white p-4 rounded-lg shadow-lg border"
                initial={{ opacity: 0.3 }}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
                <Loader2 className={'animate-spin S'} />
            </motion.div>

        </div>
    )
}