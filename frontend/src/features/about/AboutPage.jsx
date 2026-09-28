import React from 'react'
import { motion } from 'framer-motion'
import { AboutHero } from './components/AboutHero'
import { AboutVisionMission } from './components/AboutVisionMission'
import { AboutPillars } from './components/AboutPillars'
import { AboutTechSpecs } from './components/AboutTechSpecs'

export function AboutPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="w-full min-h-screen px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto transition-colors duration-300"
    >
      <AboutHero />
      <AboutVisionMission />
      <AboutPillars />
      <AboutTechSpecs />
    </motion.div>
  )
}
