
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
}

const FeatureCard = ({ icon: Icon, title, description, color }: FeatureCardProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-8 transition-all duration-300 hover:shadow-lg hover:scale-105">
      <div className={`w-16 h-16 rounded-2xl ${color} flex items-center justify-center mb-6`}>
        <Icon size={28} className="text-white" />
      </div>
      <h3 className="text-xl font-semibold mb-3 text-kitchance-navy-dark">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default FeatureCard;
