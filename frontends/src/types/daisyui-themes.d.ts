declare module 'daisyui/src/theming/themes' {
  const themes: {
    "[data-theme=light]": Record<string, any>;
    "[data-theme=dark]": Record<string, any>;
  };
  export default themes;
}