import { motion } from 'framer-motion'

const EASE = [0.22, 1, 0.36, 1]

/**
 * Scroll-triggered reveal animation. Wraps any content.
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {string} [props.className]
 * @param {number} [props.delay] - seconds
 * @param {number} [props.y] - initial Y offset in px
 * @param {boolean} [props.once]
 * @param {string} [props.as] - html tag ('div','section','li'...)
 */
export default function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
  once = true,
  as = 'div',
}) {
  const MotionTag = motion[as] || motion.div
  return (
    <MotionTag
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '-60px' }}
      transition={{ duration: 0.6, delay, ease: EASE }}
      className={className}
    >
      {children}
    </MotionTag>
  )
}
