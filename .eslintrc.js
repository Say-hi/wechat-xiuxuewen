module.exports = {
  extends: 'standard',
  plugins: [
    'standard',
    'promise',
    'json'
  ],
  globals: {
    App: true,
    Page: true,
    getApp: true,
	Component: true,
	getCurrentPages: true,
    wx: true
  }
};
