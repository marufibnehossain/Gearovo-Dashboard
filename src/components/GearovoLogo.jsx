export default function GearovoLogo({ collapsed = false, className = '' }) {
  return (
    <img
      src="/images/Gearovo.png"
      alt="Gearovo"
      className={`shrink-0 object-contain object-left ${className}`}
      style={{
        height: collapsed ? 28 : 32,
        width: collapsed ? 28 : undefined,
      }}
    />
  )
}
