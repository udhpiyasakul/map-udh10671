import React from 'react';

interface UdhLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

/**
 * Official Udon Thani Hospital (UDH) Emblem
 * Vectorized from the official hospital brand identity:
 * - Rounded Medical Cross with pink border and soft pink fill
 * - Lotus petals and shield motif (Nong Prajak Lotus)
 * - Distinctive bold crimson "UDH" central lettering
 */
export const UdhLogo: React.FC<UdhLogoProps> = ({
  className = 'w-9 h-9',
  size = 36,
  showText = false,
}) => {
  return (
    <div className={`inline-flex items-center gap-2 select-none ${className}`}>
      <svg
        viewBox="0 0 200 200"
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        {/* Soft background glow */}
        <defs>
          <filter id="udh-glow" x="-10%" y="-10%" width="120%" height="120%" filterUnits="userSpaceOnUse">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#e91e63" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* Outer Rounded Medical Cross Path */}
        {/* Dimensions: 200x200 canvas, Cross arms: width 70, height 70, total span 170 */}
        <path
          d="
            M 68 18
            C 68 10, 74 10, 84 10
            L 116 10
            C 126 10, 132 10, 132 18
            L 132 60
            C 132 68, 132 68, 140 68
            L 182 68
            C 190 68, 190 74, 190 84
            L 190 116
            C 190 126, 190 132, 182 132
            L 140 132
            C 132 132, 132 132, 132 140
            L 132 182
            C 132 190, 126 190, 116 190
            L 84 190
            C 74 190, 68 190, 68 182
            L 68 140
            C 68 132, 68 132, 60 132
            L 18 132
            C 10 132, 10 126, 10 116
            L 10 84
            C 10 74, 10 68, 18 68
            L 60 68
            C 68 68, 68 68, 68 60
            Z
          "
          fill="#FCE4EC"
          stroke="#E91E63"
          strokeWidth="7"
          strokeLinejoin="round"
          strokeLinecap="round"
          filter="url(#udh-glow)"
        />

        {/* Top Arm Lotus Petals & Red Inset */}
        <g id="top-lotus">
          {/* Magenta background petals */}
          <path
            d="M 80 26 C 80 44, 94 62, 100 64 C 106 62, 120 44, 120 26 C 112 28, 104 28, 100 28 C 96 28, 88 28, 80 26 Z"
            fill="#D81B60"
          />
          {/* Inner crimson bud / shield */}
          <path
            d="M 86 26 C 88 40, 96 52, 100 56 C 104 52, 112 40, 114 26 C 108 27, 92 27, 86 26 Z"
            fill="#B71C1C"
          />
        </g>

        {/* Bottom Arm Lotus Petals & Red Inset */}
        <g id="bottom-lotus">
          {/* Magenta background petals */}
          <path
            d="M 80 174 C 80 156, 94 138, 100 136 C 106 138, 120 156, 120 174 C 112 172, 104 172, 100 172 C 96 172, 88 172, 80 174 Z"
            fill="#D81B60"
          />
          {/* Inner crimson bud / shield */}
          <path
            d="M 86 174 C 88 160, 96 148, 100 144 C 104 148, 112 160, 114 174 C 108 173, 92 173, 86 174 Z"
            fill="#B71C1C"
          />
        </g>

        {/* Stylized Crimson Central "UDH" Monogram */}
        <g id="udh-letters" fill="#B71C1C">
          {/* Letter 'U' */}
          <path
            d="
              M 36 78
              L 52 78
              L 52 108
              C 52 114, 56 117, 63 117
              C 70 117, 74 114, 74 108
              L 74 78
              L 90 78
              L 90 108
              C 90 123, 79 127, 63 127
              C 47 127, 36 123, 36 108
              Z
            "
          />

          {/* Letter 'D' */}
          <path
            d="
              M 82 78
              L 110 78
              C 126 78, 134 85, 134 102
              C 134 119, 126 127, 110 127
              L 82 127
              Z
              M 98 90
              L 98 115
              L 109 115
              C 116 115, 119 111, 119 102
              C 119 93, 116 90, 109 90
              Z
            "
            fillRule="evenodd"
          />

          {/* Letter 'H' */}
          <path
            d="
              M 126 78
              L 142 78
              L 142 96
              L 164 96
              L 164 78
              L 180 78
              L 180 127
              L 164 127
              L 164 108
              L 142 108
              L 142 127
              L 126 127
              Z
            "
          />
        </g>
      </svg>

      {showText && (
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-bold text-pink-600 tracking-tight">
            โรงพยาบาลอุดรธานี
          </span>
          <span className="text-[10px] font-semibold text-pink-500 tracking-normal">
            Udon Thani Hospital
          </span>
        </div>
      )}
    </div>
  );
};
