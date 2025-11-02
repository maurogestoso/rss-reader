type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {};

export default function Button({ children, className, ...rest }: Props) {
  return (
    <button
      className={[
        "p-2 rounded-lg text-sm flex gap-1 items-center cursor-pointer disabled:bg-stone-400",
        className,
      ].join(" ")}
      {...rest}
    >
      {children}
    </button>
  );
}
