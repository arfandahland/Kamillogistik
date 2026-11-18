export default function Waves({ light = false }: { light?: boolean }) {
  return (
    <div className="waves" aria-hidden="true">
      <svg viewBox="0 0 1200 120" preserveAspectRatio="none"><path d="M0 60 Q150 20 300 60 T600 60 T900 60 T1200 60 V120 H0Z" fill={light ? "#c8f8f0" : "#0f6a5b"} opacity=".6" /></svg>
      <svg viewBox="0 0 1200 120" preserveAspectRatio="none"><path d="M0 70 Q150 35 300 70 T600 70 T900 70 T1200 70 V120 H0Z" fill={light ? "#e5faf5" : "#1d8a76"} opacity=".75" /></svg>
    </div>
  );
}
