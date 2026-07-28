import React from 'react';
import Button from '@/components/Button';
import { BookOpen, ShieldCheck, Heart, Sparkles, Compass } from 'lucide-react';

export const metadata = {
  title: 'Statement of Faith | ABBA Collective',
  description: 'Read the Statement of Faith of ABBA Collective—our biblical convictions regarding God, adoption, grace, and Christian identity.',
};

export default function FaithPage() {
  const convictions = [
    {
      number: "01",
      title: "The Sovereign Fatherhood of God",
      verse: "Romans 8:15",
      scripture: "For you did not receive the spirit of slavery to fall back into fear, but you have received the Spirit of adoption by whom we cry, 'Abba! Father!'",
      text: "We believe in one God—Father, Son, and Holy Spirit—creator of all things visible and invisible. God is not a distant deity, but a loving Father who draws us into relationship through His sovereign grace.",
    },
    {
      number: "02",
      title: "Grace Revealed in Jesus Christ",
      verse: "Ephesians 2:8-9",
      scripture: "For by grace you have been saved through faith. And this is not your own doing; it is the gift of God, not a result of works, so that no one may boast.",
      text: "We affirm that salvation and right standing with God are obtained solely by grace through faith in the finished work of Jesus Christ on the cross. Performance, striving, and self-righteousness have no place in sonship.",
    },
    {
      number: "03",
      title: "Identity Received, Not Earned",
      verse: "Galatians 4:6-7",
      scripture: "And because you are sons, God has sent the Spirit of his Son into our hearts, crying, 'Abba! Father!' So you are no longer a slave, but a son, and if a son, then an heir through God.",
      text: "We believe our core identity as believers is an inheritance received from God, not an achievement constructed by human approval or merit. As adopted heirs, we operate from victory, not for victory.",
    },
    {
      number: "04",
      title: "Kingdom Purpose & Excellence",
      verse: "1 Peter 2:9",
      scripture: "But you are a chosen race, a royal priesthood, a holy nation, a people for his own possession, that you may proclaim the excellencies of him who called you out of darkness into his marvelous light.",
      text: "We believe our work, art, and garments should mirror the glory, order, and beauty of the Creator. We strive for excellence as an act of worship and stewardship in the marketplace.",
    },
  ];

  return (
    <div className="bg-ivory text-charcoal py-16 sm:py-24 space-y-20">
      {/* 1. HEADER */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <span className="text-gold text-xs uppercase tracking-luxurious font-semibold block">
          ✦ Biblical Convictions ✦
        </span>
        <h1 className="font-serif-luxury text-4xl sm:text-6xl font-bold text-charcoal leading-tight">
          Statement of Faith
        </h1>
        <p className="text-sm sm:text-base text-charcoal/80 font-light leading-relaxed max-w-2xl mx-auto">
          At ABBA Collective, our design philosophy is an extension of our faith. We are anchored in the timeless truths of Scripture and the transformative power of God’s grace.
        </p>
      </section>

      {/* 2. THE CONVICTIONS GRID */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {convictions.map((item) => (
          <div
            key={item.number}
            className="bg-ivory-light border border-charcoal/10 p-8 sm:p-12 rounded-sm space-y-6 hover:border-gold/50 transition-colors shadow-subtle"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-charcoal/10 pb-4">
              <div className="flex items-center space-x-4">
                <span className="font-serif-luxury text-3xl font-bold text-gold">
                  {item.number}
                </span>
                <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-charcoal">
                  {item.title}
                </h2>
              </div>
              <span className="text-xs uppercase tracking-widest text-forest font-semibold self-start sm:self-auto">
                {item.verse}
              </span>
            </div>

            {/* Scripture Quote Box */}
            <blockquote className="bg-charcoal text-ivory p-6 rounded-sm border-l-4 border-gold italic font-serif-luxury text-base sm:text-lg leading-relaxed font-light">
              "{item.scripture}"
            </blockquote>

            <p className="text-sm text-charcoal/80 font-light leading-relaxed">
              {item.text}
            </p>
          </div>
        ))}
      </section>

      {/* 3. SCRIPTURE SUMMARY BANNER */}
      <section className="bg-charcoal text-ivory py-16 border-y border-gold/20">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <span className="text-gold text-xs uppercase tracking-luxurious block font-semibold">
            ✦ Identity In Christ ✦
          </span>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold italic text-ivory">
            "He destined us for adoption to himself as sons through Jesus Christ, according to the purpose of his will, to the praise of his glorious grace."
          </h2>
          <cite className="text-xs uppercase tracking-widest text-gold not-italic block font-medium">
            — Ephesians 1:5-6
          </cite>
          <div className="pt-4 flex justify-center gap-4">
            <Button href="/about" variant="gold-outline" size="md">
              Our Story
            </Button>
            <Button href="/shop" variant="secondary" size="md">
              Explore Garments
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
