import { LoginForm } from "./components/login-form";

const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="mx-auto max-w-sm grid">
        <div className="flex flex-col gap-6">
          <h1>Entre com sua conta</h1>
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
