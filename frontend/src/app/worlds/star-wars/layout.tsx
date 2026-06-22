import './star-wars.css';

export default function StarWarsLayout({ children }: { children: React.ReactNode }) {
  return <div className="flex-1 flex flex-col bg-[#050508]">{children}</div>;
}
