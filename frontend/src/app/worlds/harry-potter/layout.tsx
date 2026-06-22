import './harry-potter.css';

export default function HarryPotterLayout({ children }: { children: React.ReactNode }) {
  return <div className="bg-[#0b0d14] min-h-screen">{children}</div>;
}
