import app from './lib/app';

const PORT = process.env.PORT || 7890;

app.listen(PORT, async () => {
  console.info(`🚀  Server started on port ${PORT}`);
});

process.on('exit', () => {
  console.info('👋  Goodbye!');
});
