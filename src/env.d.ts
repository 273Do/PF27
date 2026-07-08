/// <reference types="astro/client" />

declare module "*.glb" {
  const src: string;
  export default src;
}

declare module "*.hdr" {
  const src: string;
  export default src;
}

declare module "*.frag" {
  const src: string;
  export default src;
}
