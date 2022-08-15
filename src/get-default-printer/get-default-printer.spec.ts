import { mocked } from "jest-mock";
import getDefaultPrinter, { Printer } from "./get-default-printer";
import execAsync from "../utils/exec-async";

jest.mock("../utils/throw-if-unsupported-os");
jest.mock("../utils/exec-async");
const mockedExecAsync = mocked(execAsync);

const mockDefaultPrinterStdout = `\r\r\nNode,DeviceID,Name\r\r\ntest,Microsoft Print to PDF,Microsoft Print to PDF\r\r\n`;

it("gets the default printer", async () => {
  mockedExecAsync.mockResolvedValue({
    stdout: mockDefaultPrinterStdout,
    stderr: "",
  });

  const result: Printer | null = await getDefaultPrinter();

  expect(result).toStrictEqual({
    deviceId: "Microsoft Print to PDF",
    name: "Microsoft Print to PDF",
  });
});

it("returns null when default printer is not defined", async () => {
  mockedExecAsync.mockResolvedValue({ stdout: "", stderr: "" });

  const result = await getDefaultPrinter();

  expect(result).toStrictEqual(null);
});

it("when did not find any printer info", async () => {
  const stdout = `\r\r\nNode,\r\r\n`;
  mockedExecAsync.mockResolvedValue({ stdout, stderr: "" });

  const result = await getDefaultPrinter();

  return expect(result).toBe(null);
});

it("throws when execAsync fails", () => {
  mockedExecAsync.mockRejectedValue("error");
  return expect(getDefaultPrinter()).rejects.toBe("error");
});
