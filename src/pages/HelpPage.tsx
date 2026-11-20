export default function HelpPage() {
  return (
    <div className="max-w-[1060px] px-[31px] py-[27px] max-[560px]:p-5 [&_details]:border-b [&_details]:border-line [&_details]:py-[18px] [&_summary]:cursor-pointer [&_summary]:text-[13px] [&_summary]:font-semibold [&_summary]:text-ink [&_details_p]:mt-3 [&_details_p]:mb-0 [&_details_p]:max-w-[780px] [&_details_p]:text-[13px] [&_img]:mt-6 [&_img]:block [&_img]:max-h-[460px] [&_img]:max-w-full [&_img]:object-contain rounded-xl border border-line bg-white shadow-sm">
      <h3>Using the selection tools</h3>
      {[
        [
          "How is force calculated?",
          "The incremental method multiplies flux density by its spatial rate of change. Manual profiles use an exponential trend fitted to the measured values. FEA data uses a 5 mm grid and Gaussian smoothing.",
        ],
        [
          "Which curve should I choose?",
          "Use connected measured points when you have many reliable measurements, especially near the magnet face. Use an exponential trend for a smooth estimate. Force and lift always use the exponential fit. At least four distinct distance/gauss pairs are required; remove empty rows.",
        ],
        [
          "What do cold and hot mean?",
          "Cold is the ambient 20°C condition. Hot represents stabilised electromagnet operation, typically 12–36 hours. Permanent magnets do not have hot-operation datasets.",
        ],
        [
          "What current reductions are used in the hot FEA models?",
          "SE7000: 32%; SE700: 25%; SEV: 31%; SE FC Compact: 20%; SE Dry Compact: 36%. Actual reductions vary with ambient temperatures and manufacturing.",
        ],
        [
          "What do the contours show?",
          "The right half of the area below the magnet. Offset runs from the centreline toward the edge. Distance is measured below the face plate. The other half is a mirror image.",
        ],
        [
          "How do I change force units?",
          "Use the shared Analysis Units bar at the top of any page to choose distance and force-index units. Chart values and labels will update automatically. 1 T²/m = 100,000 G²/mm.",
        ],
        [
          "Are the results a performance guarantee?",
          "No. FEA values can differ from measured values because of manufacturing and ambient conditions. Static lift is in air, to the object centre, without burden. Be especially cautious near the surface, outside the measurement range, and with competitor-supplied data.",
        ],
      ].map(([q, a]) => (
        <details key={q}>
          <summary>{q}</summary>
          <p>{a}</p>
        </details>
      ))}
      <img
        src="/help/ContourPlot.png"
        alt="Illustration of the area below a magnet represented by the contour plots"
      />
    </div>
  );
}