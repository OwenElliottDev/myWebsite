import txtMap from '@/txtFiles/txtMapping';
import directoryStructure, { lnkMap, pageMap } from './mockFileSystem';
import helpStr from './help';

interface commandData {
  command: string;
  dirBiscuitCrumbs: string[];
  updateCommands: (v: string[]) => void;
  updateResponses: (v: string[]) => void;
  updateBiscuitCrumbs: (v: string[]) => void;
  updateCurrent: (v: string) => void;
}

export function autoCompleteDir(command: string, dirBiscuitCrumbs: string[]) {
  // get current directory listing and the last part of the current command
  let dirListing = directoryStructure.get(dirBiscuitCrumbs[dirBiscuitCrumbs.length - 1]);
  let s = command.split(' ')[command.split(' ').length - 1];
  // find all strings that start with s
  let matches = dirListing.filter((str: string) => str.startsWith(s));
  // sort them alphabetically
  matches.sort();
  let prefix = s;
  if (matches.length !== 1) {
    let next = '';
    let done = false;
    while (!done) {
      done = true;
      for (let i = 0; i < matches.length - 1; i++) {
        // compare the current prefix with the next character of each match
        next = prefix + matches[i][prefix.length];
        if (next !== prefix + matches[i + 1][prefix.length]) {
          // if there is a mismatch, stop extending the prefix
          done = true;
          break;
        }
      }
      if (!done) {
        // if there is no mismatch, extend the prefix by one character and continue
        prefix = next;
      }
    }
  } else {
    prefix = matches[0];
  }
  let lastIndex = command.lastIndexOf(' ');
  command = command.substring(0, lastIndex);
  return `${command} ${prefix}`; // return the longest common prefix integrated intp the command
}

function processCommand({
  command,
  dirBiscuitCrumbs,
  updateCommands,
  updateResponses,
  updateCurrent,
  updateBiscuitCrumbs,
}: commandData): string {
  if (command == 'clear') {
    updateCommands([]);
    updateResponses([]);
    updateCurrent('');
    return 'clear';
  }
  let commandParts = command.split(' ');

  if (commandParts[0] == 'cd') {
    if (commandParts.length < 2) return 'Please provide a directory';
    let attemptedDir = commandParts[1];
    if (attemptedDir == '..') {
      let tmpCrumbs = [...dirBiscuitCrumbs];
      // stop user from going too far back
      if (tmpCrumbs.length <= 1) return '';
      tmpCrumbs.pop();
      updateBiscuitCrumbs(tmpCrumbs);
      return '';
    }
    if (
      directoryStructure
        .get(dirBiscuitCrumbs[dirBiscuitCrumbs.length - 1])
        .includes(attemptedDir) &&
      directoryStructure.get(attemptedDir)
    ) {
      updateBiscuitCrumbs([...dirBiscuitCrumbs, attemptedDir]);
      return '';
    }
    return "Error: No directory called '" + attemptedDir + "'";
  }

  if (commandParts[0] == 'ls') {
    return directoryStructure.get(dirBiscuitCrumbs[dirBiscuitCrumbs.length - 1]).join('  ');
  }

  if (commandParts[0] == 'open') {
    if (commandParts.length < 2) return 'Please provide a file';
    let dirContents = directoryStructure
      .get(dirBiscuitCrumbs[dirBiscuitCrumbs.length - 1])
      .join(' ');

    if (commandParts[1].endsWith('.lnk')) {
      let lnk = lnkMap.get(commandParts[1]);
      if (lnk && dirContents.includes(commandParts[1])) {
        window.open(lnk, '_blank');
        return `${commandParts[1]} opened in a new tab.`;
      } else {
        return `${commandParts[1]} does not exist.`;
      }
    }
    if (commandParts[1].endsWith('.txt')) {
      let txt = txtMap.get(commandParts[1]);
      if (txt && dirContents.includes(commandParts[1])) {
        return txt;
      } else {
        return `${commandParts[1]} does not exist.`;
      }
    }
  }

  if (commandParts[0] == 'serve') {
    if (commandParts.length < 2) return 'Please provide a page';
    let dirContents = directoryStructure
      .get(dirBiscuitCrumbs[dirBiscuitCrumbs.length - 1])
      .join(' ');

    if (commandParts[1].endsWith('.page')) {
      let page = pageMap.get(commandParts[1]);
      if (page && dirContents.includes(commandParts[1])) {
        window.open(page, '_blank');
        return `${commandParts[1]} opened in a new tab.`;
      } else {
        return `${commandParts[1]} does not exist.`;
      }
    }
  }

  if (commandParts[0] == 'useradd') {
    if (commandParts.length < 2) return 'Please provide a username';
    if (commandParts[1]) {
      let username = commandParts[1];
      localStorage.setItem('username', username);
      return `You are now ${username}`;
    }
  }

  if (commandParts[0] == 'whoami') {
    let user = localStorage.getItem('username');
    return user ? user : 'guest';
  }

  if (command == 'help') {
    return helpStr;
  }

  if (command == 'logout') {
    window.location.href = 'http://localhost/';
    return 'Logging you out, goodbye!';
  }

  if (command == 'connect') {
    window.open('https://www.linkedin.com/in/owen-elliott-345254166/', '_blank');
    return "Let's connect!";
  }

  return "Error: '" + command + "' is not a known command.";
}

export default processCommand;
