import { defineStore } from "pinia";

export const useThemeStore = defineStore("theme", {
  state: () => ({
    darkMode: localStorage.getItem("theme") === "dark",
  }),

  actions: {
    toggleTheme() {
      this.darkMode = !this.darkMode;

      if (this.darkMode) {
        document.documentElement.classList.add("dark");

        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");

        localStorage.setItem("theme", "light");
      }
    },

    initializeTheme() {
      if (this.darkMode) {
        document.documentElement.classList.add("dark");
      }
    },
  },
});