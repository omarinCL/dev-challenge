import { Size } from "../domain/models/product.model";

const sizeOrder: Record<Size, number> = {
  S: 0,
  M: 1,
  L: 2,
  XL: 3,
};

export function isSizeWithinRange(
  size: Size,
  minSize: Size,
  maxSize: Size
): boolean {
  const productSizeValue = sizeOrder[size];
  const minSizeValue = sizeOrder[minSize];
  const maxSizeValue = sizeOrder[maxSize];
  return productSizeValue >= minSizeValue && productSizeValue <= maxSizeValue;
}
