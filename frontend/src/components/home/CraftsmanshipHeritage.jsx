'use client';

import React from 'react';
import Image from 'next/image';
import { ShieldCheck, Gem, Hammer, Sparkles } from 'lucide-react';

export default function CraftsmanshipHeritage() {
  const steps = [
    {
      num: '01',
      title: 'Purity Without Compromise',
      desc: 'Every gram of gold is alloyed under strictly regulated metallurgical conditions and struck with the official 6-digit alphanumeric HUID by the Bureau of Indian Standards.',
      icon: ShieldCheck,
    },
    {
      num: '02',
      title: 'Ethical Natural Solitaires',
      desc: 'Selected from the top 1% of rough diamonds globally, our solitaires are graded by IGI and GIA for pristine colorless (E-F) clarity and ideal cut parameters.',
      icon: Gem,
    },
    {
      num: '03',
      title: 'Generations of Karigari',
      desc: 'Our master craftspeople descend from royal court ateliers. From delicate wire filigree to repoussé nakshi embossing, human touch brings each piece to life.',
      icon: Hammer,
    },
  ];

  return (
    <section className="py-20 sm:py-28 bg-[#F8F5EF] border-b border-[#E6DFD3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="font-sans text-xs uppercase tracking-[0.25em] text-[#C2AA6A] font-semibold mb-2">
            Purity & Pedigree
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#4A0B13] font-normal tracking-tight">
            The Pillars of Rishi Lal Craft
          </h2>
          <div className="w-16 h-0.5 bg-[#C2AA6A] mx-auto mt-4" />
          <p className="font-sans text-xs sm:text-sm text-[#454545] mt-4 leading-relaxed">
            In fine jewelry, genuine trust is forged in purity, certification, and timeless artistry.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="bg-white p-8 rounded-sm border border-[#E6DFD3] hover:border-[#C2AA6A]/50 shadow-xs hover:shadow-luxury transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-serif text-3xl font-light text-[#C2AA6A]">
                      {step.num}
                    </span>
                    <div className="p-3 rounded-full bg-[#F8F5EF] text-[#4A0B13] border border-[#C2AA6A]/30">
                      <Icon className="w-5 h-5 text-[#8B1E2D]" />
                    </div>
                  </div>
                  <h3 className="font-serif text-xl font-medium text-[#4A0B13] mb-3">
                    {step.title}
                  </h3>
                  <p className="font-sans text-xs sm:text-sm text-[#454545] leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#E6DFD3] flex items-center gap-1.5 text-xs text-[#8B1E2D] font-medium font-sans">
                  <Sparkles className="w-3.5 h-3.5 text-[#C2AA6A]" />
                  <span>Certified Rishi Lal Hallmark</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

