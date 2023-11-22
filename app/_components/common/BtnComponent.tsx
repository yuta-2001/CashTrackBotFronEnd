type Props = {
  text: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export default function BtnComponent(props: Props) {
  const { text, onClick, className, disabled } = props;
  return (
    <button
      onClick={onClick}
      className={`bg-green-500 hover:bg-green-600 text-white font-bold w-16 h-16 rounded-full leading-none text-3xl ${className}`}
      aria-label={text}
      disabled={disabled}
    >
      {text}
    </button>
  )
}

