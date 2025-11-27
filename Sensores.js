let device, server, service, characteristic;
let connected = false;
let textDecoder = new TextDecoder();

async function connectBT() {
  try {
    device = await navigator.bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: [0x1101] // Serial Port Profile (Android)
    });

    server = await device.gatt.connect();
    service = await server.getPrimaryService(0x1101);
    characteristic = await service.getCharacteristic(0x0002);

    await characteristic.startNotifications();
    characteristic.addEventListener("characteristicvaluechanged", handleData);

    connected = true;

    alert("Conectado al HC-05");

  } catch (error) {
    console.error("Error:", error);
  }
}

function handleData(event) {
  let data = textDecoder.decode(event.target.value);

  if (data.includes("S1")) {
    document.getElementById("s1").innerText = data.replace("S1:", "").trim() + " cm";
  }
  if (data.includes("S2")) {
    document.getElementById("s2").innerText = data.replace("S2:", "").trim() + " cm";
  }
  if (data.includes("S3")) {
    document.getElementById("s3").innerText = data.replace("S3:", "").trim() + " cm";
  }
}

function disconnectBT() {
  if (device && device.gatt.connected) {
    device.gatt.disconnect();
    alert("Desconectado");
  }
}