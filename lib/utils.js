import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function getMood(mood, text = true) {
  if (mood === "happy") {
    return text ? "😀 Happy" : "😀";
  } else if (mood === "sad") {
    return text ? "😔 Sad" : "😔";
  } else if (mood === "exited") {
    return text ? "🤩 Exited" : "🤩";
  } else if (mood === "angry") {
    return text ? "😠 Angry" : "😠";
  } else if (mood === "calm") {
    return text ? "😌 Calm" : "😌";
  } else if (mood === "confused") {
    return text ? "😕 Confused" : "😕";
  } else if (mood === "bored") {
    return text ? "😑 Bored" : "😑";
  } else if (mood === "chill") {
    return text ? "😎 Chill" : "😎";
  } else if (mood === "embrassed") {
    return text ? "😔 Embrassed" : "😔";
  } else if (mood === "uncomfortable") {
    return text ? "😣 Uncomfortable" : "😣";
  } else if (mood === "worried") {
    return text ? "😟 Worried" : "😟";
  }
}