const NOTE_OFF = 0x80;
const NOTE_ON = 0x90;
const UNKNOWN_CMD = 0xA0;

class DebugMidiDevice {

  constructor(debugElement=undefined, debugTableElement) {
    this.debugElement = debugElement;
    this.debugTableElement = debugTableElement;

    this.reset();
  }
  
  onmidimessage(rawMessage) {
    let message = parseMessage(rawMessage);

    if(!message) {
      return;
    }

    let value = message.velocity / 128;

    if(message.command === NOTE_OFF) {
      value = 0;
    }

    this.setValue(message.pitch, value);
  }

  setValue(i, value) {
    let debugElement = this.debugElement && this.debugElement.children[i];
    if(debugElement) {
      debugElement.dataset.value = value * 128;
      debugElement.style.setProperty(`--value`, value);
    }
  }

  reset() {
    this.setValue(0, 0);
    this.setValue(1, 0);
    this.setValue(2, 0);
  }
}

function parseMessage(message) {
  const [cmd, pitch, velocity] = message;

  if (cmd >= NOTE_OFF && cmd < NOTE_ON) {
    return {command: NOTE_OFF, channel: cmd - NOTE_OFF, pitch, velocity};
  } else if (cmd >= NOTE_ON && cmd < UNKNOWN_CMD) {
    return {command: NOTE_ON, channel: cmd - NOTE_ON, pitch, velocity};
  } else {
    return null;
  }
}

export {DebugMidiDevice};