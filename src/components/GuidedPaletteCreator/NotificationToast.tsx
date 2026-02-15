import { motion } from 'framer-motion';

interface NotificationToastProps {
  message: string;
}

export function NotificationToast({ message }: NotificationToastProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-6 py-3 rounded-xl shadow-lg border border-gray-700"
    >
      {message}
    </motion.div>
  );
}
