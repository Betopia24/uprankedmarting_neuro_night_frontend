import { motion, AnimatePresence } from "framer-motion";

type Props = {
  step: number;
} & React.ComponentProps<"div">;

const variants = {
  initial: {
    opacity: 0,
    x: "-100vw",
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export default function SignupAnimation({ children }: Props) {
  return (
    <AnimatePresence initial={false} mode="wait">
      <motion.div variants={variants} initial="initial" animate="animate">
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
