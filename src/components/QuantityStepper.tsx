import { MinusOutlined, PlusOutlined } from '@ant-design/icons';

interface Props {
  value: number;
  max: number;
  onDecrease: () => void;
  onIncrease: () => void;
}

export default function QuantityStepper({ value, max, onDecrease, onIncrease }: Props) {
  return (
    <div className="qty" role="group" aria-label="Quantity">
      <button type="button" onClick={onDecrease} disabled={value <= 1} aria-label="Decrease quantity"><MinusOutlined /></button>
      <span aria-live="polite">{value}</span>
      <button type="button" onClick={onIncrease} disabled={value >= max} aria-label="Increase quantity"><PlusOutlined /></button>
    </div>
  );
}
