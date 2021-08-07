import chalk, { Color } from 'chalk';

interface LoggerConfig {
  timestampColor: typeof Color;
  logColor: typeof Color;
  errorColor: typeof Color;
  debugColor: typeof Color;
  disableColors: boolean;
  debugAnnotation: string;
}

let LoggerConfig: LoggerConfig = {
  timestampColor: 'gray',
  logColor: 'green',
  errorColor: 'redBright',
  debugColor: 'blueBright',
  disableColors: false,
  debugAnnotation: 'dstn'
};

export function SetConfig(new_config: Partial<LoggerConfig>): void {
  LoggerConfig = { ...LoggerConfig, ...new_config };
}

export function Log(...optionalParams: any[]) {
  let mainContent = optionalParams[0];
  optionalParams.shift();

  let currentTime = new Date();
  let timestamp = `${currentTime.toTimeString().split(' ').slice(0, 2).join('-')} ${currentTime.toLocaleDateString().replace(/\//g, '-')}`;

  const ts = LoggerConfig.disableColors ? `[${timestamp}]` : `${chalk[LoggerConfig.timestampColor](`[${timestamp}]`)}`;
  const sep = LoggerConfig.disableColors ? 'L' : `${chalk.blueBright('L')}`;
  const content = LoggerConfig.disableColors ? mainContent : `${chalk[LoggerConfig.logColor](mainContent)}`;

  console.log(`${ts} : ${sep} : ${content}`, ...optionalParams);
}

export function Error(...optionalParams: any[]) {
  let mainContent = optionalParams[0];
  optionalParams.shift();

  let currentTime = new Date();
  let timestamp = `${currentTime.toTimeString().split(' ').slice(0, 2).join('-')} ${currentTime.toLocaleDateString().replace(/\//g, '-')}`;

  const ts = LoggerConfig.disableColors ? `[${timestamp}]` : `${chalk[LoggerConfig.timestampColor](`[${timestamp}]`)}`;
  const sep = LoggerConfig.disableColors ? 'E' : `${chalk.red('E')}`;
  const content = LoggerConfig.disableColors ? mainContent : `${chalk[LoggerConfig.errorColor](mainContent)}`;

  console.error(`${ts} : ${sep} : ${content}`, ...optionalParams);
}

export function Debug(...optionalParams: any[]) {
  if (!process.env.DEBUG || !process.env.DEBUG.includes(`${LoggerConfig.debugAnnotation}:*`)) return;

  let mainContent = optionalParams[0];
  optionalParams.shift();

  let currentTime = new Date();
  let timestamp = `${currentTime.toTimeString().split(' ').slice(0, 2).join('-')} ${currentTime.toLocaleDateString().replace(/\//g, '-')}`;

  const ts = LoggerConfig.disableColors ? `[${timestamp}]` : `${chalk[LoggerConfig.timestampColor](`[${timestamp}]`)}`;
  const sep = LoggerConfig.disableColors ? 'D' : `${chalk.magenta('D')}`;
  const content = LoggerConfig.disableColors ? mainContent : `${chalk[LoggerConfig.debugColor](mainContent)}`;

  console.log(`${ts} : ${sep} : ${content}`, ...optionalParams);
}
