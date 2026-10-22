/** Decorative line work, confined to the edge of its section. */
export function Botanical({ className }: { className: string }) {
  return <svg className={className} viewBox="0 0 240 520" fill="none" aria-hidden="true" focusable="false">
    <g stroke="currentColor" strokeWidth=".8" strokeLinecap="round">
      <path d="M225 515C185 433 205 371 153 293S115 132 41 6M169 321C121 304 76 266 27 209M137 259C178 216 195 173 201 111M103 167C65 151 36 130 9 99M194 427C151 403 118 375 91 339" />
      <path d="M77 146C45 148 32 128 33 119C54 118 68 128 77 146ZM160 226C161 197 178 183 187 184C190 204 176 218 160 226ZM73 257C48 261 31 244 29 232C49 230 66 240 73 257ZM173 411C145 417 124 397 123 385C144 382 164 395 173 411ZM74 69C75 44 62 29 54 28C49 46 60 62 74 69Z" />
    </g>
  </svg>;
}
