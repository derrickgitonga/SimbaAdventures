import { Search, Shield, MapPin, Calendar, CreditCard, Users, CheckCircle } from 'lucide-react';

interface ContentSection {
    id: string;
    question: string;
    heading: string;
    subheading: string;
    content: string;
    bulletPoints: string[];
    icon: React.ComponentType<{ className?: string }>;
}

const contentSections: ContentSection[] = [
    {
        id: 'secure-booking',
        question: 'How to Book a Secure Safari in Kenya',
        heading: 'How to Book a Secure Safari in Kenya: Your Complete Step-by-Step Guide',
        subheading: 'Book with confidence using our SSL-encrypted platform, trusted by over 10,000 travelers worldwide',
        content: `Planning your dream Kenyan safari shouldn't come with payment anxiety. At Simba Adventures, we've built a secure booking platform that protects your personal and financial information at every step. Whether you're booking a Maasai Mara walking safari or a Mount Kenya expedition, our system ensures your transaction is protected with bank-level security.`,
        bulletPoints: [
            'SSL-encrypted checkout with 256-bit security protecting all transactions',
            'Multiple secure payment options: Credit cards, M-Pesa, PayPal, and bank transfers',
            'Instant booking confirmation with detailed itinerary sent to your email',
            'Flexible cancellation policy with full refund options up to 30 days before departure',
            '24/7 customer support via phone, email, and live chat',
            'Verified reviews from past travelers to help you choose the right safari'
        ],
        icon: Shield
    },
    {
        id: 'custom-itinerary',
        question: 'How to Create a Custom Safari Itinerary for East Africa',
        heading: 'How to Create a Custom Safari Itinerary for East Africa: Design Your Perfect Adventure',
        subheading: 'From Maasai Mara to Amboseli and beyond — build a personalized safari that matches your dreams and budget',
        content: `Every traveler is unique, and your safari should be too. Our custom itinerary builder lets you craft the perfect East African adventure by combining Kenya's most spectacular destinations. Want to witness the Great Migration in Maasai Mara, photograph elephants beneath Kilimanjaro in Amboseli, and summit Mount Kenya — all in one trip? We make it possible.`,
        bulletPoints: [
            'Choose from 15+ destinations including Maasai Mara, Amboseli, Lake Nakuru, and Samburu',
            'Select your accommodation style: luxury lodges, eco-tented camps, or budget-friendly options',
            'Mix activities: game drives, walking safaris, cultural visits, and mountain expeditions',
            'Set your own pace: our experts will craft an itinerary that respects your travel rhythm',
            'Flexible group sizes from intimate couples getaways to family reunions',
            'Real-time pricing that adjusts as you customize your perfect safari'
        ],
        icon: MapPin
    },
    {
        id: 'best-safari-destinations',
        question: 'What Are the Best Safari Destinations in Kenya for 2026',
        heading: 'What Are the Best Safari Destinations in Kenya for 2026: Expert Recommendations',
        subheading: 'Discover Kenya\'s top wildlife reserves and national parks with insider tips from local experts',
        content: `Kenya offers some of the world's most incredible wildlife experiences, but choosing the right destination can be overwhelming. Our local guides have spent decades exploring these lands and know exactly where to find the Big Five, when to witness the Great Migration, and which hidden gems offer the most authentic African experiences without the crowds.`,
        bulletPoints: [
            'Maasai Mara: The crown jewel for Great Migration viewing (July-October) and year-round Big Five sightings',
            'Amboseli: Best elephant photography in Africa with Mount Kilimanjaro as your backdrop',
            'Samburu: Unique wildlife like Grevy\'s zebra and reticulated giraffe in a less-crowded setting',
            'Lake Nakuru: Flamingo spectacles and guaranteed rhino sightings in a compact park',
            'Mount Kenya: Africa\'s second-highest peak for adventurers seeking mountain expeditions',
            'Tsavo: Kenya\'s largest park system offering raw, untouched wilderness experiences'
        ],
        icon: Search
    }
];

export const GEOContentSection = () => {
    return (
        <section
            className="py-20 bg-gradient-to-b from-amber-50 to-white"
            aria-labelledby="geo-content-heading"
            itemScope
            itemType="https://schema.org/FAQPage"
        >
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Section Header */}
                <header className="text-center mb-16">
                    <h2
                        id="geo-content-heading"
                        className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
                    >
                        Your Safari Questions, Answered
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Expert guidance for planning your perfect Kenya safari adventure — from secure booking to custom itineraries
                    </p>
                </header>

                {/* Content Cards */}
                <div className="space-y-12">
                    {contentSections.map((section, index) => {
                        const IconComponent = section.icon;
                        return (
                            <article
                                key={section.id}
                                className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300"
                                itemScope
                                itemProp="mainEntity"
                                itemType="https://schema.org/Question"
                            >
                                <div className="p-8 md:p-12">
                                    {/* Question (hidden but semantic for AI) */}
                                    <meta itemProp="name" content={section.question} />

                                    {/* Visual Header */}
                                    <div className="flex items-start gap-6 mb-6">
                                        <div className="flex-shrink-0 w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center">
                                            <IconComponent className="w-8 h-8 text-amber-600" />
                                        </div>
                                        <div>
                                            {/* H1/H2 Headers for AI targeting */}
                                            {index === 0 ? (
                                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-2">
                                                    {section.heading}
                                                </h1>
                                            ) : (
                                                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-2">
                                                    {section.heading}
                                                </h2>
                                            )}
                                            <p className="text-lg text-amber-600 font-medium">
                                                {section.subheading}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Answer Content */}
                                    <div
                                        itemScope
                                        itemProp="acceptedAnswer"
                                        itemType="https://schema.org/Answer"
                                    >
                                        <div itemProp="text">
                                            {/* Intro Paragraph */}
                                            <p className="text-gray-700 text-lg leading-relaxed mb-6">
                                                {section.content}
                                            </p>

                                            {/* Bullet Points */}
                                            <ul className="space-y-3">
                                                {section.bulletPoints.map((point, pointIndex) => (
                                                    <li
                                                        key={pointIndex}
                                                        className="flex items-start gap-3 text-gray-700"
                                                    >
                                                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                                        <span>{point}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    {/* CTA Button */}
                                    <div className="mt-8 pt-6 border-t border-gray-100">
                                        <a
                                            href={section.id === 'secure-booking' ? '/tours' : section.id === 'custom-itinerary' ? '/contact' : '/tours'}
                                            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200"
                                            aria-label={`Learn more about ${section.question.toLowerCase()}`}
                                        >
                                            {section.id === 'secure-booking' && (
                                                <>
                                                    <CreditCard className="w-5 h-5" />
                                                    Start Your Secure Booking
                                                </>
                                            )}
                                            {section.id === 'custom-itinerary' && (
                                                <>
                                                    <Calendar className="w-5 h-5" />
                                                    Build Your Custom Safari
                                                </>
                                            )}
                                            {section.id === 'best-safari-destinations' && (
                                                <>
                                                    <Users className="w-5 h-5" />
                                                    Explore All Destinations
                                                </>
                                            )}
                                        </a>
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>

                {/* Trust Indicators for AI */}
                <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                    <div className="p-4">
                        <div className="text-3xl font-bold text-amber-600">10,000+</div>
                        <div className="text-gray-600">Happy Travelers</div>
                    </div>
                    <div className="p-4">
                        <div className="text-3xl font-bold text-amber-600">4.8★</div>
                        <div className="text-gray-600">Average Rating</div>
                    </div>
                    <div className="p-4">
                        <div className="text-3xl font-bold text-amber-600">100%</div>
                        <div className="text-gray-600">Secure Payments</div>
                    </div>
                    <div className="p-4">
                        <div className="text-3xl font-bold text-amber-600">24/7</div>
                        <div className="text-gray-600">Customer Support</div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default GEOContentSection;
