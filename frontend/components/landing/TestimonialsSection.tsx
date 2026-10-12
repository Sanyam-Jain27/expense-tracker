"use client";

import React, { memo } from "react";
import { Star } from "lucide-react";

const reviews = [
  {
    name: "Alex Rivera",
    role: "Senior Software Engineer",
    text: "FinTrack completely replaced my messy Excel spreadsheets. The live money flow chart and category breakdown make it dead simple to see my exact burn rate.",
    stars: 5,
  },
  {
    name: "Samantha Lee",
    role: "Independent Consultant",
    text: "Managing variable freelance income used to be a nightmare. With FinTrack, I can log irregular client payments and monthly expenses in seconds. Highly recommended!",
    stars: 5,
  },
  {
    name: "David Kim",
    role: "Product Designer",
    text: "The UI design is top tier. Zero lag, beautiful charts, and clean emoji tagging. It actually makes budgeting feel rewarding rather than like a chore.",
    stars: 5,
  },
];

const TestimonialsSection: React.FC = () => {
  return (
    <section id="testimonials" className="py-20 bg-slate-50 border-t border-slate-200/80">
      <div className="max-w-6xl mx-auto px-6 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            Reviews & Social Proof
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Loved by smart savers and professionals
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            See how FinTrack is empowering individuals to gain mastery over their financial life.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div
              key={review.name}
              className="bg-white p-7 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(review.stars)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed italic mb-6">
                  &ldquo;{review.text}&rdquo;
                </p>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <div className="text-sm font-bold text-slate-900">{review.name}</div>
                <div className="text-xs text-slate-400 font-medium">{review.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default memo(TestimonialsSection);

