module.exports = {
  devServer: {
    client: {
      webSocketURL: {
        hostname: 'localhost',
        pathname: '/ws',
        port: 3000,
      },
      overlay: {
        errors: true,
        warnings: false,
      },
    },
    hot: true,
  },
};
