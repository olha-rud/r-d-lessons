type ErrorMessageProps = {
  message: string;
};

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div
      style={{
        padding: "40px 20px",
        textAlign: "center",
        color: "#ef4444",
        fontSize: "1rem",
        background: "#fee",
        borderRadius: "8px",
        margin: "24px",
      }}
    >
      ⚠️ {message}
    </div>
  );
}
