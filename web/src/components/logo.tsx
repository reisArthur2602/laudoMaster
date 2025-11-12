import { CloudUpload } from "lucide-react";
import { Link } from "react-router";

type Logo = {
  to?: string;
};

export const Logo = ({ to = "/dashboard" }: Logo) => {
  return (
    <Link to={to} className="flex items-center">
      <CloudUpload className="size-5 text-primary" />
      <div className="text-xl">
        <span className="font-extrabold tracking-tight">Portal</span>
        <span className="font-light">Master</span>
      </div>
    </Link>
  );
};
