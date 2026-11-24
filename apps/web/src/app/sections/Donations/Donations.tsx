import React from 'react';

export default function Donations() {
  return (
    <section id="donations" className="py-12 text-center px-4 w-full">
      <div className="max-w-2xl mx-auto flex flex-col items-center gap-4">
        
        {/* Your original donations title */}
        <h2 className="aisle-heading mb-2">
          Aisle 6 · Donations
        </h2>
        
        {/* Clean, updated outreach message as plain, borderless text */}
        <p className="text-[#C9D5E3] text-base md:text-lg font-light italic leading-relaxed">
          Interested in donating or supporting our mission? Contact us at wehackutd@gmail.com
        </p>

      </div>
    </section>
  );
}