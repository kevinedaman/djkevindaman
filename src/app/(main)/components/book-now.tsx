export function BookNow() {
  return (
    <div className="mt-16 text-center">
      <div className="bg-gray-900 rounded-lg p-8 border border-gray-800">
        <h2 className="text-2xl font-bold text-white mb-4">Ready to Book?</h2>
        <p className="text-gray-300 mb-6">Contact me directly for availability and pricing</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="tel:+19528560353"
            className="bg-purple-500 text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-purple-600 shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] transition-all"
          >
            Call Now
          </a>
          <a
            href="mailto:djkevindaman@gmail.com"
            className="border border-cyan-400 text-cyan-400 px-8 py-3 rounded-md text-lg font-medium hover:bg-cyan-400 hover:text-black transition-colors shadow-[0_0_10px_rgba(34,211,238,0.3)]"
          >
            Email Me
          </a>
        </div>
      </div>
    </div>
  );
}
