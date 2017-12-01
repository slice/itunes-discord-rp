const exec = require('./applescript');

const scripts = {
  info:
    'tell application "iTunes" to get { artist of current track, name of current track, player position, duration of ' +
    'current track, player state }',
};

module.exports = async function getState() {
  const [artist, title, position, duration, state] = await exec(scripts.info);

  return {
    state,
    artist,
    title,
    position,
    duration,
  };
};
