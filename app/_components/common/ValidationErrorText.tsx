type Props = {
  message: string | undefined;
};

export default function ValidationErrorText(props: Props) {
  const { message } = props;

  return (
    <span className="text-red-500 text-xs">
      {message}
    </span>
  )
}
