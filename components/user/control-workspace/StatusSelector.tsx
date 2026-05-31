import { toast } from "sonner";

const options = [
  { label: "Compliant", color: "success" },
  { label: "Partially Compliant", color: "warning" },
  { label: "Not Compliant", color: "destructive" },
  { label: "Not Applicable", color: "info" },
];

interface StatusSelectorProps {
  status: string;
  setStatus: (status: string) => void;
}

export default function StatusSelector({ status, setStatus }: StatusSelectorProps) {
  const handleChange = (value: string) => {
    setStatus(value);
    toast.success("Status updated");
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {options.map((opt) => (
        <div
          key={opt.label}
          onClick={() => handleChange(opt.label)}
          className={`cursor-pointer border rounded-xl p-4 
          ${status === opt.label ? "border-primary bg-primary/10" : ""}`}
        >
          <p className="font-medium">{opt.label}</p>
        </div>
      ))}
    </div>
  );
}
