import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function getMood(mood) {
  if (mood === "happy") {
    return "😀 Happy";
  } else if (mood === "sad") {
    return "😔 Sad";
  } else if (mood === "exited") {
    return "🤩 Exited";
  } else if (mood === "angry") {
    return "😠 Angry";
  } else if (mood === "calm") {
    return "😌 Calm";
  } else if (mood === "confused") {
    return "😕 Confused";
  } else if (mood === "bored") {
    return "😑 Bored";
  } else if (mood === "chill") {
    return "😎 Chill";
  } else if (mood === "embrassed") {
    return "😔 Embrassed";
  } else if (mood === "uncomfortable") {
    return "😣 Uncomfortable";
  } else if (mood === "worried") {
    return "😟 Worried";
  }
}