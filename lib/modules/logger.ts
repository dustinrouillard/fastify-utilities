import chalk from 'chalk';

export function Log(...optionalParams: any[]) {
  let mainContent = optionalParams[0];
  optionalParams.shift();

  let currentTime = new Date();
  let timestamp = `${currentTime.toTimeString().split(' ').slice(0, 2).join('-')} ${currentTime.toLocaleDateString().replace(/\//g, '-')}`;

  console.log(`${chalk.gray(`[${timestamp}]`)} : ${chalk.yellow('L')} : ${chalk.green(mainContent)}`, ...optionalParams);
}

export function Error(...optionalParams: any[]) {
  let mainContent = optionalParams[0];
  optionalParams.shift();

  let currentTime = new Date();
  let timestamp = `${currentTime.toTimeString().split(' ').slice(0, 2).join('-')} ${currentTime.toLocaleDateString().replace(/\//g, '-')}`;

  console.error(`${chalk.gray(`[${timestamp}]`)} : ${chalk.red('E')} : ${chalk.redBright(mainContent)}`, ...optionalParams);
}

export function Debug(...optionalParams: any[]) {
  if (!process.env.DEBUG?.includes('dustin:*')) return;

  let mainContent = optionalParams[0];
  optionalParams.shift();

  let currentTime = new Date();
  let timestamp = `${currentTime.toTimeString().split(' ').slice(0, 2).join('-')} ${currentTime.toLocaleDateString().replace(/\//g, '-')}`;

  console.log(`${chalk.gray(`[${timestamp}]`)} : ${chalk.magenta('D')} : ${chalk.blueBright(mainContent)}`, ...optionalParams);
}
