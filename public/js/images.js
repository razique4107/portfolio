/**
 * Authoritative Centralized Image Configuration for Karachi Landmarks
 * Master Prompt Section 9, 72 & 73 compliance:
 * - High-resolution verified local assets
 * - Same-landmark only fallback policy
 * - Full attribution and licensing metadata
 */
export const KARACHI_IMAGES = {
  mazarHero: {
    slug: 'mazar-e-quaid',
    title: 'Mazar-e-Quaid',
    kicker: 'National Landmark',
    url: '/assets/images/mazar-hero.jpg',
    fallbackUrls: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Mazar-e-Quaid_Karachi.jpg/1920px-Mazar-e-Quaid_Karachi.jpg',
      'https://commons.wikimedia.org/wiki/Special:Redirect/file/Mazar-e-Quaid%20Karachi.jpg'
    ],
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Mazar-e-Quaid_Karachi.jpg',
    credit: 'Furqanlw / Wikimedia Commons',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    alt: 'Mazar-e-Quaid in Karachi viewed from the front'
  },
  mohattaPalace: {
    slug: 'mohatta-palace',
    title: 'Mohatta Palace',
    kicker: 'Clifton Heritage',
    url: '/assets/images/mohatta-palace.jpg',
    fallbackUrls: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Mohatta_Palace_as_viewed_from_the_front_with_the_inclusion_of_the_fountain.jpg/1920px-Mohatta_Palace_as_viewed_from_the_front_with_the_inclusion_of_the_fountain.jpg',
      'https://commons.wikimedia.org/wiki/Special:Redirect/file/Mohatta%20Palace%20as%20viewed%20from%20the%20front%20with%20the%20inclusion%20of%20the%20fountain.jpg'
    ],
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Mohatta_Palace_as_viewed_from_the_front_with_the_inclusion_of_the_fountain.jpg',
    credit: 'Wikimedia Commons',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    alt: 'Mohatta Palace viewed from the front with fountain in Karachi'
  },
  frereHall: {
    slug: 'frere-hall',
    title: 'Frere Hall',
    kicker: 'Colonial Heritage',
    url: '/assets/images/frere-hall.jpg',
    fallbackUrls: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Bautiful_view_of_Frere_Hall%2C%20Karachi%2C%20Pakistan.jpg/1920px-Bautiful_view_of_Frere_Hall%2C%20Karachi%2C%20Pakistan.jpg',
      'https://commons.wikimedia.org/wiki/Special:Redirect/file/Bautiful%20view%20of%20Frere%20Hall%2C%20Karachi%2C%20Pakistan.jpg'
    ],
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Beautiful_view_of_Frere_Hall,_Karachi,_Pakistan.jpg',
    credit: 'Wikimedia Commons',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    alt: 'Beautiful view of Frere Hall surrounded by gardens in Karachi'
  },
  empressMarket: {
    slug: 'empress-market',
    title: 'Empress Market',
    kicker: 'Historic Karachi',
    url: '/assets/images/empress-market.jpg',
    fallbackUrls: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/PK_Karachi_asv2020-02_img36_Empress_Market.jpg/1920px-PK_Karachi_asv2020-02_img36_Empress_Market.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/PK_Karachi_asv2020-02_img36_Empress_Market.jpg/3840px-PK_Karachi_asv2020-02_img36_Empress_Market.jpg'
    ],
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:PK_Karachi_asv2020-02_img36_Empress_Market.jpg',
    credit: 'A.Savin / Wikimedia Commons',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
    alt: 'Empress Market with distinctive clock tower facade in Saddar Karachi'
  },
  cliftonBeach: {
    slug: 'clifton-beach',
    title: 'Clifton Beach',
    kicker: 'Arabian Sea',
    url: '/assets/images/clifton-beach.jpg',
    fallbackUrls: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Clifton_Beach%2C%20Karachi_-_Pakistan.jpg/1920px-Clifton_Beach%2C%20Karachi_-_Pakistan.jpg',
      'https://commons.wikimedia.org/wiki/Special:Redirect/file/Clifton%20Beach%2C%20Karachi%20-%20Pakistan.jpg'
    ],
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Clifton_Beach,_Karachi_-_Pakistan.jpg',
    credit: 'Wikimedia Commons',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    alt: 'Clifton Beach where Karachi meets the Arabian Sea'
  }
};

/**
 * Handle image error and attempt same-landmark fallbacks
 */
export function setupImageFallbacks() {
  document.querySelectorAll('img[data-landmark]').forEach(img => {
    const key = img.dataset.landmark;
    const config = KARACHI_IMAGES[key];
    if (!config) return;

    let fallbackIndex = 0;
    img.addEventListener('error', () => {
      if (config.fallbackUrls && fallbackIndex < config.fallbackUrls.length) {
        console.warn(`Attempting fallback image ${fallbackIndex + 1} for ${config.title}`);
        img.src = config.fallbackUrls[fallbackIndex];
        fallbackIndex++;
      } else {
        console.warn(`All image sources failed for ${config.title}. Using neutral atmospheric state.`);
        img.classList.add('img-fallback-active');
      }
    });
  });
}
