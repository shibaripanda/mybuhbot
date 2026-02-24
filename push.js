const { execSync } = require('child_process');

const msg = process.argv[2]; // берём аргумент после имени скрипта

if (!msg) {
  console.error('Ошибка: укажите сообщение коммита, например: npm run push "fix-bug"');
  process.exit(1);
}

try {
  execSync('git add .', { stdio: 'inherit' });
  execSync(`git commit -m "${msg}"`, { stdio: 'inherit' });
  execSync('git push -f origin main', { stdio: 'inherit' });
} catch (err) {
  console.error('Ошибка при выполнении git команд:', err.message);
  process.exit(1);
}