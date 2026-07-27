import type { TutorialCourse } from '../types';
import { groupIntoSections, getLessonNav, LEVEL_META } from '../shared';
import { beginnerLessons } from './beginner';
import { intermediateLessons } from './intermediate';
import { advancedLessons } from './advanced';

const LEVEL_SUMMARIES = {
  beginner: {
    ...LEVEL_META.beginner,
    summary: "IDE, digital/analog I/O, serial debugging, and first sensor projects.",
  },
  intermediate: {
    ...LEVEL_META.intermediate,
    summary: "Libraries, I2C/SPI, motors, interrupts, and structured firmware.",
  },
  advanced: {
    ...LEVEL_META.advanced,
    summary: "ESP Wi-Fi/MQTT, robotics basics, and home-automation capstones.",
  },
};

const allLessons = [...beginnerLessons, ...intermediateLessons, ...advancedLessons].sort(
  (a, b) => a.order - b.order,
);

export const arduinoTutorial: TutorialCourse = {
  slug: "arduino",
  title: "Arduino Tutorial",
  shortTitle: "Arduino",
  description: "A complete Arduino path from Blink to sensors, motors, communication buses, IoT boards, and robotics-style capstones.",
  tagline: "Sense the world and control hardware",
  audience: "Makers, students, and engineers learning embedded electronics with Arduino",
  totalLessons: allLessons.length,
  sections: groupIntoSections(allLessons, LEVEL_SUMMARIES),
  tag: "Embedded",
  highlights: ["Hands-on sketches you can upload today","Sensors, actuators, and communication buses","Non-blocking timing and state machines","IoT and robotics project capstones"],
};

export function getAllArduinoLessons() {
  return allLessons;
}

export function getArduinoLesson(slug: string) {
  return allLessons.find((lesson) => lesson.slug === slug);
}

export function getArduinoLessonNav(slug: string) {
  return getLessonNav(allLessons, slug);
}
