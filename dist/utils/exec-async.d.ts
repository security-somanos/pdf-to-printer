/// <reference types="node" />
import { exec } from "child_process";
declare const execAsync: typeof exec.__promisify__;
export default execAsync;
