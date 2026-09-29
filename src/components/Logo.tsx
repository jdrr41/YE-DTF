import React, { useState } from 'react';
import logoImg from '../assets/images/yes_dtf_logo_1790450948235.jpg';

interface LogoProps {
  className?: string;
  size?: number;
  showSubtitle?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 56, showSubtitle = false }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {!imageError ? (
        <div
          style={{ width: size, height: size }}
          className="shrink-0 rounded-full overflow-hidden drop-shadow-md hover:scale-105 transition-transform duration-200 border-2 border-slate-900 bg-[#EE008B] flex items-center justify-center"
        >
          <img
            src={logoImg}
            alt="YES DTF"
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover rounded-full"
          />
        </div>
      ) : (
        <svg
          width={size}
          height={size}
          viewBox="0 0 400 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="shrink-0 drop-shadow-md hover:scale-105 transition-transform duration-200 rounded-full"
        >
          {/* Magenta / Hot Pink Circle Base */}
          <circle cx="200" cy="200" r="196" fill="#EE008B" stroke="#000000" strokeWidth="6" />

          {/* Green Extrusion for the dollar sign S */}
          <g transform="translate(18, 14)">
            <path
              d="M 252 74 
                 L 296 70 
                 L 292 108 
                 L 334 116 
                 L 310 186 
                 L 278 194 
                 L 326 230 
                 L 302 300 
                 L 256 304 
                 L 252 334 
                 L 222 336 
                 L 226 304 
                 L 202 302 
                 L 210 264 
                 L 262 260 
                 L 272 238 
                 L 230 204 
                 L 252 144 
                 L 224 140 
                 L 228 106 
                 L 254 104 
                 Z"
              fill="#00E840"
            />
          </g>

          {/* Black Thick Outlines behind YES */}
          <g stroke="#000000" strokeWidth="22" strokeLinejoin="round" strokeLinecap="round" fill="#000000">
            {/* Y */}
            <path
              d="M 52 134 
                 L 94 120 
                 L 120 174 
                 L 152 102 
                 L 196 96 
                 L 142 196 
                 L 154 256 
                 L 112 262 
                 L 102 206 
                 Z"
            />
            {/* E */}
            <path
              d="M 148 98 
                 L 216 90 
                 L 210 134 
                 L 174 138 
                 L 170 162 
                 L 204 160 
                 L 198 200 
                 L 164 202 
                 L 158 244 
                 L 224 238 
                 L 218 284 
                 L 126 290 
                 Z"
            />
            {/* S / $ */}
            <path
              d="M 252 74 
                 L 296 70 
                 L 292 108 
                 L 334 116 
                 L 310 186 
                 L 278 194 
                 L 326 230 
                 L 302 300 
                 L 256 304 
                 L 252 334 
                 L 222 336 
                 L 226 304 
                 L 202 302 
                 L 210 264 
                 L 262 260 
                 L 272 238 
                 L 230 204 
                 L 252 144 
                 L 224 140 
                 L 228 106 
                 L 254 104 
                 Z"
            />
          </g>

          {/* Yellow Front Letters */}
          <g fill="#FEE100">
            {/* Y */}
            <path
              d="M 56 136 
                 L 92 124 
                 L 120 174 
                 L 150 106 
                 L 190 100 
                 L 138 196 
                 L 150 252 
                 L 116 256 
                 L 106 204 
                 Z"
            />
            {/* E */}
            <path
              d="M 152 102 
                 L 212 94 
                 L 206 130 
                 L 174 134 
                 L 170 158 
                 L 200 156 
                 L 194 196 
                 L 164 198 
                 L 158 240 
                 L 220 234 
                 L 214 278 
                 L 132 284 
                 Z"
            />
            {/* S / $ */}
            <path
              d="M 254 78 
                 L 292 74 
                 L 288 112 
                 L 328 120 
                 L 306 182 
                 L 276 190 
                 L 322 226 
                 L 298 294 
                 L 256 298 
                 L 252 328 
                 L 226 330 
                 L 230 300 
                 L 208 298 
                 L 214 268 
                 L 260 264 
                 L 268 234 
                 L 226 200 
                 L 248 140 
                 L 224 136 
                 L 228 110 
                 L 254 108 
                 Z"
            />
          </g>

          {/* Internal graffiti cuts */}
          <g stroke="#000000" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <path d="M 120 174 L 140 202" />
            <path d="M 172 138 L 194 136" />
            <path d="M 166 202 L 188 200" />
            <path d="M 244 140 L 268 180" />
            <path d="M 270 234 L 244 260" />
            <line x1="256" y1="78" x2="256" y2="110" />
            <line x1="240" y1="298" x2="240" y2="328" />
          </g>

          {/* DTF Bottom Bubble Lettering in solid black */}
          {/* D */}
          <path
            d="M 124 286 
               C 124 278, 142 274, 160 274 
               C 178 274, 192 284, 192 304 
               C 192 324, 176 338, 154 338 
               C 136 338, 124 334, 124 326 
               Z 
               M 148 292 
               L 148 320 
               C 156 320, 166 316, 166 306 
               C 166 296, 156 292, 148 292 
               Z"
            fill="#000000"
          />

          {/* T */}
          <path
            d="M 194 284 
               L 242 284 
               C 246 284, 248 290, 246 294 
               C 244 298, 238 298, 230 298 
               L 230 330 
               C 230 336, 222 340, 214 340 
               C 206 340, 204 336, 204 330 
               L 204 298 
               C 198 298, 192 296, 192 292 
               C 192 288, 194 284, 194 284 
               Z"
            fill="#000000"
          />

          {/* F */}
          <path
            d="M 248 280 
               L 294 280 
               C 298 280, 302 284, 302 288 
               C 302 292, 298 296, 274 296 
               L 274 304 
               L 290 304 
               C 294 304, 296 308, 296 312 
               C 296 316, 292 318, 274 318 
               L 274 334 
               C 274 340, 266 342, 258 342 
               C 250 342, 248 338, 248 332 
               Z"
            fill="#000000"
          />
        </svg>
      )}

      {showSubtitle && (
        <div className="flex flex-col">
          <span className="font-extrabold text-xl tracking-tight text-slate-900 leading-none">
            YES <span className="text-[#EE008B]">DTF</span>
          </span>
          <span className="text-xs font-semibold text-slate-500 tracking-wide uppercase mt-1">
            Calculadora Textil & UV
          </span>
        </div>
      )}
    </div>
  );
};
