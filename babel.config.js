const stylexPlugin = [
  "@stylexjs/babel-plugin",
  {
    dev: process.env.NODE_ENV !== "production",
    test: process.env.NODE_ENV === "test",
    runtimeInjection: false,
    treeshakeCompensation: true,
    unstable_moduleResolution: {
      type: "commonJS",
      rootDir: __dirname,
    },
  },
];

module.exports = {
  presets: ["next/babel"],
  plugins: [stylexPlugin],
};
