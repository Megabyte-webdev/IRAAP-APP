# IRAAP Tour Fix

The tour implementation was updated to fix mobile navigation and resize issues.

## Mobile behavior

1. Welcome is a centered step.
2. Pressing Next opens the mobile sidebar.
3. The tour highlights the actual Archive navigation item.
4. Chat and Meetings remain inside the open sidebar.
5. Before Profile, the sidebar closes.
6. The Profile step is highlighted from the header.

The mobile hamburger is not a highlighted Driver.js step. This avoids the old behavior where the popover remained attached to or appeared underneath the menu button.

## Navigation

Next and Back are handled through one centralized Driver.js callback. This prevents multiple asynchronous step callbacks from competing with each other and fixes the behavior where a second click appeared to do nothing.

## Resize

The Driver.js instance is not destroyed and recreated on resize. The current tour is refreshed after the viewport changes. When crossing the mobile breakpoint, the sidebar is opened/closed as required and Driver.js is refreshed.

## CSS

The tour stylesheet no longer forces `top`, `left`, `right`, or `bottom`. Driver.js remains responsible for popover positioning. Mobile CSS only constrains width and typography.
