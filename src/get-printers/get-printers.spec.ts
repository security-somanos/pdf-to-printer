import { mocked } from "jest-mock";
import { Printer } from "../get-default-printer/get-default-printer";
import execAsync from "../utils/exec-async";
import getPrinters from "./get-printers";

jest.mock("../utils/throw-if-unsupported-os");
jest.mock("../utils/exec-async");
const mockedExecAsync = mocked(execAsync);

afterEach(() => {
  // restore the original implementation
  mockedExecAsync.mockRestore();
});

const mockPrinterListStdout = `\r\r
Node,DeviceID,Name\r\r
test,OneNote,OneNote\r\r
test,Microsoft-XPS-Document-Writer,Microsoft XPS Document Writer\r\r
test,Microsoft_Print_to_PDF,Microsoft Print to PDF\r\r
test,Fax,Fax\r\r\n`;

it("returns list of available printers", async () => {
  mockedExecAsync.mockResolvedValue({
    stdout: mockPrinterListStdout,
    stderr: "",
  });

  const result: Printer[] = await getPrinters();

  expect(result).toStrictEqual([
    { deviceId: "OneNote", name: "OneNote" },
    {
      deviceId: "Microsoft-XPS-Document-Writer",
      name: "Microsoft XPS Document Writer",
    },
    {
      deviceId: "Microsoft_Print_to_PDF",
      name: "Microsoft Print to PDF",
    },
    {
      deviceId: "Fax",
      name: "Fax",
    },
  ]);
});

it("when did not find any printer info", async () => {
  const stdout = `\n\nNode,\n\n`;
  mockedExecAsync.mockResolvedValue({ stdout, stderr: "" });

  const result = await getPrinters();

  return expect(result).toEqual([]);
});

it("fails with an error", () => {
  mockedExecAsync.mockRejectedValue("error");
  return expect(getPrinters()).rejects.toBe("error");
});
