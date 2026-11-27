import React from 'react';
// @ts-ignore -- CSS side-effect imports are handled by the framework bundler.
import './Sponsor.css';
// @ts-ignore -- gachapon styles live in their own file
import './gachapon.css';

type Tier = 'gold' | 'silver' | 'bronze';

interface SponsorItem {
    name: string;
    tier: Tier;
    url?: string;
}

// Placeholder names from the mockup — swap in the real 2027 sponsors.
const SPONSORS: SponsorItem[] = [
    { name: '??', tier: 'gold' },
    { name: '??', tier: 'silver' },
    { name: '??', tier: 'bronze' },
];


const GACHAPON_DIR = '/img/static/images/sponsors/2026-2027%20WEHack';


const MACHINES: Record<
    Tier,
    {
        src: string;
        aspect: string;
        plate: { left: number; top: number; width: number; height: number; color: string };
    }
> = {
    gold: {
        src: `${GACHAPON_DIR}/gold_gachapon.png`,
        aspect: '405 / 776',
        plate: { left: 13.1, top: 51.4, width: 63.4, height: 6.7, color: '#e6dfa9' },
    },
    silver: {
        src: `${GACHAPON_DIR}/silver_gachapon.png`,
        aspect: '410 / 776',
        plate: { left: 13.9, top: 50.4, width: 63.7, height: 7.1, color: '#e4dfab' },
    },
    bronze: {
        src: `${GACHAPON_DIR}/bronze_gachapon.png`,
        aspect: '417 / 776',
        plate: { left: 13.2, top: 49.5, width: 60.7, height: 7.1, color: '#e8b0d1' },
    },
};

// ---------------------------------------------------------------
// 3. ONE MACHINE
// ---------------------------------------------------------------
const Gachapon: React.FC<SponsorItem> = ({ name, tier, url }) => {
    const m = MACHINES[tier];

    // Font size in cqw (1cqw = 1% of the machine's width), shrunk for
    // long names so they fit the plate.
    const fontSize = Math.min(8.5, 75 / Math.max(name.length, 1));

    const content = (
        <>
            <img src={m.src} alt="" className="gachapon-img" draggable={false} />
            <span
                className="gachapon-plate"
                style={{
                    left: `${m.plate.left}%`,
                    top: `${m.plate.top}%`,
                    width: `${m.plate.width}%`,
                    height: `${m.plate.height}%`,
                    backgroundColor: m.plate.color,
                    fontSize: `${fontSize.toFixed(2)}cqw`,
                }}
            >
                {name}
            </span>
        </>
    );

    const className = `gachapon gachapon-${tier}`;
    const style = { aspectRatio: m.aspect };

    return url ? (
        <a href={url} target="_blank" rel="noopener noreferrer" className={className} style={style} aria-label={name}>
            {content}
        </a>
    ) : (
        <div className={className} style={style} role="img" aria-label={`${name} (${tier} sponsor)`}>
            {content}
        </div>
    );
};

// ---------------------------------------------------------------
// 4. ONE TIER — filters SPONSORS by tier, renders a machine for each
// ---------------------------------------------------------------
const TierGroup: React.FC<{ tier: Tier; label: string }> = ({ tier, label }) => {
    const items = SPONSORS.filter((s) => s.tier === tier);
    if (items.length === 0) return null;

    return (
        <div className="tier-group">
            <span className="tier-pill">{label}</span>
            <div className="tier-machines">
                {items.map((s) => (
                    <Gachapon key={s.name} {...s} />
                ))}
            </div>
        </div>
    );
};

// ---------------------------------------------------------------
// 5. "BECOME A SPONSOR" POLAROID — sits at the end of the tier row
// ---------------------------------------------------------------
const SponsorPolaroid: React.FC = () => (
    <div className="sponsor-polaroid">
        {/* White photo window with the coins — sits BEHIND the polaroid
            image so the frame's outline stays on top */}
        <div className="sponsor-polaroid-window" aria-hidden="true">
            <span className="polaroid-sparkle polaroid-sparkle-1">✦</span>
            <span className="polaroid-sparkle polaroid-sparkle-2">✦</span>
            <span className="polaroid-sparkle polaroid-sparkle-3">✦</span>
            <img src={`${GACHAPON_DIR}/Silver%20Coin.png`} alt="" className="polaroid-coin polaroid-coin-silver" draggable={false} />
            <img src={`${GACHAPON_DIR}/Bronze%20Coin.png`} alt="" className="polaroid-coin polaroid-coin-bronze" draggable={false} />
            <img src={`${GACHAPON_DIR}/Gold%20Coin.png`} alt="" className="polaroid-coin polaroid-coin-gold" draggable={false} />
        </div>

        <img
            src={`${GACHAPON_DIR}/Polaroid%202.png`}
            alt=""
            className="sponsor-polaroid-img"
            draggable={false}
        />

        {/* Green strip above the window — tag in the top right */}
        <div className="sponsor-polaroid-top">
            <span className="sponsor-polaroid-tag">AGES 18+</span>
        </div>

        {/* Green area under the window */}
        <div className="sponsor-polaroid-body">
            <p className="sponsor-polaroid-title">CAPSULE TOYS</p>
            <p className="sponsor-polaroid-text">
                Cool new sponsor-themed toys for just 75¢. Collect them all!
            </p>
            {/* Placeholder — no action yet */}
            <button type="button" className="sponsor-polaroid-btn">
                Become a sponsor →
            </button>
        </div>
    </div>
);

// ---------------------------------------------------------------
// 6. THE SECTION
// ---------------------------------------------------------------
const Sponsor: React.FC = () => {
    return (
        <div className='Sponsor-container w-full h-auto flex flex-col items-center p-6 py-20' id="Sponsor">
            {/* Contact Info */}
            <div className="sponsor-text-container flex flex-col gap-y-5 flex-wrap items-center justify-center mb-16">
                <p className='sponsor-heading text-[#e4dfaa] font-medium text-4xl md:text-5xl'>
                    2027 Sponsors Coming Soon
                </p>
                <p className='sponsor-subtitle text-[#e4dfaa] font-medium text-2xl md:text-xl text-center max-w-4xl'>
                    Interested in sponsoring WEHack 2027? Contact us at wehackutd@gmail.com!
                </p>
            </div>


            <div className="gachapon-grid">
                <div className="tier-row">
                    <TierGroup tier="gold" label="GOLD TIER" />
                    <TierGroup tier="silver" label="SILVER TIER" />
                    <TierGroup tier="bronze" label="BRONZE TIER" />
                    <SponsorPolaroid />
                </div>
            </div>

        </div>
    );
};

export default Sponsor;
