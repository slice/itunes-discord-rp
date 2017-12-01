const DiscordRPC = require('discord-rpc');
const iTunesStatus = require('./itunes');
const { clientID } = require('./constants');

DiscordRPC.register(clientID);
const rpc = new DiscordRPC.Client({
  transport: 'ipc',
});

rpc.on('ready', async () => {
  console.log('RPC ready. Updating now, and every 3 seconds.');
  await update();
  setInterval(update, 3000);
});

async function update() {
  console.log('Updating now.');

  const { artist, title, position, duration, state } = await iTunesStatus();
  let activity = {
    details: title,
    state: artist,
    largeImageKey: 'itunes',
  };

  if (state === 'paused') {
    rpc.setActivity({
      ...activity,
      details: `Paused: ${title}`,
    });
    return;
  }

  const positionMs = position * 1000;
  const durationMs = duration * 1000;
  const startTimestamp = new Date(Date.now() - positionMs);
  const endTimestamp = new Date(Date.now() + (durationMs - positionMs));

  rpc.setActivity({
    ...activity,
    startTimestamp,
    endTimestamp,
  });
}

process.on('unhandledRejection', err => {
  console.error(err.stack);
  process.exit(1);
});

rpc.login(clientID);
