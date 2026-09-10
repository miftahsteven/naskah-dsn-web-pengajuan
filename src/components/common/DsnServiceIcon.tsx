import React from 'react';
import {
  BookOpen,
  Users,
  Award,
  ShieldCheck,
  GitMerge,
  FileCheck2,
  ClipboardCheck,
  AlertTriangle,
  HelpCircle,
  FileText,
  Layers,
} from 'lucide-react';

interface DsnServiceIconProps {
  name?: string;
  iconName?: string;
  className?: string;
}

export const DsnServiceIcon: React.FC<DsnServiceIconProps> = ({ name, iconName, className = 'w-6 h-6' }) => {
  const targetName = iconName || name || '';
  switch (targetName) {
    case 'BookOpen':
      return <BookOpen className={className} />;
    case 'Users':
      return <Users className={className} />;
    case 'Award':
      return <Award className={className} />;
    case 'ShieldCheck':
      return <ShieldCheck className={className} />;
    case 'GitMerge':
      return <GitMerge className={className} />;
    case 'FileCheck2':
      return <FileCheck2 className={className} />;
    case 'ClipboardCheck':
      return <ClipboardCheck className={className} />;
    case 'AlertTriangle':
      return <AlertTriangle className={className} />;
    case 'HelpCircle':
      return <HelpCircle className={className} />;
    case 'FileText':
      return <FileText className={className} />;
    default:
      return <Layers className={className} />;
  }
};
