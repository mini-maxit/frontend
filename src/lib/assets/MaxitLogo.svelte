<script lang="ts">
  import { localizeHref } from '$lib/paraglide/runtime';
  import { AppRoutes } from '$lib/routes';

  let { width = 24, height = 24, primaryColor = false, clickable = true } = $props();

  const strokeColor = primaryColor ? 'var(--primary)' : 'var(--primary-foreground)';
  const fillColor = primaryColor ? 'var(--primary)' : 'var(--primary-foreground)';
  const homeUrl = localizeHref(AppRoutes.Home);
</script>

{#snippet logoContent()}
  <svg {width} {height} viewBox="0 0 102 102" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M13.0843 67.0682L13.5848 66.6333"
      stroke={strokeColor}
      stroke-width="0.102"
      stroke-miterlimit="10"
    />
    <path
      d="M13.9737 66.2955L50.175 34.84"
      stroke={strokeColor}
      stroke-width="0.102"
      stroke-miterlimit="10"
      stroke-dasharray="1.34 0.52"
    />
    <path
      d="M50.3694 34.6711L50.8699 34.2363"
      stroke={strokeColor}
      stroke-width="0.102"
      stroke-miterlimit="10"
    />
    <path
      d="M50.9694 92.1116C28.4151 92.1116 10.1311 73.8277 10.1311 51.2733C10.1311 28.7188 28.415 10.4349 50.9694 10.4349C73.5239 10.4349 91.8078 28.7188 91.8078 51.2733C91.8078 73.8277 73.5239 92.1116 50.9694 92.1116Z"
      stroke={strokeColor}
      stroke-width="1.122"
      stroke-miterlimit="10"
    />
    <path
      d="M39.2599 28.2459L91.4971 48.3474"
      stroke={strokeColor}
      stroke-width="0.51"
      stroke-miterlimit="10"
    />
    <path
      d="M16.5762 47.2258V57.4578H13.6193V45.9047H37.6711V57.4578H34.7134V47.2258H27.1237V57.5172L24.1668 57.4578V47.2258H16.5763H16.5762Z"
      fill={fillColor}
    />
    <path
      d="M41.0372 57.4578V52.6476H51.2299V50.2421H41.2347V49.0992H53.832V57.4578H41.0372ZM51.2299 53.7906H43.6394V56.3141H51.2299V53.7906Z"
      fill={fillColor}
    />
    <path
      d="M67.1285 57.4578V53.85H59.6568V57.4578H56.9952V53.7714L58.513 53.2785L56.9952 52.7856V49.0992H59.6568V52.7062H67.1285V49.0992H69.7901V52.7856L68.2724 53.2785L69.7901 53.7714V57.4578H67.1285Z"
      fill={fillColor}
    />
    <path d="M73.1512 49.0995V57.4574H75.7533V49.0995H73.1512Z" fill={fillColor} />
    <path
      d="M79.9555 57.4578V50.2421H78.3591V49.0992H79.9555V45.9047H82.5576V49.0992H88.965V50.2421H82.5576V56.3141H88.965V57.4578H79.9555Z"
      fill={fillColor}
    />
    <path
      d="M52.2888 35.4104C53.3068 35.4104 54.132 34.5852 54.132 33.5672C54.132 32.5492 53.3068 31.7239 52.2888 31.7239C51.2708 31.7239 50.4455 32.5492 50.4455 33.5672C50.4455 34.5852 51.2708 35.4104 52.2888 35.4104Z"
      fill={fillColor}
    />
    <path
      d="M52.7131 32.8539L61.9291 23.4075"
      stroke={strokeColor}
      stroke-width="0.408"
      stroke-miterlimit="10"
    />
    <path
      d="M62.0655 24.2927C62.6381 24.2927 63.1023 23.8285 63.1023 23.2559C63.1023 22.6833 62.6381 22.2191 62.0655 22.2191C61.4928 22.2191 61.0286 22.6833 61.0286 23.2559C61.0286 23.8285 61.4928 24.2927 62.0655 24.2927Z"
      fill={fillColor}
    />
    <path
      d="M16.413 39.2372C17.1765 39.2372 17.7955 38.6182 17.7955 37.8548C17.7955 37.0913 17.1765 36.4724 16.413 36.4724C15.6496 36.4724 15.0306 37.0913 15.0306 37.8548C15.0306 38.6182 15.6496 39.2372 16.413 39.2372Z"
      stroke={strokeColor}
      stroke-width="0.306"
      stroke-miterlimit="10"
    />
    <path
      d="M17.084 36.4539L25.7563 22.7163"
      stroke={strokeColor}
      stroke-width="0.306"
      stroke-miterlimit="10"
    />
    <path
      d="M39.3463 27.4107L62.0655 23.2559L70.1911 15.4876"
      stroke={strokeColor}
      stroke-width="0.306"
      stroke-miterlimit="10"
    />
    <path
      d="M15.5036 38.7291L10.8956 43.913"
      stroke={strokeColor}
      stroke-width="0.306"
      stroke-miterlimit="10"
    />
    <path
      d="M52.4215 66.8955C53.5031 66.8955 54.3799 66.0187 54.3799 64.9371C54.3799 63.8555 53.5031 62.9787 52.4215 62.9787C51.3399 62.9787 50.4631 63.8555 50.4631 64.9371C50.4631 66.0187 51.3399 66.8955 52.4215 66.8955Z"
      fill={fillColor}
    />
    <path
      d="M52.7131 64.8795L80.2998 80.0282"
      stroke={strokeColor}
      stroke-width="0.51"
      stroke-miterlimit="10"
    />
    <path
      d="M60.3703 78.748C61.1266 78.748 61.7397 78.1349 61.7397 77.3786C61.7397 76.6223 61.1266 76.0093 60.3703 76.0093C59.614 76.0093 59.001 76.6223 59.001 77.3786C59.001 78.1349 59.614 78.748 60.3703 78.748Z"
      stroke={strokeColor}
      stroke-width="0.306"
      stroke-miterlimit="10"
    />
    <path
      d="M53.2567 65.945L59.5639 76.1114"
      stroke={strokeColor}
      stroke-width="0.306"
      stroke-miterlimit="10"
    />
    <path
      d="M59.0743 78.041L36.4087 89.3593"
      stroke={strokeColor}
      stroke-width="0.306"
      stroke-miterlimit="10"
    />
    <path
      d="M61.6951 76.8602L90.8982 60.6746"
      stroke={strokeColor}
      stroke-width="0.306"
      stroke-miterlimit="10"
    />
    <path
      d="M52.4215 62.9787L52.4188 62.3157"
      stroke={strokeColor}
      stroke-width="0.102"
      stroke-miterlimit="10"
    />
    <path
      d="M52.4167 61.7923L52.3101 35.6793"
      stroke={strokeColor}
      stroke-width="0.102"
      stroke-miterlimit="10"
      stroke-dasharray="1.36 0.52"
    />
    <path
      d="M52.309 35.4177L52.3063 34.7547"
      stroke={strokeColor}
      stroke-width="0.102"
      stroke-miterlimit="10"
    />
    <path
      d="M51.4135 66.1754L36.7831 89.2154L35.0686 73.4092"
      stroke={strokeColor}
      stroke-width="0.306"
      stroke-miterlimit="10"
    />
    <path
      d="M35.0686 73.4091C35.8003 73.4091 36.3934 72.816 36.3934 72.0843C36.3934 71.3527 35.8003 70.7595 35.0686 70.7595C34.337 70.7595 33.7438 71.3527 33.7438 72.0843C33.7438 72.816 34.337 73.4091 35.0686 73.4091Z"
      fill={fillColor}
    />
    <path
      d="M38.3671 26.5755L40.0087 11.8011"
      stroke={strokeColor}
      stroke-width="0.306"
      stroke-miterlimit="10"
    />
    <path
      d="M38.2348 28.8692C38.871 28.8692 39.3868 28.3534 39.3868 27.7172C39.3868 27.0809 38.871 26.5652 38.2348 26.5652C37.5986 26.5652 37.0828 27.0809 37.0828 27.7172C37.0828 28.3534 37.5986 28.8692 38.2348 28.8692Z"
      stroke={strokeColor}
      stroke-width="0.306"
      stroke-miterlimit="10"
    />
    <path
      d="M37.1 27.1803L22.9016 21.6795"
      stroke={strokeColor}
      stroke-width="0.51"
      stroke-miterlimit="10"
    />
    <path
      d="M53.7751 33.3147L74.2807 30.7803"
      stroke={strokeColor}
      stroke-width="0.306"
      stroke-miterlimit="10"
    />
    <path
      d="M75.9011 32.0165C76.8236 32.0165 77.5714 31.2686 77.5714 30.3461C77.5714 29.4236 76.8236 28.6758 75.9011 28.6758C74.9786 28.6758 74.2307 29.4236 74.2307 30.3461C74.2307 31.2686 74.9786 32.0165 75.9011 32.0165Z"
      stroke={strokeColor}
      stroke-width="0.306"
      stroke-miterlimit="10"
    />
    <path
      d="M74.7414 29.0667L62.0655 23.2559"
      stroke={strokeColor}
      stroke-width="0.306"
      stroke-miterlimit="10"
    />
    <path
      d="M77.5715 30.3461L86.0022 31.0971"
      stroke={strokeColor}
      stroke-width="0.306"
      stroke-miterlimit="10"
    />
    <path
      d="M75.4903 31.9611L74.359 41.4518V45.813"
      stroke={strokeColor}
      stroke-width="0.51"
      stroke-miterlimit="10"
    />
    <path
      d="M17.7865 37.6279C17.9889 37.6031 18.1914 37.5782 18.3939 37.5535"
      stroke={strokeColor}
      stroke-width="0.204"
      stroke-miterlimit="10"
    />
    <path
      d="M18.9105 37.4901C29.3639 36.2083 39.8174 34.9263 50.271 33.6445"
      stroke={strokeColor}
      stroke-width="0.204"
      stroke-miterlimit="10"
      stroke-dasharray="1.25 0.52"
    />
    <path
      d="M50.5293 33.6129C50.7318 33.5881 50.9342 33.5632 51.1367 33.5384"
      stroke={strokeColor}
      stroke-width="0.204"
      stroke-miterlimit="10"
    />
    <path
      d="M52.9066 34.6561L53.2958 35.1284"
      stroke={strokeColor}
      stroke-width="0.102"
      stroke-miterlimit="10"
    />
    <path
      d="M53.6239 35.5265L84.6983 73.2283"
      stroke={strokeColor}
      stroke-width="0.102"
      stroke-miterlimit="10"
      stroke-dasharray="1.24 0.52"
    />
    <path
      d="M84.8624 73.4274L85.2516 73.8996"
      stroke={strokeColor}
      stroke-width="0.102"
      stroke-miterlimit="10"
    />
    <path
      d="M40.1945 12.6418L40.7458 12.9076"
      stroke={strokeColor}
      stroke-width="0.102"
      stroke-miterlimit="10"
    />
    <path
      d="M41.1976 13.1253L60.94 22.6453"
      stroke={strokeColor}
      stroke-width="0.102"
      stroke-miterlimit="10"
      stroke-dasharray="1.2 0.5"
    />
    <path
      d="M61.1658 22.7542L61.7171 23.0201"
      stroke={strokeColor}
      stroke-width="0.102"
      stroke-miterlimit="10"
    />
    <path
      d="M12.7252 36.2742L13.2685 36.5558"
      stroke={strokeColor}
      stroke-width="0.102"
      stroke-miterlimit="10"
    />
    <path
      d="M13.5393 36.6961L14.3246 37.1033"
      stroke={strokeColor}
      stroke-width="0.102"
      stroke-miterlimit="10"
      stroke-dasharray="0.73 0.3"
    />
    <path
      d="M14.4599 37.1735L15.0033 37.4551"
      stroke={strokeColor}
      stroke-width="0.102"
      stroke-miterlimit="10"
    />
    <path
      d="M20.3806 78.0446L20.9497 77.8196"
      stroke={strokeColor}
      stroke-width="0.204"
      stroke-miterlimit="10"
    />
    <path
      d="M21.4297 77.6299L50.5674 66.1114"
      stroke={strokeColor}
      stroke-width="0.204"
      stroke-miterlimit="10"
      stroke-dasharray="1.24 0.52"
    />
    <path
      d="M50.8074 66.0166L51.3766 65.7916"
      stroke={strokeColor}
      stroke-width="0.204"
      stroke-miterlimit="10"
    />
    <path
      d="M60.9751 78.545L67.5415 88.5674"
      stroke={strokeColor}
      stroke-width="0.306"
      stroke-miterlimit="10"
    />
    <path
      d="M27.2996 66.7625L51.1316 65.0201"
      stroke={strokeColor}
      stroke-width="0.408"
      stroke-miterlimit="10"
    />
    <path
      d="M26.196 68.2422C26.8482 68.2422 27.3768 67.7135 27.3768 67.0614C27.3768 66.4093 26.8482 65.8807 26.196 65.8807C25.5439 65.8807 25.0153 66.4093 25.0153 67.0614C25.0153 67.7135 25.5439 68.2422 26.196 68.2422Z"
      stroke={strokeColor}
      stroke-width="0.306"
      stroke-miterlimit="10"
    />
    <path
      d="M25.0152 67.0614C21.3463 67.2642 17.6773 67.4669 14.0085 67.6696"
      stroke={strokeColor}
      stroke-width="0.306"
      stroke-miterlimit="10"
    />
    <path
      d="M27.1412 67.7848L34.802 71.7592"
      stroke={strokeColor}
      stroke-width="0.306"
      stroke-miterlimit="10"
    />
    <path
      d="M68.1702 74.4167C68.7746 74.4167 69.2645 73.9267 69.2645 73.3223C69.2645 72.7179 68.7746 72.228 68.1702 72.228C67.5658 72.228 67.0758 72.7179 67.0758 73.3223C67.0758 73.9267 67.5658 74.4167 68.1702 74.4167Z"
      fill={fillColor}
    />
    <path
      d="M25.6744 23.6357C26.1516 23.6357 26.5385 23.2489 26.5385 22.7717C26.5385 22.2945 26.1516 21.9077 25.6744 21.9077C25.1972 21.9077 24.8104 22.2945 24.8104 22.7717C24.8104 23.2489 25.1972 23.6357 25.6744 23.6357Z"
      fill={fillColor}
    />
    <path
      d="M74.404 42.6971C74.9448 42.6971 75.3832 42.2587 75.3832 41.7179C75.3832 41.1771 74.9448 40.7387 74.404 40.7387C73.8632 40.7387 73.4248 41.1771 73.4248 41.7179C73.4248 42.2587 73.8632 42.6971 74.404 42.6971Z"
      fill={fillColor}
    />
    <path
      d="M74.33 48.3038C75.2208 48.3038 75.9429 47.5817 75.9429 46.691C75.9429 45.8003 75.2208 45.0782 74.33 45.0782C73.4393 45.0782 72.7172 45.8003 72.7172 46.691C72.7172 47.5817 73.4393 48.3038 74.33 48.3038Z"
      fill={fillColor}
    />
  </svg>
{/snippet}

{#if clickable}
  <a href={homeUrl} class="inline-block cursor-pointer transition-opacity hover:opacity-80">
    {@render logoContent()}
  </a>
{:else}
  {@render logoContent()}
{/if}
