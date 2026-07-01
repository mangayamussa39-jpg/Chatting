function updateViewport() {
    // Manual override: if the user has toggled "Desktop View" on, always force 1200
    const forceDesktop = localStorage.getItem('force-desktop-view') === 'true';

    const screenW = window.screen.width;
    const screenH = window.screen.height;

    const minDim = Math.min(screenW, screenH);
    const maxDim = Math.max(screenW, screenH);
    const isLandscape = screenW > screenH;

    // Tablet = smaller screen dimension between 600 and 1023px (e.g. iPad = 768/810/834)
    const isTablet = minDim >= 600 && maxDim < 1024;
    // Desktop/PC = either dimension reaches 1024+ with no tablet-range smaller side
    const isDesktop = minDim >= 1024;

    let viewportContent;

    if (forceDesktop) {
        viewportContent = "width=1200";
    } else if (isDesktop) {
        // PC
        viewportContent = "width=1200";
    } else if (isTablet) {
        // Tablet: portrait = 600, landscape = 1200
        viewportContent = isLandscape ? "width=1200" : "width=600";
    } else {
        // Mobile phone: portrait = 500, landscape = 1200
        viewportContent = isLandscape ? "width=1200" : "width=500";
    }

    // Find or create the viewport tag
    let viewport = document.querySelector('meta[name="viewport"]');

    if (viewport) {
        // Only update if it actually needs to change (stops glitching)
        if (viewport.getAttribute('content') !== viewportContent) {
            viewport.setAttribute('content', viewportContent);
        }
    } else {
        viewport = document.createElement('meta');
        viewport.name = 'viewport';
        viewport.content = viewportContent;
        document.head.appendChild(viewport);
    }
}

// Lets you add a "Desktop View" button anywhere in the site.
// Example: <button onclick="toggleDesktopView()">Desktop View</button>
// The choice is remembered (localStorage) until the user toggles it off.
function toggleDesktopView() {
    const current = localStorage.getItem('force-desktop-view') === 'true';
    localStorage.setItem('force-desktop-view', (!current).toString());
    updateViewport();
}

// Run immediately so the browser knows the size before painting
updateViewport();

// Listeners for when the user resizes or rotates their phone
window.addEventListener('resize', updateViewport);
window.addEventListener('orientationchange', updateViewport);