import {
  ShieldCheck,
  Lock,
  Globe,
  HeartPulse,
  CreditCard,
  Server,
  Cloud,
  Database,
  FileCheck,
} from "lucide-react";

import { LucideIcon } from "lucide-react";

export const frameworkIcons: Record<string, LucideIcon> = {
  "SOC 2": ShieldCheck,
  "ISO 27001": Lock,
  GDPR: Globe,
  HIPAA: HeartPulse,
  "PCI DSS": CreditCard,
  "NIST CSF": Server,
  FedRAMP: Cloud,
  "CIS Controls": Database,
  "ISO 27701": FileCheck,
  "SOC 1": ShieldCheck,
};

export const categoryStyles: Record<string, string> = {
  Security: "bg-blue-50 text-blue-600 border-blue-200",
  Privacy: "bg-green-50 text-green-600 border-green-200",
  Industry: "bg-orange-50 text-orange-600 border-orange-200",
};
