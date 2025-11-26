type EmptyStateProps = {
  message: string;
  description?: string;
};

export function EmptyState({ message, description }: EmptyStateProps) {
  return (
    <div
      style={{
        padding: "60px 20px",
        textAlign: "center",
        color: "#999",
      }}
    >
      <div style={{ fontSize: "3rem", marginBottom: "16px" }}>📋</div>
      <div
        style={{ fontSize: "1.125rem", fontWeight: 600, marginBottom: "8px" }}
      >
        {message}
      </div>
      {description && (
        <div style={{ fontSize: "0.875rem", color: "#666" }}>{description}</div>
      )}
    </div>
  );
}
