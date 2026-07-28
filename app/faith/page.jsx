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
      title: "The Triune God",
      verse: "Romans 11:36",
      text: "We believe in one Triune God: God the Father, God the Son, and God the Holy Spirit. God is the Creator, Sustainer, and rightful Lord over all creation. He is holy, sovereign, righteous, loving, and worthy of all worship and glory. Everything exists from Him, through Him, and for Him.",
    },
    {
      number: "02",
      title: "Scripture",
      verse: "2 Timothy 3:16–17",
      text: "We believe the Holy Scriptures of the Old and New Testaments are the inspired, authoritative, and sufficient Word of God. Scripture reveals God's character, His redemptive plan, and His will for humanity. Therefore, our beliefs, values, and expressions seek to be shaped by the truth of God's Word.",
    },
    {
      number: "03",
      title: "Creation and Humanity",
      verse: "Genesis 1:27 • Romans 3:23",
      text: "We believe God created all things by His power and wisdom. Human beings were created in the image of God, possessing dignity, value, and purpose because they were made by Him and for Him. However, humanity's rebellion against God through sin has separated us from Him and corrupted every aspect of human life.",
    },
    {
      number: "04",
      title: "Jesus Christ",
      verse: "John 14:6 • Acts 4:12",
      text: "We believe Jesus Christ is the eternal Son of God, fully God and fully man. He lived a perfect life, died on the cross as the sufficient sacrifice for sin, rose bodily from the dead, and reigns as Lord. Through Christ alone, sinners can be reconciled to God and receive eternal life.",
    },
    {
      number: "05",
      title: "Salvation by Grace",
      verse: "Ephesians 2:8–10",
      text: "We believe salvation is a gift of God's grace alone, received through faith alone in Jesus Christ alone. We cannot earn God's acceptance through our works, achievements, morality, or religious efforts. Our salvation rests entirely upon the finished work of Christ. Good works are not the foundation of salvation, but the fruit of a life transformed by God's grace.",
    },
    {
      number: "06",
      title: "Adoption and Identity",
      verse: "Galatians 4:4–7",
      text: "We believe that those who belong to Christ are adopted into God's family. Our deepest identity is not found in success, possessions, status, or human approval, but in being children of God through Jesus Christ. The name ABBA Collective reflects this truth: Our identity is received before it is expressed.",
    },
    {
      number: "07",
      title: "The Holy Spirit and Transformation",
      verse: "Romans 8:29",
      text: "We believe the Holy Spirit applies the work of Christ to believers, giving new life, producing spiritual growth, and conforming God's people to the image of Christ. The Christian life is a continual journey of grace, dependence, and transformation.",
    },
    {
      number: "08",
      title: "The Church and Community",
      verse: "Matthew 28:19–20",
      text: "We believe God calls His people into a community of faith centered on Christ. The church exists to worship God, proclaim the gospel, make disciples, serve others, and display God's kingdom in the world. As a brand, ABBA Collective seeks to reflect these values through meaningful relationships, ethical practices, and service.",
    },
    {
      number: "09",
      title: "Work, Creativity, and Excellence",
      verse: "Colossians 3:23",
      text: "We believe work and creativity are gifts from God. Since God Himself is the Creator, human creativity reflects His image and is a way of serving others. Therefore, we pursue excellence, integrity, and beauty in our craftsmanship as an act of worship.",
    },
    {
      number: "10",
      title: "The Glory of God",
      verse: "1 Corinthians 10:31",
      text: "We believe the ultimate purpose of all things is the glory of God. Our designs, decisions, relationships, and businesses exist to honor Him. We desire that everything ABBA Collective creates would point beyond ourselves to the greatness, goodness, and grace of God.",
    },
  ];

  return (
    <div className="bg-ivory text-charcoal py-16 sm:py-24 space-y-20">
      {/* 1. HEADER */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <span className="text-gold text-xs uppercase tracking-luxurious font-semibold block">
          ✦ Our Foundation ✦
        </span>
        <h1 className="font-serif-luxury text-4xl sm:text-6xl font-bold text-charcoal leading-tight">
          Statement of Faith
        </h1>
        <p className="text-sm sm:text-base text-charcoal/80 font-light leading-relaxed max-w-3xl mx-auto">
          ABBA Collective is built upon the truth of the gospel of Jesus Christ. We believe that all creation exists for the glory of God, and that our work, creativity, and businesses are opportunities to worship Him and faithfully steward what He has entrusted to us.
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

            {item.scripture && (
              <blockquote className="bg-charcoal text-ivory p-6 rounded-sm border-l-4 border-gold italic font-serif-luxury text-base sm:text-lg leading-relaxed font-light">
                "{item.scripture}"
              </blockquote>
            )}

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
            "You have received the Spirit of adoption as sons, by whom we cry, 'Abba! Father!'"
          </h2>
          <cite className="text-xs uppercase tracking-widest text-gold not-italic block font-medium">
            — Romans 8:15
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
