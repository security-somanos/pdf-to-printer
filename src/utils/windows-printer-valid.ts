import { Printer } from "../get-default-printer/get-default-printer";

export default function isValidPrinter(printer: string): {
  isValid: boolean;
  printerData: Printer;
} {
  const printerData: Printer = {
    deviceId: "",
    name: "",
  };

  const [, deviceid, name] = printer.split(",").map((el) => el.trim());
  printerData.deviceId = deviceid;
  printerData.name = name;
  const isValid = !!(printerData.deviceId && printerData.name);

  return {
    isValid,
    printerData,
  };
}
