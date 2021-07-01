const NOTE_ON = "on", NOTE_OFF = "off";

class DebugMidiDevice {

  constructor(debugElement=undefined, debugTableElement) {
    this.debugElement = debugElement;
    this.debugTableElement = debugTableElement;

    this.reset();
  }
  
  onmidimessage(rawMessage) {
    let message = parseMessage(rawMessage);

    if(!message || message.pitch > 2) {
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

  if (cmd >= 128 && cmd < 144) {
    return {command: NOTE_OFF, channel: cmd - 128, pitch, velocity};
  } else if (cmd >= 144 && cmd < 160) {
    return {command: NOTE_ON, channel: cmd - 144, pitch, velocity};
  } else {
    return null;
  }
}

export {DebugMidiDevice};