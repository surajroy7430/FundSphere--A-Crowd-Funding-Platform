import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Bell } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useFetch } from "../hooks/use-fetch";

const Notifications = () => {
  const { user } = useAuth();
  const { request, loading } = useFetch();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      // const res = await axios.get();
      // const {count} = res.data
      const count = Math.floor(Math.random() * 5); // test
      setUnreadCount(count);
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);

    return () => clearInterval(interval);
  }, [user]);

  return (
    <div className="relative">
      <motion.div
        key={unreadCount}
        initial={{ rotate: 0 }}
        animate={{ rotate: [0, -15, 15, -10, 10, 0] }}
        transition={{ duration: 0.6 }}
      >
        <Bell size={22} className="cursor-pointer" />
      </motion.div>

      <AnimatePresence>
        {unreadCount > 0 && (
          <motion.div
            key="badge"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="absolute -top-1 -right-1"
          >
            <Badge className="size-4 rounded-full grid place-items-center bg-red-500 text-white text-[10px] font-bold p-0 cursor-pointer">
              {unreadCount}
            </Badge>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Notifications;
