export interface RegistrationFormData {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  ageRange: string;
  program: string;
  learningMode: string;
  startDate: string;
  experienceLevel: string;
  occupation: string;
  motivation: string;
  referralSource: string;
}

export interface Program {
  id: string;
  title: string;
  shortTitle: string;
  type: 'full' | 'partial';
  emoji: string;
  duration: string;
  level: string;
  priceXAF: number;
  monthlyXAF?: number;
  registrationFee: number;
  description: string;
  technologies: string[];
  highlights: string[];
  accentColor: string;
  logoUrl: string;
  badge?: string;
}

export type LearningMode = {
  id: string;
  label: string;
  description: string;
  icon: string;
};
