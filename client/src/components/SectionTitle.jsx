export default function SectionTitle({ title, subtitle }) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-jbnu-navy">{title}</h2>
      {subtitle && <p className="mt-1 text-gray-600">{subtitle}</p>}
    </div>
  )
}
