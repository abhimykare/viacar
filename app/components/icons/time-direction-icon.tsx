import type { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
  time: string;
}

function TimeDirectionIcon({ time, ...props }: Props) {
  return (
    <svg
      {...props}
      width="48"
      height="114"
      viewBox="0 0 48 114"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line
        x1="24.5"
        y1="15.5"
        x2="24.5"
        y2="56.5"
        stroke="#B1FFDA"
        strokeLinecap="round"
        strokeDasharray="3.52 3.52"
      />
      <line
        x1="24.5"
        y1="60.5"
        x2="24.5"
        y2="90.5"
        stroke="#B1FFDA"
        strokeLinecap="round"
        strokeDasharray="3.52 3.52"
      />
      <path
        d="M35.1318 95.8184C33.7439 89.7376 28.417 87 23.7377 87C23.7377 87 23.7377 87 23.7245 87C19.0585 87 13.7183 89.7245 12.3304 95.8052C10.7839 102.597 14.9608 108.348 18.7413 111.968C20.1424 113.31 21.9401 113.982 23.7377 113.982C25.5354 113.982 27.3331 113.31 28.721 111.968C32.5014 108.348 36.6784 102.61 35.1318 95.8184ZM23.7377 102.412C21.4378 102.412 19.574 100.557 19.574 98.2665C19.574 95.9763 21.4378 94.1205 23.7377 94.1205C26.0377 94.1205 27.9015 95.9763 27.9015 98.2665C27.9015 100.557 26.0377 102.412 23.7377 102.412Z"
        fill="#C02120"
      />
      <circle
        cx="23.9042"
        cy="12.9042"
        r="11.1446"
        fill="white"
        stroke="#00665A"
        strokeWidth="3.51934"
      />
      <rect
        x="0.276268"
        y="49.2763"
        width="47.4475"
        height="14.4475"
        rx="7.22373"
        fill="white"
        stroke="#B1FFDA"
        strokeWidth="0.552536"
      />
      <text
        className="text-[10px] text-[#424242] font-medium font-sans"
        x="24"
        y="60"
        textAnchor="middle"
        fill="#424242"
      >
        {time}
      </text>
    </svg>
  );
}

export default TimeDirectionIcon;
