import LoginForm from "../components/LoginForm";

export default function Login() {
  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg)",
      }}
    >
      <LoginForm />
    </div>
  );
}