<script lang="ts">
  let {
    opacity = 0.2,
    strokeColor = 'var(--primary-foreground)'
  }: {
    opacity?: number;
    strokeColor?: string;
  } = $props();
</script>

<div class="absolute inset-0" style="opacity: {opacity}">
  <svg
    class="h-full w-full"
    fill="none"
    preserveAspectRatio="xMidYMid slice"
    viewBox="0 0 1200 800"
  >
    <g>
      <!-- Connecting lines -->
      <path
        d="M100 100L300 200L500 150L700 300L900 200L1100 350"
        stroke={strokeColor}
        stroke-width="1"
        opacity="0.6"
      />
      <path
        d="M200 400L400 300L600 450L800 350L1000 500"
        stroke={strokeColor}
        stroke-width="1"
        opacity="0.6"
      />
      <path
        d="M150 600L350 500L550 650L750 550L950 700"
        stroke={strokeColor}
        stroke-width="1"
        opacity="0.6"
      />
      <!-- Connection nodes -->
      <circle cx="100" cy="100" r="3" fill={strokeColor} opacity="0.8" />
      <circle cx="300" cy="200" r="3" fill={strokeColor} opacity="0.8" />
      <circle cx="500" cy="150" r="3" fill={strokeColor} opacity="0.8" />
      <circle cx="700" cy="300" r="3" fill={strokeColor} opacity="0.8" />
      <circle cx="900" cy="200" r="3" fill={strokeColor} opacity="0.8" />
      <circle cx="200" cy="400" r="3" fill={strokeColor} opacity="0.8" />
      <circle cx="400" cy="300" r="3" fill={strokeColor} opacity="0.8" />
      <circle cx="600" cy="450" r="3" fill={strokeColor} opacity="0.8" />
      <circle cx="800" cy="350" r="3" fill={strokeColor} opacity="0.8" />
    </g>
  </svg>
</div>
