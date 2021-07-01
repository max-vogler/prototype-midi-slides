import { DebugMidiDevice } from "./midi_device";

let devices = [];
const virtualDevices = [];

function registerVirtualMidiOutput(device) {
  virtualDevices.push(device);
}

function broadcastMidiMessage(message) {
  devices.forEach((device) => {
    device.send(message);
  });
  virtualDevices.forEach((device) => {
    device.onmidimessage(message);
  });
}

function initialize(reveal) {
  navigator.requestMIDIAccess({sysex: false}).then((access) => {
    access.onstatechange = () => processMidiDevices(access);
    processMidiDevices(access);
  });

function processMidiDevices(access) {
  devices = Array.from(access.outputs.values());

  for(const input of access.inputs.values()) {
    input.onmidimessage = (message) => {
      virtualDevices.forEach((device) => {
        device.onmidimessage(message.data);
      });
    }
  }
}

  const device = new DebugMidiDevice();

  reveal.on('slidechanged', ({currentSlide}) => {
    device.debugElement = currentSlide.querySelector(".midi-debug");
    device.reset();
  });

  registerVirtualMidiOutput(device);
}

export {initialize, broadcastMidiMessage, registerVirtualMidiOutput};
