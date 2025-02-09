export type Size = "S" | "M" | "L" | "XL";

export interface Product {
  id: string;
  name: string;
  parents: {
    subline: string;
    line: string;
    department: string;
  };
  size: Size;
}
