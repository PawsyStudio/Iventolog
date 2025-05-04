import logoHome from '@/assets/images/logos/home-logo.png'; 
import logoApp from '@/assets/images/logos/app-logo.png';

type LogoVariant = 'home' | 'app';

interface LogoProps {
  variant?: LogoVariant;
  className?: string;
}

export const Logo = ({ variant = 'app', className }: LogoProps) => {
  const logos = {
    home: logoHome,
    app: logoApp
  };

  return (
    <img
      src={logos[variant]}
      alt="Логотип"
      className={`logo ${className}`}
    />
  );
};