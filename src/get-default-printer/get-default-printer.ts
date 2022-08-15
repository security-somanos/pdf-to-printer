import execAsync from "../utils/exec-async";
import throwIfUnsupportedOperatingSystem from "../utils/throw-if-unsupported-os";
import isValidPrinter from "../utils/windows-printer-valid";

export interface Printer {
  deviceId: string;
  name: string;
}

async function getDefaultPrinter(): Promise<Printer | null> {
  try {
    throwIfUnsupportedOperatingSystem();

    const { stdout } = await execAsync(
      'wmic printer where default="TRUE" get deviceid,name /format:csv'
    );

    // If stdout is empty, there is no default printer
    if (!stdout) return null;

    const splitted = stdout.split("\r\r\n");

    if (splitted.length < 3) {
      return null;
    }

    const printer = splitted[2];

    const { isValid, printerData } = isValidPrinter(printer);

    // DeviceID or Name not found
    if (!isValid) return null;

    return printerData;
  } catch (error) {
    throw error;
  }
}

export default getDefaultPrinter;
