# Accessibility Implementation

## Standards

This website follows **WCAG 2.1 Level AA** guidelines.

## Keyboard Navigation

✅ All interactive elements accessible via keyboard:
- Tab to move forward
- Shift+Tab to move backward
- Enter to activate buttons/links
- Space on button elements
- Arrow keys for slider navigation
- Escape to close modals

✅ No keyboard traps
✅ Logical tab order
✅ Focus visible at all times

## Screen Reader Support

✅ **Semantic HTML:**
- Proper heading hierarchy (h1, h2, h3...)
- `<nav>` for navigation
- `<main>` for content
- `<section>` for major regions
- `<button>` for buttons (not divs)
- `<a>` for links (not spans)

✅ **ARIA Labels:**
- `aria-label` on icon buttons
- `aria-labelledby` for modal titles
- `aria-hidden="true"` on decorative elements
- `aria-live` for dynamic content
- `role="region"` on major sections
- `aria-label` on form fields

✅ **Alternative Text:**
- Meaningful `alt` on landmark images
- Empty `alt=""` on decorative images
- No generic descriptions like "image" or "photo"

## Focus Management

✅ **Modals:**
- Focus trapped inside modal while open
- Focus returns to trigger button on close
- Escape key closes modal

✅ **Slider:**
- Previous/next buttons keyboard accessible
- Arrow keys navigate slides
- Current slide announced

✅ **Forms:**
- Labels properly associated with inputs
- Error messages linked to fields with aria-describedby
- Required fields marked

## Color & Contrast

✅ Information not conveyed by color alone
✅ Contrast ratios:
- Normal text: 4.5:1 (AA standard)
- Large text: 3:1 (AA standard)
- UI components: 3:1 (AA standard)

Color palette tested for colorblind accessibility.

## Motion & Animation

✅ **Reduced Motion Support:**

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- All animations respect user preference
- Parallax disabled
- Scroll smoothing disabled
- JavaScript animations reduced
- Page remains fully functional without motion

✅ No auto-playing media
✅ No seizure-inducing flashing (no more than 3 flashes per second)

## Responsive Design

✅ **Mobile-First Approach:**
- Tested at 390×844 (small phone)
- Tested at 1920×1080 (large desktop)
- Touch targets minimum 44×44px
- Readable text at all sizes

✅ **Text Sizing:**
- Base font size 16px
- Scales with user zoom
- Supports up to 200% zoom without loss of function

## Forms

✅ **Input Fields:**
- Labels visible and associated
- Error messages clear and specific
- Success feedback provided
- Loading states indicated
- Autocomplete attributes used

✅ **Validation:**
- Client-side feedback immediate
- Server-side validation authoritative
- Errors prevent form submission
- Users can correct and resubmit

## Skip Links

✅ Skip to main content link:
- Visible on keyboard focus
- First focusable element
- Links to `<main id="content">`

## Language

✅ Page language declared: `<html lang="en">`
✅ Clear and simple language used throughout
✅ Abbreviations expanded on first use

## Testing

Manual accessibility testing completed on:
- Chrome with accessibility inspector
- Firefox with accessibility tree
- NVDA screen reader (Windows)
- Keyboard-only navigation

Automated checks:
- axe DevTools
- Lighthouse accessibility audit
- WAVE browser extension

## Known Limitations

- Image descriptions limited to landmark name + context (longer descriptions would clutter interface)
- Slider requires JavaScript (fallback provided)
- Some CSS animations may appear as static elements with reduced motion enabled

These limitations do not prevent page access or essential functionality.

## Accessibility Resources

Users can find:
- Skip link (first Tab press)
- Keyboard shortcuts in documentation
- High contrast mode support
- Screen reader documentation

## Continuous Improvement

Accessibility is ongoing:
- Regular user testing with assistive tech users
- Community feedback welcome
- Updates published on /accessibility

---

**This website is accessible to all users, regardless of ability.**
