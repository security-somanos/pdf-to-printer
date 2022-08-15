import execAsync from "../utils/exec-async";
import isValidPrinter from "../utils/windows-printer-valid";
import throwIfUnsupportedOperatingSystem from "../utils/throw-if-unsupported-os";
import { Printer } from "../get-default-printer/get-default-printer";

async function getPrinters(): Promise<Printer[]> {
  function stdoutHandler(stdout: string) {
    const printers: Printer[] = [];

    stdout
      .split("\n")
      .slice(2)
      .map((printer) => printer.trim())
      .filter((printer) => !!printer)
      .forEach((printer) => {
        const { isValid, printerData } = isValidPrinter(printer);

        if (!isValid) return;

        printers.push(printerData);
      });

    return printers;
  }

  try {
    throwIfUnsupportedOperatingSystem();
    const { stdout } = await execAsync(
      "cmd.exe /c wmic printer get name,deviceid /format:csv"
    );

    return await stdoutHandler(stdout);
  } catch (error) {
    throw error;
  }
}

export default getPrinters;
