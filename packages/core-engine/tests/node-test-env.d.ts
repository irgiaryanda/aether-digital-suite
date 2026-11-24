declare const __dirname: string;

declare module "fs" {
  export function readdirSync(path: string): string[];
  export function readFileSync(path: string, encoding: "utf8"): string;
  export function existsSync(path: string): boolean;
  export function statSync(path: string): { isDirectory(): boolean };
}

declare module "path" {
  export function resolve(...paths: string[]): string;
  export function join(...paths: string[]): string;
}

declare module "child_process" {
  export function execSync(command: string, options: { encoding: "utf8" }): string;
}
