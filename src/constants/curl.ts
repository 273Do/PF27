const C = {
  lightGray: "\x1b[37m",
  gray: "\x1b[90m",
  bold: "\x1b[1m",
  bg: "\x1b[48;5;m",
  bgWhite: "\x1b[107m",
  black: "\x1b[30m",
  underline: "\x1b[4m",
  reset: "\x1b[0m",
};

export const SELF_INTRO = `
  ${C.lightGray}${C.bold}____ _____ _____        ${C.reset}${C.gray}${C.bold}__    __           _${C.reset}
 ${C.lightGray}${C.bold}|___ |___  |___ /__/\\__ ${C.reset}${C.gray}${C.bold}/ / /\\ \\ \\___  _ __| | _____${C.reset}
   ${C.lightGray}${C.bold}__) | / /  |_ \\     / ${C.reset}${C.gray}${C.bold}\\ \\/  \\/ / _ \\| '__| |/ / __|${C.reset}
  ${C.lightGray}${C.bold}/ __/ / /  ___) /_  _\\ ${C.reset}${C.gray}${C.bold} \\  /\\  | (_) | |  |   <\\__ \\${C.reset}
 ${C.lightGray}${C.bold}|_____/_/  |____/  \\/     ${C.reset}${C.gray}${C.bold}\\/  \\/ \\___/|_|  |_|\\_|___/${C.reset}


${C.bgWhite}${C.black}273* (tuna-sand)${C.reset}
`;
