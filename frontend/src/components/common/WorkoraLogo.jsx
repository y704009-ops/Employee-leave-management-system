import React from 'react';

/**
 * WorkoraLogo Component
 *
 * Vector SVG recreation of the official WORKORA logo mark:
 * - Three connected workforce figures (left: blue, center: cyan, right: purple)
 * - Flowing rounded geometric 'W' ribbon with 3D layer depth
 * - Fully scalable vector graphics that remain crisp at any resolution (16px to 512px)
 * - Accessible and self-contained with gradient definitions
 */
const WorkoraLogo = ({
  size = 36,
  className = '',
  idPrefix = 'workora',
  'aria-label': ariaLabel,
  ...props
}) => {
  // Original aspect ratio 120 : 96 (1.25 : 1)
  const width = Math.round(size * 1.25);
  const height = size;

  const ribbonGradId = `${idPrefix}-ribbon-grad`;
  const centerArchId = `${idPrefix}-center-arch`;
  const blueHeadId = `${idPrefix}-head-blue`;
  const cyanHeadId = `${idPrefix}-head-cyan`;
  const purpleHeadId = `${idPrefix}-head-purple`;
  const shadowId = `${idPrefix}-3d-shadow`;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 120 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden={ariaLabel ? undefined : true}
      aria-label={ariaLabel}
      role={ariaLabel ? 'img' : undefined}
      {...props}
    >
      <defs>
        {/* Continuous Flowing Base Ribbon Gradient: Blue -> Cyan -> Purple */}
        <linearGradient id={ribbonGradId} x1="18" y1="50" x2="102" y2="50" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="22%" stopColor="#0284c7" />
          <stop offset="48%" stopColor="#06b6d4" />
          <stop offset="78%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#c084fc" />
        </linearGradient>

        {/* Center Arch 3D Overlap Gradient */}
        <linearGradient id={centerArchId} x1="38" y1="76" x2="68" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0284c7" />
          <stop offset="45%" stopColor="#06b6d4" />
          <stop offset="75%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#38bdf8" />
        </linearGradient>

        {/* 3 Spherical Head Radial Gradients */}
        <radialGradient id={blueHeadId} cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#93c5fd" />
          <stop offset="40%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </radialGradient>
        <radialGradient id={cyanHeadId} cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#a5f3fc" />
          <stop offset="40%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#0891b2" />
        </radialGradient>
        <radialGradient id={purpleHeadId} cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#f3e8ff" />
          <stop offset="40%" stopColor="#c084fc" />
          <stop offset="100%" stopColor="#7c3aed" />
        </radialGradient>

        {/* Soft Drop Shadow for Overlapping Center Ribbon Depth */}
        <filter id={shadowId} x="-20%" y="-20%" width="150%" height="150%">
          <feDropShadow dx="-1" dy="2" stdDeviation="2.5" floodColor="#020617" floodOpacity="0.75" />
        </filter>
      </defs>

      {/* 3 Spherical Heads (Workforce Team Members) */}
      <circle cx="23" cy="15" r="9" fill={`url(#${blueHeadId})`} />
      <circle cx="60" cy="15" r="9" fill={`url(#${cyanHeadId})`} />
      <circle cx="97" cy="15" r="9" fill={`url(#${purpleHeadId})`} />

      {/* Base Continuous Geometric W Ribbon */}
      <path
        d="M 23 34 C 23 56, 32 78, 43 78 C 53 78, 55 48, 60 34 C 65 48, 67 78, 77 78 C 88 78, 97 56, 97 34"
        stroke={`url(#${ribbonGradId})`}
        strokeWidth="14.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Dimensional Overlapping Center Peak */}
      <path
        d="M 40 76 C 49 62, 54 34, 60 34 C 66 34, 71 62, 79 74"
        stroke={`url(#${centerArchId})`}
        strokeWidth="14.5"
        strokeLinecap="round"
        filter={`url(#${shadowId})`}
      />
    </svg>
  );
};

export default WorkoraLogo;
