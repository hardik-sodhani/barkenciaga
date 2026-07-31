import stylexPlugin from "@stylexjs/postcss-plugin";

const stylexBabelPlugin = [
  "@stylexjs/babel-plugin",
  {
    dev: process.env.NODE_ENV !== "production",
    runtimeInjection: false,
    treeshakeCompensation: true,
    aliases: {
      "@/*": ["/ROOT/src/*"],
    },
    unstable_moduleResolution: {
      type: "commonJS",
      rootDir: process.cwd(),
    },
  },
];

const config = {
  plugins: [
    stylexPlugin({
      include: ["src/**/*.{js,jsx,ts,tsx}"],
      useCSSLayers: true,
      babelConfig: {
        babelrc: false,
        configFile: false,
        parserOpts: {
          plugins: ["typescript", "jsx"],
        },
        plugins: [stylexBabelPlugin],
      },
    }),
  ],
};

export default config;
